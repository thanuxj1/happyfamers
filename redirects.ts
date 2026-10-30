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

  // The articles are called Resources throughout the site but live under
  // /posts. Anything already pointing at /resources keeps working.
  const resourcesRedirect = {
    source: '/resources',
    destination: '/posts',
    permanent: true,
  }

  const resourceArticleRedirect = {
    source: '/resources/:slug',
    destination: '/posts/:slug',
    permanent: true,
  }

  return [internetExplorerRedirect, resourcesRedirect, resourceArticleRedirect]
}
