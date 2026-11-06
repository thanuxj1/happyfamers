import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import type { HomePage } from '@/payload-types'
import { LeafMark } from './SectionHeading'

export const CertificationCard: React.FC<{ data: HomePage }> = ({ data }) => {
  const { certTitle, certDescription, certNumber, certNumberLabel } = data

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-[18px] border border-[#e7e0cf] bg-[#f6f2e8] px-5 py-3.5">
      <LeafMark className="pointer-events-none absolute -bottom-4 right-2 h-[96px] w-[96px] text-[#d8cfae]/40" />

      <h3 className="relative mb-2 font-serif text-[18px] font-bold leading-tight text-[#1c3220]">
        {certTitle}
      </h3>

      {/* The logo floats so the text runs on underneath it. Side by side, this
          narrow card squeezed the text into a tall thin column, and that column
          set the height of the whole row. */}
      <p className="relative mb-2.5 text-[12px] leading-[1.45] text-[#4b4639]">
        <Image
          src="/eu-organic-logo.svg"
          alt="EU Organic Certification Logo"
          width={84}
          height={56}
          className="float-left mb-1 mr-3 mt-0.5 h-[56px] w-[84px] rounded-sm object-cover"
        />
        {certDescription}
      </p>

      <Link
        href="/organic-certification"
        className="relative mt-auto self-start rounded-lg border border-[#cfc6ab] bg-transparent px-3.5 py-1.5 text-[12px] text-[#3f3b31] transition-colors hover:bg-[#ece6d6]"
      >
        {certNumberLabel} {certNumber}
      </Link>
    </div>
  )
}
