/**
 * Rebuilds long-rail.glb as a short 400 mm section.
 *
 * The original GLB is a 4.8 m extrusion with vertices only at Z=0 and Z=4.8.
 * We keep all Z=0 vertices (near end cap), remap all Z=4.8 vertices to Z=0.4,
 * then rebuild every triangle using the remapped indices.
 * Result: a proper 400 mm rail segment with end caps at both ends.
 */
import { readFileSync, writeFileSync } from 'fs'

function padTo4 (buf, padByte = 0) {
  const rem = buf.length % 4
  return rem === 0 ? buf : Buffer.concat([buf, Buffer.alloc(4 - rem, padByte)])
}

function readBufView (bin, byteOffset, byteLength) {
  const copy = Buffer.alloc(byteLength)
  bin.copy(copy, 0, byteOffset, byteOffset + byteLength)
  return copy
}

// ── read GLB ──────────────────────────────────────────────────
const glb     = readFileSync('public/models/long-rail.glb')
const jsonLen = glb.readUInt32LE(12)
const json    = JSON.parse(glb.slice(20, 20 + jsonLen).toString('utf8').replace(/\0+$/, ''))
const binOff  = 20 + jsonLen + 8
const bin     = glb.slice(binOff)

const posAcc = json.accessors.find(a => a.type === 'VEC3' && Array.isArray(a.min))
const idxAcc = json.accessors.find(a => a.type === 'SCALAR' && a.componentType === 5125)

if (!posAcc || !idxAcc) {
  console.error('Could not find required accessors.')
  process.exit(1)
}

const posBV = json.bufferViews[posAcc.bufferView]
const idxBV = json.bufferViews[idxAcc.bufferView]

const posF32 = new Float32Array(readBufView(bin, posBV.byteOffset, posBV.byteLength).buffer)
const idxU32 = new Uint32Array(readBufView(bin, idxBV.byteOffset, idxBV.byteLength).buffer)

const VC       = posAcc.count
const LONG_Z   = posAcc.max[2]          // 4.8 m
const SHORT_Z  = 0.40                   // 400 mm target
const EPS      = 0.001

console.log(`Original: ${VC} verts, ${idxU32.length/3} tris, length=${LONG_Z.toFixed(3)} m`)

// ── assign new indices ─────────────────────────────────────────
// Z≈0   verts → kept as-is at Z=0
// Z≈4.8 verts → remapped to Z=SHORT_Z
const nearEnd = new Int32Array(VC).fill(-1)   // Z≈0    → new index
const farEnd  = new Int32Array(VC).fill(-1)   // Z≈4.8  → new index
const newPos  = []                            // flat [x,y,z, x,y,z, ...]

for (let i = 0; i < VC; i++) {
  const z = posF32[i * 3 + 2]
  if (z < EPS) {
    nearEnd[i] = newPos.length / 3
    newPos.push(posF32[i*3], posF32[i*3+1], 0)
  } else if (z > LONG_Z - EPS) {
    farEnd[i] = newPos.length / 3
    newPos.push(posF32[i*3], posF32[i*3+1], SHORT_Z)
  }
}

console.log(`Near-end verts: ${newPos.length/3} (from ${VC} original)`)

// ── rebuild triangles ──────────────────────────────────────────
function remap (i) {
  const z = posF32[i * 3 + 2]
  return z < EPS ? nearEnd[i] : farEnd[i]
}

const newIdx = []
for (let i = 0; i < idxU32.length; i += 3) {
  const a = idxU32[i], b = idxU32[i+1], c = idxU32[i+2]
  const na = remap(a), nb = remap(b), nc = remap(c)
  if (na < 0 || nb < 0 || nc < 0) continue   // skip degenerate
  newIdx.push(na, nb, nc)
}

console.log(`Rebuilt triangles: ${newIdx.length / 3}`)

// ── compute bounds ─────────────────────────────────────────────
let minX= Infinity, minY= Infinity, minZ= Infinity
let maxX=-Infinity, maxY=-Infinity, maxZ=-Infinity
for (let i = 0; i < newPos.length; i += 3) {
  if (newPos[i  ] < minX) minX = newPos[i  ]
  if (newPos[i  ] > maxX) maxX = newPos[i  ]
  if (newPos[i+1] < minY) minY = newPos[i+1]
  if (newPos[i+1] > maxY) maxY = newPos[i+1]
  if (newPos[i+2] < minZ) minZ = newPos[i+2]
  if (newPos[i+2] > maxZ) maxZ = newPos[i+2]
}
console.log(`New dims: ${(maxX-minX)*1000|0}×${(maxY-minY)*1000|0}×${(maxZ-minZ)*1000|0} mm`)

// ── build GLB ─────────────────────────────────────────────────
const idxBuf = padTo4(Buffer.from(new Uint32Array(newIdx).buffer))
const posBuf = padTo4(Buffer.from(new Float32Array(newPos).buffer))
const binBuf = Buffer.concat([idxBuf, posBuf])

const gltf = {
  asset: { version: '2.0', generator: 'sunmount-rebuild' },
  scene: 0, scenes: [{ nodes: [0] }], nodes: [{ mesh: 0 }],
  meshes: [{ name: 'long-rail', primitives: [{
    attributes: { POSITION: 1 }, indices: 0, material: 0, mode: 4,
  }]}],
  materials: [{ name: 'Aluminium', pbrMetallicRoughness: {
    baseColorFactor: [0.784, 0.824, 0.871, 1.0], metallicFactor: 0.95, roughnessFactor: 0.22,
  }}],
  accessors: [
    { bufferView: 0, byteOffset: 0, componentType: 5125, count: newIdx.length, type: 'SCALAR' },
    { bufferView: 1, byteOffset: 0, componentType: 5126, count: newPos.length / 3, type: 'VEC3',
      min: [minX, minY, minZ], max: [maxX, maxY, maxZ] },
  ],
  bufferViews: [
    { buffer: 0, byteOffset: 0,             byteLength: idxBuf.length },
    { buffer: 0, byteOffset: idxBuf.length, byteLength: posBuf.length },
  ],
  buffers: [{ byteLength: binBuf.length }],
}

const jBuf = padTo4(Buffer.from(JSON.stringify(gltf), 'utf8'), 0x20)
const tot  = 12 + 8 + jBuf.length + 8 + binBuf.length
const out  = Buffer.alloc(tot)
let off = 0
out.writeUInt32LE(0x46546C67, off); off += 4
out.writeUInt32LE(2,          off); off += 4
out.writeUInt32LE(tot,        off); off += 4
out.writeUInt32LE(jBuf.length,    off); off += 4
out.writeUInt32LE(0x4E4F534A,    off); off += 4
jBuf.copy(out, off); off += jBuf.length
out.writeUInt32LE(binBuf.length,  off); off += 4
out.writeUInt32LE(0x004E4942,    off); off += 4
binBuf.copy(out, off)

writeFileSync('public/models/long-rail.glb', out)
console.log(`✓ long-rail.glb rebuilt (${(out.length/1024).toFixed(0)} KB, ${newIdx.length/3} tris, ${SHORT_Z*1000|0}mm section)`)
