"use client"

import { useState, useEffect } from 'react'
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  BarElement
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import { useRecordsStore, PlateRecord } from '@/lib/store'
import { startOfWeek, startOfDay, format, eachDayOfInterval, addDays, isWithinInterval } from 'date-fns'
import { zhCN } from 'date-fns/locale'

// 注册Chart.js组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

// 图表类型选项
type ChartType = 'line' | 'bar'
// 时间范围选项
type TimeRange = 'week' | 'month'

export function RecordChart() {
  const records = useRecordsStore(state => state.records)
  const [chartType, setChartType] = useState<ChartType>('bar')
  const [timeRange, setTimeRange] = useState<TimeRange>('week')
  
  // 准备数据
  const chartData = prepareChartData(records, timeRange)
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: timeRange === 'week' ? '本周识别趋势' : '本月识别趋势',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        }
      }
    }
  }
  
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#4776e6]">识别趋势</h2>
        
        <div className="flex space-x-2">
          {/* 图表类型选择 */}
          <div className="flex rounded-md overflow-hidden border border-[#4776e6]">
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1 text-xs ${chartType === 'bar' ? 'bg-[#4776e6] text-white' : 'bg-white text-[#4776e6]'}`}
            >
              柱状图
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`px-3 py-1 text-xs ${chartType === 'line' ? 'bg-[#4776e6] text-white' : 'bg-white text-[#4776e6]'}`}
            >
              折线图
            </button>
          </div>
          
          {/* 时间范围选择 */}
          <div className="flex rounded-md overflow-hidden border border-[#4776e6]">
            <button
              onClick={() => setTimeRange('week')}
              className={`px-3 py-1 text-xs ${timeRange === 'week' ? 'bg-[#4776e6] text-white' : 'bg-white text-[#4776e6]'}`}
            >
              本周
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-3 py-1 text-xs ${timeRange === 'month' ? 'bg-[#4776e6] text-white' : 'bg-white text-[#4776e6]'}`}
            >
              本月
            </button>
          </div>
        </div>
      </div>
      
      <div className="h-64">
        {chartType === 'line' ? (
          <Line options={options} data={chartData} />
        ) : (
          <Bar options={options} data={chartData} />
        )}
      </div>
    </div>
  )
}

// 准备图表数据
function prepareChartData(records: PlateRecord[], timeRange: TimeRange) {
  const today = new Date()
  let startDate: Date
  let days: Date[]
  
  // 确定时间范围
  if (timeRange === 'week') {
    startDate = startOfWeek(today, { locale: zhCN })
    days = eachDayOfInterval({ start: startDate, end: today })
  } else { // month
    startDate = new Date(today.getFullYear(), today.getMonth(), 1)
    days = eachDayOfInterval({ start: startDate, end: today })
  }
  
  // 生成标签和计算每天的记录数
  const labels = days.map(day => format(day, 'MM-dd', { locale: zhCN }))
  const data = days.map(day => {
    const dayStart = startOfDay(day)
    const dayEnd = addDays(dayStart, 1)
    
    return records.filter(record => {
      const recordDate = new Date(record.timestamp)
      return isWithinInterval(recordDate, { start: dayStart, end: dayEnd })
    }).length
  })
  
  return {
    labels,
    datasets: [
      {
        label: '车牌识别数量',
        data,
        borderColor: '#4776e6',
        backgroundColor: 'rgba(71, 118, 230, 0.5)',
      },
    ],
  }
} 