import { useEffect } from 'react'
import { SITE_URL, DEFAULT_OG_IMAGE, getRouteMeta } from '../seo/routes'

function upsertMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!content) {
    el?.remove()
    return
  }
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]')
  if (!href) {
    el?.remove()
    return
  }
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/**
 * Per-route SEO for client-side navigation. Metadata lives in src/seo/routes.js,
 * which scripts/prerender.mjs also bakes into each route's static HTML — this
 * hook just keeps the head in sync when the visitor navigates within the SPA.
 */
export default function useSeo(path) {
  useEffect(() => {
    const meta = getRouteMeta(path)
    const url = meta.noindex ? null : SITE_URL + meta.path
    const image = SITE_URL + (meta.ogImage || DEFAULT_OG_IMAGE)
    document.title = meta.title
    upsertMeta('name', 'description', meta.description)
    upsertMeta('name', 'robots', meta.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large')
    upsertMeta('property', 'og:title', meta.title)
    upsertMeta('property', 'og:description', meta.description)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:image', image)
    upsertMeta('name', 'twitter:title', meta.title)
    upsertMeta('name', 'twitter:description', meta.description)
    upsertMeta('name', 'twitter:image', image)
    upsertCanonical(url)
  }, [path])
}
