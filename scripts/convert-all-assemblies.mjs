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
  // ── Long Rail ──────────────────────────────────────────────────────────
  { input:`${BASE}/long rail lite end clamp assem.step`,             output:'long-rail-lite-end-clamp.glb',    label:'Long Rail Lite — End Clamp' },
  { input:`${BASE}/long rail lite mid clamp assem.step`,             output:'long-rail-lite-mid-clamp.glb',    label:'Long Rail Lite — Mid Clamp' },
  { input:`${BASE}/long rail pro end clamp assem.step`,              output:'long-rail-pro-end-clamp.glb',     label:'Long Rail Pro — End Clamp' },
  { input:`${BASE}/long rail pro mid clamp assem.step`,              output:'long-rail-pro-mid-clamp.glb',     label:'Long Rail Pro — Mid Clamp' },
  { input:`${BASE}/long rail ultra end clamp assem.step`,            output:'long-rail-ultra-end-clamp.glb',   label:'Long Rail Ultra — End Clamp' },
  { input:`${BASE}/long rail ultra mid clamp assem.step`,            output:'long-rail-ultra-mid-clamp.glb',   label:'Long Rail Ultra — Mid Clamp' },
  // ── Mono Rail ──────────────────────────────────────────────────────────
  { input:`${BASE}/Monorail 100mm assem Endclamp .step`,             output:'mono-rail-100-end-clamp.glb',     label:'MonoRail 100mm — End Clamp' },
  { input:`${BASE}/Monorail 100mm assem midclamp.step`,              output:'mono-rail-100-mid-clamp.glb',     label:'MonoRail 100mm — Mid Clamp' },
  { input:`${BASE}/MONO RAIL 100mm ULTRA assem endclamp_.step`,      output:'mono-rail-100-pro-end-clamp.glb', label:'MonoRail 100mm Pro — End Clamp' },
  { input:`${BASE}/MONORAIL 100MM ULTRA assem midclamp.step`,        output:'mono-rail-100-pro-mid-clamp.glb', label:'MonoRail 100mm Pro — Mid Clamp' },
  { input:`${BASE}/Mono Rail 70mm endclamp.step`,                    output:'mono-rail-70-end-clamp.glb',      label:'MonoRail 70mm — End Clamp' },
  { input:`${BASE}/Monorail 70mm assem MIDCLAMP.step`,               output:'mono-rail-70-mid-clamp.glb',      label:'MonoRail 70mm — Mid Clamp' },
  { input:`${BASE}/Mono rail 65mm endclamp.step`,                    output:'mono-rail-65-end-clamp.glb',      label:'MonoRail 65mm — End Clamp' },
  { input:`${BASE}/Monorail 65mm assem midclamp.step`,               output:'mono-rail-65-mid-clamp.glb',      label:'MonoRail 65mm — Mid Clamp' },
  // ── Mini Rail ──────────────────────────────────────────────────────────
  { input:`${BASE}/Mini rail 100mm end clamp.step`,                  output:'mini-rail-100-end-clamp.glb',     label:'MiniRail 100mm — End Clamp' },
  { input:`${BASE}/Minirail 100mm assem midclamp.step`,              output:'mini-rail-100-mid-clamp.glb',     label:'MiniRail 100mm — Mid Clamp' },
  { input:`${BASE}/Mini rail 70mm End clamp.step`,                   output:'mini-rail-70-end-clamp.glb',      label:'MiniRail 70mm — End Clamp' },
  { input:`${BASE}/Minirail 70mm assem midclamp.step`,               output:'mini-rail-70-mid-clamp.glb',      label:'MiniRail 70mm — Mid Clamp' },
  { input:`${BASE}/Minirail Short assem Endclamp.step`,              output:'mini-rail-short-end-clamp.glb',   label:'Short Rail — End Clamp' },
  { input:`${BASE}/Minirail short assem midclamp.step`,              output:'mini-rail-short-mid-clamp.glb',   label:'Short Rail — Mid Clamp' },
  // ── Standing Seam ──────────────────────────────────────────────────────
  { input:`${BASE}/Standing seam 55mm assem end clamp .step`,        output:'seam-55-end-clamp.glb',           label:'Seam 55mm — End Clamp' },
  { input:`${BASE}/Seam Clamp 55mm assem midclamp.step`,             output:'seam-55-mid-clamp.glb',           label:'Seam 55mm — Mid Clamp' },
  { input:`${BASE}/Seam Clamp 100mm assem endclamp.step`,            output:'seam-100-end-clamp.glb',          label:'Seam 100mm Pro — End Clamp' },
  { input:`${BASE}/Seam Clamp 100mm assem midclamp.step`,            output:'seam-100-mid-clamp.glb',          label:'Seam 100mm Pro — Mid Clamp' },
  { input:`${BASE}/Standing seam 70mm type 1 assem end clamp.step`,  output:'seam-70t1-end-clamp.glb',         label:'Seam 70mm T1 — End Clamp' },
  { input:`${BASE}/Seam Clamp 70mm type1 assem midclamp.step`,       output:'seam-70t1-mid-clamp.glb',         label:'Seam 70mm T1 — Mid Clamp' },
  { input:`${BASE}/Standing seam 70mm type2 assem endclamp.step`,    output:'seam-70t2-end-clamp.glb',         label:'Seam 70mm T2 — End Clamp' },
  { input:`${BASE}/Seam Clamp 70mm type2 assem midclamp.step`,       output:'seam-70t2-mid-clamp.glb',         label:'Seam 70mm T2 — Mid Clamp' },
]

function padTo4(buf,p=0){const r=buf.length%4;return r===0?buf:Buffer.concat([buf,Buffer.alloc(4-r,p)])}
function buildGLB(ap,an,ai){
  const pos=new Float32Array(ap),nrm=an.length===ap.length?new Float32Array(an):null,idx=new Uint32Array(ai)
  let x0=Infinity,y0=Infinity,z0=Infinity,x1=-Infinity,y1=-Infinity,z1=-Infinity
  for(let i=0;i<pos.length;i+=3){if(pos[i]<x0)x0=pos[i];if(pos[i]>x1)x1=pos[i];if(pos[i+1]<y0)y0=pos[i+1];if(pos[i+1]>y1)y1=pos[i+1];if(pos[i+2]<z0)z0=pos[i+2];if(pos[i+2]>z1)z1=pos[i+2]}
  const ib=Buffer.from(idx.buffer),pb=Buffer.from(pos.buffer),nb=nrm?Buffer.from(nrm.buffer):null
  const bv=[],ac=[];let bo=0
  bv.push({buffer:0,byteOffset:bo,byteLength:ib.length});bo+=ib.length;ac.push({bufferView:0,byteOffset:0,componentType:5125,count:idx.length,type:'SCALAR'})
  bv.push({buffer:0,byteOffset:bo,byteLength:pb.length});bo+=pb.length;ac.push({bufferView:1,byteOffset:0,componentType:5126,count:pos.length/3,type:'VEC3',min:[x0,y0,z0],max:[x1,y1,z1]})
  const at={POSITION:1},ch=[ib,pb]
  if(nb){bv.push({buffer:0,byteOffset:bo,byteLength:nb.length});bo+=nb.length;ac.push({bufferView:2,byteOffset:0,componentType:5126,count:nrm.length/3,type:'VEC3'});at.NORMAL=2;ch.push(nb)}
  const bin=padTo4(Buffer.concat(ch)),g={asset:{version:'2.0'},scene:0,scenes:[{nodes:[0]}],nodes:[{mesh:0}],meshes:[{name:'asm',primitives:[{attributes:at,indices:0,material:0,mode:4}]}],materials:[{name:'ALU',pbrMetallicRoughness:{baseColorFactor:[0.784,0.824,0.871,1],metallicFactor:0.95,roughnessFactor:0.22}}],accessors:ac,bufferViews:bv,buffers:[{byteLength:bin.length}]}
  const jb=padTo4(Buffer.from(JSON.stringify(g),'utf8'),0x20),tot=12+8+jb.length+8+bin.length,out=Buffer.alloc(tot);let o=0
  out.writeUInt32LE(0x46546C67,o);o+=4;out.writeUInt32LE(2,o);o+=4;out.writeUInt32LE(tot,o);o+=4
  out.writeUInt32LE(jb.length,o);o+=4;out.writeUInt32LE(0x4E4F534A,o);o+=4;jb.copy(out,o);o+=jb.length
  out.writeUInt32LE(bin.length,o);o+=4;out.writeUInt32LE(0x004E4942,o);o+=4;bin.copy(out,o)
  return out
}
async function main(){
  console.log('Initialising OCC…');const occ=await initOcct();console.log('Ready.\n')
  let ok=0,fail=0
  for(const{input,output,label}of FILES){
    process.stdout.write(`${label} … `)
    try{
      const res=occ.ReadStepFile(new Uint8Array(readFileSync(input)),null)
      if(!res.success||!res.meshes?.length){console.log('✗ Failed');fail++;continue}
      const ap=[],an=[],ai=[];let v=0
      for(const m of res.meshes){const p=m.attributes?.position?.array,n=m.attributes?.normal?.array,x=m.index?.array;if(!p||!x)continue;for(let i=0;i<p.length;i++)ap.push(p[i]*0.001);if(n)for(let i=0;i<n.length;i++)an.push(n[i]);for(let i=0;i<x.length;i++)ai.push(x[i]+v);v+=p.length/3}
      const glb=buildGLB(ap,an,ai);writeFileSync(join(OUTDIR,output),glb)
      console.log(`✓ ${(glb.length/1024).toFixed(0)} KB, ${res.meshes.length} meshes`);ok++
    }catch(e){console.log(`✗ ${e.message}`);fail++}
  }
  console.log(`\nDone. ${ok} succeeded, ${fail} failed.`)
}
main().catch(console.error)
