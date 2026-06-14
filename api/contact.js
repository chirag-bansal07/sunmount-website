/**
 * Customer auto-reply — Vercel serverless function.
 *
 * Sends a comprehensive thank-you email to the customer FROM sales@sunmount.in
 * (thank-you + request for requirement & site layout + catalogue link), via
 * Resend (https://resend.com).
 *
 * This is called fire-and-forget from the contact form AFTER the lead has
 * already been captured by Web3Forms (client-side). It therefore NEVER blocks
 * or fails the form: if RESEND_API_KEY is not configured, or the send fails,
 * it simply returns 200 with autoReply:false.
 *
 * Setup: add RESEND_API_KEY in the Vercel project env and verify the
 * sunmount.in domain in Resend.
 */

const SALES_EMAIL   = 'sales@sunmount.in'
const FROM          = 'Sunmount Solutions <sales@sunmount.in>'
const SITE          = 'https://www.sunmount.in'
const CATALOGUE_URL = 'https://www.sunmount.in/catalogue.pdf'
const LOGO_URL      = 'https://www.sunmount.in/logo.png'

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
          <tr><td style="height:4px;background:linear-gradient(90deg,#E05540,#E8923A);"></td></tr>
          <tr><td align="center" style="padding:28px 24px 8px;">
            <img src="${LOGO_URL}" alt="Sunmount Solutions" width="180" style="max-width:180px;height:auto;display:block;" />
          </td></tr>
          <tr><td style="padding:12px 36px 0;">
            <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;line-height:1.3;">Thank you for reaching out, ${esc(first)}! &#9728;&#65039;</h1>
          </td></tr>
          <tr><td style="padding:14px 36px 4px;color:#c9d4e0;font-size:15px;line-height:1.75;">
            <p style="margin:0 0 16px;">We've received your enquiry at <strong style="color:#fff;">Sunmount Solutions Private Limited</strong> and we're glad you're considering us for your solar mounting requirements. Our team will get back to you shortly.</p>
            <p style="margin:0 0 10px;">To help us prepare the <strong style="color:#fff;">most accurate quote</strong> for your project, please reply to this email with:</p>
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px;">
              <tr><td style="color:#E8923A;font-size:15px;padding:3px 10px 3px 0;vertical-align:top;">&#10003;</td><td style="color:#c9d4e0;font-size:15px;line-height:1.6;padding:3px 0;">Your detailed <strong style="color:#fff;">requirement</strong> (system type, panel count, roof type)</td></tr>
              <tr><td style="color:#E8923A;font-size:15px;padding:3px 10px 3px 0;vertical-align:top;">&#10003;</td><td style="color:#c9d4e0;font-size:15px;line-height:1.6;padding:3px 0;">Your <strong style="color:#fff;">site layout</strong> — roof drawings, dimensions, or photos</td></tr>
            </table>
            <p style="margin:0 0 22px;">In the meantime, here's our complete product catalogue covering every mounting system we offer:</p>
          </td></tr>
          <tr><td align="center" style="padding:0 36px 26px;">
            <a href="${CATALOGUE_URL}" style="display:inline-block;background:linear-gradient(90deg,#E05540,#E8923A);color:#0a0e1a;font-size:15px;font-weight:700;text-decoration:none;padding:14px 34px;border-radius:6px;">&#8595; Download Product Catalogue</a>
          </td></tr>
          <tr><td style="padding:0 36px;"><div style="border-top:1px solid #1f2738;"></div></td></tr>
          <tr><td style="padding:22px 36px;color:#8a97a8;font-size:13px;line-height:1.8;">
            <p style="margin:0 0 6px;color:#ffffff;font-size:14px;font-weight:700;">Sunmount Solutions Private Limited</p>
            <p style="margin:0;">Surya Koti, Bajekan-Sirsa Main Road, Sirsa, Haryana 125055</p>
            <p style="margin:6px 0 0;">&#128222; +91 7837 999 222 &nbsp;|&nbsp; +91 8531 999 222</p>
            <p style="margin:2px 0 0;">&#9993;&#65039; <a href="mailto:${SALES_EMAIL}" style="color:#E8923A;text-decoration:none;">${SALES_EMAIL}</a> &nbsp;|&nbsp; &#127760; <a href="${SITE}" style="color:#E8923A;text-decoration:none;">www.sunmount.in</a></p>
            <p style="margin:14px 0 0;color:#5b6677;font-size:11px;">ISO 9001 Certified &middot; T&Uuml;V S&Uuml;D Certified &middot; MSME Registered &middot; Made in India</p>
          </td></tr>
        </table>
        <p style="color:#5b6677;font-size:11px;margin:16px 0 0;">You received this email because you submitted an enquiry at www.sunmount.in</p>
      </td></tr>
    </table>
  </div>`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: 'Method not allowed' })
    return
  }

  const body  = await readBody(req)
  const name  = (body.name || '').trim()
  const email = (body.email || '').trim()

  const validEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)

  // Not configured yet, or no usable email → no-op (the lead is already
  // captured client-side by Web3Forms; this endpoint only adds the auto-reply).
  if (!process.env.RESEND_API_KEY || !validEmail) {
    res.status(200).json({ success: true, autoReply: false, reason: !validEmail ? 'invalid-email' : 'not-configured' })
    return
  }

  try {
    await sendViaResend({
      to: email,
      replyTo: SALES_EMAIL,
      subject: 'Thank you for contacting Sunmount Solutions',
      html: autoReplyHtml({ name }),
    })
    res.status(200).json({ success: true, autoReply: true })
  } catch (e) {
    // Never fail the form over the auto-reply — just report it.
    res.status(200).json({ success: true, autoReply: false, error: String(e.message || e) })
  }
}
