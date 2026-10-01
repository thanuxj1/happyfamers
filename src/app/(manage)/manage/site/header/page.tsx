import { getManagePayload } from '@/utilities/getManagePayload'
import { HeaderForm } from '../../_components/HeaderForm'

export default async function ManageHeaderPage() {
  const { payload } = await getManagePayload()
  const header = await payload.findGlobal({ slug: 'header' })

  return (
    <div>
      <h1 className="text-2xl font-bold">Header</h1>
      <p className="mt-1 text-sm text-muted-foreground">The navigation menu and button shown at the top of every page.</p>
      <div className="mt-6 rounded-2xl border border-border bg-white p-6 shadow-sm">
        <HeaderForm ctaLabel={header.ctaLabel ?? ''} navItems={header.navItems ?? []} />
      </div>
    </div>
  )
}
