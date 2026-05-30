import { useState, Suspense, useEffect, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Environment, PerspectiveCamera, ContactShadows, OrbitControls } from '@react-three/drei'
import { MiniRail, MonoRail, LongRail, SeamClamp, SeamClamp55, SeamClamp100Pro, SeamClamp70T1, SeamClamp70T2, InclinedRail, InclinedSystem, ShortRail, MonoRail100, MonoRail70, MonoRail65, MonoRail100Pro, MiniRail100, MiniRail70, MiniRailShort, LongRailUltra, LongRailLite, LongRailPro } from '../three/RailModels'
import { ArrowRightIcon, DownloadIcon } from '../components/icons'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

/* ─────────────────────────────────────────────────────────────────
   PRODUCT + VARIANT DATA
───────────────────────────────────────────────────────────────── */
const PRODUCTS = [
  /* ── 1. MONO RAIL ─────────────────────────────────────────────── */
  {
    id: 'mono',
    name: 'Mono Rail System',
    short: 'Portrait · Trapezoidal Roofs',
    tag: 'PORTRAIT',
    badge: 'Best Seller',
    systemDesc: 'T-slot aluminium rail for portrait-orientation panels on trapezoidal metal roofs. Four variants — 100 mm, 70 mm, 65 mm and 100 mm Pro — to match any project clearance or wind-load requirement.',
    variants: [
      {
        id: 'mono-100',
        name: 'MonoRail 100mm',
        subtitle: '100 mm Roof Clearance',
        Component: MonoRail100,
        tagline: 'Standard 100 mm clearance — maximum ventilation, the most popular choice for commercial projects.',
        desc: 'The MonoRail 100mm provides 100 mm of clearance between the panel underside and the roof surface, ensuring excellent natural ventilation and module cooling. The precision T-slot extrusion accepts U-clamps and mid-clamps for all standard panel thicknesses. Rivet-and-EPDM tape attachment to the roof crest is the standard fixing method; a structural-adhesive option is available for non-penetrative installation.',
        specs: [
          { label: 'Profile Height',     value: '70 mm' },
          { label: 'Roof Clearance',     value: '100 mm' },
          { label: 'Panel Thickness',    value: '30 mm · 35 mm · 40 mm' },
          { label: 'Material',           value: 'Aluminium 6063 T6 · SS 304 · EPDM' },
          { label: 'Design Wind Speed',  value: 'Up to 200 km/h' },
          { label: 'Orientation',        value: 'Portrait' },
          { label: 'Attachment',         value: 'Rivet + EPDM tape / Structural adhesive' },
          { label: 'Finish',             value: 'Anodized / Non-anodized' },
        ],
        highlights: [
          '100 mm clearance for maximum ventilation & cooling',
          'Lightweight single-rail design',
          'Optimised for any trapezoidal crest width',
          'Portrait orientation — high module capacity',
          'U-clamp & mid-clamp panel attachment',
          'Compatible with all PV module brands',
        ],
        applications: ['Commercial rooftop', 'Industrial shed', 'Large residential', 'Warehouse'],
      },
      {
        id: 'mono-70',
        name: 'MonoRail 70mm',
        subtitle: '70 mm Roof Clearance',
        Component: MonoRail70,
        tagline: 'Low-profile 70 mm variant — reduced wind moment, ideal for high wind-load zones.',
        desc: 'The MonoRail 70mm uses the same T-slot profile but reduces mounting height to 70 mm above the roof crest. The lower centre of gravity reduces the wind-induced bending moment at the base fixing, making it the preferred choice for coastal or high wind-load sites. Panel attachment and material specifications are identical to the 100 mm variant.',
        specs: [
          { label: 'Profile Height',     value: '70 mm' },
          { label: 'Roof Clearance',     value: '70 mm' },
          { label: 'Panel Thickness',    value: '30 mm · 35 mm · 40 mm' },
          { label: 'Material',           value: 'Aluminium 6063 T6 · SS 304 · EPDM' },
          { label: 'Design Wind Speed',  value: 'Up to 200 km/h' },
          { label: 'Orientation',        value: 'Portrait' },
          { label: 'Attachment',         value: 'Rivet + EPDM tape / Structural adhesive' },
          { label: 'Finish',             value: 'Anodized / Non-anodized' },
        ],
        highlights: [
          '70 mm clearance — reduced wind moment vs 100 mm',
          'Lower visual profile on roof',
          'Preferred for coastal & high wind-load zones',
          'Portrait orientation — high module capacity',
          'U-clamp & mid-clamp panel attachment',
          'Compatible with all PV module brands',
        ],
        applications: ['Coastal installation', 'High wind zone', 'Commercial rooftop', 'Industrial shed'],
      },
      {
        id: 'mono-65',
        name: 'MonoRail 65mm',
        subtitle: '65 mm Roof Clearance',
        Component: MonoRail65,
        tagline: 'Ultra-low 65 mm clearance — minimum profile for sites with the strictest height or wind constraints.',
        desc: 'The MonoRail 65mm is the lowest-clearance variant in the Mono Rail range, bringing panels within 65 mm of the roof surface. This ultra-low profile delivers the smallest wind-exposed area of any mono-rail configuration, minimising uplift forces in severe wind environments. Ideal for coastal industrial rooftops and any site where height restrictions apply.',
        specs: [
          { label: 'Profile Height',     value: '70 mm' },
          { label: 'Roof Clearance',     value: '65 mm' },
          { label: 'Panel Thickness',    value: '30 mm · 35 mm · 40 mm' },
          { label: 'Material',           value: 'Aluminium 6063 T6 · SS 304 · EPDM' },
          { label: 'Design Wind Speed',  value: 'Up to 200 km/h' },
          { label: 'Orientation',        value: 'Portrait' },
          { label: 'Attachment',         value: 'Rivet + EPDM tape / Structural adhesive' },
          { label: 'Finish',             value: 'Anodized / Non-anodized' },
        ],
        highlights: [
          '65 mm clearance — minimum wind-exposed profile',
          'Lowest uplift force in the Mono Rail range',
          'Portrait orientation — high module capacity',
          'Ideal for height-restricted & coastal sites',
          'U-clamp & mid-clamp panel attachment',
          'Compatible with all PV module brands',
        ],
        applications: ['Coastal installation', 'High wind zone', 'Height-restricted site', 'Industrial shed'],
      },
      {
        id: 'mono-100-pro',
        name: 'MonoRail 100mm Pro',
        subtitle: '100 mm Clearance · Heavy Duty',
        Component: MonoRail100Pro,
        tagline: 'Heavy-duty 100 mm Pro — reinforced profile for large-span purlins and premium commercial projects.',
        desc: 'The MonoRail 100mm Pro shares the 100 mm clearance of the standard variant but uses a heavier-gauge aluminium extrusion with greater wall thickness for improved bending stiffness. This allows wider fixing spacings along the roof purlin, reducing the number of penetrations on large commercial or industrial rooftops. The Pro grade also supports heavier bifacial panel modules.',
        specs: [
          { label: 'Profile Height',     value: '70 mm (heavy-gauge wall)' },
          { label: 'Roof Clearance',     value: '100 mm' },
          { label: 'Panel Thickness',    value: '30 mm · 35 mm · 40 mm' },
          { label: 'Material',           value: 'Aluminium 6063 T6 · SS 304 · EPDM' },
          { label: 'Design Wind Speed',  value: 'Up to 200 km/h' },
          { label: 'Orientation',        value: 'Portrait' },
          { label: 'Attachment',         value: 'Rivet + EPDM tape / Structural adhesive' },
          { label: 'Finish',             value: 'Anodized / Non-anodized' },
        ],
        highlights: [
          'Heavy-gauge extrusion — wider purlin spacing',
          '100 mm clearance for maximum ventilation',
          'Supports heavier bifacial panel modules',
          'Fewer roof penetrations on large-span roofs',
          'Portrait orientation — high module capacity',
          'Compatible with all PV module brands',
        ],
        applications: ['Large commercial rooftop', 'Premium project', 'Bifacial module installation', 'Industrial shed'],
      },
    ],
  },

  /* ── 2. MINI RAIL ────────────────────────────────────────────── */
  {
    id: 'mini',
    name: 'Mini Rail System',
    short: 'Landscape · Residential',
    tag: 'LANDSCAPE',
    badge: 'Cost Effective',
    systemDesc: 'Low-profile compact extrusion for landscape-orientation panels on trapezoidal roofs. Three variants — 100 mm, 70 mm and Short Rail — covering all clearance needs from standard to compact-bay installations.',
    variants: [
      {
        id: 'mini-100',
        name: 'MiniRail 100mm',
        subtitle: '100 mm Roof Clearance',
        Component: MiniRail100,
        tagline: 'Standard 100 mm clearance — optimal ventilation for residential & light commercial projects.',
        desc: 'The MiniRail 100mm delivers 100 mm of roof clearance in a compact 68 mm profile height. Landscape panel orientation maximises row width on narrower roofs. Z-clamp and end-clamp attachment accommodates all standard panel frame thicknesses without additional tooling. Rivet-and-EPDM tape base fixing preserves the roof membrane.',
        specs: [
          { label: 'Profile Height',     value: '68 mm' },
          { label: 'Roof Clearance',     value: '100 mm' },
          { label: 'Panel Thickness',    value: '30 mm · 35 mm · 40 mm' },
          { label: 'Material',           value: 'Aluminium 6063 T6 · SS 304 · EPDM' },
          { label: 'Design Wind Speed',  value: 'Up to 200 km/h' },
          { label: 'Orientation',        value: 'Landscape' },
          { label: 'Attachment',         value: 'Rivet + EPDM tape' },
          { label: 'Finish',             value: 'Anodized / Non-anodized' },
        ],
        highlights: [
          '100 mm clearance — excellent ventilation',
          'Compact 68 mm profile — minimal visual impact',
          'Landscape orientation for wider rows',
          'Z-clamp & end-clamp panel attachment',
          'Minimal raw material usage — cost-effective',
          'Compatible with all PV module brands',
        ],
        applications: ['Residential rooftop', 'Light commercial', 'Warehouse', 'Industrial shed'],
      },
      {
        id: 'mini-70',
        name: 'MiniRail 70mm',
        subtitle: '70 mm Roof Clearance',
        Component: MiniRail70,
        tagline: 'Compact 70 mm clearance — lower profile for wind-sensitive or aesthetically driven projects.',
        desc: 'The MiniRail 70mm reduces the mounting height to 70 mm, creating an even lower profile that blends with the roof line. Ideal for sites with strict visual guidelines or higher wind-load requirements. Panel attachment and material specifications are identical to the 100 mm variant. Its cost-efficiency makes it a frequent choice for residential developments.',
        specs: [
          { label: 'Profile Height',     value: '68 mm' },
          { label: 'Roof Clearance',     value: '70 mm' },
          { label: 'Panel Thickness',    value: '30 mm · 35 mm · 40 mm' },
          { label: 'Material',           value: 'Aluminium 6063 T6 · SS 304 · EPDM' },
          { label: 'Design Wind Speed',  value: 'Up to 200 km/h' },
          { label: 'Orientation',        value: 'Landscape' },
          { label: 'Attachment',         value: 'Rivet + EPDM tape' },
          { label: 'Finish',             value: 'Anodized / Non-anodized' },
        ],
        highlights: [
          '70 mm clearance — near-flush roof profile',
          'Low visual impact — aesthetics-driven projects',
          'Reduced wind moment vs 100 mm variant',
          'Landscape orientation — wider row coverage',
          'Most cost-effective in the Mini Rail range',
          'Compatible with all PV module brands',
        ],
        applications: ['Residential rooftop', 'Aesthetics-sensitive site', 'High wind zone', 'Light commercial'],
      },
      {
        id: 'mini-short',
        name: 'Short Rail',
        subtitle: 'Compact Span · Portrait',
        Component: MiniRailShort,
        tagline: 'Compact short-span rail for narrow bays, canopies and retrofits — same T-slot, all SunMount clamps compatible.',
        desc: 'The Short Rail is a compact aluminium extrusion for rooftops where a full-length rail is impractical due to narrow bay widths, limited purlin spans or modular roof layouts. Its reduced length minimises material usage and simplifies logistics while keeping the same T-slot profile that accepts every SunMount U-clamp, Z-clamp and mid-clamp. Ideal for canopies, carports and residential retrofits.',
        specs: [
          { label: 'Profile Length',     value: 'Short-span (custom cut)' },
          { label: 'Profile Height',     value: '68 mm' },
          { label: 'Panel Thickness',    value: '30 mm · 35 mm · 40 mm' },
          { label: 'Material',           value: 'Aluminium 6063 T6 · SS 304 · EPDM' },
          { label: 'Design Wind Speed',  value: 'Up to 200 km/h' },
          { label: 'Orientation',        value: 'Portrait' },
          { label: 'Attachment',         value: 'Rivet + EPDM tape' },
          { label: 'Finish',             value: 'Anodized / Non-anodized' },
        ],
        highlights: [
          'Short span — designed for narrow-bay rooftops',
          'Reduced material & logistics cost',
          'Same T-slot — all SunMount clamps compatible',
          'Modular — cut to exact bay width on site',
          'Fast installation on compact or retrofit projects',
          'Compatible with all PV module brands',
        ],
        applications: ['Compact residential', 'Canopy / carport', 'Narrow-bay industrial', 'Retrofit installation'],
      },
    ],
  },

  /* ── 3. LONG RAIL ────────────────────────────────────────────── */
  {
    id: 'long',
    name: 'Long Rail System',
    short: 'Portrait & Landscape · Industrial',
    tag: 'PORTRAIT / LANDSCAPE',
    badge: 'High Strength',
    systemDesc: 'Heavy-duty purlin-mounted aluminium rail for industrial buildings, asbestos cement roofs and high wind-load zones. Three variants — Ultra, Light and Pro — spanning every load and orientation requirement.',
    variants: [
      {
        id: 'long-ultra',
        name: 'Long Rail Ultra',
        subtitle: 'Heavy-Duty · Portrait',
        Component: LongRailUltra,
        tagline: 'Maximum load-bearing capacity — the go-to solution for extreme wind environments and industrial structures.',
        desc: 'The Long Rail Ultra is SunMount\'s heaviest-duty purlin-mounted rail. Its increased cross-section and wall thickness deliver higher bending stiffness, enabling wider purlin spacings without additional support. The system is certified for wind speeds up to 200 km/h and is ideal for large-span industrial sheds and coastal environments where load-to-weight ratio is critical.',
        specs: [
          { label: 'Profile Height',     value: '50 mm (PRO grade)' },
          { label: 'Panel Thickness',    value: '30 mm · 35 mm · 40 mm' },
          { label: 'Material',           value: 'Aluminium 6063 T6 · SS 304 · EPDM' },
          { label: 'Design Wind Speed',  value: 'Up to 200 km/h' },
          { label: 'Mounting',           value: 'Purlin-mounted' },
          { label: 'Orientation',        value: 'Portrait' },
          { label: 'Roof Types',         value: 'Metal sheet · Asbestos cement' },
          { label: 'Finish',             value: 'Anodized / Non-anodized' },
        ],
        highlights: [
          'Maximum bending stiffness — widest purlin spacing',
          'Rated up to 200 km/h wind speed',
          'Fewer roof penetrations vs Mini/Mono Rail',
          'Reuses existing J-bolt holes on asbestos sheets',
          'Universal for any trapezoidal crest profile',
          'FEA & wind load analysis certified',
        ],
        applications: ['Industrial shed', 'Large-span factory', 'Coastal installation', 'Asbestos cement roof'],
      },
      {
        id: 'long-lite',
        name: 'Long Rail Light',
        subtitle: 'Standard · Landscape',
        Component: LongRailLite,
        tagline: 'Economical purlin-mounted rail for landscape orientation — fewer penetrations, faster installation.',
        desc: 'The Long Rail Light is a lighter, more economical variant of the purlin-mounted system, optimised for landscape-orientation panels. Its reduced material cross-section keeps project costs lower while still delivering far fewer roof penetrations than Mini or Mono Rail installations. Compatible with existing self-drilling screw holes on asbestos sheets, making retrofits simple.',
        specs: [
          { label: 'Profile Height',     value: '30 mm (LITE grade)' },
          { label: 'Panel Thickness',    value: '30 mm · 35 mm · 40 mm' },
          { label: 'Material',           value: 'Aluminium 6063 T6 · SS 304 · EPDM' },
          { label: 'Design Wind Speed',  value: 'Up to 200 km/h' },
          { label: 'Mounting',           value: 'Purlin-mounted' },
          { label: 'Orientation',        value: 'Landscape' },
          { label: 'Roof Types',         value: 'Metal sheet · Asbestos cement' },
          { label: 'Finish',             value: 'Anodized / Non-anodized' },
        ],
        highlights: [
          'Cost-effective purlin-mounted solution',
          'Landscape orientation — wide row coverage',
          'Fewer roof penetrations vs Mini/Mono Rail',
          'Uses existing self-drilling screw holes',
          'Compatible with asbestos cement roofs',
          'Easy installation & maintenance',
        ],
        applications: ['Industrial shed', 'Warehouse', 'Asbestos roof', 'Light commercial'],
      },
      {
        id: 'long-pro',
        name: 'Long Rail Pro',
        subtitle: 'Premium · Dual Orientation',
        Component: LongRailPro,
        tagline: 'Premium grade with the highest load capacity — engineered for both portrait and landscape on the most demanding structures.',
        desc: 'The Long Rail Pro is the flagship of the Long Rail range, combining the greatest cross-section wall thickness with a universal profile that accommodates both portrait and landscape panel orientations. It is designed for premium commercial and industrial projects where structural engineers require the highest certified load ratings, the widest allowable purlin spacings, and a single-rail solution across mixed-orientation arrays.',
        specs: [
          { label: 'Grade',              value: 'PRO (maximum wall thickness)' },
          { label: 'Panel Thickness',    value: '30 mm · 35 mm · 40 mm' },
          { label: 'Material',           value: 'Aluminium 6063 T6 · SS 304 · EPDM' },
          { label: 'Design Wind Speed',  value: 'Up to 200 km/h' },
          { label: 'Mounting',           value: 'Purlin-mounted' },
          { label: 'Orientation',        value: 'Portrait & Landscape' },
          { label: 'Roof Types',         value: 'Metal sheet · Asbestos cement' },
          { label: 'Finish',             value: 'Anodized / Non-anodized' },
        ],
        highlights: [
          'Highest load rating in the Long Rail range',
          'Supports portrait AND landscape orientation',
          'Maximum permitted purlin spacing',
          'FEA-certified for extreme wind zones',
          'Single-rail solution for mixed-orientation arrays',
          'Compatible with all PV module brands',
        ],
        applications: ['Premium commercial', 'Mixed-orientation array', 'Extreme wind zone', 'Large-span industrial'],
      },
    ],
  },

  /* ── 4. STANDING SEAM ────────────────────────────────────────── */
  {
    id: 'seam',
    name: 'Standing Seam System',
    short: 'Landscape · Zero Penetration',
    tag: 'LANDSCAPE',
    badge: 'No Puncture',
    systemDesc: 'Clamp-based system that grips the standing seam profile without any drilling. Four clamp variants cover every seam geometry used in India.',
    variants: [
      {
        id: 'seam-55',
        name: 'Standing Seam 55mm',
        subtitle: 'T1 Profile · 55 mm Seam',
        Component: SeamClamp55,
        tagline: 'The standard 55 mm seam clamp — covers the most common standing seam profile in India.',
        desc: 'Standing Seam 55mm is designed for the most widely installed standing seam roofing profile in India. Grub screws fix the aluminium clamp onto the 55 mm seam without drilling, preserving the roof membrane and warranty. Landscape-orientation panels attach via U-clamp or mid-clamp directly to the clamp\'s T-slot.',
        specs: [
          { label: 'Seam Profile',       value: 'T1' },
          { label: 'Seam Height',        value: '55 mm' },
          { label: 'Clamp Material',     value: 'Aluminium 6063 T6 · SS 304' },
          { label: 'Panel Thickness',    value: '30 mm · 35 mm · 40 mm' },
          { label: 'Design Wind Speed',  value: 'Up to 200 km/h' },
          { label: 'Roof Penetration',   value: 'Zero' },
          { label: 'Orientation',        value: 'Landscape' },
          { label: 'Finish',             value: 'Anodized / Non-anodized' },
        ],
        highlights: [
          'Zero roof penetration — preserves manufacturer warranty',
          'Grub-screw clamping, no drilling required',
          'Designed for 55 mm standing seam geometry',
          'Fastest installation in the SunMount range',
          'Landscape panel orientation',
          'Compatible with all PV module brands',
        ],
        applications: ['Standing seam factory', 'Premium commercial', 'Architectural warehouse', 'High-end residential'],
      },
      {
        id: 'seam-100-pro',
        name: 'Standing Seam 100mm Pro',
        subtitle: 'T2 Profile · 100 mm Seam · Pro',
        Component: SeamClamp100Pro,
        tagline: 'Pro-grade 100 mm clamp for tall T2 seam profiles — maximum grip for industrial-grade standing seam roofing.',
        desc: 'Standing Seam 100mm Pro accommodates taller, 100 mm T2 standing seam profiles typical of large-span industrial roofing. The deep Pro-grade clamp jaw provides a more secure grip on the wider seam body, and reinforced grub screws ensure lock-tight retention even under extreme wind loads. Panel attachment via T-slot U-clamp or mid-clamp.',
        specs: [
          { label: 'Seam Profile',       value: 'T2 · Pro grade' },
          { label: 'Seam Height',        value: '100 mm' },
          { label: 'Clamp Material',     value: 'Aluminium 6063 T6 · SS 304' },
          { label: 'Panel Thickness',    value: '30 mm · 35 mm · 40 mm' },
          { label: 'Design Wind Speed',  value: 'Up to 200 km/h' },
          { label: 'Roof Penetration',   value: 'Zero' },
          { label: 'Orientation',        value: 'Landscape' },
          { label: 'Finish',             value: 'Anodized / Non-anodized' },
        ],
        highlights: [
          'Zero roof penetration',
          'Designed for tall 100 mm standing seam geometry',
          'Deeper jaw for positive seam engagement',
          'Grub-screw locking — no drilling',
          'Landscape panel orientation',
          'Compatible with all PV module brands',
        ],
        applications: ['Industrial standing seam', 'Large-span factory', 'Commercial warehouse', 'Premium rooftop'],
      },
      {
        id: 'seam-70-t1',
        name: 'Standing Seam 70mm Type 1',
        subtitle: 'T2 Profile · 70 mm · Type 1 Clamp',
        Component: SeamClamp70T1,
        tagline: '70 mm Type 1 clamp — precision fit for narrow-flange standing seam profiles at 70 mm seam height.',
        desc: 'Standing Seam 70mm Type 1 is precision-machined for 70 mm narrow-flange standing seam profiles commonly found on imported and premium domestic roofing systems. The Type 1 clamp jaw conforms to the seam\'s inner radius, and dual grub screws distribute clamping force evenly without distorting the seam, preserving the roof warranty.',
        specs: [
          { label: 'Seam Profile',       value: 'T2 · P1–P2 geometry' },
          { label: 'Clamp Points',       value: 'P1 & P2 (dual grub screw)' },
          { label: 'Clamp Material',     value: 'Aluminium 6063 T6 · SS 304' },
          { label: 'Panel Thickness',    value: '30 mm · 35 mm · 40 mm' },
          { label: 'Design Wind Speed',  value: 'Up to 200 km/h' },
          { label: 'Roof Penetration',   value: 'Zero' },
          { label: 'Orientation',        value: 'Landscape' },
          { label: 'Finish',             value: 'Anodized / Non-anodized' },
        ],
        highlights: [
          'Zero roof penetration',
          'Dual P1–P2 contact for even clamping force',
          'No seam distortion — warranty safe',
          'For narrow-flange 70 mm seam profiles (Type 1)',
          'Landscape panel orientation',
          'Compatible with all PV module brands',
        ],
        applications: ['Imported standing seam', 'Premium residential', 'Architectural project', 'Commercial rooftop'],
      },
      {
        id: 'seam-70-t2',
        name: 'Standing Seam 70mm Type 2',
        subtitle: 'T2 Profile · 70 mm · Type 2 Clamp',
        Component: SeamClamp70T2,
        tagline: '70 mm Type 2 clamp — wide-flange geometry for maximum pull-out resistance on large-profile seams.',
        desc: 'Standing Seam 70mm Type 2 is engineered for wide-flange 70 mm standing seam profiles. The Type 2 jaw accommodates the wider seam body and dual-point grub screws deliver maximum pull-out resistance for heavy panel loads and high wind environments. This variant provides the highest holding force among the 70 mm seam clamp range.',
        specs: [
          { label: 'Seam Profile',       value: 'T2 · P2–P3 geometry' },
          { label: 'Clamp Points',       value: 'P2 & P3 (dual grub screw)' },
          { label: 'Clamp Material',     value: 'Aluminium 6063 T6 · SS 304' },
          { label: 'Panel Thickness',    value: '30 mm · 35 mm · 40 mm' },
          { label: 'Design Wind Speed',  value: 'Up to 200 km/h' },
          { label: 'Roof Penetration',   value: 'Zero' },
          { label: 'Orientation',        value: 'Landscape' },
          { label: 'Finish',             value: 'Anodized / Non-anodized' },
        ],
        highlights: [
          'Zero roof penetration',
          'Dual P2–P3 contact — maximum pull-out resistance',
          'For wide-flange 70 mm seam profiles (Type 2)',
          'High wind-load holding capacity',
          'Landscape panel orientation',
          'Compatible with all PV module brands',
        ],
        applications: ['Large-span industrial', 'Wide-seam standing seam roof', 'Premium commercial', 'High wind zone'],
      },
    ],
  },

  /* ── 5. INCLINED SYSTEM ──────────────────────────────────────── */
  {
    id: 'inclined',
    name: 'Inclined System',
    short: 'Portrait · Adjustable Tilt',
    tag: 'PORTRAIT',
    badge: 'Adjustable Tilt',
    systemDesc: 'Tilted mounting structure for flat or low-pitch roofs. Adjustable inclination from 5° to 20° for maximum south-facing generation regardless of roof aspect.',
    variants: [
      {
        id: 'inclined-std',
        name: 'Inclined System',
        subtitle: '5° – 20° Adjustable Tilt',
        Component: InclinedSystem,
        tagline: 'Adjustable tilt from 5° to 20° — optimises energy yield on north-, east- or west-facing roofs.',
        desc: 'The Inclined System uses precision-extruded L-channel and C-channel aluminium to tilt solar PV panels at an adjustable angle on flat or low-pitch trapezoidal metal and asbestos roofs. Panels face south regardless of roof orientation, maximising annual energy yield. The inclination is set at installation from 5° to 20° depending on site latitude. L-channels attach to the roof crest via self-drilling screws (metal) or J-bolts (asbestos).',
        specs: [
          { label: 'C-Channel Height',   value: '50 mm' },
          { label: 'Tilt Angle',         value: '5° – 20° (set at installation)' },
          { label: 'Panel Thickness',    value: '30 mm · 35 mm · 40 mm' },
          { label: 'Material',           value: 'Aluminium 6063 T6 · SS 304 · EPDM' },
          { label: 'Design Wind Speed',  value: 'Up to 170 km/h' },
          { label: 'Orientation',        value: 'Portrait · South-facing' },
          { label: 'Roof Attachment',    value: 'Self-drilling screws / J-bolts' },
          { label: 'Finish',             value: 'Anodized / Non-anodized' },
        ],
        highlights: [
          'South-facing panels on any roof aspect',
          'Higher energy yield on flat & low-pitch roofs',
          'Adjustable tilt 5° – 20° at installation',
          'Compatible with metal sheet & asbestos cement roofs',
          'Uses existing J-bolt holes on asbestos roofs',
          'Portrait orientation — purlin-mounted',
        ],
        applications: ['Flat industrial roof', 'Low-pitch residential', 'North/East/West-facing roof', 'Asbestos cement roof'],
      },
    ],
  },
]

/* ─────────────────────────────────────────────────────────────────
   ACCESSORIES
───────────────────────────────────────────────────────────────── */
const ACCESSORIES = [
  { name: 'U-Clamp',        material: 'Aluminium 6063 T6',  image: '/accessories/u-clamp.png',       features: ['Quick & easy installation', 'High strength', 'All PV modules'] },
  { name: 'Z-Clamp',        material: 'Aluminium 6063 T6',  image: '/accessories/z-clamp.png',       features: ['30 / 35 / 40 mm modules', 'Cost-effective', 'Long-lasting'] },
  { name: 'L-Clamp',        material: 'Aluminium 6063 T6',  image: '/accessories/l-clamp.png',       features: ['Robust construction', 'Universal PV compat.', 'Budget-friendly'] },
  { name: 'Rail Nut',       material: 'Aluminium 6063 T6',  image: '/accessories/rail-nut.png',      features: ['Works with all rails', 'High strength', 'Extended lifespan'] },
  { name: 'Flange Nut',     material: 'SS 304',              image: '/accessories/flange-nut.png',    features: ['Superior strength', 'Durable construction', 'Easy removal'] },
  { name: 'Spring Washer',  material: 'SS 304',              image: '/accessories/spring-washer.png', features: ['Prevents nut loosening', 'Reinforces joints', 'Minimal maintenance'] },
  { name: 'Allen Key Bolt', material: 'SS 304',              image: '/accessories/allen-bolt.png',    features: ['Strong & durable', 'Quick installation', 'Low maintenance'] },
  { name: 'T-Bolt',         material: 'SS 304',              image: '/accessories/t-bolt.png',        features: ['T-slot compatible', 'Robust & long-lasting', 'Easy upkeep'] },
  { name: 'Hex Bolt',       material: 'SS 304',              image: '/accessories/hex-bolt.png',      features: ['High strength', 'Extended lifespan', 'Simple maintenance'] },
  { name: 'SDS Screw',      material: 'Xylan Coated',        image: '/accessories/sds-screw.png',     features: ['One-tool approach', 'Self-drilling', 'Cost-effective'] },
  { name: 'Rivet',          material: 'Aluminium',           image: '/accessories/rivet.png',         features: ['Strong & affordable', 'Industry standard', 'Durable'] },
  { name: 'EPDM Tape',      material: '100% Genuine EPDM',   image: '/accessories/epdm-tape.png',     features: ['ASTM tested', 'Moisture & heat resistant', 'Good electrical resistivity'] },
]

/* ─────────────────────────────────────────────────────────────────
   3-D CANVAS
───────────────────────────────────────────────────────────────── */

/** Syncs the camera distance to the zoom slider value, preserving current orbit angle */
function ZoomController({ zoom }) {
  const { camera } = useThree()
  useEffect(() => {
    const len = camera.position.length()
    if (len > 0) camera.position.multiplyScalar(zoom / len)
  }, [zoom, camera])
  return null
}

function RailCanvas({ Component, zoom }) {
  return (
    <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
      <PerspectiveCamera makeDefault position={[0, 0, zoom]} fov={38} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 4, 2]} intensity={2.0} color="#FBB034" />
      <directionalLight position={[-3, 1, -2]} intensity={0.7} color="#6090d4" />
      <directionalLight position={[0, 3, -4]} intensity={0.5} color="#ffffff" />
      <Suspense fallback={null}>
        <Component />
        <Environment preset="sunset" />
      </Suspense>
      <ContactShadows position={[0, -0.8, 0]} opacity={0.40} scale={6} blur={2.5} far={3} />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.2} makeDefault />
      <ZoomController zoom={zoom} />
    </Canvas>
  )
}

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
  const { hash }  = useLocation()
  const hashId    = hash.replace('#', '')
  const initId    = VALID_IDS.includes(hashId) ? hashId : 'mono'

  const [selected,   setSelected]   = useState(initId)
  const [variantId,  setVariantId]  = useState(null)
  const [zoom,       setZoom]       = useState(4)

  // Sync selected from URL hash
  useEffect(() => {
    if (VALID_IDS.includes(hashId)) setSelected(hashId)
  }, [hashId])

  // Reset to first variant whenever main system changes
  useEffect(() => {
    const prod = PRODUCTS.find(p => p.id === selected)
    if (prod) setVariantId(prod.variants[0].id)
  }, [selected])

  // Reset zoom when variant changes
  useEffect(() => { setZoom(4) }, [variantId])

  const product       = PRODUCTS.find(p => p.id === selected)
  const allVariantIds = product ? product.variants.map(v => v.id) : []
  const activeVariant = product?.variants.find(v => v.id === variantId) ?? product?.variants[0]

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
          <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.7, ease:[0.16,1,0.3,1] }}>
            <div className="section-label">COMPLETE PRODUCT RANGE</div>
            <h1 className="prod-h1" style={{ fontSize:'clamp(1.8rem,3vw,2.8rem)', maxWidth:540, lineHeight:1.15 }}>
              Precision Mounting <span className="gradient-text">Systems Catalogue</span>
            </h1>
            <p className="prod-subp" style={{ color:'var(--text-secondary)', marginTop:'0.75rem', maxWidth:580, fontSize:'0.92rem', lineHeight:1.7 }}>
              Six aluminium mounting systems — ISO 9001 &amp; TÜV SÜD certified, rated up to 200 km/h.
              Select a system, then choose the model variant that suits your project.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── LAYOUT: SIDEBAR + DETAIL ── */}
      <div className="desktop-products-layout">
      <div className="container">
        <div style={{ display:'grid', gridTemplateColumns:'270px 1fr', gap:'2.5rem',
          padding:'2.5rem 2rem', alignItems:'start' }} className="prod-layout">

          {/* ── Sidebar ── */}
          <motion.div initial={{ opacity:0, x:-24 }} animate={{ opacity:1, x:0 }}
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

            <a href="https://www.sunmount.in/wp-content/uploads/2024/09/Catalogue-2024-rev-2.pdf"
              target="_blank" rel="noopener noreferrer" className="btn-primary prod-sidebar-dl"
              style={{ width:'100%', justifyContent:'center', fontSize:'0.78rem', marginTop:'1.2rem', padding:'0.85rem 1rem' }}>
              <DownloadIcon /> Download Catalogue
            </a>
          </motion.div>

          {/* ── Detail Panel ── */}
          <AnimatePresence mode="wait">
            <motion.div key={selected} className="prod-detail-wrap"
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
                <AnimatePresence mode="wait">
                  <motion.div key={activeVariant.id}
                    initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                    transition={{ duration:0.3 }}>

                    <div style={{ display:'flex', gap:'0.75rem', marginBottom:'2rem', alignItems:'stretch' }}>
                      {/* ── 3D Viewport ── */}
                      <div className="canvas-3d" style={{
                        flex:1, height:340, position:'relative',
                        background:'radial-gradient(ellipse at 50% 70%,rgba(224,85,64,0.07) 0%,transparent 70%)',
                        border:'1px solid var(--border-subtle)', cursor:'grab',
                      }}>
                        <RailCanvas Component={activeVariant.Component} zoom={zoom} />
                        {/* Model label badge */}
                        <div style={{
                          position:'absolute', top:'1rem', left:'1rem',
                          background:'rgba(10,14,26,0.75)', backdropFilter:'blur(8px)',
                          border:'1px solid var(--border-subtle)',
                          padding:'0.35rem 0.75rem',
                          fontFamily:'JetBrains Mono', fontSize:'0.62rem', letterSpacing:'0.1em',
                          color:'var(--text-primary)',
                        }}>
                          {activeVariant.name}
                        </div>
                        <div style={{
                          position:'absolute', bottom:'0.9rem', left:'1rem',
                          fontFamily:'JetBrains Mono', fontSize:'0.58rem', letterSpacing:'0.14em',
                          color:'var(--text-muted)', textTransform:'uppercase', pointerEvents:'none',
                        }}>↻ Drag to rotate</div>
                      </div>

                      {/* ── Zoom Slider ── */}
                      <div className="zoom-slider" style={{
                        display:'flex', flexDirection:'column', alignItems:'center',
                        justifyContent:'center', gap:'0.5rem',
                        background:'rgba(10,14,26,0.6)', backdropFilter:'blur(8px)',
                        border:'1px solid var(--border-subtle)',
                        padding:'0.9rem 0.55rem', borderRadius:4, flexShrink:0, width:36,
                      }}>
                        <span style={{ fontFamily:'JetBrains Mono', fontSize:'0.75rem', color:'var(--sun-orange)', lineHeight:1, userSelect:'none' }}>+</span>
                        <div style={{ height:140, display:'flex', alignItems:'center', justifyContent:'center', width:20 }}>
                          <input
                            type="range" min={2} max={7} step={0.05}
                            value={9 - zoom}
                            onChange={e => setZoom(9 - parseFloat(e.target.value))}
                            style={{ transform:'rotate(-90deg)', width:140, cursor:'pointer', accentColor:'#E05540', margin:0 }}
                          />
                        </div>
                        <span style={{ fontFamily:'JetBrains Mono', fontSize:'0.75rem', color:'var(--text-muted)', lineHeight:1, userSelect:'none' }}>−</span>
                      </div>
                    </div>

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
                      <a href="https://www.sunmount.in/wp-content/uploads/2024/09/Catalogue-2024-rev-2.pdf"
                        target="_blank" rel="noopener noreferrer"
                        className="btn-secondary" style={{ fontSize:'0.88rem' }}>
                        <DownloadIcon /> Download Full Catalogue
                      </a>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </motion.div>
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
          <AnimatePresence mode="wait">
            <motion.div key={activeVariant.id} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.3}}>
              <div style={{ margin:'1.2rem 1rem 0', position:'relative', height:300, border:'1px solid var(--border-subtle)', background:'radial-gradient(ellipse at 50% 70%,rgba(224,85,64,0.07) 0%,transparent 70%)', overflow:'hidden' }}>
                <RailCanvas Component={activeVariant.Component} zoom={zoom} />
                <div style={{ position:'absolute', top:'0.75rem', left:'0.75rem', background:'rgba(10,14,26,0.8)', backdropFilter:'blur(8px)', border:'1px solid var(--border-subtle)', padding:'0.3rem 0.65rem', fontFamily:'JetBrains Mono', fontSize:'0.6rem', letterSpacing:'0.1em', color:'var(--text-primary)' }}>
                  {activeVariant.name}
                </div>
                <div style={{ position:'absolute', bottom:'0.7rem', left:'0.75rem', fontFamily:'JetBrains Mono', fontSize:'0.55rem', letterSpacing:'0.14em', color:'var(--text-muted)', pointerEvents:'none', textTransform:'uppercase' }}>↻ Drag to rotate</div>
              </div>

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
                  <a href="https://www.sunmount.in/wp-content/uploads/2024/09/Catalogue-2024-rev-2.pdf" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ justifyContent:'center', fontSize:'0.85rem' }}><DownloadIcon /> Download Catalogue</a>
                </div>
              </div>
            </motion.div>
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
          <motion.div
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
          </motion.div>

          <motion.div
            initial="hidden" whileInView="show" viewport={{ once:true, margin:'-60px' }}
            variants={{ hidden:{}, show:{ transition:{ staggerChildren:0.06 } } }}
            className="acc-grid"
            style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.4rem' }}>
            {ACCESSORIES.map((acc, i) => (
              <motion.div key={acc.name}
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
                  <img src={acc.image} alt={acc.name}
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
              </motion.div>
            ))}
          </motion.div>
        </div>
        <style>{`
          .acc-card:hover { border-color:var(--border-accent) !important; transform:translateY(-4px); }
          .acc-card:hover .acc-line { width:100% !important; }
        `}</style>
      </section>
    </main>
  )
}
