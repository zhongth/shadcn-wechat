# shadcn-wechat

[English](./README.en.md) | 中文

> 把 [shadcn/ui](https://ui.shadcn.com) 的开发体验带到微信小程序。

**shadcn-wechat** 是一套面向微信小程序的高质量 UI 组件库，基于 [Taro 4.x](https://taro.zone/) + React + Tailwind CSS 构建。采用 shadcn/ui 的 **复制粘贴** 模式 — 组件源码直接拷贝到你的项目中，没有运行时依赖，你拥有完整的代码控制权。

**38 个 UI 组件** | **7 个 Headless Hooks** | **CLI 一键安装** | **Tailwind CSS 原生支持**

## 特性

- **复制即拥有** — 组件源码复制到你的项目，自由修改，不受版本更新限制
- **Taro 4 + React** — 专为 Taro 微信小程序设计，所有组件使用 Taro 原生标签
- **Tailwind CSS** — 通过 [weapp-tailwindcss](https://github.com/sonofmagic/weapp-tailwindcss) 自动将 rem 转换为 rpx
- **CVA 变体系统** — 使用 class-variance-authority 管理组件变体，纯 JS 实现，无 DOM 依赖
- **Headless Hooks** — 自定义 Hooks 替代 Radix UI，适配小程序无 DOM API 的环境
- **深色模式** — 基于 class 的 `dark:` 变体，开箱即用
- **依赖自动解析** — CLI 自动解析组件依赖树，安装所需的 Hooks 和工具函数
- **TypeScript** — 完整的类型定义支持

## 快速开始

### 前置条件

确保你的项目已配置好以下环境：

- [Taro](https://taro.zone/) 4.x + React
- [Tailwind CSS](https://tailwindcss.com/) 3.x
- [weapp-tailwindcss](https://github.com/sonofmagic/weapp-tailwindcss) 3.x
- Node.js >= 18

### 1. 初始化

在 Taro 项目根目录运行：

```bash
pnpm dlx shadcn-wechat init
```

初始化会帮你完成以下工作：
- 创建 `components.json` 配置文件（路径别名等）
- 创建 `src/components/ui/`、`src/hooks/`、`src/lib/` 目录
- 生成 `src/lib/utils.ts`（包含 `cn()` 工具函数）
- 生成 `tailwind.config.ts` 主题配置（如果不存在）
- 安装依赖：`clsx`、`tailwind-merge`、`class-variance-authority`

### 2. 添加组件

```bash
# 添加单个组件
pnpm dlx shadcn-wechat add button

# 添加多个组件
pnpm dlx shadcn-wechat add dialog card tabs

# 添加全部组件
pnpm dlx shadcn-wechat add --all
```

CLI 会自动解析依赖。例如添加 `dialog` 时，会自动安装 `popup`、`use-disclosure`、`use-controllable-state`、`use-callback-ref` 和 `utils`。

### 3. 在页面中使用

```tsx
import { Button } from '@/components/ui/button'

export default function MyPage() {
  return (
    <Button variant="outline" size="lg">
      点击按钮
    </Button>
  )
}
```

## 组件列表

### 基础组件

| 组件 | 说明 |
|------|------|
| `button` | 按钮 — 支持 default、destructive、outline、secondary、ghost、link 6 种变体 |
| `text` | 文本排版 — 支持 h1-h4、段落、引导文字、静音文字等语义化变体 |
| `badge` | 徽标 — 状态指示器，支持多种颜色变体 |
| `separator` | 分隔线 — 水平/垂直内容分隔 |
| `card` | 卡片 — 包含 Header、Content、Footer 插槽的容器组件 |
| `label` | 标签 — 表单控件标签 |
| `input` | 输入框 — 封装 Taro `<Input>` 组件 |
| `textarea` | 多行输入框 — 封装 Taro `<Textarea>` 组件 |
| `skeleton` | 骨架屏 — 加载占位动画 |
| `avatar` | 头像 — 图片头像 + 文字回退 |
| `icon` | 图标 — 图标包装组件 |

### 交互组件

| 组件 | 说明 |
|------|------|
| `popup` | 弹出层 — 遮罩层 + 滑入/淡入动画的基础弹出组件 |
| `dialog` | 对话框 — 模态对话框，包含标题、描述和操作按钮 |
| `action-sheet` | 动作面板 — 底部弹出的操作列表 |
| `toast` | 轻提示 — 命令式 API 的轻量级提示 |
| `checkbox` | 复选框 — 多选切换控件 |
| `radio-group` | 单选组 — 互斥选项单选 |
| `switch` | 开关 — 切换开关控件 |
| `tabs` | 标签页 — 选项卡内容切换 |
| `accordion` | 手风琴 — 可折叠内容面板 |
| `progress` | 进度条 — 完成度指示 |
| `slider` | 滑块 — 范围选择滑块 |
| `select` | 选择器 — 基于 Popup 的下拉选择 |
| `form` | 表单 — 兼容 react-hook-form 的表单组件 |
| `alert` | 警告 — 多变体提示消息 |
| `safe-area` | 安全区域 — 适配刘海屏和底部横条 |

### 高级组件

| 组件 | 说明 |
|------|------|
| `navigation-bar` | 自定义导航栏 — 替代微信默认导航栏 |
| `tab-bar` | 自定义底栏 — 底部标签栏导航 |
| `drawer` | 抽屉 — 支持手势拖拽关闭的侧边栏/底部抽屉 |
| `carousel` | 轮播 — 自定义指示器的轮播组件 |
| `infinite-scroll` | 无限滚动 — 滚动到底部自动加载更多 |
| `pull-to-refresh` | 下拉刷新 — 下拉刷新 ScrollView 封装 |
| `swipe-cell` | 滑动单元格 — 左/右滑显示隐藏操作按钮 |
| `virtual-list` | 虚拟列表 — 只渲染可见区域的高性能长列表 |
| `calendar` | 日历 — 支持单选、范围选择、多选 |
| `date-picker` | 日期选择器 — 日历弹窗形式的日期选择 |
| `command` | 命令面板 — 可搜索过滤的命令/搜索面板 |
| `data-table` | 数据表格 — 基于 Flexbox 的表格组件 |
| `sidebar` | 侧边栏 — 基于 Drawer 的侧边导航 |

### Hooks

| Hook | 说明 |
|------|------|
| `use-controllable-state` | 受控/非受控状态管理 |
| `use-disclosure` | 开关布尔状态管理（打开/关闭） |
| `use-callback-ref` | 稳定的回调引用 |
| `use-gesture` | 触摸手势识别（滑动、拖拽） |
| `use-id` | 稳定的唯一 ID 生成 |
| `use-previous` | 追踪上一次的值 |
| `use-timeout` | 声明式 setTimeout |

## CLI 命令

```bash
shadcn-wechat init            # 初始化项目配置
shadcn-wechat add <name...>   # 添加组件（自动解析依赖）
shadcn-wechat add --all       # 添加全部组件
shadcn-wechat add <name> -o   # 覆盖已有组件文件
shadcn-wechat list             # 列出所有可用组件
shadcn-wechat diff             # 对比本地组件和仓库版本的差异
shadcn-wechat diff <name>     # 对比指定组件
```

## 主题配色

`init` 命令会生成一套语义化的 Tailwind 颜色配置，与 shadcn/ui 的命名规范一致。所有组件都基于这些 Token 进行样式定义：

```
background / foreground         — 页面背景和前景色
card / card-foreground           — 卡片背景和前景色
popover / popover-foreground     — 弹出层背景和前景色
primary / primary-foreground     — 主色调
secondary / secondary-foreground — 次要色调
muted / muted-foreground         — 弱化色调
accent / accent-foreground       — 强调色
destructive / destructive-foreground — 危险/删除操作色
border / input / ring            — 边框、输入框、聚焦环
```

在 `tailwind.config.ts` 中修改这些颜色值即可适配你的品牌色。

## 工作原理

与传统组件库不同，shadcn-wechat **不会**把组件发布为 npm 包。它的工作方式是：

1. **组件仓库** — 所有组件源码在 `packages/registry/` 中维护
2. **构建内联** — CLI 构建时，将所有源码内联到 CLI 二进制文件中
3. **`add` 命令** — 读取内联的组件仓库，拓扑排序解析依赖图，转换 import 路径以匹配你的别名配置，然后写入到你的项目
4. **代码归属权** — 文件复制到你的项目后，就是你的了。自由修改，不受约束

## 项目结构

```
shadcn-wechat/
  packages/
    cli/           # CLI 工具（npm 包名：shadcn-wechat）
    registry/      # 组件源码 + registry.json 注册表
  apps/
    demo/          # Taro 小程序 Demo
```

## 参与贡献

```bash
git clone https://github.com/zhongth/shadcn-wechat.git
cd shadcn-wechat
pnpm install

# 构建 CLI
cd packages/cli && pnpm build

# 构建 Demo 小程序
cd apps/demo && pnpm build:weapp
```

欢迎提交 Issue 和 Pull Request。

## 许可证

[MIT](./LICENSE)
