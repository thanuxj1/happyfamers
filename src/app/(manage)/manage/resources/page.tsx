import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getManagePayload } from '@/utilities/getManagePayload'
import { DeleteButton } from '../_components/DeleteButton'
import { deleteResource } from '../actions'

export default async function ManageResourcesPage() {
  const { payload } = await getManagePayload()
  const { docs: resources } = await payload.find({
    collection: 'posts',
    sort: '-updatedAt',
    limit: 100,
    depth: 1,
  })

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Resources</h1>
        <Link
          href="/manage/resources/new"
          className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          <Plus size={16} /> New article
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        {resources.length === 0 ? (
          <p className="p-5 text-sm text-muted-foreground">No articles yet.</p>
        ) : (
          <table className="w-full text-sm">
            <tbody>
              {resources.map((resource) => {
                const image =
                  resource.heroImage && typeof resource.heroImage === 'object'
                    ? resource.heroImage.url
                    : null
                const live = resource._status === 'published'
                return (
                  <tr key={resource.id} className="border-b border-border last:border-0">
                    <td className="w-16 p-4">
                      {image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                      )}
                    </td>
                    <td className="p-4">
                      <Link
                        href={`/manage/resources/${resource.id}/edit`}
                        className="font-medium hover:text-primary"
                      >
                        {resource.title || '(Untitled article)'}
                      </Link>
                    </td>
                    <td className="p-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          live ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {live ? 'On the website' : 'Hidden'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <DeleteButton
                        id={String(resource.id)}
                        confirmLabel={`Delete "${resource.title || 'this article'}"?`}
                        action={deleteResource}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
