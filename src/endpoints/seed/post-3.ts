import { RequiredDataFromCollectionSlug } from 'payload'

import { heading, paragraph, richText } from './lexicalHelpers'
import type { PostArgs } from './post-1'

export const post3: (args: PostArgs) => RequiredDataFromCollectionSlug<'posts'> = ({
  heroImage,
  author,
  categories,
}) => {
  return {
    slug: 'how-to-read-an-organic-certification-label',
    _status: 'published',
    authors: [author],
    categories: categories.map((c) => c.id),
    content: richText([
      heading('Not All "Organic" Labels Mean the Same Thing', 'h2'),
      paragraph(
        'The word "organic" isn’t regulated everywhere, which means a label alone doesn’t guarantee a product was independently audited. Certification numbers, issuing bodies and the standard referenced are what actually confirm compliance.',
      ),
      heading('What to Look For', 'h2'),
      paragraph(
        '1. A certificate number you can verify with the issuing body. 2. The specific standard referenced — for example, the EU Organic Regulation. 3. Whether the certificate covers the specific product and facility, not just the company name.',
      ),
      heading('What EU Organic Certification Covers', 'h3'),
      paragraph(
        'Certification under the EU Organic Regulation requires independent annual audits, full traceability from raw material to finished product, and a ban on synthetic chemicals and GMOs throughout production.',
      ),
      heading('Why This Matters for Your Farm', 'h2'),
      paragraph(
        'When you use certified organic inputs, you protect your own crop’s eligibility for organic markets and premium buyers — and you can trust that what’s in the bag matches what’s on the label.',
      ),
    ]),
    heroImage: heroImage.id,
    meta: {
      description:
        'What an organic certification number and issuing body actually guarantee — and why it matters for the inputs you put on your farm.',
      image: heroImage.id,
      title: 'How to Read an Organic Certification Label',
    },
    relatedPosts: [],
    title: 'How to Read an Organic Certification Label',
  }
}
