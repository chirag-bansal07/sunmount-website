import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const root = document.getElementById('root')
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Production pages are prerendered (scripts/prerender.mjs) — hydrate that HTML,
// but only after the browser has painted it: hydrating a large page first
// would hold back First Contentful Paint until React finishes.
// In dev the root is empty, so render from scratch.
if (root.hasChildNodes()) {
  let hydrated = false
  const hydrate = () => {
    if (hydrated) return
    hydrated = true
    hydrateRoot(root, app)
  }
  requestAnimationFrame(() => setTimeout(hydrate, 0))
  setTimeout(hydrate, 500) // background tabs pause rAF — don't wait for a paint there
} else {
  createRoot(root).render(app)
}
