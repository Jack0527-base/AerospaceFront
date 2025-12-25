// 组件样式配置文件
// 将所有Tailwind CSS类集中管理，便于维护和复用

export const styles = {
  // 布局相关样式
  layout: {
    container: "container flex h-16 items-center justify-between py-4",
    page: "min-h-screen bg-gray-50",
    section: "space-y-6",
  },

  // 头部组件样式
  header: {
    container: "sticky top-0 z-40 w-full bg-white/90 backdrop-blur-sm border-b border-gray-100",
    logo: "h-8 w-auto",
    title: "font-semibold text-lg text-[#4776e6]",
    userInfo: "flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm border border-gray-100",
    logoutButton: "flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-medium shadow-sm border border-gray-100 transition-colors hover:bg-gray-50",
    themeToggleWrapper: "rounded-full bg-white p-2 shadow-sm border border-gray-100",
  },

  // 表单样式
  form: {
    container: "bg-white rounded-lg p-6 shadow-sm border border-gray-100",
    title: "text-2xl font-bold text-[#4776e6] mb-6",
    fieldGroup: "space-y-2",
    label: "block text-sm font-medium text-gray-600",
    input: "w-full p-3 rounded-lg border border-gray-200 focus:border-[#4776e6] focus:ring-1 focus:ring-[#4776e6] outline-none transition-all",
    divider: "h-px w-full bg-gray-100 my-4",
    error: "text-sm text-red-500 p-2 bg-red-50 rounded-lg",
    submitButton: "w-full py-3 rounded-lg text-white font-medium bg-[#4776e6] hover:bg-[#3a64d8] transition-all hover:shadow-md hover:-translate-y-0.5",
  },

  // 上传组件样式
  upload: {
    preview: "relative aspect-video rounded-lg overflow-hidden border border-gray-200 group",
    previewImage: "object-cover transition-transform duration-500 group-hover:scale-105",
    removeButton: "absolute top-2 right-2 h-8 w-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg transform transition-transform hover:scale-110",
    dropZone: "aspect-video border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors",
    dropZoneIcon: "h-12 w-12 text-gray-400 mb-3",
    dropZoneText: "text-sm text-gray-500",
    hiddenInput: "hidden",
  },

  // 按钮样式
  button: {
    primary: "bg-[#4776e6] hover:bg-[#3a64d8] text-white font-medium py-2 px-4 rounded-lg transition-all hover:shadow-md hover:-translate-y-0.5",
    secondary: "bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg border border-gray-200 transition-colors",
    danger: "bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors",
    icon: "p-2 rounded-full transition-colors",
  },

  // 卡片样式
  card: {
    container: "bg-white rounded-lg border border-gray-100 shadow-sm",
    header: "p-4 border-b border-gray-100",
    body: "p-4",
    footer: "p-4 border-t border-gray-100",
    title: "text-lg font-semibold text-gray-900",
    subtitle: "text-sm text-gray-500",
  },

  // 加载状态样式
  loading: {
    spinner: "animate-spin -ml-1 mr-3 h-5 w-5 text-white",
    container: "flex items-center justify-center",
    text: "text-sm text-gray-500",
  },

  // 图标样式
  icon: {
    small: "h-4 w-4",
    medium: "h-5 w-5",
    large: "h-6 w-6",
    primary: "text-[#4776e6]",
    secondary: "text-gray-500",
    danger: "text-red-500",
    success: "text-green-500",
  },

  // 文本样式
  text: {
    heading1: "text-3xl font-bold text-gray-900",
    heading2: "text-2xl font-bold text-gray-900",
    heading3: "text-xl font-semibold text-gray-900",
    body: "text-base text-gray-700",
    small: "text-sm text-gray-600",
    muted: "text-sm text-gray-500",
    primary: "text-[#4776e6]",
    danger: "text-red-500",
    success: "text-green-500",
  },

  // 间距样式
  spacing: {
    section: "space-y-6",
    group: "space-y-4",
    tight: "space-y-2",
    loose: "space-y-8",
  },

  // 状态样式
  state: {
    disabled: "opacity-50 cursor-not-allowed",
    loading: "opacity-75 cursor-wait",
    success: "border-green-200 bg-green-50",
    error: "border-red-200 bg-red-50",
    warning: "border-yellow-200 bg-yellow-50",
  },

  // 响应式样式
  responsive: {
    container: "container mx-auto px-4 sm:px-6 lg:px-8",
    grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
    stack: "flex flex-col sm:flex-row gap-4",
  },
}

// 辅助函数：组合样式类
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ')
}

// 主题色彩配置
export const theme = {
  colors: {
    primary: '#4776e6',
    primaryHover: '#3a64d8',
    secondary: '#8ab4f8',
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
  },
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },
} 