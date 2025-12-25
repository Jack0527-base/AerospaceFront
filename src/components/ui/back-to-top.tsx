"use client"

import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    // 监听滚动事件
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }
    
    window.addEventListener('scroll', toggleVisibility)
    
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
  
  if (!isVisible) return null
  
  return (
    <button
      className="fixed right-4 bottom-4 z-50 rounded-full bg-[#4776e6] shadow-lg p-3 text-white opacity-80 hover:opacity-100 transition-all duration-300 transform hover:scale-110"
      onClick={scrollToTop}
      aria-label="返回顶部"
    >
      <ArrowUp size={20} />
    </button>
  )
} 