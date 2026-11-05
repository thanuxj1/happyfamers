'use client'

import { useRef, useState } from 'react'
import { ImagePlus, X } from 'lucide-react'

export function ImagePicker({
  name,
  label,
  currentUrl,
}: {
  name: string
  label: string
  currentUrl?: string | null
}) {
  // `picked` is a new photo chosen here but not saved yet. Without one, the
  // preview shows the photo the website uses now.
  const [picked, setPicked] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const preview = picked ?? currentUrl ?? null

  function handleFile(file: File | undefined) {
    if (!file) return
    setPicked(URL.createObjectURL(file))
  }

  // Undo a pick. The file input has to be emptied too, or the form would
  // still upload the photo on save.
  function undoPick() {
    if (input.current) input.current.value = ''
    setPicked(null)
  }

  return (
    <div>
      <span className="mb-1 block text-sm font-medium">{label}</span>
      <label
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          const file = e.dataTransfer.files?.[0]
          handleFile(file)
          if (input.current && file) {
            const dt = new DataTransfer()
            dt.items.add(file)
            input.current.files = dt.files
          }
        }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-6 text-sm text-muted-foreground transition ${
          dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary'
        }`}
      >
        {preview ? (
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Selected" className="h-20 w-20 rounded-lg object-cover" />
            <span className="flex items-center gap-1 text-xs font-semibold text-primary">
              <ImagePlus size={14} /> Replace photo
            </span>
          </div>
        ) : (
          <>
            <ImagePlus size={24} className="text-primary" />
            <span>
              <span className="font-semibold text-primary">Choose a photo</span> or drag one here
            </span>
          </>
        )}
        <input
          ref={input}
          type="file"
          name={name}
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </label>
      {picked && (
        <button
          type="button"
          onClick={undoPick}
          className="mt-2 flex items-center gap-1 text-xs font-medium text-destructive hover:underline"
        >
          <X size={12} /> {currentUrl ? 'Keep the current photo' : 'Remove this photo'}
        </button>
      )}
    </div>
  )
}
