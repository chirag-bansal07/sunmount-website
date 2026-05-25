/**
 * STEP → GLB converter using occt-import-js
 * Reads SolidWorks STEP files, triangulates via Open CASCADE WASM,
 * writes binary glTF 2.0 (GLB) to public/models/.
 *
 * Usage:  node scripts/convert-step.mjs
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname }    from 'path'
import { fileURLToPath }    from 'url'
import initOcct             from 'occt-import-js'

const __dir  = dirname(fileURLToPath(import.meta.url))
const ROOT   = join(__dir, '..')
const OUTDIR = join(ROOT, 'public', 'models')
if (!existsSync(OUTDIR)) mkdirSync(OUTDIR, { recursive: true })

/* STEP sources — the key files the user provided */
const FILES = [
  {
    input : 'C:/Users/chira/Downloads/mono rail 100x300.STEP',
    output: 'mono-rail.glb',
    label : 'Mono Rail (100×300)',
    scale : 0.001,          // mm → m
  },
  {
    input : 'C:/Users/chira/Downloads/mini rail.STEP',
    output: 'mini-rail.glb',
    label : 'Mini Rail',
    scale : 0.001,
  },
  {
    input : 'C:/Users/chira/Downloads/long rail lite.STEP',
    output: 'long-rail.glb',
    label : 'Long Rail Lite',
    scale : 0.001,
  },
  {
    input : 'C:/Users/chira/Downloads/seam clamp assemble.STEP',
    output: 'seam-clamp.glb',
    label : 'Seam Clamp Assembly',
    scale : 0.001,
  },
]

/* ── GLB builder ─────────────────────────────────────────────── */

function padTo4 (buf, padByte = 0) {
  const rem = buf.length % 4
  return rem === 0 ? buf : Buffer.concat([buf, Buffer.alloc(4 - rem, padByte)])
}

function buildGLB (allPositions, allNormals, allIndices) {
  // Interleave all sub-meshes into single arrays
  const positions = new Float32Array(allPositions)
  const normals   = allNormals.length === allPositions.length
    ? new Float32Array(allNormals)
    : null
  const indices   = new Uint32Array(allIndices)

  let minX =  Infinity, minY =  Infinity, minZ =  Infinity
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity
  for (let i = 0; i < positions.length; i += 3) {
    if (positions[i  ] < minX) minX = positions[i  ]
    if (positions[i  ] > maxX) maxX = positions[i  ]
    if (positions[i+1] < minY) minY = positions[i+1]
    if (positions[i+1] > maxY) maxY = positions[i+1]
    if (positions[i+2] < minZ) minZ = positions[i+2]
    if (positions[i+2] > maxZ) maxZ = positions[i+2]
  }

  const idxBuf  = Buffer.from(indices.buffer)
  const posBuf  = Buffer.from(positions.buffer)
  const nrmBuf  = normals ? Buffer.from(normals.buffer) : null

  const bufferViews = []
  const accessors   = []
  let byteOffset = 0

  // index buffer view
  const idxView = bufferViews.length
  bufferViews.push({ buffer:0, byteOffset, byteLength: idxBuf.length })
  byteOffset += idxBuf.length
  accessors.push({ bufferView:idxView, byteOffset:0, componentType:5125, count:indices.length, type:'SCALAR' })

  // position buffer view
  const posView = bufferViews.length
  bufferViews.push({ buffer:0, byteOffset, byteLength: posBuf.length })
  byteOffset += posBuf.length
  accessors.push({ bufferView:posView, byteOffset:0, componentType:5126, count:positions.length/3, type:'VEC3', min:[minX,minY,minZ], max:[maxX,maxY,maxZ] })

  const attribs = { POSITION: 1 }
  const chunks  = [idxBuf, posBuf]

  // normal buffer view
  if (nrmBuf) {
    const nrmView = bufferViews.length
    bufferViews.push({ buffer:0, byteOffset, byteLength: nrmBuf.length })
    byteOffset += nrmBuf.length
    accessors.push({ bufferView:nrmView, byteOffset:0, componentType:5126, count:normals.length/3, type:'VEC3' })
    attribs.NORMAL = 2
    chunks.push(nrmBuf)
  }

  const binBuf  = padTo4(Buffer.concat(chunks))
  const gltfObj = {
    asset   : { version:'2.0', generator:'sunmount-step-converter' },
    scene   : 0,
    scenes  : [{ nodes:[0] }],
    nodes   : [{ mesh:0 }],
    meshes  : [{ name:'model', primitives:[{ attributes:attribs, indices:0, material:0, mode:4 }] }],
    materials: [{
      name:'Aluminium',
      pbrMetallicRoughness:{
        baseColorFactor:[0.784,0.824,0.871,1.0],
        metallicFactor :0.95,
        roughnessFactor:0.22,
      },
    }],
    accessors,
    bufferViews,
    buffers:[{ byteLength: binBuf.length }],
  }

  const jsonBuf  = padTo4(Buffer.from(JSON.stringify(gltfObj), 'utf8'), 0x20)
  const total    = 12 + 8 + jsonBuf.length + 8 + binBuf.length
  const out      = Buffer.alloc(total)
  let off = 0

  out.writeUInt32LE(0x46546C67, off); off += 4  // magic 'glTF'
  out.writeUInt32LE(2,          off); off += 4  // version
  out.writeUInt32LE(total,      off); off += 4

  out.writeUInt32LE(jsonBuf.length, off); off += 4
  out.writeUInt32LE(0x4E4F534A,     off); off += 4  // JSON
  jsonBuf.copy(out, off); off += jsonBuf.length

  out.writeUInt32LE(binBuf.length, off); off += 4
  out.writeUInt32LE(0x004E4942,    off); off += 4  // BIN
  binBuf.copy(out, off)

  return out
}

/* ── main ───────────────────────────────────────────────────── */

async function main () {
  console.log('Initialising Open CASCADE WASM…')
  const occ = await initOcct()
  console.log('OCC ready.\n')

  for (const { input, output, label, scale } of FILES) {
    console.log(`Converting: ${label}`)
    try {
      const stepBytes = readFileSync(input)
      const result    = occ.ReadStepFile(new Uint8Array(stepBytes), null)

      if (!result.success) { console.error('  ✗ ReadStepFile returned failure'); continue }
      if (!result.meshes?.length) { console.error('  ✗ No meshes in result'); continue }

      const allPos = []
      const allNrm = []
      const allIdx = []
      let vertexOffset = 0

      for (const mesh of result.meshes) {
        const pos = mesh.attributes?.position?.array
        const nrm = mesh.attributes?.normal?.array
        const idx = mesh.index?.array

        if (!pos || !idx) { console.log(`  (skipping mesh "${mesh.name}" — missing data)`); continue }

        // Scale: STEP is in mm, Three.js scene units are m
        for (let i = 0; i < pos.length; i++) allPos.push(pos[i] * scale)
        if (nrm) for (let i = 0; i < nrm.length; i++) allNrm.push(nrm[i])
        for (let i = 0; i < idx.length; i++) allIdx.push(idx[i] + vertexOffset)
        vertexOffset += pos.length / 3
      }

      if (!allPos.length || !allIdx.length) {
        console.error('  ✗ No geometry data extracted')
        continue
      }

      const glb     = buildGLB(allPos, allNrm, allIdx)
      const outPath = join(OUTDIR, output)
      writeFileSync(outPath, glb)
      console.log(`  ✓ ${output}  (${(glb.length/1024).toFixed(0)} KB, ${result.meshes.length} mesh(es), ${(allIdx.length/3).toFixed(0)} tris)`)
    } catch (err) {
      console.error(`  ✗ ${err.message}`)
      console.error(err.stack?.split('\n')[1])
    }
  }

  console.log('\nDone. Files saved to public/models/')
}

main().catch(console.error)
