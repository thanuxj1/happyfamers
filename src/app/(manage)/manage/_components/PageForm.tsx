'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { ImagePicker } from './ImagePicker'
import { savePage } from '../actions'
import { lexicalToText } from '../_lib/lexical'

type Block = {
  blockType?: string
  columns?: { richText?: unknown }[] | null
  richText?: unknown
  media?: { url?: string | null } | string | number | null
}

type PageData = {
  id: string | number
  title?: string | null
  slug?: string | null
  layout?: Block[] | null
}

const field = 'w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm'

export function PageForm({ page }: { page: PageData }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  function handleSubmit(formData: FormData) {
    setError(null)
    setSaved(false)
    startTransition(async () => {
      try {
        await savePage(String(page.id), formData)
        setSaved(true)
        router.refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not save this page')
      }
    })
  }

  const blocks = page.layout ?? []
  let textCount = 0

  return (
    <form action={handleSubmit} className="max-w-2xl space-y-6">
      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Page title</span>
          <input name="title" defaultValue={page.title ?? ''} className={field} />
        </label>
      </section>

      {blocks.map((block, i) => {
        if (block.blockType === 'content') {
          return (
            <section key={i} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Text section {++textCount}</h2>
              <div className="mt-4 space-y-4">
                {(block.columns ?? []).map((column, j) => (
                  <label key={j} className="block">
                    {(block.columns?.length ?? 0) > 1 && (
                      <span className="mb-1 block text-sm font-medium">Column {j + 1}</span>
                    )}
                    <textarea
                      name={`block${i}_col${j}`}
                      rows={7}
                      defaultValue={lexicalToText(column.richText)}
                      className={`${field} resize-y leading-relaxed`}
                    />
                  </label>
                ))}
              </div>
            </section>
          )
        }

        if (block.blockType === 'mediaBlock') {
          return (
            <section key={i} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Photo</h2>
              <div className="mt-4">
                <ImagePicker
                  name={`block${i}_media`}
                  label=""
                  currentUrl={block.media && typeof block.media === 'object' ? block.media.url : null}
                />
              </div>
            </section>
          )
        }

        if (block.blockType === 'cta') {
          return (
            <section key={i} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Call to action</h2>
              <p className="mt-1 text-sm text-muted-foreground">The highlighted box near the bottom.</p>
              <textarea
                name={`block${i}_text`}
                rows={3}
                defaultValue={lexicalToText(block.richText)}
                className={`${field} mt-4 resize-y`}
              />
            </section>
          )
        }

        return (
          <section key={i} className="rounded-2xl border border-dashed border-border p-6">
            <h2 className="text-lg font-semibold text-muted-foreground">Contact form</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              The form itself stays as it is. Messages people send appear under Messages.
            </p>
          </section>
        )
      })}

      {error && <p className="text-sm text-destructive">{error}</p>}
      {saved && <p className="text-sm text-primary">Saved. Your changes are live on the website.</p>}

      <div className="sticky bottom-4 flex items-center gap-3 rounded-full border border-border bg-white p-2 shadow-lg">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
        >
          {pending ? 'Saving…' : 'Save page'}
        </button>
        {page.slug && (
          <a
            href={`/${page.slug}`}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-muted-foreground hover:underline"
          >
            View this page
          </a>
        )}
      </div>
    </form>
  )
}
