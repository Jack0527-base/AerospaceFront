# 样式系统使用指南

## 概述

为了简化 TSX 文件中的 CSS 类管理，我们创建了一个集中的样式配置系统。所有的 Tailwind CSS 类都存储在 `component-styles.ts` 文件中，使得代码更加清晰和易于维护。

## 文件结构

```
src/styles/
├── component-styles.ts  # 主要样式配置文件
└── README.md           # 本文档
```

## 使用方式

### 1. 导入样式

```tsx
import { styles, cn } from '@/styles/component-styles'
```

### 2. 使用预定义样式

```tsx
// 单个样式类
<div className={styles.card.container}>内容</div>

// 组合多个样式类
<div className={cn(styles.card.container, styles.state.loading)}>内容</div>

// 条件样式
<div className={cn(
  styles.button.primary,
  isLoading && styles.state.loading,
  isDisabled && styles.state.disabled
)}>
  按钮
</div>
```

## 样式分类

### 布局 (layout)
- `container`: 主容器样式
- `page`: 页面级容器
- `section`: 区块容器

### 头部 (header)
- `container`: 头部容器
- `logo`: Logo 样式
- `title`: 标题样式
- `userInfo`: 用户信息容器
- `logoutButton`: 退出按钮
- `themeToggleWrapper`: 主题切换包装器

### 表单 (form)
- `container`: 表单容器
- `title`: 表单标题
- `fieldGroup`: 字段组
- `label`: 标签样式
- `input`: 输入框样式
- `divider`: 分割线
- `error`: 错误信息
- `submitButton`: 提交按钮

### 上传组件 (upload)
- `preview`: 预览容器
- `previewImage`: 预览图片
- `removeButton`: 删除按钮
- `dropZone`: 拖放区域
- `dropZoneIcon`: 拖放区域图标
- `dropZoneText`: 拖放区域文本
- `hiddenInput`: 隐藏输入框

### 按钮 (button)
- `primary`: 主要按钮
- `secondary`: 次要按钮
- `danger`: 危险按钮
- `icon`: 图标按钮

### 卡片 (card)
- `container`: 卡片容器
- `header`: 卡片头部
- `body`: 卡片主体
- `footer`: 卡片底部
- `title`: 卡片标题
- `subtitle`: 卡片副标题

### 加载状态 (loading)
- `spinner`: 加载动画
- `container`: 加载容器
- `text`: 加载文本

### 图标 (icon)
- `small`: 小图标 (16px)
- `medium`: 中等图标 (20px)
- `large`: 大图标 (24px)
- `primary`: 主色调图标
- `secondary`: 次要色调图标
- `danger`: 危险色调图标
- `success`: 成功色调图标

### 文本 (text)
- `heading1`: 一级标题
- `heading2`: 二级标题
- `heading3`: 三级标题
- `body`: 正文
- `small`: 小文本
- `muted`: 静音文本
- `primary`: 主色调文本
- `danger`: 危险色调文本
- `success`: 成功色调文本

### 间距 (spacing)
- `section`: 区块间距
- `group`: 组间距
- `tight`: 紧密间距
- `loose`: 宽松间距

### 状态 (state)
- `disabled`: 禁用状态
- `loading`: 加载状态
- `success`: 成功状态
- `error`: 错误状态
- `warning`: 警告状态

### 响应式 (responsive)
- `container`: 响应式容器
- `grid`: 响应式网格
- `stack`: 响应式堆叠

## 辅助函数

### cn(...classes)
用于组合多个 CSS 类，自动过滤掉 falsy 值。

```tsx
cn(
  styles.button.primary,
  isLoading && styles.state.loading,
  disabled && styles.state.disabled,
  "custom-class"
)
```

## 主题配置

`theme` 对象包含了颜色、间距、圆角等配置：

```tsx
import { theme } from '@/styles/component-styles'

// 使用主题色彩
style={{ color: theme.colors.primary }}

// 使用主题间距
style={{ padding: theme.spacing.md }}
```

## 最佳实践

1. **优先使用预定义样式**：尽量使用已定义的样式类，避免直接写 Tailwind 类
2. **语义化命名**：根据功能而非外观命名样式
3. **组合使用**：利用 `cn` 函数组合多个样式类
4. **一致性**：保持相同组件使用相同的样式
5. **扩展性**：需要新样式时，先在 `component-styles.ts` 中添加

## 重构指南

将现有组件重构为使用样式系统：

```tsx
// 重构前
<div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
  <h2 className="text-2xl font-bold text-[#4776e6] mb-6">标题</h2>
  <button className="w-full py-3 rounded-lg text-white font-medium bg-[#4776e6] hover:bg-[#3a64d8]">
    按钮
  </button>
</div>

// 重构后
<div className={styles.form.container}>
  <h2 className={styles.form.title}>标题</h2>
  <button className={styles.form.submitButton}>
    按钮
  </button>
</div>
```

## 维护

定期检查和更新样式系统：

1. 清理未使用的样式
2. 重构重复的样式组合
3. 添加新的常用样式模式
4. 保持文档同步更新 