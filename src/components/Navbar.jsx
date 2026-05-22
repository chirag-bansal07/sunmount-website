import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { MadeInIndiaIcon, ISOIcon, TUVIcon, MSMEIcon } from './icons'

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { to: '/', label: 'Home', hash: '' },
    { to: '/#products', label: 'Products' },
    { to: '/#why', label: 'Why Sunmount' },
    { to: '/#team', label: 'Team' },
    { to: '/contact', label: 'Contact Us' },
  ]

  const badges = [
    { Icon: MadeInIndiaIcon, label: 'Made in India' },
    { Icon: ISOIcon, label: 'ISO Certified' },
    { Icon: TUVIcon, label: 'TÜV Certified' },
    { Icon: MSMEIcon, label: 'MSME Registered' },
  ]

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 1000,
        padding: scrolled ? '0.85rem 0' : '1.25rem 0',
        background: scrolled ? 'rgba(6, 9, 18, 0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border-subtle)' : '1px solid transparent',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '2rem',
        }}>
          {/* LOGO */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 42, height: 42,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {/* Sun rays */}
              <svg width="42" height="42" viewBox="0 0 42 42" fill="none" style={{ position: 'absolute', inset: 0 }}>
                <circle cx="21" cy="21" r="9" fill="url(#sun-gradient)" />
                {Array.from({ length: 8 }).map((_, i) => {
                  const angle = (i * Math.PI) / 4
                  const x1 = 21 + Math.cos(angle) * 12
                  const y1 = 21 + Math.sin(angle) * 12
                  const x2 = 21 + Math.cos(angle) * 18
                  const y2 = 21 + Math.sin(angle) * 18
                  return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FF6B1A" strokeWidth="2" strokeLinecap="round" />
                })}
                <defs>
                  <linearGradient id="sun-gradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FBB034" />
                    <stop offset="100%" stopColor="#FF6B1A" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div>
              <div style={{
                fontFamily: 'Montserrat',
                fontWeight: 900,
                fontSize: '1.35rem',
                letterSpacing: '-0.02em',
                lineHeight: 1,
                color: 'var(--text-primary)',
              }}>
                SUN<span style={{ color: 'var(--sun-orange)' }}>MOUNT</span>
                <span style={{ fontSize: '0.7rem', verticalAlign: 'super', color: 'var(--text-muted)' }}>®</span>
              </div>
              <div style={{
                fontFamily: 'JetBrains Mono',
                fontSize: '0.6rem',
                letterSpacing: '0.2em',
                color: 'var(--text-muted)',
                marginTop: '2px',
                textTransform: 'uppercase',
              }}>
                Solar Mounting Solutions
              </div>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <div className="nav-desktop" style={{
            display: 'flex',
            gap: '2.2rem',
            alignItems: 'center',
          }}>
            {navLinks.map(link => {
              const isActive = link.to === location.pathname
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  className="nav-link"
                  style={{
                    fontFamily: 'Montserrat',
                    fontSize: '0.82rem',
                    fontWeight: 500,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: isActive ? 'var(--sun-orange)' : 'var(--text-secondary)',
                    position: 'relative',
                    padding: '0.4rem 0',
                  }}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* TRUST BADGES */}
          <div className="trust-badges" style={{
            display: 'flex',
            gap: '0.65rem',
            alignItems: 'center',
            color: 'var(--aluminum-mid)',
          }}>
            {badges.map(({ Icon, label }, i) => (
              <div
                key={i}
                title={label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'color 0.3s, transform 0.3s',
                  cursor: 'help',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--sun-orange)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--aluminum-mid)'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <Icon />
              </div>
            ))}
          </div>

          {/* MOBILE MENU TOGGLE */}
          <button
            className="mobile-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: 'none',
              width: 32, height: 32,
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '5px',
            }}
            aria-label="Menu"
          >
            <span style={{ width: 22, height: 2, background: 'var(--text-primary)', transition: 'transform 0.3s', transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
            <span style={{ width: 22, height: 2, background: 'var(--text-primary)', opacity: menuOpen ? 0 : 1, transition: 'opacity 0.3s' }} />
            <span style={{ width: 22, height: 2, background: 'var(--text-primary)', transition: 'transform 0.3s', transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
          </button>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="mobile-menu" style={{
            position: 'absolute',
            top: '100%', left: 0, right: 0,
            background: 'rgba(6, 9, 18, 0.98)',
            backdropFilter: 'blur(20px)',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.2rem',
            borderBottom: '1px solid var(--border-subtle)',
          }}>
            {navLinks.map(link => (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  color: 'var(--text-primary)',
                }}
              >
                {link.label}
              </Link>
            ))}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', color: 'var(--aluminum-mid)' }}>
              {badges.map(({ Icon, label }, i) => <div key={i} title={label}><Icon /></div>)}
            </div>
          </div>
        )}
      </nav>

      <style>{`
        .nav-link::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 1px;
          background: var(--sun-orange);
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .nav-link:hover {
          color: var(--sun-orange) !important;
          text-shadow: 0 0 20px rgba(255, 107, 26, 0.5);
        }
        .nav-link:hover::after {
          transform: scaleX(1);
          transform-origin: left;
        }
        @media (max-width: 1100px) {
          .trust-badges { display: none !important; }
        }
        @media (max-width: 900px) {
          .nav-desktop { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
      `}</style>
    </>
  )
}

export default Navbar
