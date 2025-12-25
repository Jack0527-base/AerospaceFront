import { create } from 'zustand'
import { api } from './api'

// 定义车牌识别记录类型
export interface PlateRecord {
  id: string
  plateNumber: string
  timestamp: string | Date  // 改为可以是字符串或日期对象
  imageUrl: string
}

// 定义API响应类型 - 修复数据结构
interface AuthResponse {
  success: boolean
  message: string
  user?: {
    id: string
    username: string
    email: string
    avatar: string
    name: string
  }
}

interface PlateResponse extends PlateRecord {}

// 定义认证状态
export interface AuthState {
  isAuthenticated: boolean
  user: {
    id?: string
    username?: string
    name: string
    avatar: string
    email?: string
  } | null
  login: (username: string, password: string) => Promise<boolean>
  setUser: (user: {
    id: string
    username: string
    name: string
    avatar: string
    email: string
  }) => void
  updateUser: (user: {
    id?: string
    username?: string
    name?: string
    avatar?: string
    email?: string
  }) => void
  updateAvatar: (avatarUrl: string) => void
  logout: () => void
}

// 定义记录过滤类型
export type FilterType = 'all' | 'today' | 'week' | 'month'

// 定义记录状态
export interface RecordsState {
  records: PlateRecord[]
  isLoading: boolean
  filterType: FilterType
  setFilterType: (type: FilterType) => void
  fetchRecords: () => Promise<void>
  addRecord: (record: Omit<PlateRecord, 'id'>) => Promise<void>
  deleteRecord: (id: string) => Promise<void>
}

// 创建认证存储
export const useAuthStore = create<AuthState>((set, get) => {
  // 初始化时从localStorage恢复头像
  const initializeAvatar = () => {
    if (typeof window !== 'undefined') {
      const savedAvatar = localStorage.getItem('userAvatar')
      const currentUser = get().user
      if (savedAvatar && currentUser) {
        set({
          user: {
            ...currentUser,
            avatar: savedAvatar
          }
        })
      }
    }
  }
  
  return {
    isAuthenticated: false,
    user: null,
    
    login: async (username, password) => {
      try {
        console.log('Store: 开始登录流程', { username })
        
        const response = await api.auth.login(username, password) as AuthResponse
        console.log('Store: API响应', response)
        
        if (response && response.success && response.user) {
          console.log('Store: 登录成功，设置用户状态')
          set({
            isAuthenticated: true,
            user: {
              id: response.user.id,
              username: response.user.username,
              name: response.user.name || response.user.username,
              avatar: response.user.avatar || '/avatar.png',
              email: response.user.email
            }
          })
          return true
        } else {
          console.log('Store: 登录失败 - API返回无效响应', response)
          return false
        }
      } catch (error) {
        console.error('Store: 登录异常', error)
        return false
      }
    },
    
    setUser: (user) => {
      console.log('Store: 直接设置用户信息', user)
      
      // 检查是否有保存的头像
      let avatarUrl = user.avatar
      if (typeof window !== 'undefined') {
        const savedAvatar = localStorage.getItem('userAvatar')
        if (savedAvatar) {
          avatarUrl = savedAvatar
        }
      }
      
      set({
        isAuthenticated: true,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          avatar: avatarUrl,
          email: user.email
        }
      })
    },
    
    updateUser: (updatedUser) => {
      console.log('Store: 更新用户信息', updatedUser)
      set((state) => ({
        user: state.user ? {
          ...state.user,
          ...updatedUser,
          name: updatedUser.name || updatedUser.username || state.user.name
        } : null
      }))
    },
    
    updateAvatar: (avatarUrl) => {
      console.log('Store: 更新用户头像', avatarUrl)
      set((state) => ({
        user: state.user ? {
          ...state.user,
          avatar: avatarUrl
        } : null
      }))
      
      // 同时保存到localStorage以持久化
      if (typeof window !== 'undefined') {
        localStorage.setItem('userAvatar', avatarUrl)
      }
    },
    
    logout: async () => {
      try {
        // 调用登出API
        await api.auth.logout()
      } catch (error) {
        console.error('登出失败:', error)
      } finally {
        // 清除头像缓存
        if (typeof window !== 'undefined') {
          localStorage.removeItem('userAvatar')
        }
        set({
          isAuthenticated: false,
          user: null
        })
      }
    }
  }
})

// 创建记录存储
export const useRecordsStore = create<RecordsState>((set, get) => ({
  records: [],
  isLoading: false,
  filterType: 'all',
  
  setFilterType: (type) => set({ filterType: type }),
  
  fetchRecords: async () => {
    set({ isLoading: true })
    
    try {
      // 使用真实API调用获取记录
      const response = await api.plates.list() as PlateRecord[]
      if (response && Array.isArray(response)) {
        set({ records: response, isLoading: false })
      } else {
        // 如果API尚未实现，使用模拟数据
        const mockRecords: PlateRecord[] = [
          {
            id: '1',
            plateNumber: '京A12345',
            timestamp: new Date().toISOString(),
            imageUrl: 'https://images.unsplash.com/photo-1581288869433-56a1059c47d8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
          },
          {
            id: '2',
            plateNumber: '粤B54321',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            imageUrl: 'https://images.unsplash.com/photo-1700493624968-74d01c22e704?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
          },
          {
            id: '3',
            plateNumber: '沪C98765',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            imageUrl: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
          }
        ]
        set({ records: mockRecords, isLoading: false })
      }
    } catch (error) {
      console.error('获取记录失败:', error)
      set({ isLoading: false })
    }
  },
  
  addRecord: async (record) => {
    set({ isLoading: true })
    
    try {
      // 使用真实API调用添加记录
      const response = await api.plates.create({
        plateNumber: record.plateNumber,
        imageUrl: record.imageUrl
      }) as PlateResponse
      
      if (response && response.id) {
        // 如果API返回了新记录，添加到列表中
        const newRecord: PlateRecord = {
          id: response.id,
          plateNumber: response.plateNumber,
          imageUrl: response.imageUrl,
          timestamp: typeof response.timestamp === 'object' 
            ? (response.timestamp as Date).toISOString() 
            : response.timestamp
        }
        
        set((state) => ({
          records: [newRecord, ...state.records],
          isLoading: false
        }))
      } else {
        // 如果API尚未实现，使用模拟数据
        const newRecord = {
          ...record,
          id: Math.random().toString(36).substring(2, 9),
          timestamp: typeof record.timestamp === 'object' 
            ? (record.timestamp as Date).toISOString() 
            : record.timestamp
        }
        
        set((state) => ({
          records: [newRecord, ...state.records],
          isLoading: false
        }))
      }
    } catch (error) {
      console.error('添加记录失败:', error)
      set({ isLoading: false })
      throw error
    }
  },
  
  deleteRecord: async (id) => {
    set({ isLoading: true })
    
    try {
      // 使用真实API调用删除记录
      await api.plates.delete(id)
      
      set((state) => ({
        records: state.records.filter(record => record.id !== id),
        isLoading: false
      }))
    } catch (error) {
      console.error('删除记录失败:', error)
      set({ isLoading: false })
      throw error
    }
  }
})) 