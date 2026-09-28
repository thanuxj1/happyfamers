import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { slugField } from '../../fields/slug'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidateProduct } from './hooks/revalidateProduct'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Product',
    plural: 'Products',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    meta: {
      image: true,
      description: true,
    },
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    useAsTitle: 'title',
    group: 'Website Content',
    description: 'The products shown on the homepage and the /products page (Vermicompost, Vermiwash, Coco Peat, etc).',
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'products',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'products',
        req,
      }),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              required: true,
              admin: {
                description: 'The main product photo, shown on the product card and its detail page.',
              },
            },
            {
              name: 'shortDescription',
              type: 'textarea',
              label: 'Short description',
              admin: {
                description: 'Shown on the product listing card. Keep it to one or two sentences.',
              },
              required: true,
            },
            {
              name: 'benefits',
              type: 'array',
              label: 'Key benefits',
              labels: {
                singular: 'Benefit',
                plural: 'Benefits',
              },
              admin: {
                description: 'A short bullet list of selling points, shown on the product detail page.',
                components: {
                  RowLabel: '@/collections/Products/BenefitRowLabel#BenefitRowLabel',
                },
              },
              fields: [
                {
                  name: 'benefit',
                  type: 'text',
                  required: true,
                },
              ],
            },
            {
              name: 'content',
              type: 'richText',
              label: 'Full description',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                  ]
                },
              }),
              required: true,
            },
          ],
        },
        {
          label: 'Meta',
          fields: [
            {
              name: 'priceLabel',
              type: 'text',
              label: 'Price / call to action label',
              admin: {
                description:
                  'e.g. "Contact for pricing" or "₹450 / 5kg bag". Shown on the product card.',
              },
            },
            {
              name: 'order',
              type: 'number',
              label: 'Display order',
              admin: {
                description: 'Lower numbers are shown first on the products page.',
              },
              defaultValue: 0,
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidateProduct],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
