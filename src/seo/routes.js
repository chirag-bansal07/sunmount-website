// Single source of truth for per-route SEO metadata.
// Read by the useSeo hook in the browser AND by scripts/prerender.mjs at build
// time, so the prerendered HTML and client-side navigation always agree.
// Keep this file plain JS (no JSX / browser APIs) — it runs in Node too.
import { PRODUCT_INDEX as PRODUCTS } from '../data/productIndex.js'
import { POST_INDEX } from '../data/postIndex.js'
import { FAQ } from '../data/faq.js'
import { OPENINGS } from '../data/jobs.js'

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

const ORG_REF = { '@id': SITE_URL + '/#organization' }

const FACTORY_ADDRESS = LOCAL_BUSINESS.address

const postRoutes = POST_INDEX.map(p => ({
  path: `/blog/${p.slug}`,
  // Keep titles within ~60 characters: long headlines go without the brand suffix
  title: p.title.length > 50 ? p.title : `${p.title} | SunMount`,
  description: p.description,
  changefreq: 'yearly',
  priority: '0.6',
  lastmod: p.date,
  jsonLd: [
    crumbs({ name: 'Guides', path: '/blog' }, { name: p.title, path: `/blog/${p.slug}` }),
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: p.title,
      description: p.description,
      datePublished: p.date,
      dateModified: p.date,
      image: SITE_URL + DEFAULT_OG_IMAGE,
      mainEntityOfPage: `${SITE_URL}/blog/${p.slug}`,
      author: { '@type': 'Organization', name: 'SunMount engineering team', url: SITE_URL + '/' },
      publisher: ORG_REF,
      inLanguage: 'en-IN',
    },
  ],
}))

// Every job opening on /careers as a JobPosting (Google for Jobs).
const jobPostings = OPENINGS.map(j => ({
  '@context': 'https://schema.org',
  '@type': 'JobPosting',
  title: j.title,
  description: `<p>${j.description}</p><p><strong>Responsibilities</strong></p><ul>${j.responsibilities.map(r => `<li>${r}</li>`).join('')}</ul><p><strong>Requirements</strong></p><ul>${j.requirements.map(r => `<li>${r}</li>`).join('')}</ul>`,
  datePosted: j.datePosted,
  employmentType: j.employmentType,
  directApply: true,
  hiringOrganization: { '@type': 'Organization', name: 'Sunmount Solutions Private Limited', sameAs: SITE_URL + '/', logo: SITE_URL + '/logo.png' },
  jobLocation: { '@type': 'Place', address: FACTORY_ADDRESS },
  educationRequirements: j.education,
}))

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
    path: '/blog',
    title: 'Solar Mounting Structure Guides | SunMount',
    description: 'Guides for EPC contractors and building owners: aluminium vs GI, metal and standing seam roofs, and designing solar structures for Indian wind loads.',
    changefreq: 'weekly',
    priority: '0.7',
    jsonLd: [
      crumbs({ name: 'Guides', path: '/blog' }),
      {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'SunMount Solar Mounting Guides',
        url: SITE_URL + '/blog',
        publisher: ORG_REF,
        blogPost: POST_INDEX.map(p => ({ '@type': 'BlogPosting', headline: p.title, url: `${SITE_URL}/blog/${p.slug}`, datePublished: p.date })),
      },
    ],
  },
  ...postRoutes,
  {
    path: '/faq',
    title: 'Solar Mounting Structure FAQ | SunMount',
    description: 'Answers on SunMount solar mounting systems: roof compatibility, wind ratings, materials, panel fit, certifications and how to get a quote.',
    changefreq: 'monthly',
    priority: '0.7',
    jsonLd: [
      crumbs({ name: 'FAQ', path: '/faq' }),
      // No Google rich result since May 2026, but still read by Bing and AI assistants.
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: FAQ.flatMap(g => g.items).map(it => ({
          '@type': 'Question',
          name: it.q,
          acceptedAnswer: { '@type': 'Answer', text: it.a },
        })),
      },
    ],
  },
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
    jsonLd: [crumbs({ name: 'Careers', path: '/careers' }), ...jobPostings],
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
