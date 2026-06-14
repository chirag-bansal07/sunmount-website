import { useState, useRef, useEffect } from 'react'

/**
 * Returns [ref, inView]. `inView` flips true while the element is within
 * `rootMargin` of the viewport. Used to defer heavy work (e.g. WebGL canvases)
 * until the element is actually on screen — and pause it when it scrolls away.
 */
export default function useInView({ rootMargin = '200px', once = false } = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true) // graceful fallback — just render it
      return
    }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true)
        if (once) io.disconnect()
      } else if (!once) {
        setInView(false)
      }
    }, { rootMargin })
    io.observe(el)
    return () => io.disconnect()
  }, [rootMargin, once])

  return [ref, inView]
}
