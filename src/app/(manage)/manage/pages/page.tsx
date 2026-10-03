import Link from 'next/link'
import { getManagePayload } from '@/utilities/getManagePayload'

export default async function ManagePagesPage() {
  const { payload } = await getManagePayload()
  const { docs: pages } = await payload.find({
    collection: 'pages',
    sort: 'title',
    limit: 100,
    depth: 0,
  })

  return (
    <div>
      <h1 className="text-2xl font-bold">Pages</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        The wording and photos on your Our Story, Organic Certification and Contact pages.
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
                    <Link href={`/manage/pages/${page.id}/edit`} className="font-medium hover:text-primary">
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
