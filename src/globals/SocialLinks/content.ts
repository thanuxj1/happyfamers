import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { cache } from 'react'

import { getCachedGlobal } from '@/utilities/getGlobals'
import { SOCIAL_NETWORKS, socialHref, type SocialKey } from './networks'

export type SocialLink = { key: SocialKey; label: string; href: string }

/**
 * The links to show, plus the raw values for the manager's form.
 *
 * WhatsApp starts out as the phone number from the Home page's contact details,
 * so it works before anything is typed in. Once saved, the saved value wins,
 * and saving it empty hides it. If the table does not exist yet everything else
 * is simply hidden.
 */
export const getSocialLinks = cache(
  async (): Promise<{
    links: SocialLink[]
    values: Record<SocialKey, string>
    /** False until the schema change has been applied; the manager says so. */
    available: boolean
  }> => {
    const payload = await getPayload({ config: configPromise })
    const stored = await payload
      .findGlobal({ slug: 'social-links', depth: 0 })
      .then((doc) => doc as unknown as Record<string, unknown>)
      .catch(() => null)
    const home = await getCachedGlobal('home-page', 0)().catch(() => null)

    const values = {} as Record<SocialKey, string>
    const links: SocialLink[] = []

    for (const { key, label } of SOCIAL_NETWORKS) {
      const saved = stored?.[key]
      const value =
        typeof saved === 'string' ? saved : key === 'whatsapp' ? (home?.phone ?? '') : ''
      values[key] = value
      const href = socialHref(key, value)
      if (href) links.push({ key, label, href })
    }

    return { links, values, available: stored !== null }
  },
)
