import { useState } from 'react'

const PILLARS = [
  {
    id: 'mission',
    label: 'MISSION',
    title: 'Power the Planet',
    text: 'To promote renewable energy by making solar installations easier and more accessible — reducing dependence on fossil fuels, one rooftop at a time.',
    angle: -60,
  },
  {
    id: 'vision',
    label: 'VISION',
    title: 'Engineer the Future',
    text: "To solve our clients' dynamic needs with innovative, scientifically verified engineering solutions — while staying competitive in pricing and delivery.",
    angle: 0,
  },
  {
    id: 'ambition',
    label: 'AMBITION',
    title: 'Excellence in Everything',
    text: 'Best-in-class raw materials, manufacturing, timelines, warranty and after-sales support — delivering an instant WOW experience on every project.',
    angle: 60,
  },
]

const WhySunmount = () => {
  const [active, setActive] = useState('vision')
  const activePillar = PILLARS.find(p => p.id === active)

  return (
    <section id="why" style={{
      padding:'8rem 0', position:'relative',
      background:'linear-gradient(180deg,var(--bg-base) 0%,var(--bg-deep) 100%)',
      overflow:'hidden',
    }}>
      <div style={{
        position:'absolute', inset:0,
        backgroundImage:'radial-gradient(rgba(143,160,187,0.06) 1px, transparent 1px)',
        backgroundSize:'32px 32px', pointerEvents:'none', opacity:0.4,
      }} />

      <div className="container" style={{ position:'relative', zIndex:1 }}>
        <div style={{ textAlign:'center', marginBottom:'5rem', maxWidth:720, margin:'0 auto 5rem' }}>
          <div className="section-label" style={{ display:'inline-flex' }}>WHY SUNMOUNT®</div>
          <h2 style={{ fontSize:'clamp(2.2rem,4.5vw,3.6rem)', marginBottom:'1.2rem' }}>
            Built on <span className="gradient-text">Principles</span>,<br />
            Driven by <span style={{ color:'var(--aluminum-light)' }}>Purpose.</span>
          </h2>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4rem', alignItems:'center' }} className="why-grid">

          {/* Interactive orbital wheel */}
          <div style={{ position:'relative', width:'100%', aspectRatio:'1', maxWidth:480, margin:'0 auto' }}>
            {/* Orbit rings */}
            {[180, 280, 380].map((size, i) => (
              <div key={i} style={{
                position:'absolute', top:'50%', left:'50%',
                transform:'translate(-50%,-50%)',
                width:size, height:size, borderRadius:'50%',
                border:'1px dashed var(--aluminum-edge)',
                opacity: 0.5 - i * 0.12,
              }} />
            ))}

            {/* CENTER — SunMount brand icon instead of plain text */}
            <div style={{
              position:'absolute', top:'50%', left:'50%',
              transform:'translate(-50%,-50%)',
              width:130, height:130, borderRadius:'50%',
              overflow:'hidden',
              boxShadow:'0 0 70px rgba(232,146,58,0.45), inset -8px -8px 24px rgba(0,0,0,0.25)',
              zIndex:2,
              border:'3px solid rgba(232,146,58,0.3)',
            }}>
              <img src="/sm-icon.png" alt="SunMount"
                style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
            </div>

            {/* Pillar nodes */}
            {PILLARS.map(pillar => {
              const isActive = pillar.id === active
              const rad = (pillar.angle * Math.PI) / 180
              const radius = 175
              const x = Math.cos(rad - Math.PI / 2) * radius
              const y = Math.sin(rad - Math.PI / 2) * radius

              return (
                <button
                  key={pillar.id}
                  onClick={() => setActive(pillar.id)}
                  onMouseEnter={() => setActive(pillar.id)}
                  style={{
                    position:'absolute',
                    top:`calc(50% + ${y}px)`, left:`calc(50% + ${x}px)`,
                    transform:'translate(-50%,-50%)',
                    width: isActive ? 88 : 68, height: isActive ? 88 : 68,
                    borderRadius:'50%',
                    background: isActive ? 'radial-gradient(circle,rgba(232,146,58,0.25) 0%,transparent 70%)' : 'transparent',
                    border:'none', cursor:'pointer',
                    transition:'all 0.45s cubic-bezier(0.16,1,0.3,1)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                  }}
                >
                  <div style={{
                    width: isActive ? 56 : 44, height: isActive ? 56 : 44,
                    borderRadius:'50%',
                    background: isActive ? 'var(--gradient-sun)' : 'var(--bg-elevated)',
                    border:`1.5px solid ${isActive ? 'var(--sun-orange)' : 'var(--aluminum-dark)'}`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    color: isActive ? 'var(--bg-deep)' : 'var(--aluminum-mid)',
                    fontFamily:'JetBrains Mono', fontSize:'0.52rem',
                    fontWeight:700, letterSpacing:'0.08em', textAlign:'center',
                    transition:'all 0.4s',
                    boxShadow: isActive ? '0 0 28px rgba(232,146,58,0.5)' : 'none',
                    lineHeight:1.2,
                  }}>
                    {pillar.label}
                  </div>
                </button>
              )
            })}

            {/* SVG connecting lines */}
            <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none' }}>
              {PILLARS.map(pillar => {
                const isActive = pillar.id === active
                const rad = (pillar.angle * Math.PI) / 180
                const x2 = `calc(50% + ${Math.cos(rad - Math.PI / 2) * 125}px)`
                const y2 = `calc(50% + ${Math.sin(rad - Math.PI / 2) * 125}px)`
                return (
                  <line key={pillar.id} x1="50%" y1="50%" x2={x2} y2={y2}
                    stroke={isActive ? 'var(--sun-orange)' : 'var(--aluminum-edge)'}
                    strokeWidth={isActive ? 1.5 : 0.5}
                    strokeDasharray={isActive ? '0' : '4 4'}
                    opacity={isActive ? 0.7 : 0.3}
                    style={{ transition:'all 0.4s' }} />
                )
              })}
            </svg>
          </div>

          {/* Text panel */}
          <div style={{
            padding:'2.5rem', background:'linear-gradient(180deg,var(--bg-elevated) 0%,var(--bg-surface) 100%)',
            border:'1px solid var(--border-subtle)', position:'relative', overflow:'hidden',
          }}>
            <div style={{ position:'absolute', top:0, left:0, width:'100%', height:2, background:'var(--gradient-sun)' }} />
            <div style={{ fontFamily:'JetBrains Mono', fontSize:'0.7rem', letterSpacing:'0.25em', color:'var(--sun-orange)', marginBottom:'0.8rem' }}>
              // {activePillar.label}
            </div>
            <h3 style={{ fontSize:'clamp(1.8rem,3vw,2.4rem)', marginBottom:'1.5rem' }}>
              {activePillar.title}
            </h3>
            <p style={{ color:'var(--text-secondary)', fontSize:'1rem', lineHeight:1.8 }}>
              {activePillar.text}
            </p>
            <div style={{ marginTop:'2rem', display:'flex', gap:'0.5rem' }}>
              {PILLARS.map(p => (
                <button key={p.id} onClick={() => setActive(p.id)} style={{
                  width: p.id === active ? 32 : 8, height:4,
                  background: p.id === active ? 'var(--sun-orange)' : 'var(--aluminum-edge)',
                  transition:'all 0.4s', cursor:'pointer', border:'none',
                }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`@media(max-width:900px){.why-grid{grid-template-columns:1fr!important;gap:3rem!important}}`}</style>
    </section>
  )
}

export default WhySunmount
