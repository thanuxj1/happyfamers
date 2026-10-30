/**
 * Renames the "Enhances Quality" benefit to "Enhances Crop".
 *
 *   npx tsx scripts/rename-enhances-quality.mjs [--yes]
 *
 * The label appears twice, as the third of the same three benefits: on the
 * home page's impact tiles and in the Organic Certification page's columns.
 * Both are changed so the two pages keep saying the same thing.
 */
import 'dotenv/config'
import { getPayload } from 'payload'

import config from '../src/payload.config.ts'

const FROM = 'Enhances Quality'
const TO = 'Enhances Crop'

const payload = await getPayload({ config })

// Home page: the impact tiles are plain fields.
const home = await payload.findGlobal({ slug: 'home-page', depth: 0 })
const impactItems = (home.impactItems ?? []).map((item) =>
  item?.title === FROM ? { ...item, title: TO } : item,
)
const homeChanged = impactItems.some((item) => item?.title === TO)

if (homeChanged) {
  await payload.updateGlobal({
    slug: 'home-page',
    data: { impactItems },
    context: { disableRevalidate: true },
  })
  console.log(`DONE home page: impact tile renamed to "${TO}"`)
} else {
  console.log(`SKIP home page: no "${FROM}" tile found`)
}

// Certification page: the same label lives inside a rich-text column, so the
// text node is swapped in place and the rest of the block left untouched.
const { docs } = await payload.find({
  collection: 'pages',
  where: { slug: { equals: 'organic-certification' } },
  limit: 1,
  depth: 0,
})

const page = docs[0]
if (!page) {
  console.log('SKIP certification page: not found')
  process.exit(0)
}

let certChanged = false
const swap = (node) => {
  if (!node || typeof node !== 'object') return node
  if (typeof node.text === 'string' && node.text.trim() === FROM) {
    certChanged = true
    return { ...node, text: TO }
  }
  // Lexical wraps the document in a `root` node, so that has to be walked
  // too — descending only into `children` never reaches the text.
  if (node.root) return { ...node, root: swap(node.root) }
  if (Array.isArray(node.children)) return { ...node, children: node.children.map(swap) }
  return node
}

const layout = (page.layout ?? []).map((block) =>
  Array.isArray(block?.columns)
    ? {
        ...block,
        columns: block.columns.map((column) =>
          column?.richText ? { ...column, richText: swap(column.richText) } : column,
        ),
      }
    : block,
)

if (certChanged) {
  await payload.update({
    collection: 'pages',
    id: page.id,
    data: { layout },
    context: { disableRevalidate: true },
  })
  console.log(`DONE certification page: heading renamed to "${TO}"`)
} else {
  console.log(`SKIP certification page: no "${FROM}" heading found`)
}

process.exit(0)
