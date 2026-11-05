import { getServerSideURL } from '@/utilities/getURL'
import { getManagePayload } from '@/utilities/getManagePayload'
import { HomePageForm } from '../_components/HomePageForm'
import { getHomeShowcase } from '@/globals/HomeShowcase/content'

export default async function ManageHomePage() {
  const { payload } = await getManagePayload()
  const [data, showcase] = await Promise.all([
    payload.findGlobal({ slug: 'home-page', depth: 1 }),
    getHomeShowcase(),
  ])

  return (
    <div>
      <h1 className="text-2xl font-bold">Home page</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Everything on the front page of the website, top to bottom.
      </p>
      <div className="mt-6">
        <HomePageForm
          data={data}
          siteUrl={getServerSideURL()}
          showcase={
            showcase.available
              ? {
                  tiles: showcase.tiles.map((tile) => ({
                    url: tile.media?.url ?? tile.src,
                    label: tile.label,
                  })),
                }
              : null
          }
        />
      </div>
    </div>
  )
}
