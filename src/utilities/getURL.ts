import canUseDOM from './canUseDOM'

const isLocal = (url: string) => /localhost|127\.0\.0\.1/.test(url)

const deploymentURL = () => {
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL
  return host ? `https://${host}` : undefined
}

/**
 * Absolute origin used for canonical links, Open Graph URLs and sitemaps.
 *
 * A localhost value configured in a deployed environment is ignored in favour
 * of the deployment's own host: emitting it would publish canonical URLs
 * pointing at a machine crawlers cannot reach, which deindexes the site.
 */
export const getServerSideURL = () => {
  const configured = process.env.NEXT_PUBLIC_SERVER_URL

  if (configured && !isLocal(configured)) return configured

  return deploymentURL() || configured || 'http://localhost:3000'
}

export const getClientSideURL = () => {
  if (canUseDOM) {
    const protocol = window.location.protocol
    const domain = window.location.hostname
    const port = window.location.port

    return `${protocol}//${domain}${port ? `:${port}` : ''}`
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }

  return process.env.NEXT_PUBLIC_SERVER_URL || ''
}
