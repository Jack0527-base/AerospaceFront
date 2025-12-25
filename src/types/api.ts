// API 基础类型定义
export interface Message {
  code: string
  description: string
}

// 基础响应接口
export interface BaseResponse {
  isSuccess: boolean
  messages?: Message[]
}

// ============ 认证相关类型 ============

// 注册请求
export interface RegisterRequest {
  email: string
  username: string
  password: string
}

// 注册响应
export interface RegisterResponse extends BaseResponse {
  url?: string
}

// 登录请求
export interface LoginRequest {
  email: string
  password: string
}

// 登录响应
export interface LoginResponse extends BaseResponse {
  id?: string
  token?: string
  expires?: string
}

// ============ 用户档案相关类型 ============

// 基础用户档案响应
export interface ProfileResponse extends BaseResponse {
  username?: string
  avatarBase64?: string
}

// 详细用户档案响应
export interface DetailedProfileResponse extends BaseResponse {
  email?: string
  username?: string
  avatarBase64?: string
}

// 头像更改请求
export interface ProfileAvatarChangeRequest {
  avatarBase64?: string
}

// 头像更改响应
export interface ProfileAvatarChangeResponse extends BaseResponse {}

// ============ 本地应用类型（用于状态管理） ============

// 用户信息（本地使用）
export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  name?: string
}

// 认证响应（本地API）
export interface AuthResponse {
  success: boolean
  message: string
  user?: User
  storage?: 'file'
}

// 车牌记录类型
export interface PlateRecord {
  id: string
  plateNumber: string
  timestamp: string | Date
  imageUrl: string
}

// ============ API 配置类型 ============

export interface ApiConfig {
  baseUrl: string
  timeout: number
  debug: boolean
}

// HTTP方法类型  
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

// 请求选项
export interface RequestOptions {
  method?: HttpMethod
  headers?: Record<string, string>
  body?: any
  timeout?: number
}

// 响应类型
export interface ApiResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: Record<string, string>
}

// ============ API信息相关类型 ============

// API版本响应
export interface ApiVersionResponse {
  appName: string
  version: string
}

// ============ 车牌检测相关类型 ============

// 车牌检测请求（Base64）
export interface DetectRequest {
  imageBase64: string
}

// 矩形位置信息
export interface Rect {
  x: number | null
  y: number | null
  width: number | null
  height: number | null
}

// 车牌信息（暂时复用，用于绝缘子检测）
export interface PlateInfo {
  number: string
  confidence: number | null
  rect: Rect
  color: string
  class?: string // 添加class字段：'insulator' | 'crack' | 'defect' 等
}

// 车牌检测响应
export interface DetectResponse extends BaseResponse {
  infos?: PlateInfo[]
} 