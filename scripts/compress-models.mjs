// One-off / repeatable: compress every GLB in public/models in place with
// EXT_meshopt_compression + quantization. drei's useGLTF decodes meshopt with
// the MeshoptDecoder bundled in three-stdlib (no CDN), so no runtime change.
// Usage: node scripts/compress-models.mjs   (originals are in git history)
import { readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'
import { dedup, weld, quantize, meshopt, prune } from '@gltf-transform/functions'
import { MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer'

const dir = path.resolve('public/models')
await MeshoptEncoder.ready
await MeshoptDecoder.ready
const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder })

let before = 0, after = 0
for (const file of (await readdir(dir)).filter(f => f.endsWith('.glb'))) {
  const p = path.join(dir, file)
  const b = (await stat(p)).size
  const doc = await io.read(p)
  if (doc.getRoot().listExtensionsUsed().some(e => e.extensionName === 'EXT_meshopt_compression')) {
    console.log(`  skip ${file} (already compressed)`)
    before += b; after += b
    continue
  }
  await doc.transform(dedup(), weld(), prune(), quantize(), meshopt({ encoder: MeshoptEncoder, level: 'high' }))
  await io.write(p, doc)
  const a = (await stat(p)).size
  before += b; after += a
  console.log(`  ${file.padEnd(40)} ${(b / 1024).toFixed(0).padStart(6)} KB → ${(a / 1024).toFixed(0).padStart(5)} KB`)
}
console.log(`total ${(before / 1048576).toFixed(1)} MB → ${(after / 1048576).toFixed(1)} MB`)
