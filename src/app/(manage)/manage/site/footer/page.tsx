import { getManagePayload } from '@/utilities/getManagePayload'
import { FooterForm } from '../../_components/FooterForm'

export default async function ManageFooterPage() {
  const { payload } = await getManagePayload()
  const footer = await payload.findGlobal({ slug: 'footer' })

  return (
    <div>
      <h1 className="text-2xl font-bold">Footer</h1>
      <p className="mt-1 text-sm text-muted-foreground">The trust badges, links and copyright line at the bottom of every page.</p>
      <div className="mt-6 rounded-2xl border border-border bg-white p-6 shadow-sm">
        <FooterForm
          companyName={footer.companyName ?? ''}
          navItems={footer.navItems ?? []}
          trustBadges={footer.trustBadges ?? []}
        />
      </div>
    </div>
  )
}
