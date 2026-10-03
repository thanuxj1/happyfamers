import { notFound } from 'next/navigation'
import { getManagePayload } from '@/utilities/getManagePayload'
import { ResourceForm } from '../../../_components/ResourceForm'

export default async function EditResourcePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { payload } = await getManagePayload()
  const { docs: categories } = await payload.find({ collection: 'categories', limit: 100, depth: 0 })

  let resource
  try {
    resource = await payload.findByID({ collection: 'posts', id, depth: 1, draft: true })
  } catch {
    notFound()
  }
  if (!resource) notFound()

  return (
    <div>
      <h1 className="text-2xl font-bold">Edit article</h1>
      <div className="mt-6">
        <ResourceForm resource={resource} categories={categories} />
      </div>
    </div>
  )
}
