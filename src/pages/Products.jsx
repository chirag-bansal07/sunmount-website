import { useState, useEffect, useRef } from 'react'
import Model3D from '../components/Model3D'
import { PRODUCTS, ACCESSORIES } from '../data/products'
import { PRODUCT_INDEX } from '../data/productIndex'
import { ArrowRightIcon, DownloadIcon } from '../components/icons'
import { Link, useLocation } from 'react-router-dom'
import { m, AnimatePresence } from 'framer-motion'
import useSeo from '../hooks/useSeo'

/* ─────────────────────────────────────────────────────────────────
   VARIANT SLIDER
───────────────────────────────────────────────────────────────── */
function VariantSlider({ variants, selectedId, onSelect }) {
  const sliderRef = useRef()

  return (
    <div style={{ position: 'relative', marginBottom: '2rem' }}>
      {/* Scroll container */}
      <div
        ref={sliderRef}
        style={{
          display: 'flex', gap: '0.75rem',
          overflowX: 'auto', scrollSnapType: 'x mandatory',
          paddingBottom: '0.25rem',
          scrollbarWidth: 'none', msOverflowStyle: 'none',
        }}
      >
        {variants.map((v, i) => {
          const active = v.id === selectedId
          return (
            <button
              key={v.id}
              onClick={() => onSelect(v.id)}
              style={{
                flexShrink: 0,
                scrollSnapAlign: 'start',
                minWidth: 'clamp(130px, 38vw, 210px)', maxWidth: 210,
                padding: '1rem 1.1rem',
                background: active
                  ? 'linear-gradient(135deg,rgba(224,85,64,0.18) 0%,rgba(232,146,58,0.08) 100%)'
                  : 'var(--bg-elevated)',
                border: `1px solid ${active ? 'var(--sun-orange)' : 'var(--border-subtle)'}`,
                borderTop: active ? '2px solid var(--sun-orange)' : '2px solid transparent',
                cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
                position: 'relative',
              }}
            >
              {/* Index */}
              <div style={{
                fontFamily: 'JetBrains Mono', fontSize: '0.55rem',
                letterSpacing: '0.15em', color: active ? 'var(--sun-orange)' : 'var(--text-muted)',
                marginBottom: '0.45rem',
              }}>
                SYSTEM {String(i + 1).padStart(2, '0')}
              </div>

              {/* Name */}
              <div style={{
                fontFamily: 'Montserrat', fontSize: '0.88rem', fontWeight: 800,
                color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                marginBottom: '0.2rem', lineHeight: 1.25,
              }}>
                {v.name}
              </div>

              {/* Subtitle */}
              <div style={{
                fontFamily: 'JetBrains Mono', fontSize: '0.62rem',
                letterSpacing: '0.05em',
                color: active ? 'rgba(224,85,64,0.8)' : 'var(--text-muted)',
              }}>
                {v.subtitle}
              </div>

              {/* Active indicator dot */}
              {active && (
                <div style={{
                  position: 'absolute', bottom: '0.8rem', right: '0.8rem',
                  width: 6, height: 6, borderRadius: '50%',
                  background: 'var(--sun-orange)',
                }} />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────────── */
const VALID_IDS = PRODUCTS.map(p => p.id)

export default function Products() {
  useSeo('/products')
  const { hash }  = useLocation()
  const hashId    = hash.replace('#', '')

  // Always start on 'mono' to match the prerendered HTML (the server never
  // sees the hash); the effect below switches to the hashed system on mount.
  const [selected,   setSelected]   = useState('mono')
  const [variantId,  setVariantId]  = useState(null)
  const [zoom,       setZoom]       = useState(4)
  const [assemblyIdx, setAssemblyIdx] = useState(null) // null = base model

  // Sync selected from URL hash
  useEffect(() => {
    if (VALID_IDS.includes(hashId)) setSelected(hashId)
  }, [hashId])

  // Reset to first variant whenever main system changes — also clear assembly view
  useEffect(() => {
    const prod = PRODUCTS.find(p => p.id === selected)
    if (prod) setVariantId(prod.variants[0].id)
    setAssemblyIdx(null)
  }, [selected])

  // Reset zoom and assembly when variant changes
  useEffect(() => { setZoom(4); setAssemblyIdx(null) }, [variantId])

  const product       = PRODUCTS.find(p => p.id === selected)
  const activeVariant = product?.variants.find(v => v.id === variantId) ?? product?.variants[0]

  // Safe display component — guards against assemblyIdx being out-of-bounds
  // during the render cycle before state resets propagate
  const assemblyModel   = (assemblyIdx !== null && activeVariant?.assemblyModels?.[assemblyIdx]) || null
  const displayModel     = assemblyModel?.model ?? activeVariant?.model

  return (
    <main style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--bg-base)' }}>

      {/* ── PAGE HEADER ── */}
      <div className="prod-header" style={{
        padding: '2.5rem 0 2rem',
        background: 'linear-gradient(180deg,var(--bg-deep) 0%,var(--bg-base) 100%)',
        borderBottom: '1px solid var(--border-subtle)', position: 'relative',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--gradient-sun)' }} />
        <div className="container">
          <m.div initial={{ y:24 }} animate={{ y:0 }}
            transition={{ duration:0.7, ease:[0.16,1,0.3,1] }}>
            <div className="section-label">COMPLETE PRODUCT RANGE</div>
            <h1 className="prod-h1" style={{ fontSize:'clamp(1.8rem,3vw,2.8rem)', maxWidth:540, lineHeight:1.15 }}>
              Solar Mounting <span className="gradient-text">Systems Catalogue</span>
            </h1>
            <p className="prod-subp" style={{ color:'var(--text-secondary)', marginTop:'0.75rem', maxWidth:580, fontSize:'0.92rem', lineHeight:1.7 }}>
              Six aluminium mounting systems — ISO 9001 &amp; TÜV SÜD certified, rated up to 200 km/h.
              Select a system, then choose the model variant that suits your project.
            </p>
            <nav aria-label="Product pages" className="prod-pages">
              {PRODUCT_INDEX.map(p => <Link key={p.slug} to={`/products/${p.slug}`}>{p.name.replace(/ System$/, "")}</Link>)}
            </nav>
          </m.div>
        </div>
      </div>

      {/* ── LAYOUT: SIDEBAR + DETAIL ── */}
      <div className="desktop-products-layout">
      <div className="container">
        <div style={{ display:'grid', gridTemplateColumns:'270px 1fr', gap:'2.5rem',
          padding:'2.5rem 2rem', alignItems:'start' }} className="prod-layout">

          {/* ── Sidebar ── */}
          <m.div initial={{ x:-24 }} animate={{ x:0 }}
            transition={{ duration:0.7, ease:[0.16,1,0.3,1], delay:0.1 }}
            style={{ position:'sticky', top:108 }}>

            {PRODUCTS.map((p, i) => {
              const active    = p.id === selected
              const varCount  = p.variants.length
              return (
                <button key={p.id} onClick={() => setSelected(p.id)} style={{
                  width:'100%', textAlign:'left',
                  padding:'0.95rem 1.1rem', marginBottom:'0.4rem',
                  background: active
                    ? 'linear-gradient(135deg,rgba(224,85,64,0.14) 0%,rgba(232,146,58,0.07) 100%)'
                    : 'var(--bg-elevated)',
                  border:`1px solid ${active ? 'var(--border-accent)' : 'var(--border-subtle)'}`,
                  borderLeft:`3px solid ${active ? 'var(--sun-orange)' : 'transparent'}`,
                  cursor:'pointer',
                  transition:'all 0.3s cubic-bezier(0.16,1,0.3,1)',
                }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
                    flexWrap:'nowrap', gap:'0.4rem', marginBottom:'0.22rem' }}>
                    <div style={{ fontFamily:'JetBrains Mono', fontSize:'0.55rem', letterSpacing:'0.18em',
                      color: active ? 'var(--sun-orange)' : 'var(--text-muted)',
                      textTransform:'uppercase', whiteSpace:'nowrap', overflow:'hidden',
                      textOverflow:'ellipsis', minWidth:0 }}>
                      0{i + 1} · {p.tag}
                    </div>
                    {varCount > 1 && (
                      <div style={{ fontFamily:'JetBrains Mono', fontSize:'0.52rem', letterSpacing:'0.1em',
                        color: active ? 'rgba(224,85,64,0.7)' : 'var(--text-muted)',
                        background: active ? 'rgba(224,85,64,0.12)' : 'rgba(255,255,255,0.05)',
                        padding:'0.1rem 0.35rem', borderRadius:2,
                        flexShrink:0, whiteSpace:'nowrap' }}>
                        {varCount} systems
                      </div>
                    )}
                  </div>
                  <div style={{ fontFamily:'Montserrat', fontSize:'0.86rem', fontWeight:700,
                    color: active ? 'var(--text-primary)' : 'var(--text-secondary)', marginBottom:'0.1rem' }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize:'0.68rem', color:'var(--text-muted)', fontFamily:'JetBrains Mono', letterSpacing:'0.04em' }}>
                    {p.short}
                  </div>
                </button>
              )
            })}

            <a href="/catalogue.pdf"
              target="_blank" rel="noopener noreferrer" className="btn-primary prod-sidebar-dl"
              style={{ width:'100%', justifyContent:'center', fontSize:'0.78rem', marginTop:'1.2rem', padding:'0.85rem 1rem' }}>
              <DownloadIcon /> Download Catalogue
            </a>
          </m.div>

          {/* ── Detail Panel ── */}
          <AnimatePresence mode="wait" initial={false}>
            <m.div key={selected} className="prod-detail-wrap"
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }}
              transition={{ duration:0.4, ease:[0.16,1,0.3,1] }}>

              {/* System header */}
              <div style={{ marginBottom:'1.5rem' }}>
                <div style={{ display:'flex', gap:'0.5rem', marginBottom:'0.7rem', flexWrap:'wrap' }}>
                  <span style={{ padding:'0.2rem 0.6rem', background:'rgba(224,85,64,0.12)',
                    border:'1px solid var(--border-accent)', borderRadius:2,
                    fontFamily:'JetBrains Mono', fontSize:'0.58rem', letterSpacing:'0.12em',
                    color:'var(--sun-orange)', textTransform:'uppercase' }}>{product?.tag}</span>
                  {product?.badge && (
                    <span style={{ padding:'0.2rem 0.6rem', background:'rgba(201,212,224,0.07)',
                      border:'1px solid var(--border-subtle)', borderRadius:2,
                      fontFamily:'JetBrains Mono', fontSize:'0.58rem', letterSpacing:'0.12em',
                      color:'var(--aluminum-mid)', textTransform:'uppercase' }}>{product.badge}</span>
                  )}
                </div>
                <h2 style={{ fontSize:'clamp(1.6rem,3vw,2.4rem)', marginBottom:'0.5rem' }}>{product?.name}</h2>
                <p style={{ color:'var(--text-secondary)', fontSize:'0.9rem', lineHeight:1.7 }}>
                  {product?.systemDesc}
                </p>
                {product && <Link to={`/products/${product.slug}`} className="prod-more">Full {product.name} specifications <ArrowRightIcon /></Link>}
              </div>

              {/* ── Variant Slider ── */}
              {product && product.variants.length > 1 && (
                <VariantSlider
                  variants={product.variants}
                  selectedId={variantId ?? product.variants[0].id}
                  onSelect={setVariantId}
                />
              )}

              {/* ── 3D Canvas ── */}
              {activeVariant && (
                <AnimatePresence mode="wait" initial={false}>
                  <m.div key={activeVariant.id}
                    initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                    transition={{ duration:0.3 }}>

                    <div style={{ display:'flex', gap:'0.75rem', marginBottom:'2rem', alignItems:'stretch' }}>
                      {/* ── 3D Viewport or No-Model Placeholder ── */}
                      {displayModel ? (
                      <div className="canvas-3d" style={{
                        flex:1, height:340, position:'relative',
                        background:'radial-gradient(ellipse at 50% 70%,rgba(224,85,64,0.07) 0%,transparent 70%)',
                        border:'1px solid var(--border-subtle)', cursor:'grab',
                      }}>
                        <Model3D kind="product" model={displayModel} zoom={zoom} label={activeVariant.name} />
                        {/* Model label badge */}
                        <div style={{
                          position:'absolute', top:'1rem', left:'1rem',
                          background:'rgba(10,14,26,0.75)', backdropFilter:'blur(8px)',
                          border:'1px solid var(--border-subtle)',
                          padding:'0.35rem 0.75rem',
                          fontFamily:'JetBrains Mono', fontSize:'0.62rem', letterSpacing:'0.1em',
                          color:'var(--text-primary)',
                        }}>
                          {assemblyModel ? assemblyModel.label : activeVariant.name}
                        </div>
                        <div style={{
                          position:'absolute', bottom:'0.9rem', left:'1rem',
                          fontFamily:'JetBrains Mono', fontSize:'0.58rem', letterSpacing:'0.14em',
                          color:'var(--text-muted)', textTransform:'uppercase', pointerEvents:'none',
                        }}>↻ Drag to rotate</div>
                      </div>
                      ) : (
                      <div style={{
                        flex:1, height:340, position:'relative',
                        background:'linear-gradient(135deg,rgba(224,85,64,0.06) 0%,rgba(232,146,58,0.04) 100%)',
                        border:'1px solid var(--border-subtle)',
                        display:'flex', flexDirection:'column',
                        alignItems:'center', justifyContent:'center', gap:'1rem',
                      }}>
                        <div style={{ fontSize:'3.5rem', opacity:0.5 }}>🏗️</div>
                        <div style={{ fontFamily:'JetBrains Mono', fontSize:'0.72rem', letterSpacing:'0.18em', color:'var(--sun-orange)', textTransform:'uppercase' }}>{activeVariant.name}</div>
                        <div style={{ fontFamily:'JetBrains Mono', fontSize:'0.62rem', letterSpacing:'0.12em', color:'var(--text-muted)', textTransform:'uppercase' }}>3D Model Coming Soon</div>
                        <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem', justifyContent:'center', maxWidth:320, marginTop:'0.5rem' }}>
                          {activeVariant.specs.slice(0,4).map((s,i) => (
                            <div key={i} style={{ padding:'0.3rem 0.75rem', background:'rgba(201,212,224,0.06)', border:'1px solid var(--border-subtle)', fontFamily:'JetBrains Mono', fontSize:'0.6rem', letterSpacing:'0.08em', color:'var(--aluminum-mid)', textTransform:'uppercase', textAlign:'center' }}>
                              {s.label}: <span style={{ color:'var(--text-primary)' }}>{s.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      )}

                      {/* ── Zoom Slider (only when 3D model present) ── */}
                      {displayModel && <div className="zoom-slider" style={{
                        display:'flex', flexDirection:'column', alignItems:'center',
                        justifyContent:'center', gap:'0.5rem',
                        background:'rgba(10,14,26,0.6)', backdropFilter:'blur(8px)',
                        border:'1px solid var(--border-subtle)',
                        padding:'0.9rem 0.55rem', borderRadius:4, flexShrink:0, width:36,
                      }}>
                        <span style={{ fontFamily:'JetBrains Mono', fontSize:'0.75rem', color:'var(--sun-orange)', lineHeight:1, userSelect:'none' }}>+</span>
                        <div style={{ height:140, display:'flex', alignItems:'center', justifyContent:'center', width:20 }}>
                          <input
                            type="range" min={2} max={7} step={0.05} aria-label="Zoom 3D model"
                            value={9 - zoom}
                            onChange={e => setZoom(9 - parseFloat(e.target.value))}
                            style={{ transform:'rotate(-90deg)', width:140, cursor:'pointer', accentColor:'#E05540', margin:0 }}
                          />
                        </div>
                        <span style={{ fontFamily:'JetBrains Mono', fontSize:'0.75rem', color:'var(--text-muted)', lineHeight:1, userSelect:'none' }}>−</span>
                      </div>}
                    </div>

                    {/* ── Model view switcher (only if variant has assembly models) ── */}
                    {activeVariant.assemblyModels?.length > 0 && (
                      <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1.2rem', flexWrap:'wrap' }}>
                        <button onClick={() => setAssemblyIdx(null)} style={{
                          padding:'0.4rem 0.9rem', fontFamily:'JetBrains Mono', fontSize:'0.65rem',
                          letterSpacing:'0.1em', textTransform:'uppercase', cursor:'pointer',
                          background: assemblyIdx === null ? 'var(--gradient-sun)' : 'var(--bg-elevated)',
                          color: assemblyIdx === null ? 'var(--bg-deep)' : 'var(--text-muted)',
                          border:`1px solid ${assemblyIdx === null ? 'transparent' : 'var(--border-subtle)'}`,
                          transition:'all 0.25s',
                        }}>Base Rail</button>
                        {activeVariant.assemblyModels.map((m, i) => (
                          <button key={i} onClick={() => setAssemblyIdx(i)} style={{
                            padding:'0.4rem 0.9rem', fontFamily:'JetBrains Mono', fontSize:'0.65rem',
                            letterSpacing:'0.1em', textTransform:'uppercase', cursor:'pointer',
                            background: assemblyIdx === i ? 'var(--gradient-sun)' : 'var(--bg-elevated)',
                            color: assemblyIdx === i ? 'var(--bg-deep)' : 'var(--text-muted)',
                            border:`1px solid ${assemblyIdx === i ? 'transparent' : 'var(--border-subtle)'}`,
                            transition:'all 0.25s',
                          }}>{m.label}</button>
                        ))}
                      </div>
                    )}

                    {/* Variant tagline + description */}
                    <div style={{ marginBottom:'2rem' }}>
                      <p style={{ fontSize:'0.95rem', color:'var(--sun-yellow)', fontFamily:'JetBrains Mono',
                        letterSpacing:'0.03em', marginBottom:'0.75rem', lineHeight:1.5 }}>
                        {activeVariant.tagline}
                      </p>
                      <p style={{ color:'var(--text-secondary)', fontSize:'0.9rem', lineHeight:1.85,
                        borderLeft:'2px solid var(--border-accent)', paddingLeft:'1.1rem' }}>
                        {activeVariant.desc}
                      </p>
                    </div>

                    {/* Specs + Highlights */}
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2rem' }} className="prod-detail-grid">
                      <div>
                        <h3 style={{ fontFamily:'JetBrains Mono', fontSize:'0.68rem', letterSpacing:'0.2em',
                          color:'var(--aluminum-mid)', textTransform:'uppercase', marginBottom:'0.9rem' }}>
                          // Technical Specifications
                        </h3>
                        <div>
                          {activeVariant.specs.map((s, i) => (
                            <div key={i} style={{
                              display:'flex', justifyContent:'space-between', gap:'1rem',
                              padding:'0.6rem 0.85rem',
                              background: i % 2 === 0 ? 'var(--bg-elevated)' : 'transparent',
                              border:'1px solid var(--border-subtle)',
                              borderTop: i === 0 ? '1px solid var(--border-subtle)' : 'none',
                            }}>
                              <span style={{ fontFamily:'JetBrains Mono', fontSize:'0.66rem', letterSpacing:'0.06em',
                                color:'var(--text-muted)', whiteSpace:'nowrap' }}>{s.label}</span>
                              <span style={{ fontSize:'0.78rem', color:'var(--text-primary)', fontWeight:600, textAlign:'right' }}>
                                {s.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 style={{ fontFamily:'JetBrains Mono', fontSize:'0.68rem', letterSpacing:'0.2em',
                          color:'var(--aluminum-mid)', textTransform:'uppercase', marginBottom:'0.9rem' }}>
                          // Key Highlights
                        </h3>
                        <div style={{ display:'flex', flexDirection:'column', gap:'0.48rem', marginBottom:'1.8rem' }}>
                          {activeVariant.highlights.map((h, i) => (
                            <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'0.65rem',
                              fontSize:'0.84rem', color:'var(--text-secondary)' }}>
                              <div style={{ width:5, height:5, background:'var(--sun-orange)', marginTop:5, flexShrink:0 }} />
                              {h}
                            </div>
                          ))}
                        </div>

                        <h3 style={{ fontFamily:'JetBrains Mono', fontSize:'0.68rem', letterSpacing:'0.2em',
                          color:'var(--aluminum-mid)', textTransform:'uppercase', marginBottom:'0.65rem' }}>
                          // Ideal Applications
                        </h3>
                        <div style={{ display:'flex', gap:'0.45rem', flexWrap:'wrap' }}>
                          {activeVariant.applications.map(app => (
                            <span key={app} style={{
                              padding:'0.28rem 0.7rem',
                              background:'rgba(201,212,224,0.06)', border:'1px solid var(--border-subtle)',
                              fontFamily:'JetBrains Mono', fontSize:'0.62rem', letterSpacing:'0.08em',
                              color:'var(--aluminum-mid)', textTransform:'uppercase',
                            }}>{app}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* CTAs */}
                    <div style={{ display:'flex', gap:'1rem', marginTop:'2.5rem', paddingTop:'2rem',
                      borderTop:'1px solid var(--border-subtle)', flexWrap:'wrap' }}>
                      <Link to="/contact" className="btn-primary" style={{ fontSize:'0.88rem' }}>
                        Request a Quote <ArrowRightIcon />
                      </Link>
                      <a href="/catalogue.pdf"
                        target="_blank" rel="noopener noreferrer"
                        className="btn-secondary" style={{ fontSize:'0.88rem' }}>
                        <DownloadIcon /> Download Full Catalogue
                      </a>
                    </div>
                  </m.div>
                </AnimatePresence>
              )}
            </m.div>
          </AnimatePresence>
        </div>
      </div>

      </div>{/* end desktop-products-layout */}

      {/* ── MOBILE LAYOUT ── */}
      <div className="mobile-products-layout">

        {/* System Pills */}
        <div style={{ overflowX:'auto', scrollbarWidth:'none', WebkitOverflowScrolling:'touch' }}>
          <div style={{ display:'flex', gap:'0.5rem', padding:'1.2rem 1rem 0.5rem', width:'max-content' }}>
            {PRODUCTS.map((p) => {
              const active = p.id === selected
              return (
                <button key={p.id} onClick={() => setSelected(p.id)} style={{
                  padding:'0.55rem 1.1rem', borderRadius:'2rem',
                  border:`1px solid ${active ? 'var(--sun-orange)' : 'var(--border-subtle)'}`,
                  background: active ? 'var(--gradient-sun)' : 'var(--bg-elevated)',
                  color: active ? 'var(--bg-deep)' : 'var(--text-secondary)',
                  fontFamily:'Montserrat', fontSize:'0.75rem', fontWeight:700,
                  whiteSpace:'nowrap', cursor:'pointer', transition:'all 0.25s',
                }}>{p.name}</button>
              )
            })}
          </div>
        </div>

        {/* System Info */}
        <div style={{ padding:'1.2rem 1rem 0' }}>
          <div style={{ display:'flex', gap:'0.4rem', marginBottom:'0.6rem', flexWrap:'wrap' }}>
            <span style={{ padding:'0.2rem 0.6rem', background:'rgba(224,85,64,0.12)', border:'1px solid var(--border-accent)', fontFamily:'JetBrains Mono', fontSize:'0.58rem', letterSpacing:'0.12em', color:'var(--sun-orange)', textTransform:'uppercase' }}>{product?.tag}</span>
            {product?.badge && <span style={{ padding:'0.2rem 0.6rem', background:'rgba(201,212,224,0.07)', border:'1px solid var(--border-subtle)', fontFamily:'JetBrains Mono', fontSize:'0.58rem', letterSpacing:'0.12em', color:'var(--aluminum-mid)', textTransform:'uppercase' }}>{product.badge}</span>}
          </div>
          <h2 style={{ fontSize:'1.8rem', marginBottom:'0.6rem' }}>{product?.name}</h2>
          <p style={{ color:'var(--text-secondary)', fontSize:'0.95rem', lineHeight:1.75 }}>{product?.systemDesc}</p>
          {product && <Link to={`/products/${product.slug}`} className="prod-more">Full {product.name} specifications <ArrowRightIcon /></Link>}
        </div>

        {/* Variant Pills */}
        {product && product.variants.length > 1 && (
          <div style={{ overflowX:'auto', scrollbarWidth:'none', WebkitOverflowScrolling:'touch', marginTop:'1.2rem' }}>
            <div style={{ display:'flex', gap:'0.45rem', padding:'0 1rem', width:'max-content' }}>
              {product.variants.map((v) => {
                const active = v.id === (variantId ?? product.variants[0].id)
                return (
                  <button key={v.id} onClick={() => setVariantId(v.id)} style={{
                    padding:'0.5rem 0.9rem',
                    border:`1px solid ${active ? 'var(--sun-orange)' : 'var(--border-subtle)'}`,
                    borderTop:`2px solid ${active ? 'var(--sun-orange)' : 'transparent'}`,
                    background: active ? 'rgba(224,85,64,0.13)' : 'var(--bg-elevated)',
                    color: active ? 'var(--sun-orange)' : 'var(--text-muted)',
                    fontFamily:'Montserrat', fontSize:'0.72rem', fontWeight:700,
                    whiteSpace:'nowrap', cursor:'pointer', transition:'all 0.25s',
                  }}>{v.name}</button>
                )
              })}
            </div>
          </div>
        )}

        {/* 3D Canvas — full width with margins */}
        {activeVariant && (
          <AnimatePresence mode="wait" initial={false}>
            <m.div key={activeVariant.id} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.3}}>
              {displayModel ? (
              <div style={{ margin:'1.2rem 1rem 0', position:'relative', height:300, border:'1px solid var(--border-subtle)', background:'radial-gradient(ellipse at 50% 70%,rgba(224,85,64,0.07) 0%,transparent 70%)', overflow:'hidden' }}>
                <Model3D kind="product" model={displayModel} zoom={zoom} label={activeVariant.name} />
                <div style={{ position:'absolute', top:'0.75rem', left:'0.75rem', background:'rgba(10,14,26,0.8)', backdropFilter:'blur(8px)', border:'1px solid var(--border-subtle)', padding:'0.3rem 0.65rem', fontFamily:'JetBrains Mono', fontSize:'0.6rem', letterSpacing:'0.1em', color:'var(--text-primary)' }}>
                  {assemblyModel ? assemblyModel.label : activeVariant.name}
                </div>
                <div style={{ position:'absolute', bottom:'0.7rem', left:'0.75rem', fontFamily:'JetBrains Mono', fontSize:'0.55rem', letterSpacing:'0.14em', color:'var(--text-muted)', pointerEvents:'none', textTransform:'uppercase' }}>↻ Drag to rotate</div>
              </div>
              ) : (
              <div style={{ margin:'1.2rem 1rem 0', height:240, border:'1px solid var(--border-subtle)', background:'linear-gradient(135deg,rgba(224,85,64,0.06) 0%,rgba(232,146,58,0.04) 100%)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'0.75rem' }}>
                <div style={{ fontSize:'2.8rem', opacity:0.5 }}>🏗️</div>
                <div style={{ fontFamily:'JetBrains Mono', fontSize:'0.7rem', letterSpacing:'0.15em', color:'var(--sun-orange)', textTransform:'uppercase' }}>{activeVariant.name}</div>
                <div style={{ fontFamily:'JetBrains Mono', fontSize:'0.6rem', letterSpacing:'0.1em', color:'var(--text-muted)', textTransform:'uppercase' }}>3D Model Coming Soon</div>
              </div>
              )}

              {/* Mobile model switcher */}
              {activeVariant.assemblyModels?.length > 0 && (
                <div style={{ display:'flex', gap:'0.45rem', padding:'0.9rem 1rem 0', flexWrap:'wrap' }}>
                  <button onClick={() => setAssemblyIdx(null)} style={{ padding:'0.38rem 0.8rem', fontFamily:'JetBrains Mono', fontSize:'0.62rem', letterSpacing:'0.1em', textTransform:'uppercase', cursor:'pointer', background: assemblyIdx === null ? 'var(--gradient-sun)' : 'var(--bg-elevated)', color: assemblyIdx === null ? 'var(--bg-deep)' : 'var(--text-muted)', border:`1px solid ${assemblyIdx === null ? 'transparent' : 'var(--border-subtle)'}`, transition:'all 0.25s' }}>Base Rail</button>
                  {activeVariant.assemblyModels.map((m, i) => (
                    <button key={i} onClick={() => setAssemblyIdx(i)} style={{ padding:'0.38rem 0.8rem', fontFamily:'JetBrains Mono', fontSize:'0.62rem', letterSpacing:'0.1em', textTransform:'uppercase', cursor:'pointer', background: assemblyIdx === i ? 'var(--gradient-sun)' : 'var(--bg-elevated)', color: assemblyIdx === i ? 'var(--bg-deep)' : 'var(--text-muted)', border:`1px solid ${assemblyIdx === i ? 'transparent' : 'var(--border-subtle)'}`, transition:'all 0.25s' }}>{m.label}</button>
                  ))}
                </div>
              )}

              {/* Detail */}
              <div style={{ padding:'1.2rem 1rem 2rem' }}>
                <p style={{ fontSize:'0.96rem', color:'var(--sun-yellow)', fontFamily:'JetBrains Mono', letterSpacing:'0.03em', marginBottom:'0.9rem', lineHeight:1.6 }}>{activeVariant.tagline}</p>
                <p style={{ color:'var(--text-secondary)', fontSize:'0.93rem', lineHeight:1.85, borderLeft:'2px solid var(--border-accent)', paddingLeft:'1rem', marginBottom:'1.8rem' }}>{activeVariant.desc}</p>

                <h3 style={{ fontFamily:'JetBrains Mono', fontSize:'0.7rem', letterSpacing:'0.2em', color:'var(--aluminum-mid)', textTransform:'uppercase', marginBottom:'0.75rem' }}>// Technical Specifications</h3>
                <div style={{ marginBottom:'1.8rem' }}>
                  {activeVariant.specs.map((s, i) => (
                    <div key={i} style={{ display:'flex', justifyContent:'space-between', gap:'1rem', padding:'0.65rem 0.85rem', background:i%2===0?'var(--bg-elevated)':'transparent', border:'1px solid var(--border-subtle)', borderTop:i===0?'1px solid var(--border-subtle)':'none' }}>
                      <span style={{ fontFamily:'JetBrains Mono', fontSize:'0.7rem', letterSpacing:'0.06em', color:'var(--text-muted)', whiteSpace:'nowrap' }}>{s.label}</span>
                      <span style={{ fontSize:'0.82rem', color:'var(--text-primary)', fontWeight:600, textAlign:'right' }}>{s.value}</span>
                    </div>
                  ))}
                </div>

                <h3 style={{ fontFamily:'JetBrains Mono', fontSize:'0.7rem', letterSpacing:'0.2em', color:'var(--aluminum-mid)', textTransform:'uppercase', marginBottom:'0.65rem' }}>// Key Highlights</h3>
                <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem', marginBottom:'1.8rem' }}>
                  {activeVariant.highlights.map((h, i) => (
                    <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'0.6rem', fontSize:'0.92rem', color:'var(--text-secondary)' }}>
                      <div style={{ width:5, height:5, background:'var(--sun-orange)', marginTop:6, flexShrink:0 }} />
                      {h}
                    </div>
                  ))}
                </div>

                <h3 style={{ fontFamily:'JetBrains Mono', fontSize:'0.7rem', letterSpacing:'0.2em', color:'var(--aluminum-mid)', textTransform:'uppercase', marginBottom:'0.6rem' }}>// Ideal Applications</h3>
                <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap', marginBottom:'2rem' }}>
                  {activeVariant.applications.map(app => (
                    <span key={app} style={{ padding:'0.3rem 0.75rem', background:'rgba(201,212,224,0.06)', border:'1px solid var(--border-subtle)', fontFamily:'JetBrains Mono', fontSize:'0.68rem', letterSpacing:'0.08em', color:'var(--aluminum-mid)', textTransform:'uppercase' }}>{app}</span>
                  ))}
                </div>

                <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem', paddingTop:'1.5rem', borderTop:'1px solid var(--border-subtle)' }}>
                  <Link to="/contact" className="btn-primary" style={{ justifyContent:'center', fontSize:'0.85rem' }}>Request a Quote <ArrowRightIcon /></Link>
                  <a href="/catalogue.pdf" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ justifyContent:'center', fontSize:'0.85rem' }}><DownloadIcon /> Download Catalogue</a>
                </div>
              </div>
            </m.div>
          </AnimatePresence>
        )}
      </div>{/* end mobile-products-layout */}

      {/* ── Responsive overrides ── */}
      <style>{`
        /* Desktop shows desktop, hides mobile */
        .desktop-products-layout { display:block; }
        .mobile-products-layout  { display:none; }

        /* Tablet: collapse sidebar to horizontal scroll */
        @media(max-width:980px) {
          .prod-layout { grid-template-columns:1fr !important; padding:1.5rem 1rem !important; }
          .prod-layout > div:first-child { position:static !important; display:flex !important; flex-wrap:nowrap !important; overflow-x:auto; gap:0.5rem; padding-bottom:0.5rem; scrollbar-width:none; }
          .prod-layout > div:first-child::-webkit-scrollbar { display:none; }
          .prod-layout > div:first-child button { width:auto !important; flex-shrink:0 !important; min-width:138px !important; max-width:170px !important; }
          .prod-sidebar-dl { display:none !important; }
          .prod-detail-grid { grid-template-columns:1fr !important; }
          .acc-grid { grid-template-columns:repeat(2,1fr) !important; }
        }

        /* Phone: swap to mobile layout entirely */
          .prod-pages { display:flex; flex-wrap:wrap; gap:0.5rem; margin-top:1.2rem; }
          .prod-pages a { font-family:'JetBrains Mono'; font-size:0.68rem; letter-spacing:0.08em; text-transform:uppercase; padding:0.4rem 0.75rem; border:1px solid var(--border-subtle); color:var(--text-secondary); transition:border-color .3s, color .3s; }
          .prod-pages a:hover { border-color:var(--border-accent); color:var(--sun-orange); }
          .prod-more { display:inline-flex; align-items:center; gap:0.5rem; margin-top:0.9rem; font-family:'JetBrains Mono'; font-size:0.72rem; letter-spacing:0.08em; text-transform:uppercase; color:var(--sun-orange); }
        @media(max-width:768px) {
          .desktop-products-layout { display:none !important; }
          .mobile-products-layout  { display:block !important; }
          /* Header */
          .prod-header { padding:1.5rem 0 1.2rem !important; }
          .prod-h1  { max-width:100% !important; font-size:clamp(1.7rem,5vw,2.2rem) !important; }
          .prod-subp{ max-width:100% !important; font-size:0.93rem !important; }
          /* Accessories full-width */
          .acc-section .container { padding:0 !important; }
          .acc-section h2 { padding:0 1rem; font-size:1.6rem !important; }
          .acc-section > div > div:first-child { padding:0 1rem; }
          .acc-grid { padding:0 1rem 0 !important; gap:0.85rem !important; }
          .acc-card { padding:1.2rem 1rem !important; }
        }
        @media(max-width:480px) {
          .acc-grid { grid-template-columns:1fr !important; }
        }
        ::-webkit-scrollbar { display:none; }
      `}</style>

      {/* ── ACCESSORIES SECTION ── */}
      <section className="acc-section" style={{ background:'var(--bg-deep)', borderTop:'1px solid var(--border-subtle)', padding:'4rem 0 5rem' }}>
        <div className="container">
          <m.div
            initial={{ opacity:0, y:28 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true, margin:'-80px' }}
            transition={{ duration:0.7, ease:[0.16,1,0.3,1] }}
            style={{ textAlign:'center', maxWidth:640, margin:'0 auto 3rem' }}>
            <div className="section-label" style={{ display:'inline-flex' }}>ACCESSORIES &amp; HARDWARE</div>
            <h2 style={{ fontSize:'clamp(1.9rem,3.5vw,2.8rem)', marginBottom:'1rem' }}>
              Complete the System with <span className="gradient-text">Certified Hardware</span>
            </h2>
            <p style={{ color:'var(--text-secondary)', fontSize:'0.95rem', lineHeight:1.7 }}>
              High-grade Aluminium 6063 T6 and SS 304 stainless steel accessories — designed to pair with every SunMount rail system.
            </p>
          </m.div>

          <m.div
            initial="hidden" whileInView="show" viewport={{ once:true, margin:'-60px' }}
            variants={{ hidden:{}, show:{ transition:{ staggerChildren:0.06 } } }}
            className="acc-grid"
            style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.4rem' }}>
            {ACCESSORIES.map((acc, i) => (
              <m.div key={acc.name}
                variants={{ hidden:{opacity:0,y:24}, show:{opacity:1,y:0,transition:{duration:0.55,ease:[0.16,1,0.3,1]}} }}
                className="acc-card"
                style={{
                  padding:'1.8rem 1.6rem',
                  background:'linear-gradient(180deg,var(--bg-elevated) 0%,var(--bg-surface) 100%)',
                  border:'1px solid var(--border-subtle)',
                  position:'relative', overflow:'hidden',
                  transition:'all 0.4s cubic-bezier(0.16,1,0.3,1)',
                  display:'flex', flexDirection:'column',
                }}>
                <div className="acc-line" style={{ position:'absolute', top:0, left:0, height:2, width:0,
                  background:'var(--gradient-sun)', transition:'width 0.5s cubic-bezier(0.16,1,0.3,1)' }} />
                <div style={{ fontFamily:'JetBrains Mono', fontSize:'0.6rem', letterSpacing:'0.15em',
                  color:'var(--text-muted)', marginBottom:'1rem' }}>
                  / {String(i + 1).padStart(2, '0')}
                </div>
                <div style={{ width:110, height:110, marginBottom:'1.2rem', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <img src={acc.image} alt={`${acc.name} — ${acc.material} solar mounting accessory`}
                    width={100} height={100} loading="lazy" decoding="async"
                    style={{ width:100, height:100, objectFit:'contain', filter:'drop-shadow(0 3px 10px rgba(0,0,0,0.5))' }} />
                </div>
                <h3 style={{ fontSize:'1.05rem', fontWeight:800, letterSpacing:'0.02em', marginBottom:'0.4rem', color:'var(--text-primary)' }}>
                  {acc.name}
                </h3>
                <div style={{ fontFamily:'JetBrains Mono', fontSize:'0.65rem', letterSpacing:'0.08em',
                  color:'var(--sun-orange)', marginBottom:'1rem' }}>
                  {acc.material}
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:'0.4rem', marginTop:'auto' }}>
                  {acc.features.map((f, fi) => (
                    <div key={fi} style={{ display:'flex', alignItems:'flex-start', gap:'0.5rem', fontSize:'0.82rem', color:'var(--text-muted)' }}>
                      <div style={{ width:4, height:4, background:'var(--aluminum-dark)', marginTop:6, flexShrink:0 }} />
                      {f}
                    </div>
                  ))}
                </div>
              </m.div>
            ))}
          </m.div>
        </div>
        <style>{`
          .acc-card:hover { border-color:var(--border-accent) !important; transform:translateY(-4px); }
          .acc-card:hover .acc-line { width:100% !important; }
        `}</style>
      </section>
    </main>
  )
}
