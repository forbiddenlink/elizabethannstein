'use client'

import { CONTACT } from '@/lib/constants'
import { Check, Copy, ExternalLink, Send } from 'lucide-react'
import type { ComponentProps } from 'react'
import { useState } from 'react'

type FormStatus = 'idle' | 'ready'
type FormSubmitEvent = Parameters<NonNullable<ComponentProps<'form'>['onSubmit']>>[0]

export function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<FormStatus>('idle')
  const [copied, setCopied] = useState(false)

  const getMessageText = () => {
    return `Hi Elizabeth,\n\n${message}\n\n---\nFrom: ${name}\nEmail: ${email}`
  }

  const getMailtoUrl = () => {
    const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`)
    const body = encodeURIComponent(getMessageText())
    return `mailto:${CONTACT.email}?subject=${subject}&body=${body}`
  }

  const handleCopyToClipboard = async () => {
    try {
      await globalThis.navigator.clipboard.writeText(getMessageText())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  const handleSubmit = (e: FormSubmitEvent) => {
    e.preventDefault()
    setStatus('ready')
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
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Jane Smith"
          className="input-glass w-full"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
          Your Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="jane@company.com"
          className="input-glass w-full"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-white/80 mb-2">
          Message
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={5}
          placeholder="Tell me about your project or opportunity..."
          className="input-glass w-full resize-none"
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary w-full py-4 text-base"
      >
        <Send className="w-5 h-5" />
        <span>{status === 'ready' ? 'Update Email Draft' : 'Prepare Email Draft'}</span>
      </button>

      {status === 'ready' && (
        <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
          <h3 className="text-xl font-semibold mb-2">Message ready to send</h3>
          <p className="text-white/70 mb-4">
            This site does not send email directly. Use your email app or copy the message below.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={getMailtoUrl()}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-lg text-sm font-medium text-emerald-200 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              Open email app
            </a>
            <button
              type="button"
              onClick={handleCopyToClipboard}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-all"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy message'}
            </button>
          </div>
          <p className="text-white/40 text-sm mt-4">
            Prefer to email directly? Send it to{' '}
            <a href={`mailto:${CONTACT.email}`} className="text-purple-400 hover:text-purple-300">
              {CONTACT.email}
            </a>{' '}
            instead.
          </p>
        </div>
      )}

      <p className="text-white/40 text-xs text-center">
        I typically respond within 24 hours. Preparing a draft keeps the flow reliable even if your
        browser does not support direct email sending.
      </p>
    </form>
  )
}
