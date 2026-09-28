import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import type { File } from 'payload'

const dirname = path.dirname(fileURLToPath(import.meta.url))

// Loads a real photo the client supplied directly (saved under ./assets) —
// as opposed to `openversePhoto`/`productMockup`, which stand in only until
// real photos arrive. Once a slot has a file here, it's a permanent project
// asset and survives reseeds.
export const localAsset = (filename: string): File => {
  const filePath = path.join(dirname, 'assets', filename)
  const data = fs.readFileSync(filePath)
  const ext = filename.split('.').pop()?.toLowerCase() || 'jpg'
  const mimetype =
    ext === 'png'
      ? 'image/png'
      : ext === 'webp'
        ? 'image/webp'
        : ext === 'jpg' || ext === 'jpeg'
          ? 'image/jpeg'
          : 'application/octet-stream'

  return {
    name: filename,
    data,
    mimetype,
    size: data.byteLength,
  }
}
