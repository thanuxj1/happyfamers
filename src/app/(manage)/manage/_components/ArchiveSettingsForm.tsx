'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { saveArchiveSettings } from '../actions'

export function ArchiveSettingsForm({
  productsHeading,
  productsIntro,
  postsHeading,
  postsIntro,
}: {
  productsHeading: string
  productsIntro: string
  postsHeading: string
  postsIntro: string
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  function handleSubmit(formData: FormData) {
    setError(null)
    setSuccess(false)
    startTransition(async () => {
      try {
        await saveArchiveSettings(formData)
        setSuccess(true)
        router.refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not save')
      }
    })
  }

  return (
    <form action={handleSubmit} className="max-w-xl space-y-8">
      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-primary">Products page</h2>
        <label className="mt-4 block">
          <span className="mb-1 block text-sm font-medium">Heading</span>
          <input
            name="productsHeading"
            defaultValue={productsHeading}
            className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm"
          />
        </label>
        <label className="mt-4 block">
          <span className="mb-1 block text-sm font-medium">Intro paragraph</span>
          <textarea
            name="productsIntro"
            rows={3}
            defaultValue={productsIntro}
            className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm"
          />
        </label>
      </div>

      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-primary">Resources page</h2>
        <label className="mt-4 block">
          <span className="mb-1 block text-sm font-medium">Heading</span>
          <input
            name="postsHeading"
            defaultValue={postsHeading}
            className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm"
          />
        </label>
        <label className="mt-4 block">
          <span className="mb-1 block text-sm font-medium">Intro paragraph</span>
          <textarea
            name="postsIntro"
            rows={3}
            defaultValue={postsIntro}
            className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm"
          />
        </label>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && <p className="text-sm text-primary">Saved.</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
      >
        {pending ? 'Saving…' : 'Save changes'}
      </button>
    </form>
  )
}
