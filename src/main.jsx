import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { preloadRoute } from './lazyRoutes.js'

const root = document.getElementById('root')
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Production pages are prerendered (scripts/prerender.mjs) — hydrate that HTML,
// but only after the browser has painted it: hydrating a large page first
// would hold back First Contentful Paint until React finishes.
// The current route's code is fetched in parallel and hydration waits for it,
// so React never has to fall back to the route spinner mid-hydration (which
// would discard the server HTML and shift the whole page).
// In dev the root is empty, so render from scratch.
if (root.hasChildNodes()) {
  const routeReady = preloadRoute(window.location.pathname)
  let hydrated = false
  const hydrate = () => {
    if (hydrated) return
    hydrated = true
    routeReady.then(() => hydrateRoot(root, app))
  }
  requestAnimationFrame(() => setTimeout(hydrate, 0))
  setTimeout(hydrate, 500) // background tabs pause rAF — don't wait for a paint there
} else {
  createRoot(root).render(app)
}
