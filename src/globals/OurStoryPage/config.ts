import type { GlobalConfig } from 'payload'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
} from '@payloadcms/plugin-seo/fields'

import { revalidateOurStoryPage } from './hooks/revalidateOurStoryPage'

/**
 * Our Story keeps the client's approved bespoke layout, so the design lives in
 * the route rather than in blocks. Everything a person would want to reword or
 * re-photograph lives here instead of being hardcoded, so the whole page is
 * editable from one screen in the manager.
 */
export const OurStoryPage: GlobalConfig = {
  slug: 'our-story-page',
  label: 'Our Story Page',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Site Settings',
    description: 'Everything on the Our Story page — headline, photos, story, mission and vision.',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [
            { name: 'ribbonText', type: 'text', label: 'Gold corner ribbon' },
            { name: 'heroEyebrow', type: 'text', label: 'Small line above the headline' },
            { name: 'headingLine1', type: 'text', label: 'Headline — first line' },
            {
              name: 'headingLine2',
              type: 'text',
              label: 'Headline — second line',
              admin: { description: 'This line appears in gold.' },
            },
            { name: 'heroSubtext', type: 'textarea', label: 'Introduction' },
            { name: 'heroButtonLabel', type: 'text', label: 'Button text' },
            { name: 'heroImage', type: 'upload', relationTo: 'media', label: 'Background photo' },
          ],
        },
        {
          label: 'Story',
          fields: [
            { name: 'storyEyebrow', type: 'text', label: 'Small line above the heading' },
            { name: 'storyHeading', type: 'textarea', label: 'Heading' },
            {
              name: 'storyParagraphs',
              type: 'array',
              label: 'Paragraphs',
              fields: [{ name: 'text', type: 'textarea', label: 'Paragraph' }],
            },
            { name: 'storyImage', type: 'upload', relationTo: 'media', label: 'Photo beside the story' },
          ],
        },
        {
          label: 'Highlights',
          fields: [
            {
              name: 'highlights',
              type: 'array',
              label: 'The four points in the cream strip',
              maxRows: 4,
              fields: [{ name: 'text', type: 'text', label: 'Point' }],
            },
          ],
        },
        {
          label: 'Mission & Vision',
          fields: [
            { name: 'missionTitle', type: 'text', label: 'Left panel heading' },
            { name: 'missionText', type: 'textarea', label: 'Left panel text' },
            { name: 'visionTitle', type: 'text', label: 'Right panel heading' },
            { name: 'visionText', type: 'textarea', label: 'Right panel text' },
          ],
        },
        {
          label: 'Closing',
          fields: [
            { name: 'closingHeading', type: 'text', label: 'Heading' },
            { name: 'closingSubtext', type: 'textarea', label: 'Line under the heading' },
            { name: 'closingButtonLabel', type: 'text', label: 'Button text' },
            { name: 'closingImage', type: 'upload', relationTo: 'media', label: 'Background photo' },
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
            MetaTitleField({ hasGenerateFn: true }),
            MetaImageField({ relationTo: 'media' }),
            MetaDescriptionField({}),
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateOurStoryPage],
  },
}
