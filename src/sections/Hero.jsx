import { useRef, useEffect, Suspense, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, Environment } from '@react-three/drei'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'
import { DownloadIcon, ArrowRightIcon } from '../components/icons'

gsap.registerPlugin(ScrollTrigger)

/*
  COORDINATE SYSTEM
  ─────────────────
  • y = 0  → the factory ROOF surface (world origin = centre of roof)
  • Positive X → right (toward SUNMOUNT face side in image)
  • Positive Z → toward viewer / camera
  • Camera sits upper-right-front, looking down-left at the roof
  • Factory image is the CSS background; Three.js canvas is transparent
    on top.  All 3D elements placed at y ≈ 0 appear "on the roof".

  LAYOUT (matches image-5 annotation)
  ────────────────────────────────────
  3 sets × 2 rails = 6 rails total
  Rails run along Z (front → back of roof)
  They fly in from x = -20 (left of image) → final X positions:
    Set 1: x = 0.8  and  2.5
    Set 2: x = 3.2  and  4.9
    Set 3: x = 5.6  and  7.3
  2 panels per set at z = 1.6 and z = 4.4
*/

const RAIL_Z0   = -0.5    // rail start in Z
const RAIL_Z1   = 6.0     // rail end in Z
const RAIL_LEN  = RAIL_Z1 - RAIL_Z0    // 6.5
const RAIL_MIDZ = (RAIL_Z0 + RAIL_Z1) / 2  // 2.75
const RAIL_Y    = 0.07    // sits on roof surface

const SETS = [
  { rails: [0.8, 2.5] },
  { rails: [3.2, 4.9] },
  { rails: [5.6, 7.3] },
]
const PANEL_ZS = [1.6, 4.4]          // 2 panels per set
const PANEL_TILT = Math.PI * 0.09    // 16° toward viewer

const ALL_RAILS = SETS.flatMap((s, si) =>
  s.rails.map((finalX, ri) => ({ si, ri, finalX, idx: si * 2 + ri }))
)
const ALL_PANELS = SETS.flatMap((s, si) =>
  PANEL_ZS.map((pz, pi) => ({
    si, pi, pz,
    cx: (s.rails[0] + s.rails[1]) / 2,
    idx: si * 2 + pi,
  }))
)

/* ─── T-SLOT ALUMINUM RAIL ─── */
function AlumRail() {
  const shape = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(-0.07, 0);  s.lineTo(-0.07, 0.05)
    s.lineTo(-0.025, 0.05); s.lineTo(-0.025, 0.20)
    s.lineTo(-0.05,  0.20); s.lineTo(-0.05,  0.26)
    s.lineTo( 0.05,  0.26); s.lineTo( 0.05,  0.20)
    s.lineTo( 0.025, 0.20); s.lineTo( 0.025, 0.05)
    s.lineTo( 0.07,  0.05); s.lineTo( 0.07,  0)
    s.lineTo(-0.07, 0)
    return s
  }, [])
  const geo = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(shape, { depth: RAIL_LEN, bevelEnabled: false })
    g.translate(0, 0, -RAIL_LEN / 2)
    return g
  }, [shape])
  return (
    <mesh geometry={geo} castShadow receiveShadow>
      <meshStandardMaterial color="#C4CFE0" metalness={0.97} roughness={0.09} envMapIntensity={2.5} />
    </mesh>
  )
}

/* ─── HEX BOLT (tiny, drops into rail) ─── */
function SmBolt() {
  return (
    <group>
      <mesh position={[0, 0.042, 0]}>
        <cylinderGeometry args={[0.022, 0.022, 0.022, 6]} />
        <meshStandardMaterial color="#666" metalness={1} roughness={0.15} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.010, 0.010, 0.055, 8]} />
        <meshStandardMaterial color="#888" metalness={1} roughness={0.18} />
      </mesh>
    </group>
  )
}

/* ─── PREMIUM SOLAR PANEL ─── */
function SolarPanel() {
  const PW = 1.65, PH = 2.65, PD = 0.038
  const COLS = 6, ROWS = 10
  const cw = (PW - 0.09) / COLS, ch = (PH - 0.09) / ROWS
  const cells = useMemo(() =>
    Array.from({ length: COLS }).flatMap((_, c) =>
      Array.from({ length: ROWS }).map((_, r) => ({
        x: -(PW - 0.09) / 2 + cw * (c + 0.5),
        z: -(PH - 0.09) / 2 + ch * (r + 0.5),
      }))
    ), []
  )
  return (
    <group>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[PW, PD, PH]} />
        <meshStandardMaterial color="#DCE5EF" metalness={0.94} roughness={0.14} />
      </mesh>
      <mesh position={[0, PD / 2 + 0.003, 0]}>
        <boxGeometry args={[PW - 0.07, 0.007, PH - 0.07]} />
        <meshStandardMaterial color="#08195A" metalness={0.55} roughness={0.06}
          emissive="#0B2E99" emissiveIntensity={0.6} />
      </mesh>
      {cells.map((c, i) => (
        <mesh key={i} position={[c.x, PD / 2 + 0.008, c.z]}>
          <boxGeometry args={[cw * 0.88, 0.005, ch * 0.88]} />
          <meshStandardMaterial color="#1638BB" metalness={0.72} roughness={0.04}
            emissive="#1638BB" emissiveIntensity={0.44} />
        </mesh>
      ))}
    </group>
  )
}

/* ─── ASSEMBLY SCENE ─── */
function AssemblyScene({ scrollRef }) {
  const railRefs  = useRef([])
  const boltRefs  = useRef(ALL_RAILS.map(() => [null, null]))
  const panelRefs = useRef([])

  // Invisible roof plane — catches shadows
  const roofGeo = useMemo(() => new THREE.PlaneGeometry(30, 20), [])

  useFrame(() => {
    const p = scrollRef.current

    /* Phase 1 (0 → 0.35): rails slide from x=-20 → finalX */
    const rP = THREE.MathUtils.clamp(p / 0.35, 0, 1)
    const rE = 1 - Math.pow(1 - rP, 3)
    ALL_RAILS.forEach(r => {
      const g = railRefs.current[r.idx]
      if (g) g.position.x = THREE.MathUtils.lerp(-20, r.finalX, rE)
    })

    /* Phase 2 (0.38 → 0.62): bolts drop in LOCAL y (0.65 → 0.07) */
    ALL_RAILS.forEach(r => {
      boltRefs.current[r.idx].forEach((b, bi) => {
        if (!b) return
        const t0 = 0.38 + r.si * 0.038 + bi * 0.020
        const bP = THREE.MathUtils.clamp((p - t0) / 0.10, 0, 1)
        b.position.y = THREE.MathUtils.lerp(0.65, 0.07, 1 - Math.pow(1 - bP, 4))
      })
    })

    /* Phase 3 (0.65 → 0.97): panels drop from y=18 → RAIL_Y+0.30 */
    ALL_PANELS.forEach(pan => {
      const ref = panelRefs.current[pan.idx]
      if (!ref) return
      const t0 = 0.65 + pan.si * 0.065 + pan.pi * 0.038
      const pP = THREE.MathUtils.clamp((p - t0) / 0.12, 0, 1)
      ref.position.y = THREE.MathUtils.lerp(18, RAIL_Y + 0.30, 1 - Math.pow(1 - pP, 4))
    })
  })

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[6, 16, 10]} intensity={2.2} color="#FFD060" castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-15} shadow-camera-right={15}
        shadow-camera-top={12} shadow-camera-bottom={-4} />
      <directionalLight position={[-8, 8, -6]} intensity={0.5} color="#6688BB" />
      <pointLight position={[4, 5, 8]} intensity={1.0} color="#E04A30" distance={25} />

      {/* Invisible shadow-catching plane (the roof surface) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <primitive object={roofGeo} />
        <shadowMaterial opacity={0.28} />
      </mesh>

      {/* ── 6 RAILS, each with 2 bolts as children ── */}
      {ALL_RAILS.map(r => (
        <group
          key={r.idx}
          ref={el => { railRefs.current[r.idx] = el }}
          position={[-20, RAIL_Y, RAIL_MIDZ]}   // starts off-screen left
        >
          <AlumRail />
          {/* 2 bolts in LOCAL space, local-z = panel world-z minus parent's world-z */}
          {PANEL_ZS.map((pz, bi) => (
            <group
              key={bi}
              ref={el => { boltRefs.current[r.idx][bi] = el }}
              position={[0, 0.65, pz - RAIL_MIDZ]}
            >
              <SmBolt />
            </group>
          ))}
        </group>
      ))}

      {/* ── 6 PANELS ── */}
      {ALL_PANELS.map(pan => (
        <group
          key={pan.idx}
          ref={el => { panelRefs.current[pan.idx] = el }}
          position={[pan.cx, 18, pan.pz]}
          rotation={[PANEL_TILT, 0, 0]}
        >
          <SolarPanel />
        </group>
      ))}

      <Environment preset="sunset" background={false} />
    </>
  )
}

/* ─── HERO SECTION ─── */
const Hero = () => {
  const sectionRef = useRef(null)
  const scrollRef  = useRef(0)
  const phaseRef   = useRef(null)
  const progRef    = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top', end: '+=3200',
        pin: true, scrub: 0.85, anticipatePin: 1,
        onUpdate: self => {
          scrollRef.current = self.progress
          const phase =
            self.progress < 0.04 ? 'READY' :
            self.progress < 0.35 ? 'SLIDING RAILS INTO POSITION' :
            self.progress < 0.64 ? 'BOLTING STRUCTURE' :
            self.progress < 0.96 ? 'MOUNTING SOLAR PANELS' :
                                   'INSTALLATION COMPLETE ✓'
          if (phaseRef.current) phaseRef.current.textContent = phase
          if (progRef.current)  progRef.current.style.width = `${self.progress * 100}%`
        },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} style={{
      position: 'relative', height: '100vh', overflow: 'hidden',
    }}>
      {/* ── FACTORY PHOTO BACKGROUND ── */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage:    'url(/factory.png)',
        backgroundSize:     'cover',
        backgroundPosition: '50% 35%',
        backgroundRepeat:   'no-repeat',
      }} />

      {/* Subtle dark overlay so 3D elements contrast well */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg,rgba(6,9,18,.45) 0%,rgba(6,9,18,.18) 45%,rgba(6,9,18,.55) 100%)',
        pointerEvents: 'none',
      }} />

      {/*
        THREE.JS OVERLAY — transparent canvas, full screen.

        CAMERA CALIBRATION (matches factory image):
        • The factory image is shot from ~32° elevation, ~38° azimuth (upper-right).
        • In 3D, y=0 = the flat roof surface.
        • Camera position [8, 7, 10] + lookAt [2.5, 0, 1] puts the
          right-half of the y=0 plane (our panel zone) in the centre of
          the canvas, roughly where the roof appears in the factory photo.
        • Rails/panels at y=0..0.35 appear to lie ON the roof.
      */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <Canvas
          shadows
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <PerspectiveCamera
            makeDefault
            position={[8, 7, 10]}
            fov={46}
            near={0.1}
            far={120}
          />
          <Suspense fallback={null}>
            <AssemblyScene scrollRef={scrollRef} />
          </Suspense>
        </Canvas>
      </div>

      {/* ── PROGRESS BAR ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 3, background: 'rgba(255,255,255,0.07)', zIndex: 20,
      }}>
        <div ref={progRef} style={{
          height: '100%', width: '0%',
          background: 'linear-gradient(90deg,#E05540,#E8923A)',
          transition: 'width 0.07s linear',
        }} />
      </div>

      {/* ── STATUS CHIP ── */}
      <div style={{
        position: 'absolute', bottom: '1.8rem', left: '2rem', zIndex: 20,
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        padding: '0.55rem 1.1rem',
        background: 'rgba(6,9,18,0.80)', backdropFilter: 'blur(14px)',
        border: '1px solid rgba(201,212,224,0.10)',
      }}>
        <div style={{
          width: 7, height: 7, borderRadius: '50%',
          background: '#E05540', boxShadow: '0 0 10px #E05540',
          animation: 'blink 1.6s ease-in-out infinite',
        }} />
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.67rem', letterSpacing: '0.18em', color: 'var(--text-muted)' }}>STATUS</span>
        <span ref={phaseRef} style={{ fontFamily: 'JetBrains Mono', fontSize: '0.67rem', letterSpacing: '0.13em', color: '#E8923A', fontWeight: 600 }}>READY</span>
      </div>

      {/* ── SCROLL CUE ── */}
      <div style={{
        position: 'absolute', bottom: '1.8rem', right: '2rem', zIndex: 20,
        display: 'flex', alignItems: 'center', gap: '0.6rem',
        fontFamily: 'JetBrains Mono', fontSize: '0.65rem',
        letterSpacing: '0.2em', color: 'var(--aluminum-mid)',
      }}>
        SCROLL TO ASSEMBLE
        <div style={{
          width: 1, height: 28,
          background: 'linear-gradient(180deg,#E05540,transparent)',
          animation: 'pulse 2s ease-in-out infinite',
        }} />
      </div>

      {/* ── CTAs ── */}
      <div style={{
        position: 'absolute', bottom: '3.8rem', left: 0, right: 0, zIndex: 20,
        display: 'flex', justifyContent: 'center', gap: '1rem', padding: '0 2rem',
      }}>
        <a href="#products" className="btn-primary" style={{ fontSize: '0.82rem', padding: '0.8rem 1.8rem' }}>
          Explore Products <ArrowRightIcon />
        </a>
        <a href="https://www.sunmount.in/wp-content/uploads/2024/09/Catalogue-2024-rev-2.pdf"
          target="_blank" rel="noopener noreferrer"
          className="btn-secondary"
          style={{ fontSize: '0.82rem', padding: '0.8rem 1.8rem', background: 'rgba(6,9,18,0.65)', backdropFilter: 'blur(8px)' }}>
          <DownloadIcon /> Catalogue
        </a>
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.4)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>
    </section>
  )
}

export default Hero
