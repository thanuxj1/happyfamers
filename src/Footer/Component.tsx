import React from 'react'
import { Globe, Heart, Leaf, ShieldCheck, Sprout, Users } from 'lucide-react'

import type { Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'
import { getCachedGlobal } from '@/utilities/getGlobals'

const badgeIconMap = {
  leaf: Leaf,
  sprout: Sprout,
  globe: Globe,
  users: Users,
  heart: Heart,
  shieldCheck: ShieldCheck,
} as const

export async function Footer() {
  const footerData = await getCachedGlobal('footer', 1)()
  const backgroundImage = footerData?.backgroundImage
  const badges = footerData?.trustBadges || []

  return (
    <footer className="relative overflow-hidden bg-[#2e2114] py-4 text-[#ded6b8] lg:h-[59px] lg:py-0">
      {/* Background photo */}
      {backgroundImage && typeof backgroundImage !== 'string' && (
        <Media
          resource={backgroundImage as MediaType}
          fill
          imgClassName="object-cover brightness-[0.3] saturate-[0.6] sepia-[0.35]"
          className="absolute inset-0 -z-10"
        />
      )}
      <div className="absolute inset-0 -z-10 bg-[#2e2114]/75" />

      {/* Trust badges row */}
      <div className="relative mx-auto flex h-full max-w-[1400px] flex-wrap items-center justify-center gap-x-6 gap-y-3 px-5 text-[13.5px] lg:flex-nowrap lg:justify-between lg:gap-0 lg:px-10">
        {badges.map(({ icon, label }, i) => {
          const Icon = badgeIconMap[icon as keyof typeof badgeIconMap] || Leaf
          return (
            <div className="flex items-center gap-3 transition-colors hover:text-white" key={i}>
              <Icon className="h-[22px] w-[22px] text-[#cfc48f]" strokeWidth={1.4} />
              <span>{label}</span>
            </div>
          )
        })}
      </div>
    </footer>
  )
}
