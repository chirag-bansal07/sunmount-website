import { useRef, useEffect, Suspense, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, Environment } from '@react-three/drei'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'
import { DownloadIcon, ArrowRightIcon } from '../components/icons'

gsap.registerPlugin(ScrollTrigger)

/* ─────────────────────────────────────────────
   ALUMINUM MOUNTING RAIL
   Runs along Z-axis. Flies in from ±X.
   T-slot extrusion cross-section.
───────────────────────────────────────────── */
function AlumRail({ length = 7.5 }) {
  const geo = new THREE.Shape()
  geo.moveTo(-0.07, 0)
  geo.lineTo(-0.07, 0.06)
  geo.lineTo(-0.025, 0.06)
  geo.lineTo(-0.025, 0.22)
  geo.lineTo(-0.05,  0.22)
  geo.lineTo(-0.05,  0.28)
  geo.lineTo( 0.05,  0.28)
  geo.lineTo( 0.05,  0.22)
  geo.lineTo( 0.025, 0.22)
  geo.lineTo( 0.025, 0.06)
  geo.lineTo( 0.07,  0.06)
  geo.lineTo( 0.07,  0)
  geo.lineTo(-0.07, 0)

  const geometry = new THREE.ExtrudeGeometry(geo, {
    depth: length, bevelEnabled: false,
  })
  geometry.translate(0, 0, -length / 2)

  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial
        color="#D8E0EC"
        metalness={0.96}
        roughness={0.12}
        envMapIntensity={1.8}
      />
    </mesh>
  )
}

/* ─────────────────────────────────────────────
   SMALL BOLT  (drops from above into rail)
───────────────────────────────────────────── */
function Bolt({ position }) {
  return (
    <group position={position}>
      {/* Hex head */}
      <mesh position={[0, 0.045, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 0.018, 6]} />
        <meshStandardMaterial color="#888" metalness={1} roughness={0.2} />
      </mesh>
      {/* Shank */}
      <mesh position={[0, 0.01, 0]}>
        <cylinderGeometry args={[0.009, 0.009, 0.05, 8]} />
        <meshStandardMaterial color="#999" metalness={1} roughness={0.2} />
      </mesh>
    </group>
  )
}

/* ─────────────────────────────────────────────
   SOLAR PANEL  — bright premium blue
───────────────────────────────────────────── */
function SolarPanel() {
  const W = 1.68, H = 2.72, D = 0.04
  const cells = { cols: 6, rows: 10 }
  const cw = (W - 0.08) / cells.cols
  const ch = (H - 0.08) / cells.rows

  return (
    <group>
      {/* Anodised aluminium frame */}
      <mesh castShadow>
        <boxGeometry args={[W, D, H]} />
        <meshStandardMaterial color="#E2E8F0" metalness={0.92} roughness={0.18} />
      </mesh>

      {/* PV laminate — glowing blue */}
      <mesh position={[0, D / 2 + 0.002, 0]}>
        <boxGeometry args={[W - 0.06, 0.005, H - 0.06]} />
        <meshStandardMaterial
          color="#0A1D6B"
          metalness={0.6}
          roughness={0.08}
          emissive="#0D3099"
          emissiveIntensity={0.55}
        />
      </mesh>

      {/* Cell grid */}
      {Array.from({ length: cells.cols }).flatMap((_, c) =>
        Array.from({ length: cells.rows }).map((_, r) => {
          const x = -(W - 0.08) / 2 + cw * (c + 0.5)
          const z = -(H - 0.08) / 2 + ch * (r + 0.5)
          return (
            <mesh key={`${c}-${r}`} position={[x, D / 2 + 0.005, z]}>
              <boxGeometry args={[cw * 0.90, 0.003, ch * 0.90]} />
              <meshStandardMaterial
                color="#1840CC"
                metalness={0.7}
                roughness={0.06}
                emissive="#1840CC"
                emissiveIntensity={0.4}
              />
            </mesh>
          )
        })
      )}

      {/* Anti-reflective sheen plane */}
      <mesh position={[0, D / 2 + 0.007, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[W - 0.07, 0.001, H - 0.07]} />
        <meshStandardMaterial
          color="#4488FF"
          metalness={0.3}
          roughness={0.02}
          transparent
          opacity={0.08}
        />
      </mesh>
    </group>
  )
}

/* ─────────────────────────────────────────────
   FLASH SPARK  (tiny sphere at bolt landing)
───────────────────────────────────────────── */
function Spark({ position, visible }) {
  if (!visible) return null
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.04, 8, 8]} />
      <meshStandardMaterial
        color="#FBB034"
        emissive="#FBB034"
        emissiveIntensity={8}
        transparent
        opacity={0.9}
      />
    </mesh>
  )
}

/* ─────────────────────────────────────────────
   ASSEMBLY SCENE
   The flat factory roof sits at y = 0.
   Rails  → slide in from ±X to rest on roof
   Bolts  → drop from y+0.6 to y+0.06 on each rail
   Panels → drop from y+9 to y+0.06 (on top of rails)
───────────────────────────────────────────── */

// Rail layout on the flat roof:
// 4 rails running along Z (long building axis)
// They fly in from screen-left (x=-18) and screen-right (x=18) in two groups
const RAIL_Z    = [-3.5, -1.2,  1.2,  3.5]   // 4 rails across roof width
const RAIL_Y    = 0.10                          // resting height on roof surface
const RAIL_LEN  = 8.5                           // spans roof length (Z direction)

// Bolts: 3 per rail at regular Z intervals
const BOLT_Z_OFFSETS = [-3, 0, 3]

// Panels: mounted in a 2×4 grid (2 X, 4 Z)
// Tilt: 18° along X axis (south-facing, toward viewer)
const PANEL_TILT = -Math.PI * 0.10            // ~18° tilt toward viewer
const PANEL_POSITIONS = [
  [-2.0, -2.7], [-2.0,  0.0], [-2.0,  2.7],
  [ 2.0, -2.7], [ 2.0,  0.0], [ 2.0,  2.7],
]
// Panel sits on top of rails: rail top is at RAIL_Y + 0.28 (rail height)
// Panel frame is 0.04 thick, tilt adds a little — keep it flush
const PANEL_Y_FINAL = RAIL_Y + 0.30

function AssemblyScene({ scrollRef }) {
  // --- Rail refs (4 rails, split into left group and right group) ---
  const leftRailsRef  = useRef([])   // rails at RAIL_Z[0] and RAIL_Z[1]
  const rightRailsRef = useRef([])   // rails at RAIL_Z[2] and RAIL_Z[3]

  // --- Bolt groups (4 rails × 3 bolts each) ---
  const boltGroupRefs = useRef([[], [], [], []])

  // --- Panel refs ---
  const panelRefs = useRef([])

  // Track which phases have "landed" for spark effects
  const [sparks, setSparks] = useState([])

  useFrame(() => {
    const p = scrollRef.current  // 0 → 1

    /* ── PHASE 1: RAILS (0 → 0.32) ── */
    const railP = THREE.MathUtils.clamp(p / 0.32, 0, 1)
    const railE = 1 - Math.pow(1 - railP, 3)  // easeOutCubic

    leftRailsRef.current.forEach(rail => {
      if (rail) rail.position.x = THREE.MathUtils.lerp(-18, 0, railE)
    })
    rightRailsRef.current.forEach(rail => {
      if (rail) rail.position.x = THREE.MathUtils.lerp(18, 0, railE)
    })

    /* ── PHASE 2: BOLTS (0.36 → 0.56) — staggered per rail ── */
    const allRails = [...leftRailsRef.current, ...rightRailsRef.current]
    allRails.forEach((_, railIdx) => {
      BOLT_Z_OFFSETS.forEach((_, boltIdx) => {
        const bRef = boltGroupRefs.current[railIdx]?.[boltIdx]
        if (!bRef) return
        const start = 0.36 + railIdx * 0.025 + boltIdx * 0.012
        const bp = THREE.MathUtils.clamp((p - start) / 0.10, 0, 1)
        const be = bp < 1 ? 1 - Math.pow(1 - bp, 4) : 1
        bRef.position.y = THREE.MathUtils.lerp(0.7, 0.06, be)
      })
    })

    /* ── PHASE 3: PANELS (0.60 → 0.95) — staggered ── */
    panelRefs.current.forEach((panel, i) => {
      if (!panel) return
      const start = 0.60 + i * 0.055
      const pp = THREE.MathUtils.clamp((p - start) / 0.12, 0, 1)
      const pe = pp < 1 ? 1 - Math.pow(1 - pp, 4) : 1
      panel.position.y = THREE.MathUtils.lerp(9, PANEL_Y_FINAL, pe)
    })
  })

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 18, 8]}
        intensity={2.5}
        color="#FBB034"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={10}
        shadow-camera-bottom={-5}
      />
      <directionalLight position={[-8, 10, -6]} intensity={0.8} color="#4A6282" />
      <pointLight position={[0, 4, 6]} intensity={1.2} color="#E05540" />

      {/* ── INVISIBLE ROOF COLLISION PLANE (for shadows) ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <shadowMaterial opacity={0.35} />
      </mesh>

      {/* ── LEFT RAILS (RAIL_Z[0] and RAIL_Z[1]) ── */}
      {[RAIL_Z[0], RAIL_Z[1]].map((z, i) => (
        <group
          key={`lr-${i}`}
          ref={el => (leftRailsRef.current[i] = el)}
          position={[-18, RAIL_Y, z]}
        >
          <AlumRail length={RAIL_LEN} />
        </group>
      ))}

      {/* ── RIGHT RAILS (RAIL_Z[2] and RAIL_Z[3]) ── */}
      {[RAIL_Z[2], RAIL_Z[3]].map((z, i) => (
        <group
          key={`rr-${i}`}
          ref={el => (rightRailsRef.current[i] = el)}
          position={[18, RAIL_Y, z]}
        >
          <AlumRail length={RAIL_LEN} />
        </group>
      ))}

      {/* ── BOLTS on each rail ── */}
      {[RAIL_Z[0], RAIL_Z[1], RAIL_Z[2], RAIL_Z[3]].map((z, railIdx) => (
        BOLT_Z_OFFSETS.map((bz, boltIdx) => (
          <group
            key={`bolt-${railIdx}-${boltIdx}`}
            ref={el => {
              if (!boltGroupRefs.current[railIdx]) boltGroupRefs.current[railIdx] = []
              boltGroupRefs.current[railIdx][boltIdx] = el
            }}
            position={[0, 0.7, z + bz]}
          >
            <Bolt position={[0, 0, 0]} />
          </group>
        ))
      ))}

      {/* ── PANELS ── */}
      {PANEL_POSITIONS.map(([px, pz], i) => (
        <group
          key={`panel-${i}`}
          ref={el => (panelRefs.current[i] = el)}
          position={[px, 9, pz]}
          rotation={[PANEL_TILT, 0, 0]}
        >
          <SolarPanel />
        </group>
      ))}

      <Environment preset="sunset" background={false} />
    </>
  )
}

/* ─────────────────────────────────────────────
   HERO WRAPPER
───────────────────────────────────────────── */
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
        end: '+=3200',
        pin: true,
        scrub: 0.9,
        anticipatePin: 1,
        onUpdate: self => {
          scrollRef.current = self.progress

          const phase =
            self.progress < 0.04 ? 'READY' :
            self.progress < 0.32 ? 'SLIDING RAILS INTO POSITION' :
            self.progress < 0.58 ? 'BOLTING STRUCTURE' :
            self.progress < 0.92 ? 'MOUNTING SOLAR PANELS' :
            'INSTALLATION COMPLETE ✓'

          if (phaseRef.current)    phaseRef.current.textContent = phase
          if (progressRef.current) progressRef.current.style.width = `${self.progress * 100}%`
        },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      {/* ── FACTORY BACKGROUND IMAGE ── */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(/factory.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center 30%',
        backgroundRepeat: 'no-repeat',
      }} />

      {/* Dark overlay — deepens for the 3D to pop */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(6,9,18,0.52) 0%, rgba(6,9,18,0.28) 40%, rgba(6,9,18,0.60) 100%)',
      }} />

      {/* ── THREE.JS ASSEMBLY OVERLAY ── */}
      {/*
        Camera is positioned to roughly match the factory image's perspective:
        - upper-right viewpoint, looking down-left at ~35° elevation
        - fov 44°, position (8, 7, 10) → looks at (0, 1, 0)
        The 3D scene y=0 maps to the rooftop surface of the building in the image.
        The image building roof occupies the upper-center of frame,
        so we offset canvas to the right side of the screen.
      */}
      <div style={{
        position: 'absolute',
        top: 0, right: 0,
        width: '75%',
        height: '100%',
      }}>
        <Canvas
          shadows
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <PerspectiveCamera
            makeDefault
            position={[6, 8.5, 9.5]}
            fov={44}
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
        height: 3, background: 'rgba(255,255,255,0.06)', zIndex: 20,
      }}>
        <div ref={progressRef} style={{
          height: '100%', width: '0%',
          background: 'linear-gradient(90deg, #E05540, #E8923A)',
          transition: 'width 0.08s linear',
        }} />
      </div>

      {/* ── PHASE INDICATOR ── */}
      <div style={{
        position: 'absolute', bottom: '1.8rem', left: '2rem', zIndex: 20,
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        padding: '0.55rem 1.1rem',
        background: 'rgba(6,9,18,0.75)', backdropFilter: 'blur(14px)',
        border: '1px solid rgba(201,212,224,0.1)',
      }}>
        <div style={{
          width: 7, height: 7, borderRadius: '50%',
          background: '#E05540',
          boxShadow: '0 0 10px #E05540',
          animation: 'blink 1.6s ease-in-out infinite',
        }} />
        <span style={{
          fontFamily: 'JetBrains Mono', fontSize: '0.67rem',
          letterSpacing: '0.18em', color: 'var(--text-muted)',
        }}>STATUS</span>
        <span ref={phaseRef} style={{
          fontFamily: 'JetBrains Mono', fontSize: '0.67rem',
          letterSpacing: '0.13em', color: '#E8923A', fontWeight: 600,
        }}>READY</span>
      </div>

      {/* ── SCROLL CUE ── */}
      <div style={{
        position: 'absolute', bottom: '1.8rem', right: '2rem', zIndex: 20,
        display: 'flex', alignItems: 'center', gap: '0.6rem',
        fontFamily: 'JetBrains Mono', fontSize: '0.65rem',
        letterSpacing: '0.2em', color: 'var(--aluminum-mid)',
      }}>
        SCROLL TO ASSEMBLE
        <svg width="14" height="22" viewBox="0 0 14 22" fill="none" style={{ animation: 'bob 2s ease-in-out infinite' }}>
          <rect x="4" y="1" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="1.2" />
          <rect x="6" y="3" width="2" height="3.5" rx="1" fill="currentColor" style={{ animation: 'sdot 2s ease-in-out infinite' }} />
          <path d="M3 16l4 4 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </div>

      {/* ── BOTTOM CTA BAR — fades in when assembly complete ── */}
      <div style={{
        position: 'absolute', bottom: '3.5rem', left: 0, right: 0, zIndex: 20,
        display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap',
        padding: '0 2rem',
        opacity: 0.85,
      }}>
        <a href="#products" className="btn-primary" style={{ fontSize: '0.82rem', padding: '0.8rem 1.6rem' }}>
          Explore Products <ArrowRightIcon />
        </a>
        <a
          href="https://www.sunmount.in/wp-content/uploads/2024/09/Catalogue-2024-rev-2.pdf"
          target="_blank" rel="noopener noreferrer"
          className="btn-secondary"
          style={{ fontSize: '0.82rem', padding: '0.8rem 1.6rem', background: 'rgba(6,9,18,0.6)', backdropFilter: 'blur(8px)' }}
        >
          <DownloadIcon /> Catalogue
        </a>
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.4)} }
        @keyframes bob   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(4px)} }
        @keyframes sdot  { 0%,100%{opacity:1;transform:translateY(0)} 50%{opacity:0.2;transform:translateY(3px)} }
      `}</style>
    </section>
  )
}

export default Hero
