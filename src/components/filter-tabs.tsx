"use client"

import { FilterType, useRecordsStore } from '@/lib/store'
import { cn } from '@/lib/utils'

interface FilterOption {
  value: FilterType
  label: string
}

const filterOptions: FilterOption[] = [
  { value: 'all', label: '全部' },
  { value: 'today', label: '今日' },
  { value: 'week', label: '本周' },
  { value: 'month', label: '本月' }
]

export function FilterTabs() {
  const { filterType, setFilterType } = useRecordsStore()
  
  return (
    <div className="flex space-x-1 p-1 rounded-lg bg-gray-50 border border-gray-100">
      {filterOptions.map(option => (
        <button
          key={option.value}
          onClick={() => setFilterType(option.value)}
          className={cn(
            "flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all",
            filterType === option.value
              ? "bg-white shadow-sm text-[#4776e6]"
              : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
} 