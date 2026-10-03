'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  FileText,
  Home,
  LayoutDashboard,
  ListTree,
  LogOut,
  Menu,
  MessageSquare,
  Navigation,
  Package,
  Users,
  PanelBottom,
  X,
} from 'lucide-react'

const LINKS = [
  { href: '/manage', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/manage/home', label: 'Home page', icon: Home },
  { href: '/manage/products', label: 'Products', icon: Package },
  { href: '/manage/resources', label: 'Resources', icon: FileText },
  { href: '/manage/messages', label: 'Messages', icon: MessageSquare },
]

const SITE_LINKS = [
  { href: '/manage/pages', label: 'Pages', icon: FileText },
  { href: '/manage/categories', label: 'Topics', icon: ListTree },
  { href: '/manage/site/header', label: 'Header', icon: Navigation },
  { href: '/manage/site/footer', label: 'Footer', icon: PanelBottom },
  { href: '/manage/people', label: 'People', icon: Users },
  { href: '/manage/site/pages', label: 'Products & Resources pages', icon: ListTree },
]

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  function isActive(href: string) {
    return pathname === href || (href !== '/manage' && pathname.startsWith(href))
  }

  return (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
      {LINKS.map((link) => {
        const Icon = link.icon
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
              isActive(link.href) ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-secondary'
            }`}
          >
            <Icon size={16} />
            {link.label}
          </Link>
        )
      })}

      <p className="mb-1 mt-5 px-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">Site Settings</p>
      {SITE_LINKS.map((link) => {
        const Icon = link.icon
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
              isActive(link.href) ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-secondary'
            }`}
          >
            <Icon size={16} />
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}

export function ManageSidebar({ userName }: { userName: string }) {
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-border bg-white p-4 lg:hidden">
        <Link href="/manage" className="flex items-center gap-2">
          <span className="text-lg">🌱</span>
          <span className="font-bold">Happy Farmers</span>
        </Link>
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-primary"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white p-5 lg:hidden">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-bold">
                <span className="text-lg">🌱</span> Happy Farmers
              </span>
              <button type="button" onClick={() => setDrawerOpen(false)} aria-label="Close menu">
                <X size={20} />
              </button>
            </div>
            <p className="mt-1 text-xs text-zinc-500">Site manager</p>
            <div className="mt-6 flex-1 overflow-y-auto">
              <NavLinks pathname={pathname} onNavigate={() => setDrawerOpen(false)} />
            </div>
            <div className="border-t border-border pt-4 text-xs">
              <p className="truncate text-muted-foreground">{userName}</p>
              <a href="/logout" className="mt-2 flex items-center gap-2 text-sm font-medium text-destructive hover:underline">
                <LogOut size={14} /> Log out
              </a>
            </div>
          </aside>
        </>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-white p-5 lg:flex">
        <Link href="/manage" className="flex items-center gap-2">
          <span className="text-xl">🌱</span>
          <span className="text-lg font-bold">Happy Farmers</span>
        </Link>
        <p className="mt-1 text-xs text-muted-foreground">Site manager</p>

        <div className="mt-8 flex flex-1 flex-col overflow-y-auto">
          <NavLinks pathname={pathname} />
        </div>

        <div className="border-t border-border pt-4 text-xs">
          <p className="truncate text-muted-foreground">{userName}</p>
          <a href="/logout" className="mt-2 flex items-center gap-2 text-sm font-medium text-destructive hover:underline">
            <LogOut size={14} /> Log out
          </a>
        </div>
      </aside>
    </>
  )
}
