import React from 'react'

import type { HomePage, Media as MediaType } from '@/payload-types'

import { Media } from '@/components/Media'
import { RevealGroup, RevealItem } from '@/components/motion/Reveal'
import { TiltCard } from '@/components/motion/TiltCard'

export const ProcessSteps: React.FC<{ data: HomePage }> = ({ data }) => {
  const { processHeading, processSteps } = data

  return (
    <div id="process">
      <div className="mb-6 flex items-center justify-center gap-3">
        <span className="h-px w-12 bg-zinc-300 sm:w-16" />
        <h2 className="flex items-center gap-1.5 text-center font-serif text-base font-bold text-emerald-950 sm:text-lg">
          {processHeading}
          <span className="text-xs">🍃</span>
        </h2>
        <span className="h-px w-12 bg-zinc-300 sm:w-16" />
      </div>

      <RevealGroup className="grid grid-cols-1 gap-6 px-2 text-center sm:grid-cols-3 sm:gap-3" stagger={0.15}>
        {processSteps?.map((step, i) => (
          <RevealItem className="relative flex flex-col items-center" key={i}>
            <TiltCard className="mb-2" strength={10}>
              <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-emerald-700/40 bg-white p-0.5 shadow-sm transition-shadow hover:shadow-lg">
                {step.image && typeof step.image !== 'string' && (
                  <Media
                    resource={step.image as MediaType}
                    fill
                    imgClassName="object-cover rounded-full"
                  />
                )}
              </div>
            </TiltCard>
            <span className="-mt-4 z-10 mb-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-forest-green text-[10px] font-bold text-white ring-2 ring-brand-cream-bg">
              {i + 1}
            </span>
            <h3 className="mb-1 text-xs font-bold text-zinc-900 sm:text-sm">{step.title}</h3>
            <p className="max-w-[220px] text-[11px] leading-tight text-zinc-600 sm:max-w-[180px]">
              {step.description}
            </p>
            {processSteps && i < processSteps.length - 1 && (
              <span className="absolute -right-3 top-9 hidden font-mono text-xs text-zinc-400 sm:block">
                --&gt;
              </span>
            )}
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  )
}
