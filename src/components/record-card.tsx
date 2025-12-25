"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Trash2, Camera, Clock } from 'lucide-react'
import { PlateRecord, useRecordsStore } from '@/lib/store'
import { formatDate, formatPlateNumber } from '@/lib/utils'
import { styles, cn } from '@/styles/component-styles'

interface RecordCardProps {
  record: PlateRecord
  index?: number
}

export function RecordCard({ record, index = 0 }: RecordCardProps) {
  const deleteRecord = useRecordsStore(state => state.deleteRecord)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [showModal, setShowModal] = useState(false)
  
  useEffect(() => {
    // 延迟显示以创建错落有致的动画效果
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100 * (index % 10)) // 限制最大延迟
    
    return () => clearTimeout(timer)
  }, [index])
  
  const handleDelete = async () => {
    if (confirm('确定要删除该记录吗？')) {
      setIsDeleting(true)
      try {
        await deleteRecord(record.id)
      } finally {
        setIsDeleting(false)
      }
    }
  }
  
  const cardStyle = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    transition: 'opacity 0.4s ease, transform 0.4s ease',
  }
  
  return (
    <>
      <div 
        className={cn(
          styles.card.container,
          "overflow-hidden hover:shadow-md transition-all duration-300 group cursor-pointer"
        )}
        style={cardStyle}
        onClick={() => setShowModal(true)}
      >
        <div className="aspect-video relative overflow-hidden">
          <Image
            src={record.imageUrl}
            alt={record.plateNumber}
            fill
            unoptimized
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded-md text-xs flex items-center">
            <Camera size={12} className="mr-1" />
            车牌照片
          </div>
        </div>
        
        <div className={styles.card.body}>
          <div className={cn(styles.text.heading3, styles.text.primary)}>
            {formatPlateNumber(record.plateNumber)}
          </div>
          <div className={cn(styles.text.muted, "mt-1 flex items-center")}>
            <Clock size={14} className="mr-1" />
            {formatDate(new Date(record.timestamp))}
          </div>
        </div>
        
        <div className="px-4 pb-4 pt-0 flex justify-between items-center">
          <div className="text-xs text-gray-400">ID: {record.id.substring(0, 8)}</div>
          
          <button 
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium",
              "bg-red-50 text-red-500 transition-colors hover:bg-red-100",
              isDeleting && styles.state.disabled
            )}
            onClick={(e) => {
              e.stopPropagation(); // 阻止事件冒泡
              handleDelete();
            }}
            disabled={isDeleting}
          >
            <Trash2 size={14} />
            {isDeleting ? '删除中...' : '删除'}
          </button>
        </div>
      </div>
      
      {/* 照片查看模态框 */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" 
          onClick={() => setShowModal(false)}
        >
          <div 
            className="relative max-w-3xl w-full bg-white rounded-xl overflow-hidden" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video">
              <Image
                src={record.imageUrl}
                alt={record.plateNumber}
                fill
                unoptimized
                className="object-contain"
              />
            </div>
            <div className={styles.card.body}>
              <h3 className={cn(styles.text.heading2, styles.text.primary)}>
                {formatPlateNumber(record.plateNumber)}
              </h3>
              <p className={cn(styles.text.muted, "mt-1")}>
                {formatDate(new Date(record.timestamp))}
              </p>
              <button 
                className={cn(styles.button.secondary, "mt-4")}
                onClick={() => setShowModal(false)}
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 