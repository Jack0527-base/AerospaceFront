"use client"

import React, { useState } from 'react'
import { Avatar, Upload, message, Modal } from 'antd'
import { UserOutlined, CameraOutlined } from '@ant-design/icons'
import { useAuthStore } from '@/lib/store'

interface AvatarUploadProps {
  size?: number
  showUpload?: boolean
  style?: React.CSSProperties
}

export function AvatarUpload({ 
  size = 32, 
  showUpload = false, 
  style = {} 
}: AvatarUploadProps) {
  const { user, updateAvatar } = useAuthStore()
  const [uploading, setUploading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState<string>('')

  // 处理文件上传
  const handleUpload = (file: File) => {
    // 验证文件类型
    const isImage = file.type.startsWith('image/')
    if (!isImage) {
      message.error('只能上传图片文件!')
      return false
    }

    // 验证文件大小 (2MB)
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('图片大小不能超过 2MB!')
      return false
    }

    setUploading(true)

    // 读取文件并转换为Base64
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      if (result) {
        setPreviewImage(result)
        setModalVisible(true)
        setUploading(false)
      }
    }
    reader.onerror = () => {
      message.error('文件读取失败!')
      setUploading(false)
    }
    reader.readAsDataURL(file)

    return false // 阻止默认上传行为
  }

  // 确认更新头像
  const handleConfirmUpdate = () => {
    if (previewImage) {
      updateAvatar(previewImage)
      message.success('头像更新成功!')
      setModalVisible(false)
      setPreviewImage('')
    }
  }

  // 取消更新
  const handleCancelUpdate = () => {
    setModalVisible(false)
    setPreviewImage('')
  }

  if (showUpload) {
    return (
      <>
        <div
          style={{ 
            width: size, 
            height: size,
            borderRadius: '50%',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            cursor: 'pointer',
            ...style
          }}
          onClick={() => {
            const input = document.createElement('input')
            input.type = 'file'
            input.accept = 'image/*'
            input.style.display = 'none'
            input.onchange = (e) => {
              const target = e.target as HTMLInputElement
              const files = target.files
              if (files && files.length > 0) {
                handleUpload(files[0])
              }
              document.body.removeChild(input)
            }
            document.body.appendChild(input)
            input.click()
          }}
        >
          <Avatar 
            size={size}
            src={user?.avatar}
            style={{ backgroundColor: '#1890ff' }}
          >
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </Avatar>
          <div style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: size * 0.3,
            height: size * 0.3,
            background: '#1890ff',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid white'
          }}>
            <CameraOutlined style={{ 
              color: 'white', 
              fontSize: size * 0.15 
            }} />
          </div>
        </div>

        <Modal
          title="更新头像"
          open={modalVisible}
          onOk={handleConfirmUpdate}
          onCancel={handleCancelUpdate}
          okText="确定"
          cancelText="取消"
          centered
        >
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center',
            padding: '20px 0'
          }}>
            <Avatar 
              size={120}
              src={previewImage}
              style={{ backgroundColor: '#1890ff' }}
            >
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
          </div>
          <p style={{ textAlign: 'center', color: '#666' }}>
            确定要使用这张图片作为头像吗？
          </p>
        </Modal>
      </>
    )
  }

  // 只显示头像，不支持上传
  return (
    <Avatar 
      size={size}
      src={user?.avatar}
      style={{ backgroundColor: '#1890ff', ...style }}
    >
      {user?.username?.charAt(0).toUpperCase() || 'U'}
    </Avatar>
  )
} 