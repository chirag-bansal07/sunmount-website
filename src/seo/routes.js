// Single source of truth for per-route SEO metadata.
// Read by the useSeo hook in the browser AND by scripts/prerender.mjs at build
// time, so the prerendered HTML and client-side navigation always agree.
// Keep this file plain JS (no JSX / browser APIs) — it runs in Node too.
import { PRODUCT_INDEX as PRODUCTS } from '../data/productIndex.js'

export const SITE_URL = 'https://www.sunmount.in'
export const SITE_NAME = 'Sunmount Solutions'
export const DEFAULT_OG_IMAGE = '/og-default.jpg'

const crumbs = (...items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [{ name: 'Home', path: '/' }, ...items].map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.name,
    item: SITE_URL + c.path,
  })),
})

// The Sirsa factory as a physical business — complements the site-wide
// Organization in index.html (same entity, linked by @id).
const LOCAL_BUSINESS = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': SITE_URL + '/#factory',
  name: 'Sunmount Solutions Private Limited',
  description: 'Manufacturer of aluminium and steel solar PV mounting structures.',
  url: SITE_URL + '/',
  image: SITE_URL + '/og-default.jpg',
  logo: SITE_URL + '/logo.png',
  telephone: '+91-7837-999-222',
  email: 'sales@sunmount.in',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Surya Koti, Bajekan-Sirsa Main Road',
    addressLocality: 'Sirsa',
    addressRegion: 'Haryana',
    postalCode: '125055',
    addressCountry: 'IN',
  },
  areaServed: 'IN',
  parentOrganization: { '@id': SITE_URL + '/#organization' },
}

const productRoutes = PRODUCTS.map(p => ({
  path: `/products/${p.slug}`,
  title: `${p.h1} | SunMount`,
  description: p.metaDescription,
  changefreq: 'monthly',
  priority: '0.8',
  jsonLd: [crumbs({ name: 'Products', path: '/products' }, { name: p.name, path: `/products/${p.slug}` })],
}))

export const ROUTES = [
  {
    path: '/',
    title: "SunMount® | Solar Mounting Structures | India's Premium Manufacturer",
    description: 'Indian solar PV mounting structure manufacturer. ISO 9001 & TÜV SÜD certified Mono, Mini & Long Rail, Standing Seam and FRP Walkway, rated to 200 km/h.',
    changefreq: 'monthly',
    priority: '1.0',
    jsonLd: [LOCAL_BUSINESS],
  },
  {
    path: '/products',
    title: 'Solar Mounting Systems – Mono, Mini & Long Rail | SunMount',
    description: 'All SunMount solar mounting systems: Mono, Mini & Long Rail, Standing Seam clamps, Inclined and FRP Walkway. ISO 9001 & TÜV SÜD certified, 200 km/h rated.',
    changefreq: 'monthly',
    priority: '0.9',
    jsonLd: [
      crumbs({ name: 'Products', path: '/products' }),
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'SunMount solar mounting systems',
        itemListElement: PRODUCTS.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: p.h1,
          url: `${SITE_URL}/products/${p.slug}`,
        })),
      },
    ],
  },
  ...productRoutes,
  {
    path: '/contact',
    title: 'Contact SunMount | Request a Solar Mounting Quote',
    description: 'Request a quote for solar mounting structures. Share your project size, roof type and layout — the SunMount team replies within 24 hours.',
    changefreq: 'yearly',
    priority: '0.7',
    jsonLd: [
      crumbs({ name: 'Contact', path: '/contact' }),
      {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: 'Contact SunMount',
        url: SITE_URL + '/contact',
        about: { '@id': SITE_URL + '/#factory' },
      },
      LOCAL_BUSINESS,
    ],
  },
  {
    path: '/careers',
    title: 'Careers at Sunmount Solutions | Join Our Team',
    description: 'Careers at Sunmount Solutions, a solar mounting structure manufacturer in Sirsa, Haryana. See current openings and apply online.',
    changefreq: 'monthly',
    priority: '0.6',
    jsonLd: [crumbs({ name: 'Careers', path: '/careers' })],
  },
]

// Rendered for unknown URLs (served as 404.html with a real 404 status).
export const NOT_FOUND = {
  path: '/404',
  title: 'Page not found | SunMount',
  description: 'The page you were looking for does not exist. Browse SunMount solar mounting systems or contact our team.',
  noindex: true,
}

export function getRouteMeta(path) {
  return ROUTES.find(r => r.path === path) || NOT_FOUND
}
