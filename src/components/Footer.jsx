import { Link } from 'react-router-dom'

const Footer = () => (
  <footer style={{
    background: '#060A17', borderTop: '1px solid rgba(249,115,22,0.15)',
    padding: '4rem 2rem 2rem'
  }}>
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
        <div>
          <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1.6rem', marginBottom: '1rem' }}>
            Sun<span style={{ color: '#F97316' }}>Mount</span>®
          </div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', lineHeight: 1.7 }}>
            Quality with Stability for Infinity!<br />
            ISO & MSME registered. TUV certified products.
          </p>
        </div>
        <div>
          <h4 style={{ fontFamily: 'Rajdhani', color: '#F97316', marginBottom: '1rem', letterSpacing: '0.1em' }}>QUICK LINKS</h4>
          {['Home', 'About', 'Products', 'Contact'].map(l => (
            <div key={l} style={{ marginBottom: '0.5rem' }}>
              <Link to={`/${l.toLowerCase() === 'home' ? '' : l.toLowerCase()}`}
                style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#F97316'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.6)'}
              >{l}</Link>
            </div>
          ))}
        </div>
        <div>
          <h4 style={{ fontFamily: 'Rajdhani', color: '#F97316', marginBottom: '1rem', letterSpacing: '0.1em' }}>CONTACT</h4>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: 1.8 }}>
            Begu Road, Sirsa 125055<br />
            Haryana, India<br />
            <a href="tel:+917837999222" style={{ color: '#F97316' }}>+91 7837 999 222</a><br />
            <a href="mailto:info@sunmount.in" style={{ color: '#F97316' }}>info@sunmount.in</a>
          </p>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>
        © {new Date().getFullYear()} SunMount® Solutions. All rights reserved.
      </div>
    </div>
  </footer>
)

export default Footer
