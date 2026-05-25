/**
 * Clips the long-rail GLB to a 400 mm centre section.
 * Reads  public/models/long-rail.glb
 * Writes public/models/long-rail.glb  (overwrites with clipped version)
 */
import { readFileSync, writeFileSync } from 'fs'

function padTo4 (buf, padByte = 0) {
  const rem = buf.length % 4
  return rem === 0 ? buf : Buffer.concat([buf, Buffer.alloc(4 - rem, padByte)])
}

/** Safely copy a slice of a Buffer into a new aligned ArrayBuffer */
function readBufferView (bin, byteOffset, byteLength) {
  const copy = Buffer.alloc(byteLength)
  bin.copy(copy, 0, byteOffset, byteOffset + byteLength)
  return copy
}

// ── read GLB ──────────────────────────────────────────────────
const glb     = readFileSync('public/models/long-rail.glb')
const jsonLen = glb.readUInt32LE(12)
const json    = JSON.parse(glb.slice(20, 20 + jsonLen).toString('utf8').replace(/\0+$/, ''))
// Binary chunk starts after: 12-byte header + 8-byte JSON chunk header + jsonLen
const binOffset = 20 + jsonLen + 8
const bin       = glb.slice(binOffset)

// ── find accessors ─────────────────────────────────────────────
const posAcc = json.accessors.find(a => a.type === 'VEC3' && Array.isArray(a.min))
const idxAcc = json.accessors.find(a => a.type === 'SCALAR' && a.componentType === 5125)

if (!posAcc || !idxAcc) {
  console.error('Could not find required accessors. Accessors:', JSON.stringify(json.accessors, null, 2))
  process.exit(1)
}

const posBV = json.bufferViews[posAcc.bufferView]
const idxBV = json.bufferViews[idxAcc.bufferView]

// ── read typed arrays (copy-safe) ──────────────────────────────
const posCopy  = readBufferView(bin, posBV.byteOffset, posBV.byteLength)
const idxCopy  = readBufferView(bin, idxBV.byteOffset, idxBV.byteLength)
const posF32   = new Float32Array(posCopy.buffer)   // vertex positions
const idxU32   = new Uint32Array(idxCopy.buffer)    // triangle indices

console.log(`Vertices: ${posAcc.count}  Triangles: ${idxAcc.count / 3}`)

// ── Z centre & clip window ─────────────────────────────────────
const [minZ, maxZ] = [posAcc.min[2], posAcc.max[2]]
const midZ = (minZ + maxZ) / 2
const HALF = 0.20   // ±200 mm = 400 mm section

// Print a few sample Z values to verify
const sampleZ = []
for (let i = 0; i < Math.min(10, posAcc.count); i++) sampleZ.push(posF32[i*3+2].toFixed(4))
console.log(`Sample Z values: ${sampleZ.join(', ')}`)
console.log(`Z range: ${minZ.toFixed(4)} → ${maxZ.toFixed(4)} m  (centre ${midZ.toFixed(4)})`)
console.log(`Clip window: [${(midZ - HALF).toFixed(3)}, ${(midZ + HALF).toFixed(3)}]`)

// ── classify vertices ──────────────────────────────────────────
const inClip = new Uint8Array(posAcc.count)
for (let vi = 0; vi < posAcc.count; vi++) {
  const z = posF32[vi * 3 + 2]
  inClip[vi] = (z >= midZ - HALF && z <= midZ + HALF) ? 1 : 0
}
const inCount = inClip.reduce((s, v) => s + v, 0)
console.log(`Vertices in clip: ${inCount} / ${posAcc.count}`)

// ── filter triangles ───────────────────────────────────────────
const keptIdx = []
for (let i = 0; i < idxU32.length; i += 3) {
  const a = idxU32[i], b = idxU32[i+1], c = idxU32[i+2]
  if (inClip[a] && inClip[b] && inClip[c]) keptIdx.push(a, b, c)
}
console.log(`Triangles kept: ${keptIdx.length / 3}`)

if (keptIdx.length === 0) {
  // Fallback: keep ALL vertices (no clip), just re-export as-is
  console.warn('No triangles in clip window – writing original as-is')
  process.exit(0)
}

// ── remap to compact vertex list ───────────────────────────────
const oldToNew = new Int32Array(posAcc.count).fill(-1)
const newPos   = []
let newVC = 0
for (const oi of keptIdx) {
  if (oldToNew[oi] < 0) {
    oldToNew[oi] = newVC++
    newPos.push(posF32[oi*3], posF32[oi*3+1], posF32[oi*3+2])
  }
}
const remapped = keptIdx.map(oi => oldToNew[oi])

// ── new bounds ─────────────────────────────────────────────────
let nMinX= Infinity, nMinY= Infinity, nMinZ= Infinity
let nMaxX=-Infinity, nMaxY=-Infinity, nMaxZ=-Infinity
for (let i = 0; i < newPos.length; i += 3) {
  if (newPos[i  ] < nMinX) nMinX=newPos[i  ]
  if (newPos[i  ] > nMaxX) nMaxX=newPos[i  ]
  if (newPos[i+1] < nMinY) nMinY=newPos[i+1]
  if (newPos[i+1] > nMaxY) nMaxY=newPos[i+1]
  if (newPos[i+2] < nMinZ) nMinZ=newPos[i+2]
  if (newPos[i+2] > nMaxZ) nMaxZ=newPos[i+2]
}
console.log(`New dims: ${(nMaxX-nMinX).toFixed(4)} × ${(nMaxY-nMinY).toFixed(4)} × ${(nMaxZ-nMinZ).toFixed(4)} m`)

// ── build new GLB ──────────────────────────────────────────────
const idxBuf = padTo4(Buffer.from(new Uint32Array(remapped).buffer))
const posBuf = padTo4(Buffer.from(new Float32Array(newPos).buffer))
const binBuf = Buffer.concat([idxBuf, posBuf])

const gltf = {
  asset: { version:'2.0', generator:'sunmount-clip' },
  scene:0, scenes:[{nodes:[0]}], nodes:[{mesh:0}],
  meshes:[{ name:'long-rail', primitives:[{
    attributes:{POSITION:1}, indices:0, material:0, mode:4
  }]}],
  materials:[{ name:'Aluminium', pbrMetallicRoughness:{
    baseColorFactor:[0.784,0.824,0.871,1.0], metallicFactor:0.95, roughnessFactor:0.22
  }}],
  accessors:[
    { bufferView:0, byteOffset:0, componentType:5125, count:remapped.length, type:'SCALAR' },
    { bufferView:1, byteOffset:0, componentType:5126, count:newPos.length/3, type:'VEC3',
      min:[nMinX,nMinY,nMinZ], max:[nMaxX,nMaxY,nMaxZ] },
  ],
  bufferViews:[
    { buffer:0, byteOffset:0,             byteLength:idxBuf.length },
    { buffer:0, byteOffset:idxBuf.length, byteLength:posBuf.length },
  ],
  buffers:[{ byteLength:binBuf.length }],
}

const jBuf = padTo4(Buffer.from(JSON.stringify(gltf), 'utf8'), 0x20)
const tot  = 12 + 8 + jBuf.length + 8 + binBuf.length
const out  = Buffer.alloc(tot)
let off = 0
out.writeUInt32LE(0x46546C67,off);off+=4
out.writeUInt32LE(2,         off);off+=4
out.writeUInt32LE(tot,       off);off+=4
out.writeUInt32LE(jBuf.length,   off);off+=4
out.writeUInt32LE(0x4E4F534A,   off);off+=4
jBuf.copy(out,off);off+=jBuf.length
out.writeUInt32LE(binBuf.length, off);off+=4
out.writeUInt32LE(0x004E4942,   off);off+=4
binBuf.copy(out,off)

writeFileSync('public/models/long-rail.glb', out)
console.log(`✓ long-rail.glb clipped  (${(out.length/1024).toFixed(0)} KB, ${remapped.length/3} tris)`)
