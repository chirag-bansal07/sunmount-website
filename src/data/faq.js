// Company-level FAQ for /faq. Answers restate facts already published on the
// site (product specs, certifications, contact details) in question form, so
// search engines and AI assistants can quote them directly.

export const FAQ = [
  {
    group: 'Products',
    items: [
      { q: 'What does SunMount manufacture?', a: 'SunMount manufactures rooftop solar PV mounting systems: Mono Rail, Mini Rail and Long Rail aluminium rail systems, Standing Seam clamps, the Inclined System for flat and low-pitch roofs, FRP walkways for maintenance access, and the clamps, bolts and EPDM tape that complete each system.' },
      { q: 'Which roof types do your mounting structures fit?', a: 'Trapezoidal metal (tin-shed) roofs with Mono Rail, Mini Rail or Long Rail; standing seam roofs with zero-penetration seam clamps; asbestos cement roofs with purlin-mounted Long Rail or the Inclined System using J-bolts; and flat or low-pitch roofs with the Inclined System at 5°–20° tilt.' },
      { q: 'What wind speed are SunMount structures rated for?', a: 'The Mono Rail, Mini Rail, Long Rail and Standing Seam systems are rated for design wind speeds up to 200 km/h. The Inclined System is rated up to 170 km/h. The fixing spacing for each project is set from the site\'s design wind speed.' },
      { q: 'What materials are used?', a: 'Rails and clamps are extruded from aluminium 6063 T6, fasteners are SS 304 stainless steel, and EPDM rubber seals the fixing points. Rails are available anodized or non-anodized. FRP walkways are made from pultruded fibre-reinforced polymer with isophthalic resin and UV stabilisers.' },
      { q: 'Which solar panels are compatible?', a: 'The clamps suit all standard PV modules with 30 mm, 35 mm and 40 mm frame thickness, in portrait or landscape orientation depending on the rail system.' },
      { q: 'Do I need to drill a standing seam roof?', a: 'No. Standing seam clamps grip the raised seam with grub screws, so the roof sheet is not penetrated. Variants cover 55 mm, 70 mm (Type 1 and Type 2) and 100 mm seam profiles.' },
      { q: 'Portrait or landscape — which system should I choose?', a: 'Mono Rail, Short Rail and the Inclined System mount panels in portrait orientation. Mini Rail (100 mm and 70 mm), Long Rail and the Standing Seam system mount panels in landscape orientation. Portrait layouts usually fit more modules on a given roof; landscape suits smaller or irregular roofs.' },
    ],
  },
  {
    group: 'Company and ordering',
    items: [
      { q: 'Is SunMount certified?', a: 'Yes. SunMount is ISO 9001 certified, TÜV SÜD certified, MSME registered and manufactures in India under Make in India.' },
      { q: 'Where is SunMount located?', a: 'Sunmount Solutions Private Limited is based at Surya Koti, Bajekan-Sirsa Main Road, Sirsa, Haryana 125055, India.' },
      { q: 'Do you supply outside Haryana and outside India?', a: 'Yes. SunMount supplies mounting structures across India and to international projects.' },
      { q: 'How do I get a quote?', a: 'Send your roof type, system size in kW and site location through the contact form at sunmount.in/contact, on WhatsApp or by phone at +91 78379 99222, or by email to sales@sunmount.in. The team replies within 24 hours.' },
      { q: 'Where can I see full specifications?', a: 'Each system has its own page under sunmount.in/products with every variant\'s specifications, and the complete product catalogue can be downloaded as a PDF from sunmount.in/catalogue.pdf.' },
    ],
  },
]

// Short Q&A for a product page, built from that product's own data.
export function productFaq(product) {
  const v0 = product.variants[0]
  const spec = (v, label) => v.specs.find(s => s.label.toLowerCase().includes(label))?.value
  const names = product.variants.map(v => v.name)
  const out = []
  const apps = [...new Set(product.variants.flatMap(v => v.applications || []))]
  if (apps.length) out.push({ q: `Where is the ${product.name} used?`, a: `Typical applications: ${apps.join(', ')}.` })
  const wind = spec(v0, 'wind')
  if (wind) out.push({ q: `What wind speed is the ${product.name} rated for?`, a: `${wind} design wind speed. Fixing spacing is set from each site's design wind speed.` })
  if (product.variants.length > 1) {
    out.push({ q: `Which variants of the ${product.name} are available?`, a: `${names.length} variants: ${product.variants.map(v => `${v.name} (${v.subtitle})`).join('; ')}.` })
  }
  const thick = spec(v0, 'panel thickness')
  if (thick) out.push({ q: 'Which module frame thicknesses does it fit?', a: `${thick} module frames, from any PV module brand.` })
  const mat = spec(v0, 'material')
  if (mat) out.push({ q: `What is the ${product.name} made of?`, a: `${mat}.` })
  return out
}
