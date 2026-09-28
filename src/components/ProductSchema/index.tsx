import React from 'react'

import type { Product } from '@/payload-types'

import { getServerSideURL } from '@/utilities/getURL'

export const ProductSchema: React.FC<{ product: Product }> = ({ product }) => {
  const url = getServerSideURL()
  const image =
    typeof product.heroImage === 'object'
      ? (product.heroImage.sizes?.og?.url || product.heroImage.url) ?? undefined
      : undefined

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.shortDescription,
    image: image ? `${url}${image}` : undefined,
    brand: {
      '@type': 'Brand',
      name: 'Happy Farmers',
    },
    url: `${url}/products/${product.slug}`,
  }

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
