import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { getServerSideURL } from '@/utilities/getURL'

// Clearing the session cookie is the whole of signing out here; Payload reads
// that cookie on every request, so removing it ends the session.
export async function GET() {
  const store = await cookies()
  store.delete('payload-token')

  return NextResponse.redirect(new URL('/login', getServerSideURL()))
}
