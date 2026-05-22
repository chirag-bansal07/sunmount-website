import { useRef, useLayoutEffect, Suspense } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Environment, ContactShadows, PerspectiveCamera } from '@react-three/drei'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'
import { MonoRail, LFoot, SolarPanel } from '../three/RailModels'
import { ArrowRightIcon, DownloadIcon } from '../components/icons'

gsap.registerPlugin(ScrollTrigger)

// Assembly scene — controls all 3D parts via refs
function AssemblyScene({ progressRef }) {
  const leftRail1 = useRef()
  const leftRail2 = useRef()
  const rightRail1 = useRef()
  const rightRail2 = useRef()
  const lFeet = useRef([])
  const panels = useRef([])

  useLayoutEffect(() => {
    // Initial positions — rails offscreen left/right, panels above
    if (leftRail1.current) leftRail1.current.position.x = -8
    if (leftRail2.current) leftRail2.current.position.x = -8
    if (rightRail1.current) rightRail1.current.position.x = 8
    if (rightRail2.current) rightRail2.current.position.x = 8
    lFeet.current.forEach((f) => { if (f) { f.position.y = -3; f.material && (f.material.opacity = 0) } })
    panels.current.forEach((p) => { if (p) p.position.y = 8 })
  }, [])

  useLayoutEffect(() => {
    const tick = () => {
      const p = progressRef.current
      // Phase 0–0.15: L-feet rise from rooftop
      const footProgress = THREE.MathUtils.clamp(p / 0.15, 0, 1)
      lFeet.current.forEach((foot, i) => {
        if (foot) {
          foot.position.y = THREE.MathUtils.lerp(-3, 0, footProgress)
        }
      })

      // Phase 0.15–0.45: Rails slide in from edges
      const railProgress = THREE.MathUtils.clamp((p - 0.15) / 0.30, 0, 1)
      const eased = 1 - Math.pow(1 - railProgress, 3) // easeOutCubic
      if (leftRail1.current) leftRail1.current.position.x = THREE.MathUtils.lerp(-8, 0, eased)
      if (leftRail2.current) leftRail2.current.position.x = THREE.MathUtils.lerp(-8, 0, eased)
      if (rightRail1.current) rightRail1.current.position.x = THREE.MathUtils.lerp(8, 0, eased)
      if (rightRail2.current) rightRail2.current.position.x = THREE.MathUtils.lerp(8, 0, eased)

      // Phase 0.5–0.95: Panels drop in sequence
      const panelStart = 0.5
      const panelStagger = 0.1
      panels.current.forEach((panel, i) => {
        if (!panel) return
        const start = panelStart + i * panelStagger
        const panelP = THREE.MathUtils.clamp((p - start) / 0.15, 0, 1)
        const bounceP = panelP < 1 ? 1 - Math.pow(1 - panelP, 4) : 1 // easeOutQuart
        panel.position.y = THREE.MathUtils.lerp(8, 1.05, bounceP)
        panel.rotation.z = THREE.MathUtils.lerp(0.3, 0, bounceP)
      })

      frameId = requestAnimationFrame(tick)
    }
    let frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [progressRef])

  // 4 L-feet positions (rooftop mount points)
  const footPositions = [
    [-2.5, 0, -1.5], [2.5, 0, -1.5],
    [-2.5, 0, 1.5], [2.5, 0, 1.5],
  ]

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 8, 5]} intensity={1.8} color="#FBB034" castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-5, 4, -5]} intensity={0.6} color="#5882c4" />
      <pointLight position={[0, 6, 3]} intensity={0.8} color="#FF6B1A" />

      {/* Rooftop plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[30, 20]} />
        <meshStandardMaterial color="#1a1f2e" metalness={0.3} roughness={0.85} />
      </mesh>

      {/* Rooftop trapezoidal ridges (decorative) */}
      {[-6, -3, 3, 6].map((z, i) => (
        <mesh key={i} position={[0, 0.02, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[30, 0.15]} />
          <meshStandardMaterial color="#2A3247" metalness={0.5} roughness={0.7} />
        </mesh>
      ))}

      {/* L-feet (4 of them) */}
      {footPositions.map((pos, i) => (
        <group key={i} ref={el => (lFeet.current[i] = el)} position={pos}>
          <LFoot />
        </group>
      ))}

      {/* Two parallel rails (front + back) — each slides in from a side */}
      <group ref={leftRail1} position={[0, 0.45, -1.5]} rotation={[0, Math.PI / 2, 0]}>
        <MonoRail length={6} />
      </group>
      <group ref={rightRail1} position={[0, 0.45, 1.5]} rotation={[0, Math.PI / 2, 0]}>
        <MonoRail length={6} />
      </group>

      {/* 3 Solar panels mounted on the rails */}
      {[-2, 0, 2].map((x, i) => (
        <group key={i} ref={el => (panels.current[i] = el)} position={[x, 8, 0]} rotation={[Math.PI / 2 - 0.15, 0, 0]}>
          <SolarPanel width={1.8} height={2.8} />
        </group>
      ))}

      <ContactShadows position={[0, 0.01, 0]} opacity={0.5} scale={20} blur={2.5} far={5} />
    </>
  )
}

const Hero = () => {
  const sectionRef = useRef(null)
  const progressRef = useRef(0)
  const phaseTextRef = useRef(null)
  const titleRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Pinned timeline that drives the assembly via progressRef
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=2400',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          onUpdate: (self) => {
            progressRef.current = self.progress
            // Update phase text
            const phase = self.progress < 0.15 ? 'INITIALIZING' :
                         self.progress < 0.45 ? 'ASSEMBLING STRUCTURE' :
                         self.progress < 0.95 ? 'MOUNTING PANELS' : 'SYSTEM ONLINE'
            if (phaseTextRef.current) phaseTextRef.current.textContent = phase
          },
        },
      })

      // Fade in hero title on first scroll
      gsap.from(titleRef.current?.children || [], {
        y: 60,
        opacity: 0,
        stagger: 0.15,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.3,
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
      background: 'radial-gradient(ellipse at 50% 100%, #1a2a4a 0%, #060912 70%)',
    }}>
      {/* Grid overlay — industrial feel */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(143,160,187,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(143,160,187,0.04) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
      }} />

      {/* Sun glow */}
      <div style={{
        position: 'absolute',
        top: '15%', right: '5%',
        width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(251,176,52,0.18) 0%, transparent 60%)',
        filter: 'blur(40px)',
        pointerEvents: 'none',
      }} />

      {/* 3D Canvas — covers right portion */}
      <div style={{
        position: 'absolute',
        top: 0, right: 0,
        width: '100%', height: '100%',
      }}>
        <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
          <PerspectiveCamera makeDefault position={[5, 4, 6]} fov={42} />
          <Suspense fallback={null}>
            <AssemblyScene progressRef={progressRef} />
            <Environment preset="sunset" background={false} />
          </Suspense>
        </Canvas>
      </div>

      {/* Hero copy overlay */}
      <div className="container" style={{
        position: 'relative',
        zIndex: 2,
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        pointerEvents: 'none',
      }}>
        <div ref={titleRef} style={{ maxWidth: 560, pointerEvents: 'auto' }}>
          <div className="section-label">QUALITY · STABILITY · INFINITY</div>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5.5vw, 4.8rem)',
            fontWeight: 900,
            marginBottom: '1.5rem',
          }}>
            Engineered<br />
            for the <span className="gradient-text">Sun.</span><br />
            Built to<br />
            <span style={{ color: 'var(--aluminum-light)' }}>Endure.</span>
          </h1>
          <p style={{
            fontSize: '1.05rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            marginBottom: '2.5rem',
            maxWidth: 460,
          }}>
            India's indigenous solar PV mounting manufacturer. Aluminum & steel
            structures engineered for 200 km/h wind speeds, certified by TÜV,
            supplied across the globe.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
            <a href="#products" className="btn-primary">
              Explore Products <ArrowRightIcon />
            </a>
            <a href="https://www.sunmount.in/wp-content/uploads/2024/09/Catalogue-2024-rev-2.pdf"
               target="_blank" rel="noopener noreferrer" className="btn-secondary">
              <DownloadIcon /> Download Catalogue
            </a>
          </div>

          {/* Phase indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.6rem 1rem',
            background: 'rgba(6, 9, 18, 0.6)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 2,
            backdropFilter: 'blur(12px)',
            width: 'fit-content',
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: 'var(--sun-orange)',
              boxShadow: '0 0 12px var(--sun-orange)',
              animation: 'pulse 2s infinite',
            }} />
            <span style={{
              fontFamily: 'JetBrains Mono',
              fontSize: '0.7rem',
              letterSpacing: '0.2em',
              color: 'var(--aluminum-mid)',
            }}>STATUS:</span>
            <span ref={phaseTextRef} style={{
              fontFamily: 'JetBrains Mono',
              fontSize: '0.7rem',
              letterSpacing: '0.2em',
              color: 'var(--sun-orange)',
              fontWeight: 500,
            }}>INITIALIZING</span>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div style={{
        position: 'absolute',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        color: 'var(--aluminum-mid)',
        fontFamily: 'JetBrains Mono',
        fontSize: '0.7rem',
        letterSpacing: '0.2em',
      }}>
        <span>SCROLL TO ASSEMBLE</span>
        <div style={{
          width: 1, height: 40,
          background: 'linear-gradient(180deg, var(--sun-orange), transparent)',
          animation: 'scrollLine 2s ease-in-out infinite',
        }} />
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.3); }
        }
        @keyframes scrollLine {
          0%, 100% { transform: scaleY(1); transform-origin: top; }
          50% { transform: scaleY(0.3); transform-origin: top; }
        }
      `}</style>
    </section>
  )
}

export default Hero
