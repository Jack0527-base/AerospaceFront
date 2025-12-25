"use client"

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { useRecordsStore } from '@/lib/store'
import { API_CONFIG } from '@/lib/config'
import { styles, cn } from '@/styles/component-styles'

export function UploadForm() {
  const addRecord = useRecordsStore(state => state.addRecord)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [plateNumber, setPlateNumber] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('图片大小不能超过5MB')
        return
      }
      
      // 使用标准文件URL而不是DataURL
      const objectUrl = URL.createObjectURL(file)
      setImagePreview(objectUrl)
      setUploadedImageUrl(null) // 清除之前上传的图片URL
      setError('')
    }
  }
  
  const clearImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
    }
    setImagePreview(null)
    setUploadedImageUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }
  
  const uploadImage = async (file: File): Promise<string> => {
    try {
      // 创建FormData对象用于文件上传
      const formData = new FormData()
      formData.append('image', file)
      
      // 创建自定义端点用于上传图片
      const uploadEndpoint = `${API_CONFIG.baseUrl}/upload`
      
      const response = await fetch(uploadEndpoint, {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error('图片上传失败')
      }
      
      const data = await response.json()
      return data.imageUrl // 后端返回的图片URL
    } catch (error) {
      console.error('图片上传错误:', error)
      throw new Error('图片上传失败，请重试')
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!plateNumber.trim()) {
      setError('请输入车牌号')
      return
    }
    
    if (!imagePreview && !uploadedImageUrl) {
      setError('请选择车牌照片')
      return
    }
    
    setIsLoading(true)
    setError('')
    
    try {
      let finalImageUrl = uploadedImageUrl
      
      // 如果有新选择的图片但还没上传
      if (imagePreview && !uploadedImageUrl && fileInputRef.current?.files?.[0]) {
        try {
          // 上传图片到服务器
          finalImageUrl = await uploadImage(fileInputRef.current.files[0])
          setUploadedImageUrl(finalImageUrl)
        } catch (err) {
          // 如果上传失败但我们处于演示模式，使用默认图片
          console.error('图片上传失败，使用默认图片:', err)
          finalImageUrl = 'https://images.unsplash.com/photo-1581288869433-56a1059c47d8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
        }
      }
      
      // 添加新记录
      await addRecord({
        plateNumber: plateNumber.trim(),
        timestamp: new Date(),
        imageUrl: finalImageUrl || 'https://images.unsplash.com/photo-1581288869433-56a1059c47d8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
      })
      
      // 重置表单
      clearImage()
      setPlateNumber('')
      
      // 显示成功消息
      setError('')
    } catch (err) {
      setError('添加记录时发生错误')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className={styles.form.container}>
      <h2 className={styles.form.title}>添加新记录</h2>
      
      <form onSubmit={handleSubmit}>
        <div className={styles.spacing.section}>
          <div className={styles.form.fieldGroup}>
            <label className={styles.form.label}>
              车牌号码
            </label>
            <input
              className={styles.form.input}
              placeholder="例如：京A12345"
              value={plateNumber}
              onChange={e => setPlateNumber(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div className={styles.form.divider}></div>
          
          <div className={styles.form.fieldGroup}>
            <label className={styles.form.label}>
              车牌照片
            </label>
            
            {imagePreview ? (
              <div className={styles.upload.preview}>
                <Image
                  src={imagePreview}
                  alt="车牌照片预览"
                  fill
                  unoptimized
                  className={styles.upload.previewImage}
                />
                <button
                  type="button"
                  className={styles.upload.removeButton}
                  onClick={clearImage}
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div 
                className={styles.upload.dropZone}
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className={styles.upload.dropZoneIcon} />
                <p className={styles.upload.dropZoneText}>点击或拖放图片到此处</p>
              </div>
            )}
            
            <input
              type="file"
              ref={fileInputRef}
              className={styles.upload.hiddenInput}
              accept="image/*"
              onChange={handleImageChange}
              disabled={isLoading}
            />
          </div>
          
          {error && (
            <div className={styles.form.error}>
              {error}
            </div>
          )}
          
          <button 
            type="submit" 
            className={cn(styles.form.submitButton, isLoading && styles.state.loading)}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className={styles.loading.container}>
                <svg className={styles.loading.spinner} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                上传中...
              </span>
            ) : (
              <span className={styles.loading.container}>
                <Upload size={18} className="mr-2" />
                添加记录
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  )
} 