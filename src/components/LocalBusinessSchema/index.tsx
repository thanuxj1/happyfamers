import React from 'react'

import { getSocialLinks } from '@/globals/SocialLinks/content'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getServerSideURL } from '@/utilities/getURL'

export async function LocalBusinessSchema() {
  const url = getServerSideURL()
  const homePage = await getCachedGlobal('home-page', 0)()
  const { links } = await getSocialLinks()

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Happy Farmers',
    url,
    logo: `${url}/favicon.svg`,
    description:
      'Manufacturer of EU-certified organic vermicompost, vermiwash and coco peat for healthier soil and higher crop yields.',
    // Town and country only, matching what the site shows: the client asked
    // for the street address to come off.
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Peradeniya',
      addressRegion: 'Central Province',
      addressCountry: 'LK',
    },
    // Sourced from the Home Page global's Contact tab so this schema never
    // drifts from what's shown on the page itself.
    telephone: homePage?.phone || '+94 70 6 235 245',
    email: homePage?.email || 'info@happyfarmerslk.com',
    sameAs: links.map((link) => link.href),
  }

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
