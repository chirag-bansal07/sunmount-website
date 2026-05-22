import { useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Stars, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

// Animated solar panel 3D model placeholder
function SolarPanel({ position, rotation }) {
  const meshRef = useRef()
  useFrame((state) => {
    meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
  })
  return (
    <group ref={meshRef} position={position} rotation={rotation}>
      {/* Panel frame */}
      <mesh>
        <boxGeometry args={[2, 1.2, 0.05]} />
        <meshStandardMaterial color="#1a3a6e" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Panel grid */}
      {[-0.6, 0, 0.6].map((x, i) => (
        [-0.35, 0.35].map((y, j) => (
          <mesh key={`${i}-${j}`} position={[x, y, 0.03]}>
            <boxGeometry args={[0.55, 0.45, 0.01]} />
            <meshStandardMaterial color="#0a1f4e" metalness={0.9} roughness={0.1} />
          </mesh>
        ))
      ))}
      {/* Mount pole */}
      <mesh position={[0, -1, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 1.6, 8]} />
        <meshStandardMaterial color="#888" metalness={1} roughness={0.2} />
      </mesh>
    </group>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 10, 5]} intensity={2} color="#FBB034" />
      <pointLight position={[-5, 5, -5]} intensity={0.5} color="#F97316" />
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
        <SolarPanel position={[0, 0, 0]} rotation={[0.3, 0.2, 0]} />
      </Float>
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </>
  )
}

const stats = [
  { value: '50+', label: 'Global Locations' },
  { value: '10k+', label: 'Successful Projects' },
  { value: '15+', label: 'Years Experience' },
  { value: '75+', label: 'Expert Team Years' },
]

const features = [
  { icon: '⚡', title: 'Cost Effective', desc: 'Most optimum & cost effective mounting solutions in the market' },
  { icon: '💨', title: '200 kmph Wind', desc: 'Engineered for design wind speeds up to 200 kmph' },
  { icon: '🛡️', title: 'Best Warranty', desc: 'Industry-leading warranty backed by TUV certified quality' },
  { icon: '⚙️', title: 'High Strength', desc: 'Long life products with IE-07, 6063-T6 & SS-304 grade materials' },
  { icon: '🚀', title: 'Quick Dispatch', desc: 'Fast dispatch and professional installation support' },
  { icon: '🤝', title: 'After-Sales', desc: 'Prompt and apt after-sales support, always ready to assist' },
]

const Home = () => {
  return (
    <main>
      {/* HERO */}
      <section style={{
        minHeight: '100vh', position: 'relative',
        display: 'flex', alignItems: 'center',
        background: 'radial-gradient(ellipse at 70% 50%, #1a2a4a 0%, #0A0F1E 60%)',
        overflow: 'hidden'
      }}>
        {/* 3D Canvas */}
        <div style={{ position: 'absolute', right: 0, top: 0, width: '55%', height: '100%', opacity: 0.9 }}>
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <Scene />
          </Canvas>
        </div>

        {/* Orange glow */}
        <div style={{
          position: 'absolute', right: '40%', top: '40%',
          width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(249,115,22,0.15), transparent 70%)',
          borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: '8rem 2rem 4rem', width: '100%' }}>
          <div style={{ maxWidth: 600 }}>
            <div style={{
              display: 'inline-block', padding: '0.3rem 1rem',
              background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.4)',
              borderRadius: 100, fontSize: '0.8rem', letterSpacing: '0.15em',
              color: '#F97316', fontFamily: 'Rajdhani', fontWeight: 600,
              textTransform: 'uppercase', marginBottom: '1.5rem'
            }}>
              ISO & MSME Registered · TUV Certified
            </div>
            <h1 style={{
              fontSize: 'clamp(3rem, 6vw, 5.5rem)', lineHeight: 1.0,
              fontFamily: 'Rajdhani', fontWeight: 700,
              marginBottom: '1.5rem', letterSpacing: '-0.01em'
            }}>
              Solar Mounting<br />
              <span style={{ color: '#F97316' }}>Structures</span><br />
              Redefined
            </h1>
            <p style={{
              fontSize: '1.1rem', color: 'rgba(255,255,255,0.65)',
              lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: 480
            }}>
              India's premium solar PV mounting manufacturer. Engineering precision,
              TUV certified quality, supplying across the globe.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a href="/products" style={{
                padding: '0.9rem 2rem',
                background: 'linear-gradient(135deg, #F97316, #FBB034)',
                color: '#0A0F1E', fontFamily: 'Rajdhani', fontWeight: 700,
                fontSize: '1rem', letterSpacing: '0.08em', textTransform: 'uppercase',
                borderRadius: '4px', transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 4px 24px rgba(249,115,22,0.3)'
              }}>Explore Products</a>
              <a href="https://www.sunmount.in/wp-content/uploads/2024/09/Catalogue-2024-rev-2.pdf"
                target="_blank" rel="noopener noreferrer"
                style={{
                  padding: '0.9rem 2rem',
                  border: '1px solid rgba(249,115,22,0.5)',
                  color: '#F97316', fontFamily: 'Rajdhani', fontWeight: 700,
                  fontSize: '1rem', letterSpacing: '0.08em', textTransform: 'uppercase',
                  borderRadius: '4px', transition: 'all 0.2s',
                  background: 'transparent'
                }}>Download Catalogue</a>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'rgba(10,15,30,0.8)', backdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(249,115,22,0.15)',
          padding: '1.5rem 2rem'
        }}>
          <div style={{
            maxWidth: 1200, margin: '0 auto',
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', textAlign: 'center'
          }}>
            {stats.map((s, i) => (
              <div key={i}>
                <div style={{ fontFamily: 'Rajdhani', fontSize: '2rem', fontWeight: 700, color: '#F97316' }}>{s.value}</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TAGLINE */}
      <section style={{
        padding: '6rem 2rem', textAlign: 'center',
        background: 'linear-gradient(180deg, #0A0F1E 0%, #111827 100%)'
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <p style={{ color: '#F97316', fontFamily: 'Rajdhani', letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Who We Are</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', lineHeight: 1.3, marginBottom: '1.5rem' }}>
            India's Indigenous Solar PV<br />Mounting Manufacturer
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, fontSize: '1.05rem' }}>
            SunMount® specializes in the design, manufacture & supply of high quality and innovative
            rooftop solar mounting structural systems — for trapezoidal, metal, industrial, and asbestos roofs.
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '6rem 2rem', background: '#0D1220' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ color: '#F97316', fontFamily: 'Rajdhani', letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }}>Why SunMount®</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', marginBottom: '3.5rem', textAlign: 'center' }}>What We Offer</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {features.map((f, i) => (
              <div key={i} style={{
                padding: '2rem', borderRadius: '8px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                transition: 'border-color 0.3s, transform 0.3s',
                cursor: 'default'
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(249,115,22,0.4)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{f.icon}</div>
                <h3 style={{ fontFamily: 'Rajdhani', fontSize: '1.3rem', marginBottom: '0.5rem', color: '#F97316' }}>{f.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.92rem', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '6rem 2rem', textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(249,115,22,0.1) 0%, rgba(10,15,30,1) 100%)'
      }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', marginBottom: '1.5rem' }}>
            Ready for Professional<br /><span style={{ color: '#F97316' }}>High Quality Products?</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2.5rem', fontSize: '1.05rem' }}>
            Supplying all over the world. Get in touch with our engineering team today.
          </p>
          <a href="/contact" style={{
            padding: '1rem 2.5rem',
            background: 'linear-gradient(135deg, #F97316, #FBB034)',
            color: '#0A0F1E', fontFamily: 'Rajdhani', fontWeight: 700,
            fontSize: '1.1rem', letterSpacing: '0.08em', textTransform: 'uppercase',
            borderRadius: '4px', boxShadow: '0 4px 32px rgba(249,115,22,0.4)'
          }}>Contact Us Today</a>
        </div>
      </section>
    </main>
  )
}

export default Home
