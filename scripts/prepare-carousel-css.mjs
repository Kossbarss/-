import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sourcePath = path.join(root, 'src', 'card-fan-carousel.css')
const outputDir = path.join(root, '.build')
const outputPath = path.join(outputDir, 'card-fan-carousel.css')

let css = await readFile(sourcePath, 'utf8')

// Global page spacing belongs only to layout-rhythm.css.
// Remove old cases-section spacing rules from the carousel input before Tailwind builds it.
css = css.replace(
  /\/\* Cases section spacing:[\s\S]*?(?=@media \(max-width: 1023px\))/, 
  '',
)

css = css.replace(
  /\n\s*\.section-head \+ \.chat-mock \{[\s\S]*?\}\s*\n\s*\.chat-mock \{[\s\S]*?\}\s*\n\s*\.chat-mock \+ \.case-fan-head \{[\s\S]*?\}\s*(?=\n\s*\.case-fan-head)/,
  '\n',
)

if (/\.section-head\s*\+\s*\.chat-mock|\.chat-mock\s*\+\s*\.case-fan-head/.test(css)) {
  throw new Error('Carousel CSS still contains global cases-section spacing rules.')
}

await mkdir(outputDir, { recursive: true })
await writeFile(outputPath, css, 'utf8')
