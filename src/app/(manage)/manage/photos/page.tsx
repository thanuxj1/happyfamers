import { getManagePayload } from '@/utilities/getManagePayload'
import { PhotoLibrary } from '../_components/PhotoLibrary'
import { buildPhotoUsage } from '../_lib/photoUsage'

export default async function ManagePhotosPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; show?: string }>
}) {
  const { page, show } = await searchParams
  const current = Math.max(1, Number(page) || 1)
  const unusedOnly = show === 'unused'

  const { payload } = await getManagePayload()
  const usage = await buildPhotoUsage(payload)

  // Paging happens after filtering, so "unused" pages are not mostly empty.
  const all = await payload.find({
    collection: 'media',
    sort: '-updatedAt',
    limit: 1000,
    pagination: false,
    depth: 0,
  })

  const everything = all.docs.map((d) => ({
    id: d.id,
    url: d.url ?? null,
    alt: d.alt ?? null,
    filename: d.filename ?? null,
    usedIn: usage.get(d.id as number) ?? [],
  }))

  const unusedCount = everything.filter((p) => p.usedIn.length === 0).length
  const filtered = unusedOnly ? everything.filter((p) => p.usedIn.length === 0) : everything

  const perPage = 48
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const clamped = Math.min(current, totalPages)
  const photos = filtered.slice((clamped - 1) * perPage, clamped * perPage)

  return (
    <div>
      <h1 className="text-2xl font-bold">Photos</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Every photo on the website, and where each one appears. You do not need to come here to add a
        photo — product and article forms upload one for you.
      </p>
      <div className="mt-6">
        <PhotoLibrary
          photos={photos}
          page={clamped}
          totalPages={totalPages}
          totalDocs={everything.length}
          unusedCount={unusedCount}
          unusedOnly={unusedOnly}
        />
      </div>
    </div>
  )
}
