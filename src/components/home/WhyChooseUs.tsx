'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Droplets, Globe, Leaf, ShieldCheck, TrendingUp } from 'lucide-react'

import type { HomePage } from '@/payload-types'

import { Reveal } from '@/components/motion/Reveal'
import { TiltCard } from '@/components/motion/TiltCard'

const iconMap = {
  leaf: Leaf,
  droplets: Droplets,
  trendingUp: TrendingUp,
  shieldCheck: ShieldCheck,
  globe: Globe,
} as const

export const WhyChooseUs: React.FC<{ data: HomePage }> = ({ data }) => {
  const { whyChooseHeading, whyChooseItems, whyChooseNote } = data

  return (
    <Reveal className="h-full" direction="up" delay={0.1}>
      <TiltCard className="h-full" strength={3}>
        <aside className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-emerald-900/60 bg-linear-to-br from-brand-forest-green to-brand-dark-green p-5 text-white shadow-lg sm:p-7">
          <motion.div
            animate={{ rotate: [0, 4, 0] }}
            className="pointer-events-none absolute -bottom-8 -right-8"
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Leaf className="h-64 w-64 text-white opacity-10" />
          </motion.div>
          <div>
            <h3 className="mb-4 font-serif text-xl font-bold leading-snug tracking-tight sm:text-2xl">
              {whyChooseHeading}
            </h3>
            <ul className="space-y-4 pt-1">
              {whyChooseItems?.map((item, i) => {
                const Icon = iconMap[item.icon as keyof typeof iconMap] || Leaf
                return (
                  <motion.li
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -16 }}
                    key={i}
                    transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
                    viewport={{ once: true, amount: 0.3 }}
                    whileInView={{ opacity: 1, x: 0 }}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-brand-light-lime">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-[13px] font-medium text-zinc-100">{item.text}</span>
                  </motion.li>
                )
              })}
            </ul>
          </div>
          {whyChooseNote && (
            <div className="mt-6 border-t border-emerald-800/40 pt-3 text-[11px] italic text-emerald-300/80">
              {whyChooseNote}
            </div>
          )}
        </aside>
      </TiltCard>
    </Reveal>
  )
}
