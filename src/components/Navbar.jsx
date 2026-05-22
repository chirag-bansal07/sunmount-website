import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/products', label: 'Products' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      padding: '1rem 2rem',
      background: scrolled ? 'rgba(10,15,30,0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(249,115,22,0.2)' : 'none',
      transition: 'all 0.3s ease',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between'
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'linear-gradient(135deg, #F97316, #FBB034)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1rem', fontWeight: 900, color: '#0A0F1E', fontFamily: 'Rajdhani'
        }}>S</div>
        <span style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1.4rem', letterSpacing: '0.05em' }}>
          Sun<span style={{ color: '#F97316' }}>Mount</span>®
        </span>
      </Link>

      {/* Desktop Links */}
      <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
        {navLinks.map(link => (
          <Link key={link.to} to={link.to} style={{
            fontFamily: 'Rajdhani', fontWeight: 600, fontSize: '1rem',
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: location.pathname === link.to ? '#F97316' : 'rgba(255,255,255,0.8)',
            transition: 'color 0.2s',
            position: 'relative',
          }}
            onMouseEnter={e => e.target.style.color = '#F97316'}
            onMouseLeave={e => e.target.style.color = location.pathname === link.to ? '#F97316' : 'rgba(255,255,255,0.8)'}
          >{link.label}</Link>
        ))}
        <a href="tel:+917837999222" style={{
          padding: '0.5rem 1.2rem',
          background: 'linear-gradient(135deg, #F97316, #FBB034)',
          color: '#0A0F1E', fontFamily: 'Rajdhani', fontWeight: 700,
          fontSize: '0.9rem', letterSpacing: '0.05em',
          borderRadius: '4px', transition: 'opacity 0.2s'
        }}>+91 7837-999-222</a>
      </div>
    </nav>
  )
}

export default Navbar
