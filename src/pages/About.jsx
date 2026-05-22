const About = () => (
  <main style={{ paddingTop: '6rem', minHeight: '100vh', background: '#0A0F1E' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '4rem 2rem' }}>
      <p style={{ color: '#F97316', fontFamily: 'Rajdhani', letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.85rem', marginBottom: '1rem' }}>Our Story</p>
      <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '2rem' }}>About SunMount®</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
        <div>
          <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, marginBottom: '1.5rem', fontSize: '1.05rem' }}>
            SunMount® is an industrious & studious team of prolific & vastly experienced professionals:
            Engineers, Chartered Engineers, Architects & post graduates in Commerce & Marketing.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, fontSize: '1.05rem' }}>
            We have a combined team experience of more than 75+ years, in diversified sectors
            of Manufacturing, Services & Consultancy.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {[
            { label: 'Mission', text: 'Promote renewable energy by making solar installations easier and accessible to all.' },
            { label: 'Vision', text: "Solve clients' dynamic needs with innovative, certified engineering solutions." },
            { label: 'Quality', text: 'ISO & MSME registered, TUV certified products — 6063-T6, SS-304 grade materials.' },
            { label: 'Ambition', text: 'Best in raw materials, manufacturing, timelines, warranty & after-sales support.' },
          ].map((item, i) => (
            <div key={i} style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: '8px' }}>
              <h3 style={{ color: '#F97316', fontFamily: 'Rajdhani', fontSize: '1.1rem', marginBottom: '0.5rem' }}>{item.label}</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem', lineHeight: 1.6 }}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </main>
)

export default About
