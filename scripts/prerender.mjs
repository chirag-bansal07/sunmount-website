// Post-build step: renders every route in src/seo/routes.js to static HTML so
// search engines and link previews get real content and per-page tags instead
// of an empty <div id="root">. Also writes 404.html, sitemap.xml, a Markdown
// twin of every content page (/products/<slug>.md, /blog/<slug>.md, /faq.md)
// for AI agents, plus llms.txt and llms-full.txt generated from the same data.
//
// Runs after `vite build` (client → dist/) and
// `vite build --ssr src/entry-server.jsx --outDir dist-ssr`.
import { readFile, writeFile, rm, mkdir } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const ssrDir = path.join(root, 'dist-ssr')

const { render, ROUTES, NOT_FOUND, SITE_URL, DEFAULT_OG_IMAGE, PRODUCTS, PRODUCT_INDEX, POSTS, FAQ, productFaq } =
  await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href)

let template = await readFile(path.join(dist, 'index.html'), 'utf8')
const manifest = JSON.parse(await readFile(path.join(dist, '.vite', 'manifest.json'), 'utf8'))

// Route → lazily loaded page module (mirrors the Routes in src/App.jsx).
function pageSource(p) {
  if (p === '/blog') return 'src/pages/Blog.jsx'
  if (p.startsWith('/blog/')) return 'src/pages/BlogPost.jsx'
  if (p === '/faq') return 'src/pages/Faq.jsx'
  if (p === '/contact') return 'src/pages/Contact.jsx'
  if (p === '/products') return 'src/pages/Products.jsx'
  if (p.startsWith('/products/')) return 'src/pages/ProductDetail.jsx'
  if (p === '/careers') return 'src/pages/Careers.jsx'
  if (p === '/404') return 'src/pages/NotFound.jsx'
  return null
}
// The page's chunk plus the shared chunks it statically imports, so the
// browser fetches them alongside the main bundle instead of after it.
function modulePreloads(p) {
  const src = pageSource(p)
  if (!src || !manifest[src]) return []
  const files = new Set()
  const walk = key => {
    const e = manifest[key]
    if (!e || files.has(e.file) || e.isEntry) return
    files.add(e.file)
    for (const i of e.imports || []) walk(i)
  }
  walk(src)
  return [...files].map(f => `<link rel="modulepreload" crossorigin href="/${f}" />`)
}

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
const buildDate = new Date().toISOString().slice(0, 10)
const ORG_REF = { '@id': SITE_URL + '/#organization' }
const routeByPath = p => ROUTES.find(r => r.path === p)

/* ── Build-time structured data ──────────────────────────────────────────
   Product / ProductGroup for every system, built from the full catalogue.
   Lives here (not in routes.js) so the browser bundle never carries it. */
function productJsonLd(product, meta) {
  const url = `${SITE_URL}/products/${product.slug}`
  const specValue = (v, label) => v.specs.find(s => s.label.toLowerCase().includes(label))?.value
  const props = v => v.specs.map(s => ({ '@type': 'PropertyValue', name: s.label, value: s.value }))
  const variant = v => ({
    '@type': 'Product',
    name: v.name,
    sku: v.id,
    description: v.desc,
    url: `${url}#${v.id}`,
    additionalProperty: props(v),
  })
  const multi = product.variants.length > 1
  const first = product.variants[0]
  const base = {
    '@context': 'https://schema.org',
    '@type': multi ? 'ProductGroup' : 'Product',
    '@id': url + '#product',
    name: meta.h1,
    description: meta.metaDescription,
    url,
    image: SITE_URL + DEFAULT_OG_IMAGE,
    brand: { '@type': 'Brand', name: 'SunMount' },
    manufacturer: ORG_REF,
    countryOfOrigin: 'IN',
    category: 'Solar PV mounting structure',
    audience: { '@type': 'BusinessAudience', name: 'EPC contractors, solar installers and building owners' },
  }
  const material = specValue(first, 'material')
  if (material) base.material = material
  if (multi) {
    base.productGroupID = product.slug
    base.hasVariant = product.variants.map(variant)
  } else {
    base.sku = first.id
    base.additionalProperty = props(first)
  }
  return base
}

/* ── Markdown twins ───────────────────────────────────────────────────────
   Plain-text versions of the content pages for AI agents and answer engines
   that prefer Markdown over rendered HTML. Linked from each page's <head>
   (rel="alternate" type="text/markdown") and from llms.txt. */
const MD_FILES = new Map() // route path → dist-relative .md file

const mdCell = c => String(c).replace(/\|/g, '\\|').replace(/\n/g, ' ')
const mdTable = (head, rows) => [
  `| ${head.map(mdCell).join(' | ')} |`,
  `| ${head.map(() => '---').join(' | ')} |`,
  ...rows.map(r => `| ${r.map(mdCell).join(' | ')} |`),
].join('\n')

const CONTACT_LINES = [
  'Manufacturer: Sunmount Solutions Private Limited, Surya Koti, Bajekan-Sirsa Main Road, Sirsa, Haryana 125055, India  ',
  `Quote: ${SITE_URL}/contact · sales@sunmount.in · +91 78379 99222  `,
  `Catalogue (PDF): ${SITE_URL}/catalogue.pdf`,
]

function productMd(product, meta) {
  const url = `${SITE_URL}/products/${product.slug}`
  const lines = [`# ${meta.h1}`, '', `> ${meta.metaDescription}`, '', `Source: ${url}  `, ...CONTACT_LINES, '', product.systemDesc, '']
  for (const v of product.variants) {
    lines.push(`## ${v.name}`, '', `*${v.subtitle}*`, '', `**${v.tagline}**`, '', v.desc, '', '### Highlights', '', ...v.highlights.map(h => `- ${h}`), '')
    if (v.applications?.length) lines.push(`**Applications:** ${v.applications.join(', ')}`, '')
    lines.push('### Specifications', '', mdTable(['Specification', 'Value'], v.specs.map(s => [s.label, s.value])), '')
  }
  if (product.variants.length > 1) {
    const labels = [...new Set(product.variants.flatMap(v => v.specs.map(s => s.label)))]
    lines.push(`## Compare ${product.name} variants`, '',
      mdTable(['Specification', ...product.variants.map(v => v.name)],
        labels.map(l => [l, ...product.variants.map(v => v.specs.find(s => s.label === l)?.value ?? '—')])), '')
  }
  const faq = productFaq(product)
  if (faq.length) {
    lines.push(`## ${product.name} FAQ`, '')
    for (const f of faq) lines.push(`### ${f.q}`, '', f.a, '')
  }
  return lines.join('\n')
}

function postMd(post) {
  const url = `${SITE_URL}/blog/${post.slug}`
  const updated = post.updated && post.updated !== post.date ? ` · Updated: ${post.updated}` : ''
  const lines = [`# ${post.title}`, '', `> ${post.description}`, '',
    `Published: ${post.date}${updated}  `, 'Author: SunMount engineering team, Sunmount Solutions Private Limited  ', `Source: ${url}`, '']
  if (post.summary) lines.push(`**In short:** ${post.summary}`, '')
  lines.push(post.intro, '')
  for (const s of post.sections) {
    lines.push(`## ${s.h2}`, '')
    for (const t of s.p || []) lines.push(t, '')
    if (s.list) lines.push(...s.list.map(t => `- ${t}`), '')
    if (s.table) lines.push(mdTable(s.table.head, s.table.rows), '')
  }
  return lines.join('\n')
}

function faqMd() {
  const lines = ['# Solar Mounting Structure FAQ', '', `> ${routeByPath('/faq').description}`, '', `Source: ${SITE_URL}/faq  `, ...CONTACT_LINES, '']
  for (const g of FAQ) {
    lines.push(`## ${g.group}`, '')
    for (const it of g.items) lines.push(`### ${it.q}`, '', it.a, '')
  }
  return lines.join('\n')
}

async function writeMd(routePath, file, body) {
  MD_FILES.set(routePath, file)
  await mkdir(path.dirname(path.join(dist, file)), { recursive: true })
  await writeFile(path.join(dist, file), body + '\n')
  return body
}

const mdDocs = []
for (const p of PRODUCTS) {
  const meta = PRODUCT_INDEX.find(m => m.slug === p.slug)
  mdDocs.push(await writeMd(`/products/${p.slug}`, `products/${p.slug}.md`, productMd(p, meta)))
}
for (const post of POSTS) mdDocs.push(await writeMd(`/blog/${post.slug}`, `blog/${post.slug}.md`, postMd(post)))
mdDocs.push(await writeMd('/faq', 'faq.md', faqMd()))
console.log(`  wrote ${MD_FILES.size} Markdown twins`)

/* ── llms.txt / llms-full.txt ─────────────────────────────────────────── */
const mdLink = routePath => `${SITE_URL}/${MD_FILES.get(routePath)}`
const llms = [
  '# Sunmount Solutions Private Limited',
  '',
  "> India's indigenous solar PV mounting structure manufacturer. ISO 9001 & TÜV SÜD certified aluminium and steel mounting systems engineered for wind loads up to 200 km/h, supplied across India and 50+ countries. Based in Sirsa, Haryana.",
  '',
  'Sunmount (brand name SunMount®) designs and manufactures rooftop solar mounting systems: Mono Rail, Mini Rail and Long Rail aluminium rail systems for trapezoidal metal roofs, Standing Seam clamps (zero roof drilling), an Inclined System for flat and low-pitch roofs, FRP maintenance walkways, and the clamps, bolts and EPDM tape that complete each system. Every content page below has a Markdown twin (same URL with .md) and the whole site is in llms-full.txt.',
  '',
  `Last updated: ${buildDate}`,
  '',
  '## Key facts',
  '',
  '- Company: Sunmount Solutions Private Limited (brand: SunMount®), Sirsa, Haryana, India. Founder and Managing Director: Vikas Bansal.',
  '- Certifications: ISO 9001, TÜV SÜD certified products, MSME registered, Made in India.',
  '- Wind rating: rail and standing seam systems up to 200 km/h design wind speed; Inclined System up to 170 km/h.',
  '- Materials: aluminium 6063 T6 rails and clamps (anodized or non-anodized), SS 304 fasteners, EPDM seals; FRP walkways in pultruded fibre-reinforced polymer.',
  '- Module fit: all standard PV modules with 30, 35 or 40 mm frames, portrait or landscape depending on the system.',
  '- Roof types: trapezoidal metal (tin shed), standing seam, asbestos cement (purlin-mounted), flat and low-pitch roofs.',
  '- Customers: EPC contractors, solar installers, distributors and building owners across India and international projects.',
  '',
  '## Pages',
  '',
  `- [Home](${SITE_URL}/): Company overview, product highlights, certifications, and team.`,
  `- [Products](${SITE_URL}/products): Full mounting-systems catalogue with interactive 3D models, technical specifications, accessories and hardware.`,
  `- [Contact](${SITE_URL}/contact): Request a quote, sales enquiry form, and headquarters details.`,
  `- [Careers](${SITE_URL}/careers): Current job openings and online application form.`,
  '',
  '## Products',
  '',
  ...PRODUCT_INDEX.map(p => `- [${p.h1}](${SITE_URL}/products/${p.slug}): ${p.metaDescription} Markdown: ${mdLink(`/products/${p.slug}`)}`),
  '',
  '## Guides',
  '',
  ...POSTS.map(p => `- [${p.title}](${SITE_URL}/blog/${p.slug}): ${p.description} Markdown: ${mdLink(`/blog/${p.slug}`)}`),
  '',
  '## FAQ',
  '',
  `- [Solar Mounting Structure FAQ](${SITE_URL}/faq): ${routeByPath('/faq').description} Markdown: ${mdLink('/faq')}`,
  '',
  '## Resources',
  '',
  `- [Product Catalogue (PDF)](${SITE_URL}/catalogue.pdf): Complete printable catalogue of all mounting systems and accessories.`,
  `- [Full site as Markdown](${SITE_URL}/llms-full.txt): Every product page, guide and FAQ in one file.`,
  `- [Sitemap](${SITE_URL}/sitemap.xml)`,
  '',
  '## Contact',
  '',
  '- Official profiles: https://in.linkedin.com/company/sunmountsolutions, https://www.indiamart.com/sunmountsolutions/, https://www.facebook.com/sunmountsolutions/, https://www.instagram.com/sunmountsolutions/, https://www.enfsolar.com/sunmount',
  '- Email: sales@sunmount.in',
  '- Phone: +91 7837 999 222, +91 8531 999 222',
  '- Address: Surya Koti, Bajekan-Sirsa Main Road, Sirsa, Haryana 125055, India',
].join('\n') + '\n'
await writeFile(path.join(dist, 'llms.txt'), llms)
await writeFile(path.join(dist, 'llms-full.txt'), llms + '\n---\n\n' + mdDocs.join('\n\n---\n\n') + '\n')
console.log('  wrote llms.txt and llms-full.txt')

/* ── HTML pages ─────────────────────────────────────────────────────────── */
function headTags(meta) {
  const url = SITE_URL + meta.path
  const image = SITE_URL + (meta.ogImage || DEFAULT_OG_IMAGE)
  const md = MD_FILES.get(meta.path)
  const product = meta.path.startsWith('/products/') && PRODUCTS.find(p => `/products/${p.slug}` === meta.path)
  const jsonLd = [...(meta.jsonLd || [])]
  if (product) jsonLd.push(productJsonLd(product, PRODUCT_INDEX.find(m => m.slug === product.slug)))
  const tags = [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" />`,
    `<meta name="robots" content="${meta.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'}" />`,
    meta.noindex ? '' : `<link rel="canonical" href="${url}" />`,
    md ? `<link rel="alternate" type="text/markdown" href="${SITE_URL}/${md}" title="Markdown version" />` : '',
    ...modulePreloads(meta.path),
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    meta.noindex ? '' : `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta name="twitter:title" content="${esc(meta.title)}" />`,
    `<meta name="twitter:description" content="${esc(meta.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    // `<` is escaped so page text can never close the script tag early.
    ...jsonLd.map(d => `<script type="application/ld+json">${JSON.stringify(d).replace(/</g, '\\u003c')}</script>`),
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

/* ── sitemap.xml ─────────────────────────────────────────────────────────── */
const urls = ROUTES.map(r => `  <url>
    <loc>${SITE_URL}${r.path}</loc>
    <lastmod>${r.lastmod || buildDate}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`)
urls.push(`  <url>
    <loc>${SITE_URL}/catalogue.pdf</loc>
    <lastmod>${buildDate}</lastmod>
    <priority>0.5</priority>
  </url>`)
await writeFile(path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`)
console.log(`  wrote sitemap.xml (${urls.length} URLs)`)

await rm(ssrDir, { recursive: true, force: true })
