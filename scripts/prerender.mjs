// Post-build step: renders every route in src/seo/routes.js to static HTML so
// search engines and link previews get real content and per-page tags instead
// of an empty <div id="root">. Also writes 404.html and sitemap.xml.
//
// Runs after `vite build` (client → dist/) and
// `vite build --ssr src/entry-server.jsx --outDir dist-ssr`.
import { readFile, writeFile, rm, mkdir } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const ssrDir = path.join(root, 'dist-ssr')

const { render, ROUTES, NOT_FOUND, SITE_URL, DEFAULT_OG_IMAGE } =
  await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href)

let template = await readFile(path.join(dist, 'index.html'), 'utf8')

// Inline the (tiny) app stylesheet so it no longer blocks first paint.
const cssLink = template.match(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/)
if (cssLink) {
  const css = await readFile(path.join(dist, cssLink[1]), 'utf8')
  if (css.length < 20000) template = template.replace(cssLink[0], () => `<style>${css}</style>`)
}
const SEO_BLOCK = /<!-- seo:start -->[\s\S]*?<!-- seo:end -->/
if (!SEO_BLOCK.test(template) || !template.includes('<div id="root"></div>')) {
  throw new Error('prerender: index.html is missing the seo markers or the empty #root')
}

const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function headTags(meta) {
  const url = SITE_URL + meta.path
  const image = SITE_URL + (meta.ogImage || DEFAULT_OG_IMAGE)
  const tags = [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" />`,
    `<meta name="robots" content="${meta.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'}" />`,
    meta.noindex ? '' : `<link rel="canonical" href="${url}" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    meta.noindex ? '' : `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta name="twitter:title" content="${esc(meta.title)}" />`,
    `<meta name="twitter:description" content="${esc(meta.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    // `<` is escaped so page text can never close the script tag early.
    ...(meta.jsonLd || []).map(d => `<script type="application/ld+json">${JSON.stringify(d).replace(/</g, '\\u003c')}</script>`),
  ]
  return `<!-- seo:start -->\n    ${tags.filter(Boolean).join('\n    ')}\n    <!-- seo:end -->`
}

async function writePage(meta, file) {
  const body = await render(meta.path)
  const html = template
    .replace(SEO_BLOCK, () => headTags(meta))
    .replace('<div id="root"></div>', () => `<div id="root">${body}</div>`)
  await mkdir(path.dirname(path.join(dist, file)), { recursive: true })
  await writeFile(path.join(dist, file), html)
  console.log(`  prerendered ${meta.path.padEnd(12)} → dist/${file}`)
}

for (const route of ROUTES) {
  await writePage(route, route.path === '/' ? 'index.html' : `${route.path.slice(1)}.html`)
}
await writePage(NOT_FOUND, '404.html')

const lastmod = new Date().toISOString().slice(0, 10)
const urls = ROUTES.map(r => `  <url>
    <loc>${SITE_URL}${r.path}</loc>
    <lastmod>${r.lastmod || lastmod}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`)
urls.push(`  <url>
    <loc>${SITE_URL}/catalogue.pdf</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>0.5</priority>
  </url>`)
await writeFile(path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`)
console.log(`  wrote sitemap.xml (${urls.length} URLs)`)

await rm(ssrDir, { recursive: true, force: true })
