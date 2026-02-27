/**
 * Build registry script
 *
 * Reads registry.json and generates individual JSON files for each component
 * in a public/r/ directory. These files are served statically and fetched
 * by the CLI tool when users run `shadcn-wechat add <component>`.
 *
 * Output structure:
 *   public/r/index.json    — list of all components
 *   public/r/button.json   — button component metadata + inline source
 *   public/r/card.json     — card component metadata + inline source
 *   ...
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'

const REGISTRY_DIR = dirname(new URL(import.meta.url).pathname)
const ROOT = join(REGISTRY_DIR, '..')
const OUTPUT = join(ROOT, 'public', 'r')

interface RegistryFile {
  path: string
  target: string
}

interface RegistryItem {
  name: string
  type: string
  description: string
  dependencies: string[]
  registryDependencies: string[]
  files: RegistryFile[]
}

interface Registry {
  name: string
  homepage: string
  items: RegistryItem[]
}

function main() {
  const registry: Registry = JSON.parse(
    readFileSync(join(ROOT, 'registry.json'), 'utf-8')
  )

  mkdirSync(OUTPUT, { recursive: true })

  // Write index
  const index = registry.items.map(({ name, type, description }) => ({
    name,
    type,
    description,
  }))
  writeFileSync(join(OUTPUT, 'index.json'), JSON.stringify(index, null, 2))

  // Write individual component files with inlined source
  for (const item of registry.items) {
    const files = item.files.map((file) => {
      const sourcePath = join(ROOT, file.path)
      const content = existsSync(sourcePath)
        ? readFileSync(sourcePath, 'utf-8')
        : '// TODO: implement'

      return {
        ...file,
        content,
      }
    })

    const output = { ...item, files }
    writeFileSync(
      join(OUTPUT, `${item.name}.json`),
      JSON.stringify(output, null, 2)
    )
  }

  console.log(`Built ${registry.items.length} registry items to ${OUTPUT}`)
}

main()
