import { Link } from 'react-router-dom'
import useSeo from '../hooks/useSeo'

const NotFound = () => {
  useSeo('/404')
  return (
    <main style={{ paddingTop: 140, paddingBottom: 100, minHeight: '70vh' }}>
      <div className="container" style={{ maxWidth: 760 }}>
        <div className="section-label">ERROR 404</div>
        <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', marginBottom: '1.2rem' }}>
          This page doesn't exist.
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '2rem', maxWidth: 560 }}>
          The link may be from our old website. Browse our solar mounting systems, or tell us
          about your project and we'll send you a quote.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/products" className="btn-primary">View Products</Link>
          <Link to="/contact" className="btn-secondary">Contact Us</Link>
        </div>
      </div>
    </main>
  )
}

export default NotFound
