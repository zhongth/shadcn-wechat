import chalk from 'chalk'
import ora from 'ora'
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { getConfig } from '../utils/config.js'
import {
  getAllNames,
  getComponentNames,
  resolveItems,
  collectDependencies,
} from '../utils/registry.js'
import { transformContent } from '../utils/transformer.js'
import {
  getPackageManager,
  getInstallCommand,
} from '../utils/get-package-manager.js'

/**
 * Resolve an alias like "@/components" to a filesystem path
 * relative to cwd. Assumes @/ maps to src/.
 */
function aliasToPath(alias: string): string {
  return alias.replace(/^[@~]\//, 'src/')
}

/**
 * Get the target directory for a registry item type.
 */
function getTargetDir(
  itemType: string,
  target: string,
  config: ReturnType<typeof getConfig>,
  cwd: string
): string {
  switch (itemType) {
    case 'registry:ui':
      return join(cwd, aliasToPath(config.aliases.components), 'ui')
    case 'registry:hook':
      return join(cwd, aliasToPath(config.aliases.hooks))
    case 'registry:lib': {
      // target is like "lib/utils.ts" → resolve from alias base
      const utilsBase = dirname(aliasToPath(config.aliases.utils))
      return join(cwd, utilsBase)
    }
    default:
      return join(cwd, aliasToPath(config.aliases.components), 'ui')
  }
}

/**
 * Get the target filename for a file.
 */
function getTargetFilename(target: string, tsx: boolean): string {
  // target is like "ui/button.tsx" or "hooks/use-disclosure.ts" or "lib/utils.ts"
  const filename = target.split('/').pop() || target

  // If not using TypeScript, convert .tsx → .jsx and .ts → .js
  if (!tsx) {
    return filename.replace(/\.tsx$/, '.jsx').replace(/\.ts$/, '.js')
  }
  return filename
}

export async function add(
  components: string[],
  options: { all?: boolean; overwrite?: boolean }
) {
  const cwd = process.cwd()

  // 1. Read config
  let config: ReturnType<typeof getConfig>
  try {
    config = getConfig(cwd)
  } catch (err) {
    console.log(
      chalk.red(
        '\n  Error: components.json not found.\n' +
          `  Run ${chalk.cyan('shadcn-wechat init')} first.\n`
      )
    )
    process.exit(1)
  }

  // 2. Determine which components to add
  const allNames = getAllNames()
  const componentNames = getComponentNames()

  let targets: string[]
  if (options.all) {
    targets = componentNames // Only add UI components with --all (not hooks/lib directly)
  } else if (!components.length) {
    console.log(chalk.red('\n  Please specify at least one component to add.'))
    console.log(`  Example: ${chalk.cyan('shadcn-wechat add button card')}`)
    console.log(`  Run ${chalk.cyan('shadcn-wechat list')} to see available components.\n`)
    process.exit(1)
  } else {
    targets = components
  }

  // 3. Validate all names exist
  const invalid = targets.filter((name) => !allNames.includes(name))
  if (invalid.length > 0) {
    console.log(
      chalk.red(`\n  Unknown component(s): ${invalid.join(', ')}`)
    )
    console.log(`  Run ${chalk.cyan('shadcn-wechat list')} to see available components.\n`)
    process.exit(1)
  }

  console.log(chalk.bold('\n  shadcn-wechat\n'))

  // 4. Resolve full dependency tree
  const spinner = ora('Resolving dependencies...').start()
  let resolvedItems
  try {
    resolvedItems = resolveItems(targets)
  } catch (err) {
    spinner.fail('Failed to resolve dependencies')
    console.log(chalk.red(`  ${(err as Error).message}\n`))
    process.exit(1)
  }
  spinner.succeed(`Resolved ${resolvedItems.length} items`)

  // 5. Check which items are already installed (skip unless --overwrite)
  const itemsToInstall = options.overwrite
    ? resolvedItems
    : resolvedItems.filter((item) => {
        const targetDir = getTargetDir(item.type, item.files[0]?.target || '', config, cwd)
        const filename = getTargetFilename(
          item.files[0]?.target || '',
          config.tsx
        )
        const targetPath = join(targetDir, filename)
        return !existsSync(targetPath)
      })

  if (itemsToInstall.length === 0) {
    console.log(chalk.yellow('\n  All components are already installed.'))
    console.log(`  Use ${chalk.cyan('--overwrite')} to replace existing files.\n`)
    return
  }

  // 6. Show what will be installed
  const uiItems = itemsToInstall.filter((i) => i.type === 'registry:ui')
  const hookItems = itemsToInstall.filter((i) => i.type === 'registry:hook')
  const libItems = itemsToInstall.filter((i) => i.type === 'registry:lib')

  console.log(chalk.dim('  Items to install:'))
  if (uiItems.length > 0) {
    console.log(
      `    ${chalk.cyan('Components:')} ${uiItems.map((i) => i.name).join(', ')}`
    )
  }
  if (hookItems.length > 0) {
    console.log(
      `    ${chalk.cyan('Hooks:')} ${hookItems.map((i) => i.name).join(', ')}`
    )
  }
  if (libItems.length > 0) {
    console.log(
      `    ${chalk.cyan('Utilities:')} ${libItems.map((i) => i.name).join(', ')}`
    )
  }
  console.log()

  // 7. Write files
  const writeSpinner = ora('Writing component files...').start()
  let written = 0

  for (const item of itemsToInstall) {
    for (const file of item.files) {
      const targetDir = getTargetDir(item.type, file.target, config, cwd)
      const filename = getTargetFilename(file.target, config.tsx)
      const targetPath = join(targetDir, filename)

      // Create directory if needed
      mkdirSync(dirname(targetPath), { recursive: true })

      // Transform import paths
      let content = file.content
      content = transformContent(content, config)

      // Write file
      writeFileSync(targetPath, content)
      written++
    }
  }

  writeSpinner.succeed(`Written ${written} files`)

  // 8. Collect and install npm dependencies
  const npmDeps = collectDependencies(itemsToInstall)

  // Filter out already-installed deps
  let depsToInstall = npmDeps
  const pkgPath = join(cwd, 'package.json')
  if (existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
      const installed = {
        ...(pkg.dependencies || {}),
        ...(pkg.devDependencies || {}),
      }
      depsToInstall = npmDeps.filter((dep) => !(dep in installed))
    } catch {
      // ignore
    }
  }

  if (depsToInstall.length > 0) {
    const pm = getPackageManager(cwd)
    const installCmd = getInstallCommand(pm, depsToInstall)
    const installSpinner = ora(
      `Installing dependencies: ${depsToInstall.join(', ')}...`
    ).start()

    try {
      const { execSync } = await import('child_process')
      execSync(installCmd, { cwd, stdio: 'pipe' })
      installSpinner.succeed(
        `Installed dependencies: ${depsToInstall.join(', ')}`
      )
    } catch {
      installSpinner.fail('Failed to install dependencies')
      console.log(chalk.yellow(`  Run manually: ${chalk.cyan(installCmd)}\n`))
    }
  }

  // 9. Print summary
  console.log()
  if (uiItems.length > 0) {
    console.log(
      chalk.green(`  Added ${uiItems.length} component(s): `) +
        uiItems.map((i) => i.name).join(', ')
    )
  }
  if (hookItems.length > 0) {
    console.log(
      chalk.green(`  Added ${hookItems.length} hook(s): `) +
        hookItems.map((i) => i.name).join(', ')
    )
  }
  if (libItems.length > 0) {
    console.log(
      chalk.green(`  Added ${libItems.length} utility(ies): `) +
        libItems.map((i) => i.name).join(', ')
    )
  }
  console.log()
}
