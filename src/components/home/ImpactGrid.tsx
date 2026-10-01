import React from 'react'
import { Globe, Leaf, Sparkles, Sprout, TrendingUp } from 'lucide-react'
import type { HomePage, Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'
import { SectionHeading } from './SectionHeading'

// The CMS stores these as emoji; the design renders them as outlined marks.
const BADGE_ICONS: Record<string, React.FC<{ className?: string; strokeWidth?: number }>> = {
  '🌱': Sprout,
  '📈': TrendingUp,
  '✨': Sparkles,
  '🌍': Globe,
}

export const ImpactGrid: React.FC<{ data: HomePage }> = ({ data }) => {
  const { impactHeading, impactItems } = data
  return (
    <div className="h-full rounded-[18px] border border-[#e7e0cf] bg-[#faf8f1] px-5 py-3.5">
      <SectionHeading className="mb-3" leaf="before">
        {impactHeading}
      </SectionHeading>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {impactItems?.map((item, i) => {
          const Badge = BADGE_ICONS[item.emoji as string] ?? Leaf
          return (
            <div key={i} className="flex flex-col">
              <div className="relative mb-3.5 h-[90px] w-full rounded-xl">
                <div className="relative h-full w-full overflow-hidden rounded-xl">
                  {item.image && typeof item.image !== 'string' && (
                    <Media resource={item.image as MediaType} fill imgClassName="object-cover" />
                  )}
                </div>
                <span className="absolute -bottom-[13px] left-1/2 flex h-[26px] w-[26px] -translate-x-1/2 items-center justify-center rounded-full border border-[#cfd8a8] bg-[#faf8f1]">
                  <Badge className="h-[13px] w-[13px] text-[#7d9440]" strokeWidth={1.7} />
                </span>
              </div>
              <p className="text-center text-[11.5px] font-bold leading-tight text-[#2b3b2c]">
                {item.title}
              </p>
              <p className="mt-1.5 text-center text-[11px] leading-[1.4] text-[#6b6355]">
                {item.description}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
