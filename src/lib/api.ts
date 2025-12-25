import { API_CONFIG } from './config';

// https://github.com/nullcc/ts-retrofit

// 通用API请求函数
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_CONFIG.baseUrl}${endpoint}`;
  
  // 默认请求头
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  // 合并选项
  const config = {
    ...options,
    headers,
  };
  
  if (API_CONFIG.debug) {
    console.log(`API Request: ${options.method || 'GET'} ${url}`);
    if (options.body) {
      console.log('Request body:', options.body);
    }
  }
  
  try {
    const response = await fetch(url, config);
    
    // 检查响应状态
    if (!response.ok) {
      // 尝试解析错误响应
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || `请求失败: ${response.status}`);
      } catch (e) {
        throw new Error(`请求失败: ${response.status}`);
      }
    }
    
    // 解析JSON响应
    const data = await response.json();
    
    if (API_CONFIG.debug) {
      console.log('API Response:', data);
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// API服务
export const api = {
  // 认证相关
  auth: {
    // 登录
    login: (username: string, password: string) => 
      fetchAPI(API_CONFIG.endpoints.auth.login, {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      }),
    
    // 登出
    logout: () => 
      fetchAPI(API_CONFIG.endpoints.auth.logout, {
        method: 'POST',
      }),
  },
  
  // 车牌记录相关
  plates: {
    // 获取记录列表
    list: () => 
      fetchAPI(API_CONFIG.endpoints.plates.list),
    
    // 创建新记录
    create: (data: { plateNumber: string, imageUrl: string }) => 
      fetchAPI(API_CONFIG.endpoints.plates.create, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    // 删除记录
    delete: (id: string) => 
      fetchAPI(API_CONFIG.endpoints.plates.delete.replace(':id', id), {
        method: 'DELETE',
      }),
  },
};