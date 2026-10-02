import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getServerSideURL } from '@/utilities/getURL'

// Intentionally not wrapped in `unstable_cache`: Vercel's Data Cache outlives
// deployments, so a sitemap built with a stale origin would keep being served
// after the origin was corrected.
const getPagesSitemap = async () => {
  const payload = await getPayload({ config })
  const SITE_URL = getServerSideURL()

  const results = await payload.find({
    collection: 'pages',
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

  // The home page is a global rendered by app/(frontend)/page.tsx rather than a
  // `pages` document, so it has to be listed explicitly. `/search` is left out
  // deliberately — search result pages are not worth indexing.
  const defaultSitemap = [
    {
      loc: `${SITE_URL}/`,
      lastmod: dateFallback,
    },
    {
      loc: `${SITE_URL}/posts`,
      lastmod: dateFallback,
    },
    {
      loc: `${SITE_URL}/products`,
      lastmod: dateFallback,
    },
  ]

  const sitemap = results.docs
    ? results.docs
        .filter((page) => Boolean(page?.slug) && page?.slug !== 'home')
        .map((page) => ({
          loc: `${SITE_URL}/${page?.slug}`,
          lastmod: page.updatedAt || dateFallback,
        }))
    : []

  return [...defaultSitemap, ...sitemap]
}

export async function GET() {
  const sitemap = await getPagesSitemap()

  return getServerSideSitemap(sitemap)
}
