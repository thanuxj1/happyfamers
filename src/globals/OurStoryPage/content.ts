import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { cache } from 'react'

/**
 * The wording Our Story shipped with, used when a field has not been filled in
 * from the manager yet. Keeping them here means the page never renders a blank
 * headline, and the manager can show the real copy as its starting point.
 */
export const OUR_STORY_DEFAULTS = {
  ribbonText: 'EU Organic Certified',
  heroEyebrow: 'OUR STORY',
  headingLine1: 'BLACK',
  headingLine2: 'GOLD',
  heroSubtext:
    'The world’s best natural fertiliser for healthier plants, richer soil and a greener tomorrow.',
  heroButtonLabel: 'Our Products',
  storyEyebrow: 'OUR STORY',
  storyHeading: 'From Nature’s Cycle\nto Healthier Harvests',
  highlights: ['Years of research', 'Zero chemicals', 'Proven in the field', 'EU Organic Certified'],
  missionTitle: 'Our Mission',
  visionTitle: 'Our Vision',
  closingHeading: 'Better Soil. Better Crops. Better Tomorrow.',
  closingButtonLabel: 'Explore Products',
}

type Block = {
  blockType?: string
  columns?: { richText?: unknown }[] | null
  richText?: unknown
}

/** Flattens a Lexical rich-text value into plain paragraphs. */
const paragraphs = (richText: unknown): string[] => {
  const children = (richText as { root?: { children?: unknown[] } })?.root?.children
  if (!Array.isArray(children)) return []
  return children
    .map((node) =>
      ((node as { children?: { text?: string }[] }).children ?? [])
        .map((c) => c.text ?? '')
        .join('')
        .trim(),
    )
    .filter(Boolean)
}

const clean = (value: unknown): string | null => {
  const text = typeof value === 'string' ? value.trim() : ''
  return text ? text : null
}

const listFrom = (rows: { text?: string | null }[] | null | undefined): string[] =>
  (rows ?? []).map((row) => (row.text ?? '').trim()).filter(Boolean)

/**
 * Builds the Our Story content.
 *
 * Fields entered in the manager win. Anything still blank falls back to the
 * prose stored on the original `our-story` page document, and then to the
 * wording the page shipped with — so the page reads correctly before, during
 * and after the move into the manager, and cannot go blank if the global has
 * not been created yet.
 */
export const getOurStoryContent = cache(async () => {
  const payload = await getPayload({ config: configPromise })

  const [global, page] = await Promise.all([
    payload
      .findGlobal({ slug: 'our-story-page', depth: 1 })
      // The global's table is added by a schema change; until that has been
      // applied the page must still render rather than 500.
      .catch(() => null),
    payload
      .find({
        collection: 'pages',
        where: { slug: { equals: 'our-story' } },
        limit: 1,
        depth: 1,
        overrideAccess: false,
      })
      .then(({ docs }) => docs[0] ?? null)
      .catch(() => null),
  ])

  const layout = ((page?.layout ?? []) as Block[]).filter(Boolean)
  const contentBlocks = layout.filter((b) => b.blockType === 'content')
  const legacyStory = paragraphs(contentBlocks[0]?.columns?.[0]?.richText)
  const legacyMission = paragraphs(contentBlocks[1]?.columns?.[0]?.richText)
  const legacyVision = paragraphs(contentBlocks[1]?.columns?.[1]?.richText)
  const legacyClosing = paragraphs(layout.find((b) => b.blockType === 'cta')?.richText)

  const g = (global ?? {}) as Record<string, unknown>
  const storyParagraphs = listFrom(g.storyParagraphs as { text?: string | null }[] | null)
  const highlights = listFrom(g.highlights as { text?: string | null }[] | null)

  return {
    ribbonText: clean(g.ribbonText) ?? OUR_STORY_DEFAULTS.ribbonText,
    heroEyebrow: clean(g.heroEyebrow) ?? OUR_STORY_DEFAULTS.heroEyebrow,
    headingLine1: clean(g.headingLine1) ?? OUR_STORY_DEFAULTS.headingLine1,
    headingLine2: clean(g.headingLine2) ?? OUR_STORY_DEFAULTS.headingLine2,
    heroSubtext: clean(g.heroSubtext) ?? OUR_STORY_DEFAULTS.heroSubtext,
    heroButtonLabel: clean(g.heroButtonLabel) ?? OUR_STORY_DEFAULTS.heroButtonLabel,
    heroImage: g.heroImage ?? null,

    storyEyebrow: clean(g.storyEyebrow) ?? OUR_STORY_DEFAULTS.storyEyebrow,
    storyHeading: clean(g.storyHeading) ?? OUR_STORY_DEFAULTS.storyHeading,
    storyParagraphs: storyParagraphs.length ? storyParagraphs : legacyStory,
    storyImage: g.storyImage ?? null,

    highlights: highlights.length ? highlights : OUR_STORY_DEFAULTS.highlights,

    missionTitle: clean(g.missionTitle) ?? OUR_STORY_DEFAULTS.missionTitle,
    missionLines: clean(g.missionText) ? [clean(g.missionText) as string] : legacyMission,
    visionTitle: clean(g.visionTitle) ?? OUR_STORY_DEFAULTS.visionTitle,
    visionLines: clean(g.visionText) ? [clean(g.visionText) as string] : legacyVision,

    closingHeading:
      clean(g.closingHeading) ?? legacyClosing[0] ?? OUR_STORY_DEFAULTS.closingHeading,
    closingSubtext: clean(g.closingSubtext) ?? legacyClosing[1] ?? null,
    closingButtonLabel: clean(g.closingButtonLabel) ?? OUR_STORY_DEFAULTS.closingButtonLabel,
    closingImage: g.closingImage ?? null,

    meta: (g.meta as Record<string, unknown> | undefined) ?? page?.meta ?? null,
    legacyPage: page,
  }
})
