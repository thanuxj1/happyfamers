'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { ImagePicker } from './ImagePicker'

const field = 'w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm'

/**
 * Optional overrides for how a page appears in search results and link
 * previews. Everything here falls back to the page's own title, summary and
 * photo, so the section stays collapsed and empty unless someone wants
 * different wording for Google than for the website.
 */
export function SeoFields({
  siteUrl,
  path,
  fallbackTitle,
  description,
  title,
  imageUrl,
}: {
  siteUrl: string
  path: string
  /** The page's own title, used when no override is given. */
  fallbackTitle: string
  /** The summary entered above — this is what Google shows. */
  description: string
  title?: string | null
  imageUrl?: string | null
}) {
  const [open, setOpen] = useState(Boolean(title))
  const [titleValue, setTitleValue] = useState(title ?? '')

  const shownTitle = (titleValue || fallbackTitle || 'Untitled').trim()
  const shownDescription = description.trim()

  return (
    <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-left"
      >
        <span>
          <span className="block text-lg font-semibold">How this looks on Google</span>
          <span className="block text-sm text-muted-foreground">
            Filled in automatically. Open this only to word it differently.
          </span>
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Approximate search result, so the effect of a change is visible. */}
      <div className="mt-5 rounded-xl border border-border bg-[#fafaf8] p-4">
        <p className="truncate text-xs text-[#4d5156]">
          {siteUrl}
          {path}
        </p>
        <p className="mt-0.5 truncate text-[17px] text-[#1a0dab]">{shownTitle} | Happy Farmers</p>
        <p className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-[#4d5156]">
          {shownDescription || 'No description yet — add a short summary above.'}
        </p>
      </div>

      {open && (
        <div className="mt-5 space-y-5">
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Title on Google</span>
            <input
              name="seoTitle"
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              placeholder={fallbackTitle}
              className={field}
            />
            <span className="mt-1 block text-xs text-muted-foreground">
              Leave empty to use “{fallbackTitle || 'the title above'}”.
            </span>
          </label>

          <p className="rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
            The grey text under the link comes from the summary above, so edit it there.
          </p>

          <ImagePicker
            name="seoImage"
            label="Picture when the link is shared"
            currentUrl={imageUrl ?? null}
          />
          <p className="-mt-2 text-xs text-muted-foreground">
            Leave empty to use the main photo.
          </p>
        </div>
      )}
    </section>
  )
}
