import type { Category, Media, User } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'

import { heading, paragraph, richText } from './lexicalHelpers'

export type PostArgs = {
  heroImage: Media
  author: User
  categories: Category[]
}

export const post1: (args: PostArgs) => RequiredDataFromCollectionSlug<'posts'> = ({
  heroImage,
  author,
  categories,
}) => {
  return {
    slug: 'why-soil-health-matters-for-crop-yield',
    _status: 'published',
    authors: [author],
    categories: categories.map((c) => c.id),
    content: richText([
      heading(
        'Soil is a living system — and its health decides how much your land can produce, year after year.',
        'h2',
      ),
      paragraph(
        'Decades of chemical-first farming have left much of India’s topsoil depleted of organic matter and the microbial life that makes nutrients available to plants. The result: farmers reaching for more fertilizer each season just to hold yields steady.',
      ),
      heading('What "Healthy Soil" Actually Means', 'h2'),
      paragraph(
        'Healthy soil holds water like a sponge, hosts billions of beneficial microbes per gram, and releases nutrients to roots gradually instead of all at once. It resists erosion, buffers against drought, and needs less external input over time.',
      ),
      heading('Three Signs Your Soil Needs Organic Matter', 'h3'),
      paragraph(
        '1. Water runs off instead of soaking in. 2. Crops need more fertilizer each season for the same yield. 3. Soil is pale, compacted or has little visible earthworm activity.',
      ),
      heading('Rebuilding Soil the Natural Way', 'h2'),
      paragraph(
        'Vermicompost and vermiwash reintroduce organic matter and living microbes to soil that chemical fertilizers alone cannot restore. Applied consistently, they rebuild structure and fertility from the ground up — leading to stronger roots, better water efficiency and, ultimately, a healthier harvest.',
      ),
    ]),
    heroImage: heroImage.id,
    meta: {
      description:
        'Healthy soil holds water, hosts beneficial microbes and needs less fertilizer over time. Here’s what that means for your crop yield.',
      image: heroImage.id,
      title: 'Why Soil Health Matters for Crop Yield',
    },
    relatedPosts: [],
    title: 'Why Soil Health Matters for Crop Yield',
  }
}
