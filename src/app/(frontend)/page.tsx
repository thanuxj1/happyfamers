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
import { Reveal } from '@/components/motion/Reveal'

export const revalidate = 600

export default async function HomePageRoute() {
  const homePage = await getCachedGlobal('home-page', 2)()
  const payload = await getPayload({ config: configPromise })

  const { docs: products } = await payload.find({
    collection: 'products',
    depth: 1,
    limit: homePage.productsLimit || 3,
    sort: 'order',
    overrideAccess: false,
  })

  return (
    <>
      <HomeHero data={homePage} />

      <main className="relative z-10 bg-brand-cream-bg pb-12 pt-8 text-[#2c332d] sm:pb-16 sm:pt-10">
        <div className="container space-y-10 sm:space-y-12">
          <section className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-6">
            <div className="flex flex-col gap-8 lg:col-span-8">
              <ProcessSteps data={homePage} />
              <ProductsPreview data={homePage} products={products} />
            </div>
            <div className="lg:col-span-4">
              <WhyChooseUs data={homePage} />
            </div>
          </section>

          <ImpactGrid data={homePage} />

          <section className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 lg:grid-cols-12">
            <Reveal className="lg:col-span-3" delay={0}>
              <CertificationCard data={homePage} />
            </Reveal>
            <Reveal className="lg:col-span-6" delay={0.1}>
              <ContactFormBox data={homePage} />
            </Reveal>
            <Reveal className="md:col-span-2 lg:col-span-3" delay={0.2}>
              <ContactInfoBox data={homePage} />
            </Reveal>
          </section>
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
