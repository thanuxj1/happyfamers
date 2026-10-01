import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'
import React from 'react'
import type { HomePage } from '@/payload-types'
import { EmbeddedContactForm } from './EmbeddedContactForm'
import { SectionHeading } from './SectionHeading'

export const ContactFormBox: React.FC<{ data: HomePage }> = ({ data }) => {
  const { contactHeading, contactSubtext, contactForm } = data
  if (!contactForm || typeof contactForm === 'number') return null
  return (
    <div className="flex h-full flex-col rounded-[18px] border border-[#e7e0cf] bg-[#f6f2e8] px-6 pb-3 pt-3.5">
      <SectionHeading className="mb-0.5">{contactHeading}</SectionHeading>
      <p className="mb-1.5 max-w-[230px] text-[11.5px] leading-[1.35] text-[#6b6355]">
        {contactSubtext}
      </p>
      <EmbeddedContactForm form={contactForm as unknown as FormType} />
    </div>
  )
}
