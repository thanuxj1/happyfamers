import type { Metadata } from 'next/types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import Link from 'next/link'

import { Card } from '@/components/Card'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getServerSideURL } from '@/utilities/getURL'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import PageClient from './page.client'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })
  const archiveSettings = await getCachedGlobal('archive-settings', 1)()

  const products = await payload.find({
    collection: 'products',
    depth: 1,
    limit: 100,
    overrideAccess: false,
    sort: 'order',
    select: {
      title: true,
      slug: true,
      meta: true,
      priceLabel: true,
    },
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>{archiveSettings?.productsHeading || 'Our Products'}</h1>
          <p>
            {archiveSettings?.productsIntro ||
              'Natural, chemical-free soil and crop inputs made from carefully sourced organic matter. Every batch is tested for quality before it leaves our facility.'}
          </p>
        </div>
      </div>

      <div className="container">
        <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-y-4 gap-x-4 lg:gap-y-8 lg:gap-x-8 xl:gap-x-8">
          {products.docs?.map((product, index) => {
            if (typeof product === 'object' && product !== null) {
              return (
                <div className="col-span-4" key={index}>
                  <Card className="h-full" doc={product} relationTo="products" />
                </div>
              )
            }
            return null
          })}
        </div>

        {products.docs.length === 0 && (
          <p className="text-muted-foreground">
            No products published yet. Add some from the{' '}
            <Link href="/admin/collections/products">admin dashboard</Link>.
          </p>
        )}
      </div>
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const archiveSettings = await getCachedGlobal('archive-settings', 1)()
  const meta = archiveSettings?.productsMeta

  const title = meta?.title || archiveSettings?.productsHeading || 'Our Products'
  const description =
    meta?.description ||
    'Vermicompost, vermiwash and coco peat — 100% organic, EU-certified soil and crop inputs from Happy Farmers.'

  const metaImage = meta?.image
  const ogImage =
    metaImage && typeof metaImage === 'object' && metaImage.url
      ? getServerSideURL() + (metaImage.sizes?.og?.url || metaImage.url)
      : undefined

  return {
    title,
    description,
    alternates: { canonical: '/products' },
    openGraph: mergeOpenGraph({
      title: `${title} | Happy Farmers`,
      description,
      url: '/products',
      images: ogImage ? [{ url: ogImage }] : undefined,
    }),
  }
}
