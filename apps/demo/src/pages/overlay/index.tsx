import { View, Text } from '@tarojs/components'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { ActionSheet } from '@/components/ui/action-sheet'
import { Toaster, toast } from '@/components/ui/toast'
import { Popup } from '@/components/ui/popup'

export default function OverlayDemo() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [actionSheetOpen, setActionSheetOpen] = useState(false)
  const [popupBottom, setPopupBottom] = useState(false)
  const [popupCenter, setPopupCenter] = useState(false)

  return (
    <View className="p-4 space-y-6">
      <Text className="text-2xl font-bold">Overlay Components</Text>

      {/* Popup Section */}
      <View className="space-y-3">
        <Text className="text-lg font-semibold">Popup</Text>
        <Text className="text-sm text-muted-foreground">Base overlay primitive with multiple positions</Text>
        <View className="flex flex-row flex-wrap gap-2">
          <Button onTap={() => setPopupCenter(true)} variant="outline" size="sm">Center Popup</Button>
          <Button onTap={() => setPopupBottom(true)} variant="outline" size="sm">Bottom Popup</Button>
        </View>
      </View>

      <Separator />

      {/* Dialog Section */}
      <View className="space-y-3">
        <Text className="text-lg font-semibold">Dialog</Text>
        <Text className="text-sm text-muted-foreground">Modal dialog for confirmations and forms</Text>
        <Button onTap={() => setDialogOpen(true)} size="sm">Open Dialog</Button>
      </View>

      <Separator />

      {/* ActionSheet Section */}
      <View className="space-y-3">
        <Text className="text-lg font-semibold">ActionSheet</Text>
        <Text className="text-sm text-muted-foreground">Bottom action list with cancel</Text>
        <Button onTap={() => setActionSheetOpen(true)} size="sm">Open ActionSheet</Button>
      </View>

      <Separator />

      {/* Toast Section */}
      <View className="space-y-3">
        <Text className="text-lg font-semibold">Toast</Text>
        <Text className="text-sm text-muted-foreground">Notification messages with auto-dismiss</Text>
        <View className="flex flex-row flex-wrap gap-2">
          <Button onTap={() => toast('This is a message')} variant="outline" size="sm">Default</Button>
          <Button onTap={() => toast.success('Saved successfully')} variant="outline" size="sm">Success</Button>
          <Button onTap={() => toast.error('Something went wrong')} variant="outline" size="sm">Error</Button>
          <Button onTap={() => toast.warning('Be careful')} variant="outline" size="sm">Warning</Button>
        </View>
      </View>

      {/* --- Overlay instances (at page root) --- */}

      <Popup open={popupCenter} onOpenChange={setPopupCenter} position="center">
        <View className="bg-background rounded-lg p-6 w-[80vw] max-w-[300px]">
          <Text className="text-lg font-semibold mb-2">Center Popup</Text>
          <Text className="text-sm text-muted-foreground">This is a center-positioned popup.</Text>
          <View className="mt-4">
            <Button onTap={() => setPopupCenter(false)} size="sm">Close</Button>
          </View>
        </View>
      </Popup>

      <Popup open={popupBottom} onOpenChange={setPopupBottom} position="bottom">
        <View className="bg-background rounded-t-xl p-6">
          <Text className="text-lg font-semibold mb-2">Bottom Popup</Text>
          <Text className="text-sm text-muted-foreground mb-4">This slides up from the bottom.</Text>
          <Button onTap={() => setPopupBottom(false)} size="sm">Close</Button>
        </View>
      </Popup>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              Are you sure you want to proceed? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>
              <Button variant="outline" size="sm">Cancel</Button>
            </DialogClose>
            <Button size="sm" onTap={() => { setDialogOpen(false); toast.success('Confirmed!') }}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ActionSheet
        open={actionSheetOpen}
        onOpenChange={setActionSheetOpen}
        title="Choose an action"
        actions={[
          { label: 'Edit', value: 'edit' },
          { label: 'Share', value: 'share' },
          { label: 'Delete', value: 'delete', destructive: true },
        ]}
        onAction={(value) => toast(`Selected: ${value}`)}
      />

      <Toaster />
    </View>
  )
}
