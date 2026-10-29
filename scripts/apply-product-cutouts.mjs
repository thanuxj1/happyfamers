/**
 * Swaps the product photos for the cut-out versions.
 *
 *   npx tsx scripts/apply-product-cutouts.mjs
 *
 * The homepage row and the product hero now stand each product directly on the
 * page with a drawn shadow, which only works if the photo has no backdrop of
 * its own. This uploads the trimmed cut-outs in public/products and repoints
 * each product's hero image and its social image at them.
 *
 * The previous photos are left in the media library untouched, so this is
 * reversible by picking the old image again in the manager.
 */
import 'dotenv/config'
import fs from 'fs/promises'
import path from 'path'
import { getPayload } from 'payload'
import config from '../src/payload.config.ts'

const PRODUCTS = [
  { slug: 'vermicompost', file: 'vermicompost.png', alt: 'Happy Farmers Vermicompost 20kg sack' },
  { slug: 'vermiwash', file: 'vermiwash.png', alt: 'Happy Farmers Vermiwash 5L container' },
  { slug: 'coco-peat', file: 'coco-peat.png', alt: 'Happy Farmers Coco Peat block' },
]

const payload = await getPayload({ config })

for (const { slug, file, alt } of PRODUCTS) {
  const { docs } = await payload.find({ collection: 'products', where: { slug: { equals: slug } }, limit: 1 })
  const product = docs[0]
  if (!product) {
    console.log(`SKIP ${slug}: no such product`)
    continue
  }

  const full = path.join('public', 'products', file)
  const data = await fs.readFile(full)

  const media = await payload.create({
    collection: 'media',
    data: { alt },
    file: { data, mimetype: 'image/png', name: file, size: data.length },
  })

  await payload.update({
    collection: 'products',
    id: product.id,
    data: {
      heroImage: media.id,
      // The listing cards read meta.image, so it has to move too or the
      // /products page keeps showing the old backdrop version.
      meta: { ...(product.meta ?? {}), image: media.id },
    },
    // The collection's afterChange hook calls revalidatePath, which only works
    // inside a Next request. Deploying rebuilds these pages anyway.
    context: { disableRevalidate: true },
  })

  console.log(`DONE ${slug}: hero and social image now media #${media.id} (${file})`)
}

console.log('\nAll products updated. Check the homepage and /products.')
process.exit(0)
