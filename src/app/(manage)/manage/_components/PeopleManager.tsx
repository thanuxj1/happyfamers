'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Trash2, UserPlus } from 'lucide-react'
import { addPerson, changeOwnPassword, removePerson } from '../actions'

type Person = { id: string | number; email: string; name?: string | null }

const field = 'w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm'

export function PeopleManager({ people, currentUserId }: { people: Person[]; currentUserId: string | number }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)

  function run(action: () => Promise<void>, success?: string) {
    setError(null)
    setNotice(null)
    startTransition(async () => {
      try {
        await action()
        if (success) setNotice(success)
        router.refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      }
    })
  }

  return (
    <div className="max-w-2xl space-y-6">
      {error && <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
      {notice && <p className="rounded-lg bg-primary/10 p-3 text-sm text-primary">{notice}</p>}

      <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <table className="w-full text-sm">
          <tbody>
            {people.map((person) => {
              const isYou = String(person.id) === String(currentUserId)
              return (
                <tr key={person.id} className="border-b border-border last:border-0">
                  <td className="p-4">
                    <span className="font-medium">{person.name || person.email}</span>
                    {isYou && <span className="ml-2 text-xs text-muted-foreground">(you)</span>}
                    {person.name && <span className="block text-xs text-muted-foreground">{person.email}</span>}
                  </td>
                  <td className="p-4 text-right">
                    {isYou || people.length <= 1 ? (
                      <span className="text-xs text-muted-foreground">—</span>
                    ) : (
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => {
                          if (!confirm(`Remove ${person.name || person.email}? They will no longer be able to sign in.`)) return
                          run(() => removePerson(String(person.id)), 'That person can no longer sign in.')
                        }}
                        className="flex items-center gap-1.5 text-xs text-destructive hover:underline disabled:opacity-60"
                      >
                        <Trash2 size={13} /> Remove
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>

      {adding ? (
        <form
          action={(formData) =>
            run(async () => {
              await addPerson(formData)
              setAdding(false)
            }, 'They can sign in now with the password you set.')
          }
          className="space-y-4 rounded-2xl border border-border bg-white p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold">Add someone</h2>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Their name</span>
            <input name="name" className={field} />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Their email</span>
            <input name="email" type="email" required className={field} />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">A starting password</span>
            <input name="password" type="text" required minLength={8} className={field} />
            <span className="mt-1 block text-xs text-muted-foreground">
              At least 8 characters. Share it with them, and they can change it after signing in.
            </span>
          </label>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={pending}
              className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
            >
              {pending ? 'Adding…' : 'Add them'}
            </button>
            <button type="button" onClick={() => setAdding(false)} className="text-sm text-muted-foreground hover:underline">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          <UserPlus size={16} /> Add someone
        </button>
      )}

      <form
        action={(formData) => run(() => changeOwnPassword(formData), 'Your password has been changed.')}
        className="space-y-4 rounded-2xl border border-border bg-white p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold">Change your password</h2>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">New password</span>
          <input name="password" type="password" required minLength={8} className={field} />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-muted disabled:opacity-60"
        >
          {pending ? 'Saving…' : 'Change password'}
        </button>
      </form>
    </div>
  )
}
