// Route-level code splitting — keeps the heavy 3D Products page and the
// other routes out of the initial bundle for a fast first load.
//
// lazyRoute = React.lazy plus a preload(). Once preloaded, the component
// resolves synchronously, so hydrating a prerendered page never suspends.
// Without this, a context update (e.g. LazyMotion's features arriving) while
// the route chunk is still in flight makes React abandon the server HTML and
// paint the Suspense fallback, which shows as a ~0.6 layout shift on slow
// networks. src/main.jsx preloads the current route before hydrateRoot, and
// scripts/prerender.mjs adds <link rel="modulepreload"> for the same chunk.
import { lazy } from 'react'

function lazyRoute(loader) {
  let mod = null
  const load = () => loader().then(m => { mod = m; return m })
  const L = lazy(() => (mod ? { then: resolve => resolve(mod) } : load()))
  L.preload = load
  return L
}

export const Contact = lazyRoute(() => import('./pages/Contact'))
export const Products = lazyRoute(() => import('./pages/Products'))
export const ProductDetail = lazyRoute(() => import('./pages/ProductDetail'))
export const Careers = lazyRoute(() => import('./pages/Careers'))
export const NotFound = lazyRoute(() => import('./pages/NotFound'))
export const Blog = lazyRoute(() => import('./pages/Blog'))
export const BlogPost = lazyRoute(() => import('./pages/BlogPost'))
export const Faq = lazyRoute(() => import('./pages/Faq'))

/** Loads the code for the route that renders `pathname` (resolves even on failure). */
export function preloadRoute(pathname) {
  const p = pathname.replace(/\/+$/, '') || '/'
  let route = NotFound
  if (p === '/') route = null // Home is in the main bundle
  else if (p === '/blog') route = Blog
  else if (p.startsWith('/blog/')) route = BlogPost
  else if (p === '/faq') route = Faq
  else if (p === '/contact') route = Contact
  else if (p === '/products') route = Products
  else if (p.startsWith('/products/')) route = ProductDetail
  else if (p === '/careers') route = Careers
  return route ? route.preload().catch(() => {}) : Promise.resolve()
}
