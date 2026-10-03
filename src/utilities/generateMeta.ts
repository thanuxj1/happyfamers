import type { Metadata } from 'next'

import type { Media, Page, Post, Product, Config } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  // Media is served straight from Vercel Blob, so these are already absolute;
  // only the locally hosted fallback and any relative path need the origin.
  const absolute = (url: string) => (/^https?:\/\//.test(url) ? url : serverUrl + url)

  if (image && typeof image === 'object' && 'url' in image) {
    const candidate = image.sizes?.og?.url || image.url
    if (candidate) return absolute(candidate)
  }

  return serverUrl + '/og-happy-farmers.jpg'
}

type MetaDoc = Partial<Page> | Partial<Post> | Partial<Product>

/**
 * Search metadata is derived from the content itself so that publishing needs
 * no separate SEO step. The `meta` fields still win when someone fills them in,
 * but leaving them empty yields the document's own title, summary and photo
 * rather than one generic title repeated across every page.
 */
const firstParagraph = (content: unknown): string | undefined => {
  const children = (content as { root?: { children?: unknown[] } })?.root?.children
  if (!Array.isArray(children)) return undefined

  for (const node of children) {
    const text = ((node as { children?: { text?: string }[] }).children ?? [])
      .map((c) => c.text ?? '')
      .join('')
      .trim()
    if (text) return text.length > 155 ? `${text.slice(0, 152).trimEnd()}…` : text
  }

  return undefined
}

const resolveDescription = (doc: MetaDoc | null): string | undefined => {
  if (doc?.meta?.description) return doc.meta.description

  const shortDescription = (doc as Partial<Product> | null)?.shortDescription
  if (shortDescription) return shortDescription

  return firstParagraph((doc as Partial<Post> | null)?.content)
}

const resolveImage = (doc: MetaDoc | null) =>
  doc?.meta?.image ?? (doc as Partial<Post> | null)?.heroImage ?? null

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | Partial<Product> | null
  /** The page's own path, e.g. `/posts/my-post`. Falls back to `/${doc.slug}` (a Pages-collection assumption) when omitted. */
  path?: string
}): Promise<Metadata> => {
  const { doc, path } = args

  const ogImage = getImageURL(resolveImage(doc))

  const ownTitle = doc?.meta?.title || doc?.title
  const title = ownTitle ? `${ownTitle} | Happy Farmers` : 'Happy Farmers | Healthy Soil. Healthy Harvest.'

  const description = resolveDescription(doc)

  const canonicalPath = path || (typeof doc?.slug === 'string' ? `/${doc.slug}` : '/')

  return {
    alternates: {
      canonical: canonicalPath,
    },
    description,
    openGraph: mergeOpenGraph({
      description: description || '',
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
