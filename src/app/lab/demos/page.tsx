import type { Metadata } from 'next'
import { AutomaDocsInspect } from '@/components/home/AutomaDocsInspect'
import { SpecterInspect } from '@/components/home/SpecterInspect'
import { TraceInspect } from '@/components/home/TraceInspect'

// Review route for the case-study demo panels before they move onto their case studies.
export const metadata: Metadata = {
  title: 'Lab: demos',
  robots: { index: false, follow: false },
}

export default function LabDemosPage() {
  return (
    <main
      className="editorial"
      style={{
        display: 'grid',
        gap: '3rem',
        padding: '3rem 1rem',
        maxWidth: '48rem',
        margin: '0 auto',
      }}
    >
      <TraceInspect />
      <AutomaDocsInspect />
      <SpecterInspect />
    </main>
  )
}
