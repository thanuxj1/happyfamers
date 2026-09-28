import type { GlobalConfig } from 'payload'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
} from '@payloadcms/plugin-seo/fields'

import { revalidateHomePage } from './hooks/revalidateHomePage'

const iconOptions = [
  { label: 'Leaf (natural)', value: 'leaf' },
  { label: 'Droplets (fertility)', value: 'droplets' },
  { label: 'Trending Up (yield)', value: 'trendingUp' },
  { label: 'Shield (immunity)', value: 'shieldCheck' },
  { label: 'Globe (sustainability)', value: 'globe' },
]

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Home Page',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Site Settings',
    description: 'Everything shown on the homepage — hero, process steps, products, contact info, etc.',
    livePreview: {
      url: '/',
    },
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [
            {
              name: 'badgeText',
              type: 'text',
              defaultValue: 'EU Organic Certified Vermicompost',
            },
            {
              name: 'headingLine1',
              type: 'text',
              defaultValue: 'Healthy Soil.',
              required: true,
            },
            {
              name: 'headingAccent',
              type: 'text',
              label: 'Heading (accent line)',
              defaultValue: 'Healthy Harvest.',
              required: true,
            },
            {
              name: 'subtext',
              type: 'textarea',
              required: true,
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'circleImage',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Hero slideshow — Slide 1',
                  admin: { description: 'e.g. hands holding soil' },
                  required: true,
                },
                {
                  name: 'backgroundImage',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Hero slideshow — Slide 2',
                  admin: { description: 'e.g. crop field at sunset' },
                  required: true,
                },
                {
                  name: 'roundedImage',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Hero slideshow — Slide 3',
                  admin: { description: 'e.g. harvest basket' },
                  required: true,
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'primaryCtaLabel',
                  type: 'text',
                  label: 'Primary button text',
                  defaultValue: 'Talk to Our Team',
                },
                {
                  name: 'secondaryCtaLabel',
                  type: 'text',
                  label: 'Secondary button text',
                  defaultValue: 'See How It Works',
                },
              ],
            },
          ],
        },
        {
          label: 'Process',
          fields: [
            {
              name: 'processHeading',
              type: 'text',
              defaultValue: 'Our 3-Step Natural Process',
            },
            {
              name: 'processSteps',
              type: 'array',
              minRows: 1,
              admin: {
                description: 'The numbered circles under "Our 3-Step Natural Process". Usually 3 steps.',
                components: {
                  RowLabel: '@/globals/HomePage/ProcessStepRowLabel#ProcessStepRowLabel',
                },
              },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Products',
          fields: [
            {
              name: 'productsHeading',
              type: 'text',
              defaultValue: 'Our Products',
            },
            {
              name: 'productsLimit',
              type: 'number',
              defaultValue: 3,
              admin: {
                description: 'How many published products to show on the homepage.',
              },
            },
          ],
        },
        {
          label: 'Why Choose Us',
          fields: [
            {
              name: 'whyChooseHeading',
              type: 'text',
              defaultValue: 'Why Choose Happy Farmers?',
            },
            {
              name: 'whyChooseNote',
              type: 'text',
              defaultValue: 'Certified closed-loop vermicomposting regeneration.',
            },
            {
              name: 'whyChooseItems',
              type: 'array',
              minRows: 1,
              maxRows: 6,
              admin: {
                description: 'The bullet-point list in the dark green "Why Choose Us" card. Up to 6 items.',
                components: {
                  RowLabel: '@/globals/HomePage/WhyChooseItemRowLabel#WhyChooseItemRowLabel',
                },
              },
              fields: [
                {
                  name: 'icon',
                  type: 'select',
                  options: iconOptions,
                  required: true,
                },
                {
                  name: 'text',
                  type: 'text',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Impact',
          fields: [
            {
              name: 'impactHeading',
              type: 'text',
              defaultValue: 'Better Soil. Better Crops. Better Tomorrow.',
            },
            {
              name: 'impactItems',
              type: 'array',
              minRows: 1,
              maxRows: 8,
              admin: {
                description: 'The photo grid under "Better Soil. Better Crops. Better Tomorrow." Up to 8 tiles.',
                components: {
                  RowLabel: '@/globals/HomePage/ImpactItemRowLabel#ImpactItemRowLabel',
                },
              },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'emoji',
                  type: 'text',
                  admin: { description: 'A single emoji shown as a badge on the photo, e.g. 🌱' },
                },
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'text',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Certification',
          fields: [
            {
              name: 'certTitle',
              type: 'text',
              defaultValue: 'EU Organic Certification',
            },
            {
              name: 'certDescription',
              type: 'textarea',
              required: true,
            },
            {
              name: 'certNumber',
              type: 'text',
              required: true,
              admin: {
                description: 'Your actual EU Organic certificate registration number, e.g. "IN-ORG-005".',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'certBadgeLabel',
                  type: 'text',
                  label: 'Badge text (inside the green box)',
                  defaultValue: 'EU Organic',
                },
                {
                  name: 'certNumberLabel',
                  type: 'text',
                  label: 'Certificate number prefix',
                  defaultValue: 'Certificate No:',
                },
              ],
            },
          ],
        },
        {
          label: 'Contact',
          fields: [
            {
              name: 'contactHeading',
              type: 'text',
              defaultValue: 'Get in Touch',
            },
            {
              name: 'contactSubtext',
              type: 'text',
              defaultValue: "Have questions or need bulk orders? We're here to help you grow.",
            },
            {
              name: 'contactForm',
              type: 'relationship',
              relationTo: 'forms',
              required: true,
              admin: {
                description:
                  'Which form to show in the contact card. There\'s normally only one — leave this as-is unless you know why you\'re changing it.',
              },
            },
            {
              name: 'phone',
              type: 'text',
              required: true,
            },
            {
              name: 'email',
              type: 'text',
              required: true,
            },
            {
              name: 'location',
              type: 'text',
              required: true,
            },
            {
              name: 'workingHours',
              type: 'text',
              required: true,
            },
            {
              name: 'infoStripImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Bottom photo strip on the contact info card',
              required: true,
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'callLabel',
                  type: 'text',
                  label: 'Phone row label',
                  defaultValue: 'Call Us',
                },
                {
                  name: 'emailLabel',
                  type: 'text',
                  label: 'Email row label',
                  defaultValue: 'Email Us',
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'locationLabel',
                  type: 'text',
                  label: 'Location row label',
                  defaultValue: 'Our Location',
                },
                {
                  name: 'hoursLabel',
                  type: 'text',
                  label: 'Working hours row label',
                  defaultValue: 'Working Hours',
                },
              ],
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
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateHomePage],
  },
}
