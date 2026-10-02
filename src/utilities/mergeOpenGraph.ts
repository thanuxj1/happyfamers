import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description:
    'Organic vermicompost, vermiwash and coco peat manufactured in Karnataka, India. EU-certified organic soil and crop inputs for healthier farms.',
  images: [
    {
      url: `${getServerSideURL()}/og-happy-farmers.jpg`,
      width: 1200,
      height: 630,
      alt: 'Happy Farmers — Healthy Soil. Healthy Harvest.',
    },
  ],
  locale: 'en_IN',
  siteName: 'Happy Farmers',
  title: 'Happy Farmers | Healthy Soil. Healthy Harvest.',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
