import { View, Text } from '@tarojs/components'
import { useState } from 'react'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { SafeArea } from '@/components/ui/safe-area'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'

export default function ContainerDemo() {
  const [progress, setProgress] = useState(33)

  return (
    <View className="p-4 space-y-6">
      <Text className="text-2xl font-bold">Container Components</Text>

      {/* Alert */}
      <View className="space-y-3">
        <Text className="text-lg font-semibold">Alert</Text>
        <Alert>
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            You can add components to your app using the CLI.
          </AlertDescription>
        </Alert>
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Your session has expired. Please log in again.
          </AlertDescription>
        </Alert>
      </View>

      <Separator />

      {/* Progress */}
      <View className="space-y-3">
        <Text className="text-lg font-semibold">Progress</Text>
        <Progress value={progress} />
        <Text className="text-xs text-muted-foreground">{progress}% complete</Text>
        <View className="flex flex-row gap-2">
          <Button
            variant="outline"
            size="sm"
            onTap={() => setProgress(Math.max(0, progress - 10))}
          >
            -10
          </Button>
          <Button
            variant="outline"
            size="sm"
            onTap={() => setProgress(Math.min(100, progress + 10))}
          >
            +10
          </Button>
        </View>
      </View>

      <Separator />

      {/* Tabs */}
      <View className="space-y-3">
        <Text className="text-lg font-semibold">Tabs</Text>
        <Tabs defaultValue="account">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <View className="p-4 bg-muted rounded-md">
              <Text className="text-sm">Account settings and profile information.</Text>
            </View>
          </TabsContent>
          <TabsContent value="password">
            <View className="p-4 bg-muted rounded-md">
              <Text className="text-sm">Change your password and security settings.</Text>
            </View>
          </TabsContent>
          <TabsContent value="settings">
            <View className="p-4 bg-muted rounded-md">
              <Text className="text-sm">General application settings and preferences.</Text>
            </View>
          </TabsContent>
        </Tabs>
      </View>

      <Separator />

      {/* Accordion */}
      <View className="space-y-3">
        <Text className="text-lg font-semibold">Accordion</Text>
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <Text className="text-sm font-medium">Is it accessible?</Text>
            </AccordionTrigger>
            <AccordionContent>
              <Text className="text-sm text-muted-foreground">
                Yes. It adheres to the WAI-ARIA design patterns for accordions.
              </Text>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              <Text className="text-sm font-medium">Is it styled?</Text>
            </AccordionTrigger>
            <AccordionContent>
              <Text className="text-sm text-muted-foreground">
                Yes. It comes with default styles that match the shadcn design system.
              </Text>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>
              <Text className="text-sm font-medium">Is it animated?</Text>
            </AccordionTrigger>
            <AccordionContent>
              <Text className="text-sm text-muted-foreground">
                Yes. It uses CSS transitions for smooth expand/collapse animations.
              </Text>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </View>

      <Separator />

      {/* SafeArea */}
      <View className="space-y-3">
        <Text className="text-lg font-semibold">SafeArea</Text>
        <Text className="text-sm text-muted-foreground">
          SafeArea adds padding for device notches and home indicators.
          It is used internally by bottom-fixed components.
        </Text>
        <SafeArea position="bottom">
          <View className="p-4 bg-muted rounded-md">
            <Text className="text-sm">Content with bottom safe area padding</Text>
          </View>
        </SafeArea>
      </View>
    </View>
  )
}
