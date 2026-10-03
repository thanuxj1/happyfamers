import type { Metadata } from 'next'
import { cn } from '@/utilities/ui'
import { dmSans, playfairDisplay } from '@/fonts'
import { InitTheme } from '@/providers/Theme/InitTheme'

import '../(frontend)/globals.css'

export const metadata: Metadata = {
  title: 'Sign in — Happy Farmers',
  robots: { index: false, follow: false },
}

// Its own root layout: the manager's layout redirects anyone without a session,
// so a sign-in page nested under it would redirect to itself.
export default function ManageAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn(dmSans.variable, playfairDisplay.variable)} suppressHydrationWarning>
      <head>
        <InitTheme />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">{children}</body>
    </html>
  )
}
