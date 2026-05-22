import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

const REVIEWS = [
  {
    name: 'Kapil Mevani',
    role: 'Entrepreneur',
    company: 'Mevani Industries',
    rating: 5,
    text: 'We are using SunMount® solar mounting structures. The products are awesome & very easy to use. Quality is exceptional and installation was a breeze. Highly recommend!',
    avatar: 'KM',
    color: '#F97316',
  },
  {
    name: 'Shashikala Naidu',
    role: 'Project Head',
    company: 'GreenTech Solar',
    rating: 5,
    text: "I'm very happy using SunMount® solar mounting structures. The quality is World Class & easy to install. Extremely Satisfied!!! The after-sales support is prompt and professional.",
    avatar: 'SN',
    color: '#FBB034',
  },
  {
    name: 'Rajesh Patel',
    role: 'Solar EPC Contractor',
    company: 'SunPower Solutions',
    rating: 5,
    text: 'Outstanding build quality. The aluminum extrusions are perfectly machined. Wind load certifications are genuine and documentation is straightforward. Best in the market.',
    avatar: 'RP',
    color: '#A8C5D8',
  },
  {
    name: 'Arvind Kumar',
    role: 'Plant Manager',
    company: 'Apex Manufacturing',
    rating: 5,
    text: 'For our 500 kWp industrial rooftop project, SunMount® delivered on time and within budget. The FEA analysis and wind certifications gave us full confidence. Excellent team.',
    avatar: 'AK',
    color: '#22C55E',
  },
]

function Stars({ count = 5 }) {
  return (
    <div style={{ display: 'flex', gap: '0.2rem' }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ color: i < count ? '#FBB034' : 'rgba(255,255,255,0.15)', fontSize: '0.9rem' }}>★</span>
      ))}
    </div>
  )
}

export default function Testimonials() {
  const [active, setActive] = useState(0)
  const timerRef = useRef()

  const next = () => setActive(a => (a + 1) % REVIEWS.length)
  const prev = () => setActive(a => (a - 1 + REVIEWS.length) % REVIEWS.length)

  useEffect(() => {
    timerRef.current = setInterval(next, 5000)
    return () => clearInterval(timerRef.current)
  }, [])

  const reset = (fn) => {
    clearInterval(timerRef.current)
    fn()
    timerRef.current = setInterval(next, 5000)
  }

  const r = REVIEWS[active]

  return (
    <section style={{
      padding: '8rem 5%',
      background: 'linear-gradient(180deg, var(--bg-0) 0%, var(--bg-1) 100%)',
      overflow: 'hidden',
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>Client Stories</div>
          <h2 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}>What Our Clients Say</h2>
        </div>

        {/* Main review card */}
        <div style={{
          background: 'linear-gradient(160deg, #161A22, #111318)',
          border: '1px solid rgba(200,213,220,0.1)',
          borderRadius: 8,
          padding: '3rem',
          position: 'relative',
          marginBottom: '2rem',
        }}>
          {/* Quote mark */}
          <div style={{
            position: 'absolute', top: 24, left: 32,
            fontSize: '6rem', lineHeight: 1, color: 'rgba(249,115,22,0.12)',
            fontFamily: 'serif', userSelect: 'none', pointerEvents: 'none',
          }}>"</div>

          <div style={{ position: 'relative' }}>
            <Stars count={r.rating} />
            <p style={{
              fontSize: '1.1rem', lineHeight: 1.85, color: 'var(--text-1)',
              margin: '1.5rem 0', fontStyle: 'italic',
            }}>
              "{r.text}"
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: `linear-gradient(135deg, ${r.color}44, ${r.color}22)`,
                border: `2px solid ${r.color}66`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1rem',
                color: r.color,
              }}>{r.avatar}</div>
              <div>
                <div style={{ fontWeight: 700, fontFamily: 'Rajdhani', fontSize: '1.1rem' }}>{r.name}</div>
                <div style={{ color: 'var(--text-2)', fontSize: '0.8rem' }}>{r.role} · {r.company}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          <button onClick={() => reset(prev)} style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)',
            color: 'var(--text-1)', fontSize: '1.1rem', cursor: 'pointer',
            transition: 'border-color 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--solar)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >←</button>

          {REVIEWS.map((_, i) => (
            <button key={i} onClick={() => reset(() => setActive(i))} style={{
              width: i === active ? 28 : 8, height: 8,
              borderRadius: 4,
              background: i === active ? 'linear-gradient(90deg, #F97316, #FBB034)' : 'rgba(255,255,255,0.15)',
              border: 'none', cursor: 'pointer',
              transition: 'width 0.3s, background 0.3s',
            }} />
          ))}

          <button onClick={() => reset(next)} style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)',
            color: 'var(--text-1)', fontSize: '1.1rem', cursor: 'pointer',
            transition: 'border-color 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--solar)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >→</button>
        </div>

        {/* CTA */}
        <div style={{
          textAlign: 'center', marginTop: '5rem',
          padding: '3rem',
          background: 'linear-gradient(135deg, rgba(249,115,22,0.08) 0%, rgba(251,176,52,0.05) 100%)',
          border: '1px solid rgba(249,115,22,0.15)',
          borderRadius: 8,
        }}>
          <h3 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.5rem)', marginBottom: '1.5rem' }}>
            Looking for Professional<br />
            <span style={{ color: 'var(--solar)' }}>High Quality Products?</span>
          </h3>
          <Link to="/contact" className="btn-primary" style={{ fontSize: '0.9rem', padding: '0.9rem 2.5rem' }}>
            Contact Us Today →
          </Link>
        </div>
      </div>
    </section>
  )
}
