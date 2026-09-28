import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'
import React from 'react'

import type { HomePage } from '@/payload-types'

import { EmbeddedContactForm } from './EmbeddedContactForm'

export const ContactFormBox: React.FC<{ data: HomePage }> = ({ data }) => {
  const { contactHeading, contactSubtext, contactForm } = data

  if (!contactForm || typeof contactForm === 'number') return null

  return (
    <div
      className="flex flex-col justify-between rounded-2xl border border-brand-border-cream bg-brand-cream-card/80 p-4 shadow-sm sm:p-6 lg:col-span-6"
      id="contact"
    >
      <div>
        <h3 className="flex items-center gap-1 font-serif text-base font-bold text-emerald-950 sm:text-lg">
          {contactHeading} <span className="text-xs">🍃</span>
        </h3>
        <p className="mb-4 text-[11px] leading-tight text-zinc-600 sm:text-xs">{contactSubtext}</p>
      </div>
      <EmbeddedContactForm form={contactForm as unknown as FormType} />
    </div>
  )
}
