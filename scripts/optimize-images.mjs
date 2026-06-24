import sharp from 'sharp'
import { statSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const PUB = join(dirname(fileURLToPath(import.meta.url)), '..', 'public')
const kb = p => (statSync(p).size / 1024).toFixed(0) + ' KB'

// Single-size conversions
const jobs = [
  { in: 'team-expo.jpg', out: 'team-expo.webp', width: 1400, quality: 78 },
  { in: 'logo.png',      out: 'logo.webp',      width: 600,  quality: 90 },
  // Trust badges (above-the-fold in navbar) — keep transparency
  { in: 'badge-makeindia.png', out: 'badge-makeindia.webp', width: 200, quality: 88 },
  { in: 'badge-iso.png',       out: 'badge-iso.webp',       width: 200, quality: 88 },
  { in: 'badge-tuv.png',       out: 'badge-tuv.webp',       width: 200, quality: 88 },
  { in: 'badge-msme.png',      out: 'badge-msme.webp',      width: 200, quality: 88 },
]

for (const j of jobs) {
  await sharp(join(PUB, j.in))
    .resize({ width: j.width, withoutEnlargement: true })
    .webp({ quality: j.quality })
    .toFile(join(PUB, j.out))
  console.log(`${j.in} (${kb(join(PUB, j.in))}) -> ${j.out} (${kb(join(PUB, j.out))})`)
}

// Responsive hero (LCP) — multiple widths so phones don't download the 1600px version
const heroWidths = [640, 960, 1280, 1600]
for (const w of heroWidths) {
  const out = `factory-${w}.webp`
  await sharp(join(PUB, 'factory.png'))
    .resize({ width: w, withoutEnlargement: true })
    .webp({ quality: w <= 960 ? 70 : 72 })
    .toFile(join(PUB, out))
  console.log(`factory.png -> ${out} (${kb(join(PUB, out))})`)
}

console.log('\nDone.')
