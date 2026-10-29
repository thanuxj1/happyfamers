'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { ImagePicker } from './ImagePicker'
import { SeoFields } from './SeoFields'
import { saveOurStoryPage } from '../actions'
import { UnsavedChangesGuard } from './UnsavedChangesGuard'

type Upload = { url?: string | null } | string | number | null | undefined

export type OurStoryData = {
  ribbonText?: string | null
  heroEyebrow?: string | null
  headingLine1?: string | null
  headingLine2?: string | null
  heroSubtext?: string | null
  heroButtonLabel?: string | null
  heroImage?: Upload
  storyEyebrow?: string | null
  storyHeading?: string | null
  storyParagraphs?: { text?: string | null }[] | null
  storyImage?: Upload
  highlights?: { text?: string | null }[] | null
  missionTitle?: string | null
  missionText?: string | null
  visionTitle?: string | null
  visionText?: string | null
  closingHeading?: string | null
  closingSubtext?: string | null
  closingButtonLabel?: string | null
  closingImage?: Upload
  meta?: {
    title?: string | null
    description?: string | null
    image?: { url?: string | null } | string | number | null
  } | null
}

const field = 'w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm'
const urlOf = (u: Upload) => (u && typeof u === 'object' ? (u.url ?? null) : null)

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">{title}</h2>
      {hint && <p className="mt-1 text-sm text-muted-foreground">{hint}</p>}
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  )
}

function Text({
  name,
  label,
  hint,
  defaultValue,
  rows,
}: {
  name: string
  label: string
  hint?: string
  defaultValue?: string | null
  rows?: number
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      {hint && <span className="mb-1 block text-xs text-muted-foreground">{hint}</span>}
      {rows ? (
        <textarea name={name} rows={rows} defaultValue={defaultValue ?? ''} className={`${field} resize-y`} />
      ) : (
        <input name={name} defaultValue={defaultValue ?? ''} className={field} />
      )}
    </label>
  )
}

export function OurStoryForm({ data, siteUrl }: { data: OurStoryData; siteUrl: string }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  function handleSubmit(formData: FormData) {
    setError(null)
    setSaved(false)
    startTransition(async () => {
      try {
        await saveOurStoryPage(formData)
        setSaved(true)
        router.refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not save the Our Story page')
      }
    })
  }

  // Keep a fixed number of rows so the shape of the page stays predictable.
  const paragraphs = data.storyParagraphs?.length ? data.storyParagraphs : [{}, {}, {}]
  const highlights = data.highlights?.length ? data.highlights : [{}, {}, {}, {}]

  return (
    <form action={handleSubmit} className="max-w-2xl space-y-6">
      <UnsavedChangesGuard />

      <Section title="Top of the page" hint="The large headline and photo visitors see first.">
        <Text name="ribbonText" label="Gold corner ribbon" defaultValue={data.ribbonText} />
        <Text name="heroEyebrow" label="Small line above the headline" defaultValue={data.heroEyebrow} />
        <Text name="headingLine1" label="Headline — first line" defaultValue={data.headingLine1} />
        <Text
          name="headingLine2"
          label="Headline — second line"
          hint="This line appears in gold."
          defaultValue={data.headingLine2}
        />
        <Text name="heroSubtext" label="Introduction" rows={3} defaultValue={data.heroSubtext} />
        <Text name="heroButtonLabel" label="Button text" defaultValue={data.heroButtonLabel} />
        <ImagePicker name="heroImage" label="Background photo" currentUrl={urlOf(data.heroImage)} />
      </Section>

      <Section title="The story" hint="The text and photo in the middle of the page.">
        <Text name="storyEyebrow" label="Small line above the heading" defaultValue={data.storyEyebrow} />
        <Text
          name="storyHeading"
          label="Heading"
          hint="Press Enter to split the heading across two lines."
          rows={2}
          defaultValue={data.storyHeading}
        />
        {paragraphs.map((paragraph, i) => (
          <Text
            key={i}
            name="storyParagraph"
            label={`Paragraph ${i + 1}`}
            rows={3}
            defaultValue={paragraph.text}
          />
        ))}
        <ImagePicker name="storyImage" label="Photo beside the story" currentUrl={urlOf(data.storyImage)} />
      </Section>

      <Section title="Highlights" hint="The four short points in the cream strip.">
        {highlights.map((highlight, i) => (
          <Text key={i} name="highlight" label={`Point ${i + 1}`} defaultValue={highlight.text} />
        ))}
      </Section>

      <Section title="Mission and vision" hint="The two panels lower down the page.">
        <Text name="missionTitle" label="Left panel heading" defaultValue={data.missionTitle} />
        <Text name="missionText" label="Left panel text" rows={3} defaultValue={data.missionText} />
        <Text name="visionTitle" label="Right panel heading" defaultValue={data.visionTitle} />
        <Text name="visionText" label="Right panel text" rows={3} defaultValue={data.visionText} />
      </Section>

      <Section title="Closing" hint="The band at the bottom of the page.">
        <Text name="closingHeading" label="Heading" defaultValue={data.closingHeading} />
        <Text name="closingSubtext" label="Line under the heading" rows={2} defaultValue={data.closingSubtext} />
        <Text name="closingButtonLabel" label="Button text" defaultValue={data.closingButtonLabel} />
        <ImagePicker name="closingImage" label="Background photo" currentUrl={urlOf(data.closingImage)} />
      </Section>

      <SeoFields
        siteUrl={siteUrl}
        path="/our-story"
        fallbackTitle="Our Story"
        title={data.meta?.title}
        description={data.meta?.description ?? ''}
        imageUrl={urlOf(data.meta?.image as Upload)}
      />

      {error && <p className="text-sm text-destructive">{error}</p>}
      {saved && <p className="text-sm text-primary">Saved. Your changes are live on the website.</p>}

      <div className="sticky bottom-4 flex items-center gap-3 rounded-full border border-border bg-white p-2 shadow-lg">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
        >
          {pending ? 'Saving…' : 'Save Our Story page'}
        </button>
        <a href="/our-story" target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:underline">
          View the page
        </a>
      </div>
    </form>
  )
}
