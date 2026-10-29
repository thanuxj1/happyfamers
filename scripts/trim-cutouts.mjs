/**
 * Trims each product cut-out to its own artwork.
 *
 *   node scripts/trim-cutouts.mjs
 *
 * The supplied cut-outs sit on canvases of different sizes with different
 * amounts of empty space around them — Vermiwash alone carries 222px of
 * transparent padding on each side, which is why it rendered noticeably
 * smaller than its neighbours in a row of equally sized cards. Cropping each
 * one to its content means `object-fit: contain` gives all three the same
 * apparent size while keeping their real proportions.
 *
 * sharp's own trim() is not used here: it compares colour, and these PNGs keep
 * image data underneath their transparent pixels, so it crops the wrong box.
 */
import sharp from 'sharp'
import path from 'path'

const DIR = 'public/products'
const NAMES = ['vermicompost', 'vermiwash', 'coco-peat']
const ALPHA_FLOOR = 12 // ignore the faintest anti-aliasing when finding the edge

for (const name of NAMES) {
  const src = path.join(DIR, `${name}-cutout.png`)
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width: W, height: H } = info

  let x0 = W, y0 = H, x1 = -1, y1 = -1
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (data[(y * W + x) * 4 + 3] <= ALPHA_FLOOR) continue
      if (x < x0) x0 = x
      if (x > x1) x1 = x
      if (y < y0) y0 = y
      if (y > y1) y1 = y
    }
  }

  if (x1 < 0) {
    console.log(`RESULT ${name}: fully transparent, skipped`)
    continue
  }

  // Capped at 900px tall and written as a palette PNG. The supplied cut-outs
  // are 1.2-1.7MB, which is far more than a 126px-tall card needs, and the
  // image optimiser was slow enough on a cold cache that two of the three
  // products rendered as broken images on first load. This is ~75% smaller
  // and indistinguishable at the sizes the site actually uses.
  const dest = path.join(DIR, `${name}.png`)
  await sharp(src)
    .extract({ left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 })
    .resize({ height: 900, withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: true, quality: 90, effort: 9 })
    .toFile(dest)

  const meta = await sharp(dest).metadata()
  console.log(`RESULT ${name}: ${W}x${H} -> ${meta.width}x${meta.height}`)
}
