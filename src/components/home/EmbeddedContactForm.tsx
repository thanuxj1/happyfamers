'use client'
import type { FormFieldBlock, Form as FormType } from '@payloadcms/plugin-form-builder/types'

import React, { useCallback, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { useForm, FormProvider } from 'react-hook-form'

import RichText from '@/components/RichText'
import { fields } from '@/blocks/Form/fields'
import { getClientSideURL } from '@/utilities/getURL'

// A compact variant of `@/blocks/Form/Component` for embedding a form inside
// a card (no outer container/border — the parent card supplies that chrome).
export const EmbeddedContactForm: React.FC<{ form: FormType }> = ({ form: formFromProps }) => {
  const { id: formID, confirmationMessage, confirmationType, submitButtonLabel } = formFromProps

  const formMethods = useForm({ defaultValues: formFromProps.fields })
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = formMethods

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()

  const onSubmit = useCallback(
    (data: FormFieldBlock[]) => {
      const submitForm = async () => {
        setError(undefined)
        setIsSubmitting(true)
        const dataToSend = Object.entries(data).map(([name, value]) => ({ field: name, value }))

        try {
          const req = await fetch(`${getClientSideURL()}/api/form-submissions`, {
            body: JSON.stringify({ form: formID, submissionData: dataToSend }),
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
          })

          const res = await req.json()

          if (req.status >= 400) {
            setIsSubmitting(false)
            setError({ message: res.errors?.[0]?.message || 'Internal Server Error', status: res.status })
            return
          }

          setIsSubmitting(false)
          setHasSubmitted(true)
        } catch (err) {
          console.warn(err)
          setIsSubmitting(false)
          setError({ message: 'Something went wrong.' })
        }
      }

      void submitForm()
    },
    [formID],
  )

  return (
    <FormProvider {...formMethods}>
      <AnimatePresence initial={false} mode="wait">
        {hasSubmitted && confirmationType === 'message' ? (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 10 }}
            key="success"
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            <RichText data={confirmationMessage} enableGutter={false} />
          </motion.div>
        ) : (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            initial={{ opacity: 1, y: 0 }}
            key="form"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {error && (
              <div className="mb-3 text-sm text-destructive">{`${error.status || '500'}: ${error.message || ''}`}</div>
            )}
            <form className="space-y-3" id={formID} onSubmit={handleSubmit(onSubmit)}>
              {formFromProps.fields?.map((field, index) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const Field: React.FC<any> = fields?.[field.blockType as keyof typeof fields]
                if (!Field) return null
                return (
                  <Field
                    key={index}
                    form={formFromProps}
                    {...field}
                    {...formMethods}
                    control={control}
                    errors={errors}
                    register={register}
                  />
                )
              })}

              <button
                className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-accent-green px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:bg-brand-forest-green active:scale-95 disabled:cursor-not-allowed disabled:opacity-80 sm:text-sm"
                disabled={isSubmitting}
                form={formID}
                type="submit"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    {submitButtonLabel}
                    <span className="text-xs">🍃</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </FormProvider>
  )
}
