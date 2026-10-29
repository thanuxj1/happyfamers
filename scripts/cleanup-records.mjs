/**
 * Removes leftovers that clutter the manager:
 *
 *   - empty draft pages and products (no title, no address, never published)
 *   - the demo-author@example.com account left behind by the sample content
 *
 * Run once:  npx tsx scripts/cleanup-records.mjs
 *
 * (tsx rather than node: this loads src/payload.config.ts, and plain node
 * cannot read TypeScript.)
 *
 * It prints what it will remove and asks before doing anything. Nothing here is
 * on the live website, so removing it changes nothing a visitor can see — but
 * deletion cannot be undone, hence the prompt.
 */
import 'dotenv/config'
import readline from 'node:readline/promises'
import { getPayload } from 'payload'
import config from '../src/payload.config.ts'

const DEMO_EMAIL = 'demo-author@example.com'

const payload = await getPayload({ config })
const planned = []

// Matches only records that are blank AND unpublished, so a real page or
// product can never be caught by this.
for (const collection of ['pages', 'products']) {
  const { docs } = await payload.find({ collection, limit: 200, depth: 0, pagination: false })
  for (const doc of docs) {
    if (!doc.title && !doc.slug && doc._status !== 'published') {
      planned.push({ kind: collection, id: doc.id, label: `empty ${collection} draft (id ${doc.id})` })
    }
  }
}

const { docs: demoUsers } = await payload.find({
  collection: 'users',
  where: { email: { equals: DEMO_EMAIL } },
  limit: 1,
})
for (const user of demoUsers) {
  planned.push({ kind: 'users', id: user.id, label: `account ${user.email}` })
}

if (planned.length === 0) {
  console.log('Nothing to clean up.')
  process.exit(0)
}

console.log('About to delete:')
for (const item of planned) console.log('  -', item.label)

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const answer = await rl.question('\nType "yes" to delete these permanently: ')
rl.close()

if (answer.trim().toLowerCase() !== 'yes') {
  console.log('Cancelled. Nothing was deleted.')
  process.exit(0)
}

for (const item of planned) {
  await payload.delete({ collection: item.kind, id: item.id })
  console.log('Deleted', item.label)
}

console.log('\nDone.')
process.exit(0)
