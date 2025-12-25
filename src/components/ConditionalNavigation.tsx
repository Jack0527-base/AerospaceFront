'use client';

import { usePathname } from 'next/navigation';
import Navigation from './Navigation';

export default function ConditionalNavigation() {
  const pathname = usePathname();
  
  // 登录页面不显示导航栏
  if (pathname === '/login') {
    return null;
  }
  
  return <Navigation />;
}
