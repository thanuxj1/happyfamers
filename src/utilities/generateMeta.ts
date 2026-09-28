import type { Metadata } from 'next'

import type { Media, Page, Post, Product, Config } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/website-template-OG.webp'

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url

    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return url
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | Partial<Product> | null
  /** The page's own path, e.g. `/posts/my-post`. Falls back to `/${doc.slug}` (a Pages-collection assumption) when omitted. */
  path?: string
}): Promise<Metadata> => {
  const { doc, path } = args

  const ogImage = getImageURL(doc?.meta?.image)

  const title = doc?.meta?.title
    ? doc?.meta?.title + ' | Happy Farmers'
    : 'Happy Farmers | Healthy Soil. Healthy Harvest.'

  const canonicalPath = path || (typeof doc?.slug === 'string' ? `/${doc.slug}` : '/')

  return {
    alternates: {
      canonical: canonicalPath,
    },
    description: doc?.meta?.description,
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || '',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: canonicalPath,
    }),
    // `absolute` bypasses the root layout's `%s | Happy Farmers` title template —
    // this string already has the brand suffix, so the template would double it.
    title: { absolute: title },
  }
}
