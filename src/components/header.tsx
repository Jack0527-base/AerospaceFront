"use client"

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { LogOut, User } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { useAuthStore } from '@/lib/store'
import { styles } from '@/styles/component-styles'

export function Header() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  
  const handleLogout = () => {
    logout()
    router.push('/login')
  }
  
  return (
    <header className={styles.header.container}>
      <div className={styles.layout.container}>
        <div className="flex items-center gap-3">
          <Image 
            src="/logo.svg" 
            alt="三峡大学 Logo" 
            width={120} 
            height={32} 
            className={styles.header.logo}
          />
          <span className={styles.header.title}>循翼 Aerotrace</span>
        </div>
        
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-3">
              <div className={styles.header.userInfo}>
                <User size={18} className={styles.icon.primary} />
                <span className={styles.text.small}>{user.name}</span>
              </div>
              
              <button 
                className={styles.header.logoutButton}
                onClick={handleLogout}
              >
                <LogOut size={18} className={styles.icon.secondary} />
                <span>退出</span>
              </button>
            </div>
          )}
          
          <div className={styles.header.themeToggleWrapper}>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
} 