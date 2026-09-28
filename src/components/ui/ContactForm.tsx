'use client'

import { AlertCircle, Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { analytics } from '@/components/Analytics'
import { CONTACT } from '@/lib/constants'
import styles from './ContactForm.module.css'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

const MAX_MESSAGE_LENGTH = 5000

export function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sentEmail, setSentEmail] = useState('')
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  // Honeypot: hidden from real users; only bots fill it.
  const [company, setCompany] = useState('')
  const successHeadingRef = useRef<HTMLHeadingElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)
  // Set when the visitor asks to send another message, so focus lands on the first field
  // instead of falling back to <body> when the success panel unmounts.
  const focusNameOnReturn = useRef(false)

  useEffect(() => {
    // Swapping the form for the success panel removes the focused button from the page;
    // move focus to the confirmation so keyboard and screen-reader users keep their place.
    if (status === 'success') successHeadingRef.current?.focus()
    if (status === 'idle' && focusNameOnReturn.current) {
      focusNameOnReturn.current = false
      nameInputRef.current?.focus()
    }
  }, [status])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, company }),
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
      <div role="status" aria-live="polite" className={styles.success}>
        <p className="eLabel" style={{ color: 'var(--le-live-ink)' }}>
          <span className="eStateDot" aria-hidden="true" />
          Sent
        </p>
        <h3 ref={successHeadingRef} tabIndex={-1} className={styles.successTitle}>
          Message received.
        </h3>
        <p className={styles.successText}>
          I&apos;ll reply to <strong style={{ color: 'var(--le-ink)' }}>{sentEmail}</strong> within
          24 hours.
        </p>
        <button
          type="button"
          onClick={() => {
            focusNameOnReturn.current = true
            setStatus('idle')
          }}
          className={styles.successAgain}
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* Honeypot field: real users never see or fill this; bots do. */}
      <input
        type="text"
        name="company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />
      <div className={styles.field}>
        <label htmlFor="name" className={styles.label}>
          Name
        </label>
        <input
          type="text"
          ref={nameInputRef}
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
          autoCapitalize="words"
          placeholder="Jane Smith"
          className={styles.input}
          disabled={status === 'submitting'}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="email" className={styles.label}>
          Email
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
          className={styles.input}
          disabled={status === 'submitting'}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="message" className={styles.label}>
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
          className={styles.textarea}
          disabled={status === 'submitting'}
        />
        <div className="flex justify-end mt-1">
          <span
            className={`${styles.count} ${
              message.length > MAX_MESSAGE_LENGTH * 0.9 ? styles.countWarn : ''
            }`}
          >
            {message.length.toLocaleString()} / {MAX_MESSAGE_LENGTH.toLocaleString()}
          </span>
        </div>
      </div>

      {status === 'error' && (
        <div role="alert" aria-live="assertive" className={styles.error}>
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className={`eBtn eBtnPrimary ${styles.submit}`}
      >
        {status === 'submitting' ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Sending</span>
          </>
        ) : (
          <span>Send message</span>
        )}
      </button>

      <p className={styles.note}>
        I typically respond within 24 hours. Or email me directly at{' '}
        <a href={`mailto:${CONTACT.email}`} className="eLink">
          {CONTACT.email}
        </a>
        .
      </p>
    </form>
  )
}
