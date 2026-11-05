'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Play, X } from 'lucide-react'

/**
 * The farm's own video in the home hero.
 *
 * - `HeroWormsPanel` loops the hand-full-of-worms part of it, silently, over the
 *   left edge of the hero photo (where the photo had a still of hands).
 * - `WatchVideoButton` is the "See How It Works" button.
 * - Either one opens `VideoDialog`, which plays the whole video with sound.
 *
 * The full video is ~7 MB, so it is only fetched once someone presses play.
 * The loop is ~0.85 MB and is only fetched on screens wide enough to show it,
 * and never for visitors who ask for reduced motion (they get its still frame).
 */

const OPEN_EVENT = 'hf:open-how-it-works'
const FULL_VIDEO = '/home/how-it-works.mp4'
const FULL_POSTER = '/home/how-it-works.jpg'
const LOOP_VIDEO = '/home/hero-worms.mp4'
const LOOP_POSTER = '/home/hero-worms.jpg'

const openVideo = () => window.dispatchEvent(new Event(OPEN_EVENT))

export function HeroWormsPanel() {
  const [src, setSrc] = useState<string | undefined>()

  useEffect(() => {
    const wide = window.matchMedia('(min-width: 768px)')
    const still = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setSrc(wide.matches && !still.matches ? LOOP_VIDEO : undefined)
    update()
    wide.addEventListener('change', update)
    still.addEventListener('change', update)
    return () => {
      wide.removeEventListener('change', update)
      still.removeEventListener('change', update)
    }
  }, [])

  return (
    <button
      type="button"
      onClick={openVideo}
      aria-label="Play our video: how vermicompost is made"
      // Covers the hands in the photo underneath (they reach about a quarter of
      // the way across). Its right edge fades into the same dark tint that sits
      // behind the heading, rather than to transparent, so none of the photo's
      // hands show through.
      className="group absolute inset-y-0 left-0 z-[5] hidden w-[26%] overflow-hidden md:block"
      // A short fade on the very edge softens the seam between video and photo.
      style={{
        maskImage: 'linear-gradient(to right, #000 86%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, #000 86%, transparent)',
      }}
    >
      <video
        key={src ?? 'still'}
        src={src}
        poster={LOOP_POSTER}
        autoPlay
        loop
        muted
        playsInline
        preload={src ? 'auto' : 'none'}
        aria-hidden="true"
        // The hand fills the top two thirds of the clip; keep all of it in view.
        className="h-full w-full object-cover object-[50%_30%]"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to right, rgba(8,16,9,0) 50%, rgba(8,16,9,0.65) 80%, rgba(8,16,9,0.8) 100%)',
        }}
      />
      <span
        style={{ left: 20 }}
        className="absolute bottom-12 flex items-center gap-2 whitespace-nowrap rounded-full bg-black/55 py-1.5 pl-1.5 pr-3.5 text-[12px] font-semibold text-white backdrop-blur-sm transition-colors group-hover:bg-black/75">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-black">
          <Play className="h-3 w-3 translate-x-px fill-current" />
        </span>
        Watch video
      </span>
    </button>
  )
}

export function WatchVideoButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={openVideo}
      className="flex items-center gap-2 rounded-full border border-white/40 bg-black/60 px-5 py-3 text-[14px] font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/75"
    >
      {label}
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-black">
        <Play className="h-2.5 w-2.5 fill-current" />
      </span>
    </button>
  )
}

export function VideoDialog() {
  const dialog = useRef<HTMLDialogElement>(null)
  const video = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const open = () => {
      const v = video.current
      if (!v || !dialog.current) return
      if (!v.getAttribute('src')) v.src = FULL_VIDEO
      dialog.current.showModal()
      // Pressing play is the gesture, so sound is allowed here.
      v.play().catch(() => {})
    }
    window.addEventListener(OPEN_EVENT, open)
    return () => window.removeEventListener(OPEN_EVENT, open)
  }, [])

  const close = () => dialog.current?.close()

  return (
    <dialog
      ref={dialog}
      onClose={() => video.current?.pause()}
      // A click on the dimmed backdrop (the dialog itself, not its contents) closes it.
      onClick={(e) => e.target === e.currentTarget && close()}
      aria-label="How it works video"
      className="m-auto w-[min(92vw,960px)] overflow-visible bg-transparent p-0 backdrop:bg-black/80"
    >
      <div className="relative">
        <button
          type="button"
          onClick={close}
          aria-label="Close video"
          className="absolute -top-11 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/30"
        >
          <X className="h-5 w-5" />
        </button>
        <video
          ref={video}
          poster={FULL_POSTER}
          controls
          playsInline
          preload="none"
          className="block aspect-video w-full rounded-xl bg-black"
        />
      </div>
    </dialog>
  )
}
