'use client'

import Link from 'next/link'
import React from 'react'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="w-full h-dvh bg-black flex items-center justify-center p-8">
          <div className="max-w-2xl text-center">
            <div
              className="rounded-lg p-12"
              style={{
                background: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
              }}
            >
              <h1 className="text-4xl font-bold mb-4 text-white">3D Experience Unavailable</h1>
              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                Your browser or device doesn't support WebGL, which is required for the 3D galaxy
                experience. Don't worry, you can still view all my work in the traditional view.
              </p>
              <Link
                href="/work"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white/15 border border-white/30 text-white font-semibold hover:bg-white/25 hover:border-white/40 transition-all duration-300 rounded-xl shadow-2xl hover:shadow-white/20 hover:scale-105"
              >
                <span>View Projects</span>
                <span className="text-2xl">→</span>
              </Link>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Scene3D-specific error boundary with retry functionality
interface Scene3DErrorBoundaryProps {
  children: React.ReactNode
  maxRetries?: number
  retryDelay?: number
}

interface Scene3DErrorBoundaryState {
  hasError: boolean
  error?: Error
  retryCount: number
  isRetrying: boolean
}

export class Scene3DErrorBoundary extends React.Component<
  Scene3DErrorBoundaryProps,
  Scene3DErrorBoundaryState
> {
  private retryTimeoutId: ReturnType<typeof setTimeout> | null = null

  constructor(props: Scene3DErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, retryCount: 0, isRetrying: false }
  }

  static getDerivedStateFromError(error: Error): Partial<Scene3DErrorBoundaryState> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[Scene3D] Error caught:', error.message)
    console.debug('[Scene3D] Error info:', errorInfo)

    // Auto-retry for network/loading errors
    const maxRetries = this.props.maxRetries ?? 3
    const retryDelay = this.props.retryDelay ?? 2000
    const isNetworkError =
      error.message.includes('fetch') ||
      error.message.includes('load') ||
      error.message.includes('network') ||
      error.message.includes('Failed to fetch')

    if (isNetworkError && this.state.retryCount < maxRetries) {
      this.setState({ isRetrying: true })
      this.retryTimeoutId = setTimeout(() => {
        this.handleRetry()
      }, retryDelay)
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId)
    }
  }

  handleRetry = () => {
    this.setState((prevState) => ({
      hasError: false,
      error: undefined,
      retryCount: prevState.retryCount + 1,
      isRetrying: false,
    }))
  }

  handleManualRetry = () => {
    this.setState({
      hasError: false,
      error: undefined,
      retryCount: 0,
      isRetrying: false,
    })
  }

  render() {
    const { hasError, error, retryCount, isRetrying } = this.state
    const maxRetries = this.props.maxRetries ?? 3

    if (hasError) {
      const canRetry = retryCount < maxRetries
      const isNetworkError =
        error?.message.includes('fetch') ||
        error?.message.includes('load') ||
        error?.message.includes('network')

      if (isRetrying) {
        return (
          <div className="w-full h-full bg-[#020108] flex flex-col items-center justify-center p-8">
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                background:
                  'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(99,102,241,0.12), transparent 55%)',
              }}
            />
            <div className="relative mb-6 h-1 w-40 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-full animate-pulse rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500" />
            </div>
            <p className="relative text-sm text-white/60">
              Retrying... ({retryCount + 1}/{maxRetries})
            </p>
          </div>
        )
      }

      return (
        <div className="w-full h-full bg-[#020108] flex flex-col items-center justify-center p-8">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(239,68,68,0.08), transparent 55%)',
            }}
          />
          <div className="relative max-w-md text-center">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-red-400/60">
              {isNetworkError ? 'Connection Issue' : '3D Scene Error'}
            </p>
            <h2 className="mb-3 text-2xl font-bold tracking-tight text-white">
              {isNetworkError ? 'Having trouble loading' : 'Something went wrong'}
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-white/55">
              {isNetworkError
                ? "The 3D assets couldn't be loaded. Check your connection and try again."
                : 'The 3D experience encountered an error. You can try again or view projects in the traditional view.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {canRetry && (
                <button
                  type="button"
                  onClick={this.handleManualRetry}
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/10 px-6 py-3 text-sm font-medium text-purple-300 transition-all hover:border-purple-500/50 hover:bg-purple-500/20"
                >
                  Try Again
                </button>
              )}
              <Link
                href="/work"
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] px-6 py-3 text-sm font-medium text-white/90 transition-colors hover:border-white/25 hover:bg-white/10"
              >
                View Projects →
              </Link>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
