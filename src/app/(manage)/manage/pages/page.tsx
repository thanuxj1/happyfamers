import Link from 'next/link'
import { getManagePayload } from '@/utilities/getManagePayload'

/**
 * Our Story has its own screen, because its bespoke layout needs fields this
 * generic editor cannot offer. Listing it here as well would give the same page
 * two different editors, so it is filtered out and linked to instead.
 */
const OWN_SCREEN = 'our-story'

export default async function ManagePagesPage() {
  const { payload } = await getManagePayload()
  const { docs } = await payload.find({
    collection: 'pages',
    sort: 'title',
    limit: 100,
    depth: 0,
  })

  // Empty drafts are skipped: they are not on the website and a row with no
  // name is only confusing.
  const pages = docs.filter((page) => page.slug !== OWN_SCREEN && (page.title || page.slug))

  return (
    <div>
      <h1 className="text-2xl font-bold">Pages</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        The wording and photos on your Organic Certification and Contact pages. The{' '}
        <Link href="/manage/our-story" className="font-medium text-primary hover:underline">
          Our Story page
        </Link>{' '}
        has its own screen.
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        {pages.length === 0 ? (
          <p className="p-5 text-sm text-muted-foreground">No pages yet.</p>
        ) : (
          <table className="w-full text-sm">
            <tbody>
              {pages.map((page) => (
                <tr key={page.id} className="border-b border-border last:border-0">
                  <td className="p-4">
                    <Link
                      href={`/manage/pages/${page.id}/edit`}
                      className="font-medium hover:text-primary"
                    >
                      {page.title || '(Untitled page)'}
                    </Link>
                  </td>
                  <td className="p-4 text-right text-muted-foreground">/{page.slug}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
