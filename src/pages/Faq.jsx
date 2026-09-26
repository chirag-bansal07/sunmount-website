import { Link } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import FaqList from '../components/FaqList'
import { ArrowRightIcon } from '../components/icons'
import { FAQ } from '../data/faq'
import useSeo from '../hooks/useSeo'

export default function Faq() {
  useSeo('/faq')
  return (
    <main style={{ paddingTop: 110, paddingBottom: 80, background: 'var(--bg-base)' }}>
      <div className="container" style={{ maxWidth: 900 }}>
        <Breadcrumbs items={[{ name: 'FAQ', to: '/faq' }]} />
        <div className="section-label">FREQUENTLY ASKED QUESTIONS</div>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', lineHeight: 1.1, marginBottom: '1rem' }}>
          Solar Mounting Structure FAQ
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.75, marginBottom: '2.5rem' }}>
          Answers about SunMount's mounting systems, roof compatibility, wind ratings, materials and ordering.
          Can't find yours? <Link to="/contact" style={{ color: 'var(--sun-orange)', textDecoration: 'underline', textUnderlineOffset: 3 }}>Ask our team</Link>.
        </p>
        {FAQ.map(g => (
          <section key={g.group} style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: 'clamp(1.3rem, 3vw, 1.7rem)', marginBottom: '1rem' }}>{g.group}</h2>
            <FaqList items={g.items} />
          </section>
        ))}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/products" className="btn-primary">Browse Products <ArrowRightIcon /></Link>
          <Link to="/blog" className="btn-secondary">Read the Guides</Link>
        </div>
      </div>
    </main>
  )
}
