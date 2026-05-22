import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'

gsap.registerPlugin(ScrollTrigger)

const RAIL_ROWS = 5
const PANEL_COLS = 6

export default function HeroSection() {
  const sectionRef = useRef()
  const roofRef = useRef()
  const headlineRef = useRef()
  const glowRef = useRef()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.rail-left', { x: '-110%', opacity: 0 })
      gsap.set('.rail-right', { x: '110%', opacity: 0 })
      gsap.set('[data-panel]', { y: -100, opacity: 0 })
      gsap.set(glowRef.current, { opacity: 0 })
      gsap.set(roofRef.current, { opacity: 0 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=280%',
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
        }
      })

      tl.to(headlineRef.current, { y: -50, opacity: 0, duration: 0.3 }, 0)
      tl.to(roofRef.current, { opacity: 1, duration: 0.4 }, 0.1)
      tl.to('.rail-left', { x: '0%', opacity: 1, stagger: 0.1, duration: 0.7, ease: 'power3.out' }, 0.3)
      tl.to('.rail-right', { x: '0%', opacity: 1, stagger: 0.1, duration: 0.7, ease: 'power3.out' }, 0.35)
      tl.to('[data-panel]', {
        y: 0, opacity: 1, duration: 0.5,
        stagger: { amount: 0.6, from: 'start' },
        ease: 'power3.out'
      }, 0.9)
      tl.to(glowRef.current, { opacity: 1, duration: 0.15 }, 1.6)
      tl.to(glowRef.current, { opacity: 0, duration: 0.4 }, 1.75)
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} style={{
      position: 'relative', height: '100vh', overflow: 'hidden',
      background: 'radial-gradient(ellipse at 50% 20%, #131A2E 0%, #07080C 65%)',
    }}>
      {/* Grid bg */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(200,213,220,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(200,213,220,0.04) 1px,transparent 1px)',
        backgroundSize: '60px 60px',
      }} />
      <div style={{
        position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 400,
        background: 'radial-gradient(ellipse, rgba(249,115,22,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* HEADLINE */}
      <div ref={headlineRef} style={{
        position: 'absolute', inset: 0, zIndex: 10,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '2rem', paddingTop: 72,
      }}>
        <div className="section-label" style={{ justifyContent: 'center', marginBottom: '1.5rem' }}>
          ISO · TUV · MSME Certified
        </div>
        <h1 style={{ fontSize: 'clamp(3rem, 7vw, 6.5rem)', fontWeight: 900, letterSpacing: '-0.02em', maxWidth: 900, marginBottom: '1.5rem' }}>
          Mounting the<br />
          <span style={{ background: 'linear-gradient(135deg,#F97316,#FBB034)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Solar Future
          </span>
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-2)', maxWidth: 520, marginBottom: '2.5rem', lineHeight: 1.7 }}>
          India's premier manufacturer of aluminum & steel solar mounting structures.
          Engineering precision. Supplying worldwide.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/products" className="btn-primary">Explore Products</Link>
          <a href="https://www.sunmount.in/wp-content/uploads/2024/09/Catalogue-2024-rev-2.pdf" target="_blank" rel="noopener noreferrer" className="btn-ghost">Download Catalogue</a>
        </div>
        <div style={{ position: 'absolute', bottom: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--text-3)', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          <div>Scroll to see assembly</div>
          <div style={{ width: 24, height: 40, border: '2px solid rgba(249,115,22,0.3)', borderRadius: 12, display: 'flex', justifyContent: 'center', paddingTop: 6 }}>
            <div style={{ width: 4, height: 8, background: 'var(--solar)', borderRadius: 2, animation: 'scrollBob 1.8s ease-in-out infinite' }} />
          </div>
        </div>
      </div>

      {/* ASSEMBLY */}
      <div ref={roofRef} style={{ position: 'absolute', inset: 0, zIndex: 5, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px 4% 4%' }}>
        <div style={{
          width: '100%', height: '65vh',
          background: 'linear-gradient(180deg,#0F1118,#131820)',
          border: '1px solid rgba(200,213,220,0.08)',
          borderRadius: 4, position: 'relative', overflow: 'hidden',
        }}>
          {/* Roof lines */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} style={{ position: 'absolute', top: 0, bottom: 0, left: `${(i / 20) * 100}%`, width: 1, background: 'rgba(200,213,220,0.04)' }} />
          ))}

          {/* Rails */}
          {Array.from({ length: RAIL_ROWS }).map((_, i) => (
            <div key={i}
              className={i % 2 === 0 ? 'rail-left' : 'rail-right'}
              style={{
                position: 'absolute', left: 0, right: 0,
                top: `${(i / (RAIL_ROWS - 1)) * 96 + 2}%`,
                height: 10, marginTop: -5,
                background: 'linear-gradient(180deg,#E0EAF0 0%,#8FA3B1 40%,#BDD0DA 60%,#6A8090 100%)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.7),inset 0 1px 0 rgba(255,255,255,0.4)',
                borderRadius: 2, zIndex: 2,
              }}
            />
          ))}

          {/* Panels */}
          {Array.from({ length: RAIL_ROWS - 1 }).map((_, row) =>
            Array.from({ length: PANEL_COLS }).map((_, col) => (
              <div key={`${row}-${col}`} data-panel style={{
                position: 'absolute',
                top: `${(row / (RAIL_ROWS - 1)) * 96 + 2 + 1.5}%`,
                left: `${(col / PANEL_COLS) * 100 + 0.5}%`,
                width: `${(1 / PANEL_COLS) * 100 - 1}%`,
                height: `${(1 / (RAIL_ROWS - 1)) * 96 - 3}%`,
                background: 'linear-gradient(135deg,#0B1628,#0F1E38,#091424)',
                border: '1px solid #1A3A5C',
                borderRadius: 2, overflow: 'hidden', zIndex: 1,
                display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gridTemplateRows: 'repeat(3,1fr)',
                gap: 1, padding: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
              }}>
                {Array.from({ length: 9 }).map((_, k) => (
                  <div key={k} style={{ background: '#0A1828', borderRadius: 1, border: '0.5px solid rgba(30,60,100,0.5)' }} />
                ))}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(255,255,255,0.06),transparent 60%)', pointerEvents: 'none' }} />
              </div>
            ))
          )}

          <div style={{ position: 'absolute', bottom: 10, right: 14, fontSize: '0.62rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase', fontFamily: 'Montserrat' }}>
            Commercial Rooftop · SunMount® Mounting System
          </div>
        </div>

        <div ref={glowRef} style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center,rgba(249,115,22,0.2),transparent 70%)', pointerEvents: 'none' }} />
      </div>

      <style>{`@keyframes scrollBob{0%,100%{transform:translateY(0);opacity:1}60%{transform:translateY(14px);opacity:0.3}}`}</style>
    </section>
  )
}
