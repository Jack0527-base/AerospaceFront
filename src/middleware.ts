import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 开发模式下，为静态资源添加无缓存头
  if (process.env.NODE_ENV === 'development') {
    const url = request.nextUrl.pathname
    
    // 处理静态资源请求
    if (
      url.startsWith('/_next/static/') ||
      url.startsWith('/_next/static/css/') ||
      url.startsWith('/_next/static/chunks/') ||
      url.startsWith('/_next/static/media/')
    ) {
      const response = NextResponse.next()
      
      // 添加无缓存头，确保浏览器总是获取最新资源
      response.headers.set('Cache-Control', 'no-store, must-revalidate')
      response.headers.set('Pragma', 'no-cache')
      response.headers.set('Expires', '0')
      
      return response
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * 匹配所有静态资源路径
     */
    '/_next/static/:path*',
    '/_next/static/css/:path*',
    '/_next/static/chunks/:path*',
    '/_next/static/media/:path*',
  ],
}

