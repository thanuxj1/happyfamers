import { getManagePayload } from '@/utilities/getManagePayload'

export default async function ManageMessagesPage() {
  const { payload } = await getManagePayload()
  const { docs: submissions } = await payload.find({
    collection: 'form-submissions',
    sort: '-createdAt',
    limit: 50,
  })

  return (
    <div>
      <h1 className="text-2xl font-bold">Messages</h1>
      <p className="mt-1 text-sm text-muted-foreground">Messages visitors have sent through your contact form.</p>

      {submissions.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-border bg-white p-5 text-sm text-muted-foreground shadow-sm">
          No messages yet.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {submissions.map((submission) => {
            const fields = (submission.submissionData ?? []) as { field?: string | null; value?: string | null }[]
            return (
              <div key={submission.id} className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                <p className="text-xs text-muted-foreground">
                  {submission.createdAt ? new Date(submission.createdAt).toLocaleString('en-IN') : ''}
                </p>
                <dl className="mt-2 grid gap-1 text-sm">
                  {fields.map((f, i) => (
                    <div key={i} className="flex gap-2">
                      <dt className="font-medium capitalize text-muted-foreground">{f.field}:</dt>
                      <dd>{f.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
