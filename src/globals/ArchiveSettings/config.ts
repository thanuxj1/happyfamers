import type { GlobalConfig } from 'payload'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
} from '@payloadcms/plugin-seo/fields'

import { revalidateArchiveSettings } from './hooks/revalidateArchiveSettings'

export const ArchiveSettings: GlobalConfig = {
  slug: 'archive-settings',
  label: 'Products & Resources Pages',
  admin: {
    group: 'Site Settings',
    description: 'The heading and intro text at the top of the /products and /posts (Resources) listing pages.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Products Page',
          fields: [
            {
              name: 'productsHeading',
              type: 'text',
              defaultValue: 'Our Products',
              admin: { description: 'The big heading at the top of the /products page.' },
            },
            {
              name: 'productsIntro',
              type: 'textarea',
              defaultValue:
                'Natural, chemical-free soil and crop inputs made from carefully sourced organic matter. Every batch is tested for quality before it leaves our facility.',
              admin: { description: 'The short paragraph under the heading.' },
            },
            {
              name: 'productsMeta',
              label: 'SEO',
              type: 'group',
              fields: [
                OverviewField({
                  titlePath: 'productsMeta.title',
                  descriptionPath: 'productsMeta.description',
                  imagePath: 'productsMeta.image',
                }),
                MetaTitleField({
                  hasGenerateFn: true,
                }),
                MetaImageField({
                  relationTo: 'media',
                }),
                MetaDescriptionField({}),
              ],
            },
          ],
        },
        {
          label: 'Resources Page',
          fields: [
            {
              name: 'postsHeading',
              type: 'text',
              defaultValue: 'Resources',
              admin: { description: 'The big heading at the top of the /posts (Resources) page.' },
            },
            {
              name: 'postsIntro',
              type: 'textarea',
              defaultValue:
                'Guides and articles on soil health, vermicomposting and organic certification.',
              admin: { description: 'The short paragraph under the heading.' },
            },
            {
              name: 'postsMeta',
              label: 'SEO',
              type: 'group',
              fields: [
                OverviewField({
                  titlePath: 'postsMeta.title',
                  descriptionPath: 'postsMeta.description',
                  imagePath: 'postsMeta.image',
                }),
                MetaTitleField({
                  hasGenerateFn: true,
                }),
                MetaImageField({
                  relationTo: 'media',
                }),
                MetaDescriptionField({}),
              ],
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateArchiveSettings],
  },
}
