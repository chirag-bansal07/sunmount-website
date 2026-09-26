import { lazy, Suspense, useState, useSyncExternalStore } from 'react'
import useInView from '../hooks/useInView'

// three.js + models live in these chunks and are only fetched when a viewer
// is actually shown — pages render and become interactive without them.
const VIEWERS = {
  product: lazy(() => import('../three/ProductCanvas')),
  spin: lazy(() => import('../three/SpinCanvas')),
}

// Phones and data-saver users get a tap-to-load poster instead of auto-loading
// WebGL + multi-MB models. Server render (null) always shows the poster.
const TAP_QUERY = '(max-width: 900px), (pointer: coarse)'
const subscribe = cb => {
  const mq = window.matchMedia(TAP_QUERY)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}
const needsTap = () => window.matchMedia(TAP_QUERY).matches || !!navigator.connection?.saveData

// Once a visitor opts in, keep 3D on for the rest of the visit.
let optedIn = false

function Poster({ label, onLoad }) {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {onLoad ? (
        <button
          type="button"
          onClick={onLoad}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.6rem',
            padding: '0.75rem 1.2rem', background: 'rgba(10,14,26,0.8)',
            border: '1px solid var(--border-accent)', color: 'var(--text-primary)',
            fontFamily:"'JetBrains Mono', 'JetBrains Mono Fallback', monospace", fontSize: '0.7rem', letterSpacing: '0.12em',
            textTransform: 'uppercase', cursor: 'pointer',
          }}
        >
          <span aria-hidden="true" style={{ color: 'var(--sun-orange)' }}>▶</span>
          View {label ? `${label} ` : ''}in 3D
        </button>
      ) : (
        <div aria-hidden="true" style={{ width: 42, height: 42, borderRadius: '50%', border: '2px solid var(--border-subtle)', borderTopColor: 'var(--sun-orange)', opacity: 0.5 }} />
      )}
    </div>
  )
}

/**
 * Lazy 3D viewer. Mounts WebGL only while on screen (hidden desktop/mobile
 * duplicates never intersect, so they never create a context).
 */
export default function Model3D({ kind = 'product', label, keepMounted = false, ...props }) {
  const [ref, inView] = useInView({ rootMargin: '250px', once: keepMounted })
  const tap = useSyncExternalStore(subscribe, needsTap, () => null)
  const [activated, setActivated] = useState(optedIn)
  const Viewer = VIEWERS[kind]
  const ready = tap === false || (tap === true && activated)
  const activate = () => { optedIn = true; setActivated(true) }

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%', height: '100%' }}>
      {ready && inView ? (
        <Suspense fallback={<Poster />}>
          <Viewer {...props} />
        </Suspense>
      ) : (
        <Poster label={label} onLoad={tap ? activate : null} />
      )}
    </div>
  )
}
