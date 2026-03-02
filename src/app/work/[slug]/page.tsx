import { allProjects, getProjectById } from '@/lib/galaxyData'
import { ProjectCaseStudy } from '@/components/projects/ProjectCaseStudy'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { StarryBackground } from '@/components/ui/StarryBackground'
import { TiltCard } from '@/components/ui/TiltCard'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { SITE } from '@/lib/constants'

export async function generateStaticParams() {
  return allProjects.map((project) => ({
    slug: project.id,
  }))
}

function normalizeDescription(desc: string, tags?: string[]): string {
  const MIN = 120
  const MAX = 160

  if (desc.length > MAX) return desc.slice(0, MAX - 3).trimEnd() + '...'
  if (desc.length >= MIN) return desc

  const techSuffix = tags?.length ? ` Built with ${tags.slice(0, 3).join(', ')}.` : ''
  const result = desc + techSuffix
  if (result.length > MAX) return desc
  if (result.length >= MIN) return result

  const full = result + ' View project details and implementation.'
  return full.length <= MAX ? full : result
}

export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<{ slug: string }>
}>): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectById(slug)

  if (!project) {
    return {}
  }

  const metaDescription = normalizeDescription(project.description, project.tags)

  return {
    title: `${project.title} - Project by Elizabeth Stein`,
    description: metaDescription,
    alternates: {
      canonical: `/work/${project.id}`,
    },
    openGraph: {
      title: project.title,
      description: metaDescription,
      url: `/work/${project.id}`,
      images: [
        {
          url: `/api/og/${project.id}`,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: metaDescription,
      images: [`/api/og/${project.id}`],
    },
  }
}

export default async function ProjectPage({
  params,
}: Readonly<{
  params: Promise<{ slug: string }>
}>) {
  const { slug } = await params
  const project = getProjectById(slug)

  if (!project) {
    notFound()
  }

  // Find next/prev projects for navigation
  const currentIndex = allProjects.findIndex(p => p.id === project.id)
  const nextProject = allProjects[(currentIndex + 1) % allProjects.length]
  const prevProject = allProjects[(currentIndex - 1 + allProjects.length) % allProjects.length]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.description,
    url: `${SITE.url}/work/${project.id}`,
    author: {
      '@type': 'Person',
      name: SITE.name,
      url: SITE.url,
    },
    ...(project.dateRange && { dateCreated: project.dateRange }),
    ...(project.tags && { keywords: project.tags.join(', ') }),
    ...(project.links?.live && { mainEntityOfPage: project.links.live }),
    ...(project.links?.github && { codeRepository: project.links.github }),
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Skip Link for Accessibility */}
      <a href="#project-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-lg focus:font-medium">
        Skip to main content
      </a>
      <StarryBackground />

      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 animate-in slide-in-from-top-4 duration-500">
        <div className="mx-auto px-6 py-4 flex items-center justify-between backdrop-blur-md bg-black/40 border-b border-white/(--border-opacity-default)">
          <Link
            href="/"
            className="flex items-center gap-3 group min-h-11 min-w-11 p-2"
          >
            {/* Star icon */}
            <span className="relative w-7 h-7 shrink-0 inline-flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="absolute inset-0 rounded-full bg-linear-to-br from-purple-400 to-indigo-600" />
              <span className="absolute inset-0.5 rounded-full bg-linear-to-br from-fuchsia-300 to-purple-500" />
              <span className="absolute inset-1 rounded-full bg-white/80" />
            </span>
            <span className="text-base sm:text-2xl font-bold bg-linear-to-r from-white via-purple-100 to-white bg-clip-text text-transparent group-hover:from-purple-200 group-hover:via-white group-hover:to-purple-200 transition-all duration-300">
              Elizabeth Stein
            </span>
          </Link>
          <nav className="flex items-center gap-3 sm:gap-8">
            <Link
              href="/work"
              className="text-white/(--text-opacity-secondary) hover:text-white transition-colors duration-normal text-xs sm:text-sm font-medium hover:scale-105 min-h-11 px-4 py-3 inline-flex items-center rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
            >
              ← All Projects
            </Link>
            <Link
              href="/about"
              className="px-4 py-3 min-h-11 inline-flex items-center rounded-lg bg-white/10 hover:bg-white/20 transition-all text-xs sm:text-sm font-medium hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
            >
              About
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content with top padding for fixed header */}
      <main id="project-content" className="pt-32 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <ProjectCaseStudy project={project} />

        {/* Navigation Footer */}
        <div className="max-w-7xl mx-auto px-6 mt-32">
          <h2 className="text-2xl font-bold mb-8 text-white/50">Explore More</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <TiltCard className="h-full">
              <Link
                href={`/work/${prevProject.id}`}
                className="block p-8 h-full bg-white/5 border border-white/10 rounded-2xl group hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-2 text-white/40 mb-4 text-sm font-mono">
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Previous Project
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{prevProject.title}</h3>
                <p className="text-white/60 line-clamp-2">{prevProject.description}</p>
              </Link>
            </TiltCard>

            <TiltCard className="h-full">
              <Link
                href={`/work/${nextProject.id}`}
                className="block p-8 h-full bg-white/5 border border-white/10 rounded-2xl group hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center justify-end gap-2 text-white/40 mb-4 text-sm font-mono">
                  Next Project
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 text-right">{nextProject.title}</h3>
                <p className="text-white/60 line-clamp-2 text-right">{nextProject.description}</p>
              </Link>
            </TiltCard>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/(--border-opacity-default) py-12 mt-24 relative z-10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-white/(--text-opacity-muted) mb-4 font-mono text-sm">
            &copy; {new Date().getFullYear()} Elizabeth Stein.
          </p>
          <Link href="/privacy" className="text-white/(--text-opacity-muted) hover:text-white/(--text-opacity-secondary) transition-colors text-sm">
            Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  )
}
