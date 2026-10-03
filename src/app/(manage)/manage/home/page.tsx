import { getManagePayload } from '@/utilities/getManagePayload'
import { HomePageForm } from '../_components/HomePageForm'

export default async function ManageHomePage() {
  const { payload } = await getManagePayload()
  const data = await payload.findGlobal({ slug: 'home-page', depth: 1 })

  return (
    <div>
      <h1 className="text-2xl font-bold">Home page</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Everything on the front page of the website, top to bottom.
      </p>
      <div className="mt-6">
        <HomePageForm data={data} />
      </div>
    </div>
  )
}
