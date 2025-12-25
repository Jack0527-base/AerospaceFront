/** @type {import('next').NextConfig} */
const nextConfig = {
  // 开发模式下的优化配置
  reactStrictMode: true,
  // 确保静态资源正确生成和缓存
  poweredByHeader: false,
  
  // 开发模式下禁用静态资源缓存，避免404错误
  onDemandEntries: {
    // 页面在内存中保持活动的时间（秒）
    maxInactiveAge: 25 * 1000,
    // 同时保留在内存中的页面数
    pagesBufferLength: 2,
  },
  
  // 开发模式配置
  ...(process.env.NODE_ENV === 'development' && {
    // 禁用静态资源缓存
    generateEtags: false,
  }),
  
  // 确保webpack配置正确
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // 开发模式下禁用缓存
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
