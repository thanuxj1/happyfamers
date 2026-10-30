import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getServerSideURL } from '@/utilities/getURL'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import PageClient from './page.client'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })
  const archiveSettings = await getCachedGlobal('archive-settings', 1)()

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
    },
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>{archiveSettings?.postsHeading || 'Resources'}</h1>
          <p>
            {archiveSettings?.postsIntro ||
              'Guides and articles on soil health, vermicomposting and organic certification.'}
          </p>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="posts"
          currentPage={posts.page}
          limit={12}
          totalDocs={posts.totalDocs}
        />
      </div>

      <CollectionArchive posts={posts.docs} />

      <div className="container">
        {posts.totalPages > 1 && posts.page && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const archiveSettings = await getCachedGlobal('archive-settings', 1)()
  const meta = archiveSettings?.postsMeta

  const title = meta?.title || archiveSettings?.postsHeading || 'Resources'
  const description =
    meta?.description ||
    'Guides and articles on soil health, vermicomposting and organic certification from Happy Farmers.'

  const metaImage = meta?.image
  const ogImage =
    metaImage && typeof metaImage === 'object' && metaImage.url
      ? getServerSideURL() + (metaImage.sizes?.og?.url || metaImage.url)
      : undefined

  return {
    title,
    description,
    alternates: { canonical: '/posts' },
    openGraph: mergeOpenGraph({
      title: `${title} | Happy Farmers`,
      description,
      url: '/posts',
      images: ogImage ? [{ url: ogImage }] : undefined,
    }),
  }
}
