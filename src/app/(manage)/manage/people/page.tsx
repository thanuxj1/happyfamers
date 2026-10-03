import { getManagePayload } from '@/utilities/getManagePayload'
import { PeopleManager } from '../_components/PeopleManager'

export default async function ManagePeoplePage() {
  const { payload, user } = await getManagePayload()
  const { docs } = await payload.find({
    collection: 'users',
    sort: 'email',
    limit: 100,
    depth: 0,
  })

  return (
    <div>
      <h1 className="text-2xl font-bold">People</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Everyone who can sign in and edit this website.
      </p>
      <div className="mt-6">
        <PeopleManager
          people={docs.map((d) => ({ id: d.id, email: d.email, name: d.name }))}
          currentUserId={user.id}
        />
      </div>
    </div>
  )
}
