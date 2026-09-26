import { Link } from 'react-router-dom'
import { PRODUCT_INDEX } from '../data/productIndex'

const Footer = () => (
  <footer style={{ background:'var(--bg-deep)', borderTop:'1px solid var(--border-subtle)', padding:'5rem 0 2rem' }}>
    <div className="container">
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:'3rem', marginBottom:'4rem' }} className="footer-grid">

        {/* Brand col — real logo */}
        <div>
          <picture>
            <source srcSet="/logo.webp" type="image/webp" />
            <img src="/logo.png" alt="SunMount Solutions logo" width="600" height="150" loading="lazy" decoding="async" style={{ height:52, width:'auto', marginBottom:'1rem', filter:'drop-shadow(0 0 8px rgba(224,85,64,0.2))' }} />
          </picture>
          <p style={{ fontFamily:'JetBrains Mono', fontSize:'0.7rem', letterSpacing:'0.15em', color:'var(--sun-orange)', marginBottom:'1.2rem', textTransform:'uppercase' }}>
            Quality · Stability · Infinity
          </p>
          <p style={{ fontSize:'0.88rem', color:'var(--text-muted)', lineHeight:1.7, maxWidth:280, marginBottom:'1.5rem' }}>
            India's indigenous solar PV mounting manufacturer. ISO 9001 & MSME registered. TÜV SÜD certified. Supplying across the globe.
          </p>
          {/* Badge grid — 2 × 2 */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', alignItems:'center', marginTop:'0.5rem', maxWidth:220 }}>
            {[
              { src:'/badge-makeindia.webp', alt:'Make in India', h: 90, iw: 200, ih: 91 },
              { src:'/badge-iso.webp',       alt:'ISO 9001',      h: 80, iw: 200, ih: 200 },
              { src:'/badge-tuv.webp',       alt:'TÜV SÜD',      h: 80, iw: 200, ih: 200 },
              { src:'/badge-msme.webp',      alt:'MSME',          h: 90, iw: 180, ih: 88 },
            ].map(({ src, alt, h, iw, ih }) => (
              <div key={alt} style={{ display:'flex', justifyContent:'center', alignItems:'center' }}>
                <img src={src} alt={alt} width={iw} height={ih} loading="lazy" decoding="async"
                  style={{ height: h, width:'auto', objectFit:'contain', display:'block' }} />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h2 style={{ fontFamily:'JetBrains Mono', fontSize:'0.72rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--aluminum-mid)', marginBottom:'1.2rem' }}>Navigation</h2>
          {[{ to:'/', label:'Home' },{ to:'/products', label:'Products' },{ to:'/#why', label:'Why Sunmount' },{ to:'/#team', label:'Team' },{ to:'/contact', label:'Contact Us' },{ to:'/careers', label:'Careers' }].map(l => (
            <div key={l.label} style={{ marginBottom:'0.7rem' }}>
              <Link to={l.to} style={{ fontSize:'0.88rem', color:'var(--text-muted)', transition:'color 0.2s' }}
                onMouseEnter={e => e.target.style.color='var(--sun-orange)'}
                onMouseLeave={e => e.target.style.color='var(--text-muted)'}>{l.label}</Link>
            </div>
          ))}
        </div>

        {/* Products */}
        <div>
          <h2 style={{ fontFamily:'JetBrains Mono', fontSize:'0.72rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--aluminum-mid)', marginBottom:'1.2rem' }}>Products</h2>
          {[
            ...PRODUCT_INDEX.map(p => ({ label: p.name, to: `/products/${p.slug}` })),
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
          <h2 style={{ fontFamily:'JetBrains Mono', fontSize:'0.72rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--aluminum-mid)', marginBottom:'1.2rem' }}>Contact</h2>
          <div style={{ fontSize:'0.88rem', color:'var(--text-muted)', lineHeight:1.9 }}>
            <div>Sunmount Solutions Private Limited</div>
            <div>Surya Koti, Bajekan-Sirsa Main Road</div>
            <div>Sirsa, Haryana 125055</div>
            <div style={{ marginTop:'0.6rem' }}>
              <a href="tel:+917837999222" style={{ color:'var(--sun-orange)' }}>+91 7837 999 222</a>
            </div>
            <div>
              <a href="tel:+918531999222" style={{ color:'var(--sun-orange)' }}>+91 8531 999 222</a>
            </div>
            <div><a href="mailto:sales@sunmount.in" style={{ color:'var(--sun-orange)' }}>sales@sunmount.in</a></div>
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
