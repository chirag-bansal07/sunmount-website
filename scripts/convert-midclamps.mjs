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
  { input:`${BASE}/Monorail 70mm assem MIDCLAMP.step`,   output:'mono-rail-70-mid-clamp.glb',      label:'MonoRail 70mm — Mid Clamp' },
  { input:`${BASE}/Monorail 100mm assem midclamp.step`,  output:'mono-rail-100-mid-clamp.glb',     label:'MonoRail 100mm — Mid Clamp' },
  { input:`${BASE}/Monorail 65mm assem midclamp.step`,   output:'mono-rail-65-mid-clamp.glb',      label:'MonoRail 65mm — Mid Clamp' },
  { input:`${BASE}/Monorail 100mm ULTRA midclamp.step`,  output:'mono-rail-100-pro-mid-clamp.glb', label:'MonoRail 100mm Pro — Mid Clamp' },
  { input:`${BASE}/Minirail 100mm assem midclamp.step`,  output:'mini-rail-100-mid-clamp.glb',     label:'MiniRail 100mm — Mid Clamp' },
  { input:`${BASE}/Minirail 70mm assem midclamp.step`,   output:'mini-rail-70-mid-clamp.glb',      label:'MiniRail 70mm — Mid Clamp' },
  { input:`${BASE}/Minirail short assem midclamp.step`,  output:'mini-rail-short-mid-clamp.glb',   label:'Short Rail — Mid Clamp' },
]

function padTo4(buf, padByte=0){const rem=buf.length%4;return rem===0?buf:Buffer.concat([buf,Buffer.alloc(4-rem,padByte)])}

function buildGLB(allPositions,allNormals,allIndices){
  const positions=new Float32Array(allPositions),normals=allNormals.length===allPositions.length?new Float32Array(allNormals):null,indices=new Uint32Array(allIndices)
  let minX=Infinity,minY=Infinity,minZ=Infinity,maxX=-Infinity,maxY=-Infinity,maxZ=-Infinity
  for(let i=0;i<positions.length;i+=3){if(positions[i]<minX)minX=positions[i];if(positions[i]>maxX)maxX=positions[i];if(positions[i+1]<minY)minY=positions[i+1];if(positions[i+1]>maxY)maxY=positions[i+1];if(positions[i+2]<minZ)minZ=positions[i+2];if(positions[i+2]>maxZ)maxZ=positions[i+2]}
  const idxBuf=Buffer.from(indices.buffer),posBuf=Buffer.from(positions.buffer),nrmBuf=normals?Buffer.from(normals.buffer):null
  const bv=[],ac=[];let bo=0
  bv.push({buffer:0,byteOffset:bo,byteLength:idxBuf.length});bo+=idxBuf.length;ac.push({bufferView:0,byteOffset:0,componentType:5125,count:indices.length,type:'SCALAR'})
  bv.push({buffer:0,byteOffset:bo,byteLength:posBuf.length});bo+=posBuf.length;ac.push({bufferView:1,byteOffset:0,componentType:5126,count:positions.length/3,type:'VEC3',min:[minX,minY,minZ],max:[maxX,maxY,maxZ]})
  const at={POSITION:1},ch=[idxBuf,posBuf]
  if(nrmBuf){bv.push({buffer:0,byteOffset:bo,byteLength:nrmBuf.length});bo+=nrmBuf.length;ac.push({bufferView:2,byteOffset:0,componentType:5126,count:normals.length/3,type:'VEC3'});at.NORMAL=2;ch.push(nrmBuf)}
  const binBuf=padTo4(Buffer.concat(ch)),gltf={asset:{version:'2.0'},scene:0,scenes:[{nodes:[0]}],nodes:[{mesh:0}],meshes:[{name:'asm',primitives:[{attributes:at,indices:0,material:0,mode:4}]}],materials:[{name:'ALU',pbrMetallicRoughness:{baseColorFactor:[0.784,0.824,0.871,1],metallicFactor:0.95,roughnessFactor:0.22}}],accessors:ac,bufferViews:bv,buffers:[{byteLength:binBuf.length}]}
  const jsonBuf=padTo4(Buffer.from(JSON.stringify(gltf),'utf8'),0x20),total=12+8+jsonBuf.length+8+binBuf.length,out=Buffer.alloc(total);let off=0
  out.writeUInt32LE(0x46546C67,off);off+=4;out.writeUInt32LE(2,off);off+=4;out.writeUInt32LE(total,off);off+=4
  out.writeUInt32LE(jsonBuf.length,off);off+=4;out.writeUInt32LE(0x4E4F534A,off);off+=4;jsonBuf.copy(out,off);off+=jsonBuf.length
  out.writeUInt32LE(binBuf.length,off);off+=4;out.writeUInt32LE(0x004E4942,off);off+=4;binBuf.copy(out,off)
  return out
}

async function main(){
  console.log('Initialising OCC…');const occ=await initOcct();console.log('Ready.\n')
  for(const{input,output,label}of FILES){
    process.stdout.write(`${label} … `)
    try{
      const res=occ.ReadStepFile(new Uint8Array(readFileSync(input)),null)
      if(!res.success||!res.meshes?.length){console.log('✗ Failed');continue}
      const ap=[],an=[],ai=[];let v=0
      for(const m of res.meshes){const p=m.attributes?.position?.array,n=m.attributes?.normal?.array,x=m.index?.array;if(!p||!x)continue;for(let i=0;i<p.length;i++)ap.push(p[i]*0.001);if(n)for(let i=0;i<n.length;i++)an.push(n[i]);for(let i=0;i<x.length;i++)ai.push(x[i]+v);v+=p.length/3}
      const glb=buildGLB(ap,an,ai);writeFileSync(join(OUTDIR,output),glb)
      console.log(`✓ ${(glb.length/1024).toFixed(0)} KB, ${res.meshes.length} meshes`)
    }catch(e){console.log(`✗ ${e.message}`)}
  }
  console.log('\nDone.')
}
main().catch(console.error)
