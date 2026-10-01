import React from 'react'
import type { HomePage, Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'
import { SectionHeading } from './SectionHeading'

export const ProcessSteps: React.FC<{ data: HomePage }> = ({ data }) => {
  const { processHeading, processSteps } = data
  return (
    <div className="pt-[10px]" id="process">
      <SectionHeading className="mb-4 justify-center" rule="both">
        {processHeading}
      </SectionHeading>

      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-between sm:gap-0">
        {processSteps?.map((step, i) => (
          <React.Fragment key={i}>
            <div className="flex w-full max-w-[260px] flex-col items-center px-1 text-center sm:w-auto sm:flex-1">
              <div className="relative h-[100px] w-[100px] rounded-full border border-[#9bab6d] p-[5px]">
                <div className="relative h-full w-full overflow-hidden rounded-full bg-stone-100">
                  {step.image && typeof step.image !== 'string' && (
                    <Media resource={step.image as MediaType} fill imgClassName="object-cover" />
                  )}
                </div>
              </div>
              <span className="-mt-[11px] flex h-[22px] w-[22px] items-center justify-center rounded-full border-2 border-[#f7f5f0] bg-[#6fa93f] text-[11px] font-semibold text-white">
                {i + 1}
              </span>
              <p className="mt-2 text-[12px] font-bold leading-tight text-[#2d6032] sm:whitespace-nowrap">
                {step.title}
              </p>
              <p className="mt-1.5 text-[11px] leading-[1.5] text-[#6b6355]">{step.description}</p>
            </div>
            {processSteps && i < processSteps.length - 1 && (
              <svg
                aria-hidden="true"
                className="hidden shrink-0 text-[#6fa93f] sm:mt-[44px] sm:block"
                fill="none"
                height="12"
                viewBox="0 0 40 12"
                width="40"
              >
                <path
                  d="M1 6h30"
                  stroke="currentColor"
                  strokeDasharray="5 4"
                  strokeLinecap="round"
                  strokeWidth="2"
                />
                <path
                  d="M31 1.5 37 6l-6 4.5"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
