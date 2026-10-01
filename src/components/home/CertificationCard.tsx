import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import type { HomePage } from '@/payload-types'
import { LeafMark } from './SectionHeading'

export const CertificationCard: React.FC<{ data: HomePage }> = ({ data }) => {
  const { certTitle, certDescription, certNumber, certNumberLabel } = data

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-[18px] border border-[#e7e0cf] bg-[#f6f2e8] px-6 py-4">
      <LeafMark className="pointer-events-none absolute -bottom-4 right-2 h-[120px] w-[120px] text-[#d8cfae]/40" />

      <h3 className="relative mb-3.5 text-center font-serif text-[20px] font-bold text-[#1c3220]">
        {certTitle}
      </h3>

      <div className="relative mb-3.5 flex gap-3.5">
        <Image
          src="/eu-organic-logo.svg"
          alt="EU Organic Certification Logo"
          width={124}
          height={88}
          className="h-[88px] w-[124px] shrink-0 rounded-sm object-cover"
          priority
        />
        <p className="min-w-0 text-[10.5px] leading-[1.45] text-[#4b4639]">{certDescription}</p>
      </div>

      <Link
        href="/organic-certification"
        className="relative mt-auto self-start rounded-lg border border-[#cfc6ab] bg-transparent px-4 py-2 text-[12px] text-[#3f3b31] transition-colors hover:bg-[#ece6d6]"
      >
        {certNumberLabel} {certNumber}
      </Link>
    </div>
  )
}
