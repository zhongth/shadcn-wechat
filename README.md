# shadcn-wechat

A [shadcn/ui](https://ui.shadcn.com)-style component library for **WeChat Mini Programs**, built on [Taro 4.x](https://taro.zone/) + React + Tailwind CSS.

Copy and paste. No runtime dependency. Full ownership of your components.

## Why

shadcn/ui changed how we build web UIs — instead of importing from a package, you own the source code. **shadcn-wechat** brings that same model to WeChat Mini Programs:

- Components are copied into **your** project, not installed as a dependency
- Every component is a single `.tsx` file you can read, modify, and extend
- Tailwind CSS for styling (converted to rpx via [weapp-tailwindcss](https://github.com/sonofmagic/weapp-tailwindcss))
- CVA + clsx + tailwind-merge for variants — pure JS, no DOM APIs
- Class-based dark mode with `dark:` variants

## Quick Start

### 1. Initialize

In your Taro project root:

```bash
pnpm dlx shadcn-wechat init
```

This will:
- Create `components.json` with your alias preferences
- Scaffold `src/components/ui/`, `src/hooks/`, and `src/lib/`
- Write `src/lib/utils.ts` with the `cn()` helper
- Create `tailwind.config.ts` with the theme tokens (if missing)
- Install peer dependencies (`clsx`, `tailwind-merge`, `class-variance-authority`)

### 2. Add components

```bash
pnpm dlx shadcn-wechat add button
pnpm dlx shadcn-wechat add dialog card tabs
pnpm dlx shadcn-wechat add --all
```

Dependencies are resolved automatically. Adding `dialog` installs `popup`, `use-disclosure`, `use-controllable-state`, `use-callback-ref`, and `utils` for you.

### 3. Use

```tsx
import { Button } from '@/components/ui/button'

export default function MyPage() {
  return (
    <Button variant="outline" size="lg">
      Click me
    </Button>
  )
}
```

## Requirements

- [Taro](https://taro.zone/) 4.x with React
- [Tailwind CSS](https://tailwindcss.com/) 3.x
- [weapp-tailwindcss](https://github.com/sonofmagic/weapp-tailwindcss) 3.x (for rem-to-rpx conversion)
- Node.js >= 18

## Components

### Foundation

| Component | Description |
|-----------|-------------|
| `button` | Multiple variants (default, destructive, outline, secondary, ghost, link) and sizes |
| `text` | Typography with semantic variants (h1-h4, p, lead, muted, etc.) |
| `badge` | Status indicators with color variants |
| `separator` | Horizontal/vertical content divider |
| `card` | Container with header, content, and footer slots |
| `label` | Form control labels |
| `input` | Text input wrapping Taro's `<Input>` |
| `textarea` | Multi-line text input |
| `skeleton` | Loading placeholder with pulse animation |
| `avatar` | Image with fallback initials |
| `icon` | Icon wrapper component |

### Core Interactions

| Component | Description |
|-----------|-------------|
| `popup` | Overlay primitive with backdrop and slide/fade animations |
| `dialog` | Modal dialog with title, description, and actions |
| `action-sheet` | Bottom action sheet |
| `toast` | Toast notifications with imperative API |
| `checkbox` | Checkbox toggle |
| `radio-group` | Radio group for single selection |
| `switch` | Toggle switch |
| `tabs` | Tabbed content |
| `accordion` | Collapsible sections |
| `progress` | Progress bar |
| `slider` | Range slider |
| `select` | Dropdown select with popup |
| `form` | Form primitives compatible with react-hook-form |
| `alert` | Alert messages with variants |
| `safe-area` | Device notch and home indicator padding |

### Advanced

| Component | Description |
|-----------|-------------|
| `navigation-bar` | Custom nav bar replacing WeChat default |
| `tab-bar` | Custom bottom tab bar |
| `drawer` | Drawer/sheet with drag-to-dismiss |
| `carousel` | Swiper with custom indicators |
| `infinite-scroll` | ScrollView with auto load-more |
| `pull-to-refresh` | Pull-to-refresh wrapper |
| `swipe-cell` | Swipeable cell with hidden actions |
| `virtual-list` | Virtualized list for large datasets |
| `calendar` | Calendar with single, range, and multi-date selection |
| `date-picker` | Date picker with calendar popup |
| `command` | Command/search palette with filtering |
| `data-table` | Flexbox-based data table |
| `sidebar` | Sidebar navigation via drawer |

### Hooks

| Hook | Description |
|------|-------------|
| `use-controllable-state` | Controlled/uncontrolled state management |
| `use-disclosure` | Open/close boolean state |
| `use-callback-ref` | Stable callback reference |
| `use-gesture` | Touch gesture recognition (swipe, pan) |
| `use-id` | Unique ID generation |
| `use-previous` | Track previous value |
| `use-timeout` | Declarative setTimeout |

## CLI Commands

```bash
shadcn-wechat init            # Initialize project
shadcn-wechat add <name...>   # Add component(s)
shadcn-wechat add --all       # Add all components
shadcn-wechat add <name> -o   # Overwrite existing
shadcn-wechat list             # List available components
shadcn-wechat diff             # Compare local vs registry
shadcn-wechat diff <name>     # Diff specific component
```

## Tailwind Theme

The `init` command sets up a Tailwind config with the following semantic color tokens. These match shadcn/ui's naming convention and are used throughout all components:

```
background / foreground
card / card-foreground
popover / popover-foreground
primary / primary-foreground
secondary / secondary-foreground
muted / muted-foreground
accent / accent-foreground
destructive / destructive-foreground
border / input / ring
```

Customize them in your `tailwind.config.ts` to match your brand.

## Project Structure

```
shadcn-wechat/
  packages/
    cli/           # CLI tool (npm: shadcn-wechat)
    registry/      # Component source files + registry.json
  apps/
    demo/          # Taro demo mini program
```

## How It Works

Unlike traditional component libraries, shadcn-wechat doesn't publish components as an npm package. Instead:

1. **Registry** — All component source code lives in `packages/registry/`
2. **Bundling** — At CLI build time, source files are inlined into the CLI binary
3. **`add` command** — Reads the bundled registry, resolves the dependency graph (topological sort), transforms import paths to match your aliases, and writes files into your project
4. **Ownership** — Once copied, the files are yours. Modify freely.

## Contributing

```bash
git clone https://github.com/zhongth/shadcn-wechat.git
cd shadcn-wechat
pnpm install

# Build CLI
cd packages/cli && pnpm build

# Run demo app
cd apps/demo && pnpm build:weapp
```

## License

MIT
