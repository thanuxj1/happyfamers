'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Leaf } from 'lucide-react'

const field = 'w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm'

export default function ForgotPasswordPage() {
  const [pending, setPending] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)

    const form = new FormData(event.currentTarget)
    await fetch('/api/users/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.get('email') }),
    }).catch(() => {})

    // Always reports success: saying whether an address exists would let anyone
    // check who has an account here.
    setSent(true)
    setPending(false)
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-5 rounded-2xl border border-border bg-white p-8 shadow-sm">
        <div className="flex items-center gap-2">
          <Leaf className="h-7 w-7 text-primary" />
          <span className="font-serif text-xl font-bold">Happy Farmers</span>
        </div>

        {sent ? (
          <>
            <h1 className="text-lg font-semibold">Check your email</h1>
            <p className="text-sm text-muted-foreground">
              If that address has an account, a link to choose a new password is on its way.
            </p>
            <p className="text-sm text-muted-foreground">
              Nothing arriving? Ask someone else who can sign in to set a new password for you from
              the People screen.
            </p>
            <Link href="/login" className="block text-sm text-primary hover:underline">
              Back to sign in
            </Link>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <h1 className="text-lg font-semibold">Forgot your password?</h1>
              <p className="text-sm text-muted-foreground">We will email you a link to set a new one.</p>
            </div>
            <label className="block">
              <span className="mb-1 block text-sm font-medium">Email</span>
              <input name="email" type="email" required autoComplete="username" className={field} />
            </label>
            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
            >
              {pending ? 'Sending…' : 'Send the link'}
            </button>
            <Link href="/login" className="block text-center text-sm text-muted-foreground hover:underline">
              Back to sign in
            </Link>
          </form>
        )}
      </div>
    </main>
  )
}
