// Lightweight blog index (titles, descriptions, dates) for routes, sitemap and
// listing pages. Article bodies live in posts.js, loaded only on the blog pages.
export const POST_INDEX = [
  {
    slug: "aluminium-vs-gi-solar-mounting-structures",
    title: "Aluminium vs GI Solar Mounting Structures: Which to Choose",
    description: "Aluminium vs galvanised iron (GI) solar mounting structures compared on weight, corrosion, roof load, installation and lifespan for Indian rooftops.",
    date: "2026-09-26",
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
    date: "2026-09-26",
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
    date: "2026-09-26",
    minutes: 4,
    related: [
      "standing-seam"
    ]
  },
  {
    slug: "solar-mounting-wind-load-india",
    title: "Wind Load and Solar Mounting Structures in India",
    description: "What a 200 km/h wind rating means, how IS 875 (Part 3) basic wind speeds apply to rooftop solar in India, and what to ask your mounting supplier.",
    date: "2026-09-26",
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
    date: "2026-09-26",
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
