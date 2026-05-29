import { useState, useEffect, useCallback } from 'react'
import { StarIcon, ArrowRightIcon } from '../components/icons'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const fadeUp = { hidden:{opacity:0,y:28}, show:{opacity:1,y:0,transition:{duration:0.7,ease:[0.16,1,0.3,1]}} }

const REVIEWS = [
  {
    quote: 'We have been using SunMount® mounting structures for our rooftop projects across Punjab and Haryana. The quality of aluminium extrusions is outstanding — perfectly machined, no burrs, excellent finish. Delivery is always on time and the team is very responsive.',
    name: 'Rahul Garg', role: 'Director', company: 'Garg Solar EPC, Ludhiana', rating: 5,
  },
  {
    quote: 'Installed SunMount\'s Mono Rail system on a 500 kW commercial rooftop in Rohtak. Extremely easy to install, the T-slot design saves a lot of time on site. TÜV SÜD certification gave our client complete confidence. Highly recommend for any commercial EPC.',
    name: 'Mandeep Singh', role: 'Project Manager', company: 'SunTech Energy Solutions', rating: 5,
  },
  {
    quote: 'Best solar mounting manufacturer in India, hands down. We\'ve tried multiple brands but SunMount\'s quality and consistency is unmatched. The Long Rail system for our factory shed projects is perfect — minimal penetrations and very high wind resistance.',
    name: 'Vikram Choudhary', role: 'Founder', company: 'Choudhary Solar Systems, Rajasthan', rating: 5,
  },
  {
    quote: 'Used the Standing Seam clamp system for a 200 kW warehouse project in Chandigarh. Zero roof penetrations, super clean install, and the client was extremely happy. SunMount\'s support team helped with the structural calculations too. Will order again.',
    name: 'Anjali Mehta', role: 'Procurement Head', company: 'GreenBuild Infratech', rating: 5,
  },
  {
    quote: 'We source all our mounting hardware exclusively from SunMount. ISO 9001 certified, MSME registered, and every batch is consistent. The after-sales support is prompt and the pricing is very competitive for the quality you get.',
    name: 'Sandeep Kumar', role: 'Supply Chain Manager', company: 'Haryana Solar Developers', rating: 5,
  },
]

const Testimonials = () => {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  const prev = useCallback(() => setActive(p => (p - 1 + REVIEWS.length) % REVIEWS.length), [])
  const next = useCallback(() => setActive(p => (p + 1) % REVIEWS.length), [])

  useEffect(() => {
    if (paused) return
    const id = setInterval(next, 6000)
    return () => clearInterval(id)
  }, [next, paused])

  return (
    <section style={{ padding:'4rem 0', background:'var(--bg-base)', position:'relative' }}>
      <div className="container">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{once:true,margin:'-80px'}}
          style={{ textAlign:'center', marginBottom:'4rem' }}>
          <div className="section-label" style={{ display:'inline-flex' }}>CLIENT TESTIMONIALS</div>
          <h2 style={{ fontSize:'clamp(2.2rem,4.5vw,3.6rem)' }}>
            Trusted by <span className="gradient-text">Industry Leaders</span>
          </h2>
        </motion.div>

        {/* Carousel */}
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{once:true,margin:'-60px'}}
          style={{ position:'relative', maxWidth:880, margin:'0 auto' }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          transition={{ delay:0.1 }}
        >
          {/* Cards */}
          <div style={{ position:'relative', minHeight:320 }}>
            {REVIEWS.map((review, i) => (
              <div key={i} style={{
                position: i === active ? 'relative' : 'absolute',
                top:0, left:0, right:0,
                opacity: i === active ? 1 : 0,
                transform: i === active ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.98)',
                transition:'all 0.7s cubic-bezier(0.16,1,0.3,1)',
                pointerEvents: i === active ? 'auto' : 'none',
              }}>
                <div style={{
                  padding:'3rem 3rem 2.5rem',
                  background:'linear-gradient(180deg,var(--bg-elevated) 0%,var(--bg-surface) 100%)',
                  border:'1px solid var(--border-subtle)', position:'relative',
                }}>
                  <div style={{ position:'absolute', top:-18, left:28, fontFamily:'Montserrat', fontSize:'5rem', fontWeight:900, lineHeight:1, color:'var(--sun-orange)', opacity:0.22 }}>"</div>
                  <div style={{ display:'flex', gap:'0.2rem', marginBottom:'1.4rem', color:'var(--sun-yellow)' }}>
                    {Array.from({ length: review.rating }).map((_, i) => <StarIcon key={i} />)}
                  </div>
                  <p style={{ fontSize:'1.08rem', lineHeight:1.75, color:'var(--text-primary)', marginBottom:'2rem', fontStyle:'italic', fontWeight:300 }}>
                    {review.quote}
                  </p>
                  <div style={{ display:'flex', alignItems:'center', gap:'1rem', paddingTop:'1.5rem', borderTop:'1px solid var(--border-subtle)' }}>
                    <div style={{
                      width:50, height:50, borderRadius:'50%',
                      background:'var(--gradient-sun)',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontFamily:'Montserrat', fontSize:'0.9rem', fontWeight:800, color:'var(--bg-deep)',
                    }}>
                      {review.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div style={{ fontSize:'0.95rem', fontWeight:700 }}>{review.name}</div>
                      <div style={{ fontSize:'0.75rem', color:'var(--text-muted)', fontFamily:'JetBrains Mono', letterSpacing:'0.08em', textTransform:'uppercase' }}>
                        {review.role} · {review.company}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation controls */}
          <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:'1.5rem', marginTop:'2rem' }}>
            {/* Prev button */}
            <button onClick={prev} style={{
              width:44, height:44, borderRadius:'50%',
              background:'var(--bg-elevated)', border:'1px solid var(--border-subtle)',
              color:'var(--text-secondary)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
              transition:'all 0.25s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='var(--sun-orange)'; e.currentTarget.style.color='var(--sun-orange)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border-subtle)'; e.currentTarget.style.color='var(--text-secondary)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
            </button>

            {/* Dot indicators */}
            <div style={{ display:'flex', gap:'0.45rem' }}>
              {REVIEWS.map((_, i) => (
                <button key={i} onClick={() => setActive(i)} style={{
                  width: i === active ? 28 : 8, height:4,
                  background: i === active ? 'var(--sun-orange)' : 'var(--aluminum-edge)',
                  transition:'all 0.4s', cursor:'pointer', border:'none',
                }} />
              ))}
            </div>

            {/* Next button */}
            <button onClick={next} style={{
              width:44, height:44, borderRadius:'50%',
              background:'var(--bg-elevated)', border:'1px solid var(--border-subtle)',
              color:'var(--text-secondary)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
              transition:'all 0.25s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='var(--sun-orange)'; e.currentTarget.style.color='var(--sun-orange)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border-subtle)'; e.currentTarget.style.color='var(--text-secondary)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{once:true,margin:'-40px'}}
          style={{ marginTop:'2rem', padding:'2.5rem 2rem', textAlign:'center', background:'linear-gradient(135deg,rgba(224,85,64,0.07) 0%,rgba(224,85,64,0) 70%)', border:'1px solid var(--border-subtle)', position:'relative' }}>
          <div style={{ position:'absolute', top:0, left:0, height:2, width:'100%', background:'var(--gradient-sun)' }} />
          <h3 style={{ fontSize:'clamp(1.6rem,3vw,2.4rem)', marginBottom:'0.6rem' }}>
            Looking for Professional <span className="gradient-text">High Quality Products?</span>
          </h3>
          <p style={{ color:'var(--text-secondary)', marginBottom:'2rem', fontSize:'1rem' }}>
            Supplying all over the world — get in touch with our engineering team today.
          </p>
          <Link to="/contact" className="btn-primary" style={{ fontSize:'0.95rem', padding:'1.1rem 2.4rem' }}>
            Contact Us <ArrowRightIcon />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default Testimonials
