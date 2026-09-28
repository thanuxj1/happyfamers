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
  const companyName = footerData?.companyName || 'Happy Farmers'

  return (
    <footer className="relative overflow-hidden border-t border-stone-800/80 px-4 py-5 text-zinc-300 sm:px-6 sm:py-4">
      {backgroundImage && typeof backgroundImage !== 'string' && (
        <Media
          resource={backgroundImage as MediaType}
          fill
          imgClassName="object-cover brightness-[0.35]"
          className="absolute inset-0 -z-10"
        />
      )}
      <div className="absolute inset-0 -z-10 bg-brand-soil-dark/80" />

      <div className="relative mx-auto flex max-w-[1240px] flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs font-medium sm:gap-x-8 sm:text-sm">
        {badges.map(({ icon, label }, i) => {
          const Icon = badgeIconMap[icon as keyof typeof badgeIconMap] || Leaf
          return (
            <div className="flex items-center gap-1.5 transition-colors hover:text-white" key={i}>
              <Icon className="h-4 w-4 text-brand-bright-lime" />
              <span>{label}</span>
            </div>
          )
        })}
      </div>
      <p className="relative mt-3 text-center text-[11px] text-zinc-400">
        © {new Date().getFullYear()} {companyName}. All rights reserved.
      </p>
    </footer>
  )
}
