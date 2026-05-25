/**
 * Removes white / near-white backgrounds from accessory product images.
 * Uses pngjs — pure JS, no native binaries needed.
 * Pixels where R,G,B are all > 230 → fully transparent.
 * Pixels in the 210-230 band → partially transparent (anti-alias fringe).
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { PNG } from 'pngjs'

const __dir  = dirname(fileURLToPath(import.meta.url))
const ACCDIR = join(__dir, '..', 'public', 'accessories')

const files = readdirSync(ACCDIR).filter(f => f.endsWith('.png'))
console.log(`Processing ${files.length} PNG files…`)

for (const file of files) {
  const path = join(ACCDIR, file)
  const raw  = readFileSync(path)

  let png
  try {
    png = PNG.sync.read(raw)
  } catch (e) {
    console.error(`  ✗ ${file}: ${e.message}`)
    continue
  }

  const { width, height, data } = png

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (width * y + x) << 2
      const r = data[i], g = data[i + 1], b = data[i + 2]

      // Brightness of this pixel
      const bright = Math.min(r, g, b)   // darkest channel stays product colour

      if (bright > 230) {
        // Clearly white/near-white → fully transparent
        data[i + 3] = 0
      } else if (bright > 200) {
        // Fringe zone → partial transparency (anti-alias)
        const alpha = Math.round(255 * (1 - (bright - 200) / 30))
        data[i + 3] = Math.min(data[i + 3], alpha)
      }
    }
  }

  const out = PNG.sync.write(png)
  writeFileSync(path, out)
  console.log(`  ✓ ${file}  (${width}×${height})`)
}

console.log('\nDone — white backgrounds removed.')
