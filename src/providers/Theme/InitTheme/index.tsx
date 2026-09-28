import Script from 'next/script'
import React from 'react'

// The Happy Farmers brand (cream + green) is fixed and doesn't follow the
// visitor's OS light/dark preference — there's no in-UI theme toggle, so the
// theme is always 'light'.
export const InitTheme: React.FC = () => {
  return (
    // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
    <Script
      dangerouslySetInnerHTML={{
        __html: `document.documentElement.setAttribute('data-theme', 'light');`,
      }}
      id="theme-script"
      strategy="beforeInteractive"
    />
  )
}
