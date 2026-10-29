'use client'

import { useEffect, useRef } from 'react'

/**
 * Warns before edits are thrown away.
 *
 * Drop it inside a <form>. It watches that form for changes and then guards
 * both ways out: closing or reloading the tab (`beforeunload`) and clicking a
 * link, which on an App Router page is a client-side navigation that fires no
 * browser event at all. The sidebar is always on screen while editing, so that
 * second case is the one that actually loses people's work.
 *
 * Submitting clears the flag, so saving never prompts.
 */
export function UnsavedChangesGuard({
  message = 'You have unsaved changes. Leave this page and lose them?',
}: {
  message?: string
}) {
  const anchor = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const form = anchor.current?.closest('form')
    if (!form) return

    let dirty = false
    const markDirty = () => {
      dirty = true
    }
    const markClean = () => {
      dirty = false
    }

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!dirty) return
      event.preventDefault()
      event.returnValue = ''
    }

    const onDocumentClick = (event: MouseEvent) => {
      if (!dirty || event.defaultPrevented) return
      // Let modified clicks through: they open a new tab, so this page keeps its edits.
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const link = (event.target as HTMLElement | null)?.closest('a')
      if (!link) return

      const href = link.getAttribute('href')
      if (!href || href.startsWith('#') || link.target === '_blank') return

      if (!window.confirm(message)) {
        event.preventDefault()
        event.stopPropagation()
      } else {
        markClean()
      }
    }

    form.addEventListener('input', markDirty)
    form.addEventListener('change', markDirty)
    form.addEventListener('submit', markClean)
    window.addEventListener('beforeunload', onBeforeUnload)
    // Capture phase, so the check runs before the router's own click handler.
    document.addEventListener('click', onDocumentClick, true)

    return () => {
      form.removeEventListener('input', markDirty)
      form.removeEventListener('change', markDirty)
      form.removeEventListener('submit', markClean)
      window.removeEventListener('beforeunload', onBeforeUnload)
      document.removeEventListener('click', onDocumentClick, true)
    }
  }, [message])

  return <span ref={anchor} hidden />
}
