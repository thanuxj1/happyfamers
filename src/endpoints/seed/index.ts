import type { CollectionSlug, GlobalSlug, Payload, PayloadRequest } from 'payload'
import type { Media } from '@/payload-types'

import { certification as certificationPageData } from './certification'
import { contactForm as contactFormData } from './contact-form'
import { contact as contactPageData } from './contact-page'
import { homePageGlobal } from './home'
import { ourStory as ourStoryPageData } from './our-story'
import { localAsset } from './localAsset'
import { openversePhoto } from './openversePhoto'
import { placeholderImage } from './placeholderImage'
import {
  cocoPeatBlockMockup,
  vermicompostBagMockup,
  vermiwashBottleMockup,
} from './productMockup'
import { post1 } from './post-1'
import { post2 } from './post-2'
import { post3 } from './post-3'
import { products as productsData } from './products'

const collections: CollectionSlug[] = [
  'categories',
  'media',
  'pages',
  'posts',
  'products',
  'form-submissions',
  'forms',
  'search',
]

const globals = ['header', 'footer'] as const satisfies GlobalSlug[]

const categoryTitles = ['Soil Health', 'Vermicomposting', 'Organic Farming', 'Certification']

// Next.js revalidation errors are normal when seeding the database without a server running
// i.e. running `yarn seed` locally instead of using the admin UI within an active app
// The app is not running to revalidate the pages and so the API routes are not available
// These error messages can be ignored: `Error hitting revalidate route for...`
export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding database...')

  payload.logger.info(`— Clearing collections and globals...`)

  await Promise.all(
    globals.map((global) =>
      payload.updateGlobal({
        slug: global,
        data: {
          navItems: [],
        },
        depth: 0,
        context: {
          disableRevalidate: true,
        },
        overrideAccess: true,
      }),
    ),
  )

  // The `home-page` global has required upload (media) relationships, so it
  // must be cleared before `media` rows are deleted below — globals aren't
  // part of the `collections` deleteMany loop, so this needs a raw delete.
  try {
    await payload.db.drizzle.execute('DELETE FROM home_page')
  } catch {
    // table may not exist yet on a first-ever run
  }

  // Sequential (not Promise.all): concurrent deletes across related Postgres
  // tables can deadlock when foreign keys are involved.
  for (const collection of collections) {
    await payload.db.deleteMany({ collection, req, where: {} })
  }

  for (const collection of collections) {
    if (payload.collections[collection].config.versions) {
      await payload.db.deleteVersions({ collection, req, where: {} })
    }
  }

  payload.logger.info(`— Seeding demo author and user...`)

  await payload.delete({
    collection: 'users',
    depth: 0,
    where: {
      email: {
        equals: 'demo-author@example.com',
      },
    },
    overrideAccess: true,
  })

  const demoAuthor = await payload.create({
    collection: 'users',
    data: {
      name: 'Happy Farmers Team',
      email: 'demo-author@example.com',
      password: 'password',
    },
    overrideAccess: true,
  })

  payload.logger.info(`— Finding and downloading themed sample photos...`)

  // Created sequentially (not Promise.all): concurrent writes that touch
  // related Postgres tables can deadlock, and this only runs once at seed time.
  // Real, openly-licensed stock photos found via the Openverse search API,
  // matched to each slot's actual subject (soil, compost, produce, etc.) —
  // not the client's own farm/product photography. Swap these out in the
  // Media library once real photos are available. Each entry tries its
  // queries in order until one returns a usable photo.
  const mediaSpecs = [
    {
      key: 'roundedImageDoc',
      seed: 'happy-farmers-harvest-basket',
      queries: ['fresh produce basket', 'basket root vegetables', 'vegetable harvest basket'],
      alt: 'Fresh organic vegetables harvest basket (sample photo)',
    },
    {
      key: 'step1ImageDoc',
      seed: 'happy-farmers-step-1',
      queries: ['sprout roots', 'carrot sprouts', 'compost pile organic waste'],
      alt: 'Organic matter inputs (sample photo)',
    },
    {
      key: 'step2ImageDoc',
      seed: 'happy-farmers-step-2',
      queries: ['compost worms', 'worm bin', 'earthworms compost'],
      alt: 'Earthworms breaking down organic compost (sample photo)',
    },
    {
      key: 'storyImageDoc',
      seed: 'happy-farmers-our-story',
      queries: ['organic farm field', 'sustainable farming field', 'farmer field agriculture'],
      alt: 'The Happy Farmers story (sample photo)',
    },
    {
      key: 'certImageDoc',
      seed: 'happy-farmers-certification',
      queries: ['certificate seal', 'quality certification seal', 'official certificate document'],
      alt: 'EU Organic Certification badge, Certificate No. IN-ORG-005 (sample photo)',
    },
    {
      key: 'impact1ImageDoc',
      seed: 'happy-farmers-impact-1',
      queries: ['rice paddy field green', 'fertile soil field', 'green crop field'],
      alt: 'Fertile living soil field (sample photo)',
    },
    {
      key: 'impact2ImageDoc',
      seed: 'happy-farmers-impact-2',
      queries: ['tomato vine red fruit', 'tomato plant farm', 'growing tomatoes'],
      alt: 'Strong tomato crops boost productivity (sample photo)',
    },
    {
      key: 'impact3ImageDoc',
      seed: 'happy-farmers-impact-3',
      queries: ['basket root vegetables', 'fresh produce basket', 'farmers market vegetables'],
      alt: 'Fresh high quality produce basket (sample photo)',
    },
    {
      key: 'impact4ImageDoc',
      seed: 'happy-farmers-impact-4',
      queries: ['hand holding strawberry', 'strawberry farm', 'strawberry field'],
      alt: 'Fresh harvested strawberries, sustainable agriculture (sample photo)',
    },
    {
      key: 'infoStripImageDoc',
      seed: 'happy-farmers-info-strip',
      queries: ['seedling soil', 'compost worms', 'young plant seedling'],
      alt: 'Earthworms in rich organic soil with plant seedling (sample photo)',
    },
    {
      key: 'post1ImageDoc',
      seed: 'happy-farmers-post-1',
      queries: ['healthy soil field', 'farm soil field', 'soil close up'],
      alt: 'Why soil health matters for crop yield (sample photo)',
    },
    {
      key: 'post2ImageDoc',
      seed: 'happy-farmers-post-2',
      queries: ['compost worms', 'composting process', 'worm bin compost'],
      alt: 'Vermicomposting 101 (sample photo)',
    },
    {
      key: 'post3ImageDoc',
      seed: 'happy-farmers-post-3',
      queries: ['certificate seal', 'organic label', 'quality seal certificate'],
      alt: 'How to read an organic certification label (sample photo)',
    },
  ] as const

  const media: Record<string, Media> = {}
  for (const spec of mediaSpecs) {
    const file = await openversePhoto({ queries: [...spec.queries], seed: spec.seed })
    media[spec.key] = await payload.create({
      collection: 'media',
      data: { alt: spec.alt },
      file,
      overrideAccess: true,
    })
  }

  // Real photo supplied directly by the client — a permanent project asset,
  // not a stock-photo stand-in, so it's read from disk rather than searched.
  media.backgroundImageDoc = await payload.create({
    collection: 'media',
    data: { alt: 'Hands holding soil and worms, crop rows and a harvest basket' },
    file: localAsset('hero-crop-field.webp'),
    overrideAccess: true,
  })

  // Stock search for "hands holding worm-rich compost" kept surfacing
  // unrelated photos of strangers (a documentary photo of two people with
  // compost bags, etc.) — a clean abstract placeholder beats a wrong photo.
  media.circleImageDoc = await payload.create({
    collection: 'media',
    data: { alt: 'Placeholder — replace with a photo of hands holding soil' },
    file: await placeholderImage({ label: 'Hands Holding Soil' }),
    overrideAccess: true,
  })
  media.step3ImageDoc = await payload.create({
    collection: 'media',
    data: { alt: 'Placeholder — replace with a photo of hands holding vermicompost' },
    file: await placeholderImage({ label: 'Nutrient-Rich Vermicompost' }),
    overrideAccess: true,
  })

  // Product package shots: no stock photo service has "Happy Farmers branded
  // vermicompost bag" — that's custom product photography — so these are
  // drawn as simple package-mockup illustrations instead of a search miss.
  const productMockupSpecs = [
    { key: 'vermicompostImageDoc', make: vermicompostBagMockup, alt: 'Happy Farmers Vermicompost package' },
    { key: 'vermiwashImageDoc', make: vermiwashBottleMockup, alt: 'Happy Farmers Vermiwash bottles' },
    { key: 'cocoPeatImageDoc', make: cocoPeatBlockMockup, alt: 'Happy Farmers Coco Peat block' },
  ] as const

  for (const spec of productMockupSpecs) {
    const file = await spec.make()
    media[spec.key] = await payload.create({
      collection: 'media',
      data: { alt: spec.alt },
      file,
      overrideAccess: true,
    })
  }

  const {
    backgroundImageDoc,
    circleImageDoc,
    roundedImageDoc,
    step1ImageDoc,
    step2ImageDoc,
    step3ImageDoc,
    storyImageDoc,
    certImageDoc,
    vermicompostImageDoc,
    vermiwashImageDoc,
    cocoPeatImageDoc,
    impact1ImageDoc,
    impact2ImageDoc,
    impact3ImageDoc,
    impact4ImageDoc,
    infoStripImageDoc,
    post1ImageDoc,
    post2ImageDoc,
    post3ImageDoc,
  } = media

  payload.logger.info(`— Seeding categories...`)

  const categoryDocs = []
  for (const title of categoryTitles) {
    const doc = await payload.create({
      collection: 'categories',
      data: { title, slug: title.toLowerCase().replace(/\s+/g, '-') },
      overrideAccess: true,
    })
    categoryDocs.push(doc)
  }

  const categoryByTitle = Object.fromEntries(categoryDocs.map((c) => [c.title, c]))

  payload.logger.info(`— Seeding products...`)

  const productDefs = productsData({
    vermicompostImage: vermicompostImageDoc,
    vermiwashImage: vermiwashImageDoc,
    cocoPeatImage: cocoPeatImageDoc,
  })

  const productDocs = []
  for (const productDef of productDefs) {
    // Created sequentially so `order` fields stay predictable in the admin list.
    const doc = await payload.create({
      collection: 'products',
      depth: 0,
      context: { disableRevalidate: true },
      data: productDef,
      overrideAccess: true,
    })
    productDocs.push(doc)
  }

  payload.logger.info(`— Seeding posts...`)

  const post1Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: { disableRevalidate: true },
    data: post1({
      heroImage: post1ImageDoc,
      author: demoAuthor,
      categories: [categoryByTitle['Soil Health']],
    }),
    overrideAccess: true,
  })

  const post2Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: { disableRevalidate: true },
    data: post2({
      heroImage: post2ImageDoc,
      author: demoAuthor,
      categories: [categoryByTitle['Vermicomposting'], categoryByTitle['Organic Farming']],
    }),
    overrideAccess: true,
  })

  const post3Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: { disableRevalidate: true },
    data: post3({
      heroImage: post3ImageDoc,
      author: demoAuthor,
      categories: [categoryByTitle['Certification'], categoryByTitle['Organic Farming']],
    }),
    overrideAccess: true,
  })

  await payload.update({
    id: post1Doc.id,
    collection: 'posts',
    data: { relatedPosts: [post2Doc.id, post3Doc.id] },
    overrideAccess: true,
  })
  await payload.update({
    id: post2Doc.id,
    collection: 'posts',
    data: { relatedPosts: [post1Doc.id, post3Doc.id] },
    overrideAccess: true,
  })
  await payload.update({
    id: post3Doc.id,
    collection: 'posts',
    data: { relatedPosts: [post1Doc.id, post2Doc.id] },
    overrideAccess: true,
  })

  payload.logger.info(`— Seeding contact form...`)

  const contactForm = await payload.create({
    collection: 'forms',
    depth: 0,
    data: contactFormData,
    overrideAccess: true,
  })

  payload.logger.info(`— Seeding home page...`)

  await payload.updateGlobal({
    slug: 'home-page',
    data: homePageGlobal({
      backgroundImage: backgroundImageDoc,
      circleImage: circleImageDoc,
      roundedImage: roundedImageDoc,
      stepImages: [step1ImageDoc, step2ImageDoc, step3ImageDoc],
      impactImages: [impact1ImageDoc, impact2ImageDoc, impact3ImageDoc, impact4ImageDoc],
      infoStripImage: infoStripImageDoc,
      contactForm,
    }),
    overrideAccess: true,
  })

  payload.logger.info(`— Seeding pages...`)

  const ourStoryPage = await payload.create({
    collection: 'pages',
    depth: 0,
    data: ourStoryPageData({ storyImage: storyImageDoc }),
    overrideAccess: true,
  })
  const certificationPage = await payload.create({
    collection: 'pages',
    depth: 0,
    data: certificationPageData({ certImage: certImageDoc }),
    overrideAccess: true,
  })
  const contactPage = await payload.create({
    collection: 'pages',
    depth: 0,
    data: contactPageData({ contactForm }),
    overrideAccess: true,
  })

  payload.logger.info(`— Seeding globals...`)

  await payload.updateGlobal({
    slug: 'header',
    data: {
      navItems: [
        {
          link: {
            type: 'custom',
            label: 'Home',
            url: '/',
          },
        },
        {
          link: {
            type: 'reference',
            label: 'Our Story',
            reference: { relationTo: 'pages', value: ourStoryPage.id },
          },
        },
        {
          link: {
            type: 'custom',
            label: 'Products',
            url: '/products',
          },
        },
        {
          link: {
            type: 'reference',
            label: 'Organic Certification',
            reference: { relationTo: 'pages', value: certificationPage.id },
          },
        },
        {
          link: {
            type: 'custom',
            label: 'Resources',
            url: '/posts',
          },
        },
        {
          link: {
            type: 'reference',
            label: 'Contact',
            reference: { relationTo: 'pages', value: contactPage.id },
          },
        },
      ],
    },
    overrideAccess: true,
  })
  await payload.updateGlobal({
    slug: 'footer',
    data: {
      backgroundImage: infoStripImageDoc.id,
      trustBadges: [
        { icon: 'leaf', label: '100% Organic' },
        { icon: 'sprout', label: 'EU Certified' },
        { icon: 'globe', label: 'Eco-Friendly' },
        { icon: 'users', label: 'Trusted by Farmers' },
        { icon: 'heart', label: 'Made with Care' },
      ],
      navItems: [
        {
          link: {
            type: 'custom',
            label: 'Products',
            url: '/products',
          },
        },
        {
          link: {
            type: 'reference',
            label: 'Contact',
            reference: { relationTo: 'pages', value: contactPage.id },
          },
        },
        {
          link: {
            type: 'custom',
            label: 'Admin',
            url: '/admin',
          },
        },
      ],
    },
    overrideAccess: true,
  })

  payload.logger.info('Seeded database successfully!')
}
