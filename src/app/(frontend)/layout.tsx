import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { dmSans, playfairDisplay } from '@/fonts'
import React from 'react'

import { LocalBusinessSchema } from '@/components/LocalBusinessSchema'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

// Deliberately not async and free of dynamic APIs: awaiting draftMode() here
// opted every page into dynamic rendering, so nothing could be cached however
// its own revalidate was set. Keep it that way.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      className={cn(dmSans.variable, playfairDisplay.variable)}
      data-theme="light"
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        <LocalBusinessSchema />
      </head>
      <body>
        <Providers>
          <Header />
          {/* body is a min-height flex column, but nothing inside it grew, so a
              short page left the footer sitting mid-screen with empty
              background below it. This takes up the slack. */}
          <main className="flex-grow">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  title: {
    default: 'Happy Farmers | Healthy Soil. Healthy Harvest.',
    template: '%s | Happy Farmers',
  },
  description:
    'EU-certified organic vermicompost, vermiwash and coco peat made in Peradeniya, Sri Lanka. Better soil, better crops, better tomorrow.',
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
  },
}
