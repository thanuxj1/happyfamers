import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'
import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { Clock, Mail, MapPin, Phone, type LucideIcon } from 'lucide-react'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React, { cache } from 'react'

import { ContactEnquiryForm } from '@/components/ContactEnquiryForm'
import { SocialLinks } from '@/components/SocialLinks'
import { getSocialLinks } from '@/globals/SocialLinks/content'
import { generateMeta } from '@/utilities/generateMeta'

export const revalidate = 600

/**
 * The Contact page, laid out to fit one screen on a laptop: the form on the
 * left, the details in a panel on the right. The panel is on the right because
 * the EU ribbon sits in that corner, where it would otherwise cover the form.
 *
 * It takes this route over the generic [slug] page for the layout only. The
 * wording still comes from the Contact page document, so it stays editable
 * under Pages in the manager.
 */
const getContactPage = cache(async () => {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'pages',
    depth: 2,
    limit: 1,
    overrideAccess: false,
    pagination: false,
    where: { slug: { equals: 'contact' } },
  })
  return docs[0] ?? null
})

/** Rich text as lines. The manager saves plain paragraphs, the seed saved a heading first. */
function linesOf(content: unknown): string[] {
  const children = (content as { root?: { children?: { children?: { text?: string }[] }[] } })?.root
    ?.children
  return (children ?? [])
    .map((node) => (node.children ?? []).map((c) => c.text ?? '').join('').trim())
    .filter(Boolean)
}

type DetailRow = { Icon: LucideIcon; label: string; value: string; href?: string }

/**
 * Turns the page's three text columns (a title, then its lines) into rows, and
 * works out the phone and email links so visitors can tap them.
 */
function detailRows(columns: { richText?: unknown }[]): DetailRow[] {
  const rows: DetailRow[] = []

  for (const column of columns) {
    const [title = '', ...lines] = linesOf(column.richText)

    for (const line of lines) {
      const hours = line.match(/^(working hours|opening hours|hours)\s*:\s*(.+)$/i)
      if (hours) {
        rows.push({ Icon: Clock, label: 'Working Hours', value: hours[2]! })
      } else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(line)) {
        rows.push({ Icon: Mail, label: title, value: line, href: `mailto:${line}` })
      } else if (/^\+?[\d\s().-]{7,}$/.test(line)) {
        rows.push({ Icon: Phone, label: title, value: line, href: `tel:${line.replace(/[^\d+]/g, '')}` })
      } else {
        rows.push({ Icon: MapPin, label: title, value: line })
      }
    }
  }

  return rows
}

export default async function ContactPage() {
  const page = await getContactPage()
  if (!page) notFound()

  const payload = await getPayload({ config: configPromise })
  const [{ docs: products }, { links }] = await Promise.all([
    payload.find({
      collection: 'products',
      depth: 0,
      limit: 20,
      overrideAccess: false,
      pagination: false,
      select: { slug: true, title: true },
      sort: 'order',
    }),
    getSocialLinks(),
  ])

  const [heading = 'Get in Touch', ...intro] = linesOf(page.hero?.richText)
  const details = page.layout?.find((block) => block.blockType === 'content')
  const formBlock = page.layout?.find((block) => block.blockType === 'formBlock')
  const form = formBlock && typeof formBlock.form === 'object' ? formBlock.form : null
  const rows = details?.columns ? detailRows(details.columns) : []

  return (
    // 131px is the header and footer, so on a laptop this page and they share
    // exactly one screen, with the content centred in what's left.
    <div className="flex items-center bg-[#f7f5f0] lg:min-h-[calc(100dvh-131px)]">
      <div className="mx-auto grid w-full max-w-[1120px] gap-5 px-4 py-6 sm:px-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:py-3">
        <div>
          <h1 className="font-serif text-[30px] font-bold leading-tight text-[#1c3220]">{heading}</h1>
          {intro.length > 0 && (
            <p className="mb-2.5 mt-0.5 pr-24 text-[14px] leading-snug text-[#5d574a] sm:pr-0">
              {intro.join(' ')}
            </p>
          )}
          {form && (
            <div className="rounded-[18px] border border-[#e7e0cf] bg-[#fbf9f4] p-4 sm:px-5">
              <ContactEnquiryForm
                form={form as unknown as FormType}
                products={products.map(({ slug, title }) => ({ slug: slug ?? '', title }))}
              />
            </div>
          )}
        </div>

        <aside className="flex flex-col rounded-[18px] bg-[#2a4a28] px-6 py-5 text-white">
          <ul className="m-0 flex flex-1 list-none flex-col gap-4 p-0" style={{ justifyContent: 'space-evenly' }}>
            {rows.map(({ Icon, label, value, href }, i) => (
              <li key={i} className="flex items-start gap-3.5">
                <Icon className="mt-0.5 h-[22px] w-[22px] shrink-0 text-[#a8d96e]" strokeWidth={1.6} />
                <div className="min-w-0">
                  <p className="text-[12px] leading-tight text-zinc-300">{label}</p>
                  {href ? (
                    <a href={href} className="break-words text-[14.5px] text-white hover:underline">
                      {value}
                    </a>
                  ) : (
                    <p className="text-[14.5px] leading-snug text-white">{value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {links.length > 0 && (
            <div className="pt-4">
              <p className="mb-1.5 text-[12px] text-zinc-300">Follow us</p>
              <SocialLinks links={links} className="-ml-2 text-[#d9ecc0]" />
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContactPage()
  return generateMeta({ doc: page, path: '/contact' })
}
