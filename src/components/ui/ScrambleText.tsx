'use client'

import React, { useState, useCallback } from 'react'

const CHARS = '!<>-_\\/[]{}—=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

interface ScrambleTextProps {
  children: string
  className?: string
  triggerOnMount?: boolean
}

export function ScrambleText({ children, className, triggerOnMount = false }: ScrambleTextProps) {
  const [display, setDisplay] = useState(triggerOnMount ? '' : children)

  const scramble = useCallback(() => {
    let frame = 0
    const speed = Math.max(1, Math.floor(children.length / 12))

    const tick = () => {
      setDisplay(
        children
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' '
            if (frame / speed > i) return children[i]
            return CHARS[Math.floor(Math.random() * CHARS.length)]
          })
          .join('')
      )
      if (++frame < children.length * speed + 8) {
        requestAnimationFrame(tick)
      } else {
        setDisplay(children)
      }
    }
    requestAnimationFrame(tick)
  }, [children])

  return (
    <span
      onMouseEnter={scramble}
      className={className}
      suppressHydrationWarning
    >
      {display || children}
    </span>
  )
}
