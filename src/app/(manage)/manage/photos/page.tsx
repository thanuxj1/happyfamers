import { getManagePayload } from '@/utilities/getManagePayload'
import { PhotoLibrary } from '../_components/PhotoLibrary'

export default async function ManagePhotosPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page } = await searchParams
  const current = Math.max(1, Number(page) || 1)
  const { payload } = await getManagePayload()

  const photos = await payload.find({
    collection: 'media',
    sort: '-updatedAt',
    limit: 48,
    page: current,
    depth: 0,
  })

  return (
    <div>
      <h1 className="text-2xl font-bold">Photos</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Every photo used across the website. Add new ones here, or straight from a product or article.
      </p>
      <div className="mt-6">
        <PhotoLibrary
          photos={photos.docs.map((d) => ({
            id: d.id,
            url: d.url ?? null,
            alt: d.alt ?? null,
            filename: d.filename ?? null,
          }))}
          page={current}
          totalPages={photos.totalPages}
          totalDocs={photos.totalDocs}
        />
      </div>
    </div>
  )
}
