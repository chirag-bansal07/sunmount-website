// Post-build step (production only): tells IndexNow-enabled search engines
// (Bing, Yandex, Naver, Seznam, Yep) which URLs exist, so they recrawl right
// after a deploy instead of waiting. Bing's index also feeds Copilot, ChatGPT
// search and DuckDuckGo. Never fails the build.
// The key is public by design: it must be served at /<key>.txt (see public/).
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const KEY = '7417bcf3567895c0256484034aef6378'
const HOST = 'www.sunmount.in'

if (process.env.VERCEL_ENV !== 'production') {
  console.log('indexnow: skipped (VERCEL_ENV is not production)')
  process.exit(0)
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const xml = await readFile(path.join(root, 'dist', 'sitemap.xml'), 'utf8')
const urlList = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1])

try {
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
    signal: AbortSignal.timeout(15000),
  })
  console.log(`indexnow: HTTP ${res.status} for ${urlList.length} URLs`)
} catch (e) {
  console.warn('indexnow: submission failed (build continues):', e.message)
}
