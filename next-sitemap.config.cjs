// Mirrors src/utilities/getURL.ts: a localhost value left in a deployed
// environment is ignored, so robots.txt and the sitemaps never advertise URLs
// crawlers cannot reach. The Vercel host is only defined on Vercel builds.
const configured = process.env.NEXT_PUBLIC_SERVER_URL
const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL

const SITE_URL =
  configured && !/localhost|127\.0\.0\.1/.test(configured)
    ? configured
    : vercelHost
      ? `https://${vercelHost}`
      : configured || 'http://localhost:3000'

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  exclude: [
    '/posts-sitemap.xml',
    '/pages-sitemap.xml',
    '/products-sitemap.xml',
    '/*',
    '/posts/*',
    '/products/*',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        disallow: ['/admin/*', '/manage', '/manage/*', '/next/*'],
      },
    ],
    additionalSitemaps: [
      `${SITE_URL}/pages-sitemap.xml`,
      `${SITE_URL}/posts-sitemap.xml`,
      `${SITE_URL}/products-sitemap.xml`,
    ],
  },
}
