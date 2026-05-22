import { ArrowRightIcon } from '../components/icons'

const CULTURE_POINTS = [
  { num: '75+', label: 'Years Combined Team Experience' },
  { num: '15K+', label: 'sq ft Manufacturing Plant' },
  { num: '100%', label: 'Engineering-Led Workflow' },
]

const Team = () => {
  return (
    <section id="team" style={{
      padding: '8rem 0',
      background: 'var(--bg-deep)',
      position: 'relative',
    }}>
      <div className="container">
        <div style={{ marginBottom: '4rem' }}>
          <div className="section-label">OUR TEAM & CULTURE</div>
          <h2 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)' }}>
            Engineers, Architects,<br />
            <span className="gradient-text">Innovators.</span>
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr',
          gap: '4rem',
          alignItems: 'start',
        }} className="team-grid">

          {/* LEFT: Work Culture */}
          <div>
            <p style={{
              fontSize: '1.05rem',
              lineHeight: 1.8,
              color: 'var(--text-secondary)',
              marginBottom: '1.5rem',
            }}>
              SunMount® is an industrious and studious team of prolific, vastly experienced
              professionals — Engineers, Chartered Engineers, Architects, and Post Graduates
              in Commerce & Marketing.
            </p>
            <p style={{
              fontSize: '1.05rem',
              lineHeight: 1.8,
              color: 'var(--text-secondary)',
              marginBottom: '2.5rem',
            }}>
              We aspire to bridge the gap between clients' dynamic needs and innovative solutions —
              with genuine, reliable scientific analysis and certifications from reputed organizations,
              while staying competitive in pricing.
            </p>

            {/* Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem',
              marginBottom: '2.5rem',
            }}>
              {CULTURE_POINTS.map((point, i) => (
                <div key={i} style={{
                  padding: '1.5rem 1rem',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderLeft: '2px solid var(--sun-orange)',
                }}>
                  <div style={{
                    fontFamily: 'Montserrat',
                    fontSize: '2rem',
                    fontWeight: 900,
                    color: 'var(--sun-orange)',
                    lineHeight: 1,
                    marginBottom: '0.4rem',
                  }}>
                    {point.num}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    letterSpacing: '0.03em',
                    lineHeight: 1.4,
                  }}>
                    {point.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Factory visualization (placeholder block — replace with real photo) */}
            <div style={{
              position: 'relative',
              height: 280,
              background: 'linear-gradient(135deg, var(--bg-elevated) 0%, var(--bg-surface) 100%)',
              border: '1px solid var(--border-subtle)',
              overflow: 'hidden',
            }}>
              {/* Stylized factory illustration */}
              <svg viewBox="0 0 600 280" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ opacity: 0.8 }}>
                <defs>
                  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF6B1A" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#060912" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="metal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8FA0BB" />
                    <stop offset="100%" stopColor="#2A3247" />
                  </linearGradient>
                </defs>
                <rect width="600" height="280" fill="url(#sky)" />
                {/* Sun */}
                <circle cx="500" cy="80" r="35" fill="#FBB034" opacity="0.7" />
                <circle cx="500" cy="80" r="55" fill="#FF6B1A" opacity="0.15" />
                {/* Factory silhouette */}
                <polygon points="0,200 80,200 80,150 160,150 160,180 240,180 240,140 320,140 320,170 400,170 400,150 480,150 480,190 600,190 600,280 0,280" fill="url(#metal)" />
                {/* Sawtooth roof */}
                {[0, 80, 160, 240, 320, 400, 480].map(x => (
                  <polygon key={x} points={`${x},200 ${x + 40},170 ${x + 80},200`} fill="#1a1f2e" opacity="0.8" />
                ))}
                {/* Stacked rails */}
                {[0, 1, 2, 3].map(i => (
                  <rect key={i} x="50" y={230 + i * 4} width="500" height="2" fill="#8FA0BB" opacity={0.7 - i * 0.15} />
                ))}
                {/* Grid lines */}
                <line x1="0" y1="220" x2="600" y2="220" stroke="#FF6B1A" strokeWidth="0.5" opacity="0.4" />
              </svg>

              <div style={{
                position: 'absolute',
                bottom: 0, left: 0, right: 0,
                padding: '1.5rem',
                background: 'linear-gradient(0deg, var(--bg-deep) 0%, transparent 100%)',
              }}>
                <div style={{
                  fontFamily: 'JetBrains Mono',
                  fontSize: '0.7rem',
                  letterSpacing: '0.15em',
                  color: 'var(--sun-orange)',
                  marginBottom: '0.3rem',
                }}>
                  // FACILITY · SIRSA, HARYANA
                </div>
                <div style={{
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                }}>
                  15,000+ sq ft Integrated Manufacturing Plant
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Director Card */}
          <div style={{
            position: 'sticky',
            top: 120,
          }}>
            <DirectorCard />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .team-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
        }
      `}</style>
    </section>
  )
}

const DirectorCard = () => (
  <div style={{
    background: 'linear-gradient(180deg, var(--bg-elevated) 0%, var(--bg-surface) 100%)',
    border: '1px solid var(--border-subtle)',
    overflow: 'hidden',
    position: 'relative',
  }}>
    {/* Top accent */}
    <div style={{
      height: 3,
      background: 'var(--gradient-sun)',
    }} />

    {/* Portrait area */}
    <div style={{
      height: 280,
      background: 'linear-gradient(180deg, rgba(255,107,26,0.15) 0%, var(--bg-elevated) 100%)',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(143,160,187,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(143,160,187,0.06) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }} />

      {/* Avatar placeholder — replace with real photo */}
      <div style={{
        width: 200,
        height: 200,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--aluminum-mid) 0%, var(--aluminum-dark) 100%)',
        border: '3px solid var(--bg-deep)',
        boxShadow: '0 0 0 1px var(--sun-orange), 0 20px 60px rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginBottom: '-100px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Silhouette */}
        <svg viewBox="0 0 200 200" width="200" height="200" style={{ position: 'absolute', bottom: 0 }}>
          <circle cx="100" cy="70" r="35" fill="var(--bg-deep)" opacity="0.5" />
          <ellipse cx="100" cy="160" rx="55" ry="50" fill="var(--bg-deep)" opacity="0.5" />
        </svg>
      </div>
    </div>

    {/* Info */}
    <div style={{ padding: '5rem 1.8rem 1.8rem', textAlign: 'center' }}>
      <div style={{
        fontFamily: 'JetBrains Mono',
        fontSize: '0.7rem',
        letterSpacing: '0.2em',
        color: 'var(--sun-orange)',
        marginBottom: '0.5rem',
      }}>
        — DIRECTOR
      </div>
      <h3 style={{
        fontSize: '1.6rem',
        marginBottom: '0.3rem',
      }}>
        Raj Bansal
      </h3>
      <p style={{
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
        marginBottom: '1.8rem',
        fontFamily: 'JetBrains Mono',
        letterSpacing: '0.05em',
      }}>
        Founder · Lead Engineer
      </p>

      <p style={{
        fontSize: '0.92rem',
        color: 'var(--text-secondary)',
        lineHeight: 1.7,
        marginBottom: '2rem',
      }}>
        Driving innovation in solar mounting design with two decades
        of engineering expertise. Available for project consultations.
      </p>

      <a
        href="https://www.sunmount.in/contact/"
        className="btn-primary"
        style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem' }}
      >
        Make an Appointment <ArrowRightIcon />
      </a>
    </div>
  </div>
)

export default Team
