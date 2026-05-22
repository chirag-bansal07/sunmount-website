import { useRef, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, Environment, useGLTF } from '@react-three/drei'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'
import { DownloadIcon, ArrowRightIcon } from '../components/icons'

gsap.registerPlugin(ScrollTrigger)

/* ══════════════════════════════════════════════════════════════
   COORDINATE SYSTEM (calibrated to factory image perspective)
   Camera sits at (+X, +Y, +Z) = upper-right-front corner
   Roof surface = Y = 0
   Building long axis = Z   (corrugations run along Z)
   Building short axis = X
   
   Rails run along Z (parallel to corrugations).
   3 SETS of 2 rails each, spread across X.
   Sets fly in from X = -20 (left edge of screen).
   
   Set layout on visible front-right roof area:
     Set A: rail pair at x = 0.2  and x = 1.5
     Set B: rail pair at x = 2.5  and x = 3.8
     Set C: rail pair at x = 4.8  and x = 6.1
   
   Each rail: length 6.2 along Z, centred at z = 0
   2 bolts per rail at z = -1.8 and z = 1.8
   2 panels per set, at z = -1.3 and z = 1.3,
     x = midpoint of the rail pair
══════════════════════════════════════════════════════════════ */

const SETS = [
  { xA: 0.2,  xB: 1.5 },
  { xA: 2.5,  xB: 3.8 },
  { xA: 4.8,  xB: 6.1 },
]
const RAIL_Z_HALF = 3.1          // rail half-length → full length = 6.2
const BOLT_Z     = [-1.8, 1.8]  // 2 bolts per rail
const PANEL_TILT = -0.22         // ~12.6° tilt toward viewer (south-facing)
const PANEL_W    = 1.1           // panel width in X
const PANEL_H    = 2.4           // panel height in Z (portrait)
const PANEL_Y    = 0.28          // rests on top of rail height
const PANEL_ZS   = [-1.3, 1.3]  // 2 panels per set

/* ── RAIL — T-slot extrusion along Z ── */
function Rail({ length = RAIL_Z_HALF * 2 }) {
  const profile = new THREE.Shape()
  profile.moveTo(-0.065, 0)
  profile.lineTo(-0.065, 0.055)
  profile.lineTo(-0.022, 0.055)
  profile.lineTo(-0.022, 0.19)
  profile.lineTo(-0.048, 0.19)
  profile.lineTo(-0.048, 0.24)
  profile.lineTo( 0.048, 0.24)
  profile.lineTo( 0.048, 0.19)
  profile.lineTo( 0.022, 0.19)
  profile.lineTo( 0.022, 0.055)
  profile.lineTo( 0.065, 0.055)
  profile.lineTo( 0.065, 0)
  profile.lineTo(-0.065, 0)
  const geo = new THREE.ExtrudeGeometry(profile, {
    depth: length, bevelEnabled: false,
  })
  geo.translate(0, 0, -length / 2)
  return (
    <mesh geometry={geo} castShadow receiveShadow>
      <meshStandardMaterial
        color="#D0DAE8"
        metalness={0.97}
        roughness={0.10}
        envMapIntensity={2.0}
      />
    </mesh>
  )
}

/* ── BOLT — hex head + shank ── */
function Bolt() {
  return (
    <group>
      <mesh position={[0, 0.042, 0]} castShadow>
        <cylinderGeometry args={[0.016, 0.016, 0.016, 6]} />
        <meshStandardMaterial color="#777" metalness={1} roughness={0.15} />
      </mesh>
      <mesh position={[0, 0.012, 0]} castShadow>
        <cylinderGeometry args={[0.007, 0.007, 0.045, 8]} />
        <meshStandardMaterial color="#999" metalness={1} roughness={0.2} />
      </mesh>
    </group>
  )
}

/* ── SOLAR PANEL — premium bright blue ──
   ⬇  SWAP IN REAL GLB: drop your fab.com model as /public/solar_panel.glb
   ⬇  then: const { scene } = useGLTF('/solar_panel.glb')
   ⬇  return <primitive object={scene.clone()} scale={0.01} />
*/
function SolarPanel() {
  const W = PANEL_W, D = PANEL_H, T = 0.038
  const cols = 6, rows = 10
  const cw = (W - 0.07) / cols
  const ch = (D - 0.07) / rows
  return (
    <group>
      {/* Frame */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[W, T, D]} />
        <meshStandardMaterial color="#EAEFF6" metalness={0.94} roughness={0.14} />
      </mesh>
      {/* PV surface — emissive deep blue */}
      <mesh position={[0, T / 2 + 0.001, 0]}>
        <boxGeometry args={[W - 0.055, 0.004, D - 0.055]} />
        <meshStandardMaterial
          color="#081660"
          metalness={0.55}
          roughness={0.06}
          emissive="#0B2299"
          emissiveIntensity={0.65}
        />
      </mesh>
      {/* Cell grid */}
      {Array.from({ length: cols }).flatMap((_, c) =>
        Array.from({ length: rows }).map((_, r) => (
          <mesh
            key={`${c}-${r}`}
            position={[
              -(W - 0.07) / 2 + cw * (c + 0.5),
              T / 2 + 0.003,
              -(D - 0.07) / 2 + ch * (r + 0.5),
            ]}
          >
            <boxGeometry args={[cw * 0.91, 0.003, ch * 0.91]} />
            <meshStandardMaterial
              color="#1435BB"
              metalness={0.65}
              roughness={0.04}
              emissive="#1435BB"
              emissiveIntensity={0.45}
            />
          </mesh>
        ))
      )}
      {/* AR sheen */}
      <mesh position={[0, T / 2 + 0.006, 0]}>
        <boxGeometry args={[W - 0.058, 0.0008, D - 0.058]} />
        <meshStandardMaterial
          color="#3366FF"
          transparent opacity={0.07}
          metalness={0.2} roughness={0.01}
        />
      </mesh>
    </group>
  )
}

/* ── MAIN ASSEMBLY SCENE ── */
function AssemblyScene({ scrollRef }) {
  // 6 rail refs (3 sets × 2 rails)
  const railRefs  = useRef(SETS.flatMap(() => [null, null]))
  // 12 bolt refs (6 rails × 2 bolts)  stored flat
  const boltRefs  = useRef(SETS.flatMap(() => BOLT_Z.flatMap(() => [null, null])))
  // 6 panel refs (3 sets × 2 panels)
  const panelRefs = useRef(SETS.flatMap(() => [null, null]))

  useFrame(() => {
    const p = scrollRef.current

    /* ── PHASE 1: RAILS slide in from X = -20  (0 → 0.35) ── */
    const rP = THREE.MathUtils.clamp(p / 0.35, 0, 1)
    const rE = 1 - Math.pow(1 - rP, 3)  // easeOutCubic

    SETS.forEach((set, si) => {
      // Rail A (index si*2), Rail B (index si*2+1)
      const rA = railRefs.current[si * 2]
      const rB = railRefs.current[si * 2 + 1]
      if (rA) rA.position.x = THREE.MathUtils.lerp(-20, set.xA, rE)
      if (rB) rB.position.x = THREE.MathUtils.lerp(-20, set.xB, rE)
    })

    /* ── PHASE 2: BOLTS drop  (0.38 → 0.62) staggered ── */
    let bIdx = 0
    SETS.forEach((set, si) => {
      [set.xA, set.xB].forEach((_, ri) => {
        BOLT_Z.forEach((bz, bi) => {
          const ref = boltRefs.current[bIdx]
          if (ref) {
            const start = 0.38 + si * 0.04 + ri * 0.018 + bi * 0.010
            const bp = THREE.MathUtils.clamp((p - start) / 0.11, 0, 1)
            const be = bp < 1 ? 1 - Math.pow(1 - bp, 4) : 1
            ref.position.y = THREE.MathUtils.lerp(0.65, 0.04, be)
          }
          bIdx++
        })
      })
    })

    /* ── PHASE 3: PANELS drop from Y = 8  (0.65 → 0.96) staggered ── */
    SETS.forEach((set, si) => {
      PANEL_ZS.forEach((pz, pi) => {
        const ref = panelRefs.current[si * 2 + pi]
        if (!ref) return
        const start = 0.65 + si * 0.07 + pi * 0.04
        const pp = THREE.MathUtils.clamp((p - start) / 0.13, 0, 1)
        const pe = pp < 1 ? 1 - Math.pow(1 - pp, 4) : 1
        ref.position.y = THREE.MathUtils.lerp(8, PANEL_Y, pe)
      })
    })
  })

  return (
    <>
      {/* Lighting to match golden-hour factory image */}
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[10, 16, 8]}
        intensity={2.4}
        color="#FBB034"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={10}
        shadow-camera-bottom={-6}
        shadow-camera-far={60}
      />
      <directionalLight position={[-6, 8, -4]} intensity={0.7} color="#6688BB" />
      <pointLight position={[4, 5, 5]} intensity={0.9} color="#E05540" />
      {/* Blue emissive fill on panels */}
      <pointLight position={[3, 2, 0]} intensity={0.5} color="#2244CC" />

      {/* Transparent shadow catcher — sits at roof level */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[3, 0.001, 0]} receiveShadow>
        <planeGeometry args={[14, 12]} />
        <shadowMaterial opacity={0.22} />
      </mesh>

      {/* ── RAILS ── */}
      {SETS.map((set, si) =>
        [set.xA, set.xB].map((targetX, ri) => (
          <group
            key={`rail-${si}-${ri}`}
            ref={el => { railRefs.current[si * 2 + ri] = el }}
            position={[-20, 0.06, 0]}  /* start far left */
          >
            <Rail />
          </group>
        ))
      )}

      {/* ── BOLTS ── */}
      {(() => {
        const elements = []
        let idx = 0
        SETS.forEach((set, si) => {
          ;[set.xA, set.xB].forEach((railX, ri) => {
            BOLT_Z.forEach((bz, bi) => {
              const capturedIdx = idx
              elements.push(
                <group
                  key={`bolt-${si}-${ri}-${bi}`}
                  ref={el => { boltRefs.current[capturedIdx] = el }}
                  position={[railX, 0.65, bz]}
                >
                  <Bolt />
                </group>
              )
              idx++
            })
          })
        })
        return elements
      })()}

      {/* ── PANELS ── */}
      {SETS.map((set, si) =>
        PANEL_ZS.map((pz, pi) => {
          const midX = (set.xA + set.xB) / 2
          return (
            <group
              key={`panel-${si}-${pi}`}
              ref={el => { panelRefs.current[si * 2 + pi] = el }}
              position={[midX, 8, pz]}
              rotation={[PANEL_TILT, 0, 0]}
            >
              <SolarPanel />
            </group>
          )
        })
      )}

      <Environment preset="sunset" background={false} />
    </>
  )
}

/* ── HERO SECTION ── */
const Hero = () => {
  const sectionRef  = useRef(null)
  const scrollRef   = useRef(0)
  const phaseRef    = useRef(null)
  const barRef      = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=3200',
        pin: true,
        scrub: 0.85,
        anticipatePin: 1,
        onUpdate: self => {
          scrollRef.current = self.progress
          if (barRef.current) barRef.current.style.width = `${self.progress * 100}%`
          if (phaseRef.current) {
            phaseRef.current.textContent =
              self.progress < 0.04 ? 'READY' :
              self.progress < 0.35 ? 'SLIDING RAILS INTO POSITION' :
              self.progress < 0.62 ? 'BOLTING STRUCTURE' :
              self.progress < 0.95 ? 'MOUNTING SOLAR PANELS' :
              'INSTALLATION COMPLETE ✓'
          }
        },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{ position: 'relative', height: '100vh', width: '100%', overflow: 'hidden' }}
    >
      {/* ── FACTORY IMAGE — full bleed background ── */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(/factory.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center 25%',
      }} />

      {/* Subtle dark overlay — just enough to pop the 3D */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(4,6,14,0.38) 0%, rgba(4,6,14,0.18) 55%, rgba(4,6,14,0.55) 100%)',
      }} />

      {/* ── THREE.JS CANVAS — full screen, transparent ──
          Camera calibrated to match factory image perspective:
          • Elevated upper-right viewpoint ≈ 36° elevation, 38° from front
          • FOV 42°  →  target = front-right visible roof area
      */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <Canvas
          shadows
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          {/*
            Camera position (11.5, 9.8, 11.2) → lookAt (3, 0, -0.5)
            Places world Y=0 (roof surface) over the visible roof area in the image.
            Adjust lookAt X/Z if elements drift — positive X shifts right, negative Z shifts back.
          */}
          <PerspectiveCamera
            makeDefault
            position={[11.5, 9.8, 11.2]}
            fov={42}
            near={0.05}
            far={160}
          />
          <Suspense fallback={null}>
            <AssemblyScene scrollRef={scrollRef} />
          </Suspense>
        </Canvas>
      </div>

      {/* ── BOTTOM PROGRESS BAR ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 3, background: 'rgba(255,255,255,0.06)', zIndex: 20,
      }}>
        <div ref={barRef} style={{
          height: '100%', width: '0%',
          background: 'linear-gradient(90deg, #E05540, #E8923A)',
          transition: 'width 0.08s linear',
        }} />
      </div>

      {/* ── PHASE INDICATOR — bottom left ── */}
      <div style={{
        position: 'absolute', bottom: '1.6rem', left: '2rem', zIndex: 20,
        display: 'flex', alignItems: 'center', gap: '0.7rem',
        padding: '0.5rem 1rem',
        background: 'rgba(4,6,14,0.72)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(201,212,224,0.10)',
      }}>
        <div style={{
          width: 7, height: 7, borderRadius: '50%',
          background: '#E05540', boxShadow: '0 0 10px #E05540',
          animation: 'blink 1.6s ease-in-out infinite',
        }} />
        <span style={{ fontFamily:'JetBrains Mono', fontSize:'0.66rem', letterSpacing:'0.18em', color:'var(--text-muted)' }}>STATUS</span>
        <span ref={phaseRef} style={{ fontFamily:'JetBrains Mono', fontSize:'0.66rem', letterSpacing:'0.12em', color:'#E8923A', fontWeight:600 }}>READY</span>
      </div>

      {/* ── SCROLL CUE — bottom right ── */}
      <div style={{
        position: 'absolute', bottom: '1.6rem', right: '2rem', zIndex: 20,
        display: 'flex', alignItems: 'center', gap: '0.6rem',
        fontFamily: 'JetBrains Mono', fontSize: '0.63rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.45)',
      }}>
        SCROLL TO ASSEMBLE
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
          <div style={{ width:1, height:18, background:'linear-gradient(180deg,rgba(224,85,64,0.8),transparent)', animation:'scrollBar 1.8s ease-in-out infinite' }} />
          <div style={{ width:4, height:4, borderRadius:'50%', background:'rgba(224,85,64,0.6)' }} />
        </div>
      </div>

      {/* ── BOTTOM CTA BUTTONS ── */}
      <div style={{
        position: 'absolute', bottom: '4.2rem', left: '50%', transform: 'translateX(-50%)',
        zIndex: 20, display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center',
      }}>
        <a href="#products" className="btn-primary" style={{ fontSize:'0.83rem', padding:'0.82rem 1.6rem', boxShadow:'0 4px 24px rgba(224,85,64,0.35)' }}>
          EXPLORE PRODUCTS <ArrowRightIcon />
        </a>
        <a
          href="https://www.sunmount.in/wp-content/uploads/2024/09/Catalogue-2024-rev-2.pdf"
          target="_blank" rel="noopener noreferrer"
          className="btn-secondary"
          style={{ fontSize:'0.83rem', padding:'0.82rem 1.6rem', background:'rgba(4,6,14,0.65)', backdropFilter:'blur(10px)' }}
        >
          <DownloadIcon /> CATALOGUE
        </a>
      </div>

      <style>{`
        @keyframes blink   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.35;transform:scale(1.5)} }
        @keyframes scrollBar { 0%,100%{opacity:0.8;transform:scaleY(1)} 50%{opacity:0.3;transform:scaleY(0.3)} }
      `}</style>
    </section>
  )
}

export default Hero
