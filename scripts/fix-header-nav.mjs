/**
 * Rewrites the header navigation cleanly.
 *
 *   npx tsx scripts/fix-header-nav.mjs
 *
 * Restoring the Resources link by splicing it into the middle of the array
 * left it carrying a stale `reference` pointing at the Contact page: Payload
 * reuses array row ids positionally, so the inserted row inherited the fields
 * of whatever used to sit at that index. The link still resolves, because a
 * `custom` link uses its own url, but the leftover reference is wrong and
 * would confuse the next person to edit it.
 *
 * Writing the whole array without ids makes Payload create fresh rows.
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config.ts'

const NAV = [
  { label: 'Home', url: '/' },
  { label: 'Our Story', url: '/our-story' },
  { label: 'Products', url: '/products' },
  { label: 'Organic Certification', url: '/organic-certification' },
  { label: 'Resources', url: '/posts' },
  { label: 'Contact', url: '/contact' },
]

const payload = await getPayload({ config })

await payload.updateGlobal({
  slug: 'header',
  data: {
    navItems: NAV.map(({ label, url }) => ({
      // reference must be set to null explicitly: leaving it out keeps
      // whatever the row held before.
      link: { type: 'custom', label, url, newTab: false, reference: null },
    })),
  },
  context: { disableRevalidate: true },
})

const header = await payload.findGlobal({ slug: 'header', depth: 0 })
for (const item of header.navItems ?? []) {
  const link = item?.link ?? {}
  console.log(
    `RESULT ${String(link.label).padEnd(22)} url=${String(link.url).padEnd(24)} reference=${
      link.reference ? JSON.stringify(link.reference) : 'none'
    }`,
  )
}

process.exit(0)
