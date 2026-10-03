'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { Leaf } from 'lucide-react'

const field = 'w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm'

function ResetForm() {
  const router = useRouter()
  const token = useSearchParams().get('token') || ''

  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setPending(true)

    const password = String(new FormData(event.currentTarget).get('password') || '')
    if (password.length < 8) {
      setError('The password needs to be at least 8 characters.')
      setPending(false)
      return
    }

    const res = await fetch('/api/users/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    }).catch(() => null)

    if (!res || !res.ok) {
      setError('That link has expired or has already been used. Please request a new one.')
      setPending(false)
      return
    }

    router.push('/manage')
    router.refresh()
  }

  if (!token) {
    return (
      <>
        <h1 className="text-lg font-semibold">This link is incomplete</h1>
        <p className="text-sm text-muted-foreground">Please open the link from your email again.</p>
        <Link href="/forgot-password" className="block text-sm text-primary hover:underline">
          Send a new link
        </Link>
      </>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h1 className="text-lg font-semibold">Choose a new password</h1>
        <p className="text-sm text-muted-foreground">At least 8 characters.</p>
      </div>
      <label className="block">
        <span className="mb-1 block text-sm font-medium">New password</span>
        <input name="password" type="password" required autoComplete="new-password" className={field} />
      </label>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
      >
        {pending ? 'Saving…' : 'Save and sign in'}
      </button>
    </form>
  )
}

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-5 rounded-2xl border border-border bg-white p-8 shadow-sm">
        <div className="flex items-center gap-2">
          <Leaf className="h-7 w-7 text-primary" />
          <span className="font-serif text-xl font-bold">Happy Farmers</span>
        </div>
        <Suspense>
          <ResetForm />
        </Suspense>
      </div>
    </main>
  )
}
