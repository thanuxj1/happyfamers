import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Header',
  admin: {
    group: 'Site Settings',
    description: 'The navigation menu and button shown at the top of every page.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
    {
      name: 'ctaLabel',
      type: 'text',
      label: 'Header button text',
      defaultValue: 'Talk to Our Team',
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
  versions: false,
}
