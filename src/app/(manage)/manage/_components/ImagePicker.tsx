'use client'

import { useState } from 'react'
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
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null)
  const [dragOver, setDragOver] = useState(false)

  function handleFile(file: File | undefined) {
    if (!file) return
    setPreview(URL.createObjectURL(file))
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
          const input = e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement | null
          if (input && file) {
            const dt = new DataTransfer()
            dt.items.add(file)
            input.files = dt.files
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
          type="file"
          name={name}
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </label>
      {preview && (
        <button
          type="button"
          onClick={() => setPreview(null)}
          className="mt-2 flex items-center gap-1 text-xs font-medium text-destructive hover:underline"
        >
          <X size={12} /> Clear selection
        </button>
      )}
    </div>
  )
}
