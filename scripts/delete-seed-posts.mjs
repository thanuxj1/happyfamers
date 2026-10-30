/**
 * Deletes the three demo articles that came with the starter template.
 *
 *   npx tsx scripts/delete-seed-posts.mjs
 *
 * The Resources section itself stays — this only clears the placeholder
 * content out of it so real articles can go in. The topic tags are kept,
 * since they apply to whatever gets written next.
 *
 * It lists what it will remove and asks first, because deleting cannot be
 * undone.
 */
import 'dotenv/config'
import readline from 'node:readline/promises'
import { getPayload } from 'payload'
import config from '../src/payload.config.ts'

const payload = await getPayload({ config })

const { docs } = await payload.find({
  collection: 'posts',
  limit: 200,
  depth: 0,
  pagination: false,
})

if (docs.length === 0) {
  console.log('No articles found. Nothing to do.')
  process.exit(0)
}

console.log('About to delete these articles:')
for (const doc of docs) console.log(`  - ${doc.title || '(untitled)'}  /posts/${doc.slug ?? ''}`)

// --yes skips the prompt, for running this where nothing can answer it.
if (!process.argv.includes('--yes')) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  const answer = await rl.question('\nType "yes" to delete them permanently: ')
  rl.close()

  if (answer.trim().toLowerCase() !== 'yes') {
    console.log('Cancelled. Nothing was deleted.')
    process.exit(0)
  }
}

for (const doc of docs) {
  await payload.delete({
    collection: 'posts',
    id: doc.id,
    // revalidatePath only works inside a Next request; deploying rebuilds anyway.
    context: { disableRevalidate: true },
  })
  console.log(`Deleted ${doc.title || doc.id}`)
}

const left = await payload.count({ collection: 'posts' })
console.log(`\nDone. Articles remaining: ${left.totalDocs}`)
process.exit(0)
