import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Media } from '@/payload-types'

import { heading, paragraph, richText } from './lexicalHelpers'

type ProductArgs = {
  vermicompostImage: Media
  vermiwashImage: Media
  cocoPeatImage: Media
}

export const products: (args: ProductArgs) => RequiredDataFromCollectionSlug<'products'>[] = ({
  vermicompostImage,
  vermiwashImage,
  cocoPeatImage,
}) => [
  {
    slug: 'vermicompost',
    _status: 'published',
    title: 'Vermicompost',
    heroImage: vermicompostImage.id,
    shortDescription:
      'Rich in nutrients and microbes, our vermicompost improves soil structure, water retention and root growth.',
    priceLabel: 'Contact for bulk pricing',
    order: 1,
    benefits: [
      { benefit: 'Improves soil structure and aeration' },
      { benefit: 'Boosts water retention in dry soil' },
      { benefit: 'Encourages healthy root development' },
      { benefit: 'Free from synthetic chemicals' },
    ],
    content: richText([
      heading('100% Natural, Odour-Free Soil Nutrition', 'h2'),
      paragraph(
        'Our vermicompost is produced by feeding quality organic waste — sourced from farms, markets and food processing units — to earthworm colonies that break it down into a fine, dark, nutrient-rich humus.',
      ),
      paragraph(
        'Unlike raw compost, vermicompost is stable, odour-free and immediately available to plant roots. It introduces beneficial microbes back into depleted soil, helping it hold moisture and nutrients season after season.',
      ),
      heading('How to Use', 'h3'),
      paragraph(
        'Mix 200–500g per plant into topsoil before sowing, or top-dress established crops every 4–6 weeks. Safe for all crop types, including vegetables, fruit trees and ornamentals.',
      ),
    ]),
    meta: {
      title: 'Vermicompost',
      description:
        'EU-certified organic vermicompost that improves soil structure, boosts water retention and increases crop yield.',
      image: vermicompostImage.id,
    },
  },
  {
    slug: 'vermiwash',
    _status: 'published',
    title: 'Vermiwash',
    heroImage: vermiwashImage.id,
    shortDescription:
      'A powerful liquid bio-fertilizer that enhances growth, improves yield and strengthens plant immunity.',
    priceLabel: 'Contact for bulk pricing',
    order: 2,
    benefits: [
      { benefit: 'Strengthens plant immunity naturally' },
      { benefit: 'Fast-acting liquid nutrition for foliar feeding' },
      { benefit: 'Improves flowering and fruit set' },
      { benefit: 'Safe for organic farming programs' },
    ],
    content: richText([
      heading('Liquid Gold for Faster, Healthier Growth', 'h2'),
      paragraph(
        'Vermiwash is the liquid extract collected as water passes through a bed of active earthworms and organic matter. It carries plant hormones, enzymes and beneficial microbes in a form crops can absorb almost instantly.',
      ),
      paragraph(
        'Used as a foliar spray or soil drench, vermiwash helps plants resist common pests and diseases while improving flowering, fruiting and overall vigour.',
      ),
      heading('How to Use', 'h3'),
      paragraph(
        'Dilute 1 part vermiwash with 9–10 parts water and spray on leaves or drench the root zone every 10–15 days during the growing season.',
      ),
    ]),
    meta: {
      title: 'Vermiwash',
      description:
        'Organic liquid bio-fertilizer that improves soil fertility, plant immunity and crop yield.',
      image: vermiwashImage.id,
    },
  },
  {
    slug: 'coco-peat',
    _status: 'published',
    title: 'Coco Peat',
    heroImage: cocoPeatImage.id,
    shortDescription:
      '100% natural growing medium that improves aeration, moisture retention and root health.',
    priceLabel: 'Contact for bulk pricing',
    order: 3,
    benefits: [
      { benefit: 'Excellent water retention and re-wetting' },
      { benefit: 'Improves aeration for stronger root systems' },
      { benefit: 'pH-balanced and low in salts' },
      { benefit: 'Renewable, biodegradable coconut husk by-product' },
    ],
    content: richText([
      heading('The Ideal Growing Medium', 'h2'),
      paragraph(
        'Made from processed coconut husk, our coco peat is washed, buffered and graded to give nurseries, greenhouses and home gardeners a lightweight, pH-balanced growing medium.',
      ),
      paragraph(
        'It holds several times its weight in water while staying well-aerated, making it ideal for seed starting, potting mixes and hydroponic setups.',
      ),
      heading('How to Use', 'h3'),
      paragraph(
        'Soak compressed blocks in water to expand, then use alone or blend with soil and vermicompost for a complete potting mix.',
      ),
    ]),
    meta: {
      title: 'Coco Peat',
      description:
        'Natural, pH-balanced coco peat growing medium for nurseries, greenhouses and home gardens.',
      image: cocoPeatImage.id,
    },
  },
]
