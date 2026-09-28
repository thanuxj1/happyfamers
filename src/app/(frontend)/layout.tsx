import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { dmSans, playfairDisplay } from '@/fonts'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { LocalBusinessSchema } from '@/components/LocalBusinessSchema'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html
      className={cn(dmSans.variable, playfairDisplay.variable)}
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
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <Header />
          {children}
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
    'EU-certified organic vermicompost, vermiwash and coco peat manufactured in Karnataka, India. Better soil, better crops, better tomorrow.',
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
  },
}
