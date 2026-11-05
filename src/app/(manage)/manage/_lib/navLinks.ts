import type { Footer, Header } from '@/payload-types'

type StoredNavItem = NonNullable<Header['navItems'] | Footer['navItems']>[number]

/**
 * Menu links as the header and footer editors show them: a label and an
 * address.
 *
 * A stored link either has a typed address ("custom") or points at a page by
 * reference, as some seeded links do. The editors only have an address box, so
 * a reference is turned into the address the website itself links to (same
 * rule as `CMSLink`). Without this the box shows empty, and saving drops the
 * link, because links without an address are skipped on save.
 */
export function navItemsForEditor(items: StoredNavItem[] | null | undefined) {
  return (items ?? []).map(({ link }) => {
    const ref = link?.reference
    const doc = ref && typeof ref.value === 'object' ? ref.value : null
    const url =
      link?.type === 'reference' && doc && 'slug' in doc && doc.slug
        ? `${ref!.relationTo !== 'pages' ? `/${ref!.relationTo}` : ''}/${doc.slug}`
        : (link?.url ?? '')
    return { link: { label: link?.label ?? '', url } }
  })
}
