import React from 'react'
import { Leaf, TrendingUp, ShieldCheck, Globe, Droplets, Sprout, BarChart3 } from 'lucide-react'
import type { HomePage } from '@/payload-types'
import { LeafMark } from './SectionHeading'

const ICONS: Record<string, React.FC<{ className?: string }>> = {
  leaf: Leaf,
  trendingUp: TrendingUp,
  shieldCheck: ShieldCheck,
  globe: Globe,
  droplets: Droplets,
  sprout: Sprout,
  barChart: BarChart3,
}

export const WhyChooseUs: React.FC<{ data: HomePage }> = ({ data }) => {
  const { whyChooseHeading, whyChooseItems } = data
  return (
    <div className="relative h-full overflow-hidden rounded-[20px] bg-[#2a4a28] px-7 py-7 text-white">
      {/* Decorative watermark, matching the design's foliage motif. */}
      <LeafMark className="pointer-events-none absolute -right-6 top-6 h-[150px] w-[150px] text-white/[0.06]" />

      <h3 className="relative mb-5 max-w-[175px] font-serif text-[22px] font-bold leading-[1.25] text-white">
        {whyChooseHeading}
      </h3>
      <ul className="relative space-y-3">
        {whyChooseItems?.map((item, i) => {
          const Icon = ICONS[item.icon as string] ?? Leaf
          return (
            <li key={i} className="flex items-center gap-4">
              <Icon className="h-5 w-5 shrink-0 text-[#a8d96e]" />
              <span className="text-[12.5px] leading-tight text-zinc-100">{item.text}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
