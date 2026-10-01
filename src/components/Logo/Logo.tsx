import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
}

export const Logo = ({ className }: Props) => {
  return (
    <span className={clsx('flex items-center gap-2.5 text-current', className)}>
      <svg
        aria-hidden="true"
        className="h-[34px] w-[34px] shrink-0 text-[#7cb342]"
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20.5 3.5c-9 0-14 4-14 9.5 0 2 .7 3.7 1.9 5C11 15.3 14.6 12.4 19 11c-3.6 2-6.8 4.6-9.4 8.2 1 .5 2.1.8 3.4.8 5 0 7.5-4.6 7.5-16.5Z"
          fill="currentColor"
        />
        <path d="M8.4 18 3.5 21.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      </svg>
      <span className="whitespace-nowrap font-serif text-[27px] font-bold tracking-tight">
        Happy Farmers
      </span>
    </span>
  )
}
