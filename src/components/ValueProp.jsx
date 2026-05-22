const OFFERS = [
  { svg:<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="24" cy="24" r="18"/><path d="M24 12v4M24 32v4M16 20h4M28 20h4"/><circle cx="24" cy="24" r="4"/></svg>, title:'Most Optimum & Cost Effective Solutions', desc:'Maximum value engineering — premium grade materials at unbeatable market prices.' },
  { svg:<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M24 6L8 14v12c0 9 7 17 16 20 9-3 16-11 16-20V14L24 6z"/><path d="M17 24l4 4 10-10"/></svg>, title:'Best in Market Warranty', desc:'Industry-leading warranty coverage. ISO & TUV certified for complete peace of mind.' },
  { svg:<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="24" cy="24" r="16"/><path d="M24 14v10l6 6"/></svg>, title:'Quick Dispatch & Neat Installations', desc:'15,000 sq.ft+ manufacturing plant ensures fast turnaround and timely deliveries.' },
  { svg:<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 28c0-8 6-20 16-20s16 12 16 20"/><path d="M18 36l-4 4M30 36l4 4M20 22c0-4 2-8 4-10 2 2 4 6 4 10s-2 8-4 10c-2-2-4-6-4-10z"/></svg>, title:'Design Wind Speed up to 200 kmph', desc:'FEA & wind analysis certified. Xylan coated SDS, EPDM genuine components.' },
  { svg:<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="20" width="12" height="20" rx="2"/><rect x="28" y="12" width="12" height="28" rx="2"/><path d="M14 20V12a4 4 0 0 1 8 0M34 12V8a4 4 0 0 0-8 0v4"/></svg>, title:'High Strength Products with Long Life', desc:'IE-07 ingots, 6063-T6 alloy, SS-304 — ASTM methods tested for unmatched durability.' },
  { svg:<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="18" r="8"/><path d="M26 34a8 8 0 0 0-16 0M34 20v-4M34 32v-8M30 28h8"/><circle cx="34" cy="16" r="2"/></svg>, title:'Prompt & Apt After-Sales Support', desc:'Dedicated post-installation assistance. Our team is always ready to help, fast.' },
]

export default function ValueProp() {
  return (
    <section style={{ padding:'8rem 5%', background:'linear-gradient(180deg,var(--bg-2),var(--bg-0))' }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:'4rem' }}>
          <div className="section-label" style={{ justifyContent:'center' }}>Value Proposition</div>
          <h2 style={{ fontSize:'clamp(2.2rem,4vw,3.5rem)' }}>What <span style={{ color:'var(--solar)' }}>SunMount®</span> Offers</h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'1.25rem' }}>
          {OFFERS.map((item,i)=>(
            <div key={i} style={{ padding:'2rem', background:'linear-gradient(145deg,#161A22,#111318)', border:'1px solid var(--border)', borderRadius:6, display:'flex', gap:'1.25rem', alignItems:'flex-start', transition:'all 0.3s', cursor:'default' }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(249,115,22,0.35)';e.currentTarget.style.boxShadow='0 8px 40px rgba(249,115,22,0.1)';e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.querySelector('.icon').style.color='#F97316';e.currentTarget.querySelector('.icon').style.filter='drop-shadow(0 0 10px rgba(249,115,22,0.6))'}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.boxShadow='none';e.currentTarget.style.transform='translateY(0)';e.currentTarget.querySelector('.icon').style.color='var(--al-mid)';e.currentTarget.querySelector('.icon').style.filter='none'}}
            >
              <div className="icon" style={{ color:'var(--al-mid)', transition:'color 0.3s,filter 0.3s', flexShrink:0, width:44, height:44 }}>{item.svg}</div>
              <div>
                <h3 style={{ fontFamily:'Rajdhani', fontSize:'1.1rem', fontWeight:700, marginBottom:'0.4rem', lineHeight:1.2, textTransform:'uppercase', letterSpacing:'0.02em' }}>{item.title}</h3>
                <p style={{ color:'var(--text-2)', fontSize:'0.85rem', lineHeight:1.7 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
