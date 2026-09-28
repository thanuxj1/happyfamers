import type { File } from 'payload'

// Finds and downloads a real, openly-licensed stock photo matching a topic,
// via the Openverse API (https://api.openverse.org) — a search engine over
// CC-licensed and public-domain images. This *searches* for real results
// rather than guessing image URLs, and only picks images whose license
// permits commercial reuse.
//
// Tries each query in `queries` (most-specific first) until one returns a
// decent-sized photo. These are still generic stock photos standing in for
// the client's own product/farm photography — swap them out once real
// photos are available.

const LICENSE_PRIORITY = ['cc0', 'pdm', 'by', 'by-sa', 'by-nd', 'by-nc', 'by-nc-sa', 'by-nc-nd']

type OpenverseResult = {
  url: string
  width: number
  height: number
  license: string
  title: string
}

const searchOpenverse = async (query: string): Promise<OpenverseResult | null> => {
  const params = new URLSearchParams({
    q: query,
    license_type: 'commercial',
    category: 'photograph',
    page_size: '10',
    mature: 'false',
  })

  const res = await fetch(`https://api.openverse.org/v1/images/?${params.toString()}`, {
    headers: { 'User-Agent': 'happy-farmers-site-seed/1.0' },
  })

  if (!res.ok) return null

  const json = (await res.json()) as { results?: OpenverseResult[] }
  const candidates = (json.results || []).filter((r) => r.width >= 800 && r.height >= 600 && r.url)

  if (candidates.length === 0) return null

  candidates.sort(
    (a, b) => LICENSE_PRIORITY.indexOf(a.license) - LICENSE_PRIORITY.indexOf(b.license),
  )

  return candidates[0]
}

export const openversePhoto = async ({
  queries,
  seed,
}: {
  queries: string[]
  seed: string
}): Promise<File> => {
  let picked: OpenverseResult | null = null

  for (const query of queries) {
    picked = await searchOpenverse(query)
    if (picked) break
  }

  if (!picked) {
    throw new Error(`No Openverse photo found for queries: ${queries.join(', ')}`)
  }

  const imageRes = await fetch(picked.url, {
    headers: { 'User-Agent': 'happy-farmers-site-seed/1.0' },
  })

  if (!imageRes.ok) {
    throw new Error(`Failed to download photo for "${seed}" from ${picked.url}: ${imageRes.status}`)
  }

  const data = Buffer.from(await imageRes.arrayBuffer())
  const ext = picked.url.split('.').pop()?.split('?')[0]?.toLowerCase() || 'jpg'
  const mimetype = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg'

  return {
    name: `${seed}.${ext}`,
    data,
    mimetype,
    size: data.byteLength,
  }
}
