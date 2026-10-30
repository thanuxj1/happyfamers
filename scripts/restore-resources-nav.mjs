/**
 * Puts the Resources link back in the header.
 *
 *   npx tsx scripts/restore-resources-nav.mjs
 *
 * It sits between Organic Certification and Contact, where it was before.
 * The footer's /admin link stays pointed at /manage — that was a separate
 * fix for a link that 404s, not part of the Resources change.
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config.ts'

const payload = await getPayload({ config })

const header = await payload.findGlobal({ slug: 'header', depth: 0 })
const navItems = [...(header.navItems ?? [])]

const already = navItems.some((item) => item?.link?.url === '/posts')
if (already) {
  console.log('SKIP header: Resources link already present')
  process.exit(0)
}

const entry = {
  link: { type: 'custom', label: 'Resources', url: '/posts', newTab: false },
}

const contactIndex = navItems.findIndex((item) => item?.link?.url === '/contact')
if (contactIndex === -1) navItems.push(entry)
else navItems.splice(contactIndex, 0, entry)

await payload.updateGlobal({
  slug: 'header',
  data: { navItems },
  context: { disableRevalidate: true },
})

console.log(
  'DONE header:',
  navItems.map((item) => item?.link?.label).join(' | '),
)
process.exit(0)
