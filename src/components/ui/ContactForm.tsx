'use client'

import { AlertCircle, Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { analytics } from '@/components/Analytics'
import { CONTACT } from '@/lib/constants'
import { EMAIL_PATTERN } from '@/lib/contactValidation'
import styles from './ContactForm.module.css'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

const MAX_MESSAGE_LENGTH = 5000

type Field = 'name' | 'email' | 'message'
type FieldErrors = Partial<Record<Field, string>>
const FIELD_ORDER: Field[] = ['name', 'email', 'message']

function validate(name: string, email: string, message: string): FieldErrors {
  const errors: FieldErrors = {}
  if (!name.trim()) errors.name = 'Enter your name.'
  if (!email.trim()) errors.email = 'Enter your email address.'
  else if (!EMAIL_PATTERN.test(email.trim()))
    errors.email = 'Enter a valid email address, like jane@company.com.'
  if (!message.trim()) errors.message = 'Enter a message.'
  return errors
}

export function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sentEmail, setSentEmail] = useState('')
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  // Announced on every failed submit, so a repeat attempt is read out again.
  const [summary, setSummary] = useState('')
  // Honeypot: hidden from real users; only bots fill it.
  const [company, setCompany] = useState('')
  const successHeadingRef = useRef<HTMLHeadingElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)
  const emailInputRef = useRef<HTMLInputElement>(null)
  const messageInputRef = useRef<HTMLTextAreaElement>(null)
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

  const clearError = (field: Field) => {
    if (fieldErrors[field]) setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Native constraint bubbles never reach the accessibility tree, so the form opts out
    // with noValidate and reports errors itself: inline text, aria-invalid, focus, and a summary.
    const errors = validate(name, email, message)
    setFieldErrors(errors)
    const invalid = FIELD_ORDER.filter((f) => errors[f])
    if (invalid.length > 0) {
      const count =
        invalid.length === 1 ? '1 field needs attention' : `${invalid.length} fields need attention`
      // Toggle so identical text still changes the live region and is re-announced.
      setSummary((prev) => (prev.endsWith('.') ? `${count}:` : `${count}.`))
      const refs = { name: nameInputRef, email: emailInputRef, message: messageInputRef }
      refs[invalid[0]].current?.focus()
      return
    }
    setSummary('')
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

      setFieldErrors({})
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
          It&apos;s in my inbox. I&apos;ll reply to{' '}
          <strong style={{ color: 'var(--le-ink)' }}>{sentEmail}</strong>.
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
    <form onSubmit={handleSubmit} noValidate className={styles.form}>
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
          onChange={(e) => {
            setName(e.target.value)
            clearError('name')
          }}
          required
          aria-invalid={fieldErrors.name ? true : undefined}
          aria-describedby={fieldErrors.name ? 'name-error' : undefined}
          autoComplete="name"
          autoCapitalize="words"
          placeholder="Jane Smith"
          className={styles.input}
          disabled={status === 'submitting'}
        />
        <FieldError id="name-error" message={fieldErrors.name} />
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
          ref={emailInputRef}
          onChange={(e) => {
            setEmail(e.target.value)
            clearError('email')
          }}
          required
          aria-invalid={fieldErrors.email ? true : undefined}
          aria-describedby={fieldErrors.email ? 'email-error' : undefined}
          autoComplete="email"
          inputMode="email"
          placeholder="jane@company.com"
          className={styles.input}
          disabled={status === 'submitting'}
        />
        <FieldError id="email-error" message={fieldErrors.email} />
      </div>

      <div className={styles.field}>
        <label htmlFor="message" className={styles.label}>
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={message}
          ref={messageInputRef}
          onChange={(e) => {
            setMessage(e.target.value)
            clearError('message')
          }}
          required
          aria-invalid={fieldErrors.message ? true : undefined}
          aria-describedby={fieldErrors.message ? 'message-error' : undefined}
          rows={5}
          autoCapitalize="sentences"
          maxLength={MAX_MESSAGE_LENGTH}
          placeholder="What are you working on, and when do you need it?"
          className={styles.textarea}
          disabled={status === 'submitting'}
        />
        <FieldError id="message-error" message={fieldErrors.message} />
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

      <p role="status" aria-live="polite" className="sr-only">
        {summary}
      </p>

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
        Prefer email? Write to{' '}
        <a href={`mailto:${CONTACT.email}`} className="eLink">
          {CONTACT.email}
        </a>
        .
      </p>
    </form>
  )
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className={styles.fieldError}>
      <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </p>
  )
}
