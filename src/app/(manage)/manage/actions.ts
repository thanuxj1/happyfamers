'use server'

import { revalidatePath } from 'next/cache'
import { getManagePayload } from '@/utilities/getManagePayload'

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

// Payload's `content` field on Products is rich text (Lexical JSON). Our
// simple textarea only collects plain text, so wrap each line as a paragraph
// node in Lexical's document shape rather than asking the client to edit
// JSON directly.
function textToLexical(text: string) {
  const paragraphs = text.split('\n').filter((line) => line.trim().length > 0)
  return {
    root: {
      type: 'root',
      children: paragraphs.map((line) => ({
        type: 'paragraph',
        children: [{ type: 'text', text: line, version: 1 }],
        version: 1,
      })),
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}
