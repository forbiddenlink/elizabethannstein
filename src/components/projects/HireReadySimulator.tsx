'use client'

import { Award, Mic, Pause, Play } from 'lucide-react'
import { useState } from 'react'

interface QuestionTrack {
  company: string
  role: string
  question: string
  difficulty: 'Mid' | 'Senior' | 'Staff'
  fsrsInterval: string
}

const QUESTIONS: QuestionTrack[] = [
  {
    company: 'Stripe',
    role: 'Full-Stack Engineer',
    question:
      'How do you ensure idempotency across distributed webhook event processing pipelines?',
    difficulty: 'Senior',
    fsrsInterval: 'Spaced review',
  },
  {
    company: 'Google',
    role: 'Front-End / UX Engineer',
    question:
      'Design a virtualized rendering pipeline for 100,000 streaming data points at 60 FPS.',
    difficulty: 'Senior',
    fsrsInterval: 'Spaced review',
  },
  {
    company: 'Meta',
    role: 'Systems Engineer',
    question:
      'Explain how Conflict-Free Replicated Data Types (CRDTs) resolve state divergent edits offline.',
    difficulty: 'Staff',
    fsrsInterval: 'Spaced review',
  },
]

export function HireReadySimulator() {
  const [selectedTrack, setSelectedTrack] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)

  const current = QUESTIONS[selectedTrack]

  const simulateAnswer = () => {
    setIsPlaying(true)
    setTimeout(() => {
      setIsPlaying(false)
      setShowFeedback(true)
    }, 2400)
  }

  return (
    <div className="w-full rounded-lg overflow-hidden border border-neutral-800 bg-[#0c0d16] text-gray-200 font-sans shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-x-3 px-4 py-3 bg-[#151726] border-b border-neutral-800 text-xs">
        <div className="flex items-center gap-2">
          <Mic className="w-4 h-4 text-purple-400" />
          <span className="font-bold text-gray-200 tracking-wider uppercase font-mono">
            HireReady: OpenAI Realtime Voice &amp; FSRS-5 Simulator
          </span>
        </div>
        <span className="font-mono text-[11px] text-purple-300/80 bg-purple-400/10 px-2 py-0.5 rounded border border-purple-400/20">
          Illustrative demo
        </span>
      </div>

      <div className="p-5 max-[360px]:p-3 space-y-5">
        {/* Track selector */}
        <div className="flex flex-wrap gap-2">
          {QUESTIONS.map((q, idx) => (
            <button
              type="button"
              key={q.company}
              onClick={() => {
                setSelectedTrack(idx)
                setShowFeedback(false)
                setIsPlaying(false)
              }}
              className={`min-w-0 grow basis-32 py-1.5 px-2 text-left font-mono text-xs rounded border transition-all ${
                selectedTrack === idx
                  ? 'bg-purple-950/60 border-purple-400 text-white font-semibold'
                  : 'bg-neutral-900 border-neutral-800 text-gray-400 hover:border-neutral-700'
              }`}
            >
              <span className="block text-purple-300 font-bold [overflow-wrap:anywhere]">
                {q.company}
              </span>
              <span className="text-[10px] text-gray-400">{q.role}</span>
            </button>
          ))}
        </div>

        {/* Question card */}
        <div className="p-4 max-[360px]:p-2 rounded-lg bg-[#121320] border border-neutral-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-x-3 text-xs">
            <span className="font-mono text-[11px] uppercase tracking-wider text-purple-400 font-semibold">
              Live Prompt ({current.difficulty})
            </span>
            <span className="font-mono text-[11px] text-gray-400 bg-neutral-800 px-2 py-0.5 rounded">
              {current.fsrsInterval}
            </span>
          </div>
          <p className="text-sm sm:text-base font-medium text-white leading-snug">
            &ldquo;{current.question}&rdquo;
          </p>

          {/* Voice Waveform Simulator */}
          <div className="p-3 max-[360px]:p-2 rounded bg-[#090a10] border border-neutral-800/80 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 flex-1 min-w-[4rem] overflow-hidden h-6">
              {Array.from({ length: 24 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-200 ${
                    isPlaying ? 'bg-purple-400' : 'bg-neutral-700'
                  }`}
                  style={{
                    height: isPlaying
                      ? `${Math.max(20, (Math.sin(i * 1.2) * 0.5 + 0.5) * 100)}%`
                      : '25%',
                  }}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={simulateAnswer}
              disabled={isPlaying}
              className="shrink-0 max-w-full text-left [overflow-wrap:anywhere] px-3 py-1.5 rounded bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 shrink-0 animate-pulse" /> Evaluating Voice…
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 shrink-0" /> Simulate Realtime Voice Response
                </>
              )}
            </button>
          </div>
        </div>

        {/* Feedback score if simulated */}
        {showFeedback && (
          <div className="p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300 font-semibold">
                Sample feedback: clear structure, concrete example (illustrative, not a real score)
              </span>
            </div>
            <span className="font-mono text-[11px] text-emerald-400/90">
              FSRS schedules the next review
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
