import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Media } from '@/payload-types'

import { heading, paragraph, richText } from './lexicalHelpers'

type OurStoryArgs = {
  storyImage: Media
}

export const ourStory: (args: OurStoryArgs) => RequiredDataFromCollectionSlug<'pages'> = ({
  storyImage,
}) => {
  return {
    slug: 'our-story',
    _status: 'published',
    hero: {
      type: 'lowImpact',
      richText: richText([
        heading('Our Story', 'h1'),
        paragraph(
          'Happy Farmers started with a simple observation: healthy harvests begin with healthy soil, and most Indian farmland has been losing that health for decades of chemical-first agriculture.',
        ),
      ]),
    },
    layout: [
      {
        blockName: 'From Farm Waste to Farm Wealth',
        blockType: 'content',
        columns: [
          {
            size: 'full',
            richText: richText([
              heading('From Farm Waste to Farm Wealth', 'h2'),
              paragraph(
                'We are a Karnataka-based organic inputs manufacturer dedicated to rebuilding soil health the natural way. By partnering with local farms, markets and food processing units, we source organic matter that would otherwise go to waste and transform it into nutrient-dense vermicompost, vermiwash and coco peat.',
              ),
              paragraph(
                'Every batch passes through our earthworm-powered composting process and is tested before it reaches a single field. The result is a product farmers can trust, season after season.',
              ),
            ]),
          },
        ],
      },
      {
        blockName: 'Story Image',
        blockType: 'mediaBlock',
        media: storyImage.id,
      },
      {
        blockName: 'Mission and Vision',
        blockType: 'content',
        columns: [
          {
            size: 'half',
            richText: richText([
              heading('Our Mission', 'h3'),
              paragraph(
                'To make chemical-free soil regeneration accessible and affordable for every farmer, one batch of vermicompost at a time.',
              ),
            ]),
          },
          {
            size: 'half',
            richText: richText([
              heading('Our Vision', 'h3'),
              paragraph(
                'A future where Indian agriculture is sustainable by default — richer soil, stronger crops and healthier communities.',
              ),
            ]),
          },
        ],
      },
      {
        blockName: 'CTA',
        blockType: 'cta',
        richText: richText([
          heading('Better Soil. Better Crops. Better Tomorrow.', 'h3'),
          paragraph('See the organic inputs we manufacture and how they can help your land.'),
        ]),
        links: [
          {
            link: {
              type: 'custom',
              appearance: 'default',
              label: 'Explore Products',
              url: '/products',
            },
          },
        ],
      },
    ],
    meta: {
      title: 'Our Story',
      description:
        'Happy Farmers is a Karnataka-based organic inputs manufacturer turning organic waste into nutrient-rich vermicompost, vermiwash and coco peat.',
      image: storyImage.id,
    },
    title: 'Our Story',
  }
}
