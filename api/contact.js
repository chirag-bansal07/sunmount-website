/**
 * Contact form handler — Vercel serverless function.
 *
 * 1. Sends a comprehensive auto-reply to the customer FROM sales@sunmount.in
 *    (thank-you + request for requirement & site layout + catalogue link).
 * 2. Sends the lead notification to sales@sunmount.in.
 *
 * Email is sent via Resend (https://resend.com). Set RESEND_API_KEY in the
 * Vercel project env. If the key is absent, we gracefully fall back to
 * Web3Forms so the form keeps capturing leads while Resend is being set up.
 */

const SALES_EMAIL   = 'sales@sunmount.in'
const FROM           = 'Sunmount Solutions <sales@sunmount.in>'
const SITE           = 'https://www.sunmount.in'
const CATALOGUE_URL  = 'https://www.sunmount.in/catalogue.pdf'
const LOGO_URL       = 'https://www.sunmount.in/logo.png'
const WEB3FORMS_KEY  = 'ce080276-f9f7-4b7d-a791-f2553f5da3ee'

const esc = (s = '') => String(s).replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]))

async function readBody(req) {
  if (req.body) {
    if (typeof req.body === 'string') { try { return JSON.parse(req.body) } catch { return {} } }
    return req.body
  }
  return await new Promise(resolve => {
    let data = ''
    req.on('data', c => { data += c })
    req.on('end', () => { try { resolve(JSON.parse(data || '{}')) } catch { resolve({}) } })
    req.on('error', () => resolve({}))
  })
}

async function sendViaResend({ to, subject, html, replyTo }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM, to, subject, html, reply_to: replyTo }),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Resend ${res.status}: ${text}`)
  }
  return res.json()
}

/* ── Customer auto-reply email ─────────────────────────────────── */
function autoReplyHtml({ name }) {
  const first = (name || '').trim().split(/\s+/)[0] || 'there'
  return `
  <div style="margin:0;padding:0;background:#0a0e1a;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0e1a;padding:24px 0;">
      <tr><td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#10141f;border:1px solid #1f2738;border-radius:10px;overflow:hidden;">
          <!-- Accent bar -->
          <tr><td style="height:4px;background:linear-gradient(90deg,#E05540,#E8923A);"></td></tr>
          <!-- Logo -->
          <tr><td align="center" style="padding:28px 24px 8px;">
            <img src="${LOGO_URL}" alt="Sunmount Solutions" width="180" style="max-width:180px;height:auto;display:block;" />
          </td></tr>
          <!-- Heading -->
          <tr><td style="padding:12px 36px 0;">
            <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;line-height:1.3;">Thank you for reaching out, ${esc(first)}! ☀️</h1>
          </td></tr>
          <!-- Body -->
          <tr><td style="padding:14px 36px 4px;color:#c9d4e0;font-size:15px;line-height:1.75;">
            <p style="margin:0 0 16px;">We've received your enquiry at <strong style="color:#fff;">Sunmount Solutions Private Limited</strong> and we're glad you're considering us for your solar mounting requirements. Our team will get back to you shortly.</p>
            <p style="margin:0 0 10px;">To help us prepare the <strong style="color:#fff;">most accurate quote</strong> for your project, please reply to this email with:</p>
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px;">
              <tr><td style="color:#E8923A;font-size:15px;padding:3px 10px 3px 0;vertical-align:top;">&#10003;</td><td style="color:#c9d4e0;font-size:15px;line-height:1.6;padding:3px 0;">Your detailed <strong style="color:#fff;">requirement</strong> (system type, panel count, roof type)</td></tr>
              <tr><td style="color:#E8923A;font-size:15px;padding:3px 10px 3px 0;vertical-align:top;">&#10003;</td><td style="color:#c9d4e0;font-size:15px;line-height:1.6;padding:3px 0;">Your <strong style="color:#fff;">site layout</strong> — roof drawings, dimensions, or photos</td></tr>
            </table>
            <p style="margin:0 0 22px;">In the meantime, here's our complete product catalogue covering every mounting system we offer:</p>
          </td></tr>
          <!-- Catalogue button -->
          <tr><td align="center" style="padding:0 36px 26px;">
            <a href="${CATALOGUE_URL}" style="display:inline-block;background:linear-gradient(90deg,#E05540,#E8923A);color:#0a0e1a;font-size:15px;font-weight:700;text-decoration:none;padding:14px 34px;border-radius:6px;">&#8595; Download Product Catalogue</a>
          </td></tr>
          <!-- Divider -->
          <tr><td style="padding:0 36px;"><div style="border-top:1px solid #1f2738;"></div></td></tr>
          <!-- Contact -->
          <tr><td style="padding:22px 36px;color:#8a97a8;font-size:13px;line-height:1.8;">
            <p style="margin:0 0 6px;color:#ffffff;font-size:14px;font-weight:700;">Sunmount Solutions Private Limited</p>
            <p style="margin:0;">Surya Koti, Bajekan-Sirsa Main Road, Sirsa, Haryana 125055</p>
            <p style="margin:6px 0 0;">📞 +91 7837 999 222 &nbsp;|&nbsp; +91 8531 999 222</p>
            <p style="margin:2px 0 0;">✉️ <a href="mailto:${SALES_EMAIL}" style="color:#E8923A;text-decoration:none;">${SALES_EMAIL}</a> &nbsp;|&nbsp; 🌐 <a href="${SITE}" style="color:#E8923A;text-decoration:none;">www.sunmount.in</a></p>
            <p style="margin:14px 0 0;color:#5b6677;font-size:11px;">ISO 9001 Certified · TÜV SÜD Certified · MSME Registered · Made in India</p>
          </td></tr>
        </table>
        <p style="color:#5b6677;font-size:11px;margin:16px 0 0;">You received this email because you submitted an enquiry at www.sunmount.in</p>
      </td></tr>
    </table>
  </div>`
}

/* ── Internal lead-notification email ──────────────────────────── */
function notificationHtml(f) {
  const row = (label, val) => `
    <tr>
      <td style="padding:8px 12px;background:#0f1420;border:1px solid #1f2738;color:#8a97a8;font-size:12px;font-family:monospace;white-space:nowrap;">${esc(label)}</td>
      <td style="padding:8px 12px;border:1px solid #1f2738;color:#ffffff;font-size:14px;">${esc(val || '—')}</td>
    </tr>`
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;background:#0a0e1a;padding:24px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#10141f;border:1px solid #1f2738;border-radius:8px;overflow:hidden;">
      <tr><td style="height:4px;background:linear-gradient(90deg,#E05540,#E8923A);"></td></tr>
      <tr><td style="padding:22px 28px 8px;">
        <h2 style="margin:0;color:#fff;font-size:18px;">🔔 New Website Enquiry</h2>
        <p style="margin:6px 0 0;color:#8a97a8;font-size:13px;">via the Contact form on www.sunmount.in</p>
      </td></tr>
      <tr><td style="padding:16px 28px 24px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
          ${row('Name', f.name)}
          ${row('Company', f.company)}
          ${row('Email', f.email)}
          ${row('Phone', f.phone)}
          ${row('Requirement', f.requirement)}
          ${row('Message', f.message)}
        </table>
      </td></tr>
    </table>
  </div>`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: 'Method not allowed' })
    return
  }

  const body = await readBody(req)
  const f = {
    name:        (body.name || '').trim(),
    company:     (body.company || '').trim(),
    email:       (body.email || '').trim(),
    phone:       (body.phone || '').trim(),
    requirement: (body.requirement || '').trim(),
    message:     (body.message || '').trim(),
  }

  // Basic validation
  if (!f.name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)) {
    res.status(400).json({ success: false, message: 'Name and a valid email are required.' })
    return
  }

  // ── No Resend key yet → fall back to Web3Forms so leads are still captured ──
  if (!process.env.RESEND_API_KEY) {
    try {
      const r = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `New Enquiry from ${f.name} — ${f.requirement || 'General'}`,
          from_name: f.name, email: f.email, phone: f.phone || '—',
          company: f.company || '—', requirement: f.requirement || '—', message: f.message || '—',
        }),
      })
      const data = await r.json()
      res.status(r.ok ? 200 : 502).json({ success: !!data.success, autoReply: false, message: data.message })
    } catch (e) {
      res.status(502).json({ success: false, message: 'Submission failed. Please email us directly.' })
    }
    return
  }

  // ── Resend configured → send notification + customer auto-reply ──
  try {
    // Notification to sales (reply-to = customer so they can reply directly)
    await sendViaResend({
      to: SALES_EMAIL,
      replyTo: f.email,
      subject: `New Enquiry — ${f.name}${f.requirement ? ` (${f.requirement})` : ''}`,
      html: notificationHtml(f),
    })

    // Auto-reply to the customer
    await sendViaResend({
      to: f.email,
      replyTo: SALES_EMAIL,
      subject: 'Thank you for contacting Sunmount Solutions ☀️',
      html: autoReplyHtml(f),
    })

    res.status(200).json({ success: true, autoReply: true })
  } catch (e) {
    // Resend failed — fall back to Web3Forms so the lead is not lost
    try {
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `New Enquiry from ${f.name} — ${f.requirement || 'General'} (auto-reply failed)`,
          from_name: f.name, email: f.email, phone: f.phone || '—',
          company: f.company || '—', requirement: f.requirement || '—', message: f.message || '—',
        }),
      })
    } catch {}
    res.status(200).json({ success: true, autoReply: false, message: String(e.message || e) })
  }
}
