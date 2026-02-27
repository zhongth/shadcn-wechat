import { z } from 'zod'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

export const configSchema = z.object({
  $schema: z.string().optional(),
  tsx: z.boolean().default(true),
  aliases: z.object({
    components: z.string().default('@/components'),
    utils: z.string().default('@/lib/utils'),
    hooks: z.string().default('@/hooks'),
  }),
})

export type Config = z.infer<typeof configSchema>

const CONFIG_FILE = 'components.json'

/**
 * Read and validate components.json from the current working directory.
 */
export function getConfig(cwd: string = process.cwd()): Config {
  const configPath = join(cwd, CONFIG_FILE)

  if (!existsSync(configPath)) {
    throw new Error(
      `Configuration file not found: ${CONFIG_FILE}\n` +
        `Run "shadcn-wechat init" to create one.`
    )
  }

  try {
    const raw = JSON.parse(readFileSync(configPath, 'utf-8'))
    return configSchema.parse(raw)
  } catch (err) {
    if (err instanceof z.ZodError) {
      throw new Error(
        `Invalid ${CONFIG_FILE}:\n${err.errors.map((e) => `  - ${e.path.join('.')}: ${e.message}`).join('\n')}`
      )
    }
    throw err
  }
}

/**
 * Write components.json to the current working directory.
 */
export function writeConfig(config: Config, cwd: string = process.cwd()): void {
  const configPath = join(cwd, CONFIG_FILE)
  writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n')
}

/**
 * Check if components.json exists.
 */
export function configExists(cwd: string = process.cwd()): boolean {
  return existsSync(join(cwd, CONFIG_FILE))
}
