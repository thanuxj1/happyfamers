'use client'
import type { FormFieldBlock, Form as FormType } from '@payloadcms/plugin-form-builder/types'

import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { useForm, FormProvider } from 'react-hook-form'
import RichText from '@/components/RichText'
import { Button } from '@/components/ui/button'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import { fields } from './fields'
import { getClientSideURL } from '@/utilities/getURL'

export type FormBlockType = {
  blockName?: string
  blockType?: 'formBlock'
  enableIntro: boolean
  form: FormType
  introContent?: SerializedEditorState
}

export const FormBlock: React.FC<
  {
    id?: string
  } & FormBlockType
> = (props) => {
  const {
    enableIntro,
    form: formFromProps,
    form: { id: formID, confirmationMessage, confirmationType, redirect, submitButtonLabel } = {},
    introContent,
  } = props

  const formMethods = useForm({
    defaultValues: formFromProps.fields,
  })
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = formMethods

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>()
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()
  const router = useRouter()

  const onSubmit = useCallback(
    (data: FormFieldBlock[]) => {
      const submitForm = async () => {
        setError(undefined)
        setIsSubmitting(true)

        const dataToSend = Object.entries(data).map(([name, value]) => ({
          field: name,
          value,
        }))

        try {
          const req = await fetch(`${getClientSideURL()}/api/form-submissions`, {
            body: JSON.stringify({
              form: formID,
              submissionData: dataToSend,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          })

          const res = await req.json()

          if (req.status >= 400) {
            setIsSubmitting(false)

            setError({
              message: res.errors?.[0]?.message || 'Internal Server Error',
              status: res.status,
            })

            return
          }

          if (confirmationType === 'redirect' && redirect) {
            const { url } = redirect
            if (url) router.push(url)
            return
          }

          setIsSubmitting(false)
          setHasSubmitted(true)
        } catch (err) {
          console.warn(err)
          setIsSubmitting(false)
          setError({
            message: 'Something went wrong.',
          })
        }
      }

      void submitForm()
    },
    [router, formID, redirect, confirmationType],
  )

  return (
    <div className="container lg:max-w-[48rem]">
      {enableIntro && introContent && !hasSubmitted && (
        <RichText className="mb-8 lg:mb-12" data={introContent} enableGutter={false} />
      )}
      <div className="p-4 lg:p-6 border border-border rounded-[0.8rem]">
        <FormProvider {...formMethods}>
          <AnimatePresence initial={false} mode="wait">
            {hasSubmitted && confirmationType === 'message' ? (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 10 }}
                key="success"
                transition={{ duration: 0.45, ease: 'easeOut' }}
              >
                <RichText data={confirmationMessage} />
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
                  <div className="mb-4">{`${error.status || '500'}: ${error.message || ''}`}</div>
                )}
                <form id={formID} onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-4 last:mb-0">
                    {formFromProps &&
                      formFromProps.fields &&
                      formFromProps.fields?.map((field, index) => {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const Field: React.FC<any> = fields?.[field.blockType as keyof typeof fields]
                        if (Field) {
                          return (
                            <div className="mb-6 last:mb-0" key={index}>
                              <Field
                                form={formFromProps}
                                {...field}
                                {...formMethods}
                                control={control}
                                errors={errors}
                                register={register}
                              />
                            </div>
                          )
                        }
                        return null
                      })}
                  </div>

                  <Button disabled={isSubmitting} form={formID} type="submit" variant="default">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      submitButtonLabel
                    )}
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </FormProvider>
      </div>
    </div>
  )
}
