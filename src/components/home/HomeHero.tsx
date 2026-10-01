import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { Play, Sparkle } from 'lucide-react'

import type { HomePage, Media as MediaType } from '@/payload-types'

import { Media } from '@/components/Media'
import { LeafMark } from './SectionHeading'

const STATIC_HERO = '/hero-farm-panorama.png'

export const HomeHero: React.FC<{ data: HomePage }> = ({ data }) => {
  const {
    badgeText,
    headingLine1,
    headingAccent,
    subtext,
    backgroundImage,
    primaryCtaLabel,
    secondaryCtaLabel,
  } = data

  const photo =
    backgroundImage && typeof backgroundImage !== 'string' && typeof backgroundImage !== 'number'
      ? (backgroundImage as MediaType)
      : null

  return (
    <div className="relative min-h-[348px] overflow-hidden bg-brand-dark-green text-white">
      {photo ? (
        <Media resource={photo} fill imgClassName="object-cover object-center" priority />
      ) : (
        <Image
          src={STATIC_HERO}
          alt="Hands holding vermicompost beside rows of young vegetables at sunset"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      )}

      {/* Keeps the copy legible where it crosses the brighter part of the field. */}
      <div
        className="absolute inset-0 md:hidden"
        style={{ background: 'rgba(8,16,9,0.62)' }}
      />
      <div
        className="absolute inset-0 hidden md:block"
        style={{
          background:
            'linear-gradient(to right, rgba(8,16,9,0.45) 0%, rgba(8,16,9,0.72) 22%, rgba(8,16,9,0.5) 46%, rgba(8,16,9,0.12) 66%, rgba(8,16,9,0) 80%)',
        }}
      />

      <div className="relative z-10">
        {/* From `md` up the copy clears the hands at the left edge of the photo;
            on narrow screens the photo is cropped tighter so it starts inset. */}
        <div className="flex min-h-[348px] flex-col justify-center gap-2.5 px-5 py-8 sm:py-6 md:pl-[calc(22%+30px)] md:pr-6">
          {badgeText && (
            <div className="flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.12em] text-zinc-100">
              <Sparkle className="h-4 w-4 fill-brand-light-lime text-brand-light-lime" />
              {badgeText}
            </div>
          )}

          <h1 className="font-serif text-[34px] font-bold leading-[1.08] tracking-tight text-white sm:text-[46px] xl:text-[56px]">
            {headingLine1}
            <br />
            <span className="text-brand-light-lime">{headingAccent}</span>
          </h1>

          <p className="max-w-[360px] text-[15px] leading-[1.33] text-zinc-100">{subtext}</p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              className="flex items-center gap-2 rounded-full bg-brand-accent-green px-6 py-3 text-[14px] font-semibold text-white shadow-lg transition-colors hover:bg-brand-forest-green"
              href="/contact"
            >
              {primaryCtaLabel}
              <LeafMark className="h-4 w-4 text-brand-light-lime" />
            </Link>
            <Link
              className="flex items-center gap-2 rounded-full border border-white/40 bg-black/35 px-5 py-3 text-[14px] font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/55"
              href="#process"
            >
              {secondaryCtaLabel}
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-black">
                <Play className="h-2.5 w-2.5 fill-current" />
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Organic wavy divider into the cream section below. */}
      <svg
        className="absolute -bottom-px left-0 z-10 h-[34px] w-full"
        preserveAspectRatio="none"
        viewBox="0 0 1440 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,55 C 180,95 360,15 540,45 C 720,75 900,10 1080,38 C 1260,66 1350,48 1440,58 L1440,100 L0,100 Z"
          fill="#f7f5f0"
        />
        <path
          d="M0,38 C 180,78 360,-2 540,28 C 720,58 900,-7 1080,21 C 1260,49 1350,31 1440,41"
          fill="none"
          stroke="#f7f5f0"
          strokeOpacity="0.35"
          strokeWidth="2"
        />
      </svg>
    </div>
  )
}
