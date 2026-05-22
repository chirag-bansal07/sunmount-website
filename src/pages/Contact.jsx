import { useState } from 'react'

const FIELDS = [
  { name: 'name', label: 'Full Name', type: 'text', col: 1 },
  { name: 'company', label: 'Company Name', type: 'text', col: 1 },
  { name: 'email', label: 'Email Address', type: 'email', col: 1 },
  { name: 'phone', label: 'Phone Number', type: 'tel', col: 1 },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', subject: '', message: '', meetF2F: false })
  const [focus, setFocus] = useState(null)

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
  }

  const inputStyle = (field) => ({
    width: '100%',
    padding: '0.85rem 1rem',
    background: focus === field ? 'rgba(249,115,22,0.05)' : 'rgba(255,255,255,0.03)',
    border: `1px solid ${focus === field ? 'rgba(249,115,22,0.5)' : 'rgba(200,213,220,0.12)'}`,
    borderRadius: 4,
    color: 'var(--text-1)',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.3s, background 0.3s',
    fontFamily: 'Montserrat',
  })

  return (
    <main style={{ paddingTop: 72, minHeight: '100vh', background: 'var(--bg-0)' }}>
      {/* Hero */}
      <div style={{
        padding: '5rem 5%',
        background: 'linear-gradient(180deg, #0D0F15 0%, var(--bg-0) 100%)',
        borderBottom: '1px solid var(--border)',
        textAlign: 'center',
      }}>
        <div className="section-label" style={{ justifyContent: 'center' }}>Get In Touch</div>
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', marginBottom: '1rem' }}>
          Let's Build Something<br />
          <span style={{ color: 'var(--solar)' }}>Together</span>
        </h1>
        <p style={{ color: 'var(--text-2)', maxWidth: 500, margin: '0 auto', fontSize: '0.95rem', lineHeight: 1.7 }}>
          Our engineering team is ready to help with your solar mounting requirements.
          Supplying all over the world.
        </p>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '5rem 5%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '4rem' }}>

          {/* LEFT — Info */}
          <div>
            <h2 style={{ fontFamily: 'Rajdhani', fontSize: '1.8rem', marginBottom: '2rem' }}>Contact Information</h2>

            {[
              { icon: '📍', label: 'Visit Us', value: 'Sunmount Solutions, Begu Road\nSirsa 125055, Haryana, India' },
              { icon: '📞', label: 'Call Us', value: '+91 7837 999 222', href: 'tel:+917837999222' },
              { icon: '✉️', label: 'Email Us', value: 'info@sunmount.in', href: 'mailto:info@sunmount.in' },
              { icon: '🌍', label: 'Supply', value: 'All Over The World' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', gap: '1rem', alignItems: 'flex-start',
                padding: '1.25rem 0',
                borderBottom: '1px solid var(--border)',
              }}>
                <span style={{ fontSize: '1.3rem', flexShrink: 0, marginTop: 2 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--solar)', fontWeight: 700, marginBottom: '0.3rem' }}>{item.label}</div>
                  {item.href ? (
                    <a href={item.href} style={{ color: 'var(--text-1)', fontSize: '0.95rem', lineHeight: 1.5 }}>{item.value}</a>
                  ) : (
                    <div style={{ color: 'var(--text-2)', fontSize: '0.9rem', lineHeight: 1.5, whiteSpace: 'pre-line' }}>{item.value}</div>
                  )}
                </div>
              </div>
            ))}

            {/* Social */}
            <div style={{ marginTop: '2rem', display: 'flex', gap: '0.75rem' }}>
              <a href="https://api.whatsapp.com/send?phone=917837999222" target="_blank" rel="noopener noreferrer"
                className="btn-primary" style={{ fontSize: '0.75rem', padding: '0.6rem 1.2rem' }}>
                WhatsApp
              </a>
              <a href="https://www.linkedin.com/in/raj-g-3b59b9123/" target="_blank" rel="noopener noreferrer"
                className="btn-ghost" style={{ fontSize: '0.75rem', padding: '0.6rem 1.2rem' }}>
                LinkedIn
              </a>
            </div>
          </div>

          {/* RIGHT — Form */}
          <div>
            <div style={{
              background: 'linear-gradient(145deg, #161A22, #111318)',
              border: '1px solid var(--border)',
              borderRadius: 8, padding: '2.5rem',
            }}>
              <h2 style={{ fontFamily: 'Rajdhani', fontSize: '1.8rem', marginBottom: '2rem' }}>Send a Message</h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                {FIELDS.map(f => (
                  <div key={f.name}>
                    <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: '0.4rem', fontWeight: 600 }}>
                      {f.label}
                    </label>
                    <input
                      type={f.type} name={f.name} value={form[f.name]}
                      onChange={handleChange}
                      onFocus={() => setFocus(f.name)}
                      onBlur={() => setFocus(null)}
                      style={inputStyle(f.name)}
                    />
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: '0.4rem', fontWeight: 600 }}>
                  Subject
                </label>
                <input type="text" name="subject" value={form.subject} onChange={handleChange}
                  onFocus={() => setFocus('subject')} onBlur={() => setFocus(null)}
                  style={inputStyle('subject')} placeholder="e.g. Quote for 100 kWp rooftop project"
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: '0.4rem', fontWeight: 600 }}>
                  Message
                </label>
                <textarea name="message" value={form.message} onChange={handleChange} rows={5}
                  onFocus={() => setFocus('message')} onBlur={() => setFocus(null)}
                  style={{ ...inputStyle('message'), resize: 'vertical' }}
                  placeholder="Tell us about your project requirements..."
                />
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', marginBottom: '1.5rem' }}>
                <input type="checkbox" name="meetF2F" checked={form.meetF2F} onChange={handleChange}
                  style={{ accentColor: '#F97316', width: 16, height: 16 }}
                />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-2)' }}>I'd prefer a face-to-face meeting</span>
              </label>

              <button
                onClick={() => alert('Thank you! We will contact you shortly.')}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '0.85rem' }}
              >
                Send Message →
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
