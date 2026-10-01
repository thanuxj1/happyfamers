import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { getCachedGlobal } from '@/utilities/getGlobals'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getServerSideURL } from '@/utilities/getURL'
import { HomeHero } from '@/components/home/HomeHero'
import { ProcessSteps } from '@/components/home/ProcessSteps'
import { ProductsPreview } from '@/components/home/ProductsPreview'
import { WhyChooseUs } from '@/components/home/WhyChooseUs'
import { ImpactGrid } from '@/components/home/ImpactGrid'
import { CertificationCard } from '@/components/home/CertificationCard'
import { ContactFormBox } from '@/components/home/ContactFormBox'
import { ContactInfoBox } from '@/components/home/ContactInfoBox'

export const revalidate = 0

export default async function HomePageRoute() {
  const homePage = await getCachedGlobal('home-page', 2)()
  const payload = await getPayload({ config: configPromise })

  const { docs: products } = await payload.find({
    collection: 'products',
    depth: 1,
    limit: homePage.productsLimit || 3,
    sort: 'order',
    overrideAccess: true,
    where: { _status: { equals: 'published' } },
  })

  return (
    <>
      <HomeHero data={homePage} />

      <main className="relative z-10 bg-[#f7f5f0] pb-6 text-[#2c332d] lg:pb-1.5">
        <div className="mx-auto w-full max-w-[1536px] px-4 sm:px-5">

          {/* ════════════════════════════════════════
              ROW 1 — Process Steps | Products | Why Choose
              The three-column grid is the designed desktop layout; below `lg`
              the columns stack so nothing is squeezed.
              ════════════════════════════════════════ */}
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-4">
            <div className="lg:flex-[9]">
              <ProcessSteps data={homePage} />
            </div>
            <div className="lg:flex-[10]">
              <ProductsPreview data={homePage} products={products} />
            </div>
            <div className="lg:flex-[5]">
              <WhyChooseUs data={homePage} />
            </div>
          </div>

          <div className="mt-6 lg:mt-[17px]" />

          {/* ════════════════════════════════════════
              ROW 2 — Impact | Cert + Form | Contact Info
              ════════════════════════════════════════ */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-4">
            <div className="lg:flex-[9]">
              <ImpactGrid data={homePage} />
            </div>
            <div className="flex flex-col gap-6 sm:flex-row sm:gap-4 lg:flex-[10]">
              <div className="flex-1">
                <CertificationCard data={homePage} />
              </div>
              <div className="flex-1">
                <ContactFormBox data={homePage} />
              </div>
            </div>
            {/* Bleeds past the container's right gutter, as in the design. */}
            <div className="-mx-4 flex sm:-mx-5 lg:mx-0 lg:-mr-5 lg:flex-[5]">
              <ContactInfoBox data={homePage} />
            </div>
          </div>

        </div>
      </main>
    </>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const homePage = await getCachedGlobal('home-page', 1)()
  const title = homePage?.meta?.title
    ? `${homePage.meta.title} | Happy Farmers`
    : 'Healthy Soil. Healthy Harvest. | Happy Farmers'
  const description = homePage?.meta?.description || homePage?.subtext

  const metaImage = homePage?.meta?.image
  const ogImage =
    metaImage && typeof metaImage === 'object' && metaImage.url
      ? getServerSideURL() + (metaImage.sizes?.og?.url || metaImage.url)
      : undefined

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: '/' },
    openGraph: mergeOpenGraph({
      title,
      description: description || '',
      url: '/',
      images: ogImage ? [{ url: ogImage }] : undefined,
    }),
  }
}
