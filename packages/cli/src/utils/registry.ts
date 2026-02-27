import { registryItems, type RegistryItem } from '../generated/registry-data.js'

/**
 * Get all registry items.
 */
export function getAllItems(): RegistryItem[] {
  return registryItems
}

/**
 * Get a single registry item by name.
 */
export function getItem(name: string): RegistryItem | undefined {
  return registryItems.find((item) => item.name === name)
}

/**
 * Get all component names (type = registry:ui).
 */
export function getComponentNames(): string[] {
  return registryItems
    .filter((item) => item.type === 'registry:ui')
    .map((item) => item.name)
}

/**
 * Get all item names (components + hooks + lib).
 */
export function getAllNames(): string[] {
  return registryItems.map((item) => item.name)
}

/**
 * Resolve all dependencies (transitive) for a list of item names.
 * Returns items in topological order (dependencies first).
 */
export function resolveItems(names: string[]): RegistryItem[] {
  const resolved = new Map<string, RegistryItem>()
  const visited = new Set<string>()

  function resolve(name: string) {
    if (visited.has(name)) return
    visited.add(name)

    const item = getItem(name)
    if (!item) {
      throw new Error(`Component "${name}" not found in registry.`)
    }

    // Resolve dependencies first (topological order)
    for (const dep of item.registryDependencies) {
      resolve(dep)
    }

    resolved.set(name, item)
  }

  for (const name of names) {
    resolve(name)
  }

  return Array.from(resolved.values())
}

/**
 * Collect all npm dependencies from a list of resolved items.
 * Returns deduplicated array of package names.
 */
export function collectDependencies(items: RegistryItem[]): string[] {
  const deps = new Set<string>()
  for (const item of items) {
    for (const dep of item.dependencies) {
      deps.add(dep)
    }
  }
  return Array.from(deps)
}
