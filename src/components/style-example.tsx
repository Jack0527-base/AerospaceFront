/**
 * 样式系统使用示例组件
 * 展示如何使用统一的样式配置来构建UI组件
 */

import React, { useState } from 'react'
import { Check, X, Upload, AlertCircle } from 'lucide-react'
import { styles, cn, theme } from '@/styles/component-styles'

export function StyleExample() {
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)

  return (
    <div className={styles.responsive.container}>
      <div className={styles.spacing.section}>
        
        {/* 标题部分 */}
        <div className={styles.spacing.group}>
          <h1 className={styles.text.heading1}>样式系统示例</h1>
          <p className={styles.text.body}>
            展示如何使用统一的样式配置来构建一致性的UI组件
          </p>
        </div>

        {/* 按钮示例 */}
        <div className={styles.card.container}>
          <div className={styles.card.header}>
            <h2 className={styles.card.title}>按钮样式</h2>
            <p className={styles.card.subtitle}>不同类型的按钮组件</p>
          </div>
          <div className={styles.card.body}>
            <div className={styles.responsive.stack}>
              <button className={styles.button.primary}>
                <Check className={styles.icon.small} />
                主要按钮
              </button>
              <button className={styles.button.secondary}>
                <X className={styles.icon.small} />
                次要按钮
              </button>
              <button className={styles.button.danger}>
                <AlertCircle className={styles.icon.small} />
                危险按钮
              </button>
            </div>
          </div>
        </div>

        {/* 表单示例 */}
        <div className={styles.form.container}>
          <h2 className={styles.form.title}>表单样式</h2>
          
          <div className={styles.spacing.section}>
            <div className={styles.form.fieldGroup}>
              <label className={styles.form.label}>用户名</label>
              <input 
                className={cn(
                  styles.form.input,
                  hasError && styles.state.error
                )}
                placeholder="请输入用户名"
              />
            </div>

            <div className={styles.form.fieldGroup}>
              <label className={styles.form.label}>邮箱地址</label>
              <input 
                className={styles.form.input}
                type="email"
                placeholder="user@example.com"
              />
            </div>

            {hasError && (
              <div className={styles.form.error}>
                <AlertCircle className={styles.icon.small} />
                请填写有效的用户名
              </div>
            )}

            <button 
              className={cn(
                styles.form.submitButton,
                isLoading && styles.state.loading
              )}
              onClick={() => {
                setIsLoading(true)
                setTimeout(() => {
                  setIsLoading(false)
                  setHasError(!hasError)
                }, 2000)
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className={styles.loading.container}>
                  <svg className={styles.loading.spinner} viewBox="0 0 24 24">
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  提交中...
                </span>
              ) : (
                <span className={styles.loading.container}>
                  <Upload className={styles.icon.small} />
                  提交表单
                </span>
              )}
            </button>
          </div>
        </div>

        {/* 状态示例 */}
        <div className={styles.responsive.grid}>
          <div className={cn(styles.card.container, styles.state.success)}>
            <div className={styles.card.body}>
              <Check className={cn(styles.icon.medium, styles.icon.success)} />
              <h3 className={styles.text.heading3}>成功状态</h3>
              <p className={styles.text.success}>操作已成功完成</p>
            </div>
          </div>

          <div className={cn(styles.card.container, styles.state.error)}>
            <div className={styles.card.body}>
              <X className={cn(styles.icon.medium, styles.icon.danger)} />
              <h3 className={styles.text.heading3}>错误状态</h3>
              <p className={styles.text.danger}>操作失败，请重试</p>
            </div>
          </div>

          <div className={cn(styles.card.container, styles.state.warning)}>
            <div className={styles.card.body}>
              <AlertCircle className={cn(styles.icon.medium, "text-yellow-500")} />
              <h3 className={styles.text.heading3}>警告状态</h3>
              <p className="text-yellow-600">请注意相关事项</p>
            </div>
          </div>
        </div>

        {/* 文本样式示例 */}
        <div className={styles.card.container}>
          <div className={styles.card.header}>
            <h2 className={styles.card.title}>文本样式</h2>
          </div>
          <div className={styles.card.body}>
            <div className={styles.spacing.group}>
              <h1 className={styles.text.heading1}>一级标题</h1>
              <h2 className={styles.text.heading2}>二级标题</h2>
              <h3 className={styles.text.heading3}>三级标题</h3>
              <p className={styles.text.body}>这是正文文本，用于显示主要内容。</p>
              <p className={styles.text.small}>这是小号文本，用于辅助信息。</p>
              <p className={styles.text.muted}>这是静音文本，用于次要信息。</p>
              <p className={styles.text.primary}>这是主色调文本。</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default StyleExample 