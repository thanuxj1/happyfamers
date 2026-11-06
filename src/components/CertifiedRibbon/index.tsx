import Image from 'next/image'
import React from 'react'

/**
 * The gold "EU Organic Certified" corner ribbon, shown on every page.
 *
 * It started life on Our Story; the client asked for it site-wide. It sits in
 * the root layout rather than in each page's hero so no page can be missed,
 * pinned to the top-right corner just under the header and scrolling away with
 * the page like the hero it overlaps.
 *
 * The clipping box is what keeps it tidy: the rotated band is wider than the
 * corner it shows in, and without `overflow-hidden` it would push the page
 * sideways and add a horizontal scrollbar.
 */
export function CertifiedRibbon() {
  return (
    <div className="pointer-events-none absolute right-0 top-[72px] z-20 h-[118px] w-[118px] overflow-hidden sm:h-[200px] sm:w-[200px]">
      <p className="absolute -right-[62px] top-[26px] flex w-[250px] rotate-[39deg] items-center justify-center gap-1 bg-[#f5c52d] py-1.5 text-[10px] font-bold tracking-wide text-[#064b25] shadow-md sm:-right-[86px] sm:top-[52px] sm:w-[340px] sm:gap-2 sm:py-2.5 sm:text-[15px] sm:tracking-normal">
        <Image
          src="/eu-organic-logo.svg"
          alt=""
          width={42}
          height={28}
          className="h-[14px] w-[21px] rounded-[2px] object-cover sm:h-[28px] sm:w-[42px]"
        />
        EU Organic Certified
      </p>
    </div>
  )
}
