import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'

const BADGES = [
  { src: '/badge-makeindia.webp', alt: 'Make in India',      title: 'Made in India',      extraH: 0, w: 200, h: 91  },
  { src: '/badge-iso.webp',       alt: 'ISO 9001 Certified', title: 'ISO 9001 Certified', extraH: 0, w: 200, h: 200 },
  { src: '/badge-tuv.webp',       alt: 'TÜV SÜD Certified', title: 'TÜV SÜD Certified',  extraH: 0, w: 200, h: 200 },
  { src: '/badge-msme.webp',      alt: 'MSME Registered',    title: 'MSME Registered',    extraH: 0, w: 180, h: 88  },
]

const NAV_LINKS = [
  { to: '/',         label: 'Home'          },
  { to: '/products', label: 'Products'      },
  { to: '/#why',     label: 'Why Sunmount'  },
  { to: '/#team',    label: 'Team'          },
  { to: '/contact',  label: 'Contact Us'    },
  { to: '/careers',  label: 'Careers'       },
]

const Navbar = () => {
  const [scrolled,  setScrolled]  = useState(false)
  const location                  = useLocation()
  // The menu is "open at" a location entry, so any navigation closes it.
  const [openAt,    setOpenAt]    = useState(null)
  const menuOpen                  = openAt === location.key
  const setMenuOpen               = open => setOpenAt(open ? location.key : null)
  const toggleRef                 = useRef(null)

  // Escape closes the mobile menu and returns focus to the toggle
  useEffect(() => {
    if (!menuOpen) return
    const onKey = e => {
      if (e.key === 'Escape') { setOpenAt(null); toggleRef.current?.focus() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const logoH  = scrolled ? 40 : 60
  const badgeH = scrolled ? 44 : 56

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        padding: scrolled ? '0.4rem 0' : '0.6rem 0',
        background: scrolled ? 'rgba(6,9,18,0.97)' : 'rgba(6,9,18,0.92)',
        backdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: scrolled ? '1px solid var(--border-subtle)' : '1px solid rgba(255,255,255,0.06)',
        transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
      }}>

        {/* ── Full-width inner row ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem',
          gap: '2rem',
          width: '100%',
          boxSizing: 'border-box',
        }}>

          {/* ── SUNMOUNT LOGO — far left ── */}
          <Link to="/" style={{ display:'flex', alignItems:'center', flexShrink:0 }} aria-label="SunMount — home">
            <picture>
              <source srcSet="/logo.webp" type="image/webp" />
              <img
                src="/logo.png"
                alt="SunMount Solar Mounting Solutions logo"
                width="600" height="150"
                style={{
                  height: logoH,
                  width: 'auto',
                  transition: 'height 0.4s cubic-bezier(0.16,1,0.3,1)',
                }}
              />
            </picture>
          </Link>

          {/* ── DESKTOP NAV — centred ── */}
          <div
            className="nav-desktop"
            style={{
              display: 'flex',
              gap: '2.8rem',
              alignItems: 'center',
              flex: 1,
              justifyContent: 'center',
              whiteSpace: 'nowrap',
            }}
          >
            {NAV_LINKS.map(link => {
              const active = location.pathname === link.to.split('#')[0] && !link.to.includes('#')
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  className="nav-link"
                  style={{
                    fontFamily:"'Montserrat', 'Montserrat Fallback', sans-serif",
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    letterSpacing: '0.07em',
                    textTransform: 'uppercase',
                    color: active ? 'var(--sun-orange)' : 'var(--text-secondary)',
                    position: 'relative',
                    padding: '0.4rem 0',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* ── TRUST BADGES — far right ── */}
          <div
            className="trust-badges"
            style={{ display:'flex', gap:'1.4rem', alignItems:'center', flexShrink:0 }}
          >
            {BADGES.map(({ src, alt, title, extraH, w, h }) => (
              <img
                key={alt}
                src={src}
                alt={alt}
                title={title}
                width={w} height={h}
                style={{
                  height: badgeH + extraH,
                  width: 'auto',
                  objectFit: 'contain',
                  display: 'block',
                  cursor: 'help',
                  transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1)',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.1)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none' }}
              />
            ))}
          </div>

          {/* ── MOBILE TOGGLE ── */}
          <button
            ref={toggleRef}
            type="button"
            className="mobile-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            style={{
              display: 'none', flexDirection: 'column', justifyContent: 'center',
              gap: 5, width: 32, height: 32, background: 'none', border: 'none', cursor: 'pointer',
            }}
          >
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                display: 'block', width: 22, height: 2, background: 'var(--text-primary)',
                transition: 'all 0.3s',
                transform: menuOpen
                  ? i === 0 ? 'rotate(45deg) translate(5px,5px)'
                  : i === 2 ? 'rotate(-45deg) translate(5px,-5px)' : 'scaleX(0)'
                  : 'none',
                opacity: menuOpen && i === 1 ? 0 : 1,
              }} />
            ))}
          </button>
        </div>

        {/* ── MOBILE MENU ── */}
        {menuOpen && (
          <div id="mobile-menu" style={{
            position: 'absolute', top: '100%', left: 0, right: 0,
            background: 'rgba(6,9,18,0.98)', backdropFilter: 'blur(20px)',
            padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.2rem',
            borderBottom: '1px solid var(--border-subtle)',
          }}>
            {NAV_LINKS.map(l => (
              <Link
                key={l.label}
                to={l.to}
                onClick={() => setMenuOpen(false)}
                style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      <style>{`
        .nav-link::after {
          content: ''; position: absolute; left: 0; bottom: 0;
          width: 100%; height: 1px; background: var(--sun-orange);
          transform: scaleX(0); transform-origin: right;
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .nav-link:hover { color: var(--sun-orange)!important; text-shadow: 0 0 20px rgba(224,85,64,0.5); }
        .nav-link:hover::after { transform: scaleX(1); transform-origin: left; }
        @media(max-width:1100px) { .trust-badges { display:none!important; } }
        @media(max-width:900px)  { .nav-desktop  { display:none!important; } .mobile-toggle { display:flex!important; } }
      `}</style>
    </>
  )
}

export default Navbar
