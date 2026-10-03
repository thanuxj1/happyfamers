'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { Leaf } from 'lucide-react'

const field = 'w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm'

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const redirectTo = params.get('redirect') || '/manage'

  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setPending(true)

    const form = new FormData(event.currentTarget)

    try {
      // Payload's login endpoint sets the session cookie on a successful reply.
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.get('email'), password: form.get('password') }),
      })

      if (!res.ok) {
        setError('That email and password do not match an account.')
        setPending(false)
        return
      }

      router.push(redirectTo)
      router.refresh()
    } catch {
      setError('Could not reach the server. Please try again.')
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5 rounded-2xl border border-border bg-white p-8 shadow-sm">
      <div className="flex items-center gap-2">
        <Leaf className="h-7 w-7 text-primary" />
        <span className="font-serif text-xl font-bold">Happy Farmers</span>
      </div>

      <div>
        <h1 className="text-lg font-semibold">Sign in</h1>
        <p className="text-sm text-muted-foreground">to manage your website</p>
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">Email</span>
        <input name="email" type="email" required autoComplete="username" className={field} />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">Password</span>
        <input name="password" type="password" required autoComplete="current-password" className={field} />
      </label>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
      >
        {pending ? 'Signing in…' : 'Sign in'}
      </button>

      <Link href="/forgot-password" className="block text-center text-sm text-muted-foreground hover:underline">
        Forgot your password?
      </Link>
    </form>
  )
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  )
}
