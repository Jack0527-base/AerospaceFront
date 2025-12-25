import fs from 'fs'
import path from 'path'

// 用户数据类型
export interface PersistentUser {
  id: string
  username: string
  email: string
  password: string
  avatar: string
  createdAt: string
}

// 数据文件路径
const USERS_FILE = path.join(process.cwd(), 'data', 'users.json')

// 确保数据目录存在
function ensureDataDir() {
  const dataDir = path.dirname(USERS_FILE)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// 读取用户数据
function readUsers(): PersistentUser[] {
  try {
    ensureDataDir()
    if (!fs.existsSync(USERS_FILE)) {
      return []
    }
    const data = fs.readFileSync(USERS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('读取用户数据失败:', error)
    return []
  }
}

// 写入用户数据
function writeUsers(users: PersistentUser[]) {
  try {
    ensureDataDir()
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2))
  } catch (error) {
    console.error('写入用户数据失败:', error)
  }
}

// 简单的密码哈希函数
export function simpleHash(password: string): string {
  return Buffer.from(password).toString('base64')
}

// 持久化用户存储
export const persistentUserStorage = {
  // 查找用户（按用户名）
  findByUsername: (username: string): PersistentUser | undefined => {
    const users = readUsers()
    console.log('持久化存储: 按用户名查找用户', { username, 总用户数: users.length })
    const user = users.find(user => user.username === username)
    console.log('持久化存储: 查找结果', user ? { id: user.id, username: user.username } : '未找到')
    return user
  },

  // 查找用户（按邮箱）
  findByEmail: (email: string): PersistentUser | undefined => {
    const users = readUsers()
    console.log('持久化存储: 按邮箱查找用户', { email, 总用户数: users.length })
    const user = users.find(user => user.email === email)
    console.log('持久化存储: 查找结果', user ? { id: user.id, email: user.email } : '未找到')
    return user
  },

  // 查找用户（按用户名或邮箱）
  findByUsernameOrEmail: (identifier: string): PersistentUser | undefined => {
    const users = readUsers()
    console.log('持久化存储: 按用户名或邮箱查找用户', { identifier, 总用户数: users.length })
    console.log('持久化存储: 当前所有用户', users.map(u => ({ 
      username: u.username, 
      email: u.email,
      id: u.id 
    })))
    
    const user = users.find(user => 
      user.username === identifier || user.email === identifier
    )
    console.log('持久化存储: 查找结果', user ? { 
      id: user.id, 
      username: user.username, 
      email: user.email 
    } : '未找到')
    return user
  },

  // 添加新用户
  addUser: (userData: Omit<PersistentUser, 'id' | 'createdAt'>): PersistentUser => {
    const users = readUsers()
    const newUser: PersistentUser = {
      ...userData,
      id: Math.random().toString(36).substring(2, 15),
      createdAt: new Date().toISOString()
    }
    users.push(newUser)
    writeUsers(users)
    console.log('持久化存储: 新用户已添加', { 
      id: newUser.id, 
      username: newUser.username, 
      email: newUser.email,
      总用户数: users.length 
    })
    return newUser
  },

  // 获取所有用户（用于调试）
  getAllUsers: (): PersistentUser[] => {
    const users = readUsers()
    console.log('持久化存储: 获取所有用户', { 总数: users.length })
    return users
  },

  // 验证密码
  verifyPassword: (storedPassword: string, inputPassword: string): boolean => {
    const hashedInput = simpleHash(inputPassword)
    const isValid = storedPassword === hashedInput
    console.log('持久化存储: 密码验证', { 
      存储的密码: storedPassword.substring(0, 10) + '...', 
      输入密码哈希: hashedInput.substring(0, 10) + '...',
      验证结果: isValid 
    })
    return isValid
  }
} 