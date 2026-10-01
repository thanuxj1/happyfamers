'use client'

import { useRef, useState, useTransition } from 'react'
import { createCategory } from '../actions'

export function CategoryForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      try {
        await createCategory(formData)
        formRef.current?.reset()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not save category')
      }
    })
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <label className="block flex-1">
        <span className="mb-1 block text-xs font-medium">Category name</span>
        <input
          name="title"
          required
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
      >
        {pending ? 'Adding…' : 'Add category'}
      </button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </form>
  )
}
