import { useRef, useEffect, Suspense, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, Environment, Clouds, Cloud } from '@react-three/drei'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'
import { DownloadIcon, ArrowRightIcon } from '../components/icons'

gsap.registerPlugin(ScrollTrigger)

/* ══════════════════════════════════════
   CONSTANTS
══════════════════════════════════════ */
const BW = 14       // Building width (X)
const BL = 22       // Building length (Z)
const BH = 4.2      // Building height (Y)
const ROOF_Y = BH
const RAIL_Y  = ROOF_Y + 0.08   // Rails sit on roof surface

// Rails run along Z, covering this span
const RAIL_Z0 = -8.5
const RAIL_Z1 =  8.5
const RAIL_LEN = RAIL_Z1 - RAIL_Z0   // 17 units — full building width
const RAIL_MID_Z = 0                  // centre of rail

// 3 sets × 2 rails → 6 rails total.  Each set [leftRailX, rightRailX]
// Panel zone: right side of ridge vent (x > 0), front half (z > 0)
const SETS = [
  { rails: [1.0, 2.8] },
  { rails: [3.4, 5.2] },
  { rails: [5.8, 7.6] },
]

// 2 panels per set: near (front) and far (back)
const PANEL_ZS  = [5.5, 2.5]
const PANEL_TILT = Math.PI * 0.088   // ~16° tilt, face toward viewer (+Z)

// Build flat arrays for easy iteration
const ALL_RAILS = SETS.flatMap((set, si) =>
  set.rails.map((finalX, ri) => ({ si, ri, finalX, idx: si * 2 + ri }))
)
const ALL_PANELS = SETS.flatMap((set, si) =>
  PANEL_ZS.map((pz, pi) => ({
    si, pi,
    finalX: (set.rails[0] + set.rails[1]) / 2,
    finalZ: pz,
    idx: si * 2 + pi,
  }))
)

/* ══════════════════════════════════════
   FACTORY BUILDING
   Matches the SunMount factory image:
   - flat corrugated silver/grey roof
   - dark charcoal walls (#252525)
   - white frame strips
   - orange perimeter border
   - central ridge vent
   - loading dock on front-right face
══════════════════════════════════════ */
function Factory() {
  const ribCount = 30
  const ribs = useMemo(
    () => Array.from({ length: ribCount }, (_, i) => -BL / 2 + (BL / ribCount) * (i + 0.5)),
    []
  )

  return (
    <group>
      {/* Ground / forecourt */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#2C2C2C" roughness={0.96} />
      </mesh>

      {/* Paving grid texture effect */}
      {Array.from({ length: 12 }).map((_, r) =>
        Array.from({ length: 18 }).map((_, c) => (
          <mesh key={`pv-${r}-${c}`} rotation={[-Math.PI / 2, 0, 0]}
            position={[-17 + c * 2, 0, -11 + r * 2]}>
            <planeGeometry args={[1.92, 1.92]} />
            <meshStandardMaterial color={((r + c) % 2 === 0) ? '#303030' : '#282828'} roughness={0.97} />
          </mesh>
        ))
      )}

      {/* Orange perimeter border */}
      {[
        [0,             BL / 2 + 1.5, BW + 5, 3],
        [0,            -BL / 2 - 1.5, BW + 5, 3],
        [-BW / 2 - 1.5, 0,            3, BL + 3],
        [ BW / 2 + 1.5, 0,            3, BL + 3],
      ].map(([x, z, w, d], i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.01, z]}>
          <planeGeometry args={[w, d]} />
          <meshStandardMaterial color="#E07830" roughness={0.8} />
        </mesh>
      ))}

      {/* Main wall box */}
      <mesh position={[0, BH / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[BW, BH, BL]} />
        <meshStandardMaterial color="#252525" roughness={0.85} metalness={0.08} />
      </mesh>

      {/* White frame on all four top edges */}
      {[
        [0,           BH,  BL / 2,  BW + 0.4, 0.22, 0.22],
        [0,           BH, -BL / 2,  BW + 0.4, 0.22, 0.22],
        [-BW / 2,     BH,  0,       0.22,      0.22, BL + 0.4],
        [ BW / 2,     BH,  0,       0.22,      0.22, BL + 0.4],
      ].map(([x, y, z, w, h, d], i) => (
        <mesh key={i} position={[x, y, z]}>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial color="#DCDCDC" roughness={0.5} metalness={0.2} />
        </mesh>
      ))}

      {/* Window strips on left long wall (x = -BW/2) */}
      {[-8, -4, 0, 4, 8].map((z, i) => (
        <mesh key={i} position={[-BW / 2 - 0.01, BH * 0.55, z]} castShadow>
          <boxGeometry args={[0.08, 1.1, 2.4]} />
          <meshStandardMaterial color="#D0D0D0" roughness={0.5} />
        </mesh>
      ))}

      {/* Front face dark cladding (SUNMOUNT logo side, z = +BL/2) */}
      <mesh position={[0, BH * 0.35, BL / 2 + 0.01]}>
        <planeGeometry args={[BW, BH * 0.7]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.9} />
      </mesh>

      {/* Window strips on front face */}
      {[-4, -1.5, 1.5, 4].map((x, i) => (
        <mesh key={i} position={[x, BH * 0.55, BL / 2 + 0.01]} castShadow>
          <boxGeometry args={[2.2, 0.9, 0.08]} />
          <meshStandardMaterial color="#C8C8C8" roughness={0.5} />
        </mesh>
      ))}

      {/* Loading dock canopy (front face, right side) */}
      <mesh position={[4.5, BH * 0.65, BL / 2 + 0.8]} castShadow>
        <boxGeometry args={[3.5, 0.12, 1.6]} />
        <meshStandardMaterial color="#D8D8D8" roughness={0.5} metalness={0.2} />
      </mesh>
      <mesh position={[4.5, BH * 0.32, BL / 2 + 0.5]}>
        <boxGeometry args={[3.5, BH * 0.64, 0.08]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.9} />
      </mesh>

      {/* ── FLAT ROOF ── */}
      <mesh position={[0, ROOF_Y, 0]} receiveShadow>
        <boxGeometry args={[BW + 0.5, 0.1, BL + 0.5]} />
        <meshStandardMaterial color="#CACECE" metalness={0.55} roughness={0.35} />
      </mesh>

      {/* Corrugation ribs across full roof */}
      {ribs.map((z, i) => (
        <mesh key={i} position={[0, ROOF_Y + 0.065, z]}>
          <boxGeometry args={[BW + 0.5, 0.04, 0.11]} />
          <meshStandardMaterial color="#D8DCDC" metalness={0.7} roughness={0.18} />
        </mesh>
      ))}

      {/* Ridge vent / skylight (runs along Z centre line) */}
      <mesh position={[0, ROOF_Y + 0.35, 0]} castShadow>
        <boxGeometry args={[2.2, 0.6, BL - 2]} />
        <meshStandardMaterial color="#E4E4E4" roughness={0.5} metalness={0.3} />
      </mesh>
      {/* Vent curved top cap */}
      <mesh position={[0, ROOF_Y + 0.65, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.6, 0.6, BL - 2, 20, 1, false, -Math.PI / 2, Math.PI]} />
        <meshStandardMaterial color="#ECECEC" roughness={0.45} metalness={0.25} />
      </mesh>

      {/* Vent top strips (reinforcement) */}
      {[-6, -3, 0, 3, 6].map((z, i) => (
        <mesh key={i} position={[0, ROOF_Y + 1.22, z]}>
          <boxGeometry args={[2.2, 0.06, 0.1]} />
          <meshStandardMaterial color="#C8C8C8" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}

      {/* Roof rooflights (small dark panels on right side) */}
      {[3, 6, 9].map((z, i) => (
        <mesh key={i} position={[4, ROOF_Y + 0.07, -z]}>
          <boxGeometry args={[1.4, 0.05, 0.8]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
        </mesh>
      ))}

      {/* Light poles */}
      {[
        [-BW / 2 - 1.2, -9], [-BW / 2 - 1.2, -3],
        [-BW / 2 - 1.2,  3], [-BW / 2 - 1.2,  9],
        [ BW / 2 + 1.2, -9], [ BW / 2 + 1.2,  9],
        [-3, BL / 2 + 2], [0, BL / 2 + 2], [3, BL / 2 + 2],
      ].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 2.6, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.09, 5.2, 8]} />
            <meshStandardMaterial color="#111" metalness={0.9} roughness={0.3} />
          </mesh>
          <mesh position={[0, 5.3, 0]}>
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshStandardMaterial color="#111" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/* ══════════════════════════════════════
   ALUMINUM T-SLOT RAIL
   Runs along Z axis. Length = RAIL_LEN.
══════════════════════════════════════ */
function AlumRail() {
  const shape = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(-0.07, 0);   s.lineTo(-0.07, 0.06)
    s.lineTo(-0.025, 0.06); s.lineTo(-0.025, 0.22)
    s.lineTo(-0.05, 0.22);  s.lineTo(-0.05, 0.28)
    s.lineTo(0.05, 0.28);   s.lineTo(0.05, 0.22)
    s.lineTo(0.025, 0.22);  s.lineTo(0.025, 0.06)
    s.lineTo(0.07, 0.06);   s.lineTo(0.07, 0)
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
      <meshStandardMaterial
        color="#C9D4E0" metalness={0.97} roughness={0.10} envMapIntensity={2.5}
      />
    </mesh>
  )
}

/* ══════════════════════════════════════
   SMALL HEX BOLT
   Local Y=0 is the rail surface.
   Drops from Y=0.65 → 0.07 in Phase 2.
══════════════════════════════════════ */
function SmallBolt() {
  return (
    <group>
      {/* Hex head */}
      <mesh position={[0, 0.042, 0]}>
        <cylinderGeometry args={[0.024, 0.024, 0.022, 6]} />
        <meshStandardMaterial color="#777" metalness={1} roughness={0.12} />
      </mesh>
      {/* Shank */}
      <mesh position={[0, 0.012, 0]}>
        <cylinderGeometry args={[0.011, 0.011, 0.06, 8]} />
        <meshStandardMaterial color="#999" metalness={1} roughness={0.15} />
      </mesh>
    </group>
  )
}

/* ══════════════════════════════════════
   PREMIUM SOLAR PANEL
   60-cell, emissive deep-blue PV surface,
   bright anti-reflective sheen, silver frame
══════════════════════════════════════ */
function SolarPanel() {
  const PW = 1.68, PH = 2.72, PD = 0.038
  const COLS = 6, ROWS = 10
  const cw = (PW - 0.09) / COLS
  const ch = (PH - 0.09) / ROWS

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
      {/* Aluminium frame */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[PW, PD, PH]} />
        <meshStandardMaterial color="#DEE6F0" metalness={0.93} roughness={0.16} />
      </mesh>
      {/* PV laminate — deep navy with emissive glow */}
      <mesh position={[0, PD / 2 + 0.003, 0]}>
        <boxGeometry args={[PW - 0.07, 0.007, PH - 0.07]} />
        <meshStandardMaterial
          color="#08195A" metalness={0.55} roughness={0.07}
          emissive="#0C2E99" emissiveIntensity={0.55}
        />
      </mesh>
      {/* Individual cells */}
      {cells.map((c, i) => (
        <mesh key={i} position={[c.x, PD / 2 + 0.007, c.z]}>
          <boxGeometry args={[cw * 0.89, 0.005, ch * 0.89]} />
          <meshStandardMaterial
            color="#1638BB" metalness={0.72} roughness={0.04}
            emissive="#1638BB" emissiveIntensity={0.42}
          />
        </mesh>
      ))}
      {/* Anti-reflective sheen */}
      <mesh position={[0, PD / 2 + 0.009, 0]}>
        <boxGeometry args={[PW - 0.08, 0.002, PH - 0.08]} />
        <meshStandardMaterial color="#5599FF" metalness={0.2} roughness={0.02}
          transparent opacity={0.07} />
      </mesh>
    </group>
  )
}

/* ══════════════════════════════════════
   MAIN ASSEMBLY SCENE  (scroll-driven)
══════════════════════════════════════ */
function AssemblyScene({ scrollRef }) {
  // Rail group refs — each group holds the rail + its 2 bolts in local space
  const railGroupRefs  = useRef([])
  // Bolt refs inside each rail group [railIdx][boltIdx]
  const boltLocalRefs  = useRef(ALL_RAILS.map(() => [null, null]))
  // Panel refs
  const panelRefs      = useRef([])

  useFrame(() => {
    const p = scrollRef.current

    /* ── Phase 1: RAILS slide from x = -22 → finalX (scroll 0 → 0.35) ── */
    const rP = THREE.MathUtils.clamp(p / 0.35, 0, 1)
    const rE = 1 - Math.pow(1 - rP, 3)  // easeOutCubic

    ALL_RAILS.forEach(rail => {
      const g = railGroupRefs.current[rail.idx]
      if (g) g.position.x = THREE.MathUtils.lerp(-22, rail.finalX, rE)
    })

    /* ── Phase 2: BOLTS drop in local Y (scroll 0.38 → 0.60) ── */
    ALL_RAILS.forEach(rail => {
      const bolts = boltLocalRefs.current[rail.idx]
      bolts.forEach((bRef, bi) => {
        if (!bRef) return
        const start = 0.38 + rail.si * 0.040 + bi * 0.022
        const bP = THREE.MathUtils.clamp((p - start) / 0.10, 0, 1)
        const bE = 1 - Math.pow(1 - bP, 4)  // easeOutQuart
        bRef.position.y = THREE.MathUtils.lerp(0.65, 0.07, bE)
      })
    })

    /* ── Phase 3: PANELS drop from above (scroll 0.64 → 0.97) ── */
    ALL_PANELS.forEach(panel => {
      const ref = panelRefs.current[panel.idx]
      if (!ref) return
      const start = 0.64 + panel.si * 0.07 + panel.pi * 0.038
      const pP = THREE.MathUtils.clamp((p - start) / 0.12, 0, 1)
      const pE = 1 - Math.pow(1 - pP, 4)
      ref.position.y = THREE.MathUtils.lerp(RAIL_Y + 20, RAIL_Y + 0.32, pE)
    })
  })

  return (
    <>
      {/* Lighting rig */}
      <ambientLight intensity={0.45} />
      <directionalLight
        position={[6, 22, 14]} intensity={2.8} color="#FDD06A" castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-20} shadow-camera-right={20}
        shadow-camera-top={16} shadow-camera-bottom={-6}
        shadow-camera-far={55}
      />
      <directionalLight position={[-12, 8, -10]} intensity={0.55} color="#6680A8" />
      <pointLight position={[4, 9, 12]} intensity={1.4} color="#E04A30" distance={35} />
      <hemisphereLight intensity={0.30} color="#D0D8FF" groundColor="#1a1a1a" />

      {/* Factory building */}
      <Factory />

      {/* 6 Rails — each group starts at x = -22, slides to finalX.
          Inside each group: the rail + 2 bolt anchors at local Z offsets. */}
      {ALL_RAILS.map(rail => (
        <group
          key={rail.idx}
          ref={el => { railGroupRefs.current[rail.idx] = el }}
          position={[-22, RAIL_Y, RAIL_MID_Z]}
        >
          <AlumRail />
          {/* 2 bolts: one per panel position, in local Z space */}
          {PANEL_ZS.map((worldZ, bi) => (
            <group
              key={bi}
              ref={el => { boltLocalRefs.current[rail.idx][bi] = el }}
              position={[0, 0.65, worldZ - RAIL_MID_Z]}
            >
              <SmallBolt />
            </group>
          ))}
        </group>
      ))}

      {/* 6 Panels — world-space groups, Y animated from high → RAIL_Y+0.32 */}
      {ALL_PANELS.map(panel => (
        <group
          key={panel.idx}
          ref={el => { panelRefs.current[panel.idx] = el }}
          position={[panel.finalX, RAIL_Y + 20, panel.finalZ]}
          rotation={[PANEL_TILT, 0, 0]}
        >
          <SolarPanel />
        </group>
      ))}

      <Environment preset="sunset" background={false} />
    </>
  )
}

/* ══════════════════════════════════════
   HERO  (pinned GSAP ScrollTrigger)
══════════════════════════════════════ */
const Hero = () => {
  const sectionRef = useRef(null)
  const scrollRef  = useRef(0)
  const phaseRef   = useRef(null)
  const progRef    = useRef(null)

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

          const phase =
            self.progress < 0.04 ? 'READY' :
            self.progress < 0.35 ? 'SLIDING RAILS INTO POSITION' :
            self.progress < 0.63 ? 'BOLTING STRUCTURE' :
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
    <section
      ref={sectionRef}
      style={{ position: 'relative', height: '100vh', overflow: 'hidden', background: '#1a1a1a' }}
    >
      {/* Full-viewport 3D canvas */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <Canvas
          shadows
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: false }}
          style={{ background: '#1a1a1a' }}
        >
          {/*
            Camera calibrated to match the SunMount factory render angle:
            - upper-right viewpoint (~35° elevation, ~40° azimuth)
            - building long axis (Z) going away from camera
            - left long wall visible on left, front face lower-right
          */}
          <PerspectiveCamera makeDefault position={[12, 11, 17]} fov={46} near={0.1} far={150} />
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
        <div ref={progRef} style={{
          height: '100%', width: '0%',
          background: 'linear-gradient(90deg, #E05540, #E8923A)',
          transition: 'width 0.07s linear',
        }} />
      </div>

      {/* ── STATUS INDICATOR ── */}
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
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.67rem', letterSpacing: '0.18em', color: 'var(--text-muted)' }}>
          STATUS
        </span>
        <span ref={phaseRef} style={{ fontFamily: 'JetBrains Mono', fontSize: '0.67rem', letterSpacing: '0.13em', color: '#E8923A', fontWeight: 600 }}>
          READY
        </span>
      </div>

      {/* ── SCROLL CUE ── */}
      <div style={{
        position: 'absolute', bottom: '1.8rem', right: '2rem', zIndex: 20,
        display: 'flex', alignItems: 'center', gap: '0.6rem',
        fontFamily: 'JetBrains Mono', fontSize: '0.65rem',
        letterSpacing: '0.2em', color: 'var(--aluminum-mid)',
      }}>
        SCROLL TO ASSEMBLE
        <div style={{ width: 1, height: 28, background: 'linear-gradient(180deg, var(--sun-orange), transparent)', animation: 'pulse 2s ease-in-out infinite' }} />
      </div>

      {/* ── CTAs ── */}
      <div style={{
        position: 'absolute', bottom: '3.8rem', left: 0, right: 0, zIndex: 20,
        display: 'flex', justifyContent: 'center', gap: '1rem', padding: '0 2rem',
      }}>
        <a href="#products" className="btn-primary" style={{ fontSize: '0.82rem', padding: '0.8rem 1.8rem' }}>
          Explore Products <ArrowRightIcon />
        </a>
        <a
          href="https://www.sunmount.in/wp-content/uploads/2024/09/Catalogue-2024-rev-2.pdf"
          target="_blank" rel="noopener noreferrer"
          className="btn-secondary"
          style={{ fontSize: '0.82rem', padding: '0.8rem 1.8rem', background: 'rgba(6,9,18,0.65)', backdropFilter: 'blur(8px)' }}
        >
          <DownloadIcon /> Catalogue
        </a>
      </div>

      <style>{`
        @keyframes blink  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.4)} }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>
    </section>
  )
}

export default Hero
