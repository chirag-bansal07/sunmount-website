import { useState } from 'react'

const NODES = [
  { id:'mission', label:'Mission', icon:'🎯', angle:270, color:'#F97316', title:'Our Mission', text:"To promote renewable energy solutions by making solar installations easier and accessible to all — eliminating the need for conventional energy resources like fossil fuels. We enable a cleaner, greener tomorrow." },
  { id:'vision', label:'Vision', icon:'🔭', angle:30, color:'#FBB034', title:'Our Vision', text:"SunMount® aims to solve clients' dynamic needs in design and engineering with innovative solutions — backed by reliable scientific analysis and certifications — while remaining competitive in prices." },
  { id:'ambition', label:'Ambition', icon:'⚡', angle:150, color:'#A8C5D8', title:'Our Ambition', text:"For the BEST in raw materials, manufacturing, easy & genuine documentation, scientific analysis, timelines, warranty, and swift after-sales support. An instant WOW experience — always." },
]

function toXY(angle, r) {
  const rad = ((angle - 90) * Math.PI) / 180
  return { x: Math.cos(rad) * r, y: Math.sin(rad) * r }
}

export default function WhySunmount() {
  const [active, setActive] = useState('mission')
  const R = 150
  const activeNode = NODES.find(n => n.id === active)
  return (
    <section id="why" style={{ padding:'8rem 5%', background:'linear-gradient(180deg,var(--bg-1),var(--bg-2))', overflow:'hidden' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:'5rem' }}>
          <div className="section-label" style={{ justifyContent:'center' }}>Our Philosophy</div>
          <h2 style={{ fontSize:'clamp(2.2rem,4vw,3.5rem)' }}>Why Choose <span style={{ color:'var(--solar)' }}>SunMount®</span></h2>
        </div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'6rem', flexWrap:'wrap' }}>
          <div style={{ position:'relative', width:340, height:340, flexShrink:0 }}>
            <svg style={{ position:'absolute', inset:0 }} viewBox="0 0 340 340">
              {NODES.map(n => { const {x,y}=toXY(n.angle,R); return <line key={n.id} x1={170} y1={170} x2={170+x} y2={170+y} stroke={active===n.id?n.color:'rgba(200,213,220,0.12)'} strokeWidth={active===n.id?2:1} strokeDasharray={active===n.id?'none':'4 4'} style={{transition:'stroke 0.4s'}}/> })}
              <circle cx={170} cy={170} r={R} fill="none" stroke="rgba(200,213,220,0.06)" strokeWidth={1}/>
            </svg>
            <div style={{ position:'absolute', left:'50%', top:'50%', transform:'translate(-50%,-50%)', width:80, height:80, borderRadius:'50%', background:'linear-gradient(135deg,#1A2535,#111520)', border:'2px solid rgba(249,115,22,0.5)', boxShadow:'0 0 30px rgba(249,115,22,0.25)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2 }}>
              <div style={{ fontFamily:'Rajdhani', fontWeight:800, fontSize:'0.9rem', textAlign:'center', color:'#F97316', letterSpacing:'0.05em', lineHeight:1.1 }}>SUN<br/>MOUNT</div>
            </div>
            {NODES.map(n => { const {x,y}=toXY(n.angle,R); const isA=active===n.id; return (
              <button key={n.id} onClick={()=>setActive(n.id)} style={{ position:'absolute', left:`calc(50% + ${x}px)`, top:`calc(50% + ${y}px)`, transform:'translate(-50%,-50%)', width:isA?70:60, height:isA?70:60, borderRadius:'50%', background:isA?`linear-gradient(135deg,${n.color}22,${n.color}44)`:'linear-gradient(135deg,#161A22,#111318)', border:`2px solid ${isA?n.color:'rgba(200,213,220,0.15)'}`, boxShadow:isA?`0 0 30px ${n.color}55`:none, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'0.1rem', cursor:'pointer', transition:'all 0.35s', zIndex:3 }}>
                <span style={{ fontSize:isA?'1.4rem':'1.2rem' }}>{n.icon}</span>
                <span style={{ fontSize:'0.6rem', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:isA?n.color:'var(--text-3)' }}>{n.label}</span>
              </button>
            )})}
          </div>
          <div style={{ maxWidth:480, minHeight:200 }}>
            {activeNode && (
              <div key={activeNode.id} style={{ animation:'fadeSlide 0.4s ease' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'0.8rem', marginBottom:'1.5rem' }}>
                  <div style={{ width:50, height:50, borderRadius:'50%', background:`${activeNode.color}22`, border:`2px solid ${activeNode.color}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', boxShadow:`0 0 20px ${activeNode.color}44` }}>{activeNode.icon}</div>
                  <h3 style={{ fontFamily:'Rajdhani', fontSize:'2rem', color:activeNode.color }}>{activeNode.title}</h3>
                </div>
                <p style={{ color:'var(--text-2)', lineHeight:1.8, fontSize:'0.95rem' }}>{activeNode.text}</p>
                <div style={{ marginTop:'1.5rem', height:3, width:60, background:`linear-gradient(90deg,${activeNode.color},transparent)`, borderRadius:2 }}/>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`@keyframes fadeSlide{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}`}</style>
    </section>
  )
}
