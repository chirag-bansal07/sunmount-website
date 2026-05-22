import { Link } from 'react-router-dom'

const CULTURE_POINTS = [
  { icon: '🔬', title: 'Engineering Excellence', text: '75+ combined years of expertise across Engineering, Architecture & Commerce.' },
  { icon: '⚙️', title: 'Precision Manufacturing', text: '15,000 sq.ft+ state-of-the-art production facility with rigorous QC at every stage.' },
  { icon: '🌱', title: 'Sustainability First', text: 'Every product we make helps reduce dependence on fossil fuels. Purpose-driven work.' },
  { icon: '📋', title: 'Certified & Compliant', text: 'ISO, MSME, and TUV certifications with full, genuine documentation — always.' },
]

export default function TeamSection() {
  return (
    <section id="team" style={{
      padding: '8rem 5%',
      background: 'linear-gradient(180deg, var(--bg-1) 0%, var(--bg-0) 100%)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>Our Team</div>
          <h2 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}>
            The People Behind<br />
            <span style={{ color: 'var(--al-light)' }}>SunMount<sup style={{ fontSize: '0.4em', color: 'var(--solar)' }}>®</sup></span>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
          {/* LEFT — Work Culture */}
          <div>
            <h3 style={{ fontFamily: 'Rajdhani', fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--al-light)' }}>
              Work Culture & Philosophy
            </h3>
            <p style={{ color: 'var(--text-2)', lineHeight: 1.8, marginBottom: '2.5rem', fontSize: '0.95rem' }}>
              SunMount® is an industrious and studious team of prolific professionals.
              We bridge the gap between clients' dynamic needs and innovative engineering solutions —
              always backed by genuine scientific analysis and competitive pricing.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {CULTURE_POINTS.map((pt, i) => (
                <div key={i} style={{
                  display: 'flex', gap: '1rem', alignItems: 'flex-start',
                  padding: '1.25rem',
                  background: 'rgba(200,213,220,0.03)',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  transition: 'border-color 0.3s',
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(200,213,220,0.2)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{pt.icon}</span>
                  <div>
                    <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.25rem' }}>{pt.title}</div>
                    <div style={{ color: 'var(--text-2)', fontSize: '0.85rem', lineHeight: 1.6 }}>{pt.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Director Panel */}
          <div>
            <div style={{
              background: 'linear-gradient(145deg, #161A22, #111318)',
              border: '1px solid rgba(200,213,220,0.12)',
              borderRadius: 8,
              overflow: 'hidden',
            }}>
              {/* Header stripe */}
              <div style={{
                height: 6,
                background: 'linear-gradient(90deg, #F97316, #FBB034, #A8C5D8)',
              }} />

              <div style={{ padding: '2.5rem' }}>
                {/* Avatar */}
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '2rem' }}>
                  <div style={{
                    width: 90, height: 90, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1A2535, #0F1820)',
                    border: '3px solid rgba(249,115,22,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Rajdhani', fontWeight: 800, fontSize: '2rem',
                    color: '#F97316',
                    boxShadow: '0 0 30px rgba(249,115,22,0.2)',
                    flexShrink: 0,
                  }}>RG</div>
                  <div>
                    <div style={{ fontFamily: 'Rajdhani', fontSize: '1.6rem', fontWeight: 700 }}>Raj G.</div>
                    <div style={{ color: 'var(--solar)', fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
                      Director & Founder
                    </div>
                    <div style={{ color: 'var(--text-3)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                      SunMount® Solutions
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <p style={{ color: 'var(--text-2)', lineHeight: 1.8, fontSize: '0.9rem', marginBottom: '2rem' }}>
                  A seasoned professional with deep expertise spanning Manufacturing, Services and Consultancy.
                  Leading SunMount® with a vision to make renewable energy infrastructure accessible,
                  reliable, and truly world-class. Quality with Stability for Infinity.
                </p>

                {/* Stats */}
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr',
                  gap: '1rem', marginBottom: '2rem',
                  padding: '1.5rem',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                }}>
                  {[
                    { val: '75+', label: 'Team Yrs Experience' },
                    { val: '10k+', label: 'Projects Completed' },
                    { val: '50+', label: 'Global Locations' },
                    { val: '15+', label: 'Years in Industry' },
                  ].map((s, i) => (
                    <div key={i} style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: 'Rajdhani', fontSize: '1.6rem', fontWeight: 700, color: '#F97316' }}>{s.val}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Appointment button */}
                <a
                  href="https://api.whatsapp.com/send?phone=917837999222&text=Hi%20I%20would%20like%20to%20make%20an%20appointment"
                  target="_blank" rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', padding: '0.85rem' }}
                >
                  📅 Make an Appointment
                </a>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                  <a
                    href="https://www.linkedin.com/in/raj-g-3b59b9123/"
                    target="_blank" rel="noopener noreferrer"
                    className="btn-ghost"
                    style={{ flex: 1, justifyContent: 'center', fontSize: '0.75rem', padding: '0.6rem' }}
                  >LinkedIn</a>
                  <a
                    href="https://api.whatsapp.com/send?phone=917837999222"
                    target="_blank" rel="noopener noreferrer"
                    className="btn-ghost"
                    style={{ flex: 1, justifyContent: 'center', fontSize: '0.75rem', padding: '0.6rem' }}
                  >WhatsApp</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
