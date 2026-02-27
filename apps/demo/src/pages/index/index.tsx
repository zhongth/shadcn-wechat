import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Button } from '../../components/ui/button'
import { Typography } from '../../components/ui/text'
import { Badge } from '../../components/ui/badge'
import { Separator } from '../../components/ui/separator'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../../components/ui/card'
import { Label } from '../../components/ui/label'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Skeleton } from '../../components/ui/skeleton'
import { Avatar } from '../../components/ui/avatar'

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <View className="mb-8">
      <Typography variant="h3" className="text-foreground">
        {title}
      </Typography>
      <Separator className="my-3" />
      {children}
    </View>
  )
}

export default function Index() {
  return (
    <View className="p-4 pb-8">
      {/* Header */}
      <View className="mb-8">
        <Typography variant="h1" className="text-foreground">
          shadcn-wechat
        </Typography>
        <Typography variant="lead" className="mt-1">
          Modern components for WeChat Mini Programs
        </Typography>
      </View>

      {/* Navigation to Tier 1 demos */}
      <Section title="Tier 1 Demos">
        <View className="space-y-2">
          <Button
            className="w-full"
            variant="outline"
            onTap={() => Taro.navigateTo({ url: '/pages/overlay/index' })}
          >
            Overlay: Popup, Dialog, ActionSheet, Toast
          </Button>
          <Button
            className="w-full"
            variant="outline"
            onTap={() => Taro.navigateTo({ url: '/pages/form/index' })}
          >
            Form: Checkbox, Radio, Switch, Slider, Select
          </Button>
          <Button
            className="w-full"
            variant="outline"
            onTap={() => Taro.navigateTo({ url: '/pages/container/index' })}
          >
            Container: Tabs, Accordion, Alert, Progress
          </Button>
        </View>
      </Section>

      {/* Navigation to Tier 2 demos */}
      <Section title="Tier 2 Demos">
        <View className="space-y-2">
          <Button
            className="w-full"
            variant="outline"
            onTap={() => Taro.navigateTo({ url: '/pages/navigation/index' })}
          >
            Navigation: TabBar, Drawer, Sidebar
          </Button>
          <Button
            className="w-full"
            variant="outline"
            onTap={() => Taro.navigateTo({ url: '/pages/scroll/index' })}
          >
            Scroll: Carousel, InfiniteScroll, VirtualList, SwipeCell
          </Button>
          <Button
            className="w-full"
            variant="outline"
            onTap={() => Taro.navigateTo({ url: '/pages/data/index' })}
          >
            Data: Calendar, DatePicker, DataTable, Command
          </Button>
        </View>
      </Section>

      <Separator className="my-4" />

      {/* Button */}
      <Section title="Button">
        <Typography variant="muted" className="mb-3">
          Variants
        </Typography>
        <View className="flex flex-wrap gap-2 mb-4">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </View>
        <Typography variant="muted" className="mb-3">
          Sizes
        </Typography>
        <View className="flex flex-wrap items-center gap-2">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
        </View>
      </Section>

      {/* Typography */}
      <Section title="Typography">
        <View className="space-y-2">
          <Typography variant="h1" className="text-foreground">
            Heading 1
          </Typography>
          <Typography variant="h2" className="text-foreground">
            Heading 2
          </Typography>
          <Typography variant="h3" className="text-foreground">
            Heading 3
          </Typography>
          <Typography variant="h4" className="text-foreground">
            Heading 4
          </Typography>
          <Typography variant="p" className="text-foreground">
            Paragraph text — the quick brown fox jumps over the lazy dog.
          </Typography>
          <Typography variant="lead">Lead text for introductions</Typography>
          <Typography variant="large" className="text-foreground">
            Large text
          </Typography>
          <Typography variant="small" className="text-foreground">
            Small text
          </Typography>
          <Typography variant="muted">Muted helper text</Typography>
          <Typography variant="code" className="text-foreground">
            code snippet
          </Typography>
        </View>
      </Section>

      {/* Badge */}
      <Section title="Badge">
        <View className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </View>
      </Section>

      {/* Card */}
      <Section title="Card">
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>
              Card description with some helpful context.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Typography variant="p" className="text-foreground">
              This is the card content area. You can put any content here.
            </Typography>
          </CardContent>
          <CardFooter>
            <Button size="sm">Action</Button>
          </CardFooter>
        </Card>
      </Section>

      {/* Input & Textarea */}
      <Section title="Input & Textarea">
        <View className="space-y-4">
          <View>
            <Label className="mb-2 block">Email</Label>
            <Input placeholder="Enter your email" />
          </View>
          <View>
            <Label className="mb-2 block">Password</Label>
            <Input placeholder="Enter password" password />
          </View>
          <View>
            <Label className="mb-2 block">Bio</Label>
            <Textarea
              placeholder="Tell us about yourself..."
              autoHeight
            />
          </View>
        </View>
      </Section>

      {/* Avatar */}
      <Section title="Avatar">
        <View className="flex items-center gap-3">
          <Avatar
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
            alt="Felix"
            size="sm"
          />
          <Avatar
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alice"
            alt="Alice"
            size="default"
          />
          <Avatar
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Bob"
            alt="Bob"
            size="lg"
          />
          <Avatar fallback="CN" size="default" />
          <Avatar alt="User" size="default" />
        </View>
      </Section>

      {/* Skeleton */}
      <Section title="Skeleton">
        <View className="space-y-3">
          <View className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <View className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </View>
          </View>
          <Skeleton className="h-32 w-full rounded-lg" />
        </View>
      </Section>

      {/* Separator */}
      <Section title="Separator">
        <View className="space-y-3">
          <Typography variant="p" className="text-foreground">
            Content above separator
          </Typography>
          <Separator />
          <Typography variant="p" className="text-foreground">
            Content below separator
          </Typography>
        </View>
      </Section>

      {/* Composed: Login Card */}
      <Section title="Composed: Login Card">
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your credentials to continue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <View className="space-y-4">
              <View>
                <Label className="mb-2 block">Email</Label>
                <Input placeholder="name@example.com" />
              </View>
              <View>
                <Label className="mb-2 block">Password</Label>
                <Input placeholder="Password" password />
              </View>
            </View>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Sign In</Button>
          </CardFooter>
        </Card>
      </Section>
    </View>
  )
}
