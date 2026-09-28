'use client'

import React, { useRef, useState } from 'react'

/**
 * Dims its children by default; a soft circular "spotlight" following the
 * cursor reveals the full brightness/color underneath, like shining a torch
 * over a badge or photo.
 */
export const SpotlightReveal: React.FC<{
  children: React.ReactNode
  className?: string
  /** Spotlight radius in px. */
  size?: number
}> = ({ children, className, size = 90 }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const handleMouseLeave = () => setPos(null)

  const maskImage = pos
    ? `radial-gradient(${size}px circle at ${pos.x}px ${pos.y}px, black 55%, transparent 100%)`
    : undefined

  return (
    <div
      className={`relative overflow-hidden ${className || ''}`}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      ref={containerRef}
    >
      <div className="brightness-[0.55] saturate-[0.6] transition-[filter] duration-300">
        {children}
      </div>

      {pos && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            maskImage,
            WebkitMaskImage: maskImage,
          }}
        >
          {children}
          <div
            className="pointer-events-none absolute rounded-full bg-white/25 blur-xl"
            style={{
              height: size * 1.1,
              width: size * 1.1,
              left: pos.x - (size * 1.1) / 2,
              top: pos.y - (size * 1.1) / 2,
              mixBlendMode: 'overlay',
            }}
          />
        </div>
      )}
    </div>
  )
}
