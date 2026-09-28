import type { Block } from 'payload'

export const MediaBlock: Block = {
  slug: 'mediaBlock',
  interfaceName: 'MediaBlock',
  fields: [
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'spotlightHover',
      type: 'checkbox',
      label: 'Spotlight hover effect',
      defaultValue: false,
      admin: {
        description:
          'Dims the photo until the visitor hovers, then a soft spotlight follows the cursor to reveal it in full color underneath.',
      },
    },
  ],
}
