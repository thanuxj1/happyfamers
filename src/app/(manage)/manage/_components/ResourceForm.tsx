'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { ImagePicker } from './ImagePicker'
import { saveResource } from '../actions'
import { lexicalToText } from '../_lib/lexical'

type ResourceData = {
  id?: string | number
  title?: string | null
  content?: unknown
  heroImage?: { url?: string | null } | string | number | null
  categories?: ({ id?: string | number } | string | number)[] | null
  meta?: { description?: string | null } | null
  _status?: string | null
}

type Category = { id: string | number; title?: string | null }

const field = 'w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm'

export function ResourceForm({
  resource,
  categories,
}: {
  resource?: ResourceData
  categories: Category[]
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const photoUrl =
    resource?.heroImage && typeof resource.heroImage === 'object' ? resource.heroImage.url : null

  const currentCategory = resource?.categories?.[0]
  const currentCategoryId =
    currentCategory && typeof currentCategory === 'object' ? currentCategory.id : currentCategory

  function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      try {
        await saveResource(resource?.id != null ? String(resource.id) : null, formData)
        router.push('/manage/resources')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not save this article')
      }
    })
  }

  return (
    <form action={handleSubmit} className="max-w-xl space-y-5">
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Article title</span>
        <input name="title" required defaultValue={resource?.title ?? ''} className={field} />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">Short summary</span>
        <span className="mb-1 block text-xs text-muted-foreground">
          One or two sentences. Shown on the Resources list and when the article is shared.
        </span>
        <textarea
          name="summary"
          rows={2}
          defaultValue={resource?.meta?.description ?? ''}
          className={`${field} resize-y`}
        />
      </label>

      <ImagePicker name="heroImage" label="Main photo" currentUrl={photoUrl} />

      <label className="block">
        <span className="mb-1 block text-sm font-medium">Article</span>
        <span className="mb-1 block text-xs text-muted-foreground">
          Write as you normally would. Leave a blank line between paragraphs.
        </span>
        <textarea
          name="content"
          rows={14}
          defaultValue={lexicalToText(resource?.content)}
          className={`${field} resize-y leading-relaxed`}
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">Topic</span>
        <select name="category" defaultValue={String(currentCategoryId ?? '')} className={field}>
          <option value="">No topic</option>
          {categories.map((c) => (
            <option key={c.id} value={String(c.id)}>
              {c.title}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-start gap-3 rounded-xl border border-border bg-white p-4">
        <input
          type="checkbox"
          name="publish"
          defaultChecked={resource?._status === 'published'}
          className="mt-0.5 h-4 w-4"
        />
        <span>
          <span className="block text-sm font-medium">Show this article on the website</span>
          <span className="block text-xs text-muted-foreground">
            Leave unticked to keep working on it privately.
          </span>
        </span>
      </label>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
        >
          {pending ? 'Saving…' : 'Save article'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/manage/resources')}
          className="text-sm text-muted-foreground hover:underline"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
