/**
 * The social networks the site can link to, and how a value typed in the
 * manager becomes a link. No server imports here: the manager's form uses this
 * in the browser.
 */
export const SOCIAL_NETWORKS = [
  { key: 'facebook', label: 'Facebook', example: 'https://facebook.com/yourpage' },
  { key: 'instagram', label: 'Instagram', example: 'https://instagram.com/yourname' },
  { key: 'whatsapp', label: 'WhatsApp', example: '+94 70 6 235 245' },
  { key: 'linkedin', label: 'LinkedIn', example: 'https://linkedin.com/company/yourname' },
  { key: 'x', label: 'X', example: 'https://x.com/yourname' },
  { key: 'youtube', label: 'YouTube', example: 'https://youtube.com/@yourname' },
  { key: 'pinterest', label: 'Pinterest', example: 'https://pinterest.com/yourname' },
] as const

export type SocialKey = (typeof SOCIAL_NETWORKS)[number]['key']

/**
 * The link for a typed value, or null if it can't be one.
 *
 * WhatsApp also takes a plain phone number. Only http(s) links pass, since
 * whatever is saved here ends up in an `href` on every page.
 */
export function socialHref(key: SocialKey, raw: string | null | undefined): string | null {
  const value = raw?.trim()
  if (!value) return null

  if (key === 'whatsapp' && /^[+\d\s().-]+$/.test(value)) {
    const digits = value.replace(/\D/g, '')
    return digits.length >= 8 ? `https://wa.me/${digits}` : null
  }

  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(value) ? value : `https://${value}`
  try {
    const url = new URL(withScheme)
    return (url.protocol === 'https:' || url.protocol === 'http:') && url.hostname.includes('.')
      ? url.href
      : null
  } catch {
    return null
  }
}
