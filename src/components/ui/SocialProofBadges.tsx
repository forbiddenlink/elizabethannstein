'use client'

import { Star, Trophy, Rocket, Award, TrendingUp } from 'lucide-react'

interface GitHubStarsProps {
  repo: string
  stars?: number
}

export function GitHubStars({ repo, stars }: GitHubStarsProps) {
  return (
    <a
      href={`https://github.com/${repo}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/70 hover:bg-white/10 hover:text-white transition-all"
    >
      <Star className="w-3.5 h-3.5 text-yellow-400" />
      {stars !== undefined ? `${stars} stars` : 'View on GitHub'}
    </a>
  )
}

interface ContestWinBadgeProps {
  prize?: string
  contest: string
}

export function ContestWinBadge({ prize, contest }: ContestWinBadgeProps) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-xs text-amber-300">
      <Trophy className="w-3.5 h-3.5" />
      {prize && <span className="font-semibold">{prize}</span>}
      <span className="text-amber-300/70">{contest}</span>
    </div>
  )
}

interface ProductHuntBadgeProps {
  rank?: number
  votes?: number
}

export function ProductHuntBadge({ rank, votes }: ProductHuntBadgeProps) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 text-xs text-orange-300">
      <Rocket className="w-3.5 h-3.5" />
      <span>Product Hunt</span>
      {rank && <span className="font-semibold">#{rank}</span>}
      {votes && <span className="text-orange-300/70">{votes} votes</span>}
    </div>
  )
}

interface MetricBadgeProps {
  label: string
  value: string
  trend?: 'up' | 'down'
  icon?: React.ReactNode
}

export function MetricBadge({ label, value, trend, icon }: MetricBadgeProps) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs">
      {icon || (trend === 'up' && <TrendingUp className="w-3.5 h-3.5 text-green-400" />)}
      <span className="text-white/60">{label}</span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  )
}

interface TestsBadgeProps {
  count: number
  passing?: boolean
}

export function TestsBadge({ count, passing = true }: TestsBadgeProps) {
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${
      passing
        ? 'bg-green-500/20 border border-green-500/30 text-green-300'
        : 'bg-red-500/20 border border-red-500/30 text-red-300'
    }`}>
      <span className={`w-2 h-2 rounded-full ${passing ? 'bg-green-400' : 'bg-red-400'}`} />
      {count} tests {passing ? 'passing' : 'failing'}
    </div>
  )
}

interface AwardBadgeProps {
  title: string
}

export function AwardBadge({ title }: AwardBadgeProps) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-xs text-purple-300">
      <Award className="w-3.5 h-3.5" />
      {title}
    </div>
  )
}

// Composite component for project cards
interface SocialProofProps {
  githubRepo?: string
  githubStars?: number
  contestWin?: { prize?: string; contest: string }
  productHunt?: { rank?: number; votes?: number }
  tests?: { count: number; passing?: boolean }
  metrics?: Array<{ label: string; value: string; trend?: 'up' | 'down' }>
  awards?: string[]
}

export function SocialProof({
  githubRepo,
  githubStars,
  contestWin,
  productHunt,
  tests,
  metrics,
  awards,
}: SocialProofProps) {
  const hasAnyBadge = githubRepo || contestWin || productHunt || tests || metrics?.length || awards?.length

  if (!hasAnyBadge) return null

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {contestWin && (
        <ContestWinBadge prize={contestWin.prize} contest={contestWin.contest} />
      )}
      {productHunt && (
        <ProductHuntBadge rank={productHunt.rank} votes={productHunt.votes} />
      )}
      {awards?.map((award) => (
        <AwardBadge key={award} title={award} />
      ))}
      {tests && (
        <TestsBadge count={tests.count} passing={tests.passing} />
      )}
      {githubRepo && (
        <GitHubStars repo={githubRepo} stars={githubStars} />
      )}
      {metrics?.map((metric) => (
        <MetricBadge
          key={metric.label}
          label={metric.label}
          value={metric.value}
          trend={metric.trend}
        />
      ))}
    </div>
  )
}
