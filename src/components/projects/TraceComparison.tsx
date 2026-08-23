'use client'

import { Check, Code2, Eye, LayoutTemplate, Sparkles, Wand2 } from 'lucide-react'
import { useState } from 'react'

const SAMPLE_TSX = `import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export function DeploymentCard() {
  return (
    <Card className="border-neutral-800 bg-neutral-950/80 backdrop-blur-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Production Cluster</CardTitle>
        <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
          Healthy
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-2xl font-bold font-mono">99.98% Uptime</div>
        <div className="flex gap-2">
          <Input placeholder="Filter services..." className="h-8 text-xs" />
          <Button size="sm" className="bg-blue-600 hover:bg-blue-500">Deploy</Button>
        </div>
      </CardContent>
    </Card>
  )
}`

export function TraceComparison() {
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'inspector'>('preview')
  const [copied, setCopied] = useState(false)

  const copyCode = () => {
    navigator.clipboard.writeText(SAMPLE_TSX)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full rounded-lg overflow-hidden border border-neutral-800 bg-[#0d0f17] text-gray-200 font-sans shadow-xl">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#151926] border-b border-neutral-800 text-xs">
        <div className="flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-gray-200 tracking-wider uppercase font-mono">
            Trace &mdash; Grounded Screenshot-to-Code Engine
          </span>
        </div>
        <span className="font-mono text-[11px] text-emerald-300/80 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
          ★ DEV.to Winner
        </span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-800 bg-[#111420] text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={`flex items-center gap-2 px-4 py-2.5 font-medium border-b-2 transition-colors ${
            activeTab === 'preview'
              ? 'border-emerald-400 text-emerald-300 bg-neutral-900/60'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <LayoutTemplate className="w-3.5 h-3.5" /> Rendered Output
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('inspector')}
          className={`flex items-center gap-2 px-4 py-2.5 font-medium border-b-2 transition-colors ${
            activeTab === 'inspector'
              ? 'border-cyan-400 text-cyan-300 bg-neutral-900/60'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Eye className="w-3.5 h-3.5" /> What AI Sees (Grounding)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('code')}
          className={`flex items-center gap-2 px-4 py-2.5 font-medium border-b-2 transition-colors ${
            activeTab === 'code'
              ? 'border-blue-400 text-blue-300 bg-neutral-900/60'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" /> Generated TSX
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        {activeTab === 'preview' && (
          <div className="flex flex-col items-center justify-center p-6 rounded-lg bg-[#07080c] border border-neutral-800/80 space-y-3">
            <span className="text-[11px] font-mono text-gray-400 uppercase tracking-widest">
              Live Sandpack Component Preview:
            </span>
            <div className="w-full max-w-sm p-4 rounded-lg bg-neutral-900 border border-neutral-800 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">Production Cluster</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/40 bg-emerald-500/20 text-emerald-400 font-mono">
                  Healthy
                </span>
              </div>
              <div className="text-xl font-bold font-mono text-white">99.98% Uptime</div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Filter services..."
                  readOnly
                  className="flex-1 bg-neutral-800 border border-neutral-700 rounded px-2.5 py-1 text-xs text-gray-300 outline-none"
                />
                <button
                  type="button"
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-medium"
                >
                  Deploy
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inspector' && (
          <div className="p-4 rounded-lg bg-[#07080c] border border-neutral-800 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-cyan-300 font-mono font-semibold text-[11px]">
              <Sparkles className="w-3.5 h-3.5" /> Per-Element Confidence &amp; Catalog Matching:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2.5 rounded bg-neutral-900/90 border border-emerald-500/30 flex justify-between items-center">
                <span>Card container</span>
                <span className="text-emerald-400 font-bold">99% [grounded]</span>
              </div>
              <div className="p-2.5 rounded bg-neutral-900/90 border border-emerald-500/30 flex justify-between items-center">
                <span>Badge / Status Pill</span>
                <span className="text-emerald-400 font-bold">98% [grounded]</span>
              </div>
              <div className="p-2.5 rounded bg-neutral-900/90 border border-cyan-500/30 flex justify-between items-center">
                <span>Input textfield</span>
                <span className="text-cyan-400 font-bold">96% [grounded]</span>
              </div>
              <div className="p-2.5 rounded bg-neutral-900/90 border border-emerald-500/30 flex justify-between items-center">
                <span>Primary Button</span>
                <span className="text-emerald-400 font-bold">99% [grounded]</span>
              </div>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed pt-1">
              Trace enforces strict catalogue grounding: components are mapped exclusively to
              pre-verified design system primitives rather than hallucinated HTML tags.
            </p>
          </div>
        )}

        {activeTab === 'code' && (
          <div className="relative rounded-lg bg-[#07080c] border border-neutral-800 p-4 font-mono text-xs overflow-x-auto">
            <button
              type="button"
              onClick={copyCode}
              className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-gray-200 text-[11px] transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" /> Copied
                </>
              ) : (
                'Copy TSX'
              )}
            </button>
            <pre className="text-cyan-200/90 leading-relaxed">{SAMPLE_TSX}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
