import type { TextField } from 'payload'

import { formatSlugHook } from './formatSlug'

type SlugFieldOverrides = {
  admin?: TextField['admin']
} & Record<string, unknown>

type SlugFieldType = (fieldToUse?: string, overrides?: SlugFieldOverrides) => TextField

// The published `payload` release used by this project doesn't yet ship the
// native `type: 'slug'` field, so slugs are auto-generated from `fieldToUse`
// (default: title) via a beforeValidate hook, same as pre-slug-field Payload templates.
export const slugField: SlugFieldType = (fieldToUse = 'title', overrides = {}) => {
  const { admin, ...rest } = overrides

  return {
    name: 'slug',
    type: 'text',
    index: true,
    label: 'Web Address (URL)',
    ...rest,
    admin: {
      position: 'sidebar',
      description:
        'Auto-filled from the title when first created. This is part of the page\'s web address — if you change it after the page is live, any existing links or bookmarks to it will stop working. Only edit this if you know what you\'re doing.',
      ...admin,
    },
    hooks: {
      beforeValidate: [formatSlugHook(fieldToUse)],
    },
  } as TextField
}
