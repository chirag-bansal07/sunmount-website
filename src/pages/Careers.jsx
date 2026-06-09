import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRightIcon } from '../components/icons'

/* ── Job openings — add/remove roles here ─────────────────────── */
const OPENINGS = [
  {
    id: 'sales-executive',
    title: 'Sales Executive',
    type: 'Full-Time · On-Site',
    location: 'Sirsa, Haryana',
    salary: 'To be discussed',
    education: 'BBA / B.Com / Marketing / Sales / B.Tech (minimum graduation)',
    description:
      'Drive business growth by identifying EPC contractors, solar installers, and distributors across India. Build strong client relationships, prepare quotations, and close orders for our full range of solar mounting systems.',
    responsibilities: [
      'Identify and reach out to EPC contractors, solar installers, and distributors',
      'Understand customer project requirements and recommend the right mounting system',
      'Follow up on leads, prepare quotations, and close orders',
      'Build and maintain long-term client relationships',
      'Represent Sunmount at industry meets, exhibitions, and site visits',
      'Coordinate with internal teams on order fulfilment and after-sales support',
    ],
    requirements: [
      'Minimum graduation in BBA / B.Com / Marketing / Sales / B.Tech or equivalent',
      'Strong communication and negotiation skills',
      'Self-motivated with a target-driven mindset',
      'Prior experience in solar, building materials, or industrial sales is a plus — not mandatory',
      'Willingness to travel for client visits and site meetings',
    ],
  },
]

/* ── Perks ────────────────────────────────────────────────────── */
const PERKS = [
  { icon: '🌞', title: 'Growing Industry', desc: 'Be part of India\'s fastest-growing clean energy sector with real career upside.' },
  { icon: '🏭', title: 'Certified Manufacturer', desc: 'Work with an ISO 9001 & TÜV SÜD certified brand trusted across 50+ countries.' },
  { icon: '📈', title: 'Performance Growth', desc: 'Clear growth path with performance-linked incentives and recognition.' },
  { icon: '🤝', title: 'Collaborative Culture', desc: 'A close-knit, energetic team where your work directly impacts the business.' },
  { icon: '🛠️', title: 'Product Training', desc: 'Full training on our product range so you represent Sunmount with confidence.' },
  { icon: '🌏', title: 'National Reach', desc: 'Work with clients from across India and exposure to international markets.' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
}

const inputStyle = {
  width: '100%', padding: '0.85rem 1rem',
  background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
  color: 'var(--text-primary)', fontFamily: 'Montserrat', fontSize: '0.9rem',
  outline: 'none', transition: 'border-color 0.3s', boxSizing: 'border-box',
}

const labelStyle = {
  display: 'block', fontFamily: 'JetBrains Mono', fontSize: '0.68rem',
  letterSpacing: '0.15em', textTransform: 'uppercase',
  color: 'var(--aluminum-mid)', marginBottom: '0.5rem',
}

/* ── Role selector dropdown options ─────────────────────────────── */
const ROLE_OPTIONS = [
  ...OPENINGS.map(o => ({ value: o.id, label: o.title })),
  { value: 'other', label: 'Other / General Application' },
]

const EDUCATION_OPTIONS = [
  { value: 'bba',         label: 'BBA' },
  { value: 'bcom',        label: 'B.Com' },
  { value: 'btech',       label: 'B.Tech / B.E.' },
  { value: 'marketing',   label: 'Bachelor\'s in Marketing' },
  { value: 'sales',       label: 'Bachelor\'s in Sales' },
  { value: 'mba',         label: 'MBA' },
  { value: 'other-edu',   label: 'Other' },
]

const Careers = () => {
  const [expandedJob, setExpandedJob]   = useState(null)
  const [form, setForm]                 = useState({
    name: '', email: '', phone: '', role: '', education: '',
    experience: '', resumeLink: '', message: '',
  })
  const [status, setStatus]             = useState('idle')  // idle | loading | sent | error
  const [errorMsg, setErrorMsg]         = useState('')

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setStatus('loading')
    try {
      const roleLabel = ROLE_OPTIONS.find(r => r.value === form.role)?.label || form.role || 'Not specified'
      const eduLabel  = EDUCATION_OPTIONS.find(r => r.value === form.education)?.label || form.education || 'Not specified'

      const payload = {
        access_key: 'ce080276-f9f7-4b7d-a791-f2553f5da3ee',
        botcheck: false,
        to: 'info@sunmount.in,hr.suntrik@gmail.com',
        subject: `Career Application — ${roleLabel} | ${form.name}`,
        from_name: form.name,
        email: form.email,
        phone: form.phone || '—',
        role_applied_for: roleLabel,
        education: eduLabel,
        experience: form.experience || '—',
        resume_link: form.resumeLink || '—',
        cover_note: form.message || '—',
      }

      const res  = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (data.success) {
        setStatus('sent')
      } else {
        setErrorMsg(data.message || 'Submission failed')
        setStatus('error')
      }
    } catch (err) {
      setErrorMsg(err.message || 'Network error')
      setStatus('error')
    }
  }

  return (
    <main style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--bg-base)' }}>

      {/* ── Page header ──────────────────────────────────────────── */}
      <div style={{
        padding: '5rem 0 4rem',
        background: 'linear-gradient(180deg, var(--bg-deep) 0%, var(--bg-base) 100%)',
        borderBottom: '1px solid var(--border-subtle)', position: 'relative',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--gradient-sun)' }} />
        <div className="container">
          <motion.div variants={fadeUp} initial="hidden" animate="show">
            <div className="section-label">CAREERS</div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', maxWidth: 700 }}>
              Build the Future of<br /><span className="gradient-text">Solar Energy.</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: 560, marginTop: '1.2rem', lineHeight: 1.7 }}>
              Join a team that's manufacturing world-class solar mounting systems right here in India —
              and putting them on rooftops across 50+ countries.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Why join us ──────────────────────────────────────────── */}
      <section style={{ padding: '5rem 0', background: 'var(--bg-base)' }}>
        <div className="container">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <div className="section-label">WHY SUNMOUNT</div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: '3rem' }}>
              A Place to <span className="gradient-text">Grow</span>
            </h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }} className="perks-grid">
            {PERKS.map((perk, i) => (
              <motion.div key={i}
                variants={fadeUp} initial="hidden" whileInView="show"
                viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                style={{
                  padding: '2rem', background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderTop: '2px solid var(--sun-orange)',
                }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>{perk.icon}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{perk.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>{perk.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Current openings ─────────────────────────────────────── */}
      <section style={{ padding: '4rem 0 5rem', background: 'var(--bg-deep)' }}>
        <div className="container">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <div className="section-label">OPEN POSITIONS</div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: '2.5rem' }}>
              Current <span className="gradient-text">Openings</span>
            </h2>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {OPENINGS.map((job, i) => (
              <motion.div key={job.id}
                variants={fadeUp} initial="hidden" whileInView="show"
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                style={{
                  background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
                  borderLeft: '3px solid var(--sun-orange)', overflow: 'hidden',
                }}>

                {/* Job header row */}
                <div
                  onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                  style={{
                    padding: '1.8rem 2rem', display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', cursor: 'pointer', gap: '1rem',
                  }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>{job.title}</h3>
                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '0.3rem' }}>
                      {[
                        { icon: '📍', text: job.location },
                        { icon: '🕘', text: job.type },
                        { icon: '💰', text: job.salary },
                        { icon: '🎓', text: 'Minimum Undergraduate' },
                      ].map((tag, t) => (
                        <span key={t} style={{ fontFamily: 'Montserrat', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.03em', color: 'var(--text-secondary)' }}>
                          {tag.icon} {tag.text}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'rgba(255,107,26,0.1)', border: '1px solid var(--border-accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    transition: 'transform 0.3s', transform: expandedJob === job.id ? 'rotate(180deg)' : 'none',
                    color: 'var(--sun-orange)', fontSize: '1rem',
                  }}>▾</div>
                </div>

                {/* Expanded details */}
                {expandedJob === job.id && (
                  <div style={{ padding: '0 2rem 2rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.5rem', fontSize: '0.92rem' }}>{job.description}</p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }} className="job-detail-grid">
                      <div>
                        <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', letterSpacing: '0.18em', color: 'var(--sun-orange)', marginBottom: '0.8rem' }}>// RESPONSIBILITIES</div>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {job.responsibilities.map((r, ri) => (
                            <li key={ri} style={{ display: 'flex', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                              <span style={{ color: 'var(--sun-orange)', flexShrink: 0 }}>→</span>{r}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', letterSpacing: '0.18em', color: 'var(--sun-orange)', marginBottom: '0.8rem' }}>// REQUIREMENTS</div>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {job.requirements.map((r, ri) => (
                            <li key={ri} style={{ display: 'flex', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                              <span style={{ color: 'var(--sun-orange)', flexShrink: 0 }}>✓</span>{r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <button
                      className="btn-primary"
                      style={{ marginTop: '1.8rem', fontSize: '0.85rem' }}
                      onClick={() => {
                        setForm(p => ({ ...p, role: job.id }))
                        document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' })
                      }}>
                      Apply for This Role <ArrowRightIcon />
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Application form ─────────────────────────────────────── */}
      <section id="apply-form" style={{ padding: '5rem 0', background: 'var(--bg-base)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '5rem', alignItems: 'start' }} className="careers-form-grid">

            {/* Left info */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <div className="section-label">APPLY NOW</div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: '1.2rem' }}>
                Send Us Your <span className="gradient-text">Application</span>
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.92rem', marginBottom: '2.5rem' }}>
                Fill in your details and select the role you're applying for.
                Our team will review every application and reach out within 5 working days.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { label: 'EMAIL YOUR RESUME', value: 'info@sunmount.in' },
                  { label: 'ADDRESS', value: 'Sunmount Solutions Private Limited\nSurya Koti, Bajekan-Sirsa Main Road\nSirsa, Haryana 125055' },
                  { label: 'PHONE', value: '+91 8708 605 564' },
                ].map((item, i) => (
                  <div key={i} style={{
                    padding: '1.4rem 1.6rem', background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)', borderLeft: '2px solid var(--sun-orange)',
                  }}>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.62rem', letterSpacing: '0.18em', color: 'var(--sun-orange)', marginBottom: '0.4rem' }}>// {item.label}</div>
                    {item.value.split('\n').map((line, j) => (
                      <div key={j} style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.7 }}>{line}</div>
                    ))}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Form */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: 0.15 }}>
              {status === 'sent' ? (
                <div style={{
                  padding: '4rem 3rem', background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-accent)', textAlign: 'center',
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--sun-orange)' }}>✓</div>
                  <h3 style={{ fontSize: '1.6rem', marginBottom: '0.8rem', color: 'var(--sun-orange)' }}>Application Received!</h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    Thank you for applying to Sunmount Solutions.<br />
                    Our HR team will review your application and get back to you within 5 working days.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

                  {/* Role dropdown */}
                  <div>
                    <label style={labelStyle}>Role Applying For *</label>
                    <select name="role" value={form.role} onChange={handleChange} required
                      style={{ ...inputStyle, cursor: 'pointer' }}
                      onFocus={e => e.target.style.borderColor = 'var(--sun-orange)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'}>
                      <option value="">Select a role…</option>
                      {ROLE_OPTIONS.map(r => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Name + Email row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-row">
                    <div>
                      <label style={labelStyle}>Full Name *</label>
                      <input name="name" type="text" placeholder="Your Name" value={form.name} onChange={handleChange} required
                        style={inputStyle}
                        onFocus={e => e.target.style.borderColor = 'var(--sun-orange)'}
                        onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'} />
                    </div>
                    <div>
                      <label style={labelStyle}>Email Address *</label>
                      <input name="email" type="email" placeholder="sample@gmail.com" value={form.email} onChange={handleChange} required
                        style={inputStyle}
                        onFocus={e => e.target.style.borderColor = 'var(--sun-orange)'}
                        onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'} />
                    </div>
                  </div>

                  {/* Phone + Education row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-row">
                    <div>
                      <label style={labelStyle}>Phone Number *</label>
                      <input name="phone" type="tel" placeholder="9999999999" value={form.phone} onChange={handleChange} required
                        style={inputStyle}
                        onFocus={e => e.target.style.borderColor = 'var(--sun-orange)'}
                        onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'} />
                    </div>
                    <div>
                      <label style={labelStyle}>Highest Education *</label>
                      <select name="education" value={form.education} onChange={handleChange} required
                        style={{ ...inputStyle, cursor: 'pointer' }}
                        onFocus={e => e.target.style.borderColor = 'var(--sun-orange)'}
                        onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'}>
                        <option value="">Select education…</option>
                        {EDUCATION_OPTIONS.map(e => (
                          <option key={e.value} value={e.value}>{e.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Experience */}
                  <div>
                    <label style={labelStyle}>Years of Experience</label>
                    <input name="experience" type="text" placeholder="e.g. 2 years in solar sales, fresher, etc." value={form.experience} onChange={handleChange}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'var(--sun-orange)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'} />
                  </div>

                  {/* Resume link */}
                  <div>
                    <label style={labelStyle}>Resume Link (Google Drive / LinkedIn)</label>
                    <input name="resumeLink" type="url" placeholder="https://drive.google.com/... or linkedin.com/in/..." value={form.resumeLink} onChange={handleChange}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'var(--sun-orange)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'} />
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', letterSpacing: '0.08em', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                      Share a public Google Drive or LinkedIn profile link. Alternatively email your resume directly to info@sunmount.in
                    </div>
                  </div>

                  {/* Cover note */}
                  <div>
                    <label style={labelStyle}>Cover Note / Why Sunmount?</label>
                    <textarea name="message" rows={5}
                      placeholder="Tell us a bit about yourself, your experience, and why you want to join Sunmount Solutions…"
                      value={form.message} onChange={handleChange}
                      style={{ ...inputStyle, resize: 'vertical', minHeight: 130 }}
                      onFocus={e => e.target.style.borderColor = 'var(--sun-orange)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'} />
                  </div>

                  {status === 'error' && (
                    <div style={{
                      padding: '0.75rem 1rem', background: 'rgba(224,85,64,0.08)',
                      border: '1px solid var(--border-accent)', color: 'var(--sun-orange)',
                      fontFamily: 'JetBrains Mono', fontSize: '0.72rem', letterSpacing: '0.05em',
                    }}>
                      {errorMsg || 'Something went wrong.'} Please email us directly at info@sunmount.in
                    </div>
                  )}

                  <button type="submit" className="btn-primary"
                    style={{ justifyContent: 'center', fontSize: '0.9rem', opacity: status === 'loading' ? 0.7 : 1 }}
                    disabled={status === 'loading'}>
                    {status === 'loading' ? 'Submitting…' : <>Submit Application <ArrowRightIcon /></>}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <style>{`
        @media(max-width:900px){
          .careers-form-grid{ grid-template-columns:1fr!important; gap:3rem!important; }
          .perks-grid{ grid-template-columns:1fr 1fr!important; }
          .job-detail-grid{ grid-template-columns:1fr!important; }
          .form-row{ grid-template-columns:1fr!important; }
        }
        @media(max-width:600px){
          .perks-grid{ grid-template-columns:1fr!important; }
        }
      `}</style>
    </main>
  )
}

export default Careers
