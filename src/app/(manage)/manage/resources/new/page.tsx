import { getManagePayload } from '@/utilities/getManagePayload'
import { getServerSideURL } from '@/utilities/getURL'
import { ResourceForm } from '../../_components/ResourceForm'

export default async function NewResourcePage() {
  const { payload } = await getManagePayload()
  const { docs: categories } = await payload.find({ collection: 'categories', limit: 100, depth: 0 })

  return (
    <div>
      <h1 className="text-2xl font-bold">New article</h1>
      <div className="mt-6">
        <ResourceForm categories={categories} siteUrl={getServerSideURL()} />
      </div>
    </div>
  )
}
