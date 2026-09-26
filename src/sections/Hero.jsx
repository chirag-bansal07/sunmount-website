import { Link } from 'react-router-dom'
import { DownloadIcon, ArrowRightIcon } from '../components/icons'
import { m } from 'framer-motion'

const STATS = [
  { value: '50+',  label: 'Global Locations' },
  { value: '10K+', label: 'Installations' },
  { value: '200',  label: 'km/h Wind Rated' },
  { value: '75+',  label: 'Years Team Exp.' },
]

const Hero = () => (
  <section style={{ position:'relative', height:'100vh', minHeight:600, overflow:'hidden' }}>

    {/* ── FACTORY BACKGROUND (LCP image — WebP w/ PNG fallback, high priority) ── */}
    <picture>
      <source
        type="image/webp"
        srcSet="/factory-640.webp 640w, /factory-960.webp 960w, /factory-1280.webp 1280w, /factory-1600.webp 1600w"
        sizes="100vw"
      />
      <img
        src="/factory.png"
        alt="SunMount solar mounting structures manufacturing facility"
        width="1600" height="900"
        fetchPriority="high"
        decoding="async"
        style={{
          position:'absolute', inset:0,
          width:'100%', height:'100%',
          objectFit:'cover', objectPosition:'50% 35%',
          zIndex:0,
        }}
      />
    </picture>

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

    {/* ── CONTENT ── (entrance slides only, never opacity 0: the H1 is the LCP element and must paint from the prerendered HTML) */}
    <div className="container hero-container" style={{
      position:'relative', zIndex:3,
      height:'100%', display:'flex', alignItems:'center',
    }}>
      <m.div
        className="hero-content-wrap"
        style={{ maxWidth:620, paddingTop:'5rem' }}
        initial={{ y:44 }}
        animate={{ y:0 }}
        transition={{ duration:1, ease:[0.16,1,0.3,1] }}
      >

        {/* Label */}
        <m.div
          className="section-label" style={{ marginBottom:'1.4rem' }}
          initial={{ y:8 }} animate={{ y:0 }} transition={{ delay:0.2, duration:0.7 }}
        >
          ISO 9001 · TÜV SÜD Certified · MSME Registered
        </m.div>

        {/* Headline */}
        <m.h1
          style={{
            fontSize:'clamp(2.8rem, 5.5vw, 5rem)',
            fontWeight:900, lineHeight:1.05,
            marginBottom:'1.6rem',
            letterSpacing:'-0.02em',
          }}
          initial={{ y:24 }} animate={{ y:0 }}
          transition={{ delay:0.15, duration:0.9, ease:[0.16,1,0.3,1] }}
        >
          Solar Mounting<br />
          <span className="gradient-text">Structures</span><br />
          Redefined.
        </m.h1>

        {/* Sub-copy */}
        <m.p
          style={{
            fontSize:'1.08rem', color:'rgba(244,246,251,0.72)',
            lineHeight:1.75, marginBottom:'2.5rem', maxWidth:500,
          }}
          initial={{ y:16 }} animate={{ y:0 }}
          transition={{ delay:0.3, duration:0.8, ease:[0.16,1,0.3,1] }}
        >
          India's indigenous solar PV mounting manufacturer.
          Aluminium &amp; steel structures engineered for extreme wind loads —
          supplying across the globe.
        </m.p>

        {/* CTAs */}
        <m.div
          style={{ display:'flex', gap:'1rem', flexWrap:'wrap' }}
          initial={{ y:16 }} animate={{ y:0 }}
          transition={{ delay:0.45, duration:0.8, ease:[0.16,1,0.3,1] }}
        >
          <Link to="/products" className="btn-primary" style={{ fontSize:'0.9rem', padding:'1rem 2rem' }}>
            Explore Products <ArrowRightIcon />
          </Link>
          <a
            href="/catalogue.pdf"
            target="_blank" rel="noopener noreferrer"
            className="btn-secondary"
            style={{ fontSize:'0.9rem', padding:'1rem 2rem', background:'rgba(6,9,18,0.55)', backdropFilter:'blur(8px)' }}
          >
            <DownloadIcon /> Download Catalogue
          </a>
        </m.div>
      </m.div>
    </div>

    {/* ── STATS BAR ── */}
    <m.div
      style={{
        position:'absolute', bottom:0, left:0, right:0, zIndex:4,
        background:'rgba(6,9,18,0.78)', backdropFilter:'blur(16px)',
        borderTop:'1px solid rgba(255,255,255,0.07)',
      }}
      initial={{ y:20 }} animate={{ y:0 }}
      transition={{ delay:0.7, duration:0.8, ease:[0.16,1,0.3,1] }}
    >
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
                fontSize:'0.72rem', color:'rgba(255,255,255,0.75)',
                letterSpacing:'0.08em', textTransform:'uppercase', fontFamily:'JetBrains Mono',
              }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </m.div>

    <style>{`
      @media(max-width:768px){
        .stats-grid{ grid-template-columns:repeat(2,1fr)!important; }
        .hero-container{ align-items:flex-start!important; }
        .hero-content-wrap{
          padding-top:6rem!important;
          padding-bottom:6rem!important;
        }
        .hero-content-wrap h1{ font-size:clamp(2rem,9vw,3rem)!important; margin-bottom:1rem!important; }
        .hero-content-wrap p{ font-size:0.93rem!important; margin-bottom:1.5rem!important; }
      }
      /* iPhone SE and other very small phones */
      @media(max-width:768px) and (max-height:680px){
        .hero-content-wrap{
          padding-top:5rem!important;
          padding-bottom:5.5rem!important;
        }
        .hero-content-wrap h1{ font-size:1.9rem!important; margin-bottom:0.7rem!important; line-height:1.1!important; }
        .hero-content-wrap p{ font-size:0.85rem!important; margin-bottom:1rem!important; display:-webkit-box!important; -webkit-line-clamp:2!important; -webkit-box-orient:vertical!important; overflow:hidden!important; }
        .hero-content-wrap .section-label{ margin-bottom:0.8rem!important; font-size:0.65rem!important; }
        .stats-grid{ padding:0.8rem 0!important; }
        .stats-grid > div > div:first-child{ font-size:1.5rem!important; }
      }
    `}</style>
  </section>
)

export default Hero
