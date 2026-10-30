/**
 * Takes Resources out of the site navigation.
 *
 *   npx tsx scripts/remove-resources-nav.mjs
 *
 * Also repoints the footer's "Admin" link, which still pointed at /admin —
 * the Payload admin panel was removed a while back, so that link 404s on
 * every page of the site. It becomes the manager at /manage.
 *
 * Only navigation is touched. The articles themselves stay in the database,
 * so this is reversible by adding the link back.
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config.ts'

const payload = await getPayload({ config })

const header = await payload.findGlobal({ slug: 'header', depth: 0 })
const before = header.navItems?.length ?? 0
const navItems = (header.navItems ?? []).filter((item) => {
  const url = item?.link?.url ?? ''
  return !(url === '/posts' || url.startsWith('/posts/') || url === '/resources')
})

if (navItems.length !== before) {
  await payload.updateGlobal({
    slug: 'header',
    data: { navItems },
    context: { disableRevalidate: true },
  })
  console.log(`DONE header: ${before} items -> ${navItems.length} (Resources removed)`)
} else {
  console.log('SKIP header: no Resources link found')
}

const footer = await payload.findGlobal({ slug: 'footer', depth: 0 })
let changed = false
const footerItems = (footer.navItems ?? []).map((item) => {
  if (item?.link?.url !== '/admin') return item
  changed = true
  return { ...item, link: { ...item.link, label: 'Site Manager', url: '/manage' } }
})

if (changed) {
  await payload.updateGlobal({
    slug: 'footer',
    data: { navItems: footerItems },
    context: { disableRevalidate: true },
  })
  console.log('DONE footer: /admin link repointed to /manage')
} else {
  console.log('SKIP footer: no /admin link found')
}

process.exit(0)
