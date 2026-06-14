import { lazy, Suspense } from 'react'
import Hero from '../sections/Hero'
import WhySunmount from '../sections/WhySunmount'
import Offers from '../sections/Offers'
import Testimonials from '../sections/Testimonials'
import Team from '../sections/Team'
import useInView from '../hooks/useInView'

// Heavy 3D section — split into its own chunk AND only downloaded once the
// visitor scrolls near it. Keeps the Hero (LCP) fast and saves the Three.js
// payload entirely for visitors who never scroll past the fold.
const Products = lazy(() => import('../sections/Products'))

function DeferredProducts() {
  // Start loading ~600px before it enters view so it feels instant on arrival.
  const [ref, inView] = useInView({ rootMargin: '600px', once: true })
  return (
    <div ref={ref} style={{ minHeight: inView ? undefined : 760 }}>
      {inView && (
        <Suspense fallback={<div style={{ minHeight: 760 }} />}>
          <Products />
        </Suspense>
      )}
    </div>
  )
}

const Home = () => (
  <main>
    <Hero />
    <DeferredProducts />
    <WhySunmount />
    <Offers />
    <Testimonials />
    <Team />
  </main>
)

export default Home
