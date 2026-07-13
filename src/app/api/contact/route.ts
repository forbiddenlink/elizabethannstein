import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { CONTACT, SITE } from '@/lib/constants'

// Set RESEND_API_KEY in your .env.local / Vercel environment variables.
// Emails will be forwarded to the address set in CONTACT_FORWARD_TO
// (defaults to purplegumdropz@gmail.com when the env var isn't set).
const FORWARD_TO = process.env.CONTACT_FORWARD_TO ?? 'purplegumdropz@gmail.com'

// Simple sanitizer: strips HTML tags, then removes control chars and CR/LF
// so a crafted name/email cannot inject headers into the email subject.
function sanitize(value: string): string {
  let out = value
  let prev: string
  do {
    prev = out
    out = out.replace(/<[^>]*>/g, '')
  } while (out !== prev)
  // biome-ignore lint/suspicious/noControlCharactersInRegex: intentionally stripping control chars
  out = out.replace(/[\u0000-\u001f\u007f]/g, ' ')
  return out.trim()
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const safeName = sanitize(name)
    const safeEmail = sanitize(email)
    const safeMessage = sanitize(message)

    if (!process.env.RESEND_API_KEY) {
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
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
        <hr />
        <p style="white-space:pre-wrap">${safeMessage.replace(/\n/g, '<br />')}</p>
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
