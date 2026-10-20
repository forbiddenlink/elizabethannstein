import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ContactForm } from '@/components/ui/ContactForm'

const submit = () => fireEvent.click(screen.getByRole('button', { name: 'Send message' }))

describe('ContactForm validation', () => {
  afterEach(() => vi.restoreAllMocks())

  it('flags every empty field, announces a summary and focuses the first one', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    render(<ContactForm />)
    submit()

    const name = screen.getByLabelText('Name')
    const email = screen.getByLabelText('Email')
    const message = screen.getByLabelText('Message')
    for (const field of [name, email, message]) {
      expect(field.getAttribute('aria-invalid')).toBe('true')
      const errorId = field.getAttribute('aria-describedby')
      expect(errorId).toBeTruthy()
      expect(document.getElementById(errorId as string)?.textContent).toMatch(/enter/i)
    }
    expect(document.activeElement).toBe(name)
    expect(screen.getByRole('status').textContent).toMatch(/3 fields need attention/i)
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('rejects an invalid email without sending and focuses the email field', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    render(<ContactForm />)
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test User' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'not-an-email' } })
    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Test message' } })
    submit()

    const email = screen.getByLabelText('Email')
    expect(email.getAttribute('aria-invalid')).toBe('true')
    expect(
      document.getElementById(email.getAttribute('aria-describedby') as string)?.textContent
    ).toMatch(/valid email/i)
    expect(screen.getByLabelText('Name').getAttribute('aria-invalid')).toBeNull()
    expect(document.activeElement).toBe(email)
    expect(screen.getByRole('status').textContent).toMatch(/1 field needs attention/i)
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('clears a field error once the visitor fixes it', () => {
    render(<ContactForm />)
    submit()
    const name = screen.getByLabelText('Name')
    fireEvent.change(name, { target: { value: 'Test User' } })
    expect(name.getAttribute('aria-invalid')).toBeNull()
  })
})
