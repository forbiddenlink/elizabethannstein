'use client'

import { AlertCircle, Check, Loader2, Send } from 'lucide-react'
import { useState } from 'react'
import { analytics } from '@/components/Analytics'
import { CONTACT } from '@/lib/constants'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

const MAX_MESSAGE_LENGTH = 5000

export function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sentEmail, setSentEmail] = useState('')
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })

      const data = (await res.json()) as { ok?: boolean; error?: string }

      if (!res.ok || !data.ok) {
        setStatus('error')
        setErrorMsg(data.error ?? 'Something went wrong. Please try again.')
        return
      }

      setSentEmail(email)
      setStatus('success')
      analytics.contactSubmit()
      setName('')
      setEmail('')
      setMessage('')
    } catch {
      setStatus('error')
      setErrorMsg('Network error. Check your connection and try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/20 mb-4">
          <Check className="w-7 h-7 text-emerald-400" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Message sent!</h3>
        <p className="text-white/60">
          I&apos;ll get back to you at <span className="text-white/80">{sentEmail}</span> within 24
          hours.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-6 text-sm text-purple-400 hover:text-purple-300 transition-colors"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">
          Your Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
          autoCapitalize="words"
          placeholder="Jane Smith"
          className="input-glass w-full"
          disabled={status === 'submitting'}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
          Your Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          inputMode="email"
          placeholder="jane@company.com"
          className="input-glass w-full"
          disabled={status === 'submitting'}
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-white/80 mb-2">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={5}
          autoCapitalize="sentences"
          maxLength={MAX_MESSAGE_LENGTH}
          placeholder="Tell me about your project or opportunity..."
          className="input-glass w-full resize-none"
          disabled={status === 'submitting'}
        />
        <div className="flex justify-end mt-1">
          <span
            className={`text-[10px] tabular-nums transition-colors ${
              message.length > MAX_MESSAGE_LENGTH * 0.9 ? 'text-warning/70' : 'text-white/25'
            }`}
          >
            {message.length.toLocaleString()} / {MAX_MESSAGE_LENGTH.toLocaleString()}
          </span>
        </div>
      </div>

      {status === 'error' && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="btn btn-primary w-full py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === 'submitting' ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Sending…</span>
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            <span>Send Message</span>
          </>
        )}
      </button>

      <p className="text-white/40 text-xs text-center">
        I typically respond within 24 hours. Or email me directly at{' '}
        <a href={`mailto:${CONTACT.email}`} className="text-purple-400/70 hover:text-purple-400">
          {CONTACT.email}
        </a>
        .
      </p>
    </form>
  )
}
