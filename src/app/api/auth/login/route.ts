import { NextRequest, NextResponse } from 'next/server'
import { persistentUserStorage } from '@/lib/persistent-storage'

// 添加CORS处理
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders(),
  })
}

export async function POST(request: NextRequest) {
  try {
    console.log('登录API被调用')
    
    // 解析请求体
    const { username, password } = await request.json()
    console.log('登录尝试:', { username, password: '***' })
    
    // 验证输入数据
    if (!username || !password) {
      console.log('验证失败：缺少用户名或密码')
      return NextResponse.json(
        { 
          success: false,
          message: '请输入用户名和密码' 
        },
        { 
          status: 400,
          headers: corsHeaders()
        }
      )
      }
      
    // 使用文件存储进行用户验证
    const user = persistentUserStorage.findByUsernameOrEmail(username)
    
    if (!user) {
      console.log('验证失败：用户不存在', { identifier: username })
      return NextResponse.json(
        { 
          success: false,
          message: '用户名或密码错误' 
        },
        { 
          status: 401,
          headers: corsHeaders()
        }
      )
    }
    
    // 验证密码
    const isPasswordValid = persistentUserStorage.verifyPassword(user.password, password)
    
    if (!isPasswordValid) {
      console.log('验证失败：密码错误', { 
        userId: user.id, 
        username: user.username
      })
      return NextResponse.json(
        { 
          success: false,
          message: '用户名或密码错误' 
        },
        { 
          status: 401,
          headers: corsHeaders()
        }
      )
    }
    
    console.log('登录成功:', { 
      id: user.id, 
      username: user.username, 
      email: user.email
    })
    
    // 返回成功响应（不包含密码）
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      name: user.username // 为了兼容现有store
    }
    
    return NextResponse.json(
      { 
        success: true,
        message: '登录成功',
        user: userResponse,
        storage: 'file'
      },
      { 
        status: 200,
        headers: corsHeaders()
      }
    )
    
  } catch (error: any) {
    console.error('登录错误详情:', error)
    
    return NextResponse.json(
      { 
        success: false,
        message: '服务器内部错误，请稍后重试' 
      },
      { 
        status: 500,
        headers: corsHeaders()
      }
    )
  }
} 