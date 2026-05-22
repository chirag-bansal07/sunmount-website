const products = [
  { name: 'Mono Rail System', orientation: 'Portrait', desc: 'Lightweight and most efficient rail system for portrait orientation solar panel mounting.' },
  { name: 'Mini Rail System', orientation: 'Landscape', desc: 'Lightweight and most efficient rail system for landscape orientation solar panel mounting.' },
  { name: 'Long Rail System', orientation: 'Portrait', desc: 'High strength rail system designed for heavy-duty portrait orientation installations.' },
]

const Products = () => (
  <main style={{ paddingTop: '6rem', minHeight: '100vh', background: '#0A0F1E' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '4rem 2rem' }}>
      <p style={{ color: '#F97316', fontFamily: 'Rajdhani', letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.85rem', marginBottom: '1rem' }}>Our Range</p>
      <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '3rem' }}>Products</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {products.map((p, i) => (
          <div key={i} style={{
            padding: '2.5rem', borderRadius: '8px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            transition: 'border-color 0.3s, transform 0.3s'
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(249,115,22,0.5)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            <div style={{ marginBottom: '1rem' }}>
              <span style={{ padding: '0.2rem 0.8rem', background: 'rgba(249,115,22,0.15)', color: '#F97316', borderRadius: 100, fontSize: '0.75rem', fontFamily: 'Rajdhani', letterSpacing: '0.1em' }}>
                {p.orientation}
              </span>
            </div>
            <h2 style={{ fontFamily: 'Rajdhani', fontSize: '1.5rem', marginBottom: '1rem' }}>{p.name}</h2>
            <p style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, fontSize: '0.92rem' }}>{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </main>
)

export default Products

