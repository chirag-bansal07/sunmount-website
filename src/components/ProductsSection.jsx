import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Link } from 'react-router-dom'

function MonoRailModel({ hovered }) {
  const g = useRef()
  useFrame((s) => { if (g.current && !hovered) g.current.rotation.y = s.clock.elapsedTime * 0.6 })
  return (
    <group ref={g} scale={0.85}>
      <mesh><boxGeometry args={[3.2,0.18,0.28]}/><meshStandardMaterial color="#A8BAC5" metalness={0.92} roughness={0.08}/></mesh>
      <mesh position={[0,0.12,0]}><boxGeometry args={[3.2,0.06,0.14]}/><meshStandardMaterial color="#C8D8E2" metalness={0.95} roughness={0.05}/></mesh>
      {[-1.1,0,1.1].map((x,i)=>(
        <group key={i} position={[x,-0.08,0]}>
          <mesh><boxGeometry args={[0.22,0.14,0.38]}/><meshStandardMaterial color="#7A8E9A" metalness={0.85} roughness={0.15}/></mesh>
        </group>
      ))}
    </group>
  )
}

function MiniRailModel({ hovered }) {
  const g = useRef()
  useFrame((s) => { if (g.current && !hovered) g.current.rotation.y = s.clock.elapsedTime * 0.6 })
  return (
    <group ref={g} scale={0.85}>
      <mesh><boxGeometry args={[2.4,0.12,0.2]}/><meshStandardMaterial color="#B8CAD5" metalness={0.92} roughness={0.08}/></mesh>
      <mesh position={[0,-0.08,0]}><boxGeometry args={[2.4,0.04,0.32]}/><meshStandardMaterial color="#C8D8E2" metalness={0.9} roughness={0.1}/></mesh>
      {[-0.8,0.8].map((x,i)=>(
        <mesh key={i} position={[x,-0.04,0]}><boxGeometry args={[0.18,0.18,0.36]}/><meshStandardMaterial color="#7A8E9A" metalness={0.85} roughness={0.15}/></mesh>
      ))}
    </group>
  )
}

function LongRailModel({ hovered }) {
  const g = useRef()
  useFrame((s) => { if (g.current && !hovered) g.current.rotation.y = s.clock.elapsedTime * 0.5 })
  return (
    <group ref={g} scale={0.7}>
      <mesh><boxGeometry args={[4.2,0.24,0.36]}/><meshStandardMaterial color="#9AAEB9" metalness={0.93} roughness={0.07}/></mesh>
      <mesh position={[0,0.14,0]}><boxGeometry args={[4.2,0.04,0.18]}/><meshStandardMaterial color="#D0E0E8" metalness={0.95} roughness={0.05}/></mesh>
      {[-1.5,-0.5,0.5,1.5].map((x,i)=>(
        <mesh key={i} position={[x,-0.1,0]}><boxGeometry args={[0.28,0.2,0.48]}/><meshStandardMaterial color="#6A8090" metalness={0.85} roughness={0.15}/></mesh>
      ))}
    </group>
  )
}

const PRODUCTS = [
  { id:'mini', name:'MiniRail System', orient:'Landscape', Model:MiniRailModel, desc:'Lightweight & efficient rail system for landscape orientation. Ideal for residential and light commercial rooftop applications with streamlined installation.', specs:['6063-T6 Aluminum','TUV Certified','Landscape Mount'] },
  { id:'mono', name:'MonoRail System', orient:'Portrait', Model:MonoRailModel, desc:'Single rail system for portrait orientation. Reduces material usage while maintaining structural integrity. Most popular for commercial installations.', specs:['SS-304 Option','Wind Certified','Portrait Mount'] },
  { id:'long', name:'Long Rail System', orient:'Portrait', Model:LongRailModel, desc:'Heavy-duty rail system for large-scale industrial and commercial projects requiring superior load-bearing capacity and FEA certification.', specs:['IE-07 Grade','FEA Analyzed','Industrial Grade'] },
]

function ProductCard({ product }) {
  const [hov, setHov] = useState(false)
  const { Model } = product
  return (
    <div
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>setHov(false)}
      style={{
        background:'linear-gradient(160deg,#161A22,#111520)',
        border:`1px solid ${hov?'rgba(249,115,22,0.4)':'rgba(200,213,220,0.08)'}`,
        borderRadius:6, overflow:'hidden',
        transition:'all 0.35s',
        boxShadow:hov?'0 16px 60px rgba(249,115,22,0.15),0 4px 20px rgba(0,0,0,0.5)':'0 4px 20px rgba(0,0,0,0.3)',
        transform:hov?'translateY(-8px)':'translateY(0)',
        display:'flex', flexDirection:'column',
      }}
    >
      <div style={{ height:220, position:'relative', background:'radial-gradient(ellipse at center,#1A2535,#0D1018)' }}>
        <Canvas camera={{position:[0,0,4],fov:45}} dpr={[1,2]}>
          <ambientLight intensity={0.5}/>
          <directionalLight position={[5,5,5]} intensity={hov?2.5:1.5} color={hov?'#FBB034':'#ffffff'}/>
          <directionalLight position={[-5,-2,-5]} intensity={0.3} color="#3A6080"/>
          {hov && <pointLight position={[0,3,3]} intensity={1.2} color="#F97316"/>}
          <Model hovered={hov}/>
          <OrbitControls enableZoom={false} enablePan={false} autoRotate={!hov} autoRotateSpeed={2}/>
        </Canvas>
        <div style={{ position:'absolute',top:12,left:12, padding:'0.2rem 0.7rem', background:'rgba(249,115,22,0.15)', border:'1px solid rgba(249,115,22,0.3)', borderRadius:100, fontSize:'0.65rem', letterSpacing:'0.15em', color:'#F97316', fontWeight:700, textTransform:'uppercase' }}>
          {product.orient}
        </div>
      </div>
      <div style={{ padding:'1.5rem', display:'flex', flexDirection:'column', flex:1 }}>
        <h3 style={{ fontFamily:'Rajdhani', fontSize:'1.5rem', fontWeight:700, marginBottom:'0.75rem', color:hov?'#F97316':'var(--text-1)', transition:'color 0.3s' }}>{product.name}</h3>
        <p style={{ color:'var(--text-2)', fontSize:'0.85rem', lineHeight:1.7, marginBottom:'1rem', flex:1 }}>{product.desc}</p>
        <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap', marginBottom:'1.25rem' }}>
          {product.specs.map(s=>(
            <span key={s} style={{ padding:'0.2rem 0.6rem', fontSize:'0.65rem', background:'rgba(200,213,220,0.06)', border:'1px solid rgba(200,213,220,0.12)', borderRadius:100, color:'var(--al-mid)', letterSpacing:'0.08em', textTransform:'uppercase', fontWeight:600 }}>{s}</span>
          ))}
        </div>
        <Link to={`/products`} className="btn-ghost" style={{ textAlign:'center', justifyContent:'center', fontSize:'0.72rem' }}>Know More →</Link>
      </div>
    </div>
  )
}

export default function ProductsSection() {
  return (
    <section id="products" style={{ padding:'8rem 5%', background:'linear-gradient(180deg,var(--bg-0),var(--bg-1))' }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:'4rem' }}>
          <div className="section-label" style={{ justifyContent:'center' }}>Our Products</div>
          <h2 style={{ fontSize:'clamp(2.2rem,4vw,3.5rem)', marginBottom:'1rem' }}>
            Precision-Engineered<br/>
            <span style={{ color:'var(--al-light)' }}>Mounting Systems</span>
          </h2>
          <p style={{ color:'var(--text-2)', maxWidth:540, margin:'0 auto', fontSize:'0.95rem', lineHeight:1.7 }}>
            6063-T6 aluminum alloy · SS-304 stainless steel · TUV certified
          </p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'1.5rem', marginBottom:'3rem' }}>
          {PRODUCTS.map(p=><ProductCard key={p.id} product={p}/>)}
        </div>
        <div style={{ textAlign:'center' }}>
          <a href="https://www.sunmount.in/wp-content/uploads/2024/09/Catalogue-2024-rev-2.pdf" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ fontSize:'0.85rem', padding:'0.9rem 2.5rem' }}>
            ⬇ Download Full Catalogue
          </a>
        </div>
      </div>
    </section>
  )
}
