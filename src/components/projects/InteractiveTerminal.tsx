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
  Give your codebase a voice. Code-intelligence CLI + MCP server (@purplegumdropz/specter)
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
  const outputRef = useRef<HTMLDivElement>(null)
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
                <span className="text-cyan-300 font-mono">specter explain</span>: Sample narration
                of an architecture summary (illustrative)
              </p>
              <p>
                <span className="text-cyan-300 font-mono">specter tools</span>: Lists the 14 Model
                Context Protocol (MCP) server tools
              </p>
              <p>
                <span className="text-cyan-300 font-mono">specter map</span>: Sketches the layers
                this site is built from
              </p>
              <p>
                <span className="text-cyan-300 font-mono">specter stats</span>: Shows the package
                name, version, and install state
              </p>
              <p>
                <span className="text-cyan-300 font-mono">npm install</span>: Shows npm registry
                installation string
              </p>
              <p>
                <span className="text-cyan-300 font-mono">clear</span>: Clears the terminal screen
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
              <p>✔ Built a knowledge graph from source relationships and git history</p>
              <p>✔ Exposed the graph through MCP tools (get_codebase_summary, get_architecture)</p>
              <p className="text-indigo-300">
                Summary: Illustrative output. Run specter scan on your own repo for a real narration
                of its architecture and change risk.
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
              <p className="text-emerald-400 font-bold">14 MCP tools in @purplegumdropz/specter:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-gray-300">
                <span>1. get_file_relationships</span>
                <span>2. get_complexity_hotspots</span>
                <span>3. get_codebase_summary</span>
                <span>4. get_file_history</span>
                <span>5. get_dead_code</span>
                <span>6. search_symbols</span>
                <span>7. get_call_chain</span>
                <span>8. get_architecture</span>
                <span>9. get_change_coupling</span>
                <span>10. get_impact_analysis</span>
                <span>11. get_bus_factor</span>
                <span>12. get_archaeology</span>
                <span>13. get_health_trends</span>
                <span>14. get_risk_score</span>
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
[Source + git history] ──> [knowledge graph]
                              ├──> specter CLI (hotspots, bus-factor, ask)
                              └──> specter-mcp (14 tools)
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
                ✔ Version: <span className="text-cyan-300 font-semibold">1.2.0</span>
              </p>
              <p>✔ Binaries: specter, specter-mcp</p>
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
              $ npm install -g @purplegumdropz/specter
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

  // Keep the newest output in view. Scroll the terminal's own box, not the page:
  // scrollIntoView on mount threw every case-study visitor down to the terminal and
  // left the skip link behind the keyboard's starting point.
  // biome-ignore lint/correctness/useExhaustiveDependencies: history is the trigger, not a value read here
  useEffect(() => {
    const box = outputRef.current
    if (box) box.scrollTop = box.scrollHeight
  }, [history])

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
      <div className="flex flex-wrap items-center justify-between gap-x-3 px-4 py-2.5 bg-[#16171f] border-b border-neutral-800 text-xs select-none">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-semibold text-gray-300">{projectName} Terminal Sandbox</span>
        </div>
        <div className="flex items-center gap-3">
          {/* gray-500 on the #16171f chrome measured 3.69:1, under WCAG AA. */}
          <span className="text-[10px] text-gray-400 hidden sm:inline">
            node v22.22 · mcp ready
          </span>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="-m-1 inline-flex min-h-6 min-w-6 items-center justify-center p-1 text-gray-400 hover:text-white transition-colors cursor-pointer"
            title={isExpanded ? 'Minimize' : 'Maximize'}
            aria-label={isExpanded ? 'Minimize terminal' : 'Maximize terminal'}
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
      <div
        ref={outputRef}
        className="p-4 overflow-y-auto max-h-[420px] space-y-2 text-xs leading-relaxed"
      >
        {history.map((item, i) => {
          // The `system` banner scrolls horizontally on narrow screens. A
          // scrollable region with no focusable content is unreachable by
          // keyboard, so it gets a tabindex and a name of its own.
          const scrolls = item.type === 'system'
          return (
            <div
              key={i}
              className={`${
                item.type === 'input'
                  ? 'text-cyan-400 font-semibold'
                  : item.type === 'error'
                    ? 'text-red-400'
                    : scrolls
                      ? 'text-indigo-400 font-bold whitespace-pre overflow-x-auto text-[10px] sm:text-xs'
                      : 'text-gray-300'
              }`}
              {...(scrolls
                ? { tabIndex: 0, role: 'region', 'aria-label': 'Terminal banner, scrolls sideways' }
                : {})}
            >
              {item.text}
            </div>
          )
        })}

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
            aria-label={`${projectName} terminal command input`}
            className="min-w-0 flex-1 bg-transparent text-gray-100 outline-none font-mono text-xs placeholder:text-gray-600"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck="false"
          />
        </div>
      </div>
    </section>
  )
}
