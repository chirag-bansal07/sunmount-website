import { useState, useEffect } from 'react'
import { StarIcon, ArrowRightIcon } from '../components/icons'
import { Link } from 'react-router-dom'

const REVIEWS = [
  {
    quote: 'We are using SunMount® solar mounting structures. The products are awesome and very easy to use. Their engineering precision is unmatched in the Indian market.',
    name: 'Kapil Mevani',
    role: 'Entrepreneur',
    company: 'Renewable Energy Co.',
    rating: 5,
  },
  {
    quote: "I'm very happy using SunMount® solar mounting structures. The quality is world class and easy to install. Extremely satisfied with the after-sales support too!",
    name: 'Shashikala Naidu',
    role: 'Project Head',
    company: 'Solar Infrastructure Ltd.',
    rating: 5,
  },
  {
    quote: 'From initial design consultation to final installation, SunMount delivered beyond expectations. The 200km/h wind certification gave us complete peace of mind for our coastal project.',
    name: 'Arjun Pillai',
    role: 'Senior Engineer',
    company: 'EPC Solar Solutions',
    rating: 5,
  },
]

const Testimonials = () => {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setActive(p => (p + 1) % REVIEWS.length), 6000)
    return () => clearInterval(id)
  }, [])

  return (
    <section style={{
      padding: '8rem 0',
      background: 'var(--bg-base)',
      position: 'relative',
    }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="section-label" style={{ display: 'inline-flex' }}>CLIENT TESTIMONIALS</div>
          <h2 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)' }}>
            Trusted by <span className="gradient-text">Industry Leaders</span>
          </h2>
        </div>

        {/* Carousel */}
        <div style={{
          position: 'relative',
          maxWidth: 900,
          margin: '0 auto',
          minHeight: 360,
        }}>
          {REVIEWS.map((review, i) => (
            <div
              key={i}
              style={{
                position: i === active ? 'relative' : 'absolute',
                top: 0, left: 0, right: 0,
                opacity: i === active ? 1 : 0,
                transform: i === active ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                pointerEvents: i === active ? 'auto' : 'none',
              }}
            >
              <div style={{
                padding: '3rem 3rem 2.5rem',
                background: 'linear-gradient(180deg, var(--bg-elevated) 0%, var(--bg-surface) 100%)',
                border: '1px solid var(--border-subtle)',
                position: 'relative',
              }}>
                {/* Big quote mark */}
                <div style={{
                  position: 'absolute',
                  top: -20, left: 30,
                  fontFamily: 'Montserrat',
                  fontSize: '6rem',
                  fontWeight: 900,
                  lineHeight: 1,
                  color: 'var(--sun-orange)',
                  opacity: 0.25,
                }}>"</div>

                {/* Stars */}
                <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '1.5rem', color: 'var(--sun-yellow)' }}>
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <StarIcon key={i} />
                  ))}
                </div>

                <p style={{
                  fontSize: '1.15rem',
                  lineHeight: 1.7,
                  color: 'var(--text-primary)',
                  marginBottom: '2rem',
                  fontStyle: 'italic',
                  fontWeight: 300,
                }}>
                  {review.quote}
                </p>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid var(--border-subtle)',
                }}>
                  {/* Avatar placeholder with initials */}
                  <div style={{
                    width: 52, height: 52,
                    borderRadius: '50%',
                    background: 'var(--gradient-sun)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'Montserrat',
                    fontSize: '1rem',
                    fontWeight: 800,
                    color: 'var(--bg-deep)',
                  }}>
                    {review.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {review.name}
                    </div>
                    <div style={{
                      fontSize: '0.78rem',
                      color: 'var(--text-muted)',
                      fontFamily: 'JetBrains Mono',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}>
                      {review.role} · {review.company}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Indicators */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.5rem',
          marginTop: '2rem',
        }}>
          {REVIEWS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                width: i === active ? 32 : 8,
                height: 4,
                background: i === active ? 'var(--sun-orange)' : 'var(--aluminum-edge)',
                transition: 'all 0.4s',
                cursor: 'pointer',
              }}
              aria-label={`View testimonial ${i + 1}`}
            />
          ))}
        </div>

        {/* CTA */}
        <div style={{
          marginTop: '5rem',
          padding: '3.5rem 2rem',
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(255,107,26,0.08) 0%, rgba(255,107,26,0) 70%)',
          border: '1px solid var(--border-subtle)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            top: 0, left: 0, height: 2,
            width: '100%',
            background: 'var(--gradient-sun)',
          }} />

          <h3 style={{
            fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
            marginBottom: '0.6rem',
          }}>
            Looking for Professional <span className="gradient-text">High Quality Products?</span>
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1rem' }}>
            Get in touch with our engineering team — supplying all over the world.
          </p>
          <Link to="/contact" className="btn-primary" style={{ fontSize: '0.95rem', padding: '1.1rem 2.4rem' }}>
            Contact Us <ArrowRightIcon />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
