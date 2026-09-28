import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Media } from '@/payload-types'

import { heading, paragraph, richText } from './lexicalHelpers'

type CertificationArgs = {
  certImage: Media
}

export const certification: (
  args: CertificationArgs,
) => RequiredDataFromCollectionSlug<'pages'> = ({ certImage }) => {
  return {
    slug: 'organic-certification',
    _status: 'published',
    hero: {
      type: 'lowImpact',
      richText: richText([
        heading('EU Organic Certification', 'h1'),
        paragraph(
          'Our products are certified under the EU Organic Regulation, ensuring the highest standards of quality, safety and sustainability.',
        ),
      ]),
    },
    layout: [
      {
        blockName: 'What Certification Means',
        blockType: 'content',
        columns: [
          {
            size: 'twoThirds',
            richText: richText([
              heading('What Our Certification Means for You', 'h2'),
              paragraph(
                'Every batch of Happy Farmers vermicompost, vermiwash and coco peat is produced and tested to meet EU Organic Regulation standards. That means no synthetic chemicals, no GMOs, and full traceability from raw organic matter to finished product.',
              ),
              paragraph(
                'Certificate No. IN-ORG-005 covers our production facility in Karnataka and is renewed annually through independent audit.',
              ),
            ]),
          },
          {
            size: 'oneThird',
            richText: richText([
              heading('Certificate No.', 'h3'),
              paragraph('IN-ORG-005'),
            ]),
          },
        ],
      },
      {
        blockName: 'Certification Badge',
        blockType: 'mediaBlock',
        media: certImage.id,
        spotlightHover: true,
      },
      {
        blockName: 'Why It Matters',
        blockType: 'content',
        columns: [
          {
            size: 'oneThird',
            richText: richText([
              heading('Improves Soil Health', 'h3'),
              paragraph('Builds fertile, living soil for the long term.'),
            ]),
          },
          {
            size: 'oneThird',
            richText: richText([
              heading('Boosts Productivity', 'h3'),
              paragraph('Promotes stronger plants and higher yields.'),
            ]),
          },
          {
            size: 'oneThird',
            richText: richText([
              heading('Enhances Quality', 'h3'),
              paragraph('Improves taste, nutrition and shelf life.'),
            ]),
          },
        ],
      },
      {
        blockName: 'CTA',
        blockType: 'cta',
        richText: richText([
          heading('Have questions about our certification?', 'h3'),
          paragraph('Our team can walk you through the standards behind every batch we ship.'),
        ]),
        links: [
          {
            link: {
              type: 'custom',
              appearance: 'default',
              label: 'Contact Us',
              url: '/contact',
            },
          },
        ],
      },
    ],
    meta: {
      title: 'Organic Certification',
      description:
        'Happy Farmers products are certified under the EU Organic Regulation (Certificate No. IN-ORG-005), guaranteeing chemical-free, sustainably produced soil inputs.',
      image: certImage.id,
    },
    title: 'Organic Certification',
  }
}
