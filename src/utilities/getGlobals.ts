import type { Config } from '@/payload-types'

import configPromise from '@payload-config'
import { type DataFromGlobalSlug, getPayload } from 'payload'

type Global = keyof Config['globals']

async function getGlobal<T extends Global>(slug: T, depth = 0): Promise<DataFromGlobalSlug<T>> {
  const payload = await getPayload({ config: configPromise })

  const global = await payload.findGlobal({
    slug,
    depth,
    overrideAccess: true,
  })

  return global
}

// Intentionally NOT wrapped in `unstable_cache`. Vercel's Data Cache persists
// across deployments, and a fresh build's static generation was picking up
// a stale cached global (from before a content edit) instead of the current
// database value — content edits appeared to silently "revert" after any
// redeploy. These globals are edited through the CMS and should always
// reflect the latest saved value; a direct Postgres query is fast enough
// that no caching layer here is worth that correctness risk.
export const getCachedGlobal = <T extends Global>(slug: T, depth = 0) => {
  return () => getGlobal<T>(slug, depth)
}
