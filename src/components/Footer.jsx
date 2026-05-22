import { Link } from 'react-router-dom'

const LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'Why SunMount', to: '/#why' },
  { label: 'Our Team', to: '/#team' },
  { label: 'Contact Us', to: '/contact' },
]

export default function Footer() {
  return (
    <footer style={{
      background: '#060709',
      borderTop: '1px solid rgba(200,213,220,0.06)',
      padding: '5rem 5% 2rem',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '3rem', marginBottom: '4rem' }}>

          {/* Brand */}
          <div>
            <div style={{ fontFamily: 'Rajdhani', fontWeight: 800, fontSize: '1.6rem', marginBottom: '1rem', letterSpacing: '0.04em' }}>
              SUN<span style={{ color: '#F97316' }}>MOUNT</span><sup style={{ fontSize: '0.45em', color: '#F97316' }}>®</sup>
            </div>
            <p style={{ color: 'var(--text-3)', fontSize: '0.85rem', lineHeight: 1.8, maxWidth: 280, marginBottom: '1.5rem' }}>
              Quality with Stability for Infinity.<br />
              India's premier solar PV mounting manufacturer.
              ISO · MSME · TUV Certified.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {['Made In India', 'ISO', 'TUV', 'MSME'].map(b => (
                <div key={b} style={{
                  padding: '0.2rem 0.6rem',
                  border: '1px solid rgba(200,213,220,0.12)',
                  borderRadius: 3,
                  fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: 'var(--al-mid)', fontWeight: 600,
                }}>{b}</div>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 style={{ fontFamily: 'Rajdhani', fontSize: '0.8rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--solar)', marginBottom: '1.25rem', fontWeight: 700 }}>
              Navigation
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {LINKS.map(l => (
                <Link key={l.label} to={l.to} style={{
                  color: 'var(--text-3)', fontSize: '0.85rem', transition: 'color 0.2s',
                }}
                  onMouseEnter={e => e.target.style.color = 'var(--text-1)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-3)'}
                >{l.label}</Link>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 style={{ fontFamily: 'Rajdhani', fontSize: '0.8rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--solar)', marginBottom: '1.25rem', fontWeight: 700 }}>
              Products
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {['MiniRail System', 'MonoRail System', 'Long Rail System'].map(p => (
                <span key={p} style={{ color: 'var(--text-3)', fontSize: '0.85rem' }}>{p}</span>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontFamily: 'Rajdhani', fontSize: '0.8rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--solar)', marginBottom: '1.25rem', fontWeight: 700 }}>
              Contact
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>Address</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-2)', lineHeight: 1.5 }}>Begu Road, Sirsa 125055<br />Haryana, India</div>
              </div>
              <div>
                <a href="tel:+917837999222" style={{ fontSize: '0.9rem', color: '#F97316', fontWeight: 600 }}>+91 7837 999 222</a>
              </div>
              <div>
                <a href="mailto:info@sunmount.in" style={{ fontSize: '0.85rem', color: 'var(--text-2)' }}>info@sunmount.in</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.05)',
          paddingTop: '1.5rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '0.75rem',
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>
            © {new Date().getFullYear()} SunMount® Solutions. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {[
              { label: 'WhatsApp', href: 'https://api.whatsapp.com/send?phone=917837999222' },
              { label: 'LinkedIn', href: 'https://www.linkedin.com/in/raj-g-3b59b9123/' },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: '0.75rem', color: 'var(--text-3)', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#F97316'}
                onMouseLeave={e => e.target.style.color = 'var(--text-3)'}
              >{s.label}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
