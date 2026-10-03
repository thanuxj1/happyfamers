import type { getManagePayload } from '@/utilities/getManagePayload'

type Payload = Awaited<ReturnType<typeof getManagePayload>>['payload']

const idOf = (value: unknown): number | null => {
  if (typeof value === 'number') return value
  if (value && typeof value === 'object' && 'id' in value) {
    const id = (value as { id?: unknown }).id
    return typeof id === 'number' ? id : null
  }
  return null
}

/**
 * Maps each photo to the places that reference it, so the library can say what
 * a photo is for and which ones are safe to delete.
 *
 * The media-bearing fields are listed explicitly rather than discovered by
 * walking the documents: a generic walk would treat any number matching a photo
 * id — a limit, an order, a count — as a reference.
 */
export async function buildPhotoUsage(payload: Payload): Promise<Map<number, string[]>> {
  const usage = new Map<number, string[]>()

  const note = (value: unknown, where: string) => {
    const id = idOf(value)
    if (id === null) return
    const existing = usage.get(id)
    if (existing) {
      if (!existing.includes(where)) existing.push(where)
    } else {
      usage.set(id, [where])
    }
  }

  const [products, posts, pages, home, footer] = await Promise.all([
    payload.find({ collection: 'products', limit: 500, depth: 0, pagination: false }),
    payload.find({ collection: 'posts', limit: 500, depth: 0, pagination: false, draft: true }),
    payload.find({ collection: 'pages', limit: 500, depth: 0, pagination: false, draft: true }),
    payload.findGlobal({ slug: 'home-page', depth: 0 }),
    payload.findGlobal({ slug: 'footer', depth: 0 }),
  ])

  for (const product of products.docs) {
    const where = `Product: ${product.title}`
    note(product.heroImage, where)
    note(product.meta?.image, where)
  }

  for (const post of posts.docs) {
    const where = `Article: ${post.title || 'Untitled'}`
    note(post.heroImage, where)
    note(post.meta?.image, where)
  }

  for (const page of pages.docs) {
    const where = `Page: ${page.title}`
    note(page.meta?.image, where)
    for (const block of page.layout ?? []) {
      if (block.blockType === 'mediaBlock') note((block as { media?: unknown }).media, where)
    }
  }

  note(home.backgroundImage, 'Home page')
  note(home.circleImage, 'Home page')
  note(home.roundedImage, 'Home page')
  note(home.infoStripImage, 'Home page')
  note(home.meta?.image, 'Home page')
  for (const step of home.processSteps ?? []) note(step.image, 'Home page — how it works')
  for (const item of home.impactItems ?? []) note(item.image, 'Home page — benefits')

  note(footer.backgroundImage, 'Footer')

  return usage
}
