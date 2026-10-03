import { getServerSideURL } from '@/utilities/getURL'
import { notFound } from 'next/navigation'
import { getManagePayload } from '@/utilities/getManagePayload'
import { PageForm } from '../../../_components/PageForm'

export default async function EditPagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { payload } = await getManagePayload()

  let page
  try {
    page = await payload.findByID({ collection: 'pages', id, depth: 1, draft: true })
  } catch {
    notFound()
  }
  if (!page) notFound()

  return (
    <div>
      <h1 className="text-2xl font-bold">{page.title}</h1>
      <div className="mt-6">
        <PageForm page={page} siteUrl={getServerSideURL()} />
      </div>
    </div>
  )
}
