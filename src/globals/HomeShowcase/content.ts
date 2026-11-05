import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { cache } from 'react'

import type { Media } from '@/payload-types'

/** The photos and labels the site shipped with, used until replaced in the manager. */
export const HOME_SHOWCASE_DEFAULTS = [
  {
    src: '/home/plant-nursery.jpg',
    alt: 'A seedling lifted from a nursery tray, its roots holding the compost together',
    label: 'Plant Nurseries',
  },
  {
    src: '/home/indoor-plants.jpg',
    alt: 'An orchid, African violets and an anthurium in pots on a sunny windowsill',
    label: 'Indoor Plants',
  },
] as const

export type ShowcaseTile = {
  /** A photo uploaded in the manager, when there is one. */
  media: Media | null
  /** The built-in photo used otherwise. */
  src: string
  alt: string
  label: string
}

const asMedia = (value: unknown): Media | null =>
  value && typeof value === 'object' ? (value as Media) : null

/**
 * Resolves the two tiles. A photo uploaded in the manager wins over the
 * built-in one. A label that has been saved is used as saved — including
 * empty, which hides it — while one never saved falls back to the default.
 * If the global's table does not exist yet the defaults are used throughout.
 */
export const getHomeShowcase = cache(async (): Promise<{
  tiles: ShowcaseTile[]
  /** False until the schema change has been applied; the manager hides the section until then. */
  available: boolean
}> => {
  const payload = await getPayload({ config: configPromise })
  const stored = await payload
    .findGlobal({ slug: 'home-showcase', depth: 1 })
    .then((doc) => doc as unknown as Record<string, unknown>)
    .catch(() => null)

  const tiles = HOME_SHOWCASE_DEFAULTS.map((fallback, i) => {
    const media = asMedia(stored?.[`image${i + 1}`])
    const savedLabel = stored?.[`label${i + 1}`]
    return {
      media,
      src: fallback.src,
      alt: media?.alt || fallback.alt,
      label: typeof savedLabel === 'string' ? savedLabel.trim() : fallback.label,
    }
  })

  return { tiles, available: stored !== null }
})
