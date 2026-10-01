'use client'

import { useState, useTransition } from 'react'
import { AlertTriangle, Trash2 } from 'lucide-react'

export function DeleteButton({
  id,
  confirmLabel,
  action,
}: {
  id: string
  confirmLabel: string
  action: (id: string) => Promise<void>
}) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleConfirm() {
    setError(null)
    startTransition(async () => {
      try {
        await action(id)
        setOpen(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not delete')
      }
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-muted-foreground hover:text-destructive"
        aria-label="Delete"
      >
        <Trash2 size={16} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="text-destructive" size={22} />
            </div>
            <h2 className="mt-4 text-lg font-bold">Delete this?</h2>
            <p className="mt-1 text-sm text-muted-foreground">{confirmLabel}</p>
            {error && <p className="mt-2 text-sm font-medium text-destructive">{error}</p>}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={pending}
                className="rounded-full px-4 py-2 text-sm font-semibold hover:bg-secondary disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={pending}
                className="rounded-full bg-destructive px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
              >
                {pending ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
