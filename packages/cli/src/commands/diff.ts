import chalk from 'chalk'
import { existsSync, readFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { getConfig } from '../utils/config.js'
import { getItem, getAllNames } from '../utils/registry.js'
import { transformContent } from '../utils/transformer.js'

/**
 * Resolve an alias to a filesystem path.
 */
function aliasToPath(alias: string): string {
  return alias.replace(/^[@~]\//, 'src/')
}

/**
 * Get the local file path for a registry item.
 */
function getLocalPath(
  itemType: string,
  target: string,
  config: ReturnType<typeof getConfig>,
  cwd: string
): string {
  switch (itemType) {
    case 'registry:ui': {
      const filename = target.split('/').pop() || target
      return join(cwd, aliasToPath(config.aliases.components), 'ui', filename)
    }
    case 'registry:hook': {
      const filename = target.split('/').pop() || target
      return join(cwd, aliasToPath(config.aliases.hooks), filename)
    }
    case 'registry:lib': {
      const utilsBase = dirname(aliasToPath(config.aliases.utils))
      const filename = target.split('/').pop() || target
      return join(cwd, utilsBase, filename)
    }
    default:
      return join(cwd, 'src', target)
  }
}

/**
 * Find all locally installed components by scanning directories.
 */
function findInstalledComponents(
  config: ReturnType<typeof getConfig>,
  cwd: string
): string[] {
  const installed: string[] = []
  const allNames = getAllNames()

  // Check each known registry item
  for (const name of allNames) {
    const item = getItem(name)
    if (!item) continue

    for (const file of item.files) {
      const localPath = getLocalPath(item.type, file.target, config, cwd)
      if (existsSync(localPath)) {
        installed.push(name)
        break
      }
    }
  }

  return installed
}

/**
 * Simple line-by-line diff. Returns diff lines with +/- prefix.
 */
function diffLines(local: string, registry: string): string[] {
  const localLines = local.split('\n')
  const registryLines = registry.split('\n')
  const result: string[] = []

  const maxLen = Math.max(localLines.length, registryLines.length)

  // Simple line-by-line comparison
  let i = 0
  let j = 0

  while (i < localLines.length || j < registryLines.length) {
    const localLine = i < localLines.length ? localLines[i] : undefined
    const registryLine = j < registryLines.length ? registryLines[j] : undefined

    if (localLine === registryLine) {
      // Lines match — skip
      i++
      j++
    } else if (
      registryLine !== undefined &&
      (localLine === undefined ||
        registryLines.indexOf(localLine, j) !== -1)
    ) {
      // Registry has a new line
      result.push(chalk.green(`+ ${registryLine}`))
      j++
    } else if (
      localLine !== undefined &&
      (registryLine === undefined ||
        localLines.indexOf(registryLine, i) !== -1)
    ) {
      // Local has a line not in registry
      result.push(chalk.red(`- ${localLine}`))
      i++
    } else {
      // Lines differ
      result.push(chalk.red(`- ${localLine}`))
      result.push(chalk.green(`+ ${registryLine}`))
      i++
      j++
    }
  }

  return result
}

export async function diff(components?: string[]) {
  const cwd = process.cwd()

  // 1. Read config
  let config: ReturnType<typeof getConfig>
  try {
    config = getConfig(cwd)
  } catch {
    console.log(
      chalk.red(
        '\n  Error: components.json not found.\n' +
          `  Run ${chalk.cyan('shadcn-wechat init')} first.\n`
      )
    )
    process.exit(1)
  }

  console.log(chalk.bold('\n  shadcn-wechat diff\n'))

  // 2. Determine which components to diff
  let targets: string[]
  if (components && components.length > 0) {
    targets = components
  } else {
    // Diff all installed components
    targets = findInstalledComponents(config, cwd)
    if (targets.length === 0) {
      console.log(chalk.yellow('  No installed components found.\n'))
      return
    }
    console.log(
      chalk.dim(`  Checking ${targets.length} installed component(s)...\n`)
    )
  }

  // 3. Diff each component
  let changedCount = 0
  let unchangedCount = 0

  for (const name of targets) {
    const item = getItem(name)
    if (!item) {
      console.log(chalk.yellow(`  ${name}: not found in registry (skipped)`))
      continue
    }

    for (const file of item.files) {
      const localPath = getLocalPath(item.type, file.target, config, cwd)

      if (!existsSync(localPath)) {
        console.log(chalk.yellow(`  ${name}: not installed locally (skipped)`))
        continue
      }

      const localContent = readFileSync(localPath, 'utf-8')

      // Transform registry content to match local alias config
      const registryContent = transformContent(file.content, config)

      if (localContent === registryContent) {
        unchangedCount++
      } else {
        changedCount++
        console.log(chalk.cyan(`  ${name} (${file.target}):`))

        const diffResult = diffLines(localContent, registryContent)
        if (diffResult.length > 0) {
          for (const line of diffResult) {
            console.log(`    ${line}`)
          }
        }
        console.log()
      }
    }
  }

  // 4. Summary
  if (changedCount === 0 && unchangedCount > 0) {
    console.log(
      chalk.green(
        `  All ${unchangedCount} component(s) are up to date with the registry.\n`
      )
    )
  } else if (changedCount > 0) {
    console.log(
      chalk.dim(
        `  ${changedCount} file(s) differ from registry, ${unchangedCount} unchanged.\n`
      )
    )
    console.log(
      chalk.dim(
        `  ${chalk.green('+')} lines = in registry but not local\n` +
          `  ${chalk.red('-')} lines = in local but not registry\n`
      )
    )
    console.log(
      chalk.dim(
        `  Use ${chalk.cyan('shadcn-wechat add <component> --overwrite')} to reset to registry version.\n`
      )
    )
  }
}
