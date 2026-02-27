import { existsSync } from 'fs'
import { join } from 'path'

export type PackageManager = 'pnpm' | 'yarn' | 'npm'

/**
 * Detect which package manager the project uses by checking lock files.
 */
export function getPackageManager(cwd: string = process.cwd()): PackageManager {
  if (existsSync(join(cwd, 'pnpm-lock.yaml'))) return 'pnpm'
  if (existsSync(join(cwd, 'yarn.lock'))) return 'yarn'
  if (existsSync(join(cwd, 'package-lock.json'))) return 'npm'
  return 'npm'
}

/**
 * Get the install command for the detected package manager.
 */
export function getInstallCommand(
  pm: PackageManager,
  deps: string[]
): string {
  if (deps.length === 0) return ''

  const depsStr = deps.join(' ')
  switch (pm) {
    case 'pnpm':
      return `pnpm add ${depsStr}`
    case 'yarn':
      return `yarn add ${depsStr}`
    case 'npm':
      return `npm install ${depsStr}`
  }
}
