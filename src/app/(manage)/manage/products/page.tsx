import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getManagePayload } from '@/utilities/getManagePayload'
import { DeleteButton } from '../_components/DeleteButton'
import { deleteProduct } from '../actions'

export default async function ManageProductsPage() {
  const { payload } = await getManagePayload()
  const { docs: products } = await payload.find({
    collection: 'products',
    sort: '-updatedAt',
    limit: 100,
    depth: 1,
  })

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link
          href="/manage/products/new"
          className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          <Plus size={16} /> New product
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        {products.length === 0 ? (
          <p className="p-5 text-sm text-muted-foreground">No products yet.</p>
        ) : (
          <table className="w-full text-sm">
            <tbody>
              {products.map((product) => {
                const image =
                  product.heroImage && typeof product.heroImage === 'object' ? product.heroImage.url : null
                return (
                  <tr key={product.id} className="border-b border-border last:border-0">
                    <td className="w-16 p-4">
                      {image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                      )}
                    </td>
                    <td className="p-4">
                      <Link href={`/manage/products/${product.id}/edit`} className="font-medium hover:text-primary">
                        {product.title || '(No title)'}
                      </Link>
                    </td>
                    <td className="p-4 text-right">
                      <DeleteButton
                        id={String(product.id)}
                        confirmLabel={`Delete "${product.title}"?`}
                        action={deleteProduct}
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
