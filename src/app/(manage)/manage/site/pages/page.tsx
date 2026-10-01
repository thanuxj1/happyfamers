import { getManagePayload } from '@/utilities/getManagePayload'
import { ArchiveSettingsForm } from '../../_components/ArchiveSettingsForm'

export default async function ManageArchiveSettingsPage() {
  const { payload } = await getManagePayload()
  const settings = await payload.findGlobal({ slug: 'archive-settings' })

  return (
    <div>
      <h1 className="text-2xl font-bold">Products &amp; Resources pages</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        The heading and intro text at the top of the /products and /posts (Resources) listing pages.
      </p>
      <div className="mt-6">
        <ArchiveSettingsForm
          productsHeading={settings.productsHeading ?? ''}
          productsIntro={settings.productsIntro ?? ''}
          postsHeading={settings.postsHeading ?? ''}
          postsIntro={settings.postsIntro ?? ''}
        />
      </div>
    </div>
  )
}
