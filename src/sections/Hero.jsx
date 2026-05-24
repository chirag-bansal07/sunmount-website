import { Link } from 'react-router-dom'
import { DownloadIcon, ArrowRightIcon } from '../components/icons'

const STATS = [
  { value: '50+',  label: 'Global Locations' },
  { value: '10K+', label: 'Installations' },
  { value: '200',  label: 'km/h Wind Rated' },
  { value: '75+',  label: 'Years Team Exp.' },
]

const Hero = () => (
  <section style={{ position:'relative', height:'100vh', minHeight:600, overflow:'hidden' }}>

    {/* ── FACTORY BACKGROUND ── */}
    <img
      src="/factory.png"
      alt="SunMount Factory"
      style={{
        position:'absolute', inset:0,
        width:'100%', height:'100%',
        objectFit:'cover', objectPosition:'50% 35%',
        zIndex:0,
      }}
    />

    {/* ── GRADIENT OVERLAYS ── */}
    {/* Left-side dark for text legibility */}
    <div style={{
      position:'absolute', inset:0, zIndex:1,
      background:'linear-gradient(100deg, rgba(6,9,18,0.88) 0%, rgba(6,9,18,0.60) 50%, rgba(6,9,18,0.10) 100%)',
    }} />
    {/* Bottom fade into next section */}
    <div style={{
      position:'absolute', bottom:0, left:0, right:0, height:180, zIndex:2,
      background:'linear-gradient(0deg, var(--bg-base) 0%, transparent 100%)',
    }} />

    {/* ── CONTENT ── */}
    <div className="container" style={{
      position:'relative', zIndex:3,
      height:'100%', display:'flex', alignItems:'center',
    }}>
      <div style={{ maxWidth:620, paddingTop:'5rem' }}>

        {/* Label */}
        <div className="section-label" style={{ marginBottom:'1.4rem' }}>
          ISO 9001 · TÜV SÜD Certified · MSME Registered
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize:'clamp(2.8rem, 5.5vw, 5rem)',
          fontWeight:900, lineHeight:1.05,
          marginBottom:'1.6rem',
          letterSpacing:'-0.02em',
        }}>
          Solar Mounting<br />
          <span className="gradient-text">Structures</span><br />
          Redefined.
        </h1>

        {/* Sub-copy */}
        <p style={{
          fontSize:'1.08rem', color:'rgba(244,246,251,0.72)',
          lineHeight:1.75, marginBottom:'2.5rem', maxWidth:500,
        }}>
          India's indigenous solar PV mounting manufacturer.
          Aluminium &amp; steel structures engineered for extreme wind loads —
          supplying across the globe.
        </p>

        {/* CTAs */}
        <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap' }}>
          <Link to="/#products" className="btn-primary" style={{ fontSize:'0.9rem', padding:'1rem 2rem' }}>
            Explore Products <ArrowRightIcon />
          </Link>
          <a
            href="https://www.sunmount.in/wp-content/uploads/2024/09/Catalogue-2024-rev-2.pdf"
            target="_blank" rel="noopener noreferrer"
            className="btn-secondary"
            style={{ fontSize:'0.9rem', padding:'1rem 2rem', background:'rgba(6,9,18,0.55)', backdropFilter:'blur(8px)' }}
          >
            <DownloadIcon /> Download Catalogue
          </a>
        </div>
      </div>
    </div>

    {/* ── STATS BAR ── */}
    <div style={{
      position:'absolute', bottom:0, left:0, right:0, zIndex:4,
      background:'rgba(6,9,18,0.78)', backdropFilter:'blur(16px)',
      borderTop:'1px solid rgba(255,255,255,0.07)',
    }}>
      <div className="container">
        <div style={{
          display:'grid', gridTemplateColumns:'repeat(4,1fr)',
          gap:'1rem', padding:'1.4rem 0', textAlign:'center',
        }} className="stats-grid">
          {STATS.map((s, i) => (
            <div key={i}>
              <div style={{
                fontFamily:'Montserrat', fontSize:'2.1rem', fontWeight:900,
                color:'var(--sun-orange)', lineHeight:1, marginBottom:'0.25rem',
              }}>{s.value}</div>
              <div style={{
                fontSize:'0.72rem', color:'rgba(255,255,255,0.5)',
                letterSpacing:'0.08em', textTransform:'uppercase', fontFamily:'JetBrains Mono',
              }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <style>{`@media(max-width:600px){.stats-grid{grid-template-columns:repeat(2,1fr)!important}}`}</style>
  </section>
)

export default Hero
