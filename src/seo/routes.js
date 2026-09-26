// Single source of truth for per-route SEO metadata.
// Read by the useSeo hook in the browser AND by scripts/prerender.mjs at build
// time, so the prerendered HTML and client-side navigation always agree.
// Keep this file plain JS (no JSX / browser APIs) — it runs in Node too.

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

export const ROUTES = [
  {
    path: '/',
    title: "SunMount® | Solar Mounting Structures | India's Premium Manufacturer",
    description: "India's indigenous solar PV mounting manufacturer. ISO 9001 & TÜV SÜD certified Mono, Mini, Long Rail, Standing Seam & FRP Walkway systems engineered for 200 km/h wind loads.",
    changefreq: 'monthly',
    priority: '1.0',
  },
  {
    path: '/products',
    title: 'Solar Mounting Systems – Mono, Mini & Long Rail | SunMount',
    description: "SunMount's full range of solar mounting systems with interactive 3D models: Mono Rail, Mini Rail, Long Rail, Standing Seam clamps, Inclined and FRP Walkway. ISO 9001 & TÜV SÜD certified, rated to 200 km/h.",
    changefreq: 'monthly',
    priority: '0.9',
    jsonLd: [crumbs({ name: 'Products', path: '/products' })],
  },
  {
    path: '/contact',
    title: 'Contact SunMount | Request a Solar Mounting Quote',
    description: 'Get in touch with Sunmount Solutions for solar mounting structures. Request a quote, share your project requirement and site layout — our team responds within 24 hours.',
    changefreq: 'yearly',
    priority: '0.7',
    jsonLd: [
      crumbs({ name: 'Contact', path: '/contact' }),
      {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: 'Contact SunMount',
        url: SITE_URL + '/contact',
      },
    ],
  },
  {
    path: '/careers',
    title: 'Careers at Sunmount Solutions | Join Our Team',
    description: "Explore career opportunities at Sunmount Solutions — India's growing solar mounting manufacturer. View open roles and apply online; applications go straight to our HR team.",
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
