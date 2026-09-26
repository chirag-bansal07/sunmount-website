import { Link } from 'react-router-dom'

/** Visible breadcrumb trail — mirrors the BreadcrumbList JSON-LD in src/seo/routes.js. */
export default function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" style={{ marginBottom: '1.6rem' }}>
      <ol className="crumbs">
        <li><Link to="/">Home</Link></li>
        {items.map((c, i) =>
          i === items.length - 1
            ? <li key={c.name} aria-current="page">{c.name}</li>
            : <li key={c.name}><Link to={c.to}>{c.name}</Link></li>
        )}
      </ol>
      <style>{`
        .crumbs{display:flex;flex-wrap:wrap;gap:.5rem;list-style:none;padding:0;margin:0;font-family:'JetBrains Mono';font-size:.72rem;letter-spacing:.08em;color:var(--text-muted)}
        .crumbs li+li::before{content:'/';margin-right:.5rem;color:var(--aluminum-dark)}
        .crumbs a{color:var(--text-secondary)} .crumbs a:hover{color:var(--sun-orange)}
      `}</style>
    </nav>
  )
}
