'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Phone, X } from 'lucide-react'

import type { Header } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { HoverBloom } from '@/components/motion/HoverBloom'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const pathname = usePathname()
  const navItems = data?.navItems || []
  const ctaLabel = data?.ctaLabel || 'Talk to Our Team'

  useEffect(() => {
    setMobileNavOpen(false)
  }, [pathname])

  const isActiveLink = (item: (typeof navItems)[number]) => {
    const { link } = item
    if (link.type === 'custom') return link.url === pathname
    if (link.type === 'reference' && typeof link.reference?.value === 'object') {
      const slug = link.reference.value.slug
      const href = link.reference.relationTo !== 'pages' ? `/${slug}` : slug === 'home' ? '/' : `/${slug}`
      return href === pathname
    }
    return false
  }

  return (
    <header className="relative z-30 bg-brand-dark-green text-white">
      <nav
        aria-label="Main Navigation"
        className="mx-auto flex h-[72px] w-full max-w-[1536px] items-center justify-between px-6 lg:px-12"
      >
        <Link className="flex items-center transition-transform hover:scale-[1.03]" href="/">
          <Logo />
        </Link>

        <div className="hidden lg:flex items-center gap-6 xl:gap-9 text-[14px] font-medium tracking-wide">
          {navItems.map((item, i) => (
            <span
              key={i}
              className={
                isActiveLink(item)
                  ? 'border-b-2 border-brand-light-lime pb-1 font-semibold text-white'
                  : 'relative text-zinc-200 transition-colors hover:text-white after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-brand-light-lime after:transition-all after:duration-300 hover:after:w-full'
              }
            >
              <CMSLink {...item.link} appearance="inline" />
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <HoverBloom className="hidden rounded-full sm:block" color="rgba(255,255,255,0.35)" size={120}>
            <Link
              className="flex items-center gap-2 rounded-full border border-white/20 bg-brand-forest-green px-6 py-2.5 text-[14px] font-semibold text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-brand-accent-green hover:shadow-md"
              href="/contact"
            >
              <Phone className="h-3.5 w-3.5" />
              {ctaLabel}
            </Link>
          </HoverBloom>
          <button
            aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
            className="lg:hidden rounded-lg p-2 text-zinc-200 hover:bg-white/10 hover:text-white"
            onClick={() => setMobileNavOpen((open) => !open)}
            type="button"
          >
            <motion.span
              animate={{ rotate: mobileNavOpen ? 90 : 0 }}
              className="flex"
              transition={{ duration: 0.2 }}
            >
              {mobileNavOpen ? <X className="w-6" /> : <Menu className="w-6" />}
            </motion.span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            animate={{ height: 'auto', opacity: 1 }}
            className="overflow-hidden border-t border-brand-forest-green/60 bg-brand-dark-green lg:hidden"
            exit={{ height: 0, opacity: 0 }}
            initial={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <div className="px-5 pb-5 pt-2">
              <nav className="flex flex-col divide-y divide-brand-forest-green/40 text-sm font-medium">
                {navItems.map((item, i) => (
                  <motion.div
                    animate={{ opacity: 1, x: 0 }}
                    className="py-2.5"
                    initial={{ opacity: 0, x: -12 }}
                    key={i}
                    transition={{ duration: 0.25, delay: i * 0.05 }}
                  >
                    <CMSLink
                      {...item.link}
                      appearance="inline"
                      className={isActiveLink(item) ? 'font-semibold text-white' : 'text-zinc-200'}
                    />
                  </motion.div>
                ))}
              </nav>
              <Link
                className="mt-3 flex items-center justify-center gap-2 rounded-full bg-brand-forest-green px-4 py-2.5 text-xs font-semibold text-white transition-transform hover:scale-[1.02]"
                href="/contact"
              >
                <Phone className="h-3.5 w-3.5" />
                {ctaLabel}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
