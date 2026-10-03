'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { ImagePicker } from './ImagePicker'
import { SeoFields } from './SeoFields'
import { saveProduct } from '../actions'
import { lexicalToText } from '../_lib/lexical'

type ProductData = {
  id?: string | number
  title?: string | null
  slug?: string | null
  shortDescription?: string | null
  priceLabel?: string | null
  heroImage?: { url?: string | null } | string | number | null
  benefits?: { benefit?: string | null }[] | null
  content?: unknown
  meta?: {
    title?: string | null
    image?: { url?: string | null } | string | number | null
  } | null
}

export function ProductForm({ product, siteUrl }: { product?: ProductData; siteUrl: string }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [benefitCount, setBenefitCount] = useState(product?.benefits?.length || 1)
  // Mirrored so the search preview updates as these are typed.
  const [title, setTitle] = useState(product?.title ?? '')
  const [summary, setSummary] = useState(product?.shortDescription ?? '')

  const heroImageUrl =
    product?.heroImage && typeof product.heroImage === 'object' ? product.heroImage.url : null

  function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      try {
        await saveProduct(product?.id != null ? String(product.id) : null, formData)
        router.push('/manage/products')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not save product')
      }
    })
  }

  return (
    <form action={handleSubmit} className="max-w-xl space-y-5">
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Product name</span>
        <input
          name="title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm"
        />
      </label>

      <ImagePicker name="heroImage" label="Product photo" currentUrl={heroImageUrl} />

      <label className="block">
        <span className="mb-1 block text-sm font-medium">Short description</span>
        <textarea
          name="shortDescription"
          required
          rows={2}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm"
        />
        <span className="mt-1 block text-xs text-muted-foreground">Shown on the product card. One or two sentences.</span>
      </label>

      <div>
        <span className="mb-1 block text-sm font-medium">Key benefits</span>
        <div className="space-y-2">
          {Array.from({ length: benefitCount }).map((_, i) => (
            <input
              key={i}
              name="benefit"
              defaultValue={product?.benefits?.[i]?.benefit ?? ''}
              placeholder={`Benefit ${i + 1}`}
              className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm"
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setBenefitCount((c) => c + 1)}
          className="mt-2 text-xs font-semibold text-primary hover:underline"
        >
          + Add another benefit
        </button>
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">Full description</span>
        <textarea
          name="content"
          required
          rows={5}
          defaultValue={lexicalToText(product?.content)}
          className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm"
        />
        <span className="mt-1 block text-xs text-muted-foreground">Shown on the product&apos;s own page.</span>
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">Price / call to action label</span>
        <input
          name="priceLabel"
          defaultValue={product?.priceLabel ?? ''}
          placeholder='e.g. "Contact for pricing" or "₹450 / 5kg bag"'
          className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm"
        />
      </label>

      <SeoFields
        siteUrl={siteUrl}
        path={`/products/${product?.slug ?? '…'}`}
        fallbackTitle={title}
        description={summary}
        title={product?.meta?.title}
        imageUrl={
          product?.meta?.image && typeof product.meta.image === 'object'
            ? product.meta.image.url
            : null
        }
      />

      {error && <p className="text-sm text-destructive">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
      >
        {pending ? 'Saving…' : product ? 'Save changes' : 'Create product'}
      </button>
    </form>
  )
}
