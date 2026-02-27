import { View, Text } from '@tarojs/components'
import { useState } from 'react'
import { Button } from '../../components/ui/button'
import { Typography } from '../../components/ui/text'
import { Separator } from '../../components/ui/separator'
import { TabBar } from '../../components/ui/tab-bar'
import { Drawer } from '../../components/ui/drawer'
import {
  Sidebar,
  SidebarMenu,
  SidebarGroup,
  SidebarMenuItem,
} from '../../components/ui/sidebar'

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

export default function NavigationDemo() {
  const [tabBarKey, setTabBarKey] = useState('home')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerLeftOpen, setDrawerLeftOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <View className="p-4 pb-24">
      <View className="mb-6">
        <Typography variant="h2" className="text-foreground">
          Navigation Components
        </Typography>
        <Typography variant="muted" className="mt-1">
          NavigationBar, TabBar, Drawer, Sidebar
        </Typography>
      </View>

      {/* NavigationBar Note */}
      <Section title="NavigationBar">
        <Typography variant="p" className="text-foreground mb-3">
          NavigationBar requires `navigationStyle: 'custom'` in page config.
          It renders a fixed bar at the top with status bar spacing.
        </Typography>
        <Typography variant="muted">
          See the plan for usage: add `navigationStyle: 'custom'` to any
          page's config to enable.
        </Typography>
      </Section>

      {/* TabBar */}
      <Section title="TabBar">
        <Typography variant="muted" className="mb-3">
          Custom bottom tab bar with badges and dot indicators.
          Active: {tabBarKey}
        </Typography>
        <View className="border border-border rounded-lg overflow-hidden h-16 relative">
          <TabBar
            items={[
              {
                key: 'home',
                label: 'Home',
                icon: <Text className="text-lg">🏠</Text>,
              },
              {
                key: 'search',
                label: 'Search',
                icon: <Text className="text-lg">🔍</Text>,
              },
              {
                key: 'cart',
                label: 'Cart',
                icon: <Text className="text-lg">🛒</Text>,
                badge: 3,
              },
              {
                key: 'profile',
                label: 'Profile',
                icon: <Text className="text-lg">👤</Text>,
                dot: true,
              },
            ]}
            activeKey={tabBarKey}
            onTabChange={setTabBarKey}
          />
        </View>
      </Section>

      {/* Drawer */}
      <Section title="Drawer / Sheet">
        <View className="space-y-2">
          <Button
            variant="outline"
            className="w-full"
            onTap={() => setDrawerOpen(true)}
          >
            Open Bottom Drawer
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onTap={() => setDrawerLeftOpen(true)}
          >
            Open Left Drawer
          </Button>
        </View>

        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} position="bottom">
          <View className="p-6">
            <Typography variant="h3" className="text-foreground mb-2">
              Bottom Drawer
            </Typography>
            <Typography variant="p" className="text-foreground mb-4">
              Drag down to dismiss or tap the backdrop. This drawer slides up from the bottom with a drag handle.
            </Typography>
            <Button onTap={() => setDrawerOpen(false)}>Close</Button>
          </View>
          <View style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }} />
        </Drawer>

        <Drawer open={drawerLeftOpen} onOpenChange={setDrawerLeftOpen} position="left">
          <View className="p-6">
            <Typography variant="h3" className="text-foreground mb-2">
              Left Drawer
            </Typography>
            <Typography variant="p" className="text-foreground mb-4">
              This drawer slides in from the left. Swipe left to dismiss.
            </Typography>
            <Button onTap={() => setDrawerLeftOpen(false)}>Close</Button>
          </View>
        </Drawer>
      </Section>

      {/* Sidebar */}
      <Section title="Sidebar">
        <Button
          variant="outline"
          className="w-full"
          onTap={() => setSidebarOpen(true)}
        >
          Open Sidebar
        </Button>

        <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SidebarMenu>
            <SidebarGroup label="Navigation">
              <SidebarMenuItem
                icon={<Text>🏠</Text>}
                active
              >
                Home
              </SidebarMenuItem>
              <SidebarMenuItem icon={<Text>📊</Text>}>
                Dashboard
              </SidebarMenuItem>
              <SidebarMenuItem icon={<Text>📋</Text>}>
                Tasks
              </SidebarMenuItem>
              <SidebarMenuItem
                icon={<Text>💬</Text>}
                badge={<View className="bg-destructive rounded-full px-1.5 py-0.5"><Text className="text-[10px] text-destructive-foreground">5</Text></View>}
              >
                Messages
              </SidebarMenuItem>
            </SidebarGroup>
            <SidebarGroup label="Settings">
              <SidebarMenuItem icon={<Text>⚙️</Text>}>
                Preferences
              </SidebarMenuItem>
              <SidebarMenuItem icon={<Text>👤</Text>}>
                Account
              </SidebarMenuItem>
            </SidebarGroup>
          </SidebarMenu>
        </Sidebar>
      </Section>
    </View>
  )
}
