import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Model3D from '../components/Model3D'
import Breadcrumbs from '../components/Breadcrumbs'
import FaqList from '../components/FaqList'
import { productFaq } from '../data/faq'
import { POST_INDEX } from '../data/postIndex'
import { ArrowRightIcon, DownloadIcon } from '../components/icons'
import { productBySlug } from '../data/products'
import { PRODUCT_INDEX } from '../data/productIndex'
import useSeo from '../hooks/useSeo'
import NotFound from './NotFound'

const mono = { fontFamily:"'JetBrains Mono', 'JetBrains Mono Fallback', monospace", letterSpacing: '0.12em', textTransform: 'uppercase' }

function SpecTable({ specs, caption }) {
  return (
    <table className="pd-specs">
      <caption className="sr-only">{caption}</caption>
      <tbody>
        {specs.map(s => (
          <tr key={s.label}><th scope="row">{s.label}</th><td>{s.value}</td></tr>
        ))}
      </tbody>
    </table>
  )
}

// Side-by-side key specs for systems with several variants.
function CompareTable({ product }) {
  const labels = [...new Set(product.variants.flatMap(v => v.specs.map(s => s.label)))]
  return (
    <div className="pd-scroll">
      <table className="pd-compare">
        <caption className="sr-only">{product.name} variants compared</caption>
        <thead>
          <tr><th scope="col">Specification</th>{product.variants.map(v => <th scope="col" key={v.id}>{v.name}</th>)}</tr>
        </thead>
        <tbody>
          {labels.map(l => (
            <tr key={l}>
              <th scope="row">{l}</th>
              {product.variants.map(v => <td key={v.id}>{v.specs.find(s => s.label === l)?.value ?? '—'}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ProductView({ product, meta }) {
  const [activeId, setActiveId] = useState(product.variants[0].id)
  const active = product.variants.find(v => v.id === activeId) ?? product.variants[0]
  const others = PRODUCT_INDEX.filter(p => p.slug !== product.slug)
  const multi = product.variants.length > 1
  const faq = productFaq(product)
  const guides = POST_INDEX.filter(p => p.related?.includes(product.slug))

  return (
    <main style={{ paddingTop: 110, background: 'var(--bg-base)' }}>
      {/* ── Header ── */}
      <section className="container" style={{ paddingBottom: '2.5rem' }}>
        <Breadcrumbs items={[{ name: 'Products', to: '/products' }, { name: product.name }]} />
        <div className="section-label">{product.short}</div>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.6rem)', lineHeight: 1.1, marginBottom: '1.2rem', maxWidth: 900 }}>{meta.h1}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.75, maxWidth: 760, marginBottom: '1.8rem' }}>
          {product.systemDesc}
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/contact" className="btn-primary">Request a Quote <ArrowRightIcon /></Link>
          <a href="/catalogue.pdf" target="_blank" rel="noopener noreferrer" className="btn-secondary"><DownloadIcon /> Download Catalogue</a>
        </div>
      </section>

      {/* ── 3D viewer + variant picker ── */}
      <section className="container pd-viewer" aria-label={`${product.name} 3D model`}>
        <div className="pd-canvas">
          <Model3D kind="product" model={active.model} label={active.name} />
          <div style={{ position: 'absolute', top: '0.9rem', left: '0.9rem', ...mono, fontSize: '0.62rem', color: 'var(--text-primary)', background: 'rgba(10,14,26,0.75)', border: '1px solid var(--border-subtle)', padding: '0.35rem 0.7rem', pointerEvents: 'none' }}>
            {active.name}
          </div>
        </div>
        {multi && (
          <div className="pd-picker" role="group" aria-label="Choose a variant to view">
            {product.variants.map(v => (
              <button key={v.id} type="button" aria-pressed={v.id === activeId} onClick={() => setActiveId(v.id)}>
                <strong>{v.name}</strong>
                <span>{v.subtitle}</span>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* ── Every variant, fully described ── */}
      <section className="container" style={{ paddingBlock: '3.5rem 1rem' }}>
        {multi && <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', marginBottom: '2rem' }}>{product.name} variants</h2>}
        <div style={{ display: 'grid', gap: '2.5rem' }}>
          {product.variants.map(v => {
            const H = multi ? 'h3' : 'h2'
            return (
              <article key={v.id} id={v.id} className="pd-variant">
                <div>
                  <div style={{ ...mono, fontSize: '0.66rem', color: 'var(--sun-orange)', marginBottom: '0.5rem' }}>{v.subtitle}</div>
                  <H style={{ fontSize: '1.5rem', marginBottom: '0.8rem' }}>{v.name}</H>
                  <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '0.8rem' }}>{v.tagline}</p>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.2rem' }}>{v.desc}</p>
                  <ul className="pd-list">
                    {v.highlights.map(h => <li key={h}>{h}</li>)}
                  </ul>
                  {v.applications?.length > 0 && (
                    <p style={{ marginTop: '1.2rem', color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                      <strong style={{ color: 'var(--text-secondary)' }}>Applications:</strong> {v.applications.join(' · ')}
                    </p>
                  )}
                </div>
                <SpecTable specs={v.specs} caption={`${v.name} specifications`} />
              </article>
            )
          })}
        </div>
      </section>

      {multi && (
        <section className="container" style={{ paddingBlock: '2rem' }}>
          <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', marginBottom: '1.2rem' }}>Compare {product.name} variants</h2>
          <CompareTable product={product} />
        </section>
      )}

      {/* ── FAQ (answer-ready passages for search and AI assistants) ── */}
      {faq.length > 0 && (
        <section className="container" style={{ paddingBlock: '2rem', maxWidth: 1000 }}>
          <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', marginBottom: '1.2rem' }}>{product.name} FAQ</h2>
          <FaqList items={faq} openFirst />
        </section>
      )}

      {guides.length > 0 && (
        <section className="container" style={{ paddingBlock: '1rem' }}>
          <h2 style={{ fontSize: 'clamp(1.2rem, 2.6vw, 1.6rem)', marginBottom: '0.8rem' }}>Related guides</h2>
          <ul className="pd-guides">
            {guides.map(g => <li key={g.slug}><Link to={`/blog/${g.slug}`}>{g.title} <ArrowRightIcon /></Link></li>)}
          </ul>
        </section>
      )}

      {/* ── Other systems (internal links) ── */}
      <section className="container" style={{ paddingBlock: '3rem' }}>
        <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', marginBottom: '1.2rem' }}>Other SunMount mounting systems</h2>
        <ul className="pd-others">
          {others.map(o => (
            <li key={o.slug}>
              <Link to={`/products/${o.slug}`}>
                <strong>{o.h1}</strong>
                <span>{o.metaDescription}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: 'var(--bg-elevated)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container" style={{ paddingBlock: '3.5rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', marginBottom: '0.5rem' }}>Get a quote for your roof</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Share your roof type and project size. Call <a href="tel:+917837999222" style={{ color: 'var(--sun-orange)', textDecoration: 'underline', textUnderlineOffset: 3 }}>+91 78379 99222</a> or send an enquiry.
            </p>
          </div>
          <Link to="/contact" className="btn-primary">Send an Enquiry <ArrowRightIcon /></Link>
        </div>
      </section>

      <style>{`
        .sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
        .pd-guides{list-style:none;padding:0;display:grid;gap:.6rem}
        .pd-guides a{display:inline-flex;align-items:center;gap:.5rem;color:var(--text-secondary)} .pd-guides a:hover{color:var(--sun-orange)}
        .pd-viewer{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:1rem;align-items:stretch}
        .pd-canvas{position:relative;height:380px;border:1px solid var(--border-subtle);background:radial-gradient(ellipse at 50% 70%,rgba(224,85,64,.07) 0%,transparent 70%)}
        .pd-picker{display:grid;gap:.6rem;align-content:start}
        .pd-picker button{display:grid;gap:.25rem;text-align:left;padding:.9rem 1rem;background:var(--bg-elevated);border:1px solid var(--border-subtle);color:var(--text-primary);cursor:pointer;font:inherit}
        .pd-picker button span{font-family:'JetBrains Mono', 'JetBrains Mono Fallback', monospace;font-size:.66rem;letter-spacing:.08em;color:var(--text-muted)}
        .pd-picker button[aria-pressed="true"]{border-color:var(--sun-orange);background:rgba(224,85,64,.08)}
        .pd-variant{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:2.5rem;padding-top:2.5rem;border-top:1px solid var(--border-subtle)}
        .pd-list{display:grid;gap:.45rem;padding-left:1.1rem;color:var(--text-secondary)}
        .pd-specs,.pd-compare{width:100%;border-collapse:collapse;font-size:.92rem}
        .pd-specs th,.pd-specs td,.pd-compare th,.pd-compare td{text-align:left;padding:.65rem .8rem;border-bottom:1px solid var(--border-subtle);vertical-align:top}
        .pd-specs th,.pd-compare tbody th{color:var(--text-muted);font-weight:600;width:42%}
        .pd-specs td,.pd-compare td{color:var(--text-primary)}
        .pd-compare thead th{font-family:'JetBrains Mono', 'JetBrains Mono Fallback', monospace;font-size:.7rem;letter-spacing:.08em;color:var(--sun-orange);white-space:nowrap}
        .pd-scroll{overflow-x:auto}
        .pd-compare{min-width:640px}
        .pd-others{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1rem}
        .pd-others a{display:grid;gap:.4rem;height:100%;padding:1.1rem 1.2rem;border:1px solid var(--border-subtle);background:var(--bg-elevated);transition:border-color .3s}
        .pd-others a:hover{border-color:var(--border-accent)}
        .pd-others strong{color:var(--text-primary)} .pd-others span{color:var(--text-muted);font-size:.86rem;line-height:1.6}
        @media(max-width:900px){.pd-viewer,.pd-variant{grid-template-columns:1fr}.pd-canvas{height:300px}}
      `}</style>
    </main>
  )
}

export default function ProductDetail() {
  const { slug } = useParams()
  const product = productBySlug(slug)
  const meta = PRODUCT_INDEX.find(p => p.slug === slug)
  useSeo(product ? `/products/${slug}` : '/404')
  if (!product || !meta) return <NotFound />
  // key: reset the variant picker when moving between systems
  return <ProductView key={slug} product={product} meta={meta} />
}
