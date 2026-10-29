import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import React from 'react'

import { Media } from '@/components/Media'
import { generateMeta } from '@/utilities/generateMeta'
import { getOurStoryContent } from '@/globals/OurStoryPage/content'

/**
 * Our Story follows the client's approved design rather than the generic block
 * layout, so it lives as its own route. Every word and photo around that layout
 * comes from the Our Story screen in the manager — see
 * `globals/OurStoryPage/content.ts` for how the values are resolved.
 */

const GOLD = '#f5c52d'

type Upload = { url?: string | null } | string | number | null | undefined
const isUpload = (value: Upload) => Boolean(value) && typeof value === 'object'

export default async function OurStoryPage() {
  const content = await getOurStoryContent()

  return (
    <article className="bg-[#f5f0e4] text-[#263039]">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#183c16]">
        {isUpload(content.heroImage) ? (
          <Media
            resource={content.heroImage as never}
            fill
            imgClassName="object-cover object-center"
            priority
          />
        ) : (
          <Image
            src="/hero-farm-panorama.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(0,25,8,0.88) 0%, rgba(0,25,8,0.7) 38%, rgba(0,0,0,0.15) 100%)',
          }}
        />

        {content.ribbonText && (
          <div
            className="pointer-events-none absolute -right-[86px] top-[52px] hidden rotate-[39deg] px-[88px] py-4 text-center text-[15px] font-bold text-[#064b25] shadow-md sm:block"
            style={{ background: GOLD }}
          >
            {content.ribbonText}
          </div>
        )}

        <div className="container relative z-10 max-w-[1536px] py-20 md:py-24">
          {content.heroEyebrow && (
            <p className="flex items-center gap-4 text-[13px] font-bold tracking-[0.3em] text-white">
              {content.heroEyebrow} <span className="h-px w-12 bg-white/60" />
            </p>
          )}

          <h1 className="mt-5 font-sans text-[64px] font-black leading-[0.87] tracking-[-0.03em] text-white sm:text-[92px] xl:text-[118px]">
            {content.headingLine1}
            <span className="block" style={{ color: GOLD }}>
              {content.headingLine2}
            </span>
          </h1>

          <p className="mt-5 max-w-[400px] text-[19px] leading-[1.35] text-zinc-100 sm:text-[22px]">
            {content.heroSubtext}
          </p>

          <Link
            href="/products"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#087a38] px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#0a9245]"
          >
            {content.heroButtonLabel} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── Story ────────────────────────────────────────────────────────── */}
      <section className="grid md:grid-cols-2">
        <div className="order-2 px-6 py-12 md:order-1 md:px-[8%] md:py-16">
          {content.storyEyebrow && (
            <p className="flex items-center gap-3 text-[13px] font-bold tracking-[0.25em] text-[#064b25]">
              {content.storyEyebrow} <span className="h-px w-10 bg-[#064b25]/40" />
            </p>
          )}
          {/* Split on newlines so the editor controls where the heading wraps. */}
          <h2 className="mt-3 font-serif text-[30px] leading-[1.05] text-[#1c3220] md:text-[44px]">
            {content.storyHeading.split('\n').map((line, i, all) => (
              <React.Fragment key={i}>
                {line}
                {i < all.length - 1 && <br />}
              </React.Fragment>
            ))}
          </h2>
          <div className="mt-6 space-y-4 text-[16px] leading-[1.55] text-[#3f4a42]">
            {content.storyParagraphs.map((text, i) => (
              <p key={i}>{text}</p>
            ))}
          </div>
        </div>

        <div className="relative order-1 min-h-[280px] md:order-2 md:min-h-[460px]">
          {isUpload(content.storyImage) ? (
            <Media resource={content.storyImage as never} fill imgClassName="object-cover" />
          ) : (
            <Image
              src="/our-story-soil.jpg"
              alt="Earthworms working through rich, dark compost"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          )}
        </div>
      </section>

      {/* ── Highlights ───────────────────────────────────────────────────── */}
      <section className="mx-4 my-4 rounded-xl bg-[#ebe9d9] px-3 py-6 sm:mx-[3.5%]">
        <ul className="grid grid-cols-2 gap-y-5 md:grid-cols-4 md:gap-y-0">
          {content.highlights.map((item, i) => {
            const isLast = i === content.highlights.length - 1
            return (
              <li
                key={item}
                className={
                  'text-center text-[15px] text-[#3f4a42] md:border-r md:border-[#c7cebd] ' +
                  (isLast ? 'md:border-r-0' : '')
                }
              >
                <span className="mr-2 text-[22px] font-bold text-[#064b25]">#</span>
                {item}
              </li>
            )
          })}
        </ul>
      </section>

      {/* ── Mission and vision ───────────────────────────────────────────── */}
      <section className="mx-4 mb-5 grid gap-2.5 sm:mx-[3.5%] md:grid-cols-2">
        {[
          { title: content.missionTitle, lines: content.missionLines },
          { title: content.visionTitle, lines: content.visionLines },
        ].map(({ title, lines }) => (
          <article key={title} className="rounded-xl bg-[#eee5d7] px-7 py-6">
            <h3 className="font-serif text-[26px] text-[#064b25]">{title}</h3>
            <div className="mt-2 space-y-1 text-[14px] leading-[1.45] text-[#4b5349]">
              {lines.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </article>
        ))}
      </section>

      {/* ── Closing ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {isUpload(content.closingImage) ? (
          <Media
            resource={content.closingImage as never}
            fill
            imgClassName="object-cover object-bottom"
          />
        ) : (
          <Image
            src="/hero-farm-panorama.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-bottom"
          />
        )}
        {/* Kept opaque behind the copy: the photo alone left the subheading
            barely legible against the foliage. */}
        <div className="absolute inset-0 bg-[#f5f0e4]/92" />

        <div className="container relative z-10 max-w-[1536px] py-14 text-center">
          <h2 className="font-serif text-[26px] text-[#1c3220] md:text-[34px]">
            {content.closingHeading}
          </h2>
          {content.closingSubtext && (
            <p className="mt-3 text-[15px] text-[#3f4a42]">{content.closingSubtext}</p>
          )}

          <Link
            href="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#087a38] px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#0a9245]"
          >
            {content.closingButtonLabel} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </article>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const content = await getOurStoryContent()
  return generateMeta({
    doc: { meta: content.meta, title: 'Our Story' } as never,
    path: '/our-story',
  })
}
