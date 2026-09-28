'use client'

import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import React from 'react'

/**
 * A soft radial "bloom" of light that follows the cursor across the element
 * on hover — wraps a button/card without altering its own markup or colors.
 */
export const HoverBloom: React.FC<{
  children: React.ReactNode
  className?: string
  /** CSS color for the glow, e.g. 'rgba(163,230,53,0.35)' */
  color?: string
  size?: number
}> = ({ children, className, color = 'rgba(255,255,255,0.35)', size = 220 }) => {
  const mouseX = useMotionValue(-size)
  const mouseY = useMotionValue(-size)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  const handleLeave = () => {
    mouseX.set(-size)
    mouseY.set(-size)
  }

  const background = useMotionTemplate`radial-gradient(${size}px circle at ${mouseX}px ${mouseY}px, ${color}, transparent 80%)`

  return (
    <div
      className={`group relative isolate overflow-hidden ${className || ''}`}
      onMouseLeave={handleLeave}
      onMouseMove={handleMouseMove}
    >
      {children}
      {/* Sits ABOVE the button's own (opaque) background and lightens it with a
          blend mode, rather than sitting behind it where it would be fully hidden. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 opacity-0 mix-blend-overlay transition-opacity duration-300 group-hover:opacity-100"
        style={{ background }}
      />
    </div>
  )
}
