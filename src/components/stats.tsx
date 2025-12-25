"use client"

import { useEffect, useState } from 'react'
import { CalendarDays, Clock, Car, TrendingUp, Newspaper } from 'lucide-react'
import { useRecordsStore, PlateRecord } from '@/lib/store'

export function Stats() {
  const records = useRecordsStore(state => state.records)
  const isLoading = useRecordsStore(state => state.isLoading)
  
  // 计算各种统计数据
  const totalRecords = records.length
  
  const todayRecords = records.filter(record => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const recordDate = new Date(record.timestamp)
    return recordDate >= today
  }).length
  
  const weekRecords = records.filter(record => {
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - weekStart.getDay())
    weekStart.setHours(0, 0, 0, 0)
    const recordDate = new Date(record.timestamp)
    return recordDate >= weekStart
  }).length
  
  // 计算今天相比昨天的增长率
  const yesterdayRecords = records.filter(record => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const recordDate = new Date(record.timestamp)
    return recordDate >= yesterday && recordDate < today
  }).length
  
  const growthRate = yesterdayRecords > 0 
    ? Math.round((todayRecords - yesterdayRecords) / yesterdayRecords * 100) 
    : (todayRecords > 0 ? 100 : 0)
  
  // 查找最常见的车牌前缀
  const prefixCounts: Record<string, number> = {}
  records.forEach(record => {
    // 提取省份和城市代码，如"京A"、"粤B"等
    const prefix = record.plateNumber.substring(0, 2)
    prefixCounts[prefix] = (prefixCounts[prefix] || 0) + 1
  })
  
  // 寻找最常见的前缀
  let mostCommonPrefix = ''
  let maxCount = 0
  Object.entries(prefixCounts).forEach(([prefix, count]) => {
    if (count > maxCount) {
      mostCommonPrefix = prefix
      maxCount = count
    }
  })
  
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard 
          title="今日识别" 
          value={todayRecords} 
          icon={<Clock className="h-6 w-6 text-[#4776e6]" />}
          isLoading={isLoading}
          delay={0}
          additionalInfo={
            <div className={`text-xs mt-2 flex items-center ${growthRate > 0 ? 'text-green-500' : growthRate < 0 ? 'text-red-500' : 'text-gray-500'}`}>
              <TrendingUp size={14} className="mr-1" />
              <span>较昨日 {growthRate > 0 ? '+' : ''}{growthRate}%</span>
            </div>
          }
        />
        
        <StatsCard 
          title="本周识别" 
          value={weekRecords} 
          icon={<CalendarDays className="h-6 w-6 text-[#4776e6]" />}
          isLoading={isLoading}
          delay={150}
          additionalInfo={
            <div className="w-full h-1 bg-gray-100 rounded-full mt-3">
              <div 
                className="h-1 bg-[#4776e6] rounded-full" 
                style={{ width: `${Math.min(weekRecords / 100 * 100, 100)}%` }}
              ></div>
            </div>
          }
        />
        
        <StatsCard 
          title="总识别数量" 
          value={totalRecords} 
          icon={<Car className="h-6 w-6 text-[#4776e6]" />}
          isLoading={isLoading}
          delay={300}
        />
      </div>
      
      {/* 额外统计信息 */}
      {!isLoading && maxCount > 0 && (
        <div className="grid gap-4 md:grid-cols-1">
          <StatsCard 
            title="最常见车牌区域" 
            value={mostCommonPrefix} 
            icon={<Newspaper className="h-6 w-6 text-[#4776e6]" />}
            isLoading={isLoading}
            delay={450}
            additionalInfo={
              <div className="text-xs mt-2 text-gray-500 flex justify-between">
                <span>出现次数: {maxCount}</span>
                <span>占比: {Math.round(maxCount / totalRecords * 100)}%</span>
              </div>
            }
            valueClassName="text-2xl"
          />
        </div>
      )}
    </div>
  )
}

interface StatsCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  isLoading: boolean
  delay: number
  additionalInfo?: React.ReactNode
  valueClassName?: string
}

function StatsCard({ title, value, icon, isLoading, delay, additionalInfo, valueClassName = "text-3xl" }: StatsCardProps) {
  const [animatedValue, setAnimatedValue] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    // 添加延迟显示效果
    const showTimer = setTimeout(() => {
      setIsVisible(true)
    }, delay)
    
    return () => clearTimeout(showTimer)
  }, [delay])
  
  useEffect(() => {
    // 数字动画效果
    if (isVisible && !isLoading && typeof value === 'number') {
      let startValue = 0
      const duration = 1000 // 动画持续时间（毫秒）
      const step = Math.max(1, Math.ceil(value / (duration / 16))) // 每16ms更新一次
      
      const timer = setInterval(() => {
        startValue += step
        if (startValue >= value) {
          setAnimatedValue(value)
          clearInterval(timer)
        } else {
          setAnimatedValue(startValue)
        }
      }, 16)
      
      return () => clearInterval(timer)
    }
  }, [value, isVisible, isLoading])
  
  const animationStyle = {
    transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
    opacity: isVisible ? 1 : 0,
    transition: `transform 0.5s ease ${delay}ms, opacity 0.5s ease ${delay}ms`
  }
  
  return (
    <div 
      className="rounded-lg bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300" 
      style={animationStyle}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className="rounded-full bg-blue-50 p-2 float-animation">
          {icon}
        </div>
      </div>
      
      {isLoading ? (
        <div className="h-9 flex items-center">
          <div className="w-16 h-6 bg-gray-100 animate-pulse rounded"></div>
        </div>
      ) : (
        <div className={`${valueClassName} font-bold text-gray-800`}>
          {typeof value === 'number' ? animatedValue : value}
        </div>
      )}
      
      {additionalInfo && !isLoading && (
        <div>{additionalInfo}</div>
      )}
    </div>
  )
} 