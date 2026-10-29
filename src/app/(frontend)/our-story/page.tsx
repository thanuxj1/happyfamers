import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import React, { cache } from 'react'

import { generateMeta } from '@/utilities/generateMeta'

/**
 * Our Story follows the client's approved design rather than the generic block
 * layout, so it lives as its own route. Its prose still comes from the
 * `our-story` page document — the story paragraphs, the mission and vision
 * columns, and the closing line — so the wording stays editable under Pages in
 * the manager while the layout stays fixed.
 */

const GOLD = '#f5c52d'

const HIGHLIGHTS = ['Years of research', 'Zero chemicals', 'Proven in the field', 'EU Organic Certified']

type Block = {
  blockType?: string
  columns?: { richText?: unknown }[] | null
  richText?: unknown
}

const paragraphs = (richText: unknown): string[] => {
  const children = (richText as { root?: { children?: unknown[] } })?.root?.children
  if (!Array.isArray(children)) return []
  return children
    .map((node) =>
      ((node as { children?: { text?: string }[] }).children ?? [])
        .map((c) => c.text ?? '')
        .join('')
        .trim(),
    )
    .filter(Boolean)
}

const getPage = cache(async () => {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'our-story' } },
    limit: 1,
    depth: 1,
    overrideAccess: false,
  })
  return docs[0] ?? null
})

export default async function OurStoryPage() {
  const page = await getPage()
  const layout = ((page?.layout ?? []) as Block[]).filter(Boolean)

  const contentBlocks = layout.filter((b) => b.blockType === 'content')
  const story = paragraphs(contentBlocks[0]?.columns?.[0]?.richText)
  const mission = paragraphs(contentBlocks[1]?.columns?.[0]?.richText)
  const vision = paragraphs(contentBlocks[1]?.columns?.[1]?.richText)
  const closing = paragraphs(layout.find((b) => b.blockType === 'cta')?.richText)

  return (
    <article className="bg-[#f5f0e4] text-[#263039]">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#183c16]">
        <Image
          src="/hero-farm-panorama.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(0,25,8,0.88) 0%, rgba(0,25,8,0.7) 38%, rgba(0,0,0,0.15) 100%)',
          }}
        />

        {/* Diagonal certification ribbon, as in the design. */}
        <div
          className="pointer-events-none absolute -right-[86px] top-[52px] hidden rotate-[39deg] px-[88px] py-4 text-center text-[15px] font-bold text-[#064b25] shadow-md sm:block"
          style={{ background: GOLD }}
        >
          EU Organic Certified
        </div>

        <div className="container relative z-10 max-w-[1536px] py-20 md:py-24">
          <p className="flex items-center gap-4 text-[13px] font-bold tracking-[0.3em] text-white">
            OUR STORY <span className="h-px w-12 bg-white/60" />
          </p>

          <h1 className="mt-5 font-sans text-[64px] font-black leading-[0.87] tracking-[-0.03em] text-white sm:text-[92px] xl:text-[118px]">
            BLACK
            <span className="block" style={{ color: GOLD }}>
              GOLD
            </span>
          </h1>

          <p className="mt-5 max-w-[400px] text-[19px] leading-[1.35] text-zinc-100 sm:text-[22px]">
            The world&rsquo;s best natural fertiliser for healthier plants, richer soil and a greener
            tomorrow.
          </p>

          <Link
            href="/products"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#087a38] px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#0a9245]"
          >
            Our Products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── Story ────────────────────────────────────────────────────────── */}
      <section className="grid md:grid-cols-2">
        <div className="order-2 px-6 py-12 md:order-1 md:px-[8%] md:py-16">
          <p className="flex items-center gap-3 text-[13px] font-bold tracking-[0.25em] text-[#064b25]">
            OUR STORY <span className="h-px w-10 bg-[#064b25]/40" />
          </p>
          <h2 className="mt-3 font-serif text-[30px] leading-[1.05] text-[#1c3220] md:text-[44px]">
            From Nature&rsquo;s Cycle
            <br />
            to Healthier Harvests
          </h2>
          <div className="mt-6 space-y-4 text-[16px] leading-[1.55] text-[#3f4a42]">
            {story.map((text, i) => (
              <p key={i}>{text}</p>
            ))}
          </div>
        </div>

        <div className="relative order-1 min-h-[280px] md:order-2 md:min-h-[460px]">
          <Image
            src="/our-story-soil.jpg"
            alt="Earthworms working through rich, dark compost"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* ── Highlights ───────────────────────────────────────────────────── */}
      <section className="mx-4 my-4 rounded-xl bg-[#ebe9d9] px-3 py-6 sm:mx-[3.5%]">
        <ul className="grid grid-cols-2 gap-y-5 md:grid-cols-4 md:gap-y-0">
          {HIGHLIGHTS.map((item, i) => (
            <li
              key={item}
              className={`text-center text-[15px] text-[#3f4a42] md:border-r md:border-[#c7cebd] ${
                i === HIGHLIGHTS.length - 1 ? 'md:border-r-0' : ''
              }`}
            >
              <span className="mr-2 text-[22px] font-bold text-[#064b25]">#</span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* ── Mission and vision ───────────────────────────────────────────── */}
      <section className="mx-4 mb-5 grid gap-2.5 sm:mx-[3.5%] md:grid-cols-2">
        {[
          { title: 'Our Mission', lines: mission },
          { title: 'Our Vision', lines: vision },
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
        <Image src="/hero-farm-panorama.png" alt="" fill sizes="100vw" className="object-cover object-bottom" />
        {/* Kept opaque behind the copy: the photo alone left the subheading
            barely legible against the foliage. */}
        <div className="absolute inset-0 bg-[#f5f0e4]/92" />

        <div className="container relative z-10 max-w-[1536px] py-14 text-center">
          <h2 className="font-serif text-[26px] text-[#1c3220] md:text-[34px]">
            {closing[0] ?? 'Better Soil. Better Crops. Better Tomorrow.'}
          </h2>
          {closing[1] && <p className="mt-3 text-[15px] text-[#3f4a42]">{closing[1]}</p>}

          <Link
            href="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#087a38] px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#0a9245]"
          >
            Explore Products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </article>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage()
  return generateMeta({ doc: page, path: '/our-story' })
}
