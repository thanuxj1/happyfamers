import type { Metadata } from 'next'
import { cn } from '@/utilities/ui'
import { dmSans, playfairDisplay } from '@/fonts'
import { getMeUser } from '@/utilities/getMeUser'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { ManageSidebar } from './_components/ManageSidebar'

import '../../(frontend)/globals.css'

export const metadata: Metadata = {
  title: 'Happy Farmers Manager',
  robots: { index: false, follow: false },
}

export default async function ManageLayout({ children }: { children: React.ReactNode }) {
  const { user } = await getMeUser({ nullUserRedirect: '/admin/login?redirect=%2Fmanage' })

  return (
    <html lang="en" className={cn(dmSans.variable, playfairDisplay.variable)} suppressHydrationWarning>
      <head>
        <InitTheme />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <div className="flex min-h-screen flex-col lg:flex-row">
          <ManageSidebar userName={user?.name || user?.email || 'Account'} />
          <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-10">{children}</main>
        </div>
      </body>
    </html>
  )
}
