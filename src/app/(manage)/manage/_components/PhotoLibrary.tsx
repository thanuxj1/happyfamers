'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useRef, useState, useTransition } from 'react'
import { Trash2, Upload } from 'lucide-react'
import { deletePhoto, renamePhoto, uploadPhotos } from '../actions'

type Photo = {
  id: string | number
  url: string | null
  alt: string | null
  filename: string | null
}

export function PhotoLibrary({
  photos,
  page,
  totalPages,
  totalDocs,
}: {
  photos: Photo[]
  page: number
  totalPages: number
  totalDocs: number
}) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleUpload(files: FileList | null) {
    if (!files?.length) return
    setError(null)
    const formData = new FormData()
    Array.from(files).forEach((f) => formData.append('photos', f))
    startTransition(async () => {
      try {
        await uploadPhotos(formData)
        router.refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not add those photos')
      }
    })
  }

  function handleRename(id: string | number, alt: string, previous: string) {
    if (alt === previous) return
    startTransition(async () => {
      try {
        await renamePhoto(String(id), alt)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not rename that photo')
      }
    })
  }

  function handleDelete(photo: Photo) {
    // Media can be referenced by products and articles, so this is worth a prompt.
    if (!confirm(`Delete "${photo.alt || photo.filename}"? Anywhere it is used will lose its photo.`)) return
    startTransition(async () => {
      try {
        await deletePhoto(String(photo.id))
        router.refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not delete that photo')
      }
    })
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={pending}
          className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
        >
          <Upload size={16} /> {pending ? 'Adding…' : 'Add photos'}
        </button>
        <span className="text-sm text-muted-foreground">{totalDocs} photos</span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => handleUpload(e.target.files)}
        />
      </div>

      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {photos.map((photo) => (
          <div key={photo.id} className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
            <div className="aspect-[4/3] bg-muted">
              {photo.url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo.url} alt={photo.alt ?? ''} className="h-full w-full object-cover" />
              )}
            </div>
            <div className="space-y-2 p-3">
              <input
                defaultValue={photo.alt ?? ''}
                aria-label="Photo description"
                placeholder="Describe this photo"
                onBlur={(e) => handleRename(photo.id, e.target.value, photo.alt ?? '')}
                className="w-full rounded-lg border border-border px-2 py-1.5 text-xs"
              />
              <button
                type="button"
                onClick={() => handleDelete(photo)}
                className="flex items-center gap-1.5 text-xs text-destructive hover:underline"
              >
                <Trash2 size={13} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center gap-4 text-sm">
          {page > 1 && (
            <Link href={`/manage/photos?page=${page - 1}`} className="hover:underline">
              ← Newer
            </Link>
          )}
          <span className="text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`/manage/photos?page=${page + 1}`} className="hover:underline">
              Older →
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
