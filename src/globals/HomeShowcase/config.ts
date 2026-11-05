import type { GlobalConfig } from 'payload'

import { revalidateHomeShowcase } from './hooks/revalidateHomeShowcase'

/**
 * The two photos under the 3-step process on the home page.
 *
 * Kept as its own global rather than more fields on the Home Page global on
 * purpose: adding columns to `home_page` would make the whole home page fail to
 * load on any deploy that reached the server before the schema change did. A
 * separate table can be missing without consequence — the page falls back to
 * the built-in photos (see content.ts) until it exists.
 */
export const HomeShowcase: GlobalConfig = {
  slug: 'home-showcase',
  label: 'Home Page Photos',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Site Settings',
    description: 'The two photos under the 3-step process on the home page.',
  },
  fields: [
    { name: 'image1', type: 'upload', relationTo: 'media', label: 'Left photo' },
    { name: 'label1', type: 'text', label: 'Left photo label' },
    { name: 'image2', type: 'upload', relationTo: 'media', label: 'Right photo' },
    { name: 'label2', type: 'text', label: 'Right photo label' },
  ],
  hooks: {
    afterChange: [revalidateHomeShowcase],
  },
}
