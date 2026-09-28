import React from 'react'

/**
 * Replaces Payload's default nav icon (admin.components.graphics.Icon) —
 * the small mark shown in the collapsed sidebar / browser tab area.
 */
export const Icon: React.FC = () => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20 4C11 4 4 11 4 20c9 0 16-7 16-16Z" fill="#a3e635" fillOpacity="0.9" />
      <path d="M5 19C9 15 14 10 19 5" stroke="#a3e635" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  )
}

export default Icon
