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

async function sendViaResend({ to, subject, html, text, replyTo, attachments }) {
  const payload = { from: FROM, to, subject, html, reply_to: replyTo }
  if (text) payload.text = text
  if (attachments) payload.attachments = attachments
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Resend ${res.status}: ${text}`)
  }
  return res.json()
}

/* ── Customer auto-reply — plain text (helps land in Primary, not Promotions) ── */
function autoReplyText({ name }) {
  const first = (name || '').trim().split(/\s+/)[0] || 'there'
  return `Hi ${first},

Thank you for reaching out to Sunmount Solutions Private Limited. We've received your enquiry and our sales representative will contact you soon.

To help us prepare the most accurate quote for your project, please reply to this email with:
  - Your detailed requirement (system type, panel count, roof type)
  - Your site layout (roof drawings, dimensions, or photos)

We've attached our complete product catalogue to this email for your reference.

Warm regards,
Sales Team
Sunmount Solutions Private Limited
Surya Koti, Bajekan-Sirsa Main Road, Sirsa, Haryana 125055
Phone: +91 7837 999 222 / +91 8531 999 222
Email: ${SALES_EMAIL}
Web: ${SITE}`
}

/* ── Customer auto-reply — light, letter-style HTML (transactional look) ──
   Deliberately simple: light background, one small logo, plenty of plain
   text, minimal styling. This reads as a personal/transactional email so
   Gmail is far more likely to place it in Primary rather than Promotions. */
function autoReplyHtml({ name }) {
  const first = (name || '').trim().split(/\s+/)[0] || 'there'
  return `
  <div style="margin:0;padding:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;">
      <tr><td align="center" style="padding:24px 16px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
          <tr><td style="padding:0 4px 16px;">
            <img src="${LOGO_URL}" alt="Sunmount Solutions" width="150" style="max-width:150px;height:auto;display:block;" />
          </td></tr>
          <tr><td style="padding:0 4px;color:#1f2937;font-size:15px;line-height:1.7;">
            <p style="margin:0 0 16px;">Hi ${esc(first)},</p>
            <p style="margin:0 0 16px;">Thank you for reaching out to <strong>Sunmount Solutions Private Limited</strong>. We've received your enquiry and <strong>our sales representative will contact you soon.</strong></p>
            <p style="margin:0 0 8px;">To help us prepare the most accurate quote for your project, please reply to this email with:</p>
            <ul style="margin:0 0 16px;padding:0 0 0 20px;color:#374151;">
              <li style="margin:0 0 6px;">Your detailed <strong>requirement</strong> (system type, panel count, roof type)</li>
              <li style="margin:0;">Your <strong>site layout</strong> — roof drawings, dimensions, or photos</li>
            </ul>
            <p style="margin:0 0 20px;">We've <strong>attached our complete product catalogue</strong> to this email for your reference.</p>
            <p style="margin:0 0 4px;">Warm regards,</p>
            <p style="margin:0 0 20px;"><strong>Sales Team — Sunmount Solutions</strong></p>
          </td></tr>
          <tr><td style="padding:16px 4px 0;border-top:1px solid #e5e7eb;color:#6b7280;font-size:13px;line-height:1.7;">
            <p style="margin:0;color:#111827;font-weight:700;">Sunmount Solutions Private Limited</p>
            <p style="margin:2px 0 0;">Surya Koti, Bajekan-Sirsa Main Road, Sirsa, Haryana 125055</p>
            <p style="margin:2px 0 0;">+91 7837 999 222 &nbsp;|&nbsp; +91 8531 999 222</p>
            <p style="margin:2px 0 0;"><a href="mailto:${SALES_EMAIL}" style="color:#c2410c;text-decoration:none;">${SALES_EMAIL}</a> &nbsp;|&nbsp; <a href="${SITE}" style="color:#c2410c;text-decoration:none;">www.sunmount.in</a></p>
          </td></tr>
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
      text: autoReplyText({ name }),
      attachments: [{ filename: 'Sunmount-Solutions-Catalogue.pdf', path: CATALOGUE_URL }],
    })
    res.status(200).json({ success: true, autoReply: true })
  } catch (e) {
    // Never fail the form over the auto-reply — just report it.
    res.status(200).json({ success: true, autoReply: false, error: String(e.message || e) })
  }
}
