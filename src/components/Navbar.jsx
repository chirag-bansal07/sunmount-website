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
    { to: '/',          label: 'Home' },
    { to: '/#products', label: 'Products' },
    { to: '/#why',      label: 'Why Sunmount' },
    { to: '/#team',     label: 'Team' },
    { to: '/contact',   label: 'Contact Us' },
  ]

  const badges = [
    { Icon: MadeInIndiaIcon, label: 'Made in India' },
    { Icon: ISOIcon,         label: 'ISO Certified' },
    { Icon: TUVIcon,         label: 'TÜV Certified' },
    { Icon: MSMEIcon,        label: 'MSME Registered' },
  ]

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        padding: scrolled ? '0.6rem 0' : '1rem 0',
        background: scrolled ? 'rgba(6,9,18,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border-subtle)' : '1px solid transparent',
        transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
      }}>
        <div className="container" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1.5rem' }}>

          {/* LOGO — real image */}
          <Link to="/" style={{ display:'flex', alignItems:'center', flexShrink:0 }}>
            <img
              src="/logo.png"
              alt="SunMount Solar Mounting Solutions"
              style={{
                height: scrolled ? 38 : 46,
                width: 'auto',
                transition: 'height 0.4s cubic-bezier(0.16,1,0.3,1)',
                filter: 'drop-shadow(0 0 12px rgba(224,85,64,0.25))',
              }}
            />
          </Link>

          {/* DESKTOP NAV */}
          <div className="nav-desktop" style={{ display:'flex', gap:'2rem', alignItems:'center' }}>
            {navLinks.map(link => {
              const isActive = location.pathname === link.to.split('#')[0] && !link.to.includes('#')
              return (
                <Link key={link.label} to={link.to} className="nav-link" style={{
                  fontFamily: 'Montserrat', fontSize:'0.82rem', fontWeight:600,
                  letterSpacing:'0.08em', textTransform:'uppercase',
                  color: isActive ? 'var(--sun-orange)' : 'var(--text-secondary)',
                  position:'relative', padding:'0.4rem 0',
                }}>{link.label}</Link>
              )
            })}
          </div>

          {/* TRUST BADGES */}
          <div className="trust-badges" style={{ display:'flex', gap:'0.65rem', alignItems:'center', color:'var(--aluminum-mid)' }}>
            {badges.map(({ Icon, label }, i) => (
              <div key={i} title={label} style={{ transition:'color 0.3s, transform 0.3s', cursor:'help' }}
                onMouseEnter={e => { e.currentTarget.style.color='var(--sun-orange)'; e.currentTarget.style.transform='translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.color='var(--aluminum-mid)'; e.currentTarget.style.transform='translateY(0)' }}>
                <Icon />
              </div>
            ))}
          </div>

          {/* MOBILE TOGGLE */}
          <button className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}
            style={{ display:'none', width:32, height:32, flexDirection:'column', justifyContent:'center', gap:'5px' }}
            aria-label="Menu">
            <span style={{ width:22, height:2, background:'var(--text-primary)', transition:'transform 0.3s', display:'block', transform: menuOpen ? 'rotate(45deg) translate(5px,5px)' : 'none' }} />
            <span style={{ width:22, height:2, background:'var(--text-primary)', opacity: menuOpen ? 0 : 1, transition:'opacity 0.3s', display:'block' }} />
            <span style={{ width:22, height:2, background:'var(--text-primary)', transition:'transform 0.3s', display:'block', transform: menuOpen ? 'rotate(-45deg) translate(5px,-5px)' : 'none' }} />
          </button>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div style={{
            position:'absolute', top:'100%', left:0, right:0,
            background:'rgba(6,9,18,0.98)', backdropFilter:'blur(20px)',
            padding:'2rem', display:'flex', flexDirection:'column', gap:'1.2rem',
            borderBottom:'1px solid var(--border-subtle)',
          }}>
            {navLinks.map(link => (
              <Link key={link.label} to={link.to} onClick={() => setMenuOpen(false)}
                style={{ fontSize:'1.1rem', fontWeight:600, color:'var(--text-primary)' }}>
                {link.label}
              </Link>
            ))}
            <div style={{ display:'flex', gap:'1rem', marginTop:'1rem', color:'var(--aluminum-mid)' }}>
              {badges.map(({ Icon, label }, i) => <div key={i} title={label}><Icon /></div>)}
            </div>
          </div>
        )}
      </nav>

      <style>{`
        .nav-link::after{content:'';position:absolute;left:0;bottom:0;width:100%;height:1px;
          background:var(--sun-orange);transform:scaleX(0);transform-origin:right;
          transition:transform 0.4s cubic-bezier(0.16,1,0.3,1)}
        .nav-link:hover{color:var(--sun-orange)!important;text-shadow:0 0 20px rgba(224,85,64,0.5)}
        .nav-link:hover::after{transform:scaleX(1);transform-origin:left}
        @media(max-width:1100px){.trust-badges{display:none!important}}
        @media(max-width:900px){.nav-desktop{display:none!important}.mobile-toggle{display:flex!important}}
      `}</style>
    </>
  )
}

export default Navbar
