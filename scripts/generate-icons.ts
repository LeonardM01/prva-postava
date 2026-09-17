import { Resvg } from '@resvg/resvg-js'
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'

// Regenerates the committed icon files in `public/` from the vector sources in `scripts/icons/`.
// Run with `bun run generate-icons` after editing a source.

const SOURCES = new URL('icons/', import.meta.url)
const PUBLIC = new URL('../public/', import.meta.url)

async function rasterise(source: string, size: number) {
  const svg = await readFile(new URL(source, SOURCES), 'utf8')
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

await mkdir(PUBLIC, { recursive: true })
await copyFile(new URL('favicon.svg', SOURCES), new URL('favicon.svg', PUBLIC))
await writeFile(new URL('favicon-96.png', PUBLIC), await rasterise('favicon.svg', 96))
await writeFile(
  new URL('favicon.ico', PUBLIC),
  packIco([
    // 16 px uses its own drawing: 2 px dots on whole pixels stay crisp where a scaled one blurs.
    { size: 16, png: await rasterise('favicon-16.svg', 16) },
    { size: 32, png: await rasterise('favicon.svg', 32) },
    { size: 48, png: await rasterise('favicon.svg', 48) },
  ]),
)
