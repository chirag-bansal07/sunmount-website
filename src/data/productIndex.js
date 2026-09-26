// Lightweight product list for navigation and SEO metadata (titles, H1s,
// descriptions). Kept separate from products.js so the main bundle — which
// needs these for every route's <head> — doesn't carry the full catalogue.
export const PRODUCT_INDEX = [
  { id: 'mono', slug: 'mono-rail', name: 'Mono Rail System',
    h1: "Mono Rail Solar Mounting Structure",
    metaDescription: "Mono Rail aluminium solar mounting structure for trapezoidal metal roofs. Four variants, 65–100 mm roof clearance, portrait panels, rated to 200 km/h wind." },
  { id: 'mini', slug: 'mini-rail', name: 'Mini Rail System',
    h1: "Mini Rail Solar Mounting Structure",
    metaDescription: "Mini Rail low-profile aluminium solar mounting for trapezoidal roofs. Landscape panels, 70 mm & 100 mm clearance or Short Rail, rated to 200 km/h." },
  { id: 'long', slug: 'long-rail', name: 'Long Rail System',
    h1: "Long Rail Solar Mounting Structure",
    metaDescription: "Long Rail purlin-mounted aluminium solar structure for industrial and asbestos roofs. Ultra, Light & Pro variants, fewer roof punctures, 200 km/h rated." },
  { id: 'seam', slug: 'standing-seam', name: 'Standing Seam System',
    h1: "Standing Seam Solar Mounting Clamps",
    metaDescription: "Standing seam solar clamps that grip the seam with zero roof drilling. 55 mm, 70 mm (Type 1 & 2) and 100 mm Pro variants, rated to 200 km/h wind." },
  { id: 'frp', slug: 'frp-walkway', name: 'FRP Walkway',
    h1: "FRP Walkway for Solar Rooftops",
    metaDescription: "Anti-slip FRP walkway grating for solar rooftop maintenance access. Meniscus top, 38 × 38 mm mesh, UV-stabilised, corrosion-free, 20 & 25 mm heights." },
  { id: 'inclined', slug: 'inclined', name: 'Inclined System',
    h1: "Inclined Solar Mounting Structure (5°–20° Tilt)",
    metaDescription: "Inclined aluminium solar mounting structure for flat and low-pitch roofs. Adjustable 5°–20° tilt for south-facing panels on metal or asbestos roofs." },
]
