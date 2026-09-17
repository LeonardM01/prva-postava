import { Resvg } from '@resvg/resvg-js'
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'

// Regenerates the committed icon files in `public/` from the vector sources in `scripts/icons/`.
// Run with `bun run generate-icons` after editing a source.

const ICON_SOURCES_DIR = new URL('icons/', import.meta.url)
const PUBLIC_DIR = new URL('../public/', import.meta.url)

async function rasterise(source: string, size: number) {
  const svg = await readFile(new URL(source, ICON_SOURCES_DIR), 'utf8')
  return new Resvg(svg, { fitTo: { mode: 'width', value: size } }).render().asPng()
}

interface IcoFrame {
  readonly png: Buffer
  readonly size: number
}

// Every browser that reads ICO files accepts PNG-encoded frames, so packing is just a directory
// header, one 16-byte entry per frame, then the PNG bytes.
function packIco(frames: readonly IcoFrame[]) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(frames.length, 4)

  let offset = header.length + frames.length * 16
  const entries = frames.map(({ png, size }) => {
    const entry = Buffer.alloc(16)
    entry.writeUInt8(size, 0)
    entry.writeUInt8(size, 1)
    entry.writeUInt16LE(1, 4)
    entry.writeUInt16LE(32, 6)
    entry.writeUInt32LE(png.length, 8)
    entry.writeUInt32LE(offset, 12)
    offset += png.length
    return entry
  })

  return Buffer.concat([header, ...entries, ...frames.map(({ png }) => png)])
}

await mkdir(PUBLIC_DIR, { recursive: true })
await copyFile(new URL('favicon.svg', ICON_SOURCES_DIR), new URL('favicon.svg', PUBLIC_DIR))
await writeFile(new URL('favicon-96.png', PUBLIC_DIR), await rasterise('favicon.svg', 96))
await writeFile(
  new URL('favicon.ico', PUBLIC_DIR),
  packIco([
    // 16 px uses its own drawing: 2 px dots on whole pixels stay crisp where a scaled one blurs.
    { size: 16, png: await rasterise('favicon-16.svg', 16) },
    { size: 32, png: await rasterise('favicon.svg', 32) },
    { size: 48, png: await rasterise('favicon.svg', 48) },
  ]),
)

// The app icon is full bleed, so iOS and Android launchers apply their own mask. Its 71% scale
// keeps every dot inside the maskable safe zone, so the maskable file is the same artwork.
await writeFile(new URL('apple-touch-icon.png', PUBLIC_DIR), await rasterise('app-icon.svg', 180))
await writeFile(new URL('icon-192.png', PUBLIC_DIR), await rasterise('app-icon.svg', 192))
const appIcon512 = await rasterise('app-icon.svg', 512)
await writeFile(new URL('icon-512.png', PUBLIC_DIR), appIcon512)
await writeFile(new URL('icon-maskable-512.png', PUBLIC_DIR), appIcon512)
