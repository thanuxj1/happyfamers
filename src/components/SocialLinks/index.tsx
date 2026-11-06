import React from 'react'

import type { SocialLink } from '@/globals/SocialLinks/content'
import { cn } from '@/utilities/ui'
import { SOCIAL_ICONS } from './icons'

export const SocialLinks: React.FC<{ links: SocialLink[]; className?: string }> = ({
  links,
  className,
}) => {
  if (links.length === 0) return null

  return (
    <ul className={cn('m-0 flex list-none flex-wrap items-center gap-1 p-0', className)}>
      {links.map(({ key, label, href }) => {
        const icon = SOCIAL_ICONS[key]
        return (
          <li key={key}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              title={label}
              className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-white/15 hover:text-white"
            >
              <svg viewBox={icon.viewBox} className="h-4 w-4 fill-current" aria-hidden="true">
                <path d={icon.d} />
              </svg>
            </a>
          </li>
        )
      })}
    </ul>
  )
}
