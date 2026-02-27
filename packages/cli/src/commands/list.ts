import chalk from 'chalk'
import { registryItems } from '../generated/registry-data.js'

export async function list() {
  console.log(chalk.bold('\n  Available components:\n'))

  // Group by type
  const uiItems = registryItems.filter((i) => i.type === 'registry:ui')
  const hookItems = registryItems.filter((i) => i.type === 'registry:hook')
  const libItems = registryItems.filter((i) => i.type === 'registry:lib')

  console.log(`  ${chalk.cyan('UI Components')} (${uiItems.length})`)
  for (const item of uiItems) {
    console.log(`    ${item.name.padEnd(20)} ${chalk.dim(item.description)}`)
  }
  console.log()

  console.log(`  ${chalk.cyan('Hooks')} (${hookItems.length})`)
  for (const item of hookItems) {
    console.log(`    ${item.name.padEnd(28)} ${chalk.dim(item.description)}`)
  }
  console.log()

  console.log(`  ${chalk.cyan('Utilities')} (${libItems.length})`)
  for (const item of libItems) {
    console.log(`    ${item.name.padEnd(20)} ${chalk.dim(item.description)}`)
  }
  console.log()

  console.log(
    chalk.dim(
      `  Total: ${registryItems.length} items (${uiItems.length} components, ${hookItems.length} hooks, ${libItems.length} utilities)\n`
    )
  )
}
