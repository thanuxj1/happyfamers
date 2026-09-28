import React from 'react'

import { getCachedGlobal } from '@/utilities/getGlobals'
import { getServerSideURL } from '@/utilities/getURL'

export async function LocalBusinessSchema() {
  const url = getServerSideURL()
  const homePage = await getCachedGlobal('home-page', 0)()

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Happy Farmers',
    url,
    logo: `${url}/favicon.svg`,
    description:
      'Manufacturer of EU-certified organic vermicompost, vermiwash and coco peat for healthier soil and higher crop yields.',
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'Karnataka',
      addressCountry: 'IN',
    },
    // Sourced from the Home Page global's Contact tab so this schema never
    // drifts from what's shown on the page itself.
    telephone: homePage?.phone || '+91-98765-43210',
    email: homePage?.email || 'info@happyfarmers.in',
    sameAs: [],
  }

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
