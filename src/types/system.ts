// 系统状态相关类型定义

export interface SystemStatusData {
  cpu: number
  memory: number
  disk: number
  timestamp: string
  platform: string
  uptime: number
}

export interface SystemStatusResponse {
  success: boolean
  data: SystemStatusData
  message?: string
}

export interface SystemStatusState {
  cpu: number
  memory: number
  disk: number
  loading: boolean
} 