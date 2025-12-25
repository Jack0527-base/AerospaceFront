import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(input: Date | string | number): string {
  const date = input instanceof Date ? input : new Date(input)
  
  try {
    return format(date, 'yyyy年MM月dd日 HH:mm', { locale: zhCN })
  } catch (error) {
    console.error('日期格式化错误:', error)
    return '无效日期'
  }
}

export function formatPlateNumber(plate: string): string {
  // 简单的车牌号格式化
  return plate.toUpperCase()
} 