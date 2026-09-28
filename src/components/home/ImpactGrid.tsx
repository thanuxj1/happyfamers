import React from 'react'

import type { HomePage, Media as MediaType } from '@/payload-types'

import { Media } from '@/components/Media'
import { RevealGroup, RevealItem } from '@/components/motion/Reveal'
import { TiltCard } from '@/components/motion/TiltCard'

export const ImpactGrid: React.FC<{ data: HomePage }> = ({ data }) => {
  const { impactHeading, impactItems } = data

  return (
    <section>
      <h2 className="mb-4 flex items-center gap-1.5 font-serif text-base font-bold text-emerald-950 sm:text-lg">
        <span className="text-xs">🍃</span>
        {impactHeading}
      </h2>
      <RevealGroup className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 md:grid-cols-4" stagger={0.1}>
        {impactItems?.map((item, i) => (
          <RevealItem className="flex flex-col" key={i}>
            <TiltCard strength={6}>
              <div className="relative mb-2 aspect-square overflow-hidden rounded-xl border border-stone-300 shadow-sm transition-shadow hover:shadow-lg">
                {item.image && typeof item.image !== 'string' && (
                  <Media resource={item.image as MediaType} fill imgClassName="object-cover" />
                )}
                {item.emoji && (
                  <span className="absolute bottom-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-800/90 text-xs text-white shadow-sm">
                    {item.emoji}
                  </span>
                )}
              </div>
            </TiltCard>
            <h3 className="text-[11px] font-bold leading-tight text-zinc-900">{item.title}</h3>
            <p className="mt-0.5 text-[10px] leading-tight text-zinc-600">{item.description}</p>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  )
}
