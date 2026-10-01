import { getManagePayload } from '@/utilities/getManagePayload'
import { CategoryForm } from '../_components/CategoryForm'
import { DeleteButton } from '../_components/DeleteButton'
import { deleteCategory } from '../actions'

export default async function ManageCategoriesPage() {
  const { payload } = await getManagePayload()
  const { docs: categories } = await payload.find({
    collection: 'categories',
    sort: 'title',
    limit: 100,
  })

  return (
    <div>
      <h1 className="text-2xl font-bold">Categories</h1>
      <p className="mt-1 text-sm text-muted-foreground">Topic tags for organizing your Resource articles.</p>

      <div className="mt-6 rounded-2xl border border-border bg-white p-5 shadow-sm">
        <h2 className="font-semibold">Add category</h2>
        <div className="mt-3">
          <CategoryForm />
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        {categories.length === 0 ? (
          <p className="p-5 text-sm text-muted-foreground">No categories yet.</p>
        ) : (
          <table className="w-full text-sm">
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b border-border last:border-0">
                  <td className="p-4 font-medium">{category.title}</td>
                  <td className="p-4 text-right">
                    <DeleteButton
                      id={String(category.id)}
                      confirmLabel={`Delete "${category.title}"?`}
                      action={deleteCategory}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
