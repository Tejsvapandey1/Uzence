import type { Meta, StoryObj } from '@storybook/react'
import { DataTable } from './DataTable'
import type { Column } from './DataTable'

type Row = { id: number; name: string; age: number }

const meta: Meta<typeof DataTable<Row>> = {
  title: 'Components/DataTable',
  component: DataTable<Row>,
}
export default meta

type Story = StoryObj<typeof DataTable<Row>>

const data: Row[] = [
  { id: 1, name: 'Alice', age: 24 },
  { id: 2, name: 'Bob', age: 30 },
  { id: 3, name: 'Charlie', age: 28 },
]

const columns: Column<Row>[] = [
  { key: 'id', title: 'ID', dataIndex: 'id', sortable: true },
  { key: 'name', title: 'Name', dataIndex: 'name', sortable: true },
  { key: 'age', title: 'Age', dataIndex: 'age', sortable: true },
]

export const DefaultTable: Story = {
  render: () => <DataTable<Row> data={data} columns={columns} selectable />,
}
