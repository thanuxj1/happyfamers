import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import { ProductHero } from '@/components/ProductHero'
import { ProductSchema } from '@/components/ProductSchema'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { CheckCircle2 } from 'lucide-react'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const products = await payload.find({
    collection: 'products',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  return products.docs.map(({ slug }) => ({ slug }))
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function ProductPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = '/products/' + decodedSlug
  const product = await queryProductBySlug({ slug: decodedSlug })

  if (!product) return <PayloadRedirects url={url} />

  // No top padding: the hero carries its own, and a gap here showed as a cream
  // band between the header and the hero's background.
  return (
    <article className="pb-16">
      <PageClient />

      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <ProductSchema product={product} />

      <ProductHero product={product} />

      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="container">
          {product.benefits && product.benefits.length > 0 && (
            <ul className="max-w-[48rem] mx-auto mb-8 grid gap-3 sm:grid-cols-2">
              {product.benefits.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0 text-primary" />
                  <span>{item.benefit}</span>
                </li>
              ))}
            </ul>
          )}

          <RichText className="max-w-[48rem] mx-auto" data={product.content} enableGutter={false} />
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const product = await queryProductBySlug({ slug: decodedSlug })

  return generateMeta({ doc: product, path: `/products/${decodedSlug}` })
}

const queryProductBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
    depth: 2,
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
