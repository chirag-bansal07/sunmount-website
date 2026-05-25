/**
 * Print the bounding-box centre and size of each GLB so we can
 * auto-centre and scale the models in Three.js.
 */
import { readFileSync } from 'fs'

const MODELS = ['mono-rail','mini-rail','long-rail','seam-clamp']

for (const name of MODELS) {
  const glb  = readFileSync(`public/models/${name}.glb`)
  // Find JSON chunk (offset 20, length = uint32 at offset 12)
  const jsonLen  = glb.readUInt32LE(12)
  const jsonStr  = glb.slice(20, 20 + jsonLen).toString('utf8').trimEnd()
  const json     = JSON.parse(jsonStr)

  // Get POSITION accessor min/max
  const posAcc = json.accessors.find(a => a.type === 'VEC3' && a.min)
  if (!posAcc) { console.log(`${name}: no position accessor`); continue }

  const [minX, minY, minZ] = posAcc.min
  const [maxX, maxY, maxZ] = posAcc.max
  const cx = (minX + maxX) / 2
  const cy = (minY + maxY) / 2
  const cz = (minZ + maxZ) / 2
  const sx = maxX - minX
  const sy = maxY - minY
  const sz = maxZ - minZ
  const maxDim = Math.max(sx, sy, sz)

  console.log(`\n${name}:`)
  console.log(`  size   : ${sx.toFixed(4)} × ${sy.toFixed(4)} × ${sz.toFixed(4)} m`)
  console.log(`  centre : ${cx.toFixed(4)}, ${cy.toFixed(4)}, ${cz.toFixed(4)}`)
  console.log(`  maxDim : ${maxDim.toFixed(4)} m`)
  console.log(`  → scale to fit 1m: ${(1/maxDim).toFixed(4)}`)
  console.log(`  → translate: ${(-cx).toFixed(4)}, ${(-cy).toFixed(4)}, ${(-cz).toFixed(4)}`)
}
