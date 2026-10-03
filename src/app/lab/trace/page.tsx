import type { Metadata } from 'next'
import { TraceInspect } from '@/components/home/TraceInspect'

// Review route for the Trace demo panel before it moves onto the case study.
export const metadata: Metadata = {
  title: 'Lab: Trace',
  robots: { index: false, follow: false },
}

export default function LabTracePage() {
  return (
    <main
      className="editorial"
      style={{ padding: '3rem 1rem', maxWidth: '44rem', margin: '0 auto' }}
    >
      <TraceInspect />
    </main>
  )
}
