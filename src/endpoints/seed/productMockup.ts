import sharp from 'sharp'
import type { File } from 'payload'

// Vector packshots for the three products, drawn from the approved design.
// They are vector so they stay sharp at any size: the photographic versions
// were cropped out of a design mockup at roughly 180px and went soft as soon as
// they were shown larger than a card.
//
// Rendered on transparency so the same file works on the cream product cards
// and anywhere else. Replace these with real product photography when it
// exists — these are a stand-in, not a substitute.

const W = 1600
const H = 1200
const SCALE = W / 1200

/** Deterministic, so regenerating produces identical artwork. */
function rng(seed: number) {
  let s = seed
  return () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296)
}

const leaf = (x: number, y: number, s: number, fill: string) =>
  `<g transform="translate(${x},${y}) scale(${s})"><path d="M0 18 C 2 4 16 -6 31 -2 C 27 13 13 22 0 18 Z" fill="${fill}"/><path d="M7 16 L-3 23" stroke="${fill}" stroke-width="2.4" stroke-linecap="round"/></g>`

const moundPath = (cx: number, baseY: number, w: number, h: number) => {
  const half = w / 2
  return `M ${cx - half} ${baseY} C ${cx - half * 0.86} ${baseY - h * 0.5}, ${cx - half * 0.5} ${baseY - h * 0.93}, ${cx - half * 0.08} ${baseY - h} C ${cx + half * 0.36} ${baseY - h * 0.95}, ${cx + half * 0.78} ${baseY - h * 0.52}, ${cx + half} ${baseY} Z`
}

const moundDefs = (
  seed: number,
  from: string,
  to: string,
  cx: number,
  baseY: number,
  w: number,
  h: number,
) =>
  `<linearGradient id="g${seed}" x1="0.1" y1="0" x2="0.7" y2="1"><stop offset="0%" stop-color="${from}"/><stop offset="100%" stop-color="${to}"/></linearGradient><clipPath id="c${seed}"><path d="${moundPath(cx, baseY, w, h)}"/></clipPath>`

/** A heap of compost or coir: silhouette plus scattered grains for texture. */
function mound({
  cx,
  baseY,
  w,
  h,
  seed,
  tones,
  count = 1600,
}: {
  cx: number
  baseY: number
  w: number
  h: number
  seed: number
  tones: string[]
  count?: number
}) {
  const r = rng(seed)
  const half = w / 2
  let grains = ''

  for (let i = 0; i < count; i++) {
    const x = cx - half + r() * w
    const nx = Math.abs(x - (cx - half * 0.08)) / half
    const limit = h * (1 - Math.pow(Math.min(nx, 1), 1.8))
    if (limit <= 2) continue
    const y = baseY - r() * limit
    const rad = 1.6 + r() * 4.6
    grains += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${rad.toFixed(1)}" ry="${(rad * 0.75).toFixed(1)}" fill="${tones[Math.floor(r() * tones.length)]}" opacity="${(0.4 + r() * 0.6).toFixed(2)}"/>`
  }

  return `<ellipse cx="${cx}" cy="${baseY + 4}" rx="${half * 1.04}" ry="${h * 0.1}" fill="#00000020"/><path d="${moundPath(cx, baseY, w, h)}" fill="url(#g${seed})"/><g clip-path="url(#c${seed})">${grains}</g>`
}

const wrap = (inner: string) =>
  `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg"><g transform="scale(${SCALE})">${inner}</g></svg>`

const toFile = async (svg: string, name: string): Promise<File> => {
  const data = await sharp(Buffer.from(svg))
    .trim({ threshold: 1 })
    .extend({ top: 24, bottom: 24, left: 24, right: 24, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer()

  return { name: `${name}.png`, data, mimetype: 'image/png', size: data.byteLength }
}

export const vermicompostBagMockup = async (): Promise<File> => {
  const x = 120
  const y = 130
  const bw = 420
  const bh = 580

  return toFile(
    wrap(`<defs>
      <linearGradient id="top" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#1b4122"/><stop offset="42%" stop-color="#306e36"/><stop offset="100%" stop-color="#17381d"/></linearGradient>
      <linearGradient id="body" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#e3e1d6"/><stop offset="40%" stop-color="#fdfcf8"/><stop offset="100%" stop-color="#d8d4c7"/></linearGradient>
      <linearGradient id="foot" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#4a8a30"/><stop offset="50%" stop-color="#6cb33f"/><stop offset="100%" stop-color="#3f7228"/></linearGradient>
      ${moundDefs(11, '#7a5230', '#2b1a0c', 790, 742, 560, 236)}
    </defs>
    <ellipse cx="${x + bw / 2}" cy="${y + bh + 10}" rx="${bw * 0.48}" ry="22" fill="#00000020"/>
    <path d="M ${x + 24} ${y} C ${x - 12} ${y + 185}, ${x - 4} ${y + 405}, ${x + 32} ${y + bh} L ${x + bw - 32} ${y + bh} C ${x + bw + 6} ${y + 405}, ${x + bw + 14} ${y + 185}, ${x + bw - 24} ${y} Z" fill="url(#body)"/>
    <path d="M ${x + 24} ${y} C ${x - 8} ${y + 125}, ${x - 2} ${y + 195}, ${x + 3} ${y + 252} L ${x + bw - 3} ${y + 252} C ${x + bw + 2} ${y + 195}, ${x + bw + 8} ${y + 125}, ${x + bw - 24} ${y} Z" fill="url(#top)"/>
    <rect x="${x + 42}" y="${y - 24}" width="${bw - 84}" height="32" rx="8" fill="#132d18"/>
    <path d="M ${x + 30} ${y + 40} C ${x + 36} ${y + 200}, ${x + 34} ${y + 420}, ${x + 40} ${y + bh - 20}" stroke="#ffffff" stroke-opacity="0.09" stroke-width="22" fill="none"/>
    ${leaf(x + 86, y + 70, 1.4, '#8fd14f')}
    <text x="${x + 138}" y="${y + 100}" font-family="Georgia, serif" font-size="52" font-weight="700" fill="#fff">Happy</text>
    <text x="${x + 138}" y="${y + 158}" font-family="Georgia, serif" font-size="52" font-weight="700" fill="#fff">Farmers</text>
    <text x="${x + bw / 2}" y="${y + 338}" font-family="Helvetica, Arial, sans-serif" font-size="44" font-weight="700" fill="#24552a" text-anchor="middle" letter-spacing="1.5">VERMICOMPOST</text>
    <line x1="${x + 68}" y1="${y + 364}" x2="${x + bw - 68}" y2="${y + 364}" stroke="#c3c5b4" stroke-width="2"/>
    <text x="${x + bw / 2}" y="${y + 396}" font-family="Helvetica, Arial, sans-serif" font-size="20" fill="#6d7163" text-anchor="middle">100% Organic Soil Conditioner</text>
    <text x="${x + bw / 2}" y="${y + 424}" font-family="Helvetica, Arial, sans-serif" font-size="18" fill="#8b8f80" text-anchor="middle">Earthworm processed &#183; Odour free</text>
    <path d="M ${x + 32} ${y + bh} L ${x + bw - 32} ${y + bh} L ${x + bw - 36} ${y + bh - 74} L ${x + 36} ${y + bh - 74} Z" fill="url(#foot)"/>
    ${leaf(x + 72, y + bh - 56, 1.0, '#eaf7dc')}
    <text x="${x + bw - 72}" y="${y + bh - 28}" font-family="Helvetica, Arial, sans-serif" font-size="23" font-weight="700" fill="#fff" text-anchor="end">5 kg</text>
    ${mound({ cx: 790, baseY: 742, w: 560, h: 236, seed: 11, tones: ['#3c2414', '#54331c', '#6b4426', '#28170b', '#80572f'] })}`),
    'happy-farmers-vermicompost',
  )
}

/** One can: body, neck and cap on the left shoulder, closed loop handle right. */
const jerrycan = (x: number, y: number, w: number, h: number, grad: string, edge: string) => {
  const bodyY = y + 54
  const bodyH = h - 54

  return `
    <ellipse cx="${x + w / 2}" cy="${y + h + 8}" rx="${w * 0.45}" ry="15" fill="#00000020"/>
    <rect x="${x + w * 0.55}" y="${y + 8}" width="${w * 0.4}" height="78" rx="22" fill="none" stroke="${edge}" stroke-width="20"/>
    <rect x="${x + w * 0.55}" y="${y + 8}" width="${w * 0.4}" height="78" rx="22" fill="none" stroke="url(#${grad})" stroke-width="15"/>
    <rect x="${x + w * 0.17}" y="${y + 16}" width="${w * 0.2}" height="46" rx="5" fill="${edge}"/>
    <rect x="${x + w * 0.155}" y="${y}" width="${w * 0.23}" height="26" rx="8" fill="url(#${grad})"/>
    <rect x="${x + w * 0.155}" y="${y}" width="${w * 0.23}" height="26" rx="8" fill="none" stroke="${edge}" stroke-width="1.5"/>
    <path d="M ${x + 12} ${bodyY + 34} a 34 34 0 0 1 34 -34 h ${w - 92} a 34 34 0 0 1 34 34 v ${bodyH - 68} a 30 30 0 0 1 -30 30 h ${-(w - 84)} a 30 30 0 0 1 -30 -30 Z" fill="url(#${grad})"/>
    <rect x="${x + w * 0.1}" y="${bodyY + 12}" width="${w * 0.1}" height="${bodyH - 50}" rx="10" fill="#ffffff" opacity="0.5"/>
    <rect x="${x + w * 0.82}" y="${bodyY + 14}" width="${w * 0.07}" height="${bodyH - 54}" rx="8" fill="#000000" opacity="0.06"/>
    <rect x="${x + w * 0.1}" y="${bodyY + bodyH * 0.24}" width="${w * 0.8}" height="${bodyH * 0.46}" rx="6" fill="#235c2b"/>
    <rect x="${x + w * 0.1}" y="${bodyY + bodyH * 0.24}" width="${w * 0.8}" height="${bodyH * 0.13}" fill="#19451f"/>
    ${leaf(x + w * 0.17, y + 54 + bodyH * 0.265, 0.58, '#9ada5c')}
    <text x="${x + w * 0.56}" y="${bodyY + bodyH * 0.325}" font-family="Georgia, serif" font-size="20" font-weight="700" fill="#fff" text-anchor="middle">Happy Farmers</text>
    <text x="${x + w * 0.5}" y="${bodyY + bodyH * 0.465}" font-family="Helvetica, Arial, sans-serif" font-size="26" font-weight="700" fill="#fff" text-anchor="middle" letter-spacing="1">VERMIWASH</text>
    <text x="${x + w * 0.5}" y="${bodyY + bodyH * 0.53}" font-family="Helvetica, Arial, sans-serif" font-size="14" fill="#cfe8c2" text-anchor="middle">Liquid Bio-Fertilizer</text>
    <rect x="${x + w * 0.17}" y="${bodyY + bodyH * 0.57}" width="${w * 0.66}" height="${bodyH * 0.1}" rx="5" fill="#f3efe4"/>
    <text x="${x + w * 0.5}" y="${bodyY + bodyH * 0.638}" font-family="Helvetica, Arial, sans-serif" font-size="14" fill="#4a6b3c" text-anchor="middle">5 Litres &#183; 100% Organic</text>`
}

export const vermiwashBottleMockup = async (): Promise<File> =>
  toFile(
    wrap(`<defs>
      <linearGradient id="cA" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#c6c6bf"/><stop offset="30%" stop-color="#fbfbf8"/><stop offset="100%" stop-color="#bababc"/></linearGradient>
      <linearGradient id="cB" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#bcbcb5"/><stop offset="30%" stop-color="#f4f4f0"/><stop offset="100%" stop-color="#acaca4"/></linearGradient>
    </defs>
    ${jerrycan(250, 250, 320, 450, 'cB', '#b9b9b1')}
    ${jerrycan(580, 200, 350, 500, 'cA', '#c6c6be')}`),
    'happy-farmers-vermiwash',
  )

export const cocoPeatBlockMockup = async (): Promise<File> => {
  const bx = 150
  const by = 250
  const bw = 470
  const bh = 310
  const dep = 105
  const r = rng(404)

  let fibres = ''
  for (let i = 0; i < 520; i++) {
    const x = bx + r() * bw
    const y = by + r() * bh
    const len = 6 + r() * 26
    const ang = (r() - 0.5) * 0.9
    fibres += `<line x1="${x.toFixed(0)}" y1="${y.toFixed(0)}" x2="${(x + len * Math.cos(ang)).toFixed(0)}" y2="${(y + len * Math.sin(ang) * 0.5).toFixed(0)}" stroke="${['#5c3718', '#b5814f', '#7d5230', '#9c6a3c'][Math.floor(r() * 4)]}" stroke-width="${(0.9 + r() * 1.9).toFixed(1)}" opacity="${(0.3 + r() * 0.5).toFixed(2)}"/>`
  }

  let topFibres = ''
  for (let i = 0; i < 180; i++) {
    const t = r()
    const u = r()
    const x = bx + dep * t + u * bw
    const y = by - dep * 0.6 * t + (1 - t) * 4
    topFibres += `<line x1="${x.toFixed(0)}" y1="${y.toFixed(0)}" x2="${(x + 8 + r() * 14).toFixed(0)}" y2="${(y + 2).toFixed(0)}" stroke="${['#c08a55', '#8a5a33', '#a97646'][Math.floor(r() * 3)]}" stroke-width="1.2" opacity="0.45"/>`
  }

  return toFile(
    wrap(`<defs>
      <linearGradient id="front" x1="0" y1="0" x2="1" y2="0.3"><stop offset="0%" stop-color="#7d4f2b"/><stop offset="45%" stop-color="#9d6a3e"/><stop offset="100%" stop-color="#6d4424"/></linearGradient>
      <linearGradient id="topF" x1="0" y1="0" x2="0.6" y2="1"><stop offset="0%" stop-color="#bb8451"/><stop offset="100%" stop-color="#8d5e38"/></linearGradient>
      ${moundDefs(21, '#9c6a3c', '#46290f', 880, 700, 400, 180)}
    </defs>
    <ellipse cx="${bx + bw / 2 + 40}" cy="${by + bh + 12}" rx="${bw * 0.52}" ry="20" fill="#00000022"/>
    <polygon points="${bx},${by} ${bx + dep},${by - dep * 0.6} ${bx + bw + dep},${by - dep * 0.6} ${bx + bw},${by}" fill="url(#topF)"/>
    ${topFibres}
    <polygon points="${bx + bw},${by} ${bx + bw + dep},${by - dep * 0.6} ${bx + bw + dep},${by + bh - dep * 0.6} ${bx + bw},${by + bh}" fill="#5a381d"/>
    <rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="url(#front)"/>
    ${fibres}
    <rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="none" stroke="#4e2f16" stroke-width="2" opacity="0.5"/>
    <rect x="${bx + bw * 0.27}" y="${by + bh * 0.15}" width="${bw * 0.46}" height="${bh * 0.64}" rx="3" fill="#efe3cb"/>
    <rect x="${bx + bw * 0.27}" y="${by + bh * 0.15}" width="${bw * 0.46}" height="${bh * 0.64}" rx="3" fill="none" stroke="#c2ab87" stroke-width="2"/>
    ${leaf(bx + bw * 0.425, by + bh * 0.225, 0.58, '#5f8a3a')}
    <text x="${bx + bw * 0.5}" y="${by + bh * 0.33}" font-family="Georgia, serif" font-size="18" font-weight="700" fill="#4a3f2c" text-anchor="middle">Happy Farmers</text>
    <text x="${bx + bw * 0.5}" y="${by + bh * 0.46}" font-family="Helvetica, Arial, sans-serif" font-size="33" font-weight="700" fill="#6b4426" text-anchor="middle" letter-spacing="1.5">COCO PEAT</text>
    <line x1="${bx + bw * 0.32}" y1="${by + bh * 0.51}" x2="${bx + bw * 0.68}" y2="${by + bh * 0.51}" stroke="#c2ab87" stroke-width="1.6"/>
    <text x="${bx + bw * 0.5}" y="${by + bh * 0.59}" font-family="Helvetica, Arial, sans-serif" font-size="14" fill="#7a6a4e" text-anchor="middle">Compressed Growing Medium</text>
    <text x="${bx + bw * 0.5}" y="${by + bh * 0.67}" font-family="Helvetica, Arial, sans-serif" font-size="13" fill="#8d7d60" text-anchor="middle">5 kg &#183; Low EC &#183; pH neutral</text>
    ${mound({ cx: 880, baseY: 700, w: 400, h: 180, seed: 21, tones: ['#5e3a1d', '#8a5a33', '#a97646', '#43280f', '#6b4426'], count: 1100 })}`),
    'happy-farmers-coco-peat',
  )
}
