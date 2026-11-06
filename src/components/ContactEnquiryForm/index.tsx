'use client'

import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import RichText from '@/components/RichText'
import { getClientSideURL } from '@/utilities/getURL'

type ProductOption = { slug: string; title: string }

const input =
  'w-full rounded-lg border border-[#e2dac8] bg-white px-3 py-1.5 text-[14px] text-zinc-800 transition-colors placeholder:text-[#9a9384] focus:border-[#3a6b35] focus:outline-none focus:ring-1 focus:ring-[#3a6b35]'
const label = 'mb-1 block text-[12.5px] font-medium text-[#4b4639]'

/**
 * The Contact page's form, with a choice of products at the top.
 *
 * "Contact for bulk pricing" on a product links here with `?product=<slug>`,
 * which arrives with that product already chosen and named in the heading.
 * Field names match the contact form's own fields, so its emails keep working;
 * the chosen products go along as one extra `product` value.
 */
export const ContactEnquiryForm: React.FC<{ form: FormType; products: ProductOption[] }> = ({
  form,
  products,
}) => {
  const { id: formID, confirmationMessage, submitButtonLabel } = form
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<Record<string, string>>()
  const [selected, setSelected] = useState<string[]>([])
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string>()

  // Read here rather than with useSearchParams so the page stays cacheable.
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get('product')
    if (slug && products.some((p) => p.slug === slug)) setSelected([slug])
  }, [products])

  const toggle = (slug: string) =>
    setSelected((now) => (now.includes(slug) ? now.filter((s) => s !== slug) : [...now, slug]))

  const titles = products.filter((p) => selected.includes(p.slug)).map((p) => p.title)

  const onSubmit = async (data: Record<string, string>) => {
    setError(undefined)
    setSending(true)
    const submissionData = Object.entries(data).map(([field, value]) => ({ field, value }))
    if (titles.length) submissionData.push({ field: 'product', value: titles.join(', ') })

    try {
      const res = await fetch(`${getClientSideURL()}/api/form-submissions`, {
        body: JSON.stringify({ form: formID, submissionData }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })
      if (!res.ok) throw new Error()
      setSent(true)
    } catch {
      setError('Sorry, your message could not be sent. Please try again, or call us.')
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return (
      <div className="flex h-full min-h-[240px] flex-col items-center justify-center gap-2 text-center text-[#3a6b35]">
        <span className="text-3xl">🌱</span>
        <RichText data={confirmationMessage} enableGutter={false} />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-2">
      <h2 className="font-serif text-[20px] font-bold leading-tight text-[#1c3220]">
        {titles.length ? `Enquiry about ${titles.join(', ')}` : 'Send Us a Message'}
      </h2>

      {products.length > 0 && (
        <fieldset className="m-0 border-0 p-0">
          <legend className={label}>What are you interested in?</legend>
          <div className="flex flex-wrap gap-2">
            {products.map(({ slug, title }) => {
              const on = selected.includes(slug)
              return (
                <button
                  key={slug}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(slug)}
                  className={`rounded-full border px-4 py-1.5 text-[13px] font-semibold transition-colors ${
                    on
                      ? 'border-[#2a4a28] bg-[#2a4a28] text-white'
                      : 'border-[#cfc6ab] bg-white text-[#3f3b31] hover:border-[#3a6b35]'
                  }`}
                >
                  {title}
                </button>
              )
            })}
          </div>
        </fieldset>
      )}

      <div className="grid gap-2 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="contact-name">
            Your Name *
          </label>
          <input
            id="contact-name"
            className={input}
            autoComplete="name"
            aria-invalid={!!errors['full-name']}
            {...register('full-name', { required: true })}
          />
          {errors['full-name'] && <p className="mt-0.5 text-[12px] text-red-700">Please add your name.</p>}
        </div>
        <div>
          <label className={label} htmlFor="contact-email">
            Email Address *
          </label>
          <input
            id="contact-email"
            type="email"
            className={input}
            autoComplete="email"
            aria-invalid={!!errors.email}
            {...register('email', { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, required: true })}
          />
          {errors.email && <p className="mt-0.5 text-[12px] text-red-700">Please add a valid email.</p>}
        </div>
        <div>
          <label className={label} htmlFor="contact-phone">
            Phone Number
          </label>
          <input
            id="contact-phone"
            type="tel"
            className={input}
            autoComplete="tel"
            {...register('phone')}
          />
        </div>
        <div>
          <label className={label} htmlFor="contact-location">
            Location
          </label>
          <input id="contact-location" className={input} {...register('location')} />
        </div>
      </div>

      <div>
        <label className={label} htmlFor="contact-message">
          Message *
        </label>
        <textarea
          id="contact-message"
          rows={2}
          className={`${input} resize-none`}
          aria-invalid={!!errors.message}
          {...register('message', { required: true })}
        />
        {errors.message && <p className="mt-0.5 text-[12px] text-red-700">Please add a message.</p>}
      </div>

      {error && <p className="text-[13px] text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={sending}
        className="flex items-center justify-center gap-2 self-start rounded-full bg-brand-accent-green px-7 py-2.5 text-[14px] font-semibold text-white shadow-sm transition-colors hover:bg-brand-forest-green disabled:opacity-70"
      >
        {sending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Sending…
          </>
        ) : (
          submitButtonLabel || 'Send Message'
        )}
      </button>
    </form>
  )
}
