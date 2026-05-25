import { useState, useRef, Suspense, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, PerspectiveCamera, ContactShadows } from '@react-three/drei'
import { MiniRail, MonoRail, LongRail } from '../three/RailModels'
import { ArrowRightIcon, DownloadIcon } from '../components/icons'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

/* ── DATA ─────────────────────────────────────────────────────── */
const PRODUCTS = [
  {
    id: 'mono',
    name: 'Mono Rail System',
    short: 'Portrait · Trapezoidal Roofs',
    tag: 'PORTRAIT',
    badge: 'Best Seller',
    tagline: 'The most popular rail for trapezoidal metal roofs — portrait-oriented, high-capacity, and wind-certified.',
    desc: 'The Mono Rail System uses a precision-extruded T-slot aluminium profile to mount solar panels in portrait orientation on trapezoidal metal sheet roofs. Its single-rail efficiency minimises material usage and installation time while maintaining structural integrity against 200 km/h wind loads.',
    Component: MonoRail,
    specs: [
      { label: 'Profile Height',    value: '70 mm' },
      { label: 'Length',            value: 'Custom (standard: 4.2 m)' },
      { label: 'Material',          value: 'Aluminium 6063 T6 · SS 304 · EPDM' },
      { label: 'Design Wind Speed', value: 'Up to 200 km/h' },
      { label: 'Orientation',       value: 'Portrait' },
      { label: 'Finish',            value: 'Anodized / Non-anodized' },
    ],
    highlights: [
      'Optimised for any roof crest width',
      'Portrait orientation — high module capacity',
      'Roof clearance of 100 mm',
      'Easy installation & maintenance',
      'Compatible with all PV module brands',
    ],
    applications: ['Commercial rooftop', 'Industrial shed', 'Large residential'],
  },
  {
    id: 'mini',
    name: 'Mini Rail System',
    short: 'Landscape · Residential',
    tag: 'LANDSCAPE',
    badge: 'Cost Effective',
    tagline: 'Low-profile, compact and cost-effective — the first choice for residential & light commercial projects.',
    desc: 'The Mini Rail System is a low-profile, compact aluminium extrusion designed for landscape-orientation solar panels on trapezoidal metal sheet roofs. Its reduced height and lightweight construction make it the most cost-effective solution for residential and light commercial rooftop projects.',
    Component: MiniRail,
    specs: [
      { label: 'Profile Height',    value: '68 mm' },
      { label: 'Length',            value: '100 mm (standard)' },
      { label: 'Material',          value: 'Aluminium 6063 T6 · SS 304 · EPDM' },
      { label: 'Design Wind Speed', value: 'Up to 200 km/h' },
      { label: 'Orientation',       value: 'Landscape' },
      { label: 'Finish',            value: 'Anodized / Non-anodized' },
    ],
    highlights: [
      'Low-profile & lightweight design',
      'Landscape panel orientation',
      'Roof clearance of 100 mm',
      'Minimal raw material usage',
      'Fastest installation in the range',
    ],
    applications: ['Residential rooftop', 'Light commercial', 'Warehouse'],
  },
  {
    id: 'long',
    name: 'Long Rail System',
    short: 'Portrait · Industrial Grade',
    tag: 'PORTRAIT',
    badge: 'High Strength',
    tagline: 'Heavy-duty, purlin-mounted rail for high wind loads, industrial roofs and asbestos sheets.',
    desc: 'The Long Rail System is a heavy-duty aluminium extrusion mounted directly on purlins. It requires fewer roof penetrations than Mini or Mono Rail systems, making it ideal for industrial buildings, asbestos cement roofs, and environments with extreme wind load requirements.',
    Component: LongRail,
    specs: [
      { label: 'Material',          value: 'Aluminium 6063 T6 · SS 304 · EPDM' },
      { label: 'Design Wind Speed', value: 'Up to 200 km/h' },
      { label: 'Mounting',          value: 'Purlin-mounted' },
      { label: 'Orientation',       value: 'Portrait' },
      { label: 'Finish',            value: 'Anodized / Non-anodized' },
      { label: 'Roof Types',        value: 'Asbestos · Metal sheet · Industrial' },
    ],
    highlights: [
      'Fewer roof punctures required',
      'Uses existing self-drilling screw holes',
      'Suitable for asbestos & aged roofs',
      'Universal for any roof crest profile',
      'FEA & wind load analysis certified',
    ],
    applications: ['Industrial shed', 'Asbestos roof', 'Heavy commercial'],
  },
  {
    id: 'seam',
    name: 'Standing Seam System',
    short: 'Landscape · Zero Penetration',
    tag: 'LANDSCAPE',
    badge: 'No Puncture',
    tagline: 'Clamp-based system for standing seam roofs — zero roof penetration, preserves warranty.',
    desc: 'The Standing Seam System uses precision-engineered seam clamps that grip the standing seam roof profile without any drilling or roof puncturing. This preserves the roof manufacturer\'s warranty, eliminates leak risk entirely, and makes it the fastest-installing system in the SunMount range.',
    Component: null,
    specs: [
      { label: 'Clamp Size',        value: 'H 55 mm × L 60 mm' },
      { label: 'Material',          value: 'Aluminium 6063 T6 · SS 304 · EPDM' },
      { label: 'Design Wind Speed', value: 'Up to 200 km/h' },
      { label: 'Roof Penetration',  value: 'Zero — clamp-based only' },
      { label: 'Orientation',       value: 'Landscape' },
      { label: 'Finish',            value: 'Anodized / Non-anodized' },
    ],
    highlights: [
      'Zero roof penetration — preserves warranty',
      'Landscape panel orientation',
      'Compatible with all standing seam profiles',
      'Fastest installation time in the range',
      'Compatible with all PV module brands',
    ],
    applications: ['Standing seam factory', 'Architectural warehouse', 'Premium commercial'],
  },
]

/* ── 3D HELPERS ───────────────────────────────────────────────── */
function SpinRail({ Component }) {
  const ref = useRef()
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.5
  })
  return (
    <group ref={ref} position={[0, -0.25, 0]}>
      <Component length={3.8} />
    </group>
  )
}

function RailCanvas({ Component }) {
  return (
    <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
      <PerspectiveCamera makeDefault position={[2.2, 1.4, 2.8]} fov={46} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 5, 2]} intensity={1.6} color="#FBB034" />
      <directionalLight position={[-3, 2, -2]} intensity={0.5} color="#5882c4" />
      <Suspense fallback={null}>
        <SpinRail Component={Component} />
        <Environment preset="sunset" />
      </Suspense>
      <ContactShadows position={[0, -0.55, 0]} opacity={0.35} scale={5} blur={2} far={2} />
    </Canvas>
  )
}

function SeamVisual() {
  return (
    <div style={{
      height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: '1rem',
      background: 'radial-gradient(ellipse at 50% 60%, rgba(224,85,64,0.08) 0%, transparent 70%)',
    }}>
      <svg viewBox="0 0 200 120" width="220" height="130" style={{ opacity: 0.9 }}>
        <rect x="0" y="90" width="200" height="12" fill="#C9D4E0" opacity="0.4" />
        {[30, 70, 110, 150].map(x => (
          <g key={x}>
            <rect x={x - 8} y="60" width="16" height="30" fill="#8FA0BB" opacity="0.6" />
            <polygon points={`${x - 10},60 ${x + 10},60 ${x + 8},48 ${x - 8},48`} fill="#C9D4E0" opacity="0.8" />
            <rect x={x - 12} y="48" width="24" height="8" rx="2" fill="#E8923A" opacity="0.9" />
          </g>
        ))}
        <rect x="15" y="38" width="170" height="10" rx="2" fill="#C9D4E0" opacity="0.85" />
        <rect x="20" y="22" width="160" height="18" rx="1" fill="#0A1D6B" opacity="0.9" />
        <rect x="22" y="24" width="156" height="14" rx="1" fill="#1638BB" opacity="0.7" />
      </svg>
      <span style={{
        fontFamily: 'JetBrains Mono', fontSize: '0.65rem',
        letterSpacing: '0.18em', color: 'var(--aluminum-mid)', textTransform: 'uppercase',
      }}>Seam Clamp Profile</span>
    </div>
  )
}

/* ── MAIN PAGE ─────────────────────────────────────────────────── */
const VALID_IDS = PRODUCTS.map(p => p.id)

export default function Products() {
  const { hash } = useLocation()
  const hashId = hash.replace('#', '')
  const [selected, setSelected] = useState(VALID_IDS.includes(hashId) ? hashId : 'mono')

  useEffect(() => {
    if (VALID_IDS.includes(hashId)) setSelected(hashId)
  }, [hashId])

  const product = PRODUCTS.find(p => p.id === selected)

  return (
    <main style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--bg-base)' }}>

      {/* ── PAGE HEADER ── */}
      <div style={{
        padding: '4.5rem 0 3.5rem',
        background: 'linear-gradient(180deg, var(--bg-deep) 0%, var(--bg-base) 100%)',
        borderBottom: '1px solid var(--border-subtle)', position: 'relative',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--gradient-sun)' }} />
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
            <div className="section-label">COMPLETE PRODUCT RANGE</div>
            <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 4.2rem)', maxWidth: 660 }}>
              Precision Mounting<br />
              <span className="gradient-text">Systems Catalogue</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '1rem', maxWidth: 560, fontSize: '1rem', lineHeight: 1.75 }}>
              Four aluminium extrusion systems — engineered for every Indian roof type, rated for 200 km/h wind loads,
              certified by ISO 9001 &amp; TÜV SÜD.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── MAIN CONTENT: SIDEBAR + DETAIL ── */}
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '3rem', padding: '4rem 2rem', alignItems: 'start' }} className="prod-layout">

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            style={{ position: 'sticky', top: 108 }}
          >
            {PRODUCTS.map((p, i) => {
              const active = p.id === selected
              return (
                <button
                  key={p.id}
                  onClick={() => setSelected(p.id)}
                  style={{
                    width: '100%', textAlign: 'left',
                    padding: '1.1rem 1.2rem', marginBottom: '0.5rem',
                    background: active ? 'linear-gradient(135deg, rgba(224,85,64,0.12) 0%, rgba(232,146,58,0.06) 100%)' : 'var(--bg-elevated)',
                    border: `1px solid ${active ? 'var(--border-accent)' : 'var(--border-subtle)'}`,
                    borderLeft: `3px solid ${active ? 'var(--sun-orange)' : 'transparent'}`,
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
                  }}
                >
                  <div style={{
                    fontFamily: 'JetBrains Mono', fontSize: '0.58rem',
                    letterSpacing: '0.18em', color: active ? 'var(--sun-orange)' : 'var(--text-muted)',
                    textTransform: 'uppercase', marginBottom: '0.3rem',
                  }}>
                    0{i + 1} · {p.tag}
                  </div>
                  <div style={{
                    fontFamily: 'Montserrat', fontSize: '0.88rem', fontWeight: 700,
                    color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                    marginBottom: '0.15rem',
                  }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono', letterSpacing: '0.04em' }}>
                    {p.short}
                  </div>
                </button>
              )
            })}

            {/* Download CTA */}
            <a
              href="https://www.sunmount.in/wp-content/uploads/2024/09/Catalogue-2024-rev-2.pdf"
              target="_blank" rel="noopener noreferrer"
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', fontSize: '0.78rem', marginTop: '1.2rem', padding: '0.85rem 1rem' }}
            >
              <DownloadIcon /> Download Catalogue
            </a>
          </motion.div>

          {/* Detail panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* 3D / Visual canvas */}
              <div style={{
                height: 380, position: 'relative', marginBottom: '2.5rem',
                background: 'radial-gradient(ellipse at 50% 70%, rgba(224,85,64,0.07) 0%, transparent 70%)',
                border: '1px solid var(--border-subtle)',
              }}>
                {product.Component ? (
                  <RailCanvas Component={product.Component} />
                ) : (
                  <SeamVisual />
                )}
                {/* Rotating hint */}
                {product.Component && (
                  <div style={{
                    position: 'absolute', bottom: '1rem', right: '1.2rem',
                    fontFamily: 'JetBrains Mono', fontSize: '0.6rem', letterSpacing: '0.14em',
                    color: 'var(--text-muted)', textTransform: 'uppercase',
                  }}>
                    ↻ Auto-rotating 3D model
                  </div>
                )}
              </div>

              {/* Product header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                    <span style={{ padding: '0.22rem 0.65rem', background: 'rgba(224,85,64,0.12)', border: '1px solid var(--border-accent)', borderRadius: 2, fontFamily: 'JetBrains Mono', fontSize: '0.62rem', letterSpacing: '0.12em', color: 'var(--sun-orange)', textTransform: 'uppercase' }}>
                      {product.tag}
                    </span>
                    {product.badge && (
                      <span style={{ padding: '0.22rem 0.65rem', background: 'rgba(201,212,224,0.07)', border: '1px solid var(--border-subtle)', borderRadius: 2, fontFamily: 'JetBrains Mono', fontSize: '0.62rem', letterSpacing: '0.12em', color: 'var(--aluminum-mid)', textTransform: 'uppercase' }}>
                        {product.badge}
                      </span>
                    )}
                  </div>
                  <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', marginBottom: '0.5rem' }}>
                    {product.name}
                  </h2>
                  <p style={{ fontSize: '1rem', color: 'var(--sun-yellow)', fontFamily: 'JetBrains Mono', letterSpacing: '0.04em' }}>
                    {product.tagline}
                  </p>
                </div>
                <Link to="/contact" className="btn-primary" style={{ flexShrink: 0, fontSize: '0.82rem', padding: '0.85rem 1.5rem' }}>
                  Get a Quote <ArrowRightIcon />
                </Link>
              </div>

              {/* Description */}
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.8, marginBottom: '2.5rem', borderLeft: '2px solid var(--border-accent)', paddingLeft: '1.2rem' }}>
                {product.desc}
              </p>

              {/* Two-col: specs + highlights */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }} className="prod-detail-grid">

                {/* Specs */}
                <div>
                  <h3 style={{ fontFamily: 'JetBrains Mono', fontSize: '0.72rem', letterSpacing: '0.2em', color: 'var(--aluminum-mid)', textTransform: 'uppercase', marginBottom: '1rem' }}>
                    // Technical Specifications
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                    {product.specs.map((spec, i) => (
                      <div key={i} style={{
                        display: 'flex', justifyContent: 'space-between', gap: '1rem',
                        padding: '0.7rem 0.9rem',
                        background: i % 2 === 0 ? 'var(--bg-elevated)' : 'transparent',
                        border: '1px solid var(--border-subtle)',
                        borderTop: i === 0 ? '1px solid var(--border-subtle)' : 'none',
                      }}>
                        <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', letterSpacing: '0.06em', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                          {spec.label}
                        </span>
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: 600, textAlign: 'right' }}>
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Highlights + Applications */}
                <div>
                  <h3 style={{ fontFamily: 'JetBrains Mono', fontSize: '0.72rem', letterSpacing: '0.2em', color: 'var(--aluminum-mid)', textTransform: 'uppercase', marginBottom: '1rem' }}>
                    // Key Highlights
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', marginBottom: '2rem' }}>
                    {product.highlights.map((h, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.7rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                        <div style={{ width: 5, height: 5, background: 'var(--sun-orange)', marginTop: 6, flexShrink: 0 }} />
                        {h}
                      </div>
                    ))}
                  </div>

                  <h3 style={{ fontFamily: 'JetBrains Mono', fontSize: '0.72rem', letterSpacing: '0.2em', color: 'var(--aluminum-mid)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                    // Ideal Applications
                  </h3>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {product.applications.map(app => (
                      <span key={app} style={{
                        padding: '0.3rem 0.75rem',
                        background: 'rgba(201,212,224,0.06)', border: '1px solid var(--border-subtle)',
                        fontFamily: 'JetBrains Mono', fontSize: '0.65rem', letterSpacing: '0.08em',
                        color: 'var(--aluminum-mid)', textTransform: 'uppercase',
                      }}>{app}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom CTAs */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>
                <Link to="/contact" className="btn-primary" style={{ fontSize: '0.88rem' }}>
                  Request a Quote <ArrowRightIcon />
                </Link>
                <a
                  href="https://www.sunmount.in/wp-content/uploads/2024/09/Catalogue-2024-rev-2.pdf"
                  target="_blank" rel="noopener noreferrer"
                  className="btn-secondary"
                  style={{ fontSize: '0.88rem' }}
                >
                  <DownloadIcon /> Download Full Catalogue
                </a>
              </div>
            </motion.div>
          </AnimatePresence>

        </div>
      </div>

      <style>{`
        @media(max-width:900px) {
          .prod-layout { grid-template-columns: 1fr !important; padding: 2rem 1.25rem !important; }
          .prod-layout > div:first-child { position: static !important; display: flex; flex-wrap: wrap; gap: 0.5rem; }
          .prod-layout > div:first-child button { width: auto !important; flex: 1 1 140px; }
          .prod-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  )
}
