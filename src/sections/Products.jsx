import { useState, useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, PerspectiveCamera, ContactShadows } from '@react-three/drei'
import { MiniRail, MonoRail, LongRail } from '../three/RailModels'
import { ArrowRightIcon, DownloadIcon } from '../components/icons'

const PRODUCTS = [
  {
    id: 'mono',
    name: 'Mono Rail System',
    tag: 'PORTRAIT',
    badge: 'Best Seller',
    summary: 'Lightweight T-slot rail for trapezoidal metal roofs. Mounts panels in portrait orientation with roof clearance of 100 mm.',
    specs: [
      'Height: 70 mm | Length: Custom',
      'Aluminium 6063 T6 | SS 304 | EPDM',
      'Design wind: Up to 200 km/h',
      'Anodized / Non-anodized finish',
    ],
    highlights: [
      'Optimized for any crest width',
      'Portrait orientation — high capacity',
      'Easy installation & maintenance',
      'Compatible with all PV modules',
    ],
    Component: MonoRail,
  },
  {
    id: 'mini',
    name: 'Mini Rail System',
    tag: 'LANDSCAPE',
    badge: null,
    summary: 'Low-profile compact rail for landscape-orientation panels on trapezoidal roofs. Most cost-effective solution for residential & commercial projects.',
    specs: [
      'Height: 68 mm | Length: 100 mm',
      'Aluminium 6063 T6 | SS 304 | EPDM',
      'Design wind: Up to 200 km/h',
      'Anodized / Non-anodized finish',
    ],
    highlights: [
      'Low-profile & lightweight',
      'Landscape orientation',
      'Roof clearance of 100 mm',
      'Cost-effective solution',
    ],
    Component: MiniRail,
  },
  {
    id: 'long',
    name: 'Long Rail System',
    tag: 'PORTRAIT',
    badge: 'High Strength',
    summary: 'Purlin-mounted heavy-duty rail for high wind loads. Requires fewer roof punctures than Mini/Mono Rail — ideal for industrial & asbestos roofs.',
    specs: [
      'Aluminium 6063 T6 | SS 304 | EPDM',
      'Design wind: Up to 200 km/h',
      'Purlin-mounted robust structure',
      'Anodized / Non-anodized finish',
    ],
    highlights: [
      'Fewer roof punctures',
      'Uses existing self-drilling screw holes',
      'Suitable for asbestos roofs',
      'Universal for any roof crest',
    ],
    Component: LongRail,
  },
  {
    id: 'seam',
    name: 'Standing Seam System',
    tag: 'LANDSCAPE',
    badge: 'No Puncture',
    summary: 'Clamp-based system for standing seam roofs — zero roof penetration. Seam clamps grip the roof profile, making it the fastest install in the range.',
    specs: [
      'Clamp: H 55 mm × L 60 mm',
      'Aluminium 6063 T6 | SS 304 | EPDM',
      'Design wind: Up to 200 km/h',
      'Anodized / Non-anodized finish',
    ],
    highlights: [
      'Zero roof penetration',
      'Landscape orientation',
      'Suitable for all standing seam profiles',
      'Compatible with all PV modules',
    ],
    Component: null, // no 3D model yet — shows icon instead
  },
]

/* Corner accent squares */
function Corner({ pos, active }) {
  const map = {
    tl: { top:0, left:0,  borderTop:'2px solid', borderLeft:'2px solid' },
    tr: { top:0, right:0, borderTop:'2px solid', borderRight:'2px solid' },
    bl: { bottom:0, left:0,  borderBottom:'2px solid', borderLeft:'2px solid' },
    br: { bottom:0, right:0, borderBottom:'2px solid', borderRight:'2px solid' },
  }
  return (
    <div style={{
      position:'absolute', pointerEvents:'none', zIndex:3,
      width: active ? 22 : 10, height: active ? 22 : 10,
      borderColor: 'var(--sun-orange)',
      transition:'all 0.45s cubic-bezier(0.16,1,0.3,1)',
      opacity: active ? 1 : 0.45,
      ...map[pos],
    }} />
  )
}

/* 3D spinning rail viewer */
function SpinRail({ Component, hover }) {
  const ref = useRef()
  useFrame((_, dt) => {
    if (!ref.current) return
    if (hover) {
      ref.current.rotation.y += (-0.4 - ref.current.rotation.y) * 0.08
      ref.current.rotation.x += (-0.22 - ref.current.rotation.x) * 0.08
    } else {
      ref.current.rotation.y += dt * 0.55
      ref.current.rotation.x += (-0.0 - ref.current.rotation.x) * 0.05
    }
  })
  return (
    <group ref={ref} position={[0, -0.25, 0]}>
      <Component length={3.8} />
    </group>
  )
}

function RailCanvas({ Component, hover }) {
  return (
    <Canvas dpr={[1,2]} gl={{ antialias:true, alpha:true }}>
      <PerspectiveCamera makeDefault position={[2.2,1.4,2.8]} fov={46} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[3,5,2]} intensity={1.6} color="#FBB034" />
      <directionalLight position={[-3,2,-2]} intensity={0.5} color="#5882c4" />
      <Suspense fallback={null}>
        <SpinRail Component={Component} hover={hover} />
        <Environment preset="sunset" />
      </Suspense>
      <ContactShadows position={[0,-0.55,0]} opacity={0.35} scale={5} blur={2} far={2} />
    </Canvas>
  )
}

/* Standing Seam placeholder visual */
function SeamVisual() {
  return (
    <div style={{
      height:'100%', display:'flex', alignItems:'center', justifyContent:'center',
      flexDirection:'column', gap:'0.6rem',
      background:'radial-gradient(ellipse at 50% 60%, rgba(224,85,64,0.10) 0%, transparent 70%)',
    }}>
      {/* Standing seam cross-section SVG */}
      <svg viewBox="0 0 200 120" width="180" height="110" style={{ opacity:0.92 }}>
        {/* Base roof */}
        <rect x="0" y="90" width="200" height="12" fill="#C9D4E0" opacity="0.4" />
        {/* Seam profiles */}
        {[30,70,110,150].map(x => (
          <g key={x}>
            <rect x={x-8} y="60" width="16" height="30" fill="#8FA0BB" opacity="0.6" />
            <polygon points={`${x-10},60 ${x+10},60 ${x+8},48 ${x-8},48`} fill="#C9D4E0" opacity="0.8" />
            <rect x={x-12} y="48" width="24" height="8" rx="2" fill="#E8923A" opacity="0.9" />
          </g>
        ))}
        {/* Rail on top */}
        <rect x="15" y="38" width="170" height="10" rx="2" fill="#C9D4E0" opacity="0.85" />
        {/* Panel on rail */}
        <rect x="20" y="22" width="160" height="18" rx="1" fill="#0A1D6B" opacity="0.9" />
        <rect x="22" y="24" width="156" height="14" rx="1" fill="#1638BB" opacity="0.7" />
      </svg>
      <span style={{ fontFamily:'JetBrains Mono', fontSize:'0.65rem', letterSpacing:'0.18em', color:'var(--aluminum-mid)', textTransform:'uppercase' }}>
        Seam Clamp Profile
      </span>
    </div>
  )
}

const ProductCard = ({ product, index }) => {
  const [hover, setHover] = useState(false)
  const [tab, setTab]     = useState('highlights')

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position:'relative',
        background:'linear-gradient(180deg,var(--bg-elevated) 0%,var(--bg-surface) 100%)',
        border: hover ? '1px solid var(--border-accent)' : '1px solid var(--border-subtle)',
        borderRadius:4, overflow:'hidden',
        transition:'border-color 0.45s, transform 0.45s cubic-bezier(0.16,1,0.3,1)',
        transform: hover ? 'translateY(-6px)' : 'translateY(0)',
        display:'flex', flexDirection:'column',
      }}
    >
      {['tl','tr','bl','br'].map(p => <Corner key={p} pos={p} active={hover} />)}

      {/* Top bar: index + tags */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'1rem 1.2rem 0' }}>
        <span style={{ fontFamily:'JetBrains Mono', fontSize:'0.65rem', letterSpacing:'0.15em', color:'var(--text-muted)' }}>
          0{index+1}
        </span>
        <div style={{ display:'flex', gap:'0.4rem' }}>
          <span style={{ padding:'0.2rem 0.6rem', background:'rgba(224,85,64,0.12)', border:'1px solid var(--border-accent)', borderRadius:2, fontFamily:'JetBrains Mono', fontSize:'0.62rem', letterSpacing:'0.12em', color:'var(--sun-orange)' }}>
            {product.tag}
          </span>
          {product.badge && (
            <span style={{ padding:'0.2rem 0.6rem', background:'rgba(201,212,224,0.08)', border:'1px solid var(--border-subtle)', borderRadius:2, fontFamily:'JetBrains Mono', fontSize:'0.62rem', letterSpacing:'0.12em', color:'var(--aluminum-mid)' }}>
              {product.badge}
            </span>
          )}
        </div>
      </div>

      {/* 3D / Visual viewport */}
      <div style={{
        height:240, position:'relative',
        background:'radial-gradient(ellipse at 50% 70%, rgba(224,85,64,0.07) 0%, transparent 70%)',
        margin:'0.5rem 0',
      }}>
        {product.Component ? (
          <RailCanvas Component={product.Component} hover={hover} />
        ) : (
          <SeamVisual />
        )}
        <div style={{
          position:'absolute', bottom:'0.5rem', left:'50%', transform:'translateX(-50%)',
          display:'flex', alignItems:'center', gap:'0.4rem',
          fontFamily:'JetBrains Mono', fontSize:'0.6rem', letterSpacing:'0.12em',
          color: hover ? 'var(--sun-orange)' : 'var(--text-muted)', transition:'color 0.3s',
        }}>
          <div style={{ width:5, height:5, borderRadius:'50%', background: hover ? 'var(--sun-orange)' : 'var(--aluminum-dark)', transition:'background 0.3s' }} />
          {product.Component ? (hover ? 'DETAIL VIEW' : 'HOVER TO INSPECT') : 'CLAMP DETAIL'}
        </div>
      </div>

      {/* Name */}
      <div style={{ padding:'0 1.4rem' }}>
        <h3 style={{ fontSize:'1.35rem', fontWeight:800, marginBottom:'0.5rem', color:'var(--text-primary)' }}>
          {product.name}
        </h3>
        <p style={{ fontSize:'0.86rem', color:'var(--text-secondary)', lineHeight:1.65, marginBottom:'1rem', minHeight:52 }}>
          {product.summary}
        </p>

        {/* Tab switcher */}
        <div style={{ display:'flex', gap:'0', marginBottom:'1rem', border:'1px solid var(--border-subtle)', borderRadius:2, overflow:'hidden' }}>
          {['highlights','specs'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex:1, padding:'0.45rem 0',
              background: tab===t ? 'var(--gradient-sun)' : 'transparent',
              color: tab===t ? 'var(--bg-deep)' : 'var(--text-muted)',
              fontFamily:'JetBrains Mono', fontSize:'0.65rem', letterSpacing:'0.12em',
              textTransform:'uppercase', cursor:'pointer', border:'none', transition:'all 0.25s',
            }}>{t}</button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ minHeight:100, marginBottom:'1.2rem' }}>
          {tab === 'highlights' ? (
            <div style={{ display:'flex', flexDirection:'column', gap:'0.35rem' }}>
              {product.highlights.map((h, i) => (
                <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'0.5rem', fontSize:'0.82rem', color:'var(--text-secondary)' }}>
                  <div style={{ width:4, height:4, background:'var(--sun-orange)', marginTop:6, flexShrink:0 }} />
                  {h}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:'0.35rem' }}>
              {product.specs.map((s, i) => (
                <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'0.5rem', fontSize:'0.78rem', color:'var(--text-muted)', fontFamily:'JetBrains Mono', letterSpacing:'0.04em' }}>
                  <div style={{ width:4, height:4, background:'var(--aluminum-dark)', marginTop:5, flexShrink:0 }} />
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>

        <button style={{
          display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%',
          padding:'0.8rem 1rem', marginBottom:'1.4rem',
          background: hover ? 'var(--gradient-sun)' : 'transparent',
          border:`1px solid ${hover ? 'transparent' : 'var(--aluminum-edge)'}`,
          color: hover ? 'var(--bg-deep)' : 'var(--text-primary)',
          fontFamily:'Montserrat', fontSize:'0.78rem', fontWeight:700,
          letterSpacing:'0.08em', textTransform:'uppercase',
          transition:'all 0.4s cubic-bezier(0.16,1,0.3,1)', cursor:'pointer',
        }}>
          Know More <ArrowRightIcon />
        </button>
      </div>
    </div>
  )
}

const Products = () => (
  <section id="products" style={{ padding:'8rem 0 6rem', background:'var(--bg-base)', position:'relative' }}>
    <div className="container">
      <div style={{ textAlign:'center', marginBottom:'4rem', maxWidth:680, margin:'0 auto 4rem' }}>
        <div className="section-label" style={{ display:'inline-flex' }}>OUR PRODUCT RANGE</div>
        <h2 style={{ fontSize:'clamp(2.2rem,4.5vw,3.4rem)', marginBottom:'1.1rem' }}>
          Engineered for <span className="gradient-text">Every Roof.</span>
        </h2>
        <p style={{ color:'var(--text-secondary)', fontSize:'1rem', lineHeight:1.7 }}>
          Four precision-engineered mounting systems — from trapezoidal metal sheets to
          standing seam profiles. All rated for 200 km/h wind speeds.
        </p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(290px,1fr))', gap:'1.4rem', marginBottom:'4rem' }}>
        {PRODUCTS.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
      </div>

      <div style={{ textAlign:'center' }}>
        <a href="https://www.sunmount.in/wp-content/uploads/2024/09/Catalogue-2024-rev-2.pdf"
          target="_blank" rel="noopener noreferrer" className="btn-primary"
          style={{ fontSize:'0.95rem', padding:'1.1rem 2.2rem' }}>
          <DownloadIcon /> Download Full Catalogue
        </a>
      </div>
    </div>
  </section>
)

export default Products
