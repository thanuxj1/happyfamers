'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Play, Sparkle } from 'lucide-react'

import type { HomePage, Media as MediaType } from '@/payload-types'

import { Media } from '@/components/Media'
import { HoverBloom } from '@/components/motion/HoverBloom'

const SLIDE_DURATION_MS = 6000

const textVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
}

export const HomeHero: React.FC<{ data: HomePage }> = ({ data }) => {
  const {
    badgeText,
    headingLine1,
    headingAccent,
    subtext,
    backgroundImage,
    roundedImage,
    primaryCtaLabel,
    secondaryCtaLabel,
  } = data

  // circleImage is deliberately excluded here: the hero's own heavy readability
  // scrim (needed so text stays legible over a photo) washes a flat placeholder
  // graphic out to looking blank, since it has none of a real photo's contrast
  // to survive underneath — safe to reintroduce once it holds a real photo.
  const slides = [backgroundImage, roundedImage].filter(
    (img): img is MediaType => Boolean(img) && typeof img !== 'string',
  )

  const [active, setActive] = useState(0)

  useEffect(() => {
    if (slides.length < 2) return
    const timer = setInterval(() => {
      setActive((i) => (i + 1) % slides.length)
    }, SLIDE_DURATION_MS)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <div className="relative min-h-[480px] overflow-hidden bg-brand-dark-green text-white sm:min-h-[440px] lg:min-h-[500px]">
      {/* Auto-rotating slideshow: one full-bleed photo at a time, cross-fading,
          each with a slow Ken Burns zoom for a bit of life while it's on screen. */}
      {slides.map((slide, i) => (
        <motion.div
          animate={i === active ? { opacity: 1, scale: 1.1 } : { opacity: 0, scale: 1 }}
          className="absolute inset-0"
          initial={{ opacity: i === 0 ? 1 : 0, scale: 1 }}
          key={slide.id ?? i}
          transition={
            i === active
              ? { opacity: { duration: 1 }, scale: { duration: SLIDE_DURATION_MS / 1000 + 1, ease: 'linear' } }
              : { opacity: { duration: 1 } }
          }
        >
          <Media resource={slide} fill imgClassName="object-cover" priority={i === 0} />
        </motion.div>
      ))}

      {/* Readability scrim, consistent across every slide */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to right, rgba(6,12,7,0.88) 0%, rgba(6,12,7,0.75) 35%, rgba(6,12,7,0.35) 65%, rgba(6,12,7,0.15) 100%), linear-gradient(to top, rgba(6,12,7,0.5) 0%, rgba(6,12,7,0) 30%)',
        }}
      />

      <div className="container relative z-10 flex min-h-[480px] items-center py-12 sm:min-h-[440px] lg:min-h-[500px]">
        <motion.div
          animate="show"
          className="flex max-w-xl flex-col items-start space-y-4 text-left"
          initial="hidden"
          transition={{ staggerChildren: 0.12, delayChildren: 0.1 }}
        >
          {badgeText && (
            <motion.div
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-brand-light-lime"
              transition={{ duration: 0.5 }}
              variants={textVariants}
            >
              <motion.span
                animate={{ scale: [1, 1.25, 1], rotate: [0, 12, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Sparkle className="h-3.5 w-3.5 fill-current" />
              </motion.span>
              {badgeText}
            </motion.div>
          )}
          <motion.h1
            className="font-serif text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[56px]"
            transition={{ duration: 0.6 }}
            variants={textVariants}
          >
            {headingLine1}
            <br />
            <span className="font-bold text-brand-light-lime">{headingAccent}</span>
          </motion.h1>
          <motion.p
            className="max-w-md text-sm leading-relaxed text-zinc-200 opacity-95"
            transition={{ duration: 0.6 }}
            variants={textVariants}
          >
            {subtext}
          </motion.p>
          <motion.div
            className="flex flex-wrap items-center gap-3 pt-2"
            transition={{ duration: 0.6 }}
            variants={textVariants}
          >
            <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <HoverBloom className="rounded-full" color="rgba(255,255,255,0.4)" size={140}>
                <Link
                  className="flex items-center gap-2 rounded-full bg-brand-accent-green px-5 py-2.5 text-xs font-semibold text-white shadow-lg transition-colors hover:bg-brand-forest-green"
                  href="/contact"
                >
                  {primaryCtaLabel}
                  <Phone className="h-3.5 w-3.5" />
                </Link>
              </HoverBloom>
            </motion.span>
            <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <HoverBloom className="rounded-full" color="rgba(255,255,255,0.35)" size={140}>
                <Link
                  className="flex items-center gap-2 rounded-full border border-white/40 bg-black/40 px-4 py-2.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/60"
                  href="#process"
                >
                  {secondaryCtaLabel}
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-black">
                    <Play className="h-2 w-2 fill-current" />
                  </span>
                </Link>
              </HoverBloom>
            </motion.span>
          </motion.div>
        </motion.div>
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {slides.map((slide, i) => (
            <button
              aria-label={`Show slide ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === active ? 'w-6 bg-brand-light-lime' : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
              key={slide.id ?? i}
              onClick={() => setActive(i)}
              type="button"
            />
          ))}
        </div>
      )}

      {/* Organic wavy divider into the cream section below, with a thin
          highlight line for the detailed hand-drawn look in the reference. */}
      <svg
        className="absolute -bottom-px left-0 z-10 h-[36px] w-full sm:h-[52px]"
        preserveAspectRatio="none"
        viewBox="0 0 1440 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,55 C 180,95 360,15 540,45 C 720,75 900,10 1080,38 C 1260,66 1350,48 1440,58 L1440,100 L0,100 Z"
          fill="#f8f6f0"
        />
        <path
          d="M0,55 C 180,95 360,15 540,45 C 720,75 900,10 1080,38 C 1260,66 1350,48 1440,58"
          fill="none"
          stroke="#f8f6f0"
          strokeOpacity="0.55"
          strokeWidth="3"
        />
      </svg>
    </div>
  )
}
