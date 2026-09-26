/**
 * Question-and-answer list. Answers are always in the HTML (native <details>
 * keeps them crawlable and quotable while collapsed for visitors).
 */
export default function FaqList({ items, openFirst = false }) {
  return (
    <div className="faq-list">
      {items.map((it, i) => (
        <details key={it.q} open={openFirst && i === 0}>
          <summary>{it.q}</summary>
          <p>{it.a}</p>
        </details>
      ))}
      <style>{`
        .faq-list{display:grid;gap:.6rem}
        .faq-list details{border:1px solid var(--border-subtle);background:var(--bg-elevated)}
        .faq-list summary{cursor:pointer;list-style:none;padding:1rem 1.2rem;font-weight:700;color:var(--text-primary);display:flex;justify-content:space-between;gap:1rem}
        .faq-list summary::-webkit-details-marker{display:none}
        .faq-list summary::after{content:'+';color:var(--sun-orange);font-family:'JetBrains Mono', 'JetBrains Mono Fallback', monospace;flex-shrink:0}
        .faq-list details[open] summary::after{content:'−'}
        .faq-list details p{padding:0 1.2rem 1.1rem;color:var(--text-secondary);line-height:1.75;max-width:820px}
      `}</style>
    </div>
  )
}
