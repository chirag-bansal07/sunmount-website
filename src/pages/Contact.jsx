import { useState } from 'react'

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', message: '' })

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const inputStyle = {
    width: '100%', padding: '0.9rem 1rem',
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '4px', color: '#fff', fontSize: '0.95rem',
    outline: 'none', transition: 'border-color 0.2s', fontFamily: 'Inter'
  }

  return (
    <main style={{ paddingTop: '6rem', minHeight: '100vh', background: '#0A0F1E' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '4rem 2rem' }}>
        <p style={{ color: '#F97316', fontFamily: 'Rajdhani', letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.85rem', marginBottom: '1rem' }}>Get In Touch</p>
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '3rem' }}>Contact Us</h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {['name', 'email', 'phone', 'company'].map(field => (
                <input key={field} name={field} type="text" placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={form[field]} onChange={handleChange}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#F97316'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                />
              ))}
              <textarea name="message" rows={5} placeholder="Your Message"
                value={form.message} onChange={handleChange}
                style={{ ...inputStyle, resize: 'vertical' }}
                onFocus={e => e.target.style.borderColor = '#F97316'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
              />
              <button style={{
                padding: '1rem', background: 'linear-gradient(135deg, #F97316, #FBB034)',
                color: '#0A0F1E', fontFamily: 'Rajdhani', fontWeight: 700,
                fontSize: '1rem', letterSpacing: '0.08em', textTransform: 'uppercase',
                border: 'none', borderRadius: '4px', cursor: 'pointer'
              }}>Send Message</button>
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {[
                { label: 'Address', value: 'Sunmount Solutions, Begu Road, Sirsa 125055, Haryana, India' },
                { label: 'Phone', value: '+91 7837 999 222' },
                { label: 'Email', value: 'info@sunmount.in' },
                { label: 'Supply', value: 'All Over World!' },
              ].map((item, i) => (
                <div key={i}>
                  <div style={{ color: '#F97316', fontFamily: 'Rajdhani', letterSpacing: '0.1em', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.3rem' }}>{item.label}</div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem' }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Contact
