/* eslint-disable react-refresh/only-export-components -- build-time entry, never hot-reloaded */
// Build-time render entry, used only by scripts/prerender.mjs (never shipped
// to the browser). Renders a route to HTML, waiting for lazy routes to resolve.
import { StrictMode } from 'react'
import { prerenderToNodeStream } from 'react-dom/static'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { AppShell } from './App.jsx'

export { ROUTES, NOT_FOUND, SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from './seo/routes.js'

const app = url => (
  <StrictMode>
    <StaticRouter location={url}>
      <AppShell />
    </StaticRouter>
  </StrictMode>
)

export async function render(url) {
  // Pass 1 waits for every lazy() route/chunk to resolve. Its output can
  // contain streaming placeholders (<template id="B:0"> + a $RC swap script)
  // that the static HTML never completes, which stalls hydration — so it is
  // only used to warm the lazy() caches.
  const { prelude } = await prerenderToNodeStream(app(url))
  for await (const chunk of prelude) void chunk
  // Pass 2: everything is resolved now, so a synchronous render emits the
  // finished markup inline with completed Suspense boundaries.
  const html = renderToString(app(url))
  if (/<!--$[?!]-->|<template id="B:/.test(html)) {
    throw new Error(`prerender: ${url} still has a suspended boundary`)
  }
  return html
}
