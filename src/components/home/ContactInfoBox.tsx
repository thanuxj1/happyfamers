import React from 'react'
import { Clock, Mail, MapPin, Phone } from 'lucide-react'

import type { HomePage, Media as MediaType } from '@/payload-types'

import { Media } from '@/components/Media'

export const ContactInfoBox: React.FC<{ data: HomePage }> = ({ data }) => {
  const {
    phone,
    email,
    location,
    workingHours,
    infoStripImage,
    callLabel,
    emailLabel,
    locationLabel,
    hoursLabel,
  } = data

  const rows = [
    { icon: Phone, label: callLabel, value: phone },
    { icon: Mail, label: emailLabel, value: email },
    { icon: MapPin, label: locationLabel, value: location },
    { icon: Clock, label: hoursLabel, value: workingHours },
  ]

  return (
    <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-emerald-950 bg-linear-to-br from-brand-forest-green to-brand-dark-green p-4 text-white shadow-md sm:p-5 md:col-span-2 lg:col-span-3">
      <div className="relative z-10 space-y-3">
        {rows.map(({ icon: Icon, label, value }, i) => (
          <div className="flex items-start gap-2.5" key={i}>
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-brand-light-lime" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                {label}
              </p>
              <p className="text-xs font-semibold text-zinc-100">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="relative -mx-4 -mb-4 mt-4 h-16 overflow-hidden rounded-b-2xl border-t border-emerald-950 sm:-mx-5 sm:-mb-5 sm:h-20">
        {infoStripImage && typeof infoStripImage !== 'string' && (
          <Media
            resource={infoStripImage as MediaType}
            fill
            imgClassName="object-cover brightness-75"
          />
        )}
        <div className="absolute inset-0 bg-emerald-950/20" />
      </div>
    </div>
  )
}
