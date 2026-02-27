# shadcn-wechat

English | [中文](./README.md)

> Bring the [shadcn/ui](https://ui.shadcn.com) developer experience to WeChat Mini Programs.

**shadcn-wechat** is a high-quality UI component library for WeChat Mini Programs, built on [Taro 4.x](https://taro.zone/) + React + Tailwind CSS. Following the shadcn/ui **copy-paste** model — component source code is copied directly into your project. No runtime dependency. Full code ownership.

**38 UI Components** | **7 Headless Hooks** | **CLI Installer** | **Tailwind CSS Native**

## Features

- **Copy and own** — Components are copied to your project. Modify freely, no version lock-in
- **Taro 4 + React** — Built specifically for Taro WeChat Mini Programs using Taro native elements
- **Tailwind CSS** — Automatic rem-to-rpx conversion via [weapp-tailwindcss](https://github.com/sonofmagic/weapp-tailwindcss)
- **CVA variant system** — class-variance-authority for component variants, pure JS, no DOM dependency
- **Headless Hooks** — Custom hooks replace Radix UI, designed for the mini program environment (no DOM APIs)
- **Dark mode** — Class-based `dark:` variants, works out of the box
- **Auto dependency resolution** — CLI resolves the full component dependency tree, installs required hooks and utilities
- **TypeScript** — Full type definitions included

## Quick Start

### Prerequisites

Make sure your project has the following set up:

- [Taro](https://taro.zone/) 4.x with React
- [Tailwind CSS](https://tailwindcss.com/) 3.x
- [weapp-tailwindcss](https://github.com/sonofmagic/weapp-tailwindcss) 3.x
- Node.js >= 18

### 1. Initialize

In your Taro project root:

```bash
pnpm dlx shadcn-wechat init
```

This will:
- Create `components.json` with your alias preferences
- Scaffold `src/components/ui/`, `src/hooks/`, and `src/lib/` directories
- Generate `src/lib/utils.ts` with the `cn()` helper
- Generate `tailwind.config.ts` with theme tokens (if missing)
- Install dependencies: `clsx`, `tailwind-merge`, `class-variance-authority`

### 2. Add components

```bash
# Add a single component
pnpm dlx shadcn-wechat add button

# Add multiple components
pnpm dlx shadcn-wechat add dialog card tabs

# Add all components
pnpm dlx shadcn-wechat add --all
```

Dependencies are resolved automatically. Adding `dialog` installs `popup`, `use-disclosure`, `use-controllable-state`, `use-callback-ref`, and `utils` for you.

### 3. Use in your pages

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

## Components

### Foundation

| Component | Description |
|-----------|-------------|
| `button` | 6 variants (default, destructive, outline, secondary, ghost, link) with multiple sizes |
| `text` | Semantic typography variants (h1-h4, paragraph, lead, muted, etc.) |
| `badge` | Status indicators with color variants |
| `separator` | Horizontal/vertical content divider |
| `card` | Container with Header, Content, and Footer slots |
| `label` | Form control labels |
| `input` | Text input wrapping Taro `<Input>` |
| `textarea` | Multi-line input wrapping Taro `<Textarea>` |
| `skeleton` | Loading placeholder with pulse animation |
| `avatar` | Image avatar with text fallback |
| `icon` | Icon wrapper component |

### Core Interactions

| Component | Description |
|-----------|-------------|
| `popup` | Overlay primitive with backdrop and slide/fade animations |
| `dialog` | Modal dialog with title, description, and action buttons |
| `action-sheet` | Bottom action sheet |
| `toast` | Lightweight notifications with imperative API |
| `checkbox` | Multi-select toggle control |
| `radio-group` | Mutually exclusive single selection |
| `switch` | Toggle switch control |
| `tabs` | Tabbed content switching |
| `accordion` | Collapsible content panels |
| `progress` | Progress bar |
| `slider` | Range slider input |
| `select` | Popup-based dropdown select |
| `form` | Form primitives compatible with react-hook-form |
| `alert` | Alert messages with variants |
| `safe-area` | Device notch and home indicator padding |

### Advanced

| Component | Description |
|-----------|-------------|
| `navigation-bar` | Custom nav bar replacing the WeChat default |
| `tab-bar` | Custom bottom tab bar navigation |
| `drawer` | Drawer/sheet with drag-to-dismiss gesture |
| `carousel` | Swiper with custom indicators |
| `infinite-scroll` | ScrollView with auto load-more on scroll |
| `pull-to-refresh` | Pull-to-refresh ScrollView wrapper |
| `swipe-cell` | Swipeable cell revealing hidden action buttons |
| `virtual-list` | Virtualized list rendering only visible items |
| `calendar` | Single, range, and multi-date selection |
| `date-picker` | Date picker with calendar popup |
| `command` | Searchable command/search palette |
| `data-table` | Flexbox-based data table with column definitions |
| `sidebar` | Drawer-based sidebar navigation |

### Hooks

| Hook | Description |
|------|-------------|
| `use-controllable-state` | Controlled/uncontrolled state management |
| `use-disclosure` | Open/close boolean state |
| `use-callback-ref` | Stable callback reference |
| `use-gesture` | Touch gesture recognition (swipe, pan) |
| `use-id` | Stable unique ID generation |
| `use-previous` | Track previous value |
| `use-timeout` | Declarative setTimeout |

## CLI Commands

```bash
shadcn-wechat init            # Initialize project config
shadcn-wechat add <name...>   # Add component(s) with auto dependency resolution
shadcn-wechat add --all       # Add all components
shadcn-wechat add <name> -o   # Overwrite existing component files
shadcn-wechat list             # List all available components
shadcn-wechat diff             # Compare local components vs registry versions
shadcn-wechat diff <name>     # Diff a specific component
```

## Theme

The `init` command generates semantic Tailwind color tokens matching the shadcn/ui naming convention. All components reference these tokens:

```
background / foreground         — Page background and text
card / card-foreground           — Card surfaces
popover / popover-foreground     — Popover/overlay surfaces
primary / primary-foreground     — Primary brand color
secondary / secondary-foreground — Secondary color
muted / muted-foreground         — Muted/subtle color
accent / accent-foreground       — Accent/highlight color
destructive / destructive-foreground — Danger/delete actions
border / input / ring            — Borders, inputs, focus rings
```

Customize them in `tailwind.config.ts` to match your brand.

## How It Works

Unlike traditional component libraries, shadcn-wechat does **not** publish components as an npm package:

1. **Registry** — All component source code is maintained in `packages/registry/`
2. **Build-time inlining** — At CLI build time, all source files are inlined into the CLI binary
3. **`add` command** — Reads the bundled registry, resolves the dependency graph via topological sort, transforms import paths to match your alias config, then writes files to your project
4. **Ownership** — Once copied, the files are yours. Modify freely.

## Project Structure

```
shadcn-wechat/
  packages/
    cli/           # CLI tool (npm: shadcn-wechat)
    registry/      # Component source + registry.json
  apps/
    demo/          # Taro demo mini program
```

## Contributing

```bash
git clone https://github.com/zhongth/shadcn-wechat.git
cd shadcn-wechat
pnpm install

# Build CLI
cd packages/cli && pnpm build

# Build demo mini program
cd apps/demo && pnpm build:weapp
```

Issues and pull requests are welcome.

## License

[MIT](./LICENSE)
