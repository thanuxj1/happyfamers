import type { Category, Media, User } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'

import { heading, paragraph, richText } from './lexicalHelpers'
import type { PostArgs } from './post-1'

export const post2: (args: PostArgs) => RequiredDataFromCollectionSlug<'posts'> = ({
  heroImage,
  author,
  categories,
}) => {
  return {
    slug: 'vermicomposting-101',
    _status: 'published',
    authors: [author],
    categories: categories.map((c) => c.id),
    content: richText([
      heading('Turning Organic Waste into Nutrient-Rich Compost', 'h2'),
      paragraph(
        'Vermicomposting uses earthworms to break down organic waste — kitchen scraps, crop residue, market waste — into a stable, nutrient-dense soil amendment far faster than traditional composting, and without the smell.',
      ),
      heading('The Process, Step by Step', 'h2'),
      paragraph(
        '1. Organic matter in: quality organic waste is sourced and sorted. 2. Earthworm magic: earthworms consume the material, and their gut microbes break it down further. 3. Nutrient-rich harvest: the resulting castings are sieved into a fine, dark, odour-free vermicompost.',
      ),
      heading('Why It Outperforms Raw Compost', 'h3'),
      paragraph(
        'Vermicompost carries a higher concentration of plant-available nutrients, beneficial bacteria and natural growth hormones than compost made without worms. It also improves soil structure immediately on application, rather than needing months to break down further.',
      ),
      heading('Getting Started at Home or on the Farm', 'h2'),
      paragraph(
        'A small worm bin can process kitchen waste for a home garden, while farms typically apply finished vermicompost directly to fields at 200–500g per plant, or blend it into potting mixes with coco peat for nurseries.',
      ),
    ]),
    heroImage: heroImage.id,
    meta: {
      description:
        'How earthworms turn organic waste into nutrient-dense vermicompost — and why it outperforms regular compost.',
      image: heroImage.id,
      title: 'Vermicomposting 101: Turning Waste into Wealth',
    },
    relatedPosts: [],
    title: 'Vermicomposting 101: Turning Waste into Wealth',
  }
}
