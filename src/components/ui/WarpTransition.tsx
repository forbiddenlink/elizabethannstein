'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export function WarpTransition() {
  const pathname = usePathname()
  const [isActive, setIsActive] = useState(false)
  const isFirstRoute = useRef(true)

  useEffect(() => {
    if (isFirstRoute.current) {
      isFirstRoute.current = false
      return
    }
    setIsActive(true)
    const timeout = setTimeout(() => setIsActive(false), 300)
    return () => clearTimeout(timeout)
  }, [pathname])

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[10000] pointer-events-none bg-black"
        />
      )}
    </AnimatePresence>
  )
}
