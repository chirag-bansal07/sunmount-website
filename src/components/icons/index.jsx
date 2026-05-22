// Custom line-art icons — stroke-based so they pulse/glow nicely on hover
const ICON_PROPS = {
  width: 48,
  height: 48,
  viewBox: '0 0 48 48',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export const RupeeIcon = () => (
  <svg {...ICON_PROPS}>
    <circle cx="24" cy="24" r="20" strokeOpacity="0.3" />
    <path d="M17 14h14" />
    <path d="M17 19h14" />
    <path d="M17 14c0 5 3 8 8 8h-8l10 12" />
  </svg>
)

export const ShieldIcon = () => (
  <svg {...ICON_PROPS}>
    <path d="M24 6L8 12v12c0 9 7 16 16 18 9-2 16-9 16-18V12L24 6z" />
    <path d="M17 24l5 5 9-10" />
  </svg>
)

export const ClockIcon = () => (
  <svg {...ICON_PROPS}>
    <circle cx="24" cy="24" r="18" />
    <path d="M24 14v10l7 4" />
    <path d="M38 10l4 4" strokeOpacity="0.5" />
    <path d="M10 10L6 14" strokeOpacity="0.5" />
  </svg>
)

export const WindIcon = () => (
  <svg {...ICON_PROPS}>
    <path d="M6 16c2-2 6-2 8 0s2 6 0 8" />
    <path d="M8 24c3-2 8-2 11 0s3 7 0 9" />
    <path d="M10 32c4-2 10-2 14 0" />
    <path d="M30 14h8c2 0 4 2 4 4s-2 4-4 4h-2" strokeOpacity="0.6" />
    <path d="M34 26h6c2 0 4 2 4 4s-2 4-4 4h-3" strokeOpacity="0.4" />
  </svg>
)

export const GearIcon = () => (
  <svg {...ICON_PROPS}>
    <circle cx="24" cy="24" r="6" />
    <path d="M24 6v6M24 36v6M6 24h6M36 24h6M11 11l4 4M33 33l4 4M11 37l4-4M33 15l4-4" />
    <circle cx="24" cy="24" r="14" strokeOpacity="0.3" />
  </svg>
)

export const SupportIcon = () => (
  <svg {...ICON_PROPS}>
    <path d="M24 6c-9 0-16 7-16 16v6c0 2 2 4 4 4h2v-12h-2c0-7 5-12 12-12s12 5 12 12h-2v12h2c2 0 4-2 4-4v-6c0-9-7-16-16-16z" />
    <path d="M30 32c0 3-3 6-6 6" />
  </svg>
)

export const MadeInIndiaIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1.2" />
    <path d="M12 1v22M1 12h22" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
)

export const ISOIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1.2" />
    <text x="12" y="15" textAnchor="middle" fontSize="7" fontWeight="700" fill="currentColor" fontFamily="Montserrat">ISO</text>
  </svg>
)

export const TUVIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1.2" />
    <text x="12" y="15" textAnchor="middle" fontSize="7" fontWeight="700" fill="currentColor" fontFamily="Montserrat">TÜV</text>
  </svg>
)

export const MSMEIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1.2" />
    <text x="12" y="15" textAnchor="middle" fontSize="5.5" fontWeight="700" fill="currentColor" fontFamily="Montserrat">MSME</text>
  </svg>
)

export const ArrowRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
)

export const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
  </svg>
)

export const StarIcon = ({ filled = true }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
)
