'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Trash2 } from 'lucide-react'
import { saveHeader } from '../actions'

type NavItem = { link?: { label?: string | null; url?: string | null } | null }

export function HeaderForm({ ctaLabel, navItems }: { ctaLabel: string; navItems: NavItem[] }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [items, setItems] = useState(
    navItems.length > 0 ? navItems : [{ link: { label: '', url: '' } }],
  )

  function handleSubmit(formData: FormData) {
    setError(null)
    setSuccess(false)
    startTransition(async () => {
      try {
        await saveHeader(formData)
        setSuccess(true)
        router.refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not save')
      }
    })
  }

  return (
    <form action={handleSubmit} className="max-w-xl space-y-6">
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Header button text</span>
        <input
          name="ctaLabel"
          defaultValue={ctaLabel}
          className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm"
        />
      </label>

      <div>
        <span className="mb-1 block text-sm font-medium">Menu links</span>
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex gap-2">
              <input
                name="navLabel"
                defaultValue={item.link?.label ?? ''}
                placeholder="Label, e.g. Products"
                className="w-1/2 rounded-lg border border-border bg-white px-3 py-2.5 text-sm"
              />
              <input
                name="navUrl"
                defaultValue={item.link?.url ?? ''}
                placeholder="Page, e.g. /products"
                className="w-1/2 rounded-lg border border-border bg-white px-3 py-2.5 text-sm"
              />
              <button
                type="button"
                onClick={() => setItems((prev) => prev.filter((_, idx) => idx !== i))}
                className="text-muted-foreground hover:text-destructive"
                aria-label="Remove"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setItems((prev) => [...prev, { link: { label: '', url: '' } }])}
          className="mt-2 text-xs font-semibold text-primary hover:underline"
        >
          + Add a menu link
        </button>
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
