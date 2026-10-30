import type { NextConfig } from 'next'

export const redirects: NextConfig['redirects'] = async () => {
  const internetExplorerRedirect = {
    destination: '/ie-incompatible.html',
    has: [
      {
        type: 'header' as const,
        key: 'user-agent',
        value: '(.*Trident.*)', // all ie browsers
      },
    ],
    permanent: false,
    source: '/:path((?!ie-incompatible.html$).*)', // all pages except the incompatibility page
  }

  // The Resources section was removed. Old links to the articles — and to
  // the /resources alias they used to live behind — go to the home page
  // rather than 404ing.
  const retiredResources = ['/resources', '/resources/:slug', '/posts', '/posts/:slug'].map(
    (source) => ({ source, destination: '/', permanent: true }),
  )

  return [internetExplorerRedirect, ...retiredResources]
}
