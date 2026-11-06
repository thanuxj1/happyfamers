import type { GlobalConfig } from 'payload'

import { revalidateSocialLinks } from './hooks/revalidateSocialLinks'
import { SOCIAL_NETWORKS } from './networks'

/**
 * The social media links shown in the footer and on the Contact page.
 *
 * Its own global for the same reason as HomeShowcase: the footer is on every
 * page, so a column missing from an existing table would take the whole site
 * down, whereas this table can be missing without consequence (see content.ts).
 */
export const SocialLinks: GlobalConfig = {
  slug: 'social-links',
  label: 'Social Media',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Site Settings',
    description: 'Links shown in the footer and on the Contact page. Leave one empty to hide it.',
  },
  fields: SOCIAL_NETWORKS.map(({ key, label }) => ({ name: key, type: 'text', label })),
  hooks: {
    afterChange: [revalidateSocialLinks],
  },
}
