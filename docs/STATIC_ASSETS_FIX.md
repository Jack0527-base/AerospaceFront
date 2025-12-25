# 静态资源404错误修复说明

## 问题描述

在Next.js开发模式下，每次修改代码后会出现静态资源404错误：
- `layout.css:1 Failed to load resource: the server responded with a status of 404`
- `main-app.js:1 Failed to load resource: the server responded with a status of 404`
- `app-pages-internals.js:1 Failed to load resource: the server responded with a status of 404`

## 根本原因

1. **浏览器缓存**：浏览器缓存了旧的静态资源URL
2. **Next.js开发模式**：代码修改后重新编译，生成新的资源文件，但浏览器还在请求旧的URL
3. **资源版本号**：Next.js使用时间戳作为资源版本号，每次编译都会变化

## 解决方案

### 1. Next.js配置优化 (`next.config.mjs`)

添加了以下配置：
- `onDemandEntries`: 控制页面在内存中的保留时间
- `generateEtags`: 开发模式下禁用ETag生成
- `webpack.cache`: 开发模式下禁用webpack缓存

### 2. 中间件处理 (`src/middleware.ts`)

创建了中间件来为所有静态资源添加无缓存头：
- `Cache-Control: no-store, must-revalidate`
- `Pragma: no-cache`
- `Expires: 0`

这确保浏览器总是获取最新的资源，而不是使用缓存。

### 3. 开发服务器重启

每次修改代码后，如果仍然出现404错误，可以：
1. 硬刷新浏览器：`Ctrl + Shift + R` (Windows/Linux) 或 `Cmd + Shift + R` (Mac)
2. 清除浏览器缓存
3. 重启开发服务器：`npm run dev`

## 验证

运行以下命令验证配置是否生效：

```bash
# 检查中间件是否正常工作
curl -I http://localhost:3000/_next/static/css/app/layout.css

# 应该看到以下响应头：
# Cache-Control: no-store, must-revalidate
# Pragma: no-cache
# Expires: 0
```

## 注意事项

1. **生产环境**：这些配置只在开发模式下生效，不会影响生产环境的性能
2. **浏览器缓存**：如果问题仍然存在，请清除浏览器缓存或使用无痕模式
3. **开发服务器**：确保开发服务器正常运行，如果出现问题可以重启

## 相关文件

- `next.config.mjs` - Next.js配置文件
- `src/middleware.ts` - 中间件处理静态资源
- `src/app/layout.tsx` - 根布局组件

