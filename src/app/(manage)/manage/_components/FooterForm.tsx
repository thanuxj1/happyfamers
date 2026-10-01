'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Trash2 } from 'lucide-react'
import { saveFooter } from '../actions'

type NavItem = { link?: { label?: string | null; url?: string | null } | null }
type TrustBadge = { icon?: string | null; label?: string | null }

const ICON_OPTIONS = [
  { label: 'Leaf', value: 'leaf' },
  { label: 'Sprout', value: 'sprout' },
  { label: 'Globe', value: 'globe' },
  { label: 'Users', value: 'users' },
  { label: 'Heart', value: 'heart' },
  { label: 'Shield', value: 'shieldCheck' },
]

export function FooterForm({
  companyName,
  navItems,
  trustBadges,
}: {
  companyName: string
  navItems: NavItem[]
  trustBadges: TrustBadge[]
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [items, setItems] = useState(navItems.length > 0 ? navItems : [{ link: { label: '', url: '' } }])
  const [badges, setBadges] = useState(
    trustBadges.length > 0 ? trustBadges : [{ icon: 'leaf', label: '' }],
  )

  function handleSubmit(formData: FormData) {
    setError(null)
    setSuccess(false)
    startTransition(async () => {
      try {
        await saveFooter(formData)
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
        <span className="mb-1 block text-sm font-medium">Company name (in the copyright line)</span>
        <input
          name="companyName"
          defaultValue={companyName}
          className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm"
        />
      </label>

      <div>
        <span className="mb-1 block text-sm font-medium">Footer links</span>
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex gap-2">
              <input
                name="navLabel"
                defaultValue={item.link?.label ?? ''}
                placeholder="Label"
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
          + Add a footer link
        </button>
      </div>

      <div>
        <span className="mb-1 block text-sm font-medium">Trust badges</span>
        <span className="mb-2 block text-xs text-muted-foreground">
          The small icon + label row above the copyright line, e.g. &ldquo;100% Organic&rdquo;.
        </span>
        <div className="space-y-2">
          {badges.map((badge, i) => (
            <div key={i} className="flex gap-2">
              <select
                name="badgeIcon"
                defaultValue={badge.icon ?? 'leaf'}
                className="w-1/3 rounded-lg border border-border bg-white px-3 py-2.5 text-sm"
              >
                {ICON_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <input
                name="badgeLabel"
                defaultValue={badge.label ?? ''}
                placeholder='e.g. "100% Organic"'
                className="flex-1 rounded-lg border border-border bg-white px-3 py-2.5 text-sm"
              />
              <button
                type="button"
                onClick={() => setBadges((prev) => prev.filter((_, idx) => idx !== i))}
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
          onClick={() => setBadges((prev) => [...prev, { icon: 'leaf', label: '' }])}
          className="mt-2 text-xs font-semibold text-primary hover:underline"
        >
          + Add a trust badge
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
