'use client'

import { Maximize2, Minimize2, Terminal as TerminalIcon } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * A command reference for Specter, styled as a terminal. It does not run Specter and prints no
 * sample output: each command shows what the published README says it does. Everything here
 * (version, command names, the 14 MCP tools, the 12 modes) comes from @purplegumdropz/specter 1.1.1.
 */

interface InteractiveTerminalProps {
  initialCommand?: string
  projectName?: string
}

interface CommandOutput {
  type: 'input' | 'output' | 'error' | 'system'
  text: string | React.ReactNode
}

const PUBLISHED_VERSION = '1.1.1'

const BANNER = `
  ███████╗██████╗ ███████╗ ██████╗████████╗███████╗██████╗
  ██╔════╝██╔══██╗██╔════╝██╔════╝╚══██╔══╝██╔════╝██╔══██╗
  ███████╗██████╔╝█████╗  ██║        ██║   █████╗  ██████╔╝
  ╚════██║██╔═══╝ ██╔══╝  ██║        ██║   ██╔══╝  ██╔══██╗
  ███████║██║     ███████╗╚██████╗   ██║   ███████╗██║  ██║
  ╚══════╝╚═╝     ╚══════╝ ╚═════╝   ╚═╝   ╚══════╝╚═╝  ╚═╝
  @purplegumdropz/specter ${PUBLISHED_VERSION} on npm
  A command reference. Nothing on this page runs Specter. Type "help".
`

// Descriptions are the ones in the published README.
const SPECTER_COMMANDS: Record<string, string> = {
  scan: 'Builds the knowledge graph. Run this first.',
  health: 'Overall codebase health, 0 to 100, with the complexity distribution.',
  hotspots: 'Complexity and churn together, as a refactoring priority.',
  'bus-factor': 'Who owns the critical code, and what breaks if they leave.',
  cost: 'Tech debt expressed in dollars per year.',
  why: 'Explains why a file exists, from git history, patterns and context. Usage: specter why <file>',
  ask: 'Answers a plain-language question about the codebase. Usage: specter ask "<question>"',
  roast: 'A comedic roast of the codebase.',
}

// The 14 tool names registered by the MCP server in the published package.
const MCP_TOOLS = [
  'get_archaeology',
  'get_architecture',
  'get_bus_factor',
  'get_call_chain',
  'get_change_coupling',
  'get_codebase_summary',
  'get_complexity_hotspots',
  'get_dead_code',
  'get_file_history',
  'get_file_relationships',
  'get_health_trends',
  'get_impact_analysis',
  'get_risk_score',
  'search_symbols',
]

const PERSONALITY_MODES = [
  'default',
  'mentor',
  'critic',
  'historian',
  'cheerleader',
  'minimalist',
  'noir',
  'therapist',
  'roast',
  'dramatic',
  'ghost',
  'executive',
]

export function InteractiveTerminal({
  initialCommand = 'help',
  projectName = 'Specter',
}: Readonly<InteractiveTerminalProps>) {
  const [history, setHistory] = useState<CommandOutput[]>([{ type: 'system', text: BANNER.trim() }])
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
    const reply = (node: React.ReactNode) =>
      setHistory((prev) => [...prev, { type: 'output', text: node }])

    if (cmd === 'clear') {
      setHistory([])
      return
    }

    if (cmd === 'help' || cmd === 'specter') {
      reply(
        <div className="space-y-1 text-xs">
          <p className="text-emerald-400 font-bold">Commands on this page:</p>
          {Object.entries(SPECTER_COMMANDS).map(([name, description]) => (
            <p key={name}>
              <span className="text-cyan-300 font-mono">specter {name}</span> {description}
            </p>
          ))}
          <p>
            <span className="text-cyan-300 font-mono">tools</span> Lists the 14 MCP tools
          </p>
          <p>
            <span className="text-cyan-300 font-mono">modes</span> Lists the 12 personality modes
          </p>
          <p>
            <span className="text-cyan-300 font-mono">install</span> Shows how to install it
          </p>
          <p>
            <span className="text-cyan-300 font-mono">clear</span> Clears the screen
          </p>
          <p className="text-gray-400">Specter has 65 commands in all. These are a few of them.</p>
        </div>
      )
      return
    }

    if (cmd === 'tools') {
      reply(
        <div className="space-y-1 text-xs">
          <p className="text-emerald-400 font-bold">14 MCP tools:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-gray-300">
            {MCP_TOOLS.map((name, i) => (
              <span key={name}>
                {i + 1}. {name}
              </span>
            ))}
          </div>
        </div>
      )
      return
    }

    if (cmd === 'modes') {
      reply(
        <div className="space-y-1 text-xs">
          <p className="text-emerald-400 font-bold">12 personality modes:</p>
          <p className="text-gray-300">{PERSONALITY_MODES.join(', ')}</p>
          <p className="text-gray-400">Add --personality &lt;mode&gt; to any command.</p>
        </div>
      )
      return
    }

    if (cmd === 'install' || cmd.includes('npm')) {
      reply(
        <div className="text-xs text-emerald-300 font-mono space-y-1">
          <p>$ npm install -g @purplegumdropz/specter</p>
          <p>$ specter scan &amp;&amp; specter health</p>
        </div>
      )
      return
    }

    const match = /^specter\s+([a-z-]+)/.exec(cmd)
    const description = match ? SPECTER_COMMANDS[match[1]] : undefined
    if (match && description) {
      reply(
        <div className="space-y-1 text-xs text-gray-200">
          <p>{description}</p>
          <p className="text-gray-400">
            Not run on this page. To try it: npx @purplegumdropz/specter {match[1]}
          </p>
        </div>
      )
      return
    }

    setHistory((prev) => [
      ...prev,
      {
        type: 'error',
        text: `command not found: "${trimmed}". Type "help" for the commands on this page.`,
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
      aria-label="Specter command reference"
      className={`relative w-full rounded-lg overflow-hidden border border-neutral-800 bg-[#0c0d12] text-gray-200 font-mono transition-all duration-300 ${
        isExpanded ? 'min-h-[500px]' : 'min-h-[340px]'
      }`}
    >
      {/* Title bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#16171f] border-b border-neutral-800 text-xs select-none">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-semibold text-gray-300">{projectName} command reference</span>
        </div>
        <div className="flex items-center gap-3">
          {/* gray-500 on the #16171f chrome measured 3.69:1, under WCAG AA. */}
          <span className="text-[10px] text-gray-400 hidden sm:inline">
            npm {PUBLISHED_VERSION}
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
            placeholder="Type 'help', 'specter hotspots', 'tools'..."
            aria-label={`${projectName} command input`}
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
