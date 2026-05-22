import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

function RailMesh({ type }) {
  const g = useRef()
  useFrame((s) => { if (g.current) g.current.rotation.y = s.clock.elapsedTime * 0.4 })
  const configs = {
    mono: { size: [3.2, 0.18, 0.28], color: '#A8BAC5', clamps: [-1.1, 0, 1.1] },
    mini: { size: [2.4, 0.12, 0.2], color: '#B8CAD5', clamps: [-0.8, 0.8] },
    long: { size: [4.2, 0.24, 0.36], color: '#9AAEB9', clamps: [-1.5, -0.5, 0.5, 1.5] },
  }
  const c = configs[type] || configs.mono
  return (
    <group ref={g}>
      <mesh>
        <boxGeometry args={c.size} />
        <meshStandardMaterial color={c.color} metalness={0.92} roughness={0.08} />
      </mesh>
      {c.clamps.map((x, i) => (
        <mesh key={i} position={[x, -0.09, 0]}>
          <boxGeometry args={[0.22, 0.16, 0.4]} />
          <meshStandardMaterial color="#7A8E9A" metalness={0.85} roughness={0.15} />
        </mesh>
      ))}
    </group>
  )
}

const ALL_PRODUCTS = [
  {
    id: 'mini', slug: 'minirail', name: 'MiniRail System', orient: 'Landscape',
    material: '6063-T6 Aluminum',
    highlights: ['Lightweight design', 'Landscape orientation', 'Residential & light commercial', 'Easy installation', 'TUV Certified'],
    desc: 'The MiniRail System is engineered for efficiency and ease of installation. Ideal for residential and light commercial rooftop applications, this lightweight system reduces material usage without compromising structural integrity.',
  },
  {
    id: 'mono', slug: 'monorail', name: 'MonoRail System', orient: 'Portrait',
    material: '6063-T6 / SS-304',
    highlights: ['Single rail efficiency', 'Portrait orientation', 'Commercial rooftops', 'Wind tested', 'MSME Certified'],
    desc: 'Our most popular product. The MonoRail System offers a perfect balance of strength and economy. A single rail supports portrait-oriented panels, minimizing the mounting footprint while maximizing the installation area.',
  },
  {
    id: 'long', slug: 'longrail', name: 'Long Rail System', orient: 'Portrait',
    material: 'IE-07 / 6063-T6',
    highlights: ['Industrial grade', 'Heavy-duty loads', 'FEA analyzed', 'ASTM tested', 'Up to 200 kmph'],
    desc: 'The Long Rail System is designed for large-scale industrial and commercial projects. With superior load-bearing capacity and full FEA and wind analysis certification, this system handles the most demanding installation environments.',
  },
]

export default function Products() {
  const [selected, setSelected] = useState('mono')
  const product = ALL_PRODUCTS.find(p => p.id === selected)

  return (
    <main style={{ paddingTop: 72, minHeight: '100vh', background: 'var(--bg-0)' }}>
      <div style={{
        padding: '5rem 5% 3rem',
        textAlign: 'center',
        borderBottom: '1px solid var(--border)',
        background: 'linear-gradient(180deg, #0D0F15 0%, var(--bg-0) 100%)',
      }}>
        <div className="section-label" style={{ justifyContent: 'center' }}>Product Range</div>
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', marginBottom: '1rem' }}>
          Precision<br /><span style={{ color: 'var(--al-light)' }}>Mounting Systems</span>
        </h1>
        <p style={{ color: 'var(--text-2)', maxWidth: 540, margin: '0 auto', fontSize: '0.95rem', lineHeight: 1.7 }}>
          6063-T6 aluminum · SS-304 stainless · TUV certified
          Engineered for Indian conditions, trusted worldwide.
        </p>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '4rem 5%' }}>
        {/* Selector tabs */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '3rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {ALL_PRODUCTS.map(p => (
            <button key={p.id} onClick={() => setSelected(p.id)} style={{
              padding: '0.6rem 1.5rem',
              background: selected === p.id ? 'linear-gradient(135deg, #F97316, #FBB034)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${selected === p.id ? 'transparent' : 'rgba(200,213,220,0.12)'}`,
              borderRadius: 4,
              color: selected === p.id ? '#07080C' : 'var(--text-2)',
              fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1rem', letterSpacing: '0.05em',
              cursor: 'pointer', transition: 'all 0.3s',
            }}>{p.name}</button>
          ))}
        </div>

        {/* Product detail */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div style={{
            height: 360,
            background: 'radial-gradient(ellipse at center, #1A2535 0%, #0D1018 100%)',
            border: '1px solid var(--border-al)',
            borderRadius: 8, overflow: 'hidden',
          }}>
            <Canvas camera={{ position: [0, 1, 5], fov: 45 }} dpr={[1, 2]}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[5, 5, 5]} intensity={2} color="#FBB034" />
              <directionalLight position={[-5, -2, -5]} intensity={0.3} color="#3A6080" />
              <RailMesh type={selected} />
              <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.5} />
            </Canvas>
          </div>

          <div>
            <div style={{
              display: 'inline-block', padding: '0.2rem 0.8rem', marginBottom: '0.75rem',
              background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.3)',
              borderRadius: 100, fontSize: '0.7rem', letterSpacing: '0.15em',
              color: '#F97316', fontWeight: 700, textTransform: 'uppercase',
            }}>{product.orient} Orientation · {product.material}</div>

            <h2 style={{ fontFamily: 'Rajdhani', fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '1rem' }}>
              {product.name}
            </h2>

            <p style={{ color: 'var(--text-2)', lineHeight: 1.8, marginBottom: '2rem', fontSize: '0.95rem' }}>
              {product.desc}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '2rem' }}>
              {product.highlights.map((h, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.88rem', color: 'var(--text-1)' }}>
                  <span style={{ color: 'var(--solar)', fontSize: '0.7rem' }}>◆</span>
                  {h}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="/contact" className="btn-primary" style={{ fontSize: '0.82rem' }}>Get a Quote →</a>
              <a href="https://www.sunmount.in/wp-content/uploads/2024/09/Catalogue-2024-rev-2.pdf" target="_blank" rel="noopener noreferrer"
                className="btn-ghost" style={{ fontSize: '0.82rem' }}>Download Catalogue</a>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
