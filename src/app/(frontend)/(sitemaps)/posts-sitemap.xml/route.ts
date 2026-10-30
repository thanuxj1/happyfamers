import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getServerSideURL } from '@/utilities/getURL'

// Intentionally not wrapped in `unstable_cache`: Vercel's Data Cache outlives
// deployments, so a sitemap built with a stale origin would keep being served
// after the origin was corrected.
const getPostsSitemap = async () => {
  const payload = await getPayload({ config })
  const SITE_URL = getServerSideURL()

  const results = await payload.find({
    collection: 'posts',
    overrideAccess: false,
    draft: false,
    depth: 0,
    limit: 1000,
    pagination: false,
    where: {
      _status: {
        equals: 'published',
      },
    },
    select: {
      slug: true,
      updatedAt: true,
    },
  })

  const dateFallback = new Date().toISOString()

  return results.docs
    ? results.docs
        .filter((doc) => Boolean(doc?.slug))
        .map((doc) => ({
          loc: `${SITE_URL}/posts/${doc?.slug}`,
          lastmod: doc.updatedAt || dateFallback,
        }))
    : []
}

export async function GET() {
  const sitemap = await getPostsSitemap()

  return getServerSideSitemap(sitemap)
}
