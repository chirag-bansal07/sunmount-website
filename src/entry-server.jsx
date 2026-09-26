// Build-time render entry, used only by scripts/prerender.mjs (never shipped
// to the browser). Renders a route to HTML, waiting for lazy routes to resolve.
import { StrictMode } from 'react'
import { prerenderToNodeStream } from 'react-dom/static'
import { StaticRouter } from 'react-router-dom'
import { AppShell } from './App.jsx'

// eslint-disable-next-line react-refresh/only-export-components -- build-time only, never hot-reloaded
export { ROUTES, NOT_FOUND, SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from './seo/routes.js'

export async function render(url) {
  const { prelude } = await prerenderToNodeStream(
    <StrictMode>
      <StaticRouter location={url}>
        <AppShell />
      </StaticRouter>
    </StrictMode>,
  )
  let html = ''
  for await (const chunk of prelude) html += chunk
  return html
}
