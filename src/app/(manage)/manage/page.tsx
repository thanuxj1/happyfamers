import Link from 'next/link'
import {
  Home,
  ListTree,
  MessageSquare,
  Navigation,
  Package,
  PanelBottom,
} from 'lucide-react'
import { getManagePayload } from '@/utilities/getManagePayload'

// Ordered by how often the site owner actually needs them: the home page and
// the two things that change weekly come first, structural settings last.
const CARDS = [
  { href: '/manage/home', label: 'Home page', description: 'Headline, photos and sections', icon: Home },
  { href: '/manage/products', label: 'Products', description: 'Add or update what you sell', icon: Package },
  { href: '/manage/messages', label: 'Messages', description: 'See what visitors have sent', icon: MessageSquare },
  // Label matches the sidebar — this used to say "Categories", which left the
  // same screen with two different names.
  { href: '/manage/categories', label: 'Topics', description: 'Topic tags for articles', icon: ListTree },
  { href: '/manage/site/header', label: 'Header', description: 'Top menu & button', icon: Navigation },
  { href: '/manage/site/footer', label: 'Footer', description: 'Bottom links & badges', icon: PanelBottom },
]

export default async function ManageDashboard() {
  const { payload } = await getManagePayload()

  // Counts are filtered to published documents. Counting drafts too made the
  // dashboard disagree with the lists underneath it.
  const published = { _status: { equals: 'published' } }
  const [products, messages] = await Promise.all([
    payload.count({ collection: 'products', where: published }),
    payload.count({ collection: 'form-submissions' }),
  ])

  const stats = [
    { label: 'Products', value: products.totalDocs, href: '/manage/products' },
    { label: 'Messages received', value: messages.totalDocs, href: '/manage/messages' },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary">Welcome back!</h1>
      <p className="mt-2 text-muted-foreground">Here&apos;s a quick look at your site.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-2xl border border-border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {stat.label}
            </p>
            <p className="mt-1 text-3xl font-bold">{stat.value}</p>
          </Link>
        ))}
      </div>

      <h2 className="mt-10 text-lg font-bold">What would you like to do?</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.href}
              href={card.href}
              className="flex items-start gap-3 rounded-2xl border border-border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon size={20} />
              </span>
              <span>
                <span className="block font-bold">{card.label}</span>
                <span className="block text-sm text-muted-foreground">{card.description}</span>
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
