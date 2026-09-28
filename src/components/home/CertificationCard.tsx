import Link from 'next/link'
import React from 'react'

import type { HomePage } from '@/payload-types'

export const CertificationCard: React.FC<{ data: HomePage }> = ({ data }) => {
  const { certTitle, certDescription, certNumber, certBadgeLabel, certNumberLabel } = data

  return (
    <div
      className="flex flex-col justify-between rounded-2xl border border-brand-border-cream bg-brand-cream-card/80 p-4 shadow-sm sm:p-5 lg:col-span-3"
      id="certification"
    >
      <div>
        <h3 className="mb-3 font-serif text-sm font-bold text-emerald-950 sm:text-base">
          {certTitle}
        </h3>
        <div className="mb-3 flex h-20 w-full items-center justify-center rounded-lg bg-brand-bright-lime text-white shadow-inner sm:h-24">
          <div className="flex flex-col items-center text-center text-xs font-bold">
            <span className="text-lg tracking-widest text-white">★ ★ ★</span>
            <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest">
              {certBadgeLabel}
            </span>
          </div>
        </div>
        <p className="text-[11px] leading-snug text-zinc-700">{certDescription}</p>
      </div>
      <div className="mt-4 pt-2">
        <Link
          className="block w-full rounded-full border border-stone-400/80 bg-white/70 px-2 py-1.5 text-center text-[10px] font-semibold text-zinc-800"
          href="/organic-certification"
        >
          {certNumberLabel} {certNumber}
        </Link>
      </div>
    </div>
  )
}
