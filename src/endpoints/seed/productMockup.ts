import sharp from 'sharp'
import type { File } from 'payload'

// Simple, clean vector-style product package illustrations (bag / bottles / block)
// — not photographs. Stock photo search has no coverage for "Happy Farmers
// branded vermicompost bag", since that only exists as custom product
// photography, so these stand in for that until real product photos are
// available. Rendered on white so they behave like real product photography
// when composited with mix-blend-multiply on the product cards.

const W = 1200
const H = 1200

const wrap = (inner: string) => `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#ffffff"/>
  ${inner}
</svg>`

const toFile = async (svg: string, name: string): Promise<File> => {
  // Trimmed to the artwork's bounding box: the cards render these with
  // `object-contain`, so baked-in white margin would shrink the product to a
  // fraction of the slot it is given.
  const data = await sharp(Buffer.from(svg))
    .trim({ background: '#ffffff', threshold: 5 })
    .extend({ top: 8, bottom: 8, left: 8, right: 8, background: '#ffffff' })
    .png()
    .toBuffer()
  return { name: `${name}.png`, data, mimetype: 'image/png', size: data.byteLength }
}

const leafIcon = (x: number, y: number, scale: number, color: string) =>
  `<g transform="translate(${x},${y}) scale(${scale})">
    <path d="M0 20 C 2 4 18 -6 34 -2 C 30 14 14 24 0 20 Z" fill="${color}"/>
  </g>`

export const vermicompostBagMockup = async (): Promise<File> => {
  const cx = W / 2
  const bagTop = 220
  const bagBottom = 980
  const bagLeft = cx - 260
  const bagRight = cx + 260

  const svg = wrap(`
    <!-- soft shadow -->
    <ellipse cx="${cx}" cy="${bagBottom + 30}" rx="260" ry="30" fill="#000000" opacity="0.08"/>
    <!-- bag body -->
    <path d="M ${bagLeft + 20} ${bagTop + 60}
             C ${bagLeft - 10} ${bagTop + 300}, ${bagLeft - 10} ${bagBottom - 250}, ${bagLeft + 30} ${bagBottom}
             L ${bagRight - 30} ${bagBottom}
             C ${bagRight + 10} ${bagBottom - 250}, ${bagRight + 10} ${bagTop + 300}, ${bagRight - 20} ${bagTop + 60}
             Z" fill="#2d6032"/>
    <!-- top fold -->
    <path d="M ${bagLeft + 40} ${bagTop + 60} L ${bagRight - 40} ${bagTop + 60} L ${bagRight - 70} ${bagTop} L ${bagLeft + 70} ${bagTop} Z" fill="#235336"/>
    <rect x="${bagLeft + 60}" y="${bagTop - 20}" width="${bagRight - bagLeft - 120}" height="26" rx="6" fill="#163622"/>
    <!-- label -->
    <rect x="${cx - 190}" y="${bagTop + 140}" width="380" height="430" rx="16" fill="#f7f5ed"/>
    ${leafIcon(cx - 24, bagTop + 195, 1.6, '#3e8e41')}
    <text x="${cx}" y="${bagTop + 300}" font-family="Georgia, serif" font-size="30" font-weight="700" fill="#132c1c" text-anchor="middle">Happy Farmers</text>
    <line x1="${cx - 140}" y1="${bagTop + 330}" x2="${cx + 140}" y2="${bagTop + 330}" stroke="#c9c2a8" stroke-width="2"/>
    <text x="${cx}" y="${bagTop + 400}" font-family="sans-serif" font-size="44" font-weight="800" fill="#2d6032" text-anchor="middle" letter-spacing="2">VERMI</text>
    <text x="${cx}" y="${bagTop + 450}" font-family="sans-serif" font-size="44" font-weight="800" fill="#2d6032" text-anchor="middle" letter-spacing="2">COMPOST</text>
    <text x="${cx}" y="${bagTop + 510}" font-family="sans-serif" font-size="20" fill="#5b5b4f" text-anchor="middle">100% Organic &#8226; 5 kg</text>
  `)

  return toFile(svg, 'happy-farmers-vermicompost-mockup')
}

export const vermiwashBottleMockup = async (): Promise<File> => {
  const drawBottle = (cx: number, scale: number) => {
    const s = scale
    const top = 260 * s + 300
    const bodyTop = top + 60 * s
    const bodyBottom = 940 * s + 300
    const halfW = 130 * s

    return `
      <ellipse cx="${cx}" cy="${bodyBottom + 20}" rx="${halfW + 10}" ry="18" fill="#000000" opacity="0.08"/>
      <rect x="${cx - halfW * 0.35}" y="${top - 70 * s}" width="${halfW * 0.7}" height="${70 * s}" rx="8" fill="#2d6032"/>
      <path d="M ${cx - halfW * 0.55} ${top}
               L ${cx + halfW * 0.55} ${top}
               L ${cx + halfW} ${bodyTop + 40 * s}
               L ${cx + halfW} ${bodyBottom - 40 * s}
               Q ${cx + halfW} ${bodyBottom} ${cx + halfW - 30 * s} ${bodyBottom}
               L ${cx - halfW + 30 * s} ${bodyBottom}
               Q ${cx - halfW} ${bodyBottom} ${cx - halfW} ${bodyBottom - 40 * s}
               L ${cx - halfW} ${bodyTop + 40 * s}
               Z" fill="#eef3ea" stroke="#c7d3c0" stroke-width="3"/>
      <rect x="${cx - halfW * 0.95}" y="${bodyTop + 130 * s}" width="${halfW * 1.9}" height="${300 * s}" rx="10" fill="#3e8e41"/>
      <text x="${cx}" y="${bodyTop + 220 * s}" font-family="Georgia, serif" font-size="${24 * s}" font-weight="700" fill="#ffffff" text-anchor="middle">Happy Farmers</text>
      <text x="${cx}" y="${bodyTop + 295 * s}" font-family="sans-serif" font-size="${26 * s}" font-weight="800" fill="#ffffff" text-anchor="middle">VERMIWASH</text>
      <text x="${cx}" y="${bodyTop + 350 * s}" font-family="sans-serif" font-size="${15 * s}" fill="#eaf3e6" text-anchor="middle">Liquid Bio-Fertilizer</text>
    `
  }

  const svg = wrap(`${drawBottle(W / 2 - 190, 0.85)}${drawBottle(W / 2 + 190, 0.85)}`)
  return toFile(svg, 'happy-farmers-vermiwash-mockup')
}

export const cocoPeatBlockMockup = async (): Promise<File> => {
  const cx = W / 2
  const blockW = 620
  const blockH = 420
  const top = 380
  const left = cx - blockW / 2

  const svg = wrap(`
    <ellipse cx="${cx}" cy="${top + blockH + 40}" rx="340" ry="26" fill="#000000" opacity="0.08"/>
    <!-- 3D brick block -->
    <polygon points="${left},${top + 40} ${left + 60},${top} ${left + blockW + 60},${top} ${left + blockW},${top + 40}" fill="#6b4a2f"/>
    <rect x="${left}" y="${top + 40}" width="${blockW}" height="${blockH}" fill="#8a5a34"/>
    <polygon points="${left + blockW},${top + 40} ${left + blockW + 60},${top} ${left + blockW + 60},${top + blockH} ${left + blockW},${top + blockH + 40}" fill="#4f3620"/>
    <!-- twine wrap -->
    <rect x="${left}" y="${top + 40 + blockH * 0.35}" width="${blockW}" height="18" fill="#3f2a19" opacity="0.6"/>
    <rect x="${left}" y="${top + 40 + blockH * 0.7}" width="${blockW}" height="18" fill="#3f2a19" opacity="0.6"/>
    <!-- label -->
    <rect x="${left + blockW * 0.15}" y="${top + 40 + blockH * 0.32}" width="${blockW * 0.7}" height="${blockH * 0.42}" fill="#f7f5ed" opacity="0.95"/>
    <text x="${cx - 30}" y="${top + 40 + blockH * 0.32 + 60}" font-family="Georgia, serif" font-size="26" font-weight="700" fill="#132c1c" text-anchor="middle">Happy Farmers</text>
    <text x="${cx - 30}" y="${top + 40 + blockH * 0.32 + 105}" font-family="sans-serif" font-size="34" font-weight="800" fill="#6b4a2f" text-anchor="middle" letter-spacing="1">COCO PEAT</text>
    <text x="${cx - 30}" y="${top + 40 + blockH * 0.32 + 145}" font-family="sans-serif" font-size="18" fill="#5b5b4f" text-anchor="middle">Compressed Growing Medium</text>
  `)

  return toFile(svg, 'happy-farmers-coco-peat-mockup')
}
