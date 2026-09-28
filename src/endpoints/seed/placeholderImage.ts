import sharp from 'sharp'
import type { File } from 'payload'

const escapeXml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Generates a simple on-brand placeholder image (no external network calls,
// no third-party stock photography) so seeded pages/products render with an
// image in place. Swap these out for real product/farm photography via the
// Media library once the client provides it.
//
// Uses a warm soil/olive gradient (not the site's own dark green) with a
// cream border so the placeholder is always clearly visible, whether it
// sits on the dark green hero/cards or the cream page background — a flat
// dark-green-on-dark-green placeholder used to nearly disappear there.
export const placeholderImage = async ({
  label,
  width = 1600,
  height = 1000,
}: {
  label: string
  width?: number
  height?: number
}): Promise<File> => {
  const badgeText = `Placeholder — replace with photo: ${label}`
  const badgeWidth = Math.min(width - 48, badgeText.length * 9 + 40)

  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#8a5a34"/>
        <stop offset="0.55" stop-color="#6b7a3a"/>
        <stop offset="1" stop-color="#3e6b3a"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <rect x="10" y="10" width="${width - 20}" height="${height - 20}" fill="none" stroke="#f7f5ed" stroke-opacity="0.85" stroke-width="4"/>
    <circle cx="${width / 2}" cy="${height / 2 - 30}" r="56" fill="#f7f5ed" fill-opacity="0.18"/>
    <path d="M ${width / 2 - 26} ${height / 2 - 8} Q ${width / 2} ${height / 2 - 70} ${width / 2 + 26} ${height / 2 - 8} Q ${width / 2} ${height / 2 + 14} ${width / 2 - 26} ${height / 2 - 8} Z" fill="#f7f5ed" fill-opacity="0.9"/>
    <rect x="24" y="${height - 24 - 48}" width="${badgeWidth}" height="48" rx="6" fill="#000000" fill-opacity="0.5"/>
    <text x="${24 + 16}" y="${height - 24 - 24}" fill="#ffffff" font-family="sans-serif" font-size="18" font-weight="500" dominant-baseline="middle">${escapeXml(
      badgeText,
    )}</text>
  </svg>`

  const data = await sharp(Buffer.from(svg)).png().toBuffer()

  return {
    name: `${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`,
    data,
    mimetype: 'image/png',
    size: data.byteLength,
  }
}
