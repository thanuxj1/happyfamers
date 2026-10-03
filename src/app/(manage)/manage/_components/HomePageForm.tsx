'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { ImagePicker } from './ImagePicker'
import { SeoFields } from './SeoFields'
import { saveHomePage } from '../actions'

type Upload = { url?: string | null } | string | number | null | undefined

type HomePageData = {
  badgeText?: string | null
  headingLine1?: string | null
  headingAccent?: string | null
  subtext?: string | null
  primaryCtaLabel?: string | null
  secondaryCtaLabel?: string | null
  backgroundImage?: Upload
  processHeading?: string | null
  processSteps?: { title?: string | null; description?: string | null; image?: Upload }[] | null
  productsHeading?: string | null
  whyChooseHeading?: string | null
  whyChooseItems?: { text?: string | null }[] | null
  impactHeading?: string | null
  impactItems?: { title?: string | null; description?: string | null; image?: Upload }[] | null
  certTitle?: string | null
  certDescription?: string | null
  certNumber?: string | null
  meta?: {
    title?: string | null
    description?: string | null
    image?: { url?: string | null } | string | number | null
  } | null
  contactHeading?: string | null
  contactSubtext?: string | null
  phone?: string | null
  email?: string | null
  location?: string | null
  workingHours?: string | null
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

export function HomePageForm({ data, siteUrl }: { data: HomePageData; siteUrl: string }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  function handleSubmit(formData: FormData) {
    setError(null)
    setSaved(false)
    startTransition(async () => {
      try {
        await saveHomePage(formData)
        setSaved(true)
        router.refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not save the home page')
      }
    })
  }

  const steps = data.processSteps?.length ? data.processSteps : [{}, {}, {}]
  const impact = data.impactItems?.length ? data.impactItems : [{}, {}, {}, {}]
  const why = data.whyChooseItems?.length ? data.whyChooseItems : [{}]

  return (
    <form action={handleSubmit} className="max-w-2xl space-y-6">
      <Section title="Top of the page" hint="The big headline and photo visitors see first.">
        <Text name="badgeText" label="Small line above the headline" defaultValue={data.badgeText} />
        <Text name="headingLine1" label="Headline — first line" defaultValue={data.headingLine1} />
        <Text
          name="headingAccent"
          label="Headline — second line"
          hint="This line appears in green."
          defaultValue={data.headingAccent}
        />
        <Text name="subtext" label="Introduction" rows={3} defaultValue={data.subtext} />
        <ImagePicker name="backgroundImage" label="Main photo" currentUrl={urlOf(data.backgroundImage)} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Text name="primaryCtaLabel" label="Green button text" defaultValue={data.primaryCtaLabel} />
          <Text name="secondaryCtaLabel" label="Outlined button text" defaultValue={data.secondaryCtaLabel} />
        </div>
      </Section>

      <Section title="How it works" hint="The three numbered steps.">
        <Text name="processHeading" label="Section heading" defaultValue={data.processHeading} />
        {steps.map((step, i) => (
          <div key={i} className="space-y-4 rounded-xl border border-border p-4">
            <p className="text-sm font-semibold text-muted-foreground">Step {i + 1}</p>
            <Text name="stepTitle" label="Title" defaultValue={step.title} />
            <Text name="stepDescription" label="Description" rows={2} defaultValue={step.description} />
            <ImagePicker name={`stepImage${i}`} label="Photo" currentUrl={urlOf(step.image)} />
          </div>
        ))}
      </Section>

      <Section title="Products section" hint="The products themselves are edited under Products.">
        <Text name="productsHeading" label="Section heading" defaultValue={data.productsHeading} />
      </Section>

      <Section title="Why choose us" hint="The green panel on the right.">
        <Text name="whyChooseHeading" label="Panel heading" defaultValue={data.whyChooseHeading} />
        {why.map((item, i) => (
          <Text key={i} name="whyText" label={`Point ${i + 1}`} defaultValue={item.text} />
        ))}
      </Section>

      <Section title="Benefits" hint="The four photo tiles lower down the page.">
        <Text name="impactHeading" label="Section heading" defaultValue={data.impactHeading} />
        {impact.map((item, i) => (
          <div key={i} className="space-y-4 rounded-xl border border-border p-4">
            <p className="text-sm font-semibold text-muted-foreground">Tile {i + 1}</p>
            <Text name="impactTitle" label="Title" defaultValue={item.title} />
            <Text name="impactDescription" label="Description" rows={2} defaultValue={item.description} />
            <ImagePicker name={`impactImage${i}`} label="Photo" currentUrl={urlOf(item.image)} />
          </div>
        ))}
      </Section>

      <Section title="Certification">
        <Text name="certTitle" label="Heading" defaultValue={data.certTitle} />
        <Text name="certDescription" label="Text" rows={4} defaultValue={data.certDescription} />
        <Text name="certNumber" label="Certificate number" defaultValue={data.certNumber} />
      </Section>

      <Section title="Contact details" hint="Shown in the form and the dark green panel beside it.">
        <Text name="contactHeading" label="Heading" defaultValue={data.contactHeading} />
        <Text name="contactSubtext" label="Short line under the heading" defaultValue={data.contactSubtext} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Text name="phone" label="Phone" defaultValue={data.phone} />
          <Text name="email" label="Email" defaultValue={data.email} />
          <Text name="location" label="Location" defaultValue={data.location} />
          <Text name="workingHours" label="Opening hours" defaultValue={data.workingHours} />
        </div>
      </Section>

      <SeoFields
        siteUrl={siteUrl}
        path="/"
        fallbackTitle="Healthy Soil. Healthy Harvest."
        description={data.meta?.description ?? data.subtext ?? ''}
        title={data.meta?.title}
        imageUrl={data.meta?.image && typeof data.meta.image === 'object' ? data.meta.image.url : null}
      />

      {error && <p className="text-sm text-destructive">{error}</p>}
      {saved && <p className="text-sm text-primary">Saved. Your changes are live on the website.</p>}

      <div className="sticky bottom-4 flex items-center gap-3 rounded-full border border-border bg-white p-2 shadow-lg">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
        >
          {pending ? 'Saving…' : 'Save home page'}
        </button>
        <a href="/" target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:underline">
          View the website
        </a>
      </div>
    </form>
  )
}
