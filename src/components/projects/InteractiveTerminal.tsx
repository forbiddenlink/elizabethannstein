'use client'

import { Maximize2, Minimize2, Terminal as TerminalIcon } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

interface InteractiveTerminalProps {
  initialCommand?: string
  projectName?: string
}

interface CommandOutput {
  type: 'input' | 'output' | 'error' | 'system'
  text: string | React.ReactNode
}

const DEFAULT_BANNER = `
  ███████╗██████╗ ███████╗ ██████╗████████╗███████╗██████╗ 
  ██╔════╝██╔══██╗██╔════╝██╔════╝╚══██╔══╝██╔════╝██╔══██╗
  ███████╗██████╔╝█████╗  ██║        ██║   █████╗  ██████╔╝
  ╚════██║██╔═══╝ ██╔══╝  ██║        ██║   ██╔══╝  ██╔══██╗
  ███████║██║     ███████╗╚██████╗   ██║   ███████╗██║  ██║
  ╚══════╝╚═╝     ╚══════╝ ╚═════╝   ╚═╝   ╚══════╝╚═╝  ╚═╝
  v1.4.0 — Codebase Narrator & MCP Server Engine (@purplegumdropz/specter)
  Type "help" to view available commands, or try "specter explain".
`

export function InteractiveTerminal({
  initialCommand = 'specter explain',
  projectName = 'Specter CLI',
}: Readonly<InteractiveTerminalProps>) {
  const [history, setHistory] = useState<CommandOutput[]>([
    { type: 'system', text: DEFAULT_BANNER.trim() },
  ])
  const [input, setInput] = useState('')
  const [cmdHistory, setCmdHistory] = useState<string[]>([initialCommand])
  const [historyIndex, setHistoryIndex] = useState<number>(-1)
  const [isExpanded, setIsExpanded] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const executeCommand = useCallback((rawCmd: string) => {
    const trimmed = rawCmd.trim()
    if (!trimmed) return

    setHistory((prev) => [...prev, { type: 'input', text: `$ ${trimmed}` }])
    setCmdHistory((prev) => [trimmed, ...prev])
    setHistoryIndex(-1)
    setInput('')

    const cmd = trimmed.toLowerCase()

    if (cmd === 'clear') {
      setHistory([])
      return
    }

    if (cmd === 'help') {
      setHistory((prev) => [
        ...prev,
        {
          type: 'output',
          text: (
            <div className="space-y-1 text-xs">
              <p className="text-emerald-400 font-bold">Available Commands:</p>
              <p>
                <span className="text-cyan-300 font-mono">specter explain</span> &mdash; Narrates
                architecture &amp; relationships across connected repo
              </p>
              <p>
                <span className="text-cyan-300 font-mono">specter tools</span> &mdash; Lists the 14
                Model Context Protocol (MCP) server tools
              </p>
              <p>
                <span className="text-cyan-300 font-mono">specter map</span> &mdash; Generates a
                dependency graph topology map
              </p>
              <p>
                <span className="text-cyan-300 font-mono">specter stats</span> &mdash; Displays test
                coverage, AST node count, and telemetry
              </p>
              <p>
                <span className="text-cyan-300 font-mono">npm install</span> &mdash; Shows npm
                registry installation string
              </p>
              <p>
                <span className="text-cyan-300 font-mono">clear</span> &mdash; Clears the terminal
                screen
              </p>
            </div>
          ),
        },
      ])
      return
    }

    if (cmd === 'specter explain') {
      setHistory((prev) => [
        ...prev,
        {
          type: 'output',
          text: (
            <div className="space-y-1.5 text-xs text-gray-200">
              <p className="text-emerald-300 font-semibold">
                [Specter AST Engine] Analyzing codebase hierarchy...
              </p>
              <p>✔ Indexed 642 modules across TypeScript AST</p>
              <p>✔ Resolved 14 MCP tool bindings (stdio + SSE transport)</p>
              <p className="text-indigo-300">
                Summary: Enterprise full-stack architecture with App Router, custom R3F 3D renderer,
                Zustand telemetry store, and Resend contact dispatch.
              </p>
            </div>
          ),
        },
      ])
      return
    }

    if (cmd === 'specter tools') {
      setHistory((prev) => [
        ...prev,
        {
          type: 'output',
          text: (
            <div className="space-y-1 text-xs">
              <p className="text-emerald-400 font-bold">14 Active MCP Tools on npm:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-gray-300">
                <span>1. explain_module</span>
                <span>2. map_dependencies</span>
                <span>3. inspect_ast</span>
                <span>4. search_symbols</span>
                <span>5. trace_references</span>
                <span>6. diff_signatures</span>
                <span>7. audit_security</span>
                <span>8. test_coverage</span>
                <span>9. verify_types</span>
                <span>10. parse_comments</span>
                <span>11. detect_dead_code</span>
                <span>12. summarize_architecture</span>
                <span>13. generate_flowchart</span>
                <span>14. telemetry_ping</span>
              </div>
            </div>
          ),
        },
      ])
      return
    }

    if (cmd === 'specter map') {
      setHistory((prev) => [
        ...prev,
        {
          type: 'output',
          text: (
            <pre className="text-[11px] text-cyan-300 font-mono leading-tight">
              {`
[Core] ──┬──> (Dataverse / Dynamics 365)
         ├──> (Next.js App Router)
         │       └──> [RSC Layout] ──> [Editorial CSS]
         ├──> (React Three Fiber)
         │       └──> [WebGPU Canvas] ──> [Procedural Shaders]
         └──> [MCP Server Layer (14 Tools)]
`}
            </pre>
          ),
        },
      ])
      return
    }

    if (cmd === 'specter stats' || cmd === 'stats') {
      setHistory((prev) => [
        ...prev,
        {
          type: 'output',
          text: (
            <div className="text-xs space-y-1 text-gray-200">
              <p>
                ✔ Status: <span className="text-emerald-400 font-semibold">Published on npm</span>{' '}
                (@purplegumdropz/specter)
              </p>
              <p>
                ✔ Test Suite:{' '}
                <span className="text-cyan-300 font-semibold">
                  216 Unit &amp; E2E tests passing
                </span>{' '}
                (100% green)
              </p>
              <p>✔ Engine: TypeScript 5.9 AST walker + Rust core bridge</p>
            </div>
          ),
        },
      ])
      return
    }

    if (cmd.includes('npm')) {
      setHistory((prev) => [
        ...prev,
        {
          type: 'output',
          text: (
            <div className="text-xs text-emerald-300 font-mono">
              $ npx @purplegumdropz/specter --explain
            </div>
          ),
        },
      ])
      return
    }

    // Default response for unhandled commands
    setHistory((prev) => [
      ...prev,
      {
        type: 'error',
        text: `command not found: "${trimmed}". Type "help" for a list of available commands.`,
      },
    ])
  }, [])

  // Execute initial command on mount
  useEffect(() => {
    if (initialCommand) {
      executeCommand(initialCommand)
    }
  }, [initialCommand, executeCommand])

  // Scroll to bottom on updates
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(input)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (cmdHistory.length > 0) {
        const nextIdx = Math.min(historyIndex + 1, cmdHistory.length - 1)
        setHistoryIndex(nextIdx)
        setInput(cmdHistory[nextIdx] ?? '')
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1
        setHistoryIndex(nextIdx)
        setInput(cmdHistory[nextIdx] ?? '')
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setInput('')
      }
    }
  }

  return (
    <section
      aria-label="Interactive Terminal Simulation"
      className={`relative w-full rounded-lg overflow-hidden border border-neutral-800 bg-[#0c0d12] text-gray-200 font-mono transition-all duration-300 ${
        isExpanded ? 'min-h-[500px]' : 'min-h-[340px]'
      }`}
    >
      {/* Title bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#16171f] border-b border-neutral-800 text-xs select-none">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-semibold text-gray-300">{projectName} Terminal Sandbox</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-gray-500 hidden sm:inline">
            node v22.22 · mcp ready
          </span>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
            title={isExpanded ? 'Minimize' : 'Maximize'}
          >
            {isExpanded ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Terminal Screen */}
      <div className="p-4 overflow-y-auto max-h-[420px] space-y-2 text-xs leading-relaxed">
        {history.map((item, i) => (
          <div
            key={i}
            className={`${
              item.type === 'input'
                ? 'text-cyan-400 font-semibold'
                : item.type === 'error'
                  ? 'text-red-400'
                  : item.type === 'system'
                    ? 'text-indigo-400 font-bold whitespace-pre overflow-x-auto text-[10px] sm:text-xs'
                    : 'text-gray-300'
            }`}
          >
            {item.text}
          </div>
        ))}

        {/* Active Input Line */}
        <div className="flex items-center gap-2 pt-1 text-emerald-400">
          <span className="select-none font-bold">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type 'help', 'specter explain', 'specter tools'..."
            className="flex-1 bg-transparent text-gray-100 outline-none font-mono text-xs placeholder:text-gray-600"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck="false"
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </section>
  )
}
