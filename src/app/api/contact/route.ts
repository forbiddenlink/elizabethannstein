import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { CONTACT, SITE } from '@/lib/constants'
import { EMAIL_PATTERN } from '@/lib/contactValidation'

// Set RESEND_API_KEY in your .env.local / Vercel environment variables.
// Emails will be forwarded to the address set in CONTACT_FORWARD_TO
// (defaults to purplegumdropz@gmail.com when the env var isn't set).
const FORWARD_TO = process.env.CONTACT_FORWARD_TO ?? 'purplegumdropz@gmail.com'

// Header-safe single line: removes control chars and CR/LF so a crafted
// name/email cannot inject headers into the email subject or reply-to.
function singleLine(value: string): string {
  // biome-ignore lint/suspicious/noControlCharactersInRegex: intentionally stripping control chars
  return value.replace(/[\u0000-\u001f\u007f]/g, ' ').trim()
}

// Escape for the HTML body. Escaping (not tag stripping) keeps the visitor's
// text intact: "x < 5 and y > 3" arrives as written instead of losing " 5 and y ".
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function POST(request: Request) {
  try {
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }
    // Parsed JSON is an object, array or primitive; only a plain object carries the fields.
    if (!(body instanceof Object) || Array.isArray(body)) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }
    const { name, email, message, company } = body as Record<string, unknown>

    // Honeypot: real users never fill the hidden "company" field. If it's
    // populated, silently accept without sending so bots get no signal.
    if (typeof company === 'string' && company.trim() !== '') {
      return NextResponse.json({ ok: true })
    }

    // Validate required fields
    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof message !== 'string' ||
      !name.trim() ||
      !email.trim() ||
      !message.trim()
    ) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Field length guards (prevent abuse)
    if (name.length > 100 || email.length > 254 || message.length > 5000) {
      return NextResponse.json({ error: 'Input too long' }, { status: 400 })
    }

    // Basic email format check
    if (!EMAIL_PATTERN.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const safeName = singleLine(name)
    const safeEmail = singleLine(email)
    const safeMessage = message.trim()

    if (!process.env.RESEND_API_KEY) {
      if (process.env.NODE_ENV === 'production') {
        // Never tell a real visitor the message was received when nothing was sent.
        console.error('[contact] RESEND_API_KEY not set in production; email not sent')
        return NextResponse.json(
          { error: 'Email service is temporarily unavailable. Please email me directly.' },
          { status: 503 }
        )
      }
      // Dev / demo mode — avoid logging visitor PII; UI still returns success
      console.warn('[contact] RESEND_API_KEY not set; email not sent (dev mode)')
      return NextResponse.json({ ok: true, dev: true })
    }

    const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
      // Resend requires a verified domain for the "from" address.
      // If you haven't verified elizabethannstein.com yet, use the
      // sandbox default: 'onboarding@resend.dev' while you set up DNS.
      from: `${SITE.name} Portfolio <${CONTACT.email}>`,
      to: FORWARD_TO,
      replyTo: safeEmail,
      subject: `Portfolio message from ${safeName}`,
      text: `Name: ${safeName}\nEmail: ${safeEmail}\n\n${safeMessage}`,
      html: `
        <p><strong>Name:</strong> ${escapeHtml(safeName)}</p>
        <p><strong>Email:</strong> <a href="mailto:${escapeHtml(safeEmail)}">${escapeHtml(safeEmail)}</a></p>
        <hr />
        <p style="white-space:pre-wrap">${escapeHtml(safeMessage).replace(/\n/g, '<br />')}</p>
        <hr />
        <p style="color:#888;font-size:12px">Sent via ${SITE.url}/contact</p>
      `,
    })

    if (error) {
      console.error('[contact] Resend error:', error)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[contact] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
