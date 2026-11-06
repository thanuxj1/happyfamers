'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

import { SOCIAL_NETWORKS, type SocialKey } from '@/globals/SocialLinks/networks'
import { saveSocialLinks } from '../actions'
import { UnsavedChangesGuard } from './UnsavedChangesGuard'

export function SocialLinksForm({ values }: { values: Record<SocialKey, string> }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  function handleSubmit(formData: FormData) {
    setError(null)
    setSuccess(false)
    startTransition(async () => {
      try {
        await saveSocialLinks(formData)
        setSuccess(true)
        router.refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not save')
      }
    })
  }

  return (
    <form action={handleSubmit} className="max-w-xl space-y-4">
      <UnsavedChangesGuard />
      {SOCIAL_NETWORKS.map(({ key, label, example }) => (
        <label key={key} className="block">
          <span className="mb-1 block text-sm font-medium">{label}</span>
          <input
            name={key}
            defaultValue={values[key]}
            placeholder={example}
            className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm"
          />
        </label>
      ))}

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
