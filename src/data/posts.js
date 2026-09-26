// Blog / buyer guides. Plain data so the build (routes, sitemap, llms.txt) and
// the pages share one source. Keep claims to engineering facts and SunMount's
// own published specifications — no prices or scheme amounts that go stale.
//
// Section shape: { h2, p: [paragraphs], list?: [items], table?: { head, rows } }

import { POST_INDEX } from './postIndex.js'

const BODIES = [
  {
    slug: 'aluminium-vs-gi-solar-mounting-structures',
    intro: 'Most rooftop solar structures in India are built from either aluminium extrusions or galvanised iron (GI) steel sections. Both can carry panels safely for decades when they are designed and installed correctly — but they behave very differently on a roof. This guide compares the two on the points that matter to EPC contractors and building owners.',
    sections: [
      {
        h2: 'Weight and roof load',
        p: [
          'Aluminium weighs roughly one third as much as steel for the same volume (about 2.7 g/cm³ against 7.85 g/cm³). On a metal-sheet or asbestos roof that was never designed for extra dead load, that difference decides whether a structure can go up without strengthening the roof.',
          'Rail-based aluminium systems such as Mono Rail and Mini Rail mount directly on the roof sheet, so the added load is spread along the crests instead of concentrated on a few legs.',
        ],
      },
      {
        h2: 'Corrosion resistance',
        p: [
          'Aluminium protects itself: its surface forms a thin oxide layer that stops further corrosion, and anodising thickens that layer. It does not rust, so cut ends and drilled holes do not become weak points.',
          'GI steel relies on its zinc coating. The coating sacrifices itself over time, and wherever it is cut, drilled or scratched during installation the bare steel underneath can rust unless the damage is treated. Coastal air and industrial pollution shorten the life of the coating.',
          'Whichever metal you choose, fasteners matter. Stainless steel (SS 304) bolts and EPDM rubber between dissimilar metals prevent galvanic corrosion and water ingress at every fixing point.',
        ],
      },
      {
        h2: 'Installation speed and roof penetrations',
        p: [
          'Aluminium rails are light enough for one person to carry and cut on site, and rail systems fix to the roof with rivets and EPDM tape or with self-drilling screws into existing holes. Fewer, smaller penetrations mean fewer places for a roof to leak.',
          'GI structures are usually fabricated as frames with legs, which suits ground-mounted and elevated designs but typically needs more fixings into the roof.',
        ],
      },
      {
        h2: 'Side-by-side comparison',
        table: {
          head: ['Factor', 'Aluminium (6063 T6)', 'Galvanised iron (GI)'],
          rows: [
            ['Weight', 'About 1/3 of steel', 'Heavy'],
            ['Corrosion', 'Self-protecting oxide layer; no rust', 'Depends on zinc coating; cut edges need treatment'],
            ['Best roofs', 'Metal sheet, standing seam, asbestos (purlin-mounted)', 'RCC and ground-mount frames'],
            ['Roof penetrations', 'Few; rivets, EPDM tape or existing screw holes', 'Usually more fixing points'],
            ['Maintenance', 'Minimal', 'Inspect and touch up the coating'],
          ],
        },
      },
      {
        h2: 'Which should you choose?',
        p: [
          'For metal-sheet, standing-seam and asbestos cement roofs — the majority of industrial and commercial rooftops in India — aluminium rail systems are usually the better fit because they add little load, do not rust and need few penetrations.',
          'GI remains common for RCC roofs with elevated frames and for ground-mounted plants, where weight matters less. Either way, ask for the design wind speed, material grade and fastener specification in writing before you order.',
        ],
      },
    ],
  },
  {
    slug: 'solar-mounting-structure-for-metal-roof',
    intro: 'Trapezoidal metal sheets — often called tin-shed roofs — cover most factories, warehouses and sheds in India, and they are among the best surfaces for rooftop solar. The right mounting structure depends on three things: how the panels are oriented, how much clearance you need under them, and whether the structure should fix to the roof sheet or to the purlins below it.',
    sections: [
      {
        h2: 'Step 1: Portrait or landscape panels?',
        p: [
          'Portrait orientation (the long side of the panel running up the roof) usually fits more modules on a given roof area. Landscape orientation suits smaller or irregular roofs and low-profile layouts.',
          'Mono Rail is designed for portrait layouts on trapezoidal roofs. Mini Rail and Long Rail are designed for landscape layouts.',
        ],
      },
      {
        h2: 'Step 2: Crest-mounted or purlin-mounted?',
        p: [
          'Crest-mounted rails (Mono Rail, Mini Rail) sit on the raised crests of the roof sheet and are fixed with rivets and EPDM tape, or with structural adhesive where no penetration is wanted. They are fast to install and spread the load along the sheet.',
          'Purlin-mounted rails (Long Rail) span across the roof and fix through to the purlins with self-drilling screws, often reusing the sheet\'s existing screw holes. They need fewer roof punctures and suit high wind-load zones, industrial buildings and asbestos cement roofs where the sheet itself should not carry the load.',
        ],
      },
      {
        h2: 'Step 3: How much clearance?',
        p: [
          'Clearance between the panel and the roof lets air flow under the modules, which keeps them cooler and helps output in Indian summers. A lower profile reduces wind forces on the structure.',
        ],
        list: [
          '100 mm clearance — maximum ventilation; the common choice for commercial roofs (MonoRail 100 mm, MiniRail 100 mm).',
          '70 mm clearance — lower profile for high wind-load or coastal sites (MonoRail 70 mm, MiniRail 70 mm).',
          '65 mm clearance — the most compact Mono Rail option where height is limited.',
        ],
      },
      {
        h2: 'Quick selector',
        table: {
          head: ['Your roof and layout', 'Suggested system'],
          rows: [
            ['Trapezoidal sheet, portrait panels, commercial roof', 'Mono Rail (100 mm, or 70 mm for high wind)'],
            ['Trapezoidal sheet, landscape panels, residential or small commercial', 'Mini Rail (100 mm or 70 mm)'],
            ['Compact bays or short spans', 'Short Rail (part of the Mini Rail range)'],
            ['Industrial shed or asbestos cement roof, high wind load', 'Long Rail (Light, Pro or Ultra)'],
            ['Standing seam (clip-lock) roof', 'Standing Seam clamps — no drilling'],
            ['Flat or low-pitch roof facing the wrong way', 'Inclined System (5°–20° tilt)'],
          ],
        },
      },
      {
        h2: 'Before you order',
        list: [
          'Confirm the sheet profile (crest width and pitch) and the purlin spacing.',
          'Check the roof\'s age and condition — replace corroded sheets before installing.',
          'Get the site\'s design wind speed and ask for the structure\'s rating in writing.',
          'Plan a maintenance walkway so panels can be cleaned without stepping on them.',
        ],
      },
    ],
  },
  {
    slug: 'standing-seam-solar-mounting-without-drilling',
    intro: 'Standing seam roofs — metal panels joined by raised, interlocking seams — are increasingly common on modern factories, warehouses and premium buildings. They are ideal for solar because the panels can be mounted with clamps that grip the seam itself, so the roof is never drilled.',
    sections: [
      {
        h2: 'How seam clamps work',
        p: [
          'A standing seam clamp slides over the raised seam and is tightened with grub screws that press against the seam wall. Rails or module clamps then attach to the top of the clamp. Because nothing passes through the roof sheet, there are no holes to seal and no new leak points.',
          'A well-designed clamp spreads the clamping force so the seam is not crushed or distorted — important because many roof manufacturers\' warranties do not allow penetrations or damage to the seam.',
        ],
      },
      {
        h2: 'Match the clamp to the seam',
        p: ['Seams vary in height and shape, and the clamp must fit the exact profile. SunMount\'s standing seam range covers the geometries most used in India:'],
        list: [
          'Standing Seam 55 mm — for 55 mm seam profiles.',
          'Standing Seam 70 mm Type 1 and Type 2 — two jaw designs for different 70 mm seam shapes.',
          'Standing Seam 100 mm Pro — a deeper, heavy-duty jaw for tall 100 mm seams on large-span industrial roofs.',
        ],
      },
      {
        h2: 'What to check before installing',
        list: [
          'Measure the seam height and photograph its profile so the right clamp can be specified.',
          'Check the roof manufacturer\'s warranty terms for attachments.',
          'Confirm the design wind speed for the site; clamp spacing is set from it.',
          'Use the specified tightening torque on the grub screws — over-tightening can deform the seam.',
        ],
      },
      {
        h2: 'Why it matters',
        p: [
          'Zero-penetration mounting keeps the roof watertight for its full life, avoids warranty disputes and makes future panel removal simple. For standing seam roofs it is almost always the right approach.',
        ],
      },
    ],
  },
  {
    slug: 'solar-mounting-wind-load-india',
    intro: 'Wind is the load that decides whether a rooftop solar system survives. Panels act like sails: strong gusts try to lift them off the roof, and the mounting structure and its fixings have to hold them down. Here is how wind ratings work in India and how to read a supplier\'s claim.',
    sections: [
      {
        h2: 'Basic wind speeds in India',
        p: [
          'Indian Standard IS 875 (Part 3) maps the country into zones by basic wind speed — the 3-second gust speed at 10 m height used as the starting point for design. The zones range from 33 m/s to 55 m/s.',
        ],
        table: {
          head: ['Basic wind speed (m/s)', 'Approx. km/h'],
          rows: [['33', '119'], ['39', '140'], ['44', '158'], ['47', '169'], ['50', '180'], ['55', '198']],
        },
      },
      {
        h2: 'What "rated to 200 km/h" means',
        p: [
          '200 km/h is about 55.6 m/s — just above the highest basic wind speed zone in the Indian map. SunMount rates its rail and standing seam systems up to 200 km/h; the Inclined System, which lifts panels up to 20° off the roof, is rated up to 170 km/h (about 47 m/s).',
          'A rating is not the whole story. The design wind speed for a specific building is the basic speed multiplied by factors for the structure\'s importance, terrain, height and topography — a tall building on open, exposed ground sees more wind than a low one in a dense city. The structure, its spacing and every fixing into the roof must be checked against that site-specific value.',
        ],
      },
      {
        h2: 'Design choices that reduce wind risk',
        list: [
          'Lower clearance (for example 70 mm instead of 100 mm) reduces the lever arm on each fixing.',
          'Purlin-mounted rails transfer load into the building frame rather than the roof sheet.',
          'Closer fixing spacing at roof edges and corners, where uplift is highest.',
          'Stainless steel fasteners and EPDM seals so fixings stay tight and watertight over time.',
        ],
      },
      {
        h2: 'Questions to ask your supplier',
        list: [
          'What design wind speed is this structure rated for, and on what basis?',
          'What fixing spacing do you recommend for my site\'s wind zone and roof edges?',
          'What material grade and fasteners are used?',
          'Can you provide a structural calculation or certificate for the project?',
        ],
      },
    ],
  },
  {
    slug: 'the-future-of-solar-is-bright',
    intro: 'India has set out to build 500 GW of non-fossil power capacity by 2030, and solar is carrying most of that growth. Alongside large solar parks, rooftops on factories, warehouses, schools and homes are becoming small power plants — and every one of them stands on a mounting structure.',
    sections: [
      {
        h2: 'Why rooftop solar is growing',
        list: [
          'Commercial and industrial users cut daytime electricity bills by generating on their own roofs.',
          'Homes are supported by the PM Surya Ghar rooftop solar programme — check pmsuryaghar.gov.in for current eligibility and subsidy.',
          'Module prices have fallen sharply over the past decade, shortening payback periods.',
          'Unused roof area becomes productive without buying land.',
        ],
      },
      {
        h2: 'The part nobody sees',
        p: [
          'Panels are warrantied for 25 years or more, so the structure under them has to last at least as long — through monsoons, heat, dust and storm winds. A structure that corrodes, loosens or damages the roof can end a system\'s life early.',
          'That is why material grade, corrosion protection, wind rating and the number of roof penetrations deserve as much attention as the choice of panel or inverter.',
        ],
      },
      {
        h2: 'Made in India',
        p: [
          'SunMount designs and manufactures its mounting systems in Sirsa, Haryana — aluminium rails, standing seam clamps, inclined structures and FRP walkways, ISO 9001 and TÜV SÜD certified and rated up to 200 km/h. Local manufacturing shortens lead times and lets structures be engineered for Indian roofs and wind zones.',
        ],
      },
    ],
  },
]

export const POSTS = POST_INDEX.map(meta => ({ ...meta, ...BODIES.find(b => b.slug === meta.slug) }))

export const postBySlug = slug => POSTS.find(p => p.slug === slug)
