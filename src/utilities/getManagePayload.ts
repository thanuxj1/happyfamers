import { headers as nextHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * Payload client for the /manage area, bound to the signed-in user.
 *
 * Authentication lives here rather than in the layout because every `'use
 * server'` action is reachable as its own POST endpoint — the layout's redirect
 * guards page rendering, not the actions, so an action that fetched Payload
 * directly would be callable by anyone.
 *
 * Callers pass the returned `user` to each operation alongside
 * `overrideAccess: false`, so the collections' own access rules apply instead
 * of the Local API's default of skipping them.
 */
export async function getManagePayload() {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await nextHeaders() })

  if (!user) {
    throw new Error('Unauthorized: sign in to use the manager.')
  }

  return { payload, user }
}
