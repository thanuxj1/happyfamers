import React from 'react'

export const LeafMark: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    aria-hidden="true"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20.5 3.5c-9 0-14 4-14 9.5 0 2 .7 3.7 1.9 5C11 15.3 14.6 12.4 19 11c-3.6 2-6.8 4.6-9.4 8.2 1 .5 2.1.8 3.4.8 5 0 7.5-4.6 7.5-16.5Z"
      fill="currentColor"
    />
    <path d="M8.4 18 3.5 21.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
  </svg>
)

type Props = {
  children: React.ReactNode
  className?: string
  /** Thin horizontal rules flanking the title, as on the Process/Products columns. */
  rule?: 'both' | 'none'
  leaf?: 'before' | 'after' | 'none'
}

export const SectionHeading: React.FC<Props> = ({
  children,
  className = '',
  rule = 'none',
  leaf = 'after',
}) => {
  const line = <span className="h-px flex-1 bg-[#c9bf9f]" />
  return (
    <h2 className={`flex items-center gap-2.5 ${className}`}>
      {rule === 'both' && line}
      {leaf === 'before' && <LeafMark className="h-[18px] w-[18px] shrink-0 text-[#6fa93f]" />}
      {/* Only pinned against the flanking rules once there is room for one line. */}
      <span className="min-w-0 font-serif text-[20px] font-bold leading-tight text-[#1c3220] sm:shrink-0">
        {children}
      </span>
      {leaf === 'after' && <LeafMark className="h-[18px] w-[18px] shrink-0 text-[#6fa93f]" />}
      {rule === 'both' && line}
    </h2>
  )
}
