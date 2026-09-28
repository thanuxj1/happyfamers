'use client'

import { motion } from 'framer-motion'
import React from 'react'

type RevealProps = {
  children: React.ReactNode
  className?: string
  delay?: number
  /** 'up' slides in from below (default), 'none' only fades. */
  direction?: 'up' | 'none'
  as?: 'div' | 'li'
}

// Scroll-triggered fade/slide-up reveal. `once: true` so it doesn't
// re-animate every time a section scrolls back into view.
export const Reveal: React.FC<RevealProps> = ({
  children,
  className,
  delay = 0,
  direction = 'up',
  as = 'div',
}) => {
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: direction === 'up' ? 24 : 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  )
}

// Wrap a group of children to stagger their entrance automatically —
// each direct child should be a motion element (e.g. RevealItem).
export const RevealGroup: React.FC<{
  children: React.ReactNode
  className?: string
  stagger?: number
}> = ({ children, className, stagger = 0.1 }) => (
  <motion.div
    className={className}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, amount: 0.15 }}
    variants={{
      hidden: {},
      show: { transition: { staggerChildren: stagger } },
    }}
  >
    {children}
  </motion.div>
)

export const RevealItem: React.FC<{
  children: React.ReactNode
  className?: string
  as?: 'div' | 'li'
}> = ({ children, className, as = 'div' }) => {
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
      }}
    >
      {children}
    </Tag>
  )
}
