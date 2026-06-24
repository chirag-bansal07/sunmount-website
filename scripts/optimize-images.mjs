import sharp from 'sharp'
import { statSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const PUB = join(dirname(fileURLToPath(import.meta.url)), '..', 'public')
const kb = p => (statSync(p).size / 1024).toFixed(0) + ' KB'

const jobs = [
  // Hero LCP image — full-bleed background. WebP at 1920px wide is plenty.
  { in: 'factory.png',   out: 'factory.webp',    width: 1920, quality: 80 },
  // Team section image (below fold) — was 1.25 MB. Cap width + WebP.
  { in: 'team-expo.jpg', out: 'team-expo.webp',  width: 1400, quality: 78 },
  // Logo (above-fold in navbar) — keep PNG transparency but shrink via WebP copy.
  { in: 'logo.png',      out: 'logo.webp',       width: 600,  quality: 90 },
]

for (const j of jobs) {
  const src = join(PUB, j.in)
  const dst = join(PUB, j.out)
  const before = kb(src)
  await sharp(src)
    .resize({ width: j.width, withoutEnlargement: true })
    .webp({ quality: j.quality })
    .toFile(dst)
  console.log(`${j.in} (${before})  ->  ${j.out} (${kb(dst)})`)
}
console.log('\nDone.')
