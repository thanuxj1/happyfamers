'use client'
import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'
import React, { useCallback, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useForm, FormProvider } from 'react-hook-form'
import RichText from '@/components/RichText'
import { getClientSideURL } from '@/utilities/getURL'

export const EmbeddedContactForm: React.FC<{ form: FormType }> = ({ form: formFromProps }) => {
  const { id: formID, confirmationMessage, confirmationType, submitButtonLabel } = formFromProps
  const formMethods = useForm<Record<string, string>>()
  const { handleSubmit, register } = formMethods
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [error, setError] = useState<string | undefined>()

  const onSubmit = useCallback((data: Record<string, string>) => {
    const go = async () => {
      setError(undefined); setIsSubmitting(true)
      const body = Object.entries(data).map(([name, value]) => ({ field: name, value }))
      try {
        const res = await fetch(`${getClientSideURL()}/api/form-submissions`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ form: formID, submissionData: body }),
        })
        const json = await res.json()
        if (!res.ok) { setError(json.errors?.[0]?.message || 'Error'); setIsSubmitting(false); return }
        setIsSubmitting(false); setHasSubmitted(true)
      } catch { setError('Something went wrong.'); setIsSubmitting(false) }
    }
    void go()
  }, [formID])

  const inp =
    'w-full rounded-lg border border-[#e2dac8] bg-white px-3 py-1 text-[12px] text-zinc-700 placeholder:text-[#9a9384] focus:border-[#3a6b35] focus:outline-none focus:ring-1 focus:ring-[#3a6b35] transition-colors'

  if (hasSubmitted && confirmationType === 'message') {
    return (
      <div className="flex flex-col items-center gap-2 py-4 text-center">
        <span className="text-2xl">🌱</span>
        <div className="text-xs text-[#3a6b35]"><RichText data={confirmationMessage} enableGutter={false} /></div>
      </div>
    )
  }

  return (
    <FormProvider {...formMethods}>
      {error && <p className="mb-2 text-[10.5px] text-red-500">{error}</p>}
      <form id={formID} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-1.5">
        {/* Name + Email */}
        <div className="grid grid-cols-2 gap-2">
          <input className={inp} placeholder="Your Name"     type="text"  {...register('name',  { required: true })} />
          <input className={inp} placeholder="Email Address" type="email" {...register('email', { required: true })} />
        </div>
        {/* Phone + Location */}
        <div className="grid grid-cols-2 gap-2">
          <input className={inp} placeholder="Phone Number" type="tel"  {...register('phone')} />
          <input className={inp} placeholder="Location"     type="text" {...register('location')} />
        </div>
        {/* Message */}
        <textarea
          className={`${inp} min-h-[38px] resize-none`}
          placeholder="Your Message"
          rows={3}
          {...register('message')}
        />
        {/* Submit */}
        <button
          type="submit"
          form={formID}
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 self-start rounded-lg bg-[#4a7c35] px-6 py-2 text-[12.5px] font-semibold text-white shadow-sm hover:bg-[#3c6a2a] active:scale-[0.98] disabled:opacity-70 transition-all"
        >
          {isSubmitting
            ? <><Loader2 className="h-3.5 w-3.5 animate-spin" />Sending…</>
            : <>{submitButtonLabel || 'Talk to Our Team'} <span>🌿</span></>}
        </button>
      </form>
    </FormProvider>
  )
}
