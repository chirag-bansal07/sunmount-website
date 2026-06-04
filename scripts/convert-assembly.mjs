/**
 * STEP → GLB converter for assembly models
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import initOcct from 'occt-import-js'

const __dir  = dirname(fileURLToPath(import.meta.url))
const ROOT   = join(__dir, '..')
const OUTDIR = join(ROOT, 'public', 'models')
if (!existsSync(OUTDIR)) mkdirSync(OUTDIR, { recursive: true })

const BASE = 'G:/My Drive/sunmount/Assembly.step'

const FILES = [
  { input: `${BASE}/long rail lite end clamp assem.step`, output: 'long-rail-lite-end-clamp.glb', label: 'Long Rail Lite — End Clamp Assembly' },
  { input: `${BASE}/long rail lite mid clamp assem.step`, output: 'long-rail-lite-mid-clamp.glb', label: 'Long Rail Lite — Mid Clamp Assembly' },
]

function padTo4(buf, padByte = 0) {
  const rem = buf.length % 4
  return rem === 0 ? buf : Buffer.concat([buf, Buffer.alloc(4 - rem, padByte)])
}

function buildGLB(allPositions, allNormals, allIndices) {
  const positions = new Float32Array(allPositions)
  const normals   = allNormals.length === allPositions.length ? new Float32Array(allNormals) : null
  const indices   = new Uint32Array(allIndices)

  let minX=Infinity,minY=Infinity,minZ=Infinity,maxX=-Infinity,maxY=-Infinity,maxZ=-Infinity
  for (let i=0;i<positions.length;i+=3){
    if(positions[i  ]<minX)minX=positions[i  ]; if(positions[i  ]>maxX)maxX=positions[i  ]
    if(positions[i+1]<minY)minY=positions[i+1]; if(positions[i+1]>maxY)maxY=positions[i+1]
    if(positions[i+2]<minZ)minZ=positions[i+2]; if(positions[i+2]>maxZ)maxZ=positions[i+2]
  }

  const idxBuf=Buffer.from(indices.buffer), posBuf=Buffer.from(positions.buffer)
  const nrmBuf=normals?Buffer.from(normals.buffer):null
  const bufferViews=[],accessors=[]
  let byteOffset=0

  bufferViews.push({buffer:0,byteOffset,byteLength:idxBuf.length}); byteOffset+=idxBuf.length
  accessors.push({bufferView:0,byteOffset:0,componentType:5125,count:indices.length,type:'SCALAR'})
  bufferViews.push({buffer:0,byteOffset,byteLength:posBuf.length}); byteOffset+=posBuf.length
  accessors.push({bufferView:1,byteOffset:0,componentType:5126,count:positions.length/3,type:'VEC3',min:[minX,minY,minZ],max:[maxX,maxY,maxZ]})

  const attribs={POSITION:1},chunks=[idxBuf,posBuf]
  if(nrmBuf){
    bufferViews.push({buffer:0,byteOffset,byteLength:nrmBuf.length}); byteOffset+=nrmBuf.length
    accessors.push({bufferView:2,byteOffset:0,componentType:5126,count:normals.length/3,type:'VEC3'})
    attribs.NORMAL=2; chunks.push(nrmBuf)
  }

  const binBuf=padTo4(Buffer.concat(chunks))
  const gltfObj={
    asset:{version:'2.0',generator:'sunmount-converter'},
    scene:0, scenes:[{nodes:[0]}], nodes:[{mesh:0}],
    meshes:[{name:'assembly',primitives:[{attributes:attribs,indices:0,material:0,mode:4}]}],
    materials:[{name:'Aluminium',pbrMetallicRoughness:{baseColorFactor:[0.784,0.824,0.871,1.0],metallicFactor:0.95,roughnessFactor:0.22}}],
    accessors, bufferViews, buffers:[{byteLength:binBuf.length}],
  }

  const jsonBuf=padTo4(Buffer.from(JSON.stringify(gltfObj),'utf8'),0x20)
  const total=12+8+jsonBuf.length+8+binBuf.length
  const out=Buffer.alloc(total)
  let off=0
  out.writeUInt32LE(0x46546C67,off);off+=4
  out.writeUInt32LE(2,off);off+=4
  out.writeUInt32LE(total,off);off+=4
  out.writeUInt32LE(jsonBuf.length,off);off+=4
  out.writeUInt32LE(0x4E4F534A,off);off+=4
  jsonBuf.copy(out,off);off+=jsonBuf.length
  out.writeUInt32LE(binBuf.length,off);off+=4
  out.writeUInt32LE(0x004E4942,off);off+=4
  binBuf.copy(out,off)
  return out
}

async function main() {
  console.log('Initialising Open CASCADE WASM…')
  const occ = await initOcct()
  console.log('OCC ready.\n')

  for (const { input, output, label } of FILES) {
    console.log(`Converting: ${label}`)
    try {
      const stepBytes = readFileSync(input)
      const result    = occ.ReadStepFile(new Uint8Array(stepBytes), null)
      if (!result.success || !result.meshes?.length) { console.error('  ✗ Failed'); continue }

      const allPos=[],allNrm=[],allIdx=[]
      let vertexOffset=0
      for (const mesh of result.meshes) {
        const pos=mesh.attributes?.position?.array, nrm=mesh.attributes?.normal?.array, idx=mesh.index?.array
        if (!pos||!idx) continue
        for(let i=0;i<pos.length;i++) allPos.push(pos[i]*0.001)
        if(nrm) for(let i=0;i<nrm.length;i++) allNrm.push(nrm[i])
        for(let i=0;i<idx.length;i++) allIdx.push(idx[i]+vertexOffset)
        vertexOffset+=pos.length/3
      }

      const glb=buildGLB(allPos,allNrm,allIdx)
      writeFileSync(join(OUTDIR,output),glb)
      console.log(`  ✓ ${output}  (${(glb.length/1024).toFixed(0)} KB, ${result.meshes.length} meshes, ${(allIdx.length/3).toFixed(0)} tris)`)
    } catch(err) {
      console.error(`  ✗ ${err.message}`)
    }
  }
  console.log('\nDone.')
}

main().catch(console.error)
