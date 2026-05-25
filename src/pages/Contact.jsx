import { useState } from 'react'
import { ArrowRightIcon } from '../components/icons'
import { motion } from 'framer-motion'

const FIELDS = [
  { name: 'name',    label: 'Full Name',              type: 'text',  placeholder: 'Raj Sharma' },
  { name: 'company', label: 'Company / Organization', type: 'text',  placeholder: 'Solar EPC Ltd.' },
  { name: 'email',   label: 'Email Address',          type: 'email', placeholder: 'raj@company.com' },
  { name: 'phone',   label: 'Phone Number',           type: 'tel',   placeholder: '+91 98765 43210' },
]

const REQUIREMENTS = [
  { value: 'mono',   label: 'Mono Rail System' },
  { value: 'mini',   label: 'Mini Rail System' },
  { value: 'long',   label: 'Long Rail System' },
  { value: 'seam',   label: 'Standing Seam System' },
  { value: 'other',  label: 'Other / General Consultation' },
]

const fadeUp = { hidden:{opacity:0,y:28}, show:{opacity:1,y:0,transition:{duration:0.7,ease:[0.16,1,0.3,1]}} }

const Contact = () => {
  const [form, setForm]     = useState({ name:'', company:'', email:'', phone:'', requirement:'', message:'' })
  const [status, setStatus] = useState('idle') // idle | loading | sent | error

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setStatus('loading')
    try {
      // Replace YOUR_FORM_ID with your Formspree form ID after creating one at formspree.io
      const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      // Fallback: open mail client if fetch fails
      const body = `Name: ${form.name}\nCompany: ${form.company}\nPhone: ${form.phone}\nRequirement: ${form.requirement}\n\n${form.message}`
      window.location.href = `mailto:info@sunmount.in?subject=Enquiry from ${encodeURIComponent(form.name)}&body=${encodeURIComponent(body)}`
      setStatus('sent')
    }
  }

  const inputStyle = {
    width:'100%', padding:'0.85rem 1rem',
    background:'var(--bg-elevated)', border:'1px solid var(--border-subtle)',
    color:'var(--text-primary)', fontFamily:'Montserrat', fontSize:'0.9rem',
    outline:'none', transition:'border-color 0.3s',
  }

  return (
    <main style={{ paddingTop:'80px', minHeight:'100vh', background:'var(--bg-base)' }}>

      {/* Page header */}
      <div style={{ padding:'5rem 0 4rem', background:'linear-gradient(180deg, var(--bg-deep) 0%, var(--bg-base) 100%)', borderBottom:'1px solid var(--border-subtle)', position:'relative' }}>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'var(--gradient-sun)' }} />
        <div className="container">
          <motion.div variants={fadeUp} initial="hidden" animate="show">
            <div className="section-label">CONTACT US</div>
            <h1 style={{ fontSize:'clamp(2.5rem, 6vw, 5rem)', maxWidth:700 }}>
              Let's Build Something<br /><span className="gradient-text">Great Together.</span>
            </h1>
          </motion.div>
        </div>
      </div>

      <div className="container" style={{ padding:'5rem 2rem' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'5rem', alignItems:'start' }} className="contact-grid">

          {/* Form */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay:0.15 }}>
            {status === 'sent' ? (
              <div style={{ padding:'3rem', background:'var(--bg-elevated)', border:'1px solid var(--border-accent)', textAlign:'center' }}>
                <div style={{ fontSize:'3rem', marginBottom:'1rem', color:'var(--sun-orange)' }}>✓</div>
                <h3 style={{ fontSize:'1.6rem', marginBottom:'0.8rem', color:'var(--sun-orange)' }}>Message Sent!</h3>
                <p style={{ color:'var(--text-secondary)' }}>Our team will get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1.2rem' }}>
                {FIELDS.map(({ name, label, type, placeholder }) => (
                  <div key={name}>
                    <label style={{ display:'block', fontFamily:'JetBrains Mono', fontSize:'0.68rem', letterSpacing:'0.15em', textTransform:'uppercase', color:'var(--aluminum-mid)', marginBottom:'0.5rem' }}>{label}</label>
                    <input name={name} type={type} placeholder={placeholder} value={form[name]} onChange={handleChange} required
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor='var(--sun-orange)'}
                      onBlur={e => e.target.style.borderColor='var(--border-subtle)'} />
                  </div>
                ))}

                <div>
                  <label style={{ display:'block', fontFamily:'JetBrains Mono', fontSize:'0.68rem', letterSpacing:'0.15em', textTransform:'uppercase', color:'var(--aluminum-mid)', marginBottom:'0.5rem' }}>Product Requirement</label>
                  <select name="requirement" value={form.requirement} onChange={handleChange}
                    style={{ ...inputStyle, cursor:'pointer' }}
                    onFocus={e => e.target.style.borderColor='var(--sun-orange)'}
                    onBlur={e => e.target.style.borderColor='var(--border-subtle)'}>
                    <option value="">Select product type…</option>
                    {REQUIREMENTS.map(r => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display:'block', fontFamily:'JetBrains Mono', fontSize:'0.68rem', letterSpacing:'0.15em', textTransform:'uppercase', color:'var(--aluminum-mid)', marginBottom:'0.5rem' }}>Message / Project Details</label>
                  <textarea name="message" rows={5} placeholder="Describe your project — roof type, number of panels, location..."
                    value={form.message} onChange={handleChange}
                    style={{ ...inputStyle, resize:'vertical', minHeight:130 }}
                    onFocus={e => e.target.style.borderColor='var(--sun-orange)'}
                    onBlur={e => e.target.style.borderColor='var(--border-subtle)'} />
                </div>

                {status === 'error' && (
                  <div style={{ padding:'0.75rem 1rem', background:'rgba(224,85,64,0.08)', border:'1px solid var(--border-accent)', color:'var(--sun-orange)', fontFamily:'JetBrains Mono', fontSize:'0.72rem', letterSpacing:'0.05em' }}>
                    Something went wrong. Please try again or email us at info@sunmount.in
                  </div>
                )}

                <button type="submit" className="btn-primary"
                  style={{ justifyContent:'center', fontSize:'0.9rem', opacity: status === 'loading' ? 0.7 : 1 }}
                  disabled={status === 'loading'}>
                  {status === 'loading' ? 'Sending…' : <>Send Message <ArrowRightIcon /></>}
                </button>
              </form>
            )}
          </motion.div>

          {/* Contact info */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay:0.28 }}
            style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
            {[
              { label:'HEADQUARTERS', lines:['Sunmount Solutions','Begu Road, Sirsa 125055','Haryana, India'] },
              { label:'PHONE',        lines:['+91 7837 999 222'] },
              { label:'EMAIL',        lines:['info@sunmount.in'] },
              { label:'SUPPLY COVERAGE', lines:['Pan India','International — All Over World'] },
            ].map((item, i) => (
              <div key={i} style={{ padding:'1.8rem', background:'var(--bg-elevated)', border:'1px solid var(--border-subtle)', borderLeft:'2px solid var(--sun-orange)' }}>
                <div style={{ fontFamily:'JetBrains Mono', fontSize:'0.65rem', letterSpacing:'0.2em', color:'var(--sun-orange)', marginBottom:'0.6rem' }}>// {item.label}</div>
                {item.lines.map((line, j) => <div key={j} style={{ fontSize:'0.95rem', color:'var(--text-primary)', lineHeight:1.6 }}>{line}</div>)}
              </div>
            ))}
            <div style={{ padding:'1.8rem', background:'var(--bg-elevated)', border:'1px solid var(--border-subtle)' }}>
              <div style={{ fontFamily:'JetBrains Mono', fontSize:'0.65rem', letterSpacing:'0.2em', color:'var(--aluminum-mid)', marginBottom:'1rem' }}>// CERTIFICATIONS</div>
              <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap' }}>
                {['ISO Certified','TÜV Certified','MSME Registered','Made in India'].map(c => (
                  <span key={c} style={{ padding:'0.3rem 0.75rem', background:'rgba(255,107,26,0.08)', border:'1px solid var(--border-accent)', fontFamily:'JetBrains Mono', fontSize:'0.65rem', letterSpacing:'0.1em', color:'var(--sun-orange)', textTransform:'uppercase' }}>{c}</span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`@media(max-width:900px){.contact-grid{grid-template-columns:1fr!important;gap:3rem!important}}`}</style>
    </main>
  )
}

export default Contact
