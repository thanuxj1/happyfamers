import { notFound } from 'next/navigation'
import { getManagePayload } from '@/utilities/getManagePayload'
import { ProductForm } from '../../../_components/ProductForm'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { payload } = await getManagePayload()

  let product
  try {
    product = await payload.findByID({ collection: 'products', id, depth: 1 })
  } catch {
    notFound()
  }
  if (!product) notFound()

  return (
    <div>
      <h1 className="text-2xl font-bold">Edit product</h1>
      <div className="mt-6">
        <ProductForm product={product} />
      </div>
    </div>
  )
}
