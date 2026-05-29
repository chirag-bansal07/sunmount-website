import { useRef } from 'react'
import { ArrowRightIcon } from '../components/icons'
import { motion, useScroll, useTransform } from 'framer-motion'

const STATS = [
  { num:'75+',  label:'Years Combined Experience' },
  { num:'10K+', label:'Successful Installations' },
  { num:'50+',  label:'Global Locations Served' },
]

const slideLeft  = { hidden:{opacity:0,x:-40}, show:{opacity:1,x:0,transition:{duration:0.75,ease:[0.16,1,0.3,1]}} }
const fadeUp     = { hidden:{opacity:0,y:24},  show:{opacity:1,y:0, transition:{duration:0.6,ease:[0.16,1,0.3,1]}} }

const Team = () => {
  const sectionRef = useRef()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 85%', 'end 10%'],
  })
  // Director card floats upward at a slower rate than the page scroll — parallax
  const cardY = useTransform(scrollYProgress, [0, 1], [40, -50])

  return (
    <section ref={sectionRef} id="team" style={{ padding:'4.5rem 0 3.5rem', background:'var(--bg-deep)', position:'relative' }}>
      <div className="container">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{once:true,margin:'-80px'}}
          style={{ marginBottom:'2.5rem' }}>
          <div className="section-label">OUR TEAM & CULTURE</div>
          <h2 style={{ fontSize:'clamp(2.2rem,4.5vw,3.6rem)' }}>
            Engineers, Architects,<br /><span className="gradient-text">Innovators.</span>
          </h2>
        </motion.div>

        <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:'4rem', alignItems:'start', marginBottom:'3rem' }} className="team-grid">

          {/* LEFT: Culture + factory image */}
          <motion.div variants={slideLeft} initial="hidden" whileInView="show" viewport={{once:true,margin:'-60px'}}
            style={{ display:'flex', flexDirection:'column' }}>
            <p style={{ fontSize:'1.05rem', lineHeight:1.8, color:'var(--text-secondary)', marginBottom:'1.5rem' }}>
              SunMount® is an industrious team of prolific, vastly experienced professionals —
              Engineers, Chartered Engineers, Architects, and Post-Graduates in Commerce & Marketing.
            </p>
            <p style={{ fontSize:'1.05rem', lineHeight:1.8, color:'var(--text-secondary)', marginBottom:'2rem' }}>
              We bridge the gap between clients' dynamic needs and innovative engineering solutions —
              backed by reliable scientific analysis and certifications from internationally reputed organisations.
            </p>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem', marginBottom:'2rem' }}>
              {STATS.map((s, i) => (
                <div key={i} style={{ padding:'1.2rem 0.9rem', background:'var(--bg-elevated)', border:'1px solid var(--border-subtle)', borderLeft:'2px solid var(--sun-orange)' }}>
                  <div style={{ fontFamily:'Montserrat', fontSize:'1.8rem', fontWeight:900, color:'var(--sun-orange)', lineHeight:1, marginBottom:'0.4rem' }}>{s.num}</div>
                  <div style={{ fontSize:'0.72rem', color:'var(--text-muted)', lineHeight:1.4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Factory image — fills remaining space to match director card bottom */}
            <div style={{
              flex:1, minHeight:160, maxHeight:300,
              overflow:'hidden', position:'relative',
              border:'1px solid var(--border-subtle)',
            }}>
              <img
                src="/factory.png"
                alt="SunMount Manufacturing Facility, Sirsa"
                style={{
                  width:'100%', height:'100%',
                  objectFit:'cover', objectPosition:'55% 40%',
                  display:'block',
                  filter:'brightness(0.68) saturate(0.82)',
                }}
              />
              <div style={{
                position:'absolute', inset:0,
                background:'linear-gradient(180deg, transparent 50%, rgba(6,9,18,0.75) 100%)',
              }} />
              <div style={{
                position:'absolute', bottom:'0.8rem', left:'1rem',
                fontFamily:'JetBrains Mono', fontSize:'0.6rem',
                letterSpacing:'0.18em', color:'rgba(255,255,255,0.50)',
                textTransform:'uppercase',
              }}>
                // Manufacturing Facility · Sirsa, Haryana
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Director card — parallax float */}
          <motion.div style={{ y: cardY, position:'sticky', top:120 }}>
            <div style={{ background:'linear-gradient(180deg,var(--bg-elevated) 0%,var(--bg-surface) 100%)', border:'1px solid var(--border-subtle)', overflow:'hidden' }}>
              <div style={{ height:3, background:'var(--gradient-sun)' }} />

              {/* Portrait */}
              <div style={{ height:280, position:'relative', overflow:'hidden', background:'var(--bg-deep)' }}>
                <img
                  src="/director.jpg"
                  alt="Vikas Bansal — Founder & Managing Director"
                  style={{
                    width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top',
                    display:'block',
                    maskImage:'linear-gradient(to bottom, black 55%, transparent 100%)',
                    WebkitMaskImage:'linear-gradient(to bottom, black 55%, transparent 100%)',
                  }}
                />
                <div style={{
                  position:'absolute', inset:0,
                  background:'linear-gradient(to bottom, rgba(6,9,18,0) 50%, var(--bg-elevated) 100%)',
                }} />
              </div>

              <div style={{ padding:'1.6rem 1.8rem 1.8rem', textAlign:'center' }}>
                <div style={{ fontFamily:'JetBrains Mono', fontSize:'0.68rem', letterSpacing:'0.2em', color:'var(--sun-orange)', marginBottom:'0.5rem' }}>— DIRECTOR</div>
                <h3 style={{ fontSize:'1.5rem', marginBottom:'0.3rem' }}>Vikas Bansal</h3>
                <p style={{ fontSize:'0.82rem', color:'var(--text-muted)', marginBottom:'1.4rem', fontFamily:'JetBrains Mono', letterSpacing:'0.05em' }}>
                  Founder · Managing Director
                </p>
                <p style={{ fontSize:'0.88rem', color:'var(--text-secondary)', lineHeight:1.7, marginBottom:'1.8rem' }}>
                  Driving innovation in solar mounting design with extensive experience across manufacturing,
                  services and consultancy. Available for project consultations.
                </p>
                <a href="/contact" className="btn-primary" style={{ width:'100%', justifyContent:'center', fontSize:'0.8rem' }}>
                  Make an Appointment <ArrowRightIcon />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`@media(max-width:900px){.team-grid{grid-template-columns:1fr!important;gap:3rem!important}}`}</style>
    </section>
  )
}

export default Team
