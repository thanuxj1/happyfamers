'use client'

import { motion, useMotionTemplate, useSpring } from 'framer-motion'
import React, { useRef } from 'react'

// Subtle 3D tilt that follows the cursor, plus a soft lift — the "eye-catching
// 3D" touch on cards/icons, done with CSS perspective transforms (no 3D
// engine needed for a UI card).
export const TiltCard: React.FC<{
  children: React.ReactNode
  className?: string
  /** Max tilt in degrees. Keep small for a subtle, premium feel. */
  strength?: number
}> = ({ children, className, strength = 8 }) => {
  const ref = useRef<HTMLDivElement>(null)
  const rotateX = useSpring(0, { stiffness: 200, damping: 20, mass: 0.5 })
  const rotateY = useSpring(0, { stiffness: 200, damping: 20, mass: 0.5 })
  const scale = useSpring(1, { stiffness: 200, damping: 20 })

  const transform = useMotionTemplate`perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    rotateY.set(px * strength * 2)
    rotateX.set(-py * strength * 2)
  }

  const handleLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
    scale.set(1)
  }

  return (
    <motion.div
      className={className}
      onMouseEnter={() => scale.set(1.03)}
      onMouseLeave={handleLeave}
      onMouseMove={handleMouseMove}
      ref={ref}
      style={{ transform, transformStyle: 'preserve-3d' }}
    >
      {children}
    </motion.div>
  )
}
