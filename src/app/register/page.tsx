"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('请输入用户名')
      return false
    }
    if (formData.username.trim().length < 2) {
      setError('用户名至少需要2个字符')
      return false
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('请输入有效的邮箱地址')
      return false
    }
    if (formData.password.length < 6) {
      setError('密码长度至少6位')
      return false
    }
    
    // 添加后端API要求的密码规则检查
    if (!/(?=.*[0-9])/.test(formData.password)) {
      setError('密码必须包含至少一个数字 (0-9)')
      return false
    }
    if (!/(?=.*[A-Z])/.test(formData.password)) {
      setError('密码必须包含至少一个大写字母 (A-Z)')
      return false
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      console.log('开始注册请求:', {
        username: formData.username,
        email: formData.email,
        password: '***'
      })

      // 直接使用后端API
      const { backendApi } = await import('@/lib/api-client')
      const response = await backendApi.auth.register({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password
      })

      console.log('后端API注册响应:', response)

      if (response.isSuccess) {
        setShowSuccess(true)
        setTimeout(() => {
          router.push('/login?message=注册成功，请登录')
        }, 3000)
      } else {
        // 处理后端返回的错误消息
        if (response.messages && Array.isArray(response.messages) && response.messages.length > 0) {
          const errorMessages = response.messages.map((msg: any) => msg.description || msg.code).join('\n')
          setError(errorMessages)
        } else {
          setError('注册失败，请重试')
        }
      }
    } catch (err: any) {
      console.error('注册错误详情:', err)
      
      // 优先使用API客户端处理后的错误消息
      if (err.message) {
        setError(err.message)
      } else if (err.response?.data?.messages && Array.isArray(err.response.data.messages)) {
        // 直接处理后端错误格式
        const errorMessages = err.response.data.messages.map((msg: any) => msg.description || msg.code).join('\n')
        setError(errorMessages)
      } else if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else if (err.response?.status) {
        setError(`请求失败 (${err.response.status}): ${err.response.statusText || '未知错误'}`)
      } else {
        setError('网络连接失败，请检查网络后重试')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html, body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          width: 100%;
          height: 100%;
        }

        .page-wrapper {
          position: fixed;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          overflow: hidden;
        }

        .page-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #f0f4f7 0%, #e6eef5 100%);
          z-index: -1;
        }

        .body {
          font-family: Arial, sans-serif;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #333;
          position: relative;
        }

        .svg-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .svg-top,
        .svg-bottom {
          position: absolute;
          z-index: 0;
          pointer-events: none;
        }

        .svg-top {
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          height: auto;
          opacity: 0.8;
        }

        .svg-bottom {
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          height: auto;
          opacity: 0.7;
        }

        .container {
          width: 100%;
          max-width: 380px;
          background-color: rgba(255, 255, 255, 0.95);
          padding: 35px;
          border-radius: 18px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          backdrop-filter: blur(10px);
          text-align: center;
          position: relative;
          z-index: 2;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          margin: 0 20px;
        }

        .container:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
        }

        h1 {
          margin-top: 20px;
          font-size: 32px;
          color: #5865f2;
        }

        p {
          font-size: 16px;
          margin-top: 5px;
          color: #888;
        }

        .main-content form {
          margin-top: 40px;
        }

        input {
          width: 100%;
          padding: 15px;
          margin-bottom: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 16px;
          color: #333;
        }

        .line {
          width: 100%;
          height: 1px;
          background-color: #ddd;
          margin-bottom: 20px;
        }

        button {
          width: 100%;
          padding: 15px;
          background-color: #5865f2;
          color: white;
          font-size: 16px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        button:hover:not(:disabled) {
          background-color: #4752c4;
        }

        button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .error-message {
          color: #e53935;
          margin-bottom: 20px;
          font-size: 14px;
          text-align: left;
          padding: 8px 12px;
          background-color: rgba(229, 57, 53, 0.1);
          border-radius: 6px;
          border-left: 3px solid #e53935;
        }

        footer {
          margin-top: 30px;
          display: flex;
          justify-content: space-between;
        }

        footer p {
          margin-top: 15px;
          font-size: 14px;
        }

        footer p a {
          text-decoration: none;
          color: #5865f2;
          font-weight: 500;
        }

        footer p a:hover {
          text-decoration: underline;
        }

        .login-link {
          text-align: center;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }

        /* 成功动画样式 */
        .success-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          animation: fadeIn 0.3s ease-out;
        }

        .success-modal {
          background: white;
          padding: 40px;
          border-radius: 20px;
          text-align: center;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          animation: slideIn 0.5s ease-out;
          max-width: 300px;
          width: 90%;
        }

        .success-checkmark {
          width: 80px;
          height: 80px;
          margin: 0 auto 20px;
          background: #4CAF50;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: bounceIn 0.6s ease-out 0.2s both;
        }

        .checkmark-icon {
          color: white;
          font-size: 40px;
          font-weight: bold;
          animation: checkmarkDraw 0.3s ease-out 0.5s both;
          opacity: 0;
        }

        .success-message {
          color: #333;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 10px;
        }

        .success-submessage {
          color: #666;
          font-size: 14px;
          margin-bottom: 20px;
        }

        .success-progress {
          width: 100%;
          height: 3px;
          background: #e0e0e0;
          border-radius: 3px;
          overflow: hidden;
          margin-top: 15px;
        }

        .success-progress-bar {
          height: 100%;
          background: linear-gradient(45deg, #4CAF50, #66BB6A);
          animation: progressFill 3s linear;
          transform: translateX(-100%);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideIn {
          from { 
            opacity: 0;
            transform: translateY(-50px) scale(0.8);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes bounceIn {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
            opacity: 1;
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes checkmarkDraw {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes progressFill {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>

      <div className="page-wrapper">
        <div className="page-background"></div>
        <div className="body">
          <div className="svg-container">
            <div className="svg-top">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" height="1337" width="1337">
                <defs>
                  <path id="path-1" opacity="1" fillRule="evenodd" d="M1337,668.5 C1337,1037.455193874239 1037.455193874239,1337 668.5,1337 C523.6725684305388,1337 337,1236 370.50000000000006,1094 C434.03835568300906,824.6732385973953 6.906089672974592e-14,892.6277623047779 0,668.5000000000001 C0,299.5448061257611 299.5448061257609,1.1368683772161603e-13 668.4999999999999,0 C1037.455193874239,0 1337,299.544806125761 1337,668.5Z" />
                  <linearGradient id="linearGradient-2" x1="0.79" y1="0.62" x2="0.21" y2="0.86">
                    <stop offset="0" stopColor="rgb(88,62,213)" stopOpacity="1" />
                    <stop offset="1" stopColor="rgb(23,215,250)" stopOpacity="1" />
                  </linearGradient>
                </defs>
                <g opacity="1">
                  <use xlinkHref="#path-1" fill="url(#linearGradient-2)" fillOpacity="1" />
                </g>
              </svg>
            </div>
            <div className="svg-bottom">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" height="896" width="967.8852157128662">
                <defs>
                  <path id="path-2" opacity="1" fillRule="evenodd" d="M896,448 C1142.6325445712241,465.5747656464056 695.2579309733121,896 448,896 C200.74206902668806,896 5.684341886080802e-14,695.2579309733121 0,448.0000000000001 C0,200.74206902668806 200.74206902668791,5.684341886080802e-14 447.99999999999994,0 C695.2579309733121,0 475,418 896,448Z" />
                  <linearGradient id="linearGradient-3" x1="0.5" y1="0" x2="0.5" y2="1">
                    <stop offset="0" stopColor="rgb(40,175,240)" stopOpacity="1" />
                    <stop offset="1" stopColor="rgb(18,15,196)" stopOpacity="1" />
                  </linearGradient>
                </defs>
                <g opacity="1">
                  <use xlinkHref="#path-2" fill="url(#linearGradient-3)" fillOpacity="1" />
                </g>
              </svg>
            </div>
          </div>
          <section className="container">
            <header>
              <h1>欢迎加入！</h1>
              <p>创建新账户</p>
            </header>
            <section className="main-content">
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="username"
                  placeholder="用户名"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
                <div className="line"></div>
                
                <input
                  type="email"
                  name="email"
                  placeholder="邮箱地址"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
                <div className="line"></div>
                
                <input
                  type="password"
                  name="password"
                  placeholder="密码"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
                <div style={{ fontSize: '12px', color: '#666', textAlign: 'left', marginBottom: '10px' }}>
                  密码要求：至少6位，包含数字和大写字母
                </div>
                <div className="line"></div>
                
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="确认密码"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />

                {error && <div className="error-message">{error}</div>}

                <button type="submit" disabled={isLoading}>
                  {isLoading ? '注册中...' : '立即注册'}
                </button>
              </form>
            </section>
            
            <div className="login-link">
              <p>
                已有账户？ 
                <Link href="/login">
                  <span style={{ color: '#5865f2', fontWeight: '500', cursor: 'pointer', textDecoration: 'underline' }}>
                    立即登录
                  </span>
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* 成功动画模态框 */}
      {showSuccess && (
        <div className="success-overlay">
          <div className="success-modal">
            <div className="success-checkmark">
              <div className="checkmark-icon">✓</div>
            </div>
            <div className="success-message">注册成功！</div>
            <div className="success-submessage">即将跳转到登录页面...</div>
            <div className="success-progress">
              <div className="success-progress-bar"></div>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 