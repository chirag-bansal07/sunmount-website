import { ArrowRightIcon } from '../components/icons'

const STATS = [
  { num:'75+',  label:'Years Combined Experience' },
  { num:'10K+', label:'Successful Installations' },
  { num:'50+',  label:'Global Locations Served' },
]

const Team = () => (
  <section id="team" style={{ padding:'8rem 0 0', background:'var(--bg-deep)', position:'relative' }}>
    <div className="container">
      <div style={{ marginBottom:'4rem' }}>
        <div className="section-label">OUR TEAM & CULTURE</div>
        <h2 style={{ fontSize:'clamp(2.2rem,4.5vw,3.6rem)' }}>
          Engineers, Architects,<br /><span className="gradient-text">Innovators.</span>
        </h2>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:'4rem', alignItems:'start', marginBottom:'6rem' }} className="team-grid">

        {/* LEFT: Culture */}
        <div>
          <p style={{ fontSize:'1.05rem', lineHeight:1.8, color:'var(--text-secondary)', marginBottom:'1.5rem' }}>
            SunMount® is an industrious team of prolific, vastly experienced professionals —
            Engineers, Chartered Engineers, Architects, and Post-Graduates in Commerce & Marketing.
          </p>
          <p style={{ fontSize:'1.05rem', lineHeight:1.8, color:'var(--text-secondary)', marginBottom:'2.5rem' }}>
            We bridge the gap between clients' dynamic needs and innovative engineering solutions —
            backed by reliable scientific analysis and certifications from internationally reputed organisations.
          </p>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem', marginBottom:'2rem' }}>
            {STATS.map((s, i) => (
              <div key={i} style={{ padding:'1.4rem 1rem', background:'var(--bg-elevated)', border:'1px solid var(--border-subtle)', borderLeft:'2px solid var(--sun-orange)' }}>
                <div style={{ fontFamily:'Montserrat', fontSize:'2rem', fontWeight:900, color:'var(--sun-orange)', lineHeight:1, marginBottom:'0.4rem' }}>{s.num}</div>
                <div style={{ fontSize:'0.76rem', color:'var(--text-muted)', lineHeight:1.4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Director card */}
        <div style={{ position:'sticky', top:120 }}>
          <div style={{ background:'linear-gradient(180deg,var(--bg-elevated) 0%,var(--bg-surface) 100%)', border:'1px solid var(--border-subtle)', overflow:'hidden' }}>
            <div style={{ height:3, background:'var(--gradient-sun)' }} />

            {/* Portrait */}
            <div style={{ height:260, background:'linear-gradient(180deg,rgba(224,85,64,0.14) 0%,var(--bg-elevated) 100%)', display:'flex', alignItems:'flex-end', justifyContent:'center', position:'relative', overflow:'hidden' }}>
              <div style={{
                position:'absolute', inset:0,
                backgroundImage:'linear-gradient(rgba(143,160,187,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(143,160,187,0.05) 1px,transparent 1px)',
                backgroundSize:'20px 20px',
              }} />
              {/* Avatar initials */}
              <div style={{
                width:180, height:180, borderRadius:'50%',
                background:'linear-gradient(135deg,var(--aluminum-mid) 0%,var(--aluminum-dark) 100%)',
                border:'3px solid var(--bg-deep)',
                boxShadow:'0 0 0 1px var(--sun-orange), 0 18px 50px rgba(0,0,0,0.4)',
                display:'flex', alignItems:'center', justifyContent:'center',
                marginBottom:'-90px', position:'relative', zIndex:2,
                fontFamily:'Montserrat', fontSize:'3rem', fontWeight:900, color:'rgba(6,9,18,0.6)',
              }}>VB</div>
            </div>

            <div style={{ padding:'5rem 1.8rem 1.8rem', textAlign:'center' }}>
              <div style={{ fontFamily:'JetBrains Mono', fontSize:'0.68rem', letterSpacing:'0.2em', color:'var(--sun-orange)', marginBottom:'0.5rem' }}>— DIRECTOR</div>
              <h3 style={{ fontSize:'1.55rem', marginBottom:'0.3rem' }}>Vikas Bansal</h3>
              <p style={{ fontSize:'0.82rem', color:'var(--text-muted)', marginBottom:'1.6rem', fontFamily:'JetBrains Mono', letterSpacing:'0.05em' }}>
                Founder · Managing Director
              </p>
              <p style={{ fontSize:'0.9rem', color:'var(--text-secondary)', lineHeight:1.7, marginBottom:'2rem' }}>
                Driving innovation in solar mounting design with extensive experience across manufacturing,
                services and consultancy. Available for project consultations.
              </p>
              <a href="/contact" className="btn-primary" style={{ width:'100%', justifyContent:'center', fontSize:'0.8rem' }}>
                Make an Appointment <ArrowRightIcon />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Factory photo — full width at bottom of section */}
    <div style={{ position:'relative', width:'100%', height:420, overflow:'hidden' }}>
      <img src="/factory.png" alt="SunMount Factory — Sirsa, Haryana"
        style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center 30%' }} />
      {/* Dark overlay */}
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(0deg,rgba(6,9,18,0.8) 0%,rgba(6,9,18,0.2) 50%,rgba(6,9,18,0.55) 100%)' }} />
      <div style={{ position:'absolute', bottom:'2.5rem', left:0, right:0, textAlign:'center' }}>
        <div style={{ fontFamily:'JetBrains Mono', fontSize:'0.7rem', letterSpacing:'0.22em', color:'var(--sun-orange)', marginBottom:'0.4rem', textTransform:'uppercase' }}>
          // OUR FACILITY
        </div>
        <div style={{ fontSize:'1.2rem', fontWeight:700, color:'var(--text-primary)' }}>
          Integrated Manufacturing Plant · Begu Road, Sirsa 125055, Haryana
        </div>
      </div>
    </div>

    <style>{`@media(max-width:900px){.team-grid{grid-template-columns:1fr!important;gap:3rem!important}}`}</style>
  </section>
)

export default Team
