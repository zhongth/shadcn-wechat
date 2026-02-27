import type { Config } from './config.js'

/**
 * Transform component/hook source code import paths
 * to match the user's configured aliases.
 *
 * Handles:
 * - `@/lib/utils` → user's utils alias
 * - `@/hooks/*` → user's hooks alias
 * - Relative `./component` imports remain unchanged
 */
export function transformContent(content: string, config: Config): string {
  // Replace @/lib/utils with configured utils alias
  content = content.replace(
    /from\s+['"]@\/lib\/utils['"]/g,
    `from '${config.aliases.utils}'`
  )

  // Replace @/hooks/* with configured hooks alias
  content = content.replace(
    /from\s+['"]@\/hooks\/([\w-]+)['"]/g,
    (_, hookName) => `from '${config.aliases.hooks}/${hookName}'`
  )

  // Also handle type imports: import type { ... } from '@/hooks/...'
  content = content.replace(
    /from\s+['"]@\/hooks\/([\w-]+)['"]/g,
    (_, hookName) => `from '${config.aliases.hooks}/${hookName}'`
  )

  return content
}
