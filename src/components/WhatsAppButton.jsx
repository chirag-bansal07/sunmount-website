// Floating WhatsApp shortcut — the fastest enquiry channel for Indian B2B buyers.
const WA_URL = 'https://wa.me/917837999222?text=' + encodeURIComponent(
  'Hi SunMount, I would like a quote for solar mounting structures.'
)

export default function WhatsAppButton() {
  return (
    <>
      <a
        href={WA_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="wa-float"
        aria-label="Chat with SunMount sales on WhatsApp"
      >
        <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true" fill="currentColor">
          <path d="M16 3C8.8 3 3 8.7 3 15.8c0 2.5.7 4.9 2 7L3 29l6.4-2c2 1.1 4.3 1.7 6.6 1.7 7.2 0 13-5.7 13-12.8S23.2 3 16 3zm0 23.4c-2.1 0-4.1-.6-5.9-1.6l-.4-.3-3.8 1.2 1.2-3.7-.3-.4a10.4 10.4 0 0 1-1.7-5.8C5.1 10 10 5.2 16 5.2S26.9 10 26.9 15.8 22 26.4 16 26.4zm6-7.9c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.6.3-.5c.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.7s1.2 3.2 1.4 3.4c.2.2 2.4 3.6 5.8 5 .8.4 1.4.6 1.9.7.8.3 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z" />
        </svg>
      </a>
      <style>{`
        .wa-float{position:fixed;right:max(1.1rem, env(safe-area-inset-right));bottom:max(1.1rem, env(safe-area-inset-bottom));z-index:1500;
          width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;
          background:#1FA855;color:#fff;box-shadow:0 8px 24px -6px rgba(0,0,0,.6);transition:transform .25s}
        .wa-float:hover{transform:scale(1.07)}
        @media print{.wa-float{display:none}}
      `}</style>
    </>
  )
}
