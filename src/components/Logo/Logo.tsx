import clsx from 'clsx'
import Image from 'next/image'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { className, loading = 'eager', priority = 'high' } = props

  return (
    <span className={clsx('flex items-center gap-2 h-12 text-current', className)}>
      <Image
        alt=""
        className="h-full w-auto"
        height={96}
        loading={loading}
        fetchPriority={priority}
        src="/logo-farmer.png"
        width={62}
      />
      <span className="font-semibold text-lg tracking-tight whitespace-nowrap">Happy Farmers</span>
    </span>
  )
}
