'use server'

import { revalidatePath } from 'next/cache'
import { getManagePayload } from '@/utilities/getManagePayload'
import { textToLexical } from './_lib/lexical'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

type ManageSession = Awaited<ReturnType<typeof getManagePayload>>

async function uploadMedia(
  payload: ManageSession['payload'],
  user: ManageSession['user'],
  file: File,
  alt: string,
) {
  const buffer = Buffer.from(await file.arrayBuffer())
  const media = await payload.create({
    collection: 'media',
    data: { alt },
    file: {
      data: buffer,
      mimetype: file.type,
      name: file.name,
      size: file.size,
    },
    user,
    overrideAccess: false,
  })
  return media.id
}

export async function createCategory(formData: FormData) {
  const { payload, user } = await getManagePayload()
  const title = String(formData.get('title') || '')
  await payload.create({
    collection: 'categories',
    data: { title, slug: slugify(title) },
    user,
    overrideAccess: false,
  })
  revalidatePath('/manage/categories')
}

export async function deleteCategory(id: string) {
  const { payload, user } = await getManagePayload()
  await payload.delete({ collection: 'categories', id, user, overrideAccess: false })
  revalidatePath('/manage/categories')
}

export async function saveProduct(id: string | null, formData: FormData) {
  const { payload, user } = await getManagePayload()

  const title = String(formData.get('title') || '')
  const data: Record<string, unknown> = {
    title,
    slug: slugify(title),
    shortDescription: String(formData.get('shortDescription') || ''),
    content: textToLexical(String(formData.get('content') || '')),
    priceLabel: String(formData.get('priceLabel') || ''),
    _status: 'published',
  }

  const heroImageFile = formData.get('heroImage') as File | null
  if (heroImageFile && heroImageFile.size > 0) {
    data.heroImage = await uploadMedia(payload, user, heroImageFile, `${title} photo`)
  }

  const benefits = formData
    .getAll('benefit')
    .map((b) => String(b).trim())
    .filter(Boolean)
    .map((benefit) => ({ benefit }))
  if (benefits.length > 0) data.benefits = benefits

  const existingProduct = id
    ? await payload.findByID({ collection: 'products', id, depth: 1, draft: true })
    : null
  data.meta = await seoFrom(
    payload,
    user,
    formData,
    existingProduct?.meta,
    String(data.shortDescription || ''),
    `${title} photo`,
  )

  if (id) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await payload.update({
      collection: 'products',
      id,
      data: data as any,
      draft: false,
      user,
      overrideAccess: false,
    })
  } else {
    if (!heroImageFile || heroImageFile.size === 0) {
      throw new Error('A product photo is required')
    }
    await payload.create({
      collection: 'products',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: data as any,
      draft: false,
      user,
      overrideAccess: false,
    })
  }

  revalidatePath('/manage/products')
}

export async function deleteProduct(id: string) {
  const { payload, user } = await getManagePayload()
  await payload.delete({ collection: 'products', id, user, overrideAccess: false })
  revalidatePath('/manage/products')
}

export async function saveHeader(formData: FormData) {
  const { payload, user } = await getManagePayload()
  const labels = formData.getAll('navLabel').map(String)
  const urls = formData.getAll('navUrl').map(String)
  const navItems = labels
    .map((label, i) => ({ label, url: urls[i] }))
    .filter((item) => item.label && item.url)
    .map((item) => ({
      link: {
        type: 'custom' as const,
        label: item.label,
        url: item.url,
        newTab: false,
      },
    }))

  await payload.updateGlobal({
    slug: 'header',
    data: {
      ctaLabel: String(formData.get('ctaLabel') || ''),
      navItems,
    },
    user,
    overrideAccess: false,
  })
  revalidatePath('/manage/site/header')
}

export async function saveFooter(formData: FormData) {
  const { payload, user } = await getManagePayload()
  const labels = formData.getAll('navLabel').map(String)
  const urls = formData.getAll('navUrl').map(String)
  const navItems = labels
    .map((label, i) => ({ label, url: urls[i] }))
    .filter((item) => item.label && item.url)
    .map((item) => ({
      link: {
        type: 'custom' as const,
        label: item.label,
        url: item.url,
        newTab: false,
      },
    }))

  type BadgeIcon = 'leaf' | 'sprout' | 'globe' | 'users' | 'heart' | 'shieldCheck'
  const badgeIcons = formData.getAll('badgeIcon').map(String) as BadgeIcon[]
  const badgeLabels = formData.getAll('badgeLabel').map(String)
  const trustBadges = badgeLabels
    .map((label, i) => ({ label, icon: badgeIcons[i] }))
    .filter((b) => b.label)

  await payload.updateGlobal({
    slug: 'footer',
    data: {
      companyName: String(formData.get('companyName') || ''),
      navItems,
      trustBadges,
    },
    user,
    overrideAccess: false,
  })
  revalidatePath('/manage/site/footer')
}

export async function saveArchiveSettings(formData: FormData) {
  const { payload, user } = await getManagePayload()
  await payload.updateGlobal({
    slug: 'archive-settings',
    data: {
      productsHeading: String(formData.get('productsHeading') || ''),
      productsIntro: String(formData.get('productsIntro') || ''),
      postsHeading: String(formData.get('postsHeading') || ''),
      postsIntro: String(formData.get('postsIntro') || ''),
    },
    user,
    overrideAccess: false,
  })
  revalidatePath('/manage/site/pages')
}

/**
 * Search-result overrides. Empty fields are stored as undefined rather than ''
 * so generateMeta falls back to the document's own title, summary and photo.
 */
async function seoFrom(
  payload: ManageSession['payload'],
  user: ManageSession['user'],
  formData: FormData,
  existing: { title?: string | null; description?: string | null; image?: unknown } | null | undefined,
  /** The summary shown on the site; blank means "keep whatever is stored". */
  fallbackDescription: string,
  alt: string,
) {
  // A form that does not render the panel at all must not wipe an override that
  // is already stored, so absence and "cleared by the editor" are distinguished.
  const title = formData.has('seoTitle')
    ? String(formData.get('seoTitle') || '').trim() || undefined
    : (existing?.title ?? undefined)

  return {
    title,
    description: fallbackDescription || existing?.description || undefined,
    image: await resolveImage(payload, user, formData, 'seoImage', existing?.image, alt),
  }
}

/**
 * Replaces an array item's photo only when a new file was chosen, so saving the
 * page without touching the photos keeps the ones already there.
 */
async function resolveImage(
  payload: ManageSession['payload'],
  user: ManageSession['user'],
  formData: FormData,
  field: string,
  existing: unknown,
  alt: string,
) {
  const file = formData.get(field) as File | null
  if (file && file.size > 0) return uploadMedia(payload, user, file, alt)
  if (existing && typeof existing === 'object') return (existing as { id?: number }).id
  return existing ?? undefined
}

export async function saveHomePage(formData: FormData) {
  const { payload, user } = await getManagePayload()
  const current = await payload.findGlobal({ slug: 'home-page', depth: 1 })

  const text = (name: string) => String(formData.get(name) || '')
  const rows = (name: string) => formData.getAll(name).map(String)

  const stepTitles = rows('stepTitle')
  const stepDescriptions = rows('stepDescription')
  const existingSteps = current.processSteps || []
  const processSteps = await Promise.all(
    stepTitles.map(async (title, i) => ({
      ...existingSteps[i],
      title,
      description: stepDescriptions[i] || '',
      image: await resolveImage(
        payload,
        user,
        formData,
        `stepImage${i}`,
        existingSteps[i]?.image,
        `${title} photo`,
      ),
    })),
  )

  const impactTitles = rows('impactTitle')
  const impactDescriptions = rows('impactDescription')
  const existingImpact = current.impactItems || []
  const impactItems = await Promise.all(
    impactTitles.map(async (title, i) => ({
      ...existingImpact[i],
      title,
      description: impactDescriptions[i] || '',
      image: await resolveImage(
        payload,
        user,
        formData,
        `impactImage${i}`,
        existingImpact[i]?.image,
        `${title} photo`,
      ),
    })),
  )

  const existingWhy = current.whyChooseItems || []
  const whyChooseItems = rows('whyText')
    .filter(Boolean)
    .map((itemText, i) => ({ ...existingWhy[i], text: itemText }))

  const data: Record<string, unknown> = {
    badgeText: text('badgeText'),
    headingLine1: text('headingLine1'),
    headingAccent: text('headingAccent'),
    subtext: text('subtext'),
    primaryCtaLabel: text('primaryCtaLabel'),
    secondaryCtaLabel: text('secondaryCtaLabel'),
    backgroundImage: await resolveImage(
      payload,
      user,
      formData,
      'backgroundImage',
      current.backgroundImage,
      'Home page hero photo',
    ),

    processHeading: text('processHeading'),
    processSteps,
    productsHeading: text('productsHeading'),
    whyChooseHeading: text('whyChooseHeading'),
    whyChooseItems,
    impactHeading: text('impactHeading'),
    impactItems,

    certTitle: text('certTitle'),
    certDescription: text('certDescription'),
    certNumber: text('certNumber'),

    contactHeading: text('contactHeading'),
    contactSubtext: text('contactSubtext'),
    phone: text('phone'),
    email: text('email'),
    location: text('location'),
    workingHours: text('workingHours'),

    meta: await seoFrom(
      payload,
      user,
      formData,
      current.meta,
      '',
      'Happy Farmers home page photo',
    ),
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await payload.updateGlobal({ slug: 'home-page', data: data as any, user, overrideAccess: false })
  revalidatePath('/manage/home')
  revalidatePath('/')
}

/**
 * Saves a page's existing blocks in place.
 *
 * Blocks cannot be added, removed or reordered here on purpose — the layouts
 * were designed up front, and the people editing this site need to change
 * wording and photos, not rebuild page structure. Anything this form does not
 * cover is preserved by spreading the stored block.
 */
export async function savePage(id: string, formData: FormData) {
  const { payload, user } = await getManagePayload()
  const page = await payload.findByID({ collection: 'pages', id, depth: 1, draft: true })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const layout = ((page as any).layout || []) as any[]

  const updated = await Promise.all(
    layout.map(async (block, i) => {
      if (block.blockType === 'content') {
        const columns = (block.columns || []).map((column: unknown, j: number) => {
          const value = formData.get(`block${i}_col${j}`)
          return value === null
            ? column
            : { ...(column as object), richText: textToLexical(String(value)) }
        })
        return { ...block, columns }
      }

      if (block.blockType === 'cta') {
        const value = formData.get(`block${i}_text`)
        return value === null ? block : { ...block, richText: textToLexical(String(value)) }
      }

      if (block.blockType === 'mediaBlock') {
        return {
          ...block,
          media: await resolveImage(
            payload,
            user,
            formData,
            `block${i}_media`,
            block.media,
            `${page.title} photo`,
          ),
        }
      }

      return block
    }),
  )

  const meta = await seoFrom(payload, user, formData, page.meta, '', `${page.title} photo`)

  await payload.update({
    collection: 'pages',
    id,
    data: {
      title: String(formData.get('title') || page.title),
      layout: updated,
      meta,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
    draft: false,
    user,
    overrideAccess: false,
  })

  revalidatePath('/manage/pages')
  if (page.slug) revalidatePath(`/${page.slug}`)
}

export async function addPerson(formData: FormData) {
  const { payload, user } = await getManagePayload()

  const email = String(formData.get('email') || '').trim()
  const password = String(formData.get('password') || '')
  const name = String(formData.get('name') || '').trim()

  if (!email) throw new Error('An email address is required')
  if (password.length < 8) throw new Error('The password needs to be at least 8 characters')

  const clash = await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1 })
  if (clash.docs.length > 0) throw new Error('Someone with that email can already sign in')

  await payload.create({
    collection: 'users',
    data: { email, password, name },
    user,
    overrideAccess: false,
  })

  revalidatePath('/manage/people')
}

export async function removePerson(id: string) {
  const { payload, user } = await getManagePayload()

  // Both guards exist to prevent locking everyone out of the manager, which
  // cannot be undone from inside the app.
  if (String(user.id) === String(id)) {
    throw new Error('You cannot remove your own account while signed in')
  }

  const { totalDocs } = await payload.find({ collection: 'users', limit: 0, depth: 0 })
  if (totalDocs <= 1) throw new Error('This is the only account left, so it cannot be removed')

  await payload.delete({ collection: 'users', id, user, overrideAccess: false })
  revalidatePath('/manage/people')
}

/**
 * Recovery that does not depend on email: anyone already signed in can set a
 * new password for a colleague who is locked out.
 */
export async function setPersonPassword(id: string, password: string) {
  const { payload, user } = await getManagePayload()

  if (password.length < 8) throw new Error('The password needs to be at least 8 characters')

  await payload.update({
    collection: 'users',
    id,
    data: { password },
    user,
    overrideAccess: false,
  })

  revalidatePath('/manage/people')
}

export async function changeOwnPassword(formData: FormData) {
  const { payload, user } = await getManagePayload()

  const password = String(formData.get('password') || '')
  if (password.length < 8) throw new Error('The password needs to be at least 8 characters')

  await payload.update({
    collection: 'users',
    id: user.id,
    data: { password },
    user,
    overrideAccess: false,
  })
}

export async function uploadPhotos(formData: FormData) {
  const { payload, user } = await getManagePayload()
  const files = formData.getAll('photos').filter((f): f is File => f instanceof File && f.size > 0)

  for (const file of files) {
    const alt = file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ')
    await uploadMedia(payload, user, file, alt)
  }

  revalidatePath('/manage/photos')
}

export async function renamePhoto(id: string, alt: string) {
  const { payload, user } = await getManagePayload()
  await payload.update({ collection: 'media', id, data: { alt }, user, overrideAccess: false })
  revalidatePath('/manage/photos')
}

export async function deletePhoto(id: string) {
  const { payload, user } = await getManagePayload()
  await payload.delete({ collection: 'media', id, user, overrideAccess: false })
  revalidatePath('/manage/photos')
}

export async function saveResource(id: string | null, formData: FormData) {
  const { payload, user } = await getManagePayload()

  const title = String(formData.get('title') || '')
  const summary = String(formData.get('summary') || '')
  const categoryId = String(formData.get('category') || '')
  const publish = formData.get('publish') === 'on'

  const data: Record<string, unknown> = {
    title,
    slug: slugify(title),
    content: textToLexical(String(formData.get('content') || '')),
    // The manager has no draft concept: an article is either live or it isn't.
    _status: publish ? 'published' : 'draft',
    categories: categoryId ? [Number(categoryId)] : [],
  }

  const existing = id
    ? await payload.findByID({ collection: 'posts', id, depth: 1, draft: true })
    : null
  data.meta = await seoFrom(payload, user, formData, existing?.meta, summary, `${title} photo`)

  if (publish) data.publishedAt = new Date().toISOString()

  const photo = formData.get('heroImage') as File | null
  if (photo && photo.size > 0) {
    data.heroImage = await uploadMedia(payload, user, photo, `${title} photo`)
  }

  if (id) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await payload.update({ collection: 'posts', id, data: data as any, draft: false, user, overrideAccess: false })
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await payload.create({ collection: 'posts', data: data as any, draft: false, user, overrideAccess: false })
  }

  revalidatePath('/manage/resources')
}

export async function deleteResource(id: string) {
  const { payload, user } = await getManagePayload()
  await payload.delete({ collection: 'posts', id, user, overrideAccess: false })
  revalidatePath('/manage/resources')
}
