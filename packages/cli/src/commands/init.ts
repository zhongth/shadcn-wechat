import chalk from 'chalk'
import ora from 'ora'
import prompts from 'prompts'
import { existsSync, readFileSync, mkdirSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { writeConfig, configExists, type Config } from '../utils/config.js'
import {
  getPackageManager,
  getInstallCommand,
} from '../utils/get-package-manager.js'

const UTILS_CONTENT = `import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`

const TAILWIND_CONFIG_CONTENT = `import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'selector',
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        foreground: '#0a0a0a',
        card: '#ffffff',
        'card-foreground': '#0a0a0a',
        popover: '#ffffff',
        'popover-foreground': '#0a0a0a',
        primary: '#171717',
        'primary-foreground': '#fafafa',
        secondary: '#f5f5f5',
        'secondary-foreground': '#171717',
        muted: '#f5f5f5',
        'muted-foreground': '#737373',
        accent: '#f5f5f5',
        'accent-foreground': '#171717',
        destructive: '#ef4444',
        'destructive-foreground': '#fafafa',
        border: '#e5e5e5',
        input: '#e5e5e5',
        ring: '#171717',
      },
      borderRadius: {
        lg: '12px',
        md: '8px',
        sm: '4px',
      },
      keyframes: {
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-out': {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        'slide-in-from-bottom': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        'slide-out-to-bottom': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(100%)' },
        },
        'slide-in-from-top': {
          from: { transform: 'translateY(-100%)' },
          to: { transform: 'translateY(0)' },
        },
        'slide-in-from-left': {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' },
        },
        'slide-in-from-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        'zoom-in': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'zoom-out': {
          from: { opacity: '1', transform: 'scale(1)' },
          to: { opacity: '0', transform: 'scale(0.95)' },
        },
      },
      animation: {
        'pulse-slow': 'pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fade-in 200ms ease-out',
        'fade-out': 'fade-out 200ms ease-in',
        'slide-in-from-bottom': 'slide-in-from-bottom 300ms ease-out',
        'slide-out-to-bottom': 'slide-out-to-bottom 300ms ease-in',
        'slide-in-from-top': 'slide-in-from-top 300ms ease-out',
        'slide-in-from-left': 'slide-in-from-left 300ms ease-out',
        'slide-in-from-right': 'slide-in-from-right 300ms ease-out',
        'zoom-in': 'zoom-in 200ms ease-out',
        'zoom-out': 'zoom-out 200ms ease-in',
      },
    },
  },
  plugins: [],
}

export default config
`

/**
 * Check if the current directory is a Taro project.
 */
function isTaroProject(cwd: string): boolean {
  const pkgPath = join(cwd, 'package.json')
  if (!existsSync(pkgPath)) return false
  try {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
    const allDeps = {
      ...(pkg.dependencies || {}),
      ...(pkg.devDependencies || {}),
    }
    return '@tarojs/taro' in allDeps
  } catch {
    return false
  }
}

/**
 * Resolve an alias like "@/components" to a filesystem path
 * relative to cwd. Assumes @/ maps to src/.
 */
function aliasToPath(alias: string): string {
  // @/components → src/components
  // ~/lib/utils → src/lib/utils
  return alias.replace(/^[@~]\//, 'src/')
}

export async function init() {
  const cwd = process.cwd()

  console.log(chalk.bold('\n  shadcn-wechat\n'))
  console.log('  Initializing project...\n')

  // 1. Check if already initialized
  if (configExists(cwd)) {
    const { overwrite } = await prompts({
      type: 'confirm',
      name: 'overwrite',
      message: 'components.json already exists. Overwrite?',
      initial: false,
    })
    if (!overwrite) {
      console.log(chalk.yellow('  Aborted.'))
      return
    }
  }

  // 2. Check if this is a Taro project
  if (!isTaroProject(cwd)) {
    console.log(
      chalk.yellow(
        '  Warning: @tarojs/taro not found in package.json.\n' +
          '  This CLI is designed for Taro WeChat Mini Program projects.\n'
      )
    )
    const { proceed } = await prompts({
      type: 'confirm',
      name: 'proceed',
      message: 'Continue anyway?',
      initial: false,
    })
    if (!proceed) {
      console.log(chalk.yellow('  Aborted.'))
      return
    }
  }

  // 3. Interactive prompts
  const response = await prompts([
    {
      type: 'confirm',
      name: 'tsx',
      message: 'Would you like to use TypeScript?',
      initial: true,
    },
    {
      type: 'text',
      name: 'componentsAlias',
      message: 'Configure the import alias for components:',
      initial: '@/components',
    },
    {
      type: 'text',
      name: 'utilsAlias',
      message: 'Configure the import alias for utils:',
      initial: '@/lib/utils',
    },
    {
      type: 'text',
      name: 'hooksAlias',
      message: 'Configure the import alias for hooks:',
      initial: '@/hooks',
    },
  ])

  // User cancelled
  if (
    response.tsx === undefined ||
    !response.componentsAlias ||
    !response.utilsAlias ||
    !response.hooksAlias
  ) {
    console.log(chalk.yellow('\n  Aborted.'))
    return
  }

  const config: Config = {
    tsx: response.tsx,
    aliases: {
      components: response.componentsAlias,
      utils: response.utilsAlias,
      hooks: response.hooksAlias,
    },
  }

  // 4. Write components.json
  const spinner = ora('Writing components.json...').start()
  writeConfig(config, cwd)
  spinner.succeed('Created components.json')

  // 5. Create directory structure
  const uiDir = join(cwd, aliasToPath(config.aliases.components), 'ui')
  const hooksDir = join(cwd, aliasToPath(config.aliases.hooks))
  const utilsDir = dirname(join(cwd, aliasToPath(config.aliases.utils)))

  for (const dir of [uiDir, hooksDir, utilsDir]) {
    mkdirSync(dir, { recursive: true })
  }
  console.log(chalk.green('  Created directories:'))
  console.log(`    ${uiDir.replace(cwd, '.')}`)
  console.log(`    ${hooksDir.replace(cwd, '.')}`)
  console.log(`    ${utilsDir.replace(cwd, '.')}`)

  // 6. Write utils.ts
  const ext = config.tsx ? '.ts' : '.js'
  const utilsPath = join(cwd, aliasToPath(config.aliases.utils) + ext)
  if (!existsSync(utilsPath)) {
    mkdirSync(dirname(utilsPath), { recursive: true })
    writeFileSync(utilsPath, UTILS_CONTENT)
    console.log(chalk.green(`  Created ${utilsPath.replace(cwd, '.')}`))
  } else {
    console.log(
      chalk.yellow(`  Skipped ${utilsPath.replace(cwd, '.')} (already exists)`)
    )
  }

  // 7. Check tailwind config
  const twConfigPath = join(cwd, 'tailwind.config.ts')
  const twConfigPathJs = join(cwd, 'tailwind.config.js')
  if (!existsSync(twConfigPath) && !existsSync(twConfigPathJs)) {
    writeFileSync(twConfigPath, TAILWIND_CONFIG_CONTENT)
    console.log(chalk.green('  Created tailwind.config.ts with theme tokens'))
  } else {
    console.log(
      chalk.yellow(
        '\n  tailwind.config already exists. Make sure it includes the shadcn-wechat theme colors.'
      )
    )
    console.log(
      chalk.dim(
        '  See: https://github.com/user/shadcn-wechat#tailwind-theme\n'
      )
    )
  }

  // 8. Install peer dependencies
  const pm = getPackageManager(cwd)
  const peerDeps = ['clsx', 'tailwind-merge', 'class-variance-authority']

  // Check which deps are already installed
  const pkgPath = join(cwd, 'package.json')
  let depsToInstall = peerDeps
  if (existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
      const installed = {
        ...(pkg.dependencies || {}),
        ...(pkg.devDependencies || {}),
      }
      depsToInstall = peerDeps.filter((dep) => !(dep in installed))
    } catch {
      // ignore, install all
    }
  }

  if (depsToInstall.length > 0) {
    const installCmd = getInstallCommand(pm, depsToInstall)
    const installSpinner = ora(`Installing dependencies: ${depsToInstall.join(', ')}...`).start()

    try {
      const { execSync } = await import('child_process')
      execSync(installCmd, { cwd, stdio: 'pipe' })
      installSpinner.succeed(`Installed dependencies: ${depsToInstall.join(', ')}`)
    } catch (err) {
      installSpinner.fail('Failed to install dependencies')
      console.log(
        chalk.yellow(`  Run manually: ${chalk.cyan(installCmd)}\n`)
      )
    }
  } else {
    console.log(chalk.green('  All peer dependencies already installed'))
  }

  // 9. Success message
  console.log(
    `\n  ${chalk.green('Success!')} Project initialized.\n\n` +
      `  You can now add components:\n` +
      `    ${chalk.cyan(`${pm === 'npm' ? 'npx' : pm === 'pnpm' ? 'pnpm dlx' : 'yarn dlx'} shadcn-wechat add button`)}\n` +
      `    ${chalk.cyan(`${pm === 'npm' ? 'npx' : pm === 'pnpm' ? 'pnpm dlx' : 'yarn dlx'} shadcn-wechat add dialog`)}\n` +
      `    ${chalk.cyan(`${pm === 'npm' ? 'npx' : pm === 'pnpm' ? 'pnpm dlx' : 'yarn dlx'} shadcn-wechat add --all`)}\n`
  )
}
