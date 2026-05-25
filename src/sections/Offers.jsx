import { RupeeIcon, ShieldIcon, ClockIcon, WindIcon, GearIcon, SupportIcon } from '../components/icons'
import { motion } from 'framer-motion'

const fadeUp  = { hidden:{opacity:0,y:28}, show:{opacity:1,y:0,transition:{duration:0.65,ease:[0.16,1,0.3,1]}} }
const stagger = { hidden:{},              show:{transition:{staggerChildren:0.09}} }

const OFFERS = [
  { Icon: RupeeIcon, title: 'MOST OPTIMUM & COST EFFECTIVE SOLUTIONS', sub: 'Engineered for value' },
  { Icon: ShieldIcon, title: 'BEST IN MARKET WARRANTY', sub: 'Backed by quality' },
  { Icon: ClockIcon, title: 'QUICK DISPATCH AND NEAT INSTALLATIONS', sub: 'Speed meets precision' },
  { Icon: WindIcon, title: 'DESIGN WIND SPEED UP TO 200 KMPH', sub: 'Tested & certified' },
  { Icon: GearIcon, title: 'HIGH STRENGTH PRODUCTS WITH LONG LIFE AND EASY MAINTENANCE', sub: 'Built to last' },
  { Icon: SupportIcon, title: 'PROMPT AND APT AFTER-SALES SUPPORT', sub: 'Always there for you' },
]

const Offers = () => {
  return (
    <section style={{
      padding: '4rem 0',
      background: 'var(--bg-deep)',
      position: 'relative',
    }}>
      {/* Sun pattern background */}
      <div style={{
        position: 'absolute',
        top: 0, right: 0,
        width: 600, height: 600,
        background: 'radial-gradient(circle, rgba(255,107,26,0.08) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{once:true,margin:'-80px'}}
          style={{ textAlign: 'center', marginBottom: '2.5rem', maxWidth: 700, margin: '0 auto 2.5rem' }}>
          <div className="section-label" style={{ display: 'inline-flex' }}>WHAT SUNMOUNT OFFERS</div>
          <h2 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)', marginBottom: '1.2rem' }}>
            Quality with <span className="gradient-text">Stability</span>,<br />
            for <span style={{ color: 'var(--aluminum-light)' }}>Infinity.</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7 }}>
            Six promises that define every project we deliver — across India and 50+ countries worldwide.
          </p>
        </motion.div>

        <motion.div
          variants={stagger} initial="hidden" whileInView="show" viewport={{once:true,margin:'-60px'}}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.2rem',
          }}>
          {OFFERS.map((offer, i) => (
            <motion.div key={i} variants={fadeUp} style={{ height:'100%', display:'flex', flexDirection:'column' }}>
              <OfferCard {...offer} index={i} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

const OfferCard = ({ Icon, title, sub, index }) => {
  return (
    <div
      className="offer-card"
      style={{
        padding: '2rem 1.6rem',
        background: 'linear-gradient(180deg, var(--bg-elevated) 0%, var(--bg-surface) 100%)',
        border: '1px solid var(--border-subtle)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        cursor: 'default',
        height: '100%',
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* Number indicator */}
      <div style={{
        position: 'absolute',
        top: '1rem', right: '1.2rem',
        fontFamily: 'JetBrains Mono',
        fontSize: '0.62rem',
        letterSpacing: '0.15em',
        color: 'var(--text-muted)',
      }}>
        / 0{index + 1}
      </div>

      {/* Icon container */}
      <div className="icon-wrap" style={{
        width: 72, height: 72,
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-deep)',
        border: '1px solid var(--border-subtle)',
        position: 'relative',
        color: 'var(--aluminum-mid)',
        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        <Icon />
      </div>

      <h3 style={{
        fontSize: '0.95rem',
        fontWeight: 700,
        letterSpacing: '0.04em',
        lineHeight: 1.4,
        marginBottom: '0.6rem',
        color: 'var(--text-primary)',
        textTransform: 'uppercase',
      }}>
        {title}
      </h3>
      <p style={{
        fontFamily: 'JetBrains Mono',
        fontSize: '0.72rem',
        letterSpacing: '0.05em',
        color: 'var(--text-muted)',
      }}>
        — {sub}
      </p>

      {/* Hover line at bottom */}
      <div className="offer-line" style={{
        position: 'absolute',
        bottom: 0, left: 0,
        height: 2,
        width: '0%',
        background: 'var(--gradient-sun)',
        transition: 'width 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      }} />

      <style>{`
        .offer-card:hover {
          border-color: var(--border-accent) !important;
          transform: translateY(-4px);
        }
        .offer-card:hover .icon-wrap {
          color: var(--sun-orange) !important;
          border-color: var(--border-accent) !important;
          box-shadow: 0 0 30px rgba(255, 107, 26, 0.25), inset 0 0 20px rgba(255, 107, 26, 0.1);
        }
        .offer-card:hover .icon-wrap svg {
          animation: pulseIcon 1.8s ease-in-out infinite;
        }
        .offer-card:hover .offer-line {
          width: 100% !important;
        }
        @keyframes pulseIcon {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 6px var(--sun-orange)); }
          50% { transform: scale(1.08); filter: drop-shadow(0 0 14px var(--sun-orange)); }
        }
      `}</style>
    </div>
  )
}

export default Offers
