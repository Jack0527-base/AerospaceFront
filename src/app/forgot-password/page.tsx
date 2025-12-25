"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { backendApi } from '@/lib/api-client'

export default function ForgotPasswordPage() {
  const router = useRouter()

  const [step, setStep] = useState<'email' | 'verify' | 'reset'>('email')
  const [email, setEmail] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  // 发送验证码
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')
    
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('请输入有效的邮箱地址')
      return
    }

    setIsLoading(true)

    try {
      // 这里调用后端API发送验证码
      // const response = await backendApi.auth.sendResetCode({ email })
      
      // 模拟发送验证码成功
      setSuccessMessage('验证码已发送到您的邮箱，请查收')
      setStep('verify')
      
      // 启动倒计时
      setCooldown(60)
      const timer = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      
    } catch (err: any) {
      setError(err.message || '发送验证码失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  // 验证验证码
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!verificationCode.trim()) {
      setError('请输入验证码')
      return
    }

    setIsLoading(true)

    try {
      // 这里调用后端API验证验证码
      // const response = await backendApi.auth.verifyResetCode({ email, code: verificationCode })
      
      // 模拟验证成功
      setSuccessMessage('验证码验证成功，请设置新密码')
      setStep('reset')
      
    } catch (err: any) {
      setError(err.message || '验证码错误，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  // 重置密码
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!newPassword.trim()) {
      setError('请输入新密码')
      return
    }
    
    if (newPassword.length < 6) {
      setError('密码长度至少6位')
      return
    }
    
    if (!/(?=.*[0-9])/.test(newPassword)) {
      setError('密码必须包含至少一个数字 (0-9)')
      return
    }
    
    if (!/(?=.*[A-Z])/.test(newPassword)) {
      setError('密码必须包含至少一个大写字母 (A-Z)')
      return
    }
    
    if (newPassword !== confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }

    setIsLoading(true)

    try {
      // 这里调用后端API重置密码
      // const response = await backendApi.auth.resetPassword({ email, code: verificationCode, newPassword })
      
      // 模拟重置成功
      setSuccessMessage('密码重置成功！即将跳转到登录页面...')
      
      setTimeout(() => {
        router.push('/login?message=密码重置成功，请使用新密码登录')
      }, 2000)
      
    } catch (err: any) {
      setError(err.message || '密码重置失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  // 重新发送验证码
  const handleResendCode = async () => {
    if (cooldown > 0) return
    
    setError('')
    setIsLoading(true)

    try {
      // 重新发送验证码
      // const response = await backendApi.auth.sendResetCode({ email })
      
      setSuccessMessage('验证码已重新发送')
      
      // 重启倒计时
      setCooldown(60)
      const timer = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      
    } catch (err: any) {
      setError(err.message || '重新发送失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  // 获取当前步骤的标题和描述
  const getStepInfo = () => {
    switch (step) {
      case 'email':
        return {
          title: '找回密码',
          description: '请输入您的邮箱地址'
        }
      case 'verify':
        return {
          title: '验证邮箱',
          description: '我们已向您的邮箱发送验证码'
        }
      case 'reset':
        return {
          title: '重置密码',
          description: '请设置您的新密码'
        }
    }
  }

  const stepInfo = getStepInfo()

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
          max-width: 420px;
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
          margin-bottom: 15px;
        }

        button:hover:not(:disabled) {
          background-color: #4752c4;
        }

        button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .secondary-button {
          background-color: #6c757d !important;
        }

        .secondary-button:hover:not(:disabled) {
          background-color: #5a6268 !important;
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

        .success-message {
          color: #2e7d32;
          margin-bottom: 20px;
          font-size: 14px;
          text-align: center;
          padding: 8px 12px;
          background-color: rgba(46, 125, 50, 0.1);
          border-radius: 6px;
          border-left: 3px solid #2e7d32;
        }

        .step-indicator {
          display: flex;
          justify-content: center;
          margin-bottom: 30px;
          margin-top: 20px;
        }

        .step {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 600;
          margin: 0 5px;
          position: relative;
        }

        .step.active {
          background-color: #5865f2;
          color: white;
        }

        .step.completed {
          background-color: #2e7d32;
          color: white;
        }

        .step.inactive {
          background-color: #e0e0e0;
          color: #666;
        }

        .step:not(:last-child)::after {
          content: '';
          position: absolute;
          right: -20px;
          top: 50%;
          transform: translateY(-50%);
          width: 15px;
          height: 2px;
          background-color: #e0e0e0;
        }

        .step.completed:not(:last-child)::after {
          background-color: #2e7d32;
        }

        .login-link {
          text-align: center;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }

        .verification-info {
          background-color: rgba(88, 101, 242, 0.1);
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 20px;
          border-left: 3px solid #5865f2;
        }

        .verification-info p {
          margin: 0;
          font-size: 14px;
          color: #333;
        }

        .password-requirements {
          font-size: 12px;
          color: #666;
          text-align: left;
          margin-bottom: 10px;
          line-height: 1.4;
        }

        .resend-button {
          background: none !important;
          border: none !important;
          color: #5865f2 !important;
          text-decoration: underline !important;
          cursor: pointer !important;
          font-size: 14px !important;
          padding: 0 !important;
          margin: 0 !important;
          width: auto !important;
        }

        .resend-button:disabled {
          color: #999 !important;
          cursor: not-allowed !important;
          text-decoration: none !important;
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
              <h1>{stepInfo.title}</h1>
              <p>{stepInfo.description}</p>
            </header>

            {/* 步骤指示器 */}
            <div className="step-indicator">
              <div className={`step ${step === 'email' ? 'active' : (step === 'verify' || step === 'reset') ? 'completed' : 'inactive'}`}>
                1
              </div>
              <div className={`step ${step === 'verify' ? 'active' : step === 'reset' ? 'completed' : 'inactive'}`}>
                2
              </div>
              <div className={`step ${step === 'reset' ? 'active' : 'inactive'}`}>
                3
              </div>
            </div>

            {successMessage && (
              <div className="success-message">
                {successMessage}
              </div>
            )}

            <section className="main-content">
              {/* 步骤1: 输入邮箱 */}
              {step === 'email' && (
                <form onSubmit={handleSendCode}>
                  <input
                    type="email"
                    placeholder="请输入您的邮箱地址"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />

                  {error && <div className="error-message">{error}</div>}

                  <button type="submit" disabled={isLoading}>
                    {isLoading ? '发送中...' : '发送验证码'}
                  </button>
                </form>
              )}

              {/* 步骤2: 验证邮箱 */}
              {step === 'verify' && (
                <>
                  <div className="verification-info">
                    <p>验证码已发送至 <strong>{email}</strong></p>
                    <p>请检查您的邮箱（包括垃圾邮件文件夹）</p>
                  </div>
                  
                  <form onSubmit={handleVerifyCode}>
                    <input
                      type="text"
                      placeholder="请输入6位验证码"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      maxLength={6}
                      required
                      disabled={isLoading}
                    />

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" disabled={isLoading}>
                      {isLoading ? '验证中...' : '验证并继续'}
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '15px' }}>
                      <span style={{ fontSize: '14px', color: '#666' }}>
                        没有收到验证码？ 
                      </span>
                      <button
                        type="button"
                        className="resend-button"
                        onClick={handleResendCode}
                        disabled={cooldown > 0 || isLoading}
                      >
                        {cooldown > 0 ? `重新发送 (${cooldown}s)` : '重新发送'}
                      </button>
                    </div>
                  </form>
                </>
              )}

              {/* 步骤3: 重置密码 */}
              {step === 'reset' && (
                <form onSubmit={handleResetPassword}>
                  <input
                    type="password"
                    placeholder="请输入新密码"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <div className="password-requirements">
                    密码要求：至少6位，包含数字和大写字母
                  </div>
                  <div className="line"></div>

                  <input
                    type="password"
                    placeholder="请确认新密码"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />

                  {error && <div className="error-message">{error}</div>}

                  <button type="submit" disabled={isLoading}>
                    {isLoading ? '重置中...' : '重置密码'}
                  </button>
                </form>
              )}
            </section>
            
            <div className="login-link">
              <p>
                想起密码了？ 
                <Link href="/login">
                  <span style={{ color: '#5865f2', fontWeight: '500', cursor: 'pointer', textDecoration: 'underline' }}>
                    返回登录
                  </span>
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  )
} 