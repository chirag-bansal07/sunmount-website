import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, lazy, Suspense } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import './index.css'

// Route-level code splitting — keeps the heavy 3D Products page and the
// other routes out of the initial bundle for a fast first load.
const Contact  = lazy(() => import('./pages/Contact'))
const Products = lazy(() => import('./pages/Products'))
const Careers  = lazy(() => import('./pages/Careers'))

const RouteFallback = () => (
  <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ width: 46, height: 46, borderRadius: '50%', border: '3px solid var(--border-subtle)', borderTopColor: 'var(--sun-orange)', animation: 'spin 0.8s linear infinite' }} />
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
  </div>
)

function ScrollHandler() {
  const { hash, pathname } = useLocation()
  useEffect(() => {
    if (hash) {
      const timer = setTimeout(() => {
        const el = document.querySelector(hash)
        // Only anchor-scroll when a real element has that id.
        // Product-page hashes (#mono/#mini/…) select a tab — scroll to top instead.
        if (el) el.scrollIntoView({ behavior: 'smooth' })
        else window.scrollTo({ top: 0, behavior: 'instant' })
      }, 120)
      return () => clearTimeout(timer)
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [hash, pathname])
  return null
}

function App() {
  return (
    <Router>
      <ScrollHandler />
      <Navbar />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/products" element={<Products />} />
          <Route path="/careers" element={<Careers />} />
        </Routes>
      </Suspense>
      <Footer />
      <Analytics />
      <SpeedInsights />
    </Router>
  )
}

export default App
