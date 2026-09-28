import type { Form } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'

import { heading, paragraph, richText } from './lexicalHelpers'

type ContactArgs = {
  contactForm: Form
}

export const contact: (args: ContactArgs) => RequiredDataFromCollectionSlug<'pages'> = ({
  contactForm,
}) => {
  return {
    slug: 'contact',
    _status: 'published',
    hero: {
      type: 'lowImpact',
      richText: richText([
        heading('Get in Touch', 'h1'),
        paragraph(
          'Have questions or need bulk pricing? We’re here to help you grow. Reach us directly or send a message below.',
        ),
      ]),
    },
    layout: [
      {
        blockName: 'Contact Details',
        blockType: 'content',
        columns: [
          {
            size: 'oneThird',
            richText: richText([
              heading('Call Us', 'h3'),
              paragraph('+91 98765 43210'),
            ]),
          },
          {
            size: 'oneThird',
            richText: richText([
              heading('Email Us', 'h3'),
              paragraph('info@happyfarmers.in'),
            ]),
          },
          {
            size: 'oneThird',
            richText: richText([
              heading('Our Location', 'h3'),
              paragraph('Karnataka, India'),
              paragraph('Working Hours: Mon – Sat, 9:00 AM – 6:00 PM'),
            ]),
          },
        ],
      },
      {
        blockType: 'formBlock',
        enableIntro: true,
        form: contactForm,
        introContent: richText([heading('Send Us a Message', 'h3')]),
      },
    ],
    meta: {
      title: 'Contact',
      description:
        'Get in touch with Happy Farmers for organic vermicompost, vermiwash and coco peat orders, bulk pricing and questions.',
    },
    title: 'Contact',
  }
}
