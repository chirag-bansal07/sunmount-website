import { Link } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import { ArrowRightIcon } from '../components/icons'
import { POST_INDEX, formatDate } from '../data/postIndex'
import useSeo from '../hooks/useSeo'

export default function Blog() {
  useSeo('/blog')
  return (
    <main style={{ paddingTop: 110, paddingBottom: 80, background: 'var(--bg-base)' }}>
      <div className="container">
        <Breadcrumbs items={[{ name: 'Guides', to: '/blog' }]} />
        <div className="section-label">GUIDES &amp; INSIGHTS</div>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.4rem)', lineHeight: 1.1, marginBottom: '1rem', maxWidth: 820 }}>
          Solar Mounting Structure Guides
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.75, maxWidth: 720, marginBottom: '2.5rem' }}>
          Practical advice for EPC contractors, installers and building owners: choosing materials,
          matching a structure to your roof, and designing for Indian wind conditions.
        </p>
        <ul className="blog-list">
          {POST_INDEX.map(p => (
            <li key={p.slug}>
              <Link to={`/blog/${p.slug}`}>
                <span className="blog-meta">{formatDate(p.date)} · {p.minutes} min read</span>
                <h2>{p.title}</h2>
                <p>{p.description}</p>
                <span className="blog-more">Read guide <ArrowRightIcon /></span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <style>{`
        .blog-list{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:1.2rem}
        .blog-list a{display:flex;flex-direction:column;gap:.7rem;height:100%;padding:1.6rem;border:1px solid var(--border-subtle);background:var(--bg-elevated);transition:border-color .3s}
        .blog-list a:hover{border-color:var(--border-accent)}
        .blog-list h2{font-size:1.2rem;line-height:1.3;color:var(--text-primary)}
        .blog-list p{color:var(--text-secondary);line-height:1.7;font-size:.95rem}
        .blog-meta{font-family:'JetBrains Mono';font-size:.68rem;letter-spacing:.08em;color:var(--text-muted);text-transform:uppercase}
        .blog-more{margin-top:auto;display:inline-flex;align-items:center;gap:.5rem;font-family:'JetBrains Mono';font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--sun-orange)}
      `}</style>
    </main>
  )
}
