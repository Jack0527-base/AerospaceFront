import { NextRequest, NextResponse } from 'next/server'
import { persistentUserStorage, simpleHash } from '@/lib/persistent-storage'

export async function POST(request: NextRequest) {
  try {
    console.log('注册API被调用')
    
    // 解析请求体
    const { username, email, password } = await request.json()
    console.log('接收到的数据:', { username, email, password: '***' })
    
    // 验证输入数据
    if (!username || !email || !password) {
      console.log('验证失败：缺少必填字段')
      return NextResponse.json(
        { 
          success: false,
          message: '请填写所有必填字段' 
        },
        { status: 400 }
      )
    }
    
    // 验证用户名长度
    if (username.length < 2 || username.length > 20) {
      console.log('验证失败：用户名长度不符合要求')
      return NextResponse.json(
        { 
          success: false,
          message: '用户名长度应在2-20个字符之间' 
        },
        { status: 400 }
      )
    }
    
    // 验证密码长度
    if (password.length < 6) {
      console.log('验证失败：密码长度不符合要求')
      return NextResponse.json(
        { 
          success: false,
          message: '密码长度至少6个字符' 
        },
        { status: 400 }
      )
    }
    
    // 验证邮箱格式
    const emailRegex = /^\S+@\S+\.\S+$/
    if (!emailRegex.test(email)) {
      console.log('验证失败：邮箱格式不正确')
      return NextResponse.json(
        { 
          success: false,
          message: '请输入有效的邮箱地址' 
        },
        { status: 400 }
      )
    }
    
    // 使用文件存储进行用户注册
      // 检查用户名是否已存在
      const existingUserByUsername = persistentUserStorage.findByUsername(username)
      if (existingUserByUsername) {
      console.log('验证失败：用户名已存在')
        return NextResponse.json(
          { 
            success: false,
            message: '用户名已被使用' 
          },
          { status: 409 }
        )
      }
      
      // 检查邮箱是否已存在
      const existingUserByEmail = persistentUserStorage.findByEmail(email)
      if (existingUserByEmail) {
      console.log('验证失败：邮箱已存在')
        return NextResponse.json(
          { 
            success: false,
            message: '邮箱已被注册' 
          },
          { status: 409 }
        )
      }
      
      // 创建新用户
    const newUser = persistentUserStorage.addUser({
        username,
        email,
        password: simpleHash(password),
        avatar: '/avatar.png'
      })
      
    console.log('用户创建成功:', { id: newUser.id, username: newUser.username, email: newUser.email })
    
    // 返回成功响应（不包含密码）
    const userResponse = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      avatar: newUser.avatar,
      createdAt: newUser.createdAt
    }
    
    return NextResponse.json(
      { 
        success: true,
        message: '注册成功',
        user: userResponse,
        storage: 'file'
      },
      { status: 201 }
    )
    
  } catch (error: any) {
    console.error('注册错误详情:', error)
    
    return NextResponse.json(
      { 
        success: false,
        message: '服务器内部错误，请稍后重试' 
      },
      { status: 500 }
    )
  }
} 