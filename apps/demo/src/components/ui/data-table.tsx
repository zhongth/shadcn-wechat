import { View, Text, ScrollView } from '@tarojs/components'
import { cn } from '@/lib/utils'

export interface DataTableColumn<T = any> {
  /** Unique column key */
  key: string
  /** Header label */
  header: string | React.ReactNode
  /** Column width (px or flex string) */
  width?: number | string
  /** Custom cell renderer */
  render?: (value: any, row: T, index: number) => React.ReactNode
}

export interface DataTableProps<T = any> {
  className?: string
  /** Column definitions */
  columns: DataTableColumn<T>[]
  /** Data array */
  data: T[]
  /** Called when a row is tapped */
  onRowTap?: (row: T, index: number) => void
  /** Message when data is empty */
  emptyMessage?: string
  /** Enable horizontal scroll for wide tables */
  scrollX?: boolean
  /** Max height for vertical scroll */
  maxHeight?: number | string
}

/**
 * DataTable with flexbox-based rows (no <table> elements).
 *
 * Usage:
 * ```tsx
 * <DataTable
 *   columns={[
 *     { key: 'name', header: 'Name', width: 120 },
 *     { key: 'email', header: 'Email' },
 *     { key: 'role', header: 'Role', width: 80 },
 *   ]}
 *   data={users}
 *   onRowTap={(row) => console.log(row)}
 * />
 * ```
 */
function DataTable<T extends Record<string, any>>({
  className,
  columns,
  data,
  onRowTap,
  emptyMessage = 'No data',
  scrollX = false,
  maxHeight,
}: DataTableProps<T>) {
  const getColumnStyle = (col: DataTableColumn<T>): React.CSSProperties => {
    if (typeof col.width === 'number') {
      return { width: `${col.width}px`, flexShrink: 0 }
    }
    if (typeof col.width === 'string') {
      return { width: col.width, flexShrink: 0 }
    }
    return { flex: 1 }
  }

  const tableContent = (
    <View>
      {/* Header row */}
      <View className="flex flex-row border-b border-border bg-muted/50">
        {columns.map((col) => (
          <View
            key={col.key}
            className="px-3 py-2"
            style={getColumnStyle(col)}
          >
            {typeof col.header === 'string' ? (
              <Text className="text-xs font-medium text-muted-foreground">
                {col.header}
              </Text>
            ) : (
              col.header
            )}
          </View>
        ))}
      </View>

      {/* Body */}
      {data.length === 0 ? (
        <View className="flex items-center justify-center py-8">
          <Text className="text-sm text-muted-foreground">{emptyMessage}</Text>
        </View>
      ) : (
        data.map((row, rowIndex) => (
          <View
            key={rowIndex}
            className={cn(
              'flex flex-row border-b border-border',
              'active:bg-accent transition-colors'
            )}
            onTap={() => onRowTap?.(row, rowIndex)}
          >
            {columns.map((col) => (
              <View
                key={col.key}
                className="px-3 py-2 flex justify-center flex-col"
                style={getColumnStyle(col)}
              >
                {col.render ? (
                  col.render(row[col.key], row, rowIndex)
                ) : (
                  <Text className="text-sm text-foreground truncate">
                    {String(row[col.key] ?? '')}
                  </Text>
                )}
              </View>
            ))}
          </View>
        ))
      )}
    </View>
  )

  // Wrap in ScrollView(s) if needed
  if (scrollX && maxHeight) {
    return (
      <ScrollView
        scrollY
        className={cn('border border-border rounded-md', className)}
        style={{ maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight }}
      >
        <ScrollView scrollX>
          {tableContent}
        </ScrollView>
      </ScrollView>
    )
  }

  if (scrollX) {
    return (
      <ScrollView
        scrollX
        className={cn('border border-border rounded-md', className)}
      >
        {tableContent}
      </ScrollView>
    )
  }

  if (maxHeight) {
    return (
      <ScrollView
        scrollY
        className={cn('border border-border rounded-md', className)}
        style={{ maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight }}
      >
        {tableContent}
      </ScrollView>
    )
  }

  return (
    <View className={cn('border border-border rounded-md', className)}>
      {tableContent}
    </View>
  )
}

export { DataTable }
