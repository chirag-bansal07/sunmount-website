import { useState, Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, PerspectiveCamera, ContactShadows, OrbitControls } from '@react-three/drei'
import { MiniRail, MonoRail, LongRail, SeamClamp, InclinedRail } from '../three/RailModels'
import { ArrowRightIcon, DownloadIcon } from '../components/icons'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

/* ── PRODUCT DATA (from SunMount catalogue 2024) ──────────────── */
const PRODUCTS = [
  {
    id: 'mono',
    name: 'Mono Rail System',
    short: 'Portrait · Trapezoidal Roofs',
    tag: 'PORTRAIT',
    badge: 'Best Seller',
    tagline: 'The most popular portrait-mounting rail for trapezoidal metal roofs — high-capacity, wind-certified, easy to install.',
    desc: 'The Mono Rail System is a precision-extruded T-slot aluminium profile for mounting solar PV panels in portrait orientation on trapezoidal metal sheet roofs. A single-rail design reduces material usage and installation time without compromising structural performance. Roof clearance of 100 mm allows for natural ventilation and panel cooling. Rivet-and-EPDM tape attachment preserves the roof membrane; a structural-adhesive option is available for non-penetrative installation.',
    Component: MonoRail,
    specs: [
      { label: 'Profile Height',         value: '70 mm' },
      { label: 'Length',                  value: 'Customised per crest-to-crest distance' },
      { label: 'Roof Clearance',          value: '100 mm' },
      { label: 'Panel Thickness',         value: '30 mm · 35 mm · 40 mm' },
      { label: 'Material',                value: 'Aluminium 6063 T6 · SS 304 · EPDM' },
      { label: 'Design Wind Speed',       value: 'Up to 200 km/h' },
      { label: 'Orientation',             value: 'Portrait' },
      { label: 'Finish',                  value: 'Anodized / Non-anodized' },
    ],
    highlights: [
      'Lightweight & optimised single-rail design',
      'Portrait orientation — maximum module capacity per row',
      'Works with any trapezoidal sheet crest width',
      'Roof clearance of 100 mm for ventilation & cooling',
      'Rivet + EPDM tape or non-penetrative structural adhesive',
      'U-clamp / mid-clamp panel attachment',
      'Compatible with all PV module brands',
      'Easy installation & long-term maintenance',
    ],
    applications: ['Commercial rooftop', 'Industrial shed', 'Large residential', 'Warehouse'],
  },
  {
    id: 'mini',
    name: 'Mini Rail System',
    short: 'Landscape · Residential',
    tag: 'LANDSCAPE',
    badge: 'Cost Effective',
    tagline: 'Low-profile, compact and cost-effective — the first choice for residential & light commercial projects.',
    desc: 'The Mini Rail System is a low-profile aluminium extrusion engineered for landscape-orientation solar PV panels on trapezoidal metal sheet roofs. Its compact 68 mm height and lightweight construction minimise raw material usage, keeping project costs down. The 100 mm roof clearance ensures natural ventilation. Z-clamp or end-clamp attachment accommodates 30–40 mm panel frames without additional tools.',
    Component: MiniRail,
    specs: [
      { label: 'Profile Height',    value: '68 mm' },
      { label: 'Length',            value: '100 mm (standard)' },
      { label: 'Roof Clearance',    value: '100 mm' },
      { label: 'Panel Thickness',   value: '30 mm · 35 mm · 40 mm' },
      { label: 'Material',          value: 'Aluminium 6063 T6 · SS 304 · EPDM' },
      { label: 'Design Wind Speed', value: 'Up to 200 km/h' },
      { label: 'Orientation',       value: 'Landscape' },
      { label: 'Finish',            value: 'Anodized / Non-anodized' },
    ],
    highlights: [
      'Low-profile 68 mm height — minimal visual impact',
      'Landscape panel orientation',
      'Roof clearance of 100 mm for ventilation',
      'Minimal raw material usage',
      'Z-clamp or end-clamp panel attachment',
      'Rivet + EPDM tape or non-penetrative option',
      'Compatible with all PV module brands',
      'Fastest installation time in the rail range',
    ],
    applications: ['Residential rooftop', 'Light commercial', 'Warehouse', 'Industrial shed'],
  },
  {
    id: 'long',
    name: 'Long Rail System',
    short: 'Portrait & Landscape · Industrial',
    tag: 'PORTRAIT / LANDSCAPE',
    badge: 'High Strength',
    tagline: 'Heavy-duty purlin-mounted rail for high wind loads, industrial buildings and asbestos cement roofs.',
    desc: 'The Long Rail System is a robust, purlin-mounted aluminium extrusion available in two heights — Long Rail PRO (50 mm) for portrait orientation and Long Rail LITE (30 mm) for landscape. Both variants mount directly on purlins, requiring far fewer roof penetrations than Mini or Mono Rail systems. Existing self-drilling screw holes on asbestos sheets can be reused. Universal rail profiles accept any roof crest width, and the structure is rated for high wind-load environments.',
    Component: LongRail,
    specs: [
      { label: 'Long Rail PRO Height', value: '50 mm (Portrait)' },
      { label: 'Long Rail LITE Height',value: '30 mm (Landscape)' },
      { label: 'Length',               value: 'Customised' },
      { label: 'Panel Thickness',      value: '30 mm · 35 mm · 40 mm' },
      { label: 'Material',             value: 'Aluminium 6063 T6 · SS 304 · EPDM' },
      { label: 'Design Wind Speed',    value: 'Up to 200 km/h' },
      { label: 'Mounting',             value: 'Purlin-mounted' },
      { label: 'Finish',               value: 'Anodized / Non-anodized' },
    ],
    highlights: [
      'Two variants: PRO (50 mm portrait) & LITE (30 mm landscape)',
      'Purlin-mounted — far fewer roof penetrations',
      'Reuses existing self-drilling screw holes',
      'Compatible with asbestos cement sheet roofs (J-bolts)',
      'Universal rails for any roof crest profile',
      'High wind-load capacity — FEA certified',
      'Easy installation & maintenance',
      'Compatible with all PV module brands',
    ],
    applications: ['Industrial shed', 'Asbestos roof', 'Heavy commercial', 'Purlin-frame buildings'],
  },
  {
    id: 'seam',
    name: 'Standing Seam System',
    short: 'Landscape · Zero Penetration',
    tag: 'LANDSCAPE',
    badge: 'No Puncture',
    tagline: 'Clamp-based system for standing seam roofs — zero roof penetration, full warranty preservation.',
    desc: 'The Standing Seam System uses precision-engineered seam clamps that grip the standing seam roof profile without any drilling or puncturing. Grub screws lock the clamp firmly onto the seam, and U-clamps or mid-clamps then fix the solar panel frames. Zero roof penetration preserves the roofing manufacturer\'s warranty, eliminates leak risk entirely, and makes this the fastest-installing system in the SunMount range.',
    Component: SeamClamp,
    specs: [
      { label: 'Clamp Height',      value: '55 mm' },
      { label: 'Clamp Length',      value: '60 mm' },
      { label: 'Panel Thickness',   value: '30 mm · 35 mm · 40 mm' },
      { label: 'Material',          value: 'Aluminium 6063 T6 · SS 304 · EPDM' },
      { label: 'Design Wind Speed', value: 'Up to 200 km/h' },
      { label: 'Roof Penetration',  value: 'Zero — clamp-based only' },
      { label: 'Orientation',       value: 'Landscape' },
      { label: 'Finish',            value: 'Anodized / Non-anodized' },
    ],
    highlights: [
      'Zero roof penetration — preserves manufacturer warranty',
      'Seam clamp fixed with grub screws, no drilling',
      'Landscape panel orientation',
      'Compatible with all standing seam roof profiles',
      'U-clamp or mid-clamp panel attachment',
      'Fastest installation in the SunMount range',
      'No leak risk — clamp-only fixing',
      'Compatible with all PV module brands',
    ],
    applications: ['Standing seam factory', 'Architectural warehouse', 'Premium commercial', 'High-end residential'],
  },
  {
    id: 'inclined',
    name: 'Inclined System',
    short: 'Portrait · Adjustable Tilt',
    tag: 'PORTRAIT',
    badge: 'Adjustable Tilt',
    tagline: 'Tilted mounting structure for flat or low-pitch roofs — optimises south-facing generation up to 20° tilt.',
    desc: 'The Inclined System uses specially designed L-channel and C-channel aluminium structures to tilt solar PV panels at an angle on flat or low-pitch trapezoidal metal and asbestos roofs. Panels face south regardless of roof orientation, maximising energy yield. The inclination is adjustable from 5° to 20° depending on site latitude and requirements. The system is purlin-mounted and compatible with existing J-bolt holes on asbestos roofs.',
    Component: InclinedRail,
    specs: [
      { label: 'C-Channel Height',  value: '50 mm' },
      { label: 'Length',            value: 'Customised' },
      { label: 'Tilt Angle',        value: '5° to 20° (adjustable)' },
      { label: 'Panel Thickness',   value: '30 mm · 35 mm · 40 mm' },
      { label: 'Material',          value: 'Aluminium 6063 T6 · SS 304 · EPDM' },
      { label: 'Design Wind Speed', value: 'Up to 170 km/h' },
      { label: 'Orientation',       value: 'Portrait · South-facing' },
      { label: 'Finish',            value: 'Anodized / Non-anodized' },
    ],
    highlights: [
      'Higher energy yield — panels always face south',
      'Suitable for north-, east- or west-facing roofs',
      'Adjustable tilt from 5° to 20°',
      'Portrait orientation, purlin-mounted',
      'Works on metal roofs (self-drilling screws)',
      'Compatible with asbestos roofs via existing J-bolts',
      'Universal rails for any roof crest profile',
      'Easy installation & maintenance',
    ],
    applications: ['Flat industrial roof', 'Low-pitch residential', 'North/East/West-facing roofs', 'Asbestos cement roof'],
  },
]

/* ── ACCESSORIES ──────────────────────────────────────────────── */
const ACCESSORIES = [
  { name: 'U-Clamp',        material: 'Aluminium 6063 T6',  image: '/accessories/u-clamp.png',       features: ['Quick & easy installation', 'High strength', 'All PV modules'] },
  { name: 'Z-Clamp',        material: 'Aluminium 6063 T6',  image: '/accessories/z-clamp.png',       features: ['30 / 35 / 40 mm modules', 'Cost-effective', 'Long-lasting'] },
  { name: 'L-Clamp',        material: 'Aluminium 6063 T6',  image: '/accessories/l-clamp.png',       features: ['Robust construction', 'Universal PV compat.', 'Budget-friendly'] },
  { name: 'Rail Nut',       material: 'Aluminium 6063 T6',  image: '/accessories/rail-nut.png',      features: ['Works with all rails', 'High strength', 'Extended lifespan'] },
  { name: 'Flange Nut',     material: 'SS 304',              image: '/accessories/flange-nut.png',    features: ['Superior strength', 'Durable construction', 'Easy removal'] },
  { name: 'Spring Washer',  material: 'SS 304',              image: '/accessories/spring-washer.png', features: ['Prevents nut loosening', 'Reinforces joints', 'Minimal maintenance'] },
  { name: 'Allen Key Bolt', material: 'SS 304',              image: '/accessories/allen-bolt.png',    features: ['Strong & durable', 'Quick installation', 'Low maintenance'] },
  { name: 'T-Bolt',         material: 'SS 304',              image: '/accessories/t-bolt.png',        features: ['T-slot compatible', 'Robust & long-lasting', 'Easy upkeep'] },
  { name: 'Hex Bolt',       material: 'SS 304',              image: '/accessories/hex-bolt.png',      features: ['High strength', 'Extended lifespan', 'Simple maintenance'] },
  { name: 'SDS Screw',      material: 'Xylan Coated',        image: '/accessories/sds-screw.png',     features: ['One-tool approach', 'Self-drilling', 'Cost-effective'] },
  { name: 'Rivet',          material: 'Aluminium',           image: '/accessories/rivet.png',         features: ['Strong & affordable', 'Industry standard', 'Durable'] },
  { name: 'EPDM Tape',      material: '100% Genuine EPDM',   image: '/accessories/epdm-tape.png',     features: ['ASTM tested', 'Moisture & heat resistant', 'Good electrical resistivity'] },
]

/* ── 3D HELPERS ───────────────────────────────────────────────── */
function RailCanvas({ Component }) {
  return (
    <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
      <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={38} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 4, 2]} intensity={2.0} color="#FBB034" />
      <directionalLight position={[-3, 1, -2]} intensity={0.7} color="#6090d4" />
      <directionalLight position={[0, 3, -4]} intensity={0.5} color="#ffffff" />
      <Suspense fallback={null}>
        <Component />
        <Environment preset="sunset" />
      </Suspense>
      <ContactShadows position={[0, -0.8, 0]} opacity={0.40} scale={6} blur={2.5} far={3} />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.2} makeDefault />
    </Canvas>
  )
}

/* ── MAIN PAGE ─────────────────────────────────────────────────── */
const VALID_IDS = PRODUCTS.map(p => p.id)

export default function Products() {
  const { hash } = useLocation()
  const hashId   = hash.replace('#', '')
  const [selected, setSelected] = useState(VALID_IDS.includes(hashId) ? hashId : 'mono')

  useEffect(() => {
    if (VALID_IDS.includes(hashId)) setSelected(hashId)
  }, [hashId])

  const product = PRODUCTS.find(p => p.id === selected)

  return (
    <main style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--bg-base)' }}>

      {/* ── PAGE HEADER ── */}
      <div style={{
        padding: '2.5rem 0 2rem',
        background: 'linear-gradient(180deg, var(--bg-deep) 0%, var(--bg-base) 100%)',
        borderBottom: '1px solid var(--border-subtle)', position: 'relative',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--gradient-sun)' }} />
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
            <div className="section-label">COMPLETE PRODUCT RANGE</div>
            <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', maxWidth: 520, lineHeight: 1.15 }}>
              Precision Mounting <span className="gradient-text">Systems Catalogue</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.75rem', maxWidth: 560, fontSize: '0.92rem', lineHeight: 1.7 }}>
              Five aluminium extrusion systems for every Indian roof type — ISO 9001 &amp; TÜV SÜD certified,
              rated up to 200 km/h wind speed.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── MAIN CONTENT: SIDEBAR + DETAIL ── */}
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '270px 1fr', gap: '2.5rem', padding: '2.5rem 2rem', alignItems: 'start' }} className="prod-layout">

          {/* ── Sidebar ── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            style={{ position: 'sticky', top: 108 }}
          >
            {PRODUCTS.map((p, i) => {
              const active = p.id === selected
              return (
                <button key={p.id} onClick={() => setSelected(p.id)} style={{
                  width: '100%', textAlign: 'left',
                  padding: '1rem 1.2rem', marginBottom: '0.4rem',
                  background: active
                    ? 'linear-gradient(135deg,rgba(224,85,64,0.14) 0%,rgba(232,146,58,0.07) 100%)'
                    : 'var(--bg-elevated)',
                  border: `1px solid ${active ? 'var(--border-accent)' : 'var(--border-subtle)'}`,
                  borderLeft: `3px solid ${active ? 'var(--sun-orange)' : 'transparent'}`,
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
                }}>
                  <div style={{ fontFamily:'JetBrains Mono', fontSize:'0.56rem', letterSpacing:'0.18em',
                    color: active ? 'var(--sun-orange)' : 'var(--text-muted)',
                    textTransform:'uppercase', marginBottom:'0.25rem' }}>
                    0{i + 1} · {p.tag}
                  </div>
                  <div style={{ fontFamily:'Montserrat', fontSize:'0.86rem', fontWeight:700,
                    color: active ? 'var(--text-primary)' : 'var(--text-secondary)', marginBottom:'0.12rem' }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', fontFamily:'JetBrains Mono', letterSpacing:'0.04em' }}>
                    {p.short}
                  </div>
                </button>
              )
            })}

            <a href="https://www.sunmount.in/wp-content/uploads/2024/09/Catalogue-2024-rev-2.pdf"
              target="_blank" rel="noopener noreferrer" className="btn-primary"
              style={{ width:'100%', justifyContent:'center', fontSize:'0.78rem', marginTop:'1.2rem', padding:'0.85rem 1rem' }}>
              <DownloadIcon /> Download Catalogue
            </a>
          </motion.div>

          {/* ── Detail panel ── */}
          <AnimatePresence mode="wait">
            <motion.div key={selected}
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }}
              transition={{ duration:0.45, ease:[0.16,1,0.3,1] }}>

              {/* 3D canvas */}
              <div style={{
                height: 360, position:'relative', marginBottom:'2.5rem',
                background:'radial-gradient(ellipse at 50% 70%,rgba(224,85,64,0.07) 0%,transparent 70%)',
                border:'1px solid var(--border-subtle)', cursor:'grab',
              }}>
                <RailCanvas Component={product.Component} />
                <div style={{
                  position:'absolute', bottom:'1rem', right:'1.2rem',
                  fontFamily:'JetBrains Mono', fontSize:'0.6rem', letterSpacing:'0.14em',
                  color:'var(--text-muted)', textTransform:'uppercase', pointerEvents:'none',
                }}>↻ Drag to rotate</div>
              </div>

              {/* Product header */}
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between',
                gap:'1rem', flexWrap:'wrap', marginBottom:'1rem' }}>
                <div>
                  <div style={{ display:'flex', gap:'0.5rem', marginBottom:'0.75rem', flexWrap:'wrap' }}>
                    <span style={{ padding:'0.22rem 0.65rem', background:'rgba(224,85,64,0.12)',
                      border:'1px solid var(--border-accent)', borderRadius:2,
                      fontFamily:'JetBrains Mono', fontSize:'0.6rem', letterSpacing:'0.12em',
                      color:'var(--sun-orange)', textTransform:'uppercase' }}>{product.tag}</span>
                    {product.badge && (
                      <span style={{ padding:'0.22rem 0.65rem', background:'rgba(201,212,224,0.07)',
                        border:'1px solid var(--border-subtle)', borderRadius:2,
                        fontFamily:'JetBrains Mono', fontSize:'0.6rem', letterSpacing:'0.12em',
                        color:'var(--aluminum-mid)', textTransform:'uppercase' }}>{product.badge}</span>
                    )}
                  </div>
                  <h2 style={{ fontSize:'clamp(1.8rem,3.5vw,2.6rem)', marginBottom:'0.5rem' }}>{product.name}</h2>
                  <p style={{ fontSize:'0.95rem', color:'var(--sun-yellow)', fontFamily:'JetBrains Mono', letterSpacing:'0.03em', lineHeight:1.5 }}>
                    {product.tagline}
                  </p>
                </div>
                <Link to="/contact" className="btn-primary" style={{ flexShrink:0, fontSize:'0.82rem', padding:'0.85rem 1.5rem' }}>
                  Get a Quote <ArrowRightIcon />
                </Link>
              </div>

              {/* Description */}
              <p style={{ color:'var(--text-secondary)', fontSize:'0.95rem', lineHeight:1.85,
                marginBottom:'2.5rem', borderLeft:'2px solid var(--border-accent)', paddingLeft:'1.2rem' }}>
                {product.desc}
              </p>

              {/* Specs + Highlights grid */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2rem' }} className="prod-detail-grid">

                <div>
                  <h3 style={{ fontFamily:'JetBrains Mono', fontSize:'0.7rem', letterSpacing:'0.2em',
                    color:'var(--aluminum-mid)', textTransform:'uppercase', marginBottom:'1rem' }}>
                    // Technical Specifications
                  </h3>
                  <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
                    {product.specs.map((s, i) => (
                      <div key={i} style={{
                        display:'flex', justifyContent:'space-between', gap:'1rem',
                        padding:'0.65rem 0.9rem',
                        background: i % 2 === 0 ? 'var(--bg-elevated)' : 'transparent',
                        border:'1px solid var(--border-subtle)',
                        borderTop: i === 0 ? '1px solid var(--border-subtle)' : 'none',
                      }}>
                        <span style={{ fontFamily:'JetBrains Mono', fontSize:'0.68rem', letterSpacing:'0.06em', color:'var(--text-muted)', whiteSpace:'nowrap' }}>
                          {s.label}
                        </span>
                        <span style={{ fontSize:'0.8rem', color:'var(--text-primary)', fontWeight:600, textAlign:'right' }}>
                          {s.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 style={{ fontFamily:'JetBrains Mono', fontSize:'0.7rem', letterSpacing:'0.2em',
                    color:'var(--aluminum-mid)', textTransform:'uppercase', marginBottom:'1rem' }}>
                    // Key Highlights
                  </h3>
                  <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem', marginBottom:'2rem' }}>
                    {product.highlights.map((h, i) => (
                      <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'0.7rem', fontSize:'0.86rem', color:'var(--text-secondary)' }}>
                        <div style={{ width:5, height:5, background:'var(--sun-orange)', marginTop:5, flexShrink:0 }} />
                        {h}
                      </div>
                    ))}
                  </div>

                  <h3 style={{ fontFamily:'JetBrains Mono', fontSize:'0.7rem', letterSpacing:'0.2em',
                    color:'var(--aluminum-mid)', textTransform:'uppercase', marginBottom:'0.75rem' }}>
                    // Ideal Applications
                  </h3>
                  <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
                    {product.applications.map(app => (
                      <span key={app} style={{
                        padding:'0.3rem 0.75rem',
                        background:'rgba(201,212,224,0.06)', border:'1px solid var(--border-subtle)',
                        fontFamily:'JetBrains Mono', fontSize:'0.63rem', letterSpacing:'0.08em',
                        color:'var(--aluminum-mid)', textTransform:'uppercase',
                      }}>{app}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div style={{ display:'flex', gap:'1rem', marginTop:'2.5rem', paddingTop:'2rem',
                borderTop:'1px solid var(--border-subtle)', flexWrap:'wrap' }}>
                <Link to="/contact" className="btn-primary" style={{ fontSize:'0.88rem' }}>
                  Request a Quote <ArrowRightIcon />
                </Link>
                <a href="https://www.sunmount.in/wp-content/uploads/2024/09/Catalogue-2024-rev-2.pdf"
                  target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ fontSize:'0.88rem' }}>
                  <DownloadIcon /> Download Full Catalogue
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        @media(max-width:960px) {
          .prod-layout { grid-template-columns:1fr !important; padding:2rem 1.25rem !important; }
          .prod-layout > div:first-child { position:static !important; display:flex; flex-wrap:wrap; gap:0.5rem; }
          .prod-layout > div:first-child button { width:auto !important; flex:1 1 130px; }
          .prod-detail-grid { grid-template-columns:1fr !important; }
          .acc-grid { grid-template-columns:repeat(2,1fr) !important; }
        }
        @media(max-width:560px) {
          .acc-grid { grid-template-columns:1fr !important; }
        }
      `}</style>

      {/* ── ACCESSORIES ── */}
      <section style={{ background:'var(--bg-deep)', borderTop:'1px solid var(--border-subtle)', padding:'4rem 0 5rem' }}>
        <div className="container">
          <motion.div
            initial={{ opacity:0, y:28 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true, margin:'-80px' }}
            transition={{ duration:0.7, ease:[0.16,1,0.3,1] }}
            style={{ textAlign:'center', maxWidth:640, margin:'0 auto 3rem' }}>
            <div className="section-label" style={{ display:'inline-flex' }}>ACCESSORIES &amp; HARDWARE</div>
            <h2 style={{ fontSize:'clamp(1.9rem,3.5vw,2.8rem)', marginBottom:'1rem' }}>
              Complete the System with <span className="gradient-text">Certified Hardware</span>
            </h2>
            <p style={{ color:'var(--text-secondary)', fontSize:'0.95rem', lineHeight:1.7 }}>
              High-grade Aluminium 6063 T6 and SS 304 stainless steel accessories — designed to pair with every SunMount rail system.
            </p>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="show" viewport={{ once:true, margin:'-60px' }}
            variants={{ hidden:{}, show:{ transition:{ staggerChildren:0.06 } } }}
            className="acc-grid"
            style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem' }}>
            {ACCESSORIES.map((acc, i) => (
              <motion.div key={acc.name}
                variants={{ hidden:{opacity:0,y:24}, show:{opacity:1,y:0,transition:{duration:0.55,ease:[0.16,1,0.3,1]}} }}
                className="acc-card"
                style={{
                  padding:'1.4rem 1.2rem',
                  background:'linear-gradient(180deg,var(--bg-elevated) 0%,var(--bg-surface) 100%)',
                  border:'1px solid var(--border-subtle)',
                  position:'relative', overflow:'hidden',
                  transition:'all 0.4s cubic-bezier(0.16,1,0.3,1)',
                  display:'flex', flexDirection:'column',
                }}>
                <div className="acc-line" style={{ position:'absolute', top:0, left:0, height:2, width:0, background:'var(--gradient-sun)', transition:'width 0.5s cubic-bezier(0.16,1,0.3,1)' }} />

                <div style={{ fontFamily:'JetBrains Mono', fontSize:'0.56rem', letterSpacing:'0.15em', color:'var(--text-muted)', marginBottom:'0.75rem' }}>
                  / {String(i + 1).padStart(2, '0')}
                </div>

                {/* Product image — transparent bg PNG shown directly on card */}
                <div style={{ width:72, height:72, marginBottom:'0.9rem', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <img
                    src={acc.image} alt={acc.name}
                    style={{ width:68, height:68, objectFit:'contain', filter:'drop-shadow(0 2px 8px rgba(0,0,0,0.45))' }}
                  />
                </div>

                <h3 style={{ fontSize:'0.93rem', fontWeight:800, letterSpacing:'0.02em', marginBottom:'0.3rem', color:'var(--text-primary)' }}>
                  {acc.name}
                </h3>
                <div style={{ fontFamily:'JetBrains Mono', fontSize:'0.6rem', letterSpacing:'0.08em', color:'var(--sun-orange)', marginBottom:'0.85rem' }}>
                  {acc.material}
                </div>

                <div style={{ display:'flex', flexDirection:'column', gap:'0.28rem', marginTop:'auto' }}>
                  {acc.features.map((f, fi) => (
                    <div key={fi} style={{ display:'flex', alignItems:'flex-start', gap:'0.45rem', fontSize:'0.74rem', color:'var(--text-muted)' }}>
                      <div style={{ width:3, height:3, background:'var(--aluminum-dark)', marginTop:5, flexShrink:0 }} />
                      {f}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <style>{`
          .acc-card:hover { border-color:var(--border-accent) !important; transform:translateY(-4px); }
          .acc-card:hover .acc-line { width:100% !important; }
        `}</style>
      </section>
    </main>
  )
}
