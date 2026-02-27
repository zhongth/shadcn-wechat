import { View, Text } from '@tarojs/components'
import { useState } from 'react'
import { Typography } from '../../components/ui/text'
import { Separator } from '../../components/ui/separator'
import { Badge } from '../../components/ui/badge'
import { Calendar } from '../../components/ui/calendar'
import { DatePicker } from '../../components/ui/date-picker'
import { DataTable, type DataTableColumn } from '../../components/ui/data-table'
import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandEmpty,
  CommandSeparator,
} from '../../components/ui/command'

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

// Sample data for DataTable
interface User {
  name: string
  email: string
  role: string
  status: string
}

const users: User[] = [
  { name: 'Alice Wang', email: 'alice@example.com', role: 'Admin', status: 'Active' },
  { name: 'Bob Chen', email: 'bob@example.com', role: 'Editor', status: 'Active' },
  { name: 'Charlie Li', email: 'charlie@example.com', role: 'Viewer', status: 'Inactive' },
  { name: 'Diana Zhang', email: 'diana@example.com', role: 'Editor', status: 'Active' },
  { name: 'Edward Liu', email: 'edward@example.com', role: 'Viewer', status: 'Active' },
]

const columns: DataTableColumn<User>[] = [
  { key: 'name', header: 'Name', width: 100 },
  { key: 'role', header: 'Role', width: 70 },
  {
    key: 'status',
    header: 'Status',
    width: 80,
    render: (value: string) => (
      <Badge variant={value === 'Active' ? 'default' : 'secondary'}>
        {value}
      </Badge>
    ),
  },
]

export default function DataDemo() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [rangeDate, setRangeDate] = useState<{ from: Date; to?: Date } | undefined>()
  const [pickerDate, setPickerDate] = useState<Date | undefined>()

  return (
    <View className="p-4 pb-8">
      <View className="mb-6">
        <Typography variant="h2" className="text-foreground">
          Data Components
        </Typography>
        <Typography variant="muted" className="mt-1">
          Calendar, DatePicker, DataTable, Command
        </Typography>
      </View>

      {/* Calendar - Single */}
      <Section title="Calendar (Single)">
        <View className="border border-border rounded-lg">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(d) => setSelectedDate(d as Date)}
          />
        </View>
        {selectedDate && (
          <Typography variant="muted" className="mt-2">
            Selected: {selectedDate.toLocaleDateString()}
          </Typography>
        )}
      </Section>

      {/* Calendar - Range */}
      <Section title="Calendar (Range)">
        <View className="border border-border rounded-lg">
          <Calendar
            mode="range"
            selected={rangeDate}
            onSelect={(d) => setRangeDate(d as { from: Date; to?: Date })}
          />
        </View>
        {rangeDate && (
          <Typography variant="muted" className="mt-2">
            {rangeDate.from.toLocaleDateString()}
            {rangeDate.to ? ` → ${rangeDate.to.toLocaleDateString()}` : ' → ...'}
          </Typography>
        )}
      </Section>

      {/* DatePicker */}
      <Section title="DatePicker">
        <DatePicker
          value={pickerDate}
          onValueChange={setPickerDate}
          placeholder="Pick a date"
        />
        {pickerDate && (
          <Typography variant="muted" className="mt-2">
            Picked: {pickerDate.toLocaleDateString()}
          </Typography>
        )}
      </Section>

      {/* DataTable */}
      <Section title="DataTable">
        <DataTable
          columns={columns}
          data={users}
          scrollX
          onRowTap={(row) => {
            console.log('Tapped row:', row.name)
          }}
        />
      </Section>

      {/* DataTable Empty */}
      <Section title="DataTable (Empty)">
        <DataTable
          columns={columns}
          data={[]}
          emptyMessage="No users found"
        />
      </Section>

      {/* Command */}
      <Section title="Command / Search">
        <Command>
          <CommandInput placeholder="Search actions..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem value="calendar" onSelect={(v) => console.log(v)}>
                <Text className="text-foreground">📅 Calendar</Text>
              </CommandItem>
              <CommandItem value="search" onSelect={(v) => console.log(v)}>
                <Text className="text-foreground">🔍 Search</Text>
              </CommandItem>
              <CommandItem value="settings" onSelect={(v) => console.log(v)}>
                <Text className="text-foreground">⚙️ Settings</Text>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Actions">
              <CommandItem value="profile" onSelect={(v) => console.log(v)}>
                <Text className="text-foreground">👤 Profile</Text>
              </CommandItem>
              <CommandItem value="logout" onSelect={(v) => console.log(v)}>
                <Text className="text-foreground">🚪 Logout</Text>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </Section>
    </View>
  )
}
