import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  admin: {
    group: 'Site Settings',
    description: 'The trust badges, links and copyright line at the bottom of every page.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Background photo (soil/earthworms texture behind the trust badges)',
    },
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
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
    },
    {
      name: 'trustBadges',
      type: 'array',
      label: 'Trust badges',
      minRows: 1,
      maxRows: 6,
      admin: {
        initCollapsed: true,
        description: 'The small icon + label row shown above the copyright line, e.g. "100% Organic".',
        components: {
          RowLabel: '@/Footer/TrustBadgeRowLabel#TrustBadgeRowLabel',
        },
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'icon',
              type: 'select',
              required: true,
              defaultValue: 'leaf',
              admin: {
                description: 'Which small icon to show next to the label.',
              },
              options: [
                { label: 'Leaf', value: 'leaf' },
                { label: 'Sprout', value: 'sprout' },
                { label: 'Globe', value: 'globe' },
                { label: 'Users', value: 'users' },
                { label: 'Heart', value: 'heart' },
                { label: 'Shield', value: 'shieldCheck' },
              ],
            },
            {
              name: 'label',
              type: 'text',
              required: true,
              admin: {
                description: 'The short text next to the icon, e.g. "100% Organic".',
              },
            },
          ],
        },
      ],
      defaultValue: [
        { icon: 'leaf', label: '100% Organic' },
        { icon: 'sprout', label: 'EU Certified' },
        { icon: 'globe', label: 'Eco-Friendly' },
        { icon: 'users', label: 'Trusted by Farmers' },
        { icon: 'heart', label: 'Made with Care' },
      ],
    },
    {
      name: 'companyName',
      type: 'text',
      label: 'Company name (shown in the copyright line)',
      defaultValue: 'Happy Farmers',
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
  versions: false,
}
