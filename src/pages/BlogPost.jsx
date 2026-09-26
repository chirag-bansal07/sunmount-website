import { Link, useParams } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import { ArrowRightIcon } from '../components/icons'
import { postBySlug } from '../data/posts'
import { POST_INDEX, formatDate } from '../data/postIndex'
import { PRODUCT_INDEX } from '../data/productIndex'
import useSeo from '../hooks/useSeo'
import NotFound from './NotFound'

function Section({ s }) {
  return (
    <section className="post-section">
      <h2>{s.h2}</h2>
      {s.p?.map(t => <p key={t.slice(0, 40)}>{t}</p>)}
      {s.list && <ul>{s.list.map(t => <li key={t}>{t}</li>)}</ul>}
      {s.table && (
        <div className="post-table">
          <table>
            <thead><tr>{s.table.head.map(h => <th key={h} scope="col">{h}</th>)}</tr></thead>
            <tbody>{s.table.rows.map(r => <tr key={r[0]}>{r.map((c, i) => i === 0 ? <th key={i} scope="row">{c}</th> : <td key={i}>{c}</td>)}</tr>)}</tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default function BlogPost() {
  const { slug } = useParams()
  const post = postBySlug(slug)
  useSeo(post ? `/blog/${slug}` : '/404')
  if (!post) return <NotFound />
  const products = PRODUCT_INDEX.filter(p => post.related?.includes(p.slug))
  const more = POST_INDEX.filter(p => p.slug !== slug).slice(0, 3)

  return (
    <main style={{ paddingTop: 110, paddingBottom: 60, background: 'var(--bg-base)' }}>
      <article className="container post">
        <Breadcrumbs items={[{ name: 'Guides', to: '/blog' }, { name: post.title }]} />
        <div className="post-meta">
          <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.minutes} min read · SunMount engineering team
        </div>
        <h1>{post.title}</h1>
        <p className="post-intro">{post.intro}</p>
        {post.sections.map(s => <Section key={s.h2} s={s} />)}

        {products.length > 0 && (
          <aside className="post-products" aria-label="Related products">
            <h2>Related SunMount systems</h2>
            <ul>
              {products.map(p => (
                <li key={p.slug}><Link to={`/products/${p.slug}`}><strong>{p.h1}</strong><span>{p.metaDescription}</span></Link></li>
              ))}
            </ul>
            <Link to="/contact" className="btn-primary" style={{ marginTop: '1.2rem' }}>Request a Quote <ArrowRightIcon /></Link>
          </aside>
        )}
      </article>

      <section className="container" style={{ marginTop: '3.5rem' }}>
        <h2 style={{ fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', marginBottom: '1rem' }}>More guides</h2>
        <ul className="post-more">
          {more.map(p => <li key={p.slug}><Link to={`/blog/${p.slug}`}>{p.title} <ArrowRightIcon /></Link></li>)}
        </ul>
      </section>

      <style>{`
        .post{max-width:820px}
        .post-meta{font-family:'JetBrains Mono', 'JetBrains Mono Fallback', monospace;font-size:.7rem;letter-spacing:.08em;color:var(--text-muted);text-transform:uppercase;margin-bottom:.9rem}
        .post h1{font-size:clamp(2rem,4.5vw,3rem);line-height:1.12;margin-bottom:1.2rem}
        .post-intro{font-size:1.1rem;line-height:1.8;color:var(--text-primary);margin-bottom:1rem}
        .post-section{margin-top:2.4rem}
        .post-section h2{font-size:clamp(1.3rem,3vw,1.7rem);margin-bottom:.9rem}
        .post-section p{color:var(--text-secondary);line-height:1.85;margin-bottom:1rem;font-size:1.02rem}
        .post-section ul{display:grid;gap:.55rem;padding-left:1.2rem;color:var(--text-secondary);line-height:1.75}
        .post-table{overflow-x:auto;margin-top:.5rem}
        .post-table table{width:100%;border-collapse:collapse;font-size:.93rem;min-width:520px}
        .post-table th,.post-table td{text-align:left;padding:.7rem .8rem;border-bottom:1px solid var(--border-subtle);vertical-align:top}
        .post-table thead th{font-family:'JetBrains Mono', 'JetBrains Mono Fallback', monospace;font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;color:var(--sun-orange)}
        .post-table tbody th{color:var(--text-primary);font-weight:600}
        .post-table td{color:var(--text-secondary)}
        .post-products{margin-top:3rem;padding:1.6rem;border:1px solid var(--border-accent);background:var(--bg-elevated)}
        .post-products h2{font-size:1.2rem;margin-bottom:1rem}
        .post-products ul{list-style:none;padding:0;margin:0;display:grid;gap:.8rem}
        .post-products a{display:grid;gap:.25rem} .post-products strong{color:var(--text-primary)} .post-products span{color:var(--text-muted);font-size:.88rem;line-height:1.6}
        .post-more{list-style:none;padding:0;display:grid;gap:.6rem}
        .post-more a{display:inline-flex;align-items:center;gap:.5rem;color:var(--text-secondary)} .post-more a:hover{color:var(--sun-orange)}
      `}</style>
    </main>
  )
}
