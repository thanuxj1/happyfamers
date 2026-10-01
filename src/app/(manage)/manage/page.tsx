import Link from 'next/link'
import { Package, ListTree, MessageSquare, Navigation, PanelBottom } from 'lucide-react'
import { getManagePayload } from '@/utilities/getManagePayload'

const CARDS = [
  { href: '/manage/products', label: 'Products', description: 'Add or update what you sell', icon: Package },
  { href: '/manage/categories', label: 'Categories', description: 'Topic tags for articles', icon: ListTree },
  { href: '/manage/messages', label: 'Messages', description: 'See what visitors have sent', icon: MessageSquare },
  { href: '/manage/site/header', label: 'Header', description: 'Top menu & button', icon: Navigation },
  { href: '/manage/site/footer', label: 'Footer', description: 'Bottom links & badges', icon: PanelBottom },
]

export default async function ManageDashboard() {
  const { payload } = await getManagePayload()
  const [products, messages] = await Promise.all([
    payload.count({ collection: 'products' }),
    payload.count({ collection: 'form-submissions' }),
  ])

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary">Welcome back!</h1>
      <p className="mt-2 text-muted-foreground">Here&apos;s a quick look at your site.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Products</p>
          <p className="mt-1 text-3xl font-bold">{products.totalDocs}</p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Messages received</p>
          <p className="mt-1 text-3xl font-bold">{messages.totalDocs}</p>
        </div>
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
