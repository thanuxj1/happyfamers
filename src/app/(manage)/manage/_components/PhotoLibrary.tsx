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
  usedIn: string[]
}

export function PhotoLibrary({
  photos,
  page,
  totalPages,
  totalDocs,
  unusedCount,
  unusedOnly,
}: {
  photos: Photo[]
  page: number
  totalPages: number
  totalDocs: number
  unusedCount: number
  unusedOnly: boolean
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
        setError(err instanceof Error ? err.message : 'Could not save that description')
      }
    })
  }

  function handleDelete(photo: Photo) {
    if (!confirm(`Delete "${photo.alt || photo.filename}"? This cannot be undone.`)) return
    startTransition(async () => {
      try {
        await deletePhoto(String(photo.id))
        router.refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not delete that photo')
      }
    })
  }

  const filterBase = '/manage/photos'

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

        <Link
          href={filterBase}
          className={`rounded-full px-4 py-2 text-sm ${
            unusedOnly ? 'text-muted-foreground hover:underline' : 'bg-muted font-medium'
          }`}
        >
          All {totalDocs}
        </Link>
        <Link
          href={`${filterBase}?show=unused`}
          className={`rounded-full px-4 py-2 text-sm ${
            unusedOnly ? 'bg-muted font-medium' : 'text-muted-foreground hover:underline'
          }`}
        >
          Not used anywhere {unusedCount}
        </Link>

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

      {photos.length === 0 && (
        <p className="mt-6 rounded-xl border border-border bg-white p-5 text-sm text-muted-foreground">
          {unusedOnly ? 'Every photo is being used somewhere.' : 'No photos yet.'}
        </p>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo) => {
          const used = photo.usedIn.length > 0
          return (
            <div
              key={photo.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm"
            >
              <div className="aspect-[4/3] bg-muted">
                {photo.url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photo.url} alt={photo.alt ?? ''} className="h-full w-full object-cover" />
                )}
              </div>

              <div className="flex flex-1 flex-col gap-3 p-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Where it appears</p>
                  {used ? (
                    <ul className="mt-1 space-y-0.5">
                      {photo.usedIn.map((place) => (
                        <li key={place} className="text-sm">
                          {place}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-1 text-sm text-muted-foreground">
                      Not used anywhere — safe to delete.
                    </p>
                  )}
                </div>

                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-muted-foreground">
                    Description
                  </span>
                  <input
                    defaultValue={photo.alt ?? ''}
                    placeholder="Describe what is in this photo"
                    onBlur={(e) => handleRename(photo.id, e.target.value, photo.alt ?? '')}
                    className="w-full rounded-lg border border-border px-2.5 py-1.5 text-sm"
                  />
                  <span className="mt-1 block text-xs text-muted-foreground">
                    Read aloud to visitors who cannot see the photo, and used by Google.
                  </span>
                </label>

                <div className="mt-auto">
                  {used ? (
                    <p className="text-xs text-muted-foreground">
                      Used on the website — replace it from the page above instead of deleting.
                    </p>
                  ) : (
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => handleDelete(photo)}
                      className="flex items-center gap-1.5 text-xs text-destructive hover:underline disabled:opacity-60"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center gap-4 text-sm">
          {page > 1 && (
            <Link
              href={`${filterBase}?${unusedOnly ? 'show=unused&' : ''}page=${page - 1}`}
              className="hover:underline"
            >
              ← Newer
            </Link>
          )}
          <span className="text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`${filterBase}?${unusedOnly ? 'show=unused&' : ''}page=${page + 1}`}
              className="hover:underline"
            >
              Older →
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
