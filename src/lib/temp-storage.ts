// 临时内存存储（用于演示，生产环境应使用真实数据库）
export interface TempUser {
  id: string
  username: string
  email: string
  password: string
  avatar: string
  createdAt: Date
}

// 全局内存存储
const tempUsers: TempUser[] = []

// 简单的密码哈希函数（生产环境应使用bcrypt）
export function simpleHash(password: string): string {
  return Buffer.from(password).toString('base64')
}

// 用户管理函数
export const userStorage = {
  // 查找用户（按用户名）
  findByUsername: (username: string): TempUser | undefined => {
    console.log('存储: 按用户名查找用户', { username, 总用户数: tempUsers.length })
    const user = tempUsers.find(user => user.username === username)
    console.log('存储: 查找结果', user ? { id: user.id, username: user.username } : '未找到')
    return user
  },

  // 查找用户（按邮箱）
  findByEmail: (email: string): TempUser | undefined => {
    console.log('存储: 按邮箱查找用户', { email, 总用户数: tempUsers.length })
    const user = tempUsers.find(user => user.email === email)
    console.log('存储: 查找结果', user ? { id: user.id, email: user.email } : '未找到')
    return user
  },

  // 查找用户（按用户名或邮箱）
  findByUsernameOrEmail: (identifier: string): TempUser | undefined => {
    console.log('存储: 按用户名或邮箱查找用户', { identifier, 总用户数: tempUsers.length })
    console.log('存储: 当前所有用户', tempUsers.map(u => ({ 
      username: u.username, 
      email: u.email,
      id: u.id 
    })))
    
    const user = tempUsers.find(user => 
      user.username === identifier || user.email === identifier
    )
    console.log('存储: 查找结果', user ? { 
      id: user.id, 
      username: user.username, 
      email: user.email 
    } : '未找到')
    return user
  },

  // 添加新用户
  addUser: (userData: Omit<TempUser, 'id' | 'createdAt'>): TempUser => {
    const newUser: TempUser = {
      ...userData,
      id: Math.random().toString(36).substring(2, 15),
      createdAt: new Date()
    }
    tempUsers.push(newUser)
    console.log('存储: 新用户已添加', { 
      id: newUser.id, 
      username: newUser.username, 
      email: newUser.email,
      总用户数: tempUsers.length 
    })
    return newUser
  },

  // 获取所有用户（用于调试）
  getAllUsers: (): TempUser[] => {
    console.log('存储: 获取所有用户', { 总数: tempUsers.length })
    return tempUsers
  },

  // 验证密码
  verifyPassword: (storedPassword: string, inputPassword: string): boolean => {
    const hashedInput = simpleHash(inputPassword)
    const isValid = storedPassword === hashedInput
    console.log('存储: 密码验证', { 
      存储的密码: storedPassword.substring(0, 10) + '...', 
      输入密码哈希: hashedInput.substring(0, 10) + '...',
      验证结果: isValid 
    })
    return isValid
  }
} 