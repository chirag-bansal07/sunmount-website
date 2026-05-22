import { useState, useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, PerspectiveCamera, ContactShadows } from '@react-three/drei'
import { MiniRail, MonoRail, LongRail } from '../three/RailModels'
import { ArrowRightIcon, DownloadIcon } from '../components/icons'

const PRODUCTS = [
  {
    id: 'mini',
    name: 'MiniRail',
    tag: 'LOW-PROFILE',
    orientation: 'Landscape Orientation',
    desc: 'Lightweight, low-profile aluminum extrusion designed for landscape panel mounting. Ideal for residential and small commercial rooftops.',
    specs: ['6063-T6 Aluminum', 'Up to 180 km/h wind', 'Pre-anodized finish'],
    Component: MiniRail,
  },
  {
    id: 'mono',
    name: 'MonoRail',
    tag: 'UNIVERSAL',
    orientation: 'Portrait Orientation',
    desc: 'The industry-standard mounting rail with T-slot channel. Highly versatile for portrait panel installations across roof types.',
    specs: ['6063-T6 Aluminum', 'Up to 200 km/h wind', 'TÜV Certified'],
    Component: MonoRail,
  },
  {
    id: 'long',
    name: 'Long Rail',
    tag: 'HEAVY-DUTY',
    orientation: 'Portrait Orientation',
    desc: 'High-strength reinforced rail engineered for heavy-duty industrial and utility-scale installations. Maximum span, maximum load.',
    specs: ['6063-T6 Aluminum', 'Up to 200 km/h wind', 'Reinforced profile'],
    Component: LongRail,
  },
]

// Spinning rail inside card — pauses & repositions on hover
function SpinningRail({ Component, isHovered }) {
  const groupRef = useRef()

  useFrame((state, delta) => {
    if (!groupRef.current) return
    if (isHovered) {
      // Ease toward presentation pose: angled, tilted
      const targetY = -0.4
      const targetX = -0.25
      groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.08
      groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.08
    } else {
      // Spin slowly
      groupRef.current.rotation.y += delta * 0.6
      groupRef.current.rotation.x += (0 - groupRef.current.rotation.x) * 0.05
    }
  })

  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>
      <Component length={4} />
    </group>
  )
}

function ProductCanvas({ Component, isHovered }) {
  return (
    <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
      <PerspectiveCamera makeDefault position={[2.5, 1.5, 3]} fov={45} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 5, 2]} intensity={1.5} color="#FBB034" />
      <directionalLight position={[-3, 2, -2]} intensity={0.5} color="#5882c4" />
      <pointLight position={[0, 2, 2]} intensity={0.6} color="#FF6B1A" />
      <Suspense fallback={null}>
        <SpinningRail Component={Component} isHovered={isHovered} />
        <Environment preset="sunset" />
      </Suspense>
      <ContactShadows position={[0, -0.6, 0]} opacity={0.4} scale={6} blur={2} far={2} />
    </Canvas>
  )
}

const ProductCard = ({ product, index }) => {
  const [hovered, setHovered] = useState(false)
  const { Component, name, tag, orientation, desc, specs } = product

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        background: 'linear-gradient(180deg, var(--bg-elevated) 0%, var(--bg-surface) 100%)',
        border: hovered ? '1px solid var(--border-accent)' : '1px solid var(--border-subtle)',
        borderRadius: '4px',
        overflow: 'hidden',
        transition: 'border-color 0.5s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
        cursor: 'pointer',
      }}
    >
      {/* Corner accents */}
      <CornerAccent position="tl" active={hovered} />
      <CornerAccent position="tr" active={hovered} />
      <CornerAccent position="bl" active={hovered} />
      <CornerAccent position="br" active={hovered} />

      {/* Product number */}
      <div style={{
        position: 'absolute',
        top: '1.2rem', left: '1.2rem',
        fontFamily: 'JetBrains Mono',
        fontSize: '0.7rem',
        letterSpacing: '0.15em',
        color: 'var(--text-muted)',
        zIndex: 2,
      }}>
        0{index + 1} / {String(PRODUCTS.length).padStart(2, '0')}
      </div>

      {/* Tag badge */}
      <div style={{
        position: 'absolute',
        top: '1.2rem', right: '1.2rem',
        padding: '0.25rem 0.7rem',
        background: 'rgba(255, 107, 26, 0.12)',
        border: '1px solid var(--border-accent)',
        borderRadius: 2,
        fontFamily: 'JetBrains Mono',
        fontSize: '0.65rem',
        letterSpacing: '0.15em',
        color: 'var(--sun-orange)',
        zIndex: 2,
      }}>{tag}</div>

      {/* 3D viewport */}
      <div style={{
        height: 280,
        position: 'relative',
        background: 'radial-gradient(ellipse at 50% 70%, rgba(255,107,26,0.08) 0%, transparent 70%)',
      }}>
        <ProductCanvas Component={Component} isHovered={hovered} />

        {/* Hover indicator */}
        <div style={{
          position: 'absolute',
          bottom: '0.6rem', left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', alignItems: 'center', gap: '0.4rem',
          fontFamily: 'JetBrains Mono',
          fontSize: '0.62rem',
          letterSpacing: '0.15em',
          color: hovered ? 'var(--sun-orange)' : 'var(--text-muted)',
          transition: 'color 0.3s',
        }}>
          <div style={{
            width: 6, height: 6,
            borderRadius: '50%',
            background: hovered ? 'var(--sun-orange)' : 'var(--aluminum-dark)',
            transition: 'background 0.3s',
          }} />
          {hovered ? 'PRESENTATION MODE' : 'HOVER TO INSPECT'}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '1.8rem 1.6rem' }}>
        <h3 style={{
          fontSize: '1.6rem',
          fontWeight: 800,
          marginBottom: '0.3rem',
          color: 'var(--text-primary)',
        }}>{name}</h3>
        <p style={{
          fontFamily: 'JetBrains Mono',
          fontSize: '0.7rem',
          letterSpacing: '0.15em',
          color: 'var(--aluminum-mid)',
          textTransform: 'uppercase',
          marginBottom: '1rem',
        }}>{orientation}</p>
        <p style={{
          fontSize: '0.88rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.65,
          marginBottom: '1.3rem',
          minHeight: 80,
        }}>{desc}</p>

        {/* Specs */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {specs.map((spec, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              fontFamily: 'JetBrains Mono',
            }}>
              <div style={{ width: 4, height: 4, background: 'var(--sun-orange)' }} />
              {spec}
            </div>
          ))}
        </div>

        <button style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: '0.8rem 1rem',
          background: hovered ? 'var(--gradient-sun)' : 'transparent',
          border: `1px solid ${hovered ? 'transparent' : 'var(--aluminum-edge)'}`,
          color: hovered ? 'var(--bg-deep)' : 'var(--text-primary)',
          fontFamily: 'Montserrat',
          fontSize: '0.78rem',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          cursor: 'pointer',
        }}>
          Know More <ArrowRightIcon />
        </button>
      </div>
    </div>
  )
}

const CornerAccent = ({ position, active }) => {
  const styles = {
    tl: { top: 0, left: 0, borderTop: '2px solid', borderLeft: '2px solid' },
    tr: { top: 0, right: 0, borderTop: '2px solid', borderRight: '2px solid' },
    bl: { bottom: 0, left: 0, borderBottom: '2px solid', borderLeft: '2px solid' },
    br: { bottom: 0, right: 0, borderBottom: '2px solid', borderRight: '2px solid' },
  }
  return (
    <div style={{
      position: 'absolute',
      width: active ? 24 : 12,
      height: active ? 24 : 12,
      borderColor: 'var(--sun-orange)',
      transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      opacity: active ? 1 : 0.5,
      zIndex: 3,
      pointerEvents: 'none',
      ...styles[position],
    }} />
  )
}

const Products = () => {
  return (
    <section id="products" style={{
      padding: '8rem 0 6rem',
      position: 'relative',
      background: 'var(--bg-base)',
    }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem', maxWidth: 700, margin: '0 auto 4rem' }}>
          <div className="section-label" style={{ display: 'inline-flex' }}>OUR PRODUCT RANGE</div>
          <h2 style={{
            fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)',
            marginBottom: '1.2rem',
          }}>
            Three Rails. <span className="gradient-text">Infinite Possibilities.</span>
          </h2>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '1.02rem',
            lineHeight: 1.7,
          }}>
            From low-profile residential systems to heavy-duty utility installations —
            each rail is precision-engineered from 6063-T6 aluminum.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
          gap: '1.5rem',
          marginBottom: '4rem',
        }}>
          {PRODUCTS.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {/* Catalog CTA */}
        <div style={{ textAlign: 'center' }}>
          <a
            href="https://www.sunmount.in/wp-content/uploads/2024/09/Catalogue-2024-rev-2.pdf"
            target="_blank" rel="noopener noreferrer"
            className="btn-primary"
            style={{ fontSize: '0.95rem', padding: '1.1rem 2.2rem' }}
          >
            <DownloadIcon /> Download Full Catalog
          </a>
        </div>
      </div>
    </section>
  )
}

export default Products
