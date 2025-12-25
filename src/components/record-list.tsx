"use client"

import { useEffect, useState } from 'react'
import { FilterType, PlateRecord, useRecordsStore } from '@/lib/store'
import { FilterTabs } from '@/components/filter-tabs'
import { RecordCard } from '@/components/record-card'
import { Search } from 'lucide-react'

export function RecordList() {
  const { records, isLoading, filterType, fetchRecords } = useRecordsStore()
  const [searchQuery, setSearchQuery] = useState('')
  
  useEffect(() => {
    fetchRecords()
  }, [fetchRecords])
  
  // 根据过滤类型筛选记录
  const filteredRecords = filterRecords(records, filterType, searchQuery)
  
  return (
    <div className="space-y-6 bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-[#4776e6]">识别记录</h2>
        <FilterTabs />
      </div>
      
      {/* 搜索框 */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="搜索车牌号..."
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4776e6] focus:border-[#4776e6] outline-none transition-colors"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-10 text-gray-500">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-t-[#4776e6] rounded-full animate-spin mb-3"></div>
            <p>加载中...</p>
          </div>
        </div>
      ) : filteredRecords.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRecords.map((record, index) => (
            <RecordCard key={record.id} record={record} index={index} />
          ))}
        </div>
      ) : (
        <div className="flex justify-center py-10 text-gray-500">
          <p>没有找到符合条件的记录</p>
        </div>
      )}
    </div>
  )
}

// 根据过滤类型和搜索查询筛选记录
function filterRecords(records: PlateRecord[], filterType: FilterType, searchQuery: string): PlateRecord[] {
  const now = new Date()
  let filtered = [...records]
  
  // 首先按照过滤类型筛选
  switch (filterType) {
    case 'today': {
      const today = new Date(now)
      today.setHours(0, 0, 0, 0)
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.timestamp)
        return recordDate >= today
      })
      break
    }
    case 'week': {
      const weekStart = new Date(now)
      weekStart.setDate(weekStart.getDate() - weekStart.getDay())
      weekStart.setHours(0, 0, 0, 0)
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.timestamp)
        return recordDate >= weekStart
      })
      break
    }
    case 'month': {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.timestamp)
        return recordDate >= monthStart
      })
      break
    }
  }
  
  // 然后根据搜索查询进一步筛选
  if (searchQuery.trim()) {
    const query = searchQuery.trim().toLowerCase()
    filtered = filtered.filter(record => 
      record.plateNumber.toLowerCase().includes(query)
    )
  }
  
  return filtered
} 