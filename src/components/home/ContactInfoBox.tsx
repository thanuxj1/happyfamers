import React from 'react'
import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import type { HomePage, Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'

export const ContactInfoBox: React.FC<{ data: HomePage }> = ({ data }) => {
  const { phone, email, location, workingHours, infoStripImage, callLabel, emailLabel, locationLabel, hoursLabel } = data

  const rows = [
    { Icon: Phone,  label: callLabel,     value: phone },
    { Icon: Mail,   label: emailLabel,    value: email },
    { Icon: MapPin, label: locationLabel, value: location },
    { Icon: Clock,  label: hoursLabel,    value: workingHours },
  ]

  return (
    <div className="relative flex min-h-[260px] w-full flex-col overflow-hidden bg-[#2a4a28] text-white lg:min-h-0 lg:rounded-l-[20px]">
      {/* Soil photo fades up into the panel, as in the design. Absolute so it
          fills the column's leftover space instead of adding to its height. */}
      <div className="absolute inset-x-0 bottom-0 h-[104px]">
        {infoStripImage && typeof infoStripImage !== 'string' && (
          <Media resource={infoStripImage as MediaType} fill imgClassName="object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2a4a28] via-[#2a4a28]/15 to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col gap-3 px-7 pb-[58px] pt-4">
        {rows.map(({ Icon, label, value }, i) => (
          <div key={i} className="flex items-center gap-3.5">
            <Icon className="h-[24px] w-[24px] shrink-0 text-[#a8d96e]" strokeWidth={1.6} />
            <div className="min-w-0">
              <p className="text-[11.5px] leading-tight text-zinc-300">{label}</p>
              <p className="mt-0.5 text-[13px] leading-snug text-white">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
