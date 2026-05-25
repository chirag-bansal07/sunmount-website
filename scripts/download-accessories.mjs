/**
 * Downloads accessory product images from sunmount.in to public/accessories/
 */
import { createWriteStream, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import https from 'https'

const __dir  = dirname(fileURLToPath(import.meta.url))
const OUTDIR = join(__dir, '..', 'public', 'accessories')
if (!existsSync(OUTDIR)) mkdirSync(OUTDIR, { recursive: true })

const IMAGES = [
  { name: 'u-clamp.png',       url: 'https://www.sunmount.in/wp-content/uploads/2021/08/1P-min.png'  },
  { name: 'z-clamp.png',       url: 'https://www.sunmount.in/wp-content/uploads/2021/08/2P-min.png'  },
  { name: 'l-clamp.png',       url: 'https://www.sunmount.in/wp-content/uploads/2021/08/4P-min.png'  },
  { name: 'rail-nut.png',      url: 'https://www.sunmount.in/wp-content/uploads/2021/08/3P-min.png'  },
  { name: 'flange-nut.png',    url: 'https://www.sunmount.in/wp-content/uploads/2021/08/8P-min.png'  },
  { name: 'spring-washer.png', url: 'https://www.sunmount.in/wp-content/uploads/2021/08/7P-min.png'  },
  { name: 'allen-bolt.png',    url: 'https://www.sunmount.in/wp-content/uploads/2021/08/5P-min.png'  },
  { name: 't-bolt.png',        url: 'https://www.sunmount.in/wp-content/uploads/2021/08/6P-min.png'  },
  { name: 'hex-bolt.png',      url: 'https://www.sunmount.in/wp-content/uploads/2021/08/11P-min.png' },
  { name: 'sds-screw.png',     url: 'https://www.sunmount.in/wp-content/uploads/2021/08/12P-min.png' },
  { name: 'rivet.png',         url: 'https://www.sunmount.in/wp-content/uploads/2021/08/10P-min.png' },
  { name: 'epdm-tape.png',     url: 'https://www.sunmount.in/wp-content/uploads/2021/08/9P-min.png'  },
]

function download (url, dest) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest)
    https.get(url, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close()
        download(res.headers.location, dest).then(resolve).catch(reject)
        return
      }
      if (res.statusCode !== 200) { reject(new Error(`HTTP ${res.statusCode}`)); return }
      res.pipe(file)
      file.on('finish', () => file.close(resolve))
    }).on('error', err => { file.close(); reject(err) })
  })
}

for (const { name, url } of IMAGES) {
  const dest = join(OUTDIR, name)
  try {
    await download(url, dest)
    console.log(`  ✓ ${name}`)
  } catch (err) {
    console.error(`  ✗ ${name}: ${err.message}`)
  }
}
console.log('\nDone. Images saved to public/accessories/')
