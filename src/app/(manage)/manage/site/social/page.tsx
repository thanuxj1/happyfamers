import { getManagePayload } from '@/utilities/getManagePayload'
import { getSocialLinks } from '@/globals/SocialLinks/content'
import { SocialLinksForm } from '../../_components/SocialLinksForm'

export default async function ManageSocialPage() {
  await getManagePayload()
  const { available, values } = await getSocialLinks()

  return (
    <div>
      <h1 className="text-2xl font-bold">Social media</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Paste the address of each page. They appear as icons in the footer and on the Contact page.
        Leave one empty to hide its icon.
      </p>
      <div className="mt-6 rounded-2xl border border-border bg-white p-6 shadow-sm">
        {available ? (
          <SocialLinksForm values={values} />
        ) : (
          <p className="text-sm text-muted-foreground">
            This screen isn&apos;t ready yet. It needs a one-time database update.
          </p>
        )}
      </div>
    </div>
  )
}
