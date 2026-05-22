import { Link } from 'react-router-dom'

const Footer = () => (
  <footer style={{
    background: 'var(--bg-deep)',
    borderTop: '1px solid var(--border-subtle)',
    padding: '5rem 0 2rem',
  }}>
    <div className="container">
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr',
        gap: '3rem',
        marginBottom: '4rem',
      }} className="footer-grid">
        <div>
          <div style={{ fontFamily:'Montserrat', fontWeight:900, fontSize:'1.5rem', letterSpacing:'-0.02em', marginBottom:'0.8rem' }}>
            SUN<span style={{ color:'var(--sun-orange)' }}>MOUNT</span><span style={{ fontSize:'0.65rem', verticalAlign:'super', color:'var(--text-muted)' }}>®</span>
          </div>
          <p style={{ fontFamily:'JetBrains Mono', fontSize:'0.7rem', letterSpacing:'0.15em', color:'var(--sun-orange)', marginBottom:'1.2rem', textTransform:'uppercase' }}>Quality · Stability · Infinity</p>
          <p style={{ fontSize:'0.88rem', color:'var(--text-muted)', lineHeight:1.7, maxWidth:280 }}>
            India's indigenous solar PV mounting manufacturer. ISO & MSME registered. TÜV certified. Supplying across the globe.
          </p>
        </div>
        <div>
          <h4 style={{ fontFamily:'JetBrains Mono', fontSize:'0.72rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--aluminum-mid)', marginBottom:'1.2rem' }}>Navigation</h4>
          {[{ to:'/', label:'Home' },{ to:'/#products', label:'Products' },{ to:'/#why', label:'Why Sunmount' },{ to:'/#team', label:'Team' },{ to:'/contact', label:'Contact Us' }].map(l => (
            <div key={l.label} style={{ marginBottom:'0.7rem' }}>
              <Link to={l.to} style={{ fontSize:'0.88rem', color:'var(--text-muted)', transition:'color 0.2s' }}
                onMouseEnter={e => e.target.style.color='var(--sun-orange)'}
                onMouseLeave={e => e.target.style.color='var(--text-muted)'}
              >{l.label}</Link>
            </div>
          ))}
        </div>
        <div>
          <h4 style={{ fontFamily:'JetBrains Mono', fontSize:'0.72rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--aluminum-mid)', marginBottom:'1.2rem' }}>Products</h4>
          {['MiniRail','MonoRail','Long Rail','L-Foot Clamps','Mid Clamps','End Clamps'].map(p => (
            <div key={p} style={{ marginBottom:'0.7rem' }}><span style={{ fontSize:'0.88rem', color:'var(--text-muted)' }}>{p}</span></div>
          ))}
        </div>
        <div>
          <h4 style={{ fontFamily:'JetBrains Mono', fontSize:'0.72rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--aluminum-mid)', marginBottom:'1.2rem' }}>Contact</h4>
          <div style={{ fontSize:'0.88rem', color:'var(--text-muted)', lineHeight:1.9 }}>
            <div>Begu Road, Sirsa 125055</div>
            <div>Haryana, India</div>
            <div style={{ marginTop:'0.6rem' }}><a href="tel:+917837999222" style={{ color:'var(--sun-orange)' }}>+91 7837 999 222</a></div>
            <div><a href="mailto:info@sunmount.in" style={{ color:'var(--sun-orange)' }}>info@sunmount.in</a></div>
          </div>
        </div>
      </div>
      <div style={{ paddingTop:'2rem', borderTop:'1px solid var(--border-subtle)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem' }}>
        <div style={{ fontSize:'0.78rem', color:'var(--text-muted)', fontFamily:'JetBrains Mono' }}>© {new Date().getFullYear()} SunMount® Solutions. All rights reserved.</div>
        <div style={{ display:'flex', gap:'1rem', fontFamily:'JetBrains Mono', fontSize:'0.7rem', letterSpacing:'0.1em', color:'var(--text-muted)' }}>
          <span>ISO CERTIFIED</span><span style={{ color:'var(--aluminum-edge)' }}>·</span>
          <span>TÜV CERTIFIED</span><span style={{ color:'var(--aluminum-edge)' }}>·</span>
          <span>MSME REGISTERED</span>
        </div>
      </div>
    </div>
    <style>{`.footer-grid { } @media(max-width:900px){.footer-grid{grid-template-columns:1fr 1fr!important}} @media(max-width:600px){.footer-grid{grid-template-columns:1fr!important}}`}</style>
  </footer>
)

export default Footer
