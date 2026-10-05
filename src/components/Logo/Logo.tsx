import clsx from 'clsx'
import Image from 'next/image'
import React from 'react'

interface Props {
  className?: string
}

export const Logo = ({ className }: Props) => {
  return (
    <span className={clsx('flex items-center gap-2.5 text-current', className)}>
      {/* White line art on transparency, for the dark header. */}
      <Image
        alt=""
        src="/logo-farmer.png"
        width={386}
        height={600}
        priority
        className="h-[50px] w-auto"
      />
      <span className="whitespace-nowrap font-serif text-[27px] font-bold tracking-tight">
        Happy Farmers
      </span>
    </span>
  )
}
