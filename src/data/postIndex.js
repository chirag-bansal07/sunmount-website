// Lightweight blog index (titles, descriptions, dates) for routes, sitemap and
// listing pages. Article bodies live in posts.js, loaded only on the blog pages.
//
// `summary` is the direct answer shown as "In short" under the headline (and
// first in the Markdown twin) so search engines and AI assistants can quote it.
// Bump `updated` whenever a guide's content changes: it drives dateModified,
// the sitemap lastmod and the "Updated" line on the page.
export const POST_INDEX = [
  {
    slug: "aluminium-vs-gi-solar-mounting-structures",
    title: "Aluminium vs GI Solar Mounting Structures: Which to Choose",
    description: "Aluminium vs galvanised iron (GI) solar mounting structures compared on weight, corrosion, roof load, installation and lifespan for Indian rooftops.",
    summary: "For metal-sheet, standing-seam and asbestos roofs, aluminium (6063 T6) rail systems are usually the better choice: about one third the weight of steel, no rust, and fewer roof penetrations. GI suits RCC roofs with elevated frames and ground-mounted plants, where weight matters less.",
    date: "2026-09-26",
    updated: "2026-10-21",
    minutes: 6,
    related: [
      "mono-rail",
      "long-rail"
    ]
  },
  {
    slug: "solar-mounting-structure-for-metal-roof",
    title: "Choosing a Solar Mounting Structure for a Metal (Tin Shed) Roof",
    description: "Mono Rail, Mini Rail or Long Rail? How to pick a solar mounting structure for trapezoidal metal and tin-shed roofs by orientation, clearance and roof type.",
    summary: "Choose by panel orientation and fixing method: Mono Rail for portrait panels on trapezoidal sheets, Mini Rail for landscape panels, and Long Rail where the structure should fix to the purlins (industrial sheds, asbestos roofs, high wind zones). Take 100 mm clearance for ventilation, or 65–70 mm for high-wind and height-limited sites.",
    date: "2026-09-26",
    updated: "2026-10-21",
    minutes: 5,
    related: [
      "mono-rail",
      "mini-rail",
      "long-rail"
    ]
  },
  {
    slug: "standing-seam-solar-mounting-without-drilling",
    title: "Solar on Standing Seam Roofs Without Drilling",
    description: "How standing seam solar clamps grip the roof seam with zero penetration, which clamp fits 55, 70 or 100 mm seams, and what to check before installing.",
    summary: "Standing seam clamps grip the raised seam with grub screws, so panels mount with zero roof penetration and no new leak points. Match the clamp to the seam height: 55 mm, 70 mm (Type 1 or Type 2) or 100 mm Pro. Confirm the seam profile, the roof warranty terms and the site's design wind speed before ordering.",
    date: "2026-09-26",
    updated: "2026-10-21",
    minutes: 4,
    related: [
      "standing-seam"
    ]
  },
  {
    slug: "solar-mounting-wind-load-india",
    title: "Wind Load and Solar Mounting Structures in India",
    description: "What a 200 km/h wind rating means, how IS 875 (Part 3) basic wind speeds apply to rooftop solar in India, and what to ask your mounting supplier.",
    summary: "A 200 km/h rating (about 55.6 m/s) covers the highest basic wind speed zone in IS 875 (Part 3). The design wind speed for a specific building also depends on terrain, height and importance, so fixing spacing must be set per site. SunMount rail and standing seam systems are rated to 200 km/h; the Inclined System to 170 km/h.",
    date: "2026-09-26",
    updated: "2026-10-21",
    minutes: 5,
    related: [
      "long-rail",
      "mono-rail",
      "inclined"
    ]
  },
  {
    slug: "the-future-of-solar-is-bright",
    title: "The Future of Solar Is Bright: Rooftop Solar in India",
    description: "Why rooftop solar is growing fast in India, what it means for factories, homes and EPC installers, and why the mounting structure decides a system's lifespan.",
    summary: "India is targeting 500 GW of non-fossil power capacity by 2030, and rooftop solar on factories, warehouses and homes is a large share of that growth. Panels carry 25-year warranties, so the mounting structure's material, corrosion protection, wind rating and roof penetrations decide whether the system lasts as long.",
    date: "2026-09-26",
    updated: "2026-10-21",
    minutes: 4,
    related: [
      "mono-rail",
      "standing-seam"
    ]
  }
]

// "26 September 2026" — fixed locale + UTC so server and browser render the same.
export const formatDate = iso =>
  new Date(iso + 'T00:00:00Z').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
