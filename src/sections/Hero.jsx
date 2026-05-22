import { useRef, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera, ContactShadows, Environment, useHelper } from '@react-three/drei'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'

gsap.registerPlugin(ScrollTrigger)

/* ─── FACTORY BUILDING ─── */
function FactoryBuilding() {
  return (
    <group position={[0, 0, 0]}>
      {/* Main walls */}
      <mesh position={[0, 1.8, 0]} receiveShadow castShadow>
        <boxGeometry args={[14, 3.6, 8]} />
        <meshStandardMaterial color="#1a2035" metalness={0.4} roughness={0.8} />
      </mesh>

      {/* Side wall detail strips */}
      {[-6.9, 6.9].map((x, i) => (
        <mesh key={i} position={[x, 1.8, 0]}>
          <boxGeometry args={[0.15, 3.6, 8.1]} />
          <meshStandardMaterial color="#2A3247" metalness={0.6} roughness={0.5} />
        </mesh>
      ))}

      {/* Vertical wall columns */}
      {[-5, 0, 5].map((x, i) => (
        <mesh key={i} position={[x, 1.8, 4.05]} castShadow>
          <boxGeometry args={[0.3, 3.6, 0.15]} />
          <meshStandardMaterial color="#2A3247" metalness={0.7} roughness={0.4} />
        </mesh>
      ))}

      {/* GABLED ROOF — two sloped planes meeting at ridge */}
      {/* Left slope */}
      <mesh position={[-3.0, 3.85, 0]} rotation={[0, 0, Math.PI / 6]} castShadow receiveShadow>
        <boxGeometry args={[6.93, 0.12, 8.4]} />
        <meshStandardMaterial color="#C9D4E0" metalness={0.85} roughness={0.2} />
      </mesh>
      {/* Right slope */}
      <mesh position={[3.0, 3.85, 0]} rotation={[0, 0, -Math.PI / 6]} castShadow receiveShadow>
        <boxGeometry args={[6.93, 0.12, 8.4]} />
        <meshStandardMaterial color="#C9D4E0" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Ridge cap */}
      <mesh position={[0, 5.45, 0]} castShadow>
        <boxGeometry args={[0.35, 0.35, 8.4]} />
        <meshStandardMaterial color="#8FA0BB" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Trapezoidal roof ribs — corrugated effect */}
      {Array.from({ length: 9 }).map((_, i) => {
        const z = -4 + i
        return (
          <group key={i}>
            <mesh position={[-3.0, 3.87, z]} rotation={[0, 0, Math.PI / 6]}>
              <boxGeometry args={[6.93, 0.05, 0.06]} />
              <meshStandardMaterial color="#8FA0BB" metalness={1} roughness={0.1} />
            </mesh>
            <mesh position={[3.0, 3.87, z]} rotation={[0, 0, -Math.PI / 6]}>
              <boxGeometry args={[6.93, 0.05, 0.06]} />
              <meshStandardMaterial color="#8FA0BB" metalness={1} roughness={0.1} />
            </mesh>
          </group>
        )
      })}

      {/* Gable end triangles */}
      {[-4.2, 4.2].map((z, i) => {
        const shape = new THREE.Shape()
        shape.moveTo(-7, 0); shape.lineTo(7, 0); shape.lineTo(0, 2); shape.lineTo(-7, 0)
        const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.1, bevelEnabled: false })
        return (
          <mesh key={i} position={[0, 3.6, z]} rotation={[Math.PI / 2, 0, 0]}>
            <primitive object={geo} />
            <meshStandardMaterial color="#1a2035" metalness={0.4} roughness={0.8} />
          </mesh>
        )
      })}

      {/* PURLINS — horizontal roof cross-members that the rails bolt to */}
      {/* Left slope purlins */}
      {[-2, 0, 2].map((x, i) => {
        const slope = Math.PI / 6
        const px = -4 + i * 2
        const py = 3.65 + Math.abs(px) * Math.tan(slope) * 0.5
        return (
          <mesh key={`pl-${i}`} position={[px - 2.5, py + 0.25, 0]} rotation={[0, 0, slope]}>
            <boxGeometry args={[0.12, 0.12, 8.2]} />
            <meshStandardMaterial color="#8FA0BB" metalness={0.9} roughness={0.2} />
          </mesh>
        )
      })}
      {/* Right slope purlins */}
      {[-2, 0, 2].map((x, i) => {
        const slope = -Math.PI / 6
        const px = i * 2
        const py = 3.65 + Math.abs(px - 2) * Math.tan(Math.PI / 6) * 0.5
        return (
          <mesh key={`pr-${i}`} position={[px + 0.5, py + 0.25, 0]} rotation={[0, 0, slope]}>
            <boxGeometry args={[0.12, 0.12, 8.2]} />
            <meshStandardMaterial color="#8FA0BB" metalness={0.9} roughness={0.2} />
          </mesh>
        )
      })}

      {/* Ground / forecourt */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 6]} receiveShadow>
        <planeGeometry args={[20, 8]} />
        <meshStandardMaterial color="#0d1220" roughness={0.95} metalness={0.1} />
      </mesh>

      {/* Concrete base */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[14.5, 0.1, 8.5]} />
        <meshStandardMaterial color="#111827" roughness={0.9} metalness={0.05} />
      </mesh>
    </group>
  )
}

/* ─── ALUMINUM RAIL ─── */
function AlumRail({ length = 7.6, roofSide = 'left', ...props }) {
  const slope = roofSide === 'left' ? Math.PI / 6 : -Math.PI / 6
  const shape = new THREE.Shape()
  shape.moveTo(-0.06, 0); shape.lineTo(-0.06, 0.05)
  shape.lineTo(-0.02, 0.05); shape.lineTo(-0.02, 0.18)
  shape.lineTo(-0.04, 0.18); shape.lineTo(-0.04, 0.22)
  shape.lineTo(0.04, 0.22); shape.lineTo(0.04, 0.18)
  shape.lineTo(0.02, 0.18); shape.lineTo(0.02, 0.05)
  shape.lineTo(0.06, 0.05); shape.lineTo(0.06, 0)
  shape.lineTo(-0.06, 0)
  const geo = new THREE.ExtrudeGeometry(shape, { depth: length, bevelEnabled: false })
  geo.translate(0, 0, -length / 2)

  return (
    <group {...props}>
      <mesh geometry={geo} castShadow>
        <meshStandardMaterial color="#C9D4E0" metalness={0.95} roughness={0.15} envMapIntensity={1.5} />
      </mesh>
    </group>
  )
}

/* ─── L-FOOT CLAMP ─── */
function LFoot({ ...props }) {
  return (
    <group {...props}>
      <mesh castShadow>
        <boxGeometry args={[0.25, 0.04, 0.18]} />
        <meshStandardMaterial color="#8FA0BB" metalness={0.95} roughness={0.2} />
      </mesh>
      <mesh castShadow position={[0, 0.12, 0]}>
        <boxGeometry args={[0.05, 0.2, 0.14]} />
        <meshStandardMaterial color="#8FA0BB" metalness={0.95} roughness={0.2} />
      </mesh>
    </group>
  )
}

/* ─── SOLAR PANEL ─── */
function SolarPanel({ ...props }) {
  return (
    <group {...props}>
      <mesh castShadow>
        <boxGeometry args={[1.72, 0.045, 2.75]} />
        <meshStandardMaterial color="#1a1f2e" metalness={0.7} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.024, 0]}>
        <boxGeometry args={[1.64, 0.01, 2.67]} />
        <meshStandardMaterial color="#0a1633" metalness={0.9} roughness={0.1}
          emissive="#050d1f" emissiveIntensity={0.3} />
      </mesh>
      {/* cell grid */}
      {Array.from({ length: 6 }).flatMap((_, c) =>
        Array.from({ length: 10 }).map((_, r) => {
          const cw = 1.58 / 6, ch = 2.61 / 10
          return (
            <mesh key={`${c}-${r}`} position={[-0.79 + cw * (c + 0.5), 0.026, -1.305 + ch * (r + 0.5)]}>
              <boxGeometry args={[cw * 0.92, 0.008, ch * 0.92]} />
              <meshStandardMaterial color="#0d2451" metalness={0.85} roughness={0.2} />
            </mesh>
          )
        })
      )}
    </group>
  )
}

/* ─── BOLT FLASH ─── */
function BoltFlash({ position, visible }) {
  if (!visible) return null
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.06, 8, 8]} />
      <meshStandardMaterial color="#FBB034" emissive="#FBB034" emissiveIntensity={5} />
    </mesh>
  )
}

/* ─── MAIN SCENE ─── */
function FactoryScene({ scrollRef }) {
  // Rail groups — start offscreen
  const leftRailsGroup  = useRef()
  const rightRailsGroup = useRef()
  // Panel group — start above
  const panelsGroup = useRef()
  // Bolt flashes
  const boltsRef = useRef([])

  // Rail start positions (where they rest on the left/right slopes)
  // Left slope: 3 rails at z = -2.5, 0, 2.5; angled +30° tilt
  // Right slope: 3 rails at same z, angled -30°

  useFrame(() => {
    const p = scrollRef.current // 0 → 1
    if (!leftRailsGroup.current || !rightRailsGroup.current || !panelsGroup.current) return

    // Phase 1 (0–0.35): Rails fly in from left/right
    const railP = THREE.MathUtils.clamp(p / 0.35, 0, 1)
    const railEase = 1 - Math.pow(1 - railP, 3) // easeOutCubic
    leftRailsGroup.current.position.x  = THREE.MathUtils.lerp(-18, 0, railEase)
    rightRailsGroup.current.position.x = THREE.MathUtils.lerp(18, 0, railEase)

    // Phase 2 (0.4–0.65): Panels drop one by one
    const panelChildren = panelsGroup.current.children
    panelChildren.forEach((panel, i) => {
      const start = 0.40 + i * 0.08
      const pp = THREE.MathUtils.clamp((p - start) / 0.14, 0, 1)
      const pe = pp < 1 ? 1 - Math.pow(1 - pp, 4) : 1 // easeOutQuart with slight bounce feel
      panel.position.y = THREE.MathUtils.lerp(14, 0, pe)
      panel.material = panel.material // keep material
    })
  })

  // Roof left slope rail positions (3 rails parallel to Z-axis)
  const leftRailPositions  = [[-4.8, 4.44, 0], [-3.3, 4.09, 0], [-1.8, 3.74, 0]]
  const rightRailPositions = [[ 1.8, 3.74, 0], [ 3.3, 4.09, 0], [ 4.8, 4.44, 0]]

  // Panel positions (6 panels: 3 per slope)
  const leftPanelPositions  = [[-4.1, 4.30, -1.4], [-4.1, 4.30, 1.4], [-2.55, 3.95, 0]]
  const rightPanelPositions = [[ 4.1, 4.30, -1.4], [ 4.1, 4.30, 1.4], [ 2.55, 3.95, 0]]

  const leftSlope  =  Math.PI / 6
  const rightSlope = -Math.PI / 6

  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[8, 14, 6]} intensity={2.2} color="#FBB034" castShadow
        shadow-mapSize={[2048, 2048]} shadow-camera-far={60}
        shadow-camera-left={-15} shadow-camera-right={15}
        shadow-camera-top={12} shadow-camera-bottom={-5} />
      <directionalLight position={[-8, 6, -4]} intensity={0.7} color="#4A6282" />
      <pointLight position={[0, 8, 8]} intensity={1.0} color="#E05540" />

      <FactoryBuilding />

      {/* LEFT RAILS — fly in from left */}
      <group ref={leftRailsGroup}>
        {leftRailPositions.map((pos, i) => (
          <group key={i}>
            <AlumRail position={pos} rotation={[0, 0, leftSlope]} length={7.6} roofSide="left" />
            {/* L-foot clamps at 3 points along the rail */}
            {[-2.8, 0, 2.8].map((z, j) => (
              <LFoot key={j} position={[pos[0] - 0.01, pos[1] + 0.14, pos[2] + z]}
                rotation={[0, 0, leftSlope]} />
            ))}
          </group>
        ))}
      </group>

      {/* RIGHT RAILS — fly in from right */}
      <group ref={rightRailsGroup}>
        {rightRailPositions.map((pos, i) => (
          <group key={i}>
            <AlumRail position={pos} rotation={[0, 0, rightSlope]} length={7.6} roofSide="right" />
            {[-2.8, 0, 2.8].map((z, j) => (
              <LFoot key={j} position={[pos[0] + 0.01, pos[1] + 0.14, pos[2] + z]}
                rotation={[0, 0, rightSlope]} />
            ))}
          </group>
        ))}
      </group>

      {/* PANELS — drop from above */}
      <group ref={panelsGroup}>
        {leftPanelPositions.map((pos, i) => (
          <group key={`lp-${i}`} position={[pos[0], pos[1] + 14, pos[2]]}
            rotation={[0, 0, leftSlope]}>
            <SolarPanel />
          </group>
        ))}
        {rightPanelPositions.map((pos, i) => (
          <group key={`rp-${i}`} position={[pos[0], pos[1] + 14, pos[2]]}
            rotation={[0, 0, rightSlope]}>
            <SolarPanel />
          </group>
        ))}
      </group>

      <ContactShadows position={[0, 0.01, 0]} opacity={0.6} scale={28} blur={3} far={8} />
      <Environment preset="sunset" background={false} />
    </>
  )
}

/* ─── HERO SECTION ─── */
const Hero = () => {
  const sectionRef  = useRef(null)
  const scrollRef   = useRef(0)
  const phaseRef    = useRef(null)
  const progressRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=3000',
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
        onUpdate: self => {
          scrollRef.current = self.progress

          // Update phase label
          const phase =
            self.progress < 0.05 ? 'READY' :
            self.progress < 0.35 ? 'ASSEMBLING RAILS' :
            self.progress < 0.42 ? 'SECURING STRUCTURE' :
            self.progress < 0.80 ? 'MOUNTING PANELS' : 'SYSTEM COMPLETE'

          if (phaseRef.current) phaseRef.current.textContent = phase

          // Progress bar
          if (progressRef.current) {
            progressRef.current.style.width = `${self.progress * 100}%`
          }
        },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} style={{
      position: 'relative',
      height: '100vh',
      width: '100%',
      overflow: 'hidden',
      background: '#060912',
    }}>
      {/* Full-bleed 3D Canvas */}
      <div style={{ position:'absolute', inset:0 }}>
        <Canvas
          shadows
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: false }}
          style={{ background:'#060912' }}
        >
          <PerspectiveCamera makeDefault position={[0, 7, 16]} fov={48} />
          <Suspense fallback={null}>
            <FactoryScene scrollRef={scrollRef} />
          </Suspense>
        </Canvas>
      </div>

      {/* Dark vignette overlay at edges */}
      <div style={{
        position:'absolute', inset:0, pointerEvents:'none',
        background:'radial-gradient(ellipse at center, transparent 40%, rgba(6,9,18,0.7) 100%)',
      }} />

      {/* Bottom progress bar */}
      <div style={{
        position:'absolute', bottom:0, left:0, right:0,
        height:2, background:'var(--bg-elevated)', zIndex:10
      }}>
        <div ref={progressRef} style={{
          height:'100%', width:'0%',
          background:'var(--gradient-sun)',
          transition:'width 0.1s linear',
        }} />
      </div>

      {/* Phase indicator — bottom left */}
      <div style={{
        position:'absolute', bottom:'1.8rem', left:'2rem', zIndex:10,
        display:'flex', alignItems:'center', gap:'0.8rem',
        padding:'0.5rem 1rem',
        background:'rgba(6,9,18,0.7)', backdropFilter:'blur(12px)',
        border:'1px solid var(--border-subtle)',
      }}>
        <div style={{
          width:7, height:7, borderRadius:'50%',
          background:'var(--sun-orange)',
          boxShadow:'0 0 10px var(--sun-orange)',
          animation:'blink 1.8s ease-in-out infinite',
        }} />
        <span style={{ fontFamily:'JetBrains Mono', fontSize:'0.68rem', letterSpacing:'0.2em', color:'var(--text-muted)' }}>STATUS</span>
        <span ref={phaseRef} style={{ fontFamily:'JetBrains Mono', fontSize:'0.68rem', letterSpacing:'0.15em', color:'var(--sun-orange)', fontWeight:500 }}>READY</span>
      </div>

      {/* Scroll cue — bottom center */}
      <div style={{
        position:'absolute', bottom:'1.8rem', left:'50%', transform:'translateX(-50%)',
        zIndex:10, display:'flex', flexDirection:'column', alignItems:'center', gap:'0.4rem',
        color:'var(--aluminum-mid)', fontFamily:'JetBrains Mono', fontSize:'0.65rem', letterSpacing:'0.2em',
      }}>
        SCROLL TO ASSEMBLE
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none" style={{ animation:'bounce 2s ease-in-out infinite' }}>
          <rect x="5" y="1" width="6" height="12" rx="3" stroke="currentColor" strokeWidth="1.2" />
          <rect x="7" y="3" width="2" height="4" rx="1" fill="currentColor" style={{ animation:'scrollDot 2s ease-in-out infinite' }} />
          <path d="M4 18l4 4 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </div>

      <style>{`
        @keyframes blink{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(1.3)}}
        @keyframes bounce{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(5px)}}
        @keyframes scrollDot{0%,100%{opacity:1;transform:translateY(0)}50%{opacity:0.3;transform:translateY(4px)}}
      `}</style>
    </section>
  )
}

export default Hero
