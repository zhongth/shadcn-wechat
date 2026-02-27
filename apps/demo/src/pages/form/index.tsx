import { View, Text } from '@tarojs/components'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form'
import { Toaster, toast } from '@/components/ui/toast'

export default function FormDemo() {
  // Checkbox
  const [checked, setChecked] = useState(false)

  // Radio
  const [radioValue, setRadioValue] = useState('option1')

  // Switch
  const [switchOn, setSwitchOn] = useState(false)

  // Slider
  const [sliderValue, setSliderValue] = useState(50)

  // Select
  const [selectValue, setSelectValue] = useState('')

  // Form
  const [formName, setFormName] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formError, setFormError] = useState('')

  const handleSubmit = () => {
    if (!formName.trim()) {
      setFormError('Name is required')
      return
    }
    setFormError('')
    toast.success(`Submitted: ${formName}, ${formEmail}`)
  }

  return (
    <View className="p-4 space-y-6">
      <Text className="text-2xl font-bold">Form Controls</Text>

      {/* Checkbox */}
      <View className="space-y-3">
        <Text className="text-lg font-semibold">Checkbox</Text>
        <View className="flex flex-row items-center space-x-2">
          <Checkbox checked={checked} onCheckedChange={setChecked} />
          <Label>Accept terms and conditions</Label>
        </View>
        <Text className="text-xs text-muted-foreground">
          Checked: {checked ? 'Yes' : 'No'}
        </Text>
      </View>

      <Separator />

      {/* Radio Group */}
      <View className="space-y-3">
        <Text className="text-lg font-semibold">Radio Group</Text>
        <RadioGroup value={radioValue} onValueChange={setRadioValue}>
          <View className="flex flex-row items-center space-x-2">
            <RadioGroupItem value="option1" />
            <Label>Option 1</Label>
          </View>
          <View className="flex flex-row items-center space-x-2">
            <RadioGroupItem value="option2" />
            <Label>Option 2</Label>
          </View>
          <View className="flex flex-row items-center space-x-2">
            <RadioGroupItem value="option3" />
            <Label>Option 3</Label>
          </View>
        </RadioGroup>
        <Text className="text-xs text-muted-foreground">
          Selected: {radioValue}
        </Text>
      </View>

      <Separator />

      {/* Switch */}
      <View className="space-y-3">
        <Text className="text-lg font-semibold">Switch</Text>
        <View className="flex flex-row items-center space-x-2">
          <Switch checked={switchOn} onCheckedChange={setSwitchOn} />
          <Label>Enable notifications</Label>
        </View>
        <Text className="text-xs text-muted-foreground">
          Status: {switchOn ? 'On' : 'Off'}
        </Text>
      </View>

      <Separator />

      {/* Slider */}
      <View className="space-y-3">
        <Text className="text-lg font-semibold">Slider</Text>
        <Slider
          value={sliderValue}
          onValueChange={setSliderValue}
          min={0}
          max={100}
          step={1}
        />
        <Text className="text-xs text-muted-foreground">
          Value: {sliderValue}
        </Text>
      </View>

      <Separator />

      {/* Select */}
      <View className="space-y-3">
        <Text className="text-lg font-semibold">Select</Text>
        <Select value={selectValue} onValueChange={setSelectValue}>
          <SelectTrigger placeholder="Choose a framework" />
          <SelectContent>
            <SelectItem value="react">React</SelectItem>
            <SelectItem value="vue">Vue</SelectItem>
            <SelectItem value="angular">Angular</SelectItem>
            <SelectItem value="svelte">Svelte</SelectItem>
          </SelectContent>
        </Select>
        <Text className="text-xs text-muted-foreground">
          Selected: {selectValue || 'None'}
        </Text>
      </View>

      <Separator />

      {/* Form */}
      <View className="space-y-3">
        <Text className="text-lg font-semibold">Form</Text>
        <Form>
          <FormField name="name" error={formError}>
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your name"
                  value={formName}
                  onInput={(e) => setFormName(e.detail.value)}
                />
              </FormControl>
              <FormDescription>Your display name</FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="email">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your email"
                  value={formEmail}
                  onInput={(e) => setFormEmail(e.detail.value)}
                />
              </FormControl>
              <FormDescription>We will never share your email</FormDescription>
            </FormItem>
          </FormField>

          <Button onTap={handleSubmit}>Submit</Button>
        </Form>
      </View>

      <Toaster />
    </View>
  )
}
