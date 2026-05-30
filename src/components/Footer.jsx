import { Link } from 'react-router-dom'

const Footer = () => (
  <footer style={{ background:'var(--bg-deep)', borderTop:'1px solid var(--border-subtle)', padding:'5rem 0 2rem' }}>
    <div className="container">
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:'3rem', marginBottom:'4rem' }} className="footer-grid">

        {/* Brand col — real logo */}
        <div>
          <img src="/logo.png" alt="SunMount" style={{ height:52, width:'auto', marginBottom:'1rem', filter:'drop-shadow(0 0 8px rgba(224,85,64,0.2))' }} />
          <p style={{ fontFamily:'JetBrains Mono', fontSize:'0.7rem', letterSpacing:'0.15em', color:'var(--sun-orange)', marginBottom:'1.2rem', textTransform:'uppercase' }}>
            Quality · Stability · Infinity
          </p>
          <p style={{ fontSize:'0.88rem', color:'var(--text-muted)', lineHeight:1.7, maxWidth:280, marginBottom:'1.5rem' }}>
            India's indigenous solar PV mounting manufacturer. ISO 9001 & MSME registered. TÜV SÜD certified. Supplying across the globe.
          </p>
          {/* Badge grid — 2 × 2 */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', alignItems:'center', marginTop:'0.5rem', maxWidth:220 }}>
            {[
              { src:'/badge-makeindia.png', alt:'Make in India', h: 90 },
              { src:'/badge-iso.png',       alt:'ISO 9001',      h: 80 },
              { src:'/badge-tuv.png',       alt:'TÜV SÜD',      h: 80 },
              { src:'/badge-msme.png',      alt:'MSME',          h: 90 },
            ].map(({ src, alt, h }) => (
              <div key={alt} style={{ display:'flex', justifyContent:'center', alignItems:'center' }}>
                <img src={src} alt={alt}
                  style={{ height: h, width:'auto', objectFit:'contain', display:'block' }} />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 style={{ fontFamily:'JetBrains Mono', fontSize:'0.72rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--aluminum-mid)', marginBottom:'1.2rem' }}>Navigation</h4>
          {[{ to:'/', label:'Home' },{ to:'/#products', label:'Products' },{ to:'/#why', label:'Why Sunmount' },{ to:'/#team', label:'Team' },{ to:'/contact', label:'Contact Us' }].map(l => (
            <div key={l.label} style={{ marginBottom:'0.7rem' }}>
              <Link to={l.to} style={{ fontSize:'0.88rem', color:'var(--text-muted)', transition:'color 0.2s' }}
                onMouseEnter={e => e.target.style.color='var(--sun-orange)'}
                onMouseLeave={e => e.target.style.color='var(--text-muted)'}>{l.label}</Link>
            </div>
          ))}
        </div>

        {/* Products */}
        <div>
          <h4 style={{ fontFamily:'JetBrains Mono', fontSize:'0.72rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--aluminum-mid)', marginBottom:'1.2rem' }}>Products</h4>
          {[
            { label:'Mono Rail System',      to:'/products#mono'     },
            { label:'Mini Rail System',      to:'/products#mini'     },
            { label:'Long Rail System',      to:'/products#long'     },
            { label:'Standing Seam System',  to:'/products#seam'     },
            { label:'Inclined System',       to:'/products#inclined' },
            { label:'Accessories & Hardware',to:'/products'          },
          ].map(p => (
            <div key={p.label} style={{ marginBottom:'0.7rem' }}>
              <Link to={p.to} style={{ fontSize:'0.88rem', color:'var(--text-muted)', transition:'color 0.2s' }}
                onMouseEnter={e => e.target.style.color='var(--sun-orange)'}
                onMouseLeave={e => e.target.style.color='var(--text-muted)'}>{p.label}</Link>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div>
          <h4 style={{ fontFamily:'JetBrains Mono', fontSize:'0.72rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--aluminum-mid)', marginBottom:'1.2rem' }}>Contact</h4>
          <div style={{ fontSize:'0.88rem', color:'var(--text-muted)', lineHeight:1.9 }}>
            <div>Sunmount Solutions</div>
            <div>Surya Koti, Bajekan-Sirsa Main Road</div>
            <div>Sirsa, Haryana 125055</div>
            <div style={{ marginTop:'0.6rem' }}>
              <a href="tel:+917837999222" style={{ color:'var(--sun-orange)' }}>+91 7837 999 222</a>
            </div>
            <div>
              <a href="tel:+918531999222" style={{ color:'var(--sun-orange)' }}>+91 8531 999 222</a>
            </div>
            <div><a href="mailto:info@sunmount.in" style={{ color:'var(--sun-orange)' }}>info@sunmount.in</a></div>
            <div style={{ marginTop:'0.6rem' }}>
              <a href="https://www.sunmount.in" target="_blank" rel="noopener noreferrer"
                style={{ color:'var(--aluminum-mid)', textDecoration:'underline', fontSize:'0.82rem' }}>www.sunmount.in</a>
            </div>
          </div>
        </div>
      </div>

      <div style={{ paddingTop:'2rem', borderTop:'1px solid var(--border-subtle)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem' }}>
        <div style={{ fontSize:'0.78rem', color:'var(--text-muted)', fontFamily:'JetBrains Mono' }}>
          © {new Date().getFullYear()} SunMount® Solutions. All rights reserved.
        </div>
        <div style={{ display:'flex', gap:'1rem', fontFamily:'JetBrains Mono', fontSize:'0.68rem', letterSpacing:'0.1em', color:'var(--text-muted)' }}>
          <span>ISO 9001 CERTIFIED</span>
          <span style={{ color:'var(--aluminum-edge)' }}>·</span>
          <span>TÜV SÜD CERTIFIED</span>
          <span style={{ color:'var(--aluminum-edge)' }}>·</span>
          <span>MSME REGISTERED</span>
        </div>
      </div>
    </div>

    <style>{`
      @media(max-width:900px){.footer-grid{grid-template-columns:1fr 1fr!important}}
      @media(max-width:600px){.footer-grid{grid-template-columns:1fr!important}}
    `}</style>
  </footer>
)

export default Footer
