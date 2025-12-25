// 应用配置文件

// API配置
export const API_CONFIG = {
  // 本地API基础URL（Next.js API路由）- 前端开发服务器
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  
  // 后端服务器URL - 直接访问后端API服务器地址
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'https://gsxzcneaelbf.sealosbja.site',
  
  // API请求超时时间（毫秒）
  timeout: 30000,
  
  // 是否在控制台打印API请求日志
  debug: process.env.NODE_ENV === 'development',
  
  // 本地API端点（Next.js API路由）
  endpoints: {
    // 用户认证
    auth: {
      login: '/api/auth/login',
      logout: '/api/auth/logout',
      register: '/api/auth/register',
    },
    
    // 车牌记录
    plates: {
      list: '/api/plates',
      create: '/api/plates',
      delete: '/api/plates/:id',
    },
    
    // 测试
    test: {
      db: '/api/test-db'
    }
  },
  
  // 后端API端点（真正的LicensePlate.Server API）
  backendEndpoints: {
    // API信息
    info: '/api/v0/info',
    
    // 认证
    auth: {
      login: '/api/v0/auth/login',
      register: '/api/v0/auth/register',
    },
    
    // 车牌检测
    detect: {
      byBase64: '/api/v0/detect',
      byImage: '/api/v0/detect/image',
    },
    
    // 用户档案
    profile: {
      get: '/api/v0/profile/:username',
      getCurrent: '/api/v0/profile',
      getAvatar: '/api/v0/profile/:username/avatar',
      getCurrentAvatar: '/api/v0/profile/avatar',
      updateAvatar: '/api/v0/profile/avatar',
    }
  }
};

// 应用设置
export const APP_CONFIG = {
  // 应用名称
  appName: '车牌识别系统',
  
  // 分页设置
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 20, 50],
  },
  
  // 默认主题
  defaultTheme: 'light',
  
  // 用户注册设置
  registration: {
    // 是否允许注册
    enabled: true,
    // 用户名最小长度
    minUsernameLength: 2,
    // 用户名最大长度
    maxUsernameLength: 20,
    // 密码最小长度
    minPasswordLength: 6,
    // 默认头像
    defaultAvatar: '/avatar.png'
  },
  
  // 后端服务配置
  backend: {
    // 是否使用后端API - 启用直接访问后端API
    enabled: true,
    // 后端服务器地址
    url: process.env.NEXT_PUBLIC_BACKEND_URL || 'https://gsxzcneaelbf.sealosbja.site',
    // API版本
    apiVersion: 'v0'
  }
};