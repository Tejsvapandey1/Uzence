import React, { useMemo, useState } from 'react'
import clsx from 'clsx'

export interface Column<T> {
  key: string
  title: string
  dataIndex: keyof T
  sortable?: boolean
  render?: (value: any, row: T) => React.ReactNode
}

export interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  selectable?: boolean
  onRowSelect?: (selectedRows: T[]) => void
  emptyText?: string
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading,
  selectable = false,
  onRowSelect,
  emptyText = 'No data',
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [selected, setSelected] = useState<Set<number>>(new Set())

  const sortedData = useMemo(() => {
    if (!sortKey) return data
    const col = columns.find((c) => c.key === sortKey)
    if (!col) return data
    const idx = col.dataIndex as string
    return [...data].sort((a, b) => {
      const av = a[idx]
      const bv = b[idx]
      if (av == null) return 1
      if (bv == null) return -1
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av
      }
      const sa = String(av)
      const sb = String(bv)
      return sortDir === 'asc' ? sa.localeCompare(sb) : sb.localeCompare(sa)
    })
  }, [data, sortKey, sortDir, columns])

  function toggleSort(key: string, sortable?: boolean) {
    if (!sortable) return
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  function toggleSelectRow(index: number) {
    const newSet = new Set(selected)
    if (newSet.has(index)) newSet.delete(index)
    else newSet.add(index)
    setSelected(newSet)
    onRowSelect?.([...newSet].map((i) => sortedData[i]))
  }

  function toggleSelectAll() {
    if (selected.size === sortedData.length) {
      setSelected(new Set())
      onRowSelect?.([])
    } else {
      const all = new Set(sortedData.map((_, i) => i))
      setSelected(all)
      onRowSelect?.([...all].map((i) => sortedData[i]))
    }
  }

  return (
    <div className="w-full overflow-x-auto rounded-xl shadow-md border border-gray-200">
      <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        {/* Sticky, styled header */}
        <thead className="bg-gray-100 sticky top-0 z-10 shadow-sm">
          <tr>
            {selectable && (
              <th className="px-4 py-3 w-12">
                <input
                  type="checkbox"
                  aria-label="Select all rows"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={selected.size === sortedData.length && sortedData.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
            )}
            {columns.map((col, idx) => (
              <th
                key={col.key}
                scope="col"
                className={clsx(
                  'px-6 py-3 text-left text-gray-700 font-semibold uppercase tracking-wide select-none text-sm',
                  col.sortable && 'cursor-pointer hover:text-blue-600 transition-colors',
                  idx === 0 && 'rounded-tl-lg',
                  idx === columns.length - 1 && !selectable && 'rounded-tr-lg'
                )}
                onClick={() => toggleSort(col.key, col.sortable)}
                aria-sort={
                  sortKey === col.key ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'
                }
              >
                <div className="flex items-center gap-1">
                  <span>{col.title}</span>
                  {col.sortable && sortKey === col.key && (
                    <span aria-hidden className="text-xs">{sortDir === 'asc' ? '▲' : '▼'}</span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td
                colSpan={columns.length + (selectable ? 1 : 0)}
                className="px-6 py-10 text-center text-gray-500"
              >
                <span className="animate-pulse">Loading...</span>
              </td>
            </tr>
          ) : sortedData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (selectable ? 1 : 0)}
                className="px-6 py-10 text-center text-gray-400 italic"
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            sortedData.map((row, idx) => (
              <tr
                key={idx}
                className={clsx(
                  'transition-colors duration-200',
                  idx % 2 === 0 ? 'bg-gray-50' : 'bg-white',
                  'hover:bg-blue-50',
                  selected.has(idx) && 'bg-blue-100'
                )}
              >
                {selectable && (
                  <td className="px-4 py-3 w-12">
                    <input
                      type="checkbox"
                      checked={selected.has(idx)}
                      onChange={() => toggleSelectRow(idx)}
                      aria-label={`Select row ${idx + 1}`}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                )}
                {columns.map((col, colIdx) => (
                  <td
                    key={col.key}
                    className={clsx(
                      'px-6 py-4 text-gray-700',
                      colIdx === 0 && 'font-medium text-gray-900'
                    )}
                  >
                    {col.render ? col.render(row[col.dataIndex], row) : String(row[col.dataIndex])}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

    </div>
  )
}
