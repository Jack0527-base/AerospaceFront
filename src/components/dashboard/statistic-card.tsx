import React from 'react'
import { Card, Statistic } from 'antd'
import { theme } from 'antd'

interface StatisticCardProps {
  title: string
  value: number | string
  prefix?: React.ReactNode
  suffix?: string
  precision?: number
  valueStyle?: React.CSSProperties
  isDark?: boolean
}

export const StatisticCard: React.FC<StatisticCardProps> = ({
  title,
  value,
  prefix,
  suffix,
  precision,
  valueStyle,
  isDark = false
}) => {
  const {
    token: { borderRadiusLG },
  } = theme.useToken()

  return (
    <Card
      style={{
        height: '100%',
        background: isDark
          ? 'linear-gradient(135deg, rgba(38,38,38,0.9) 0%, rgba(58,58,58,0.7) 100%)'
          : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.8) 100%)',
        border: isDark
          ? '1px solid rgba(255,255,255,0.1)' 
          : '1px solid rgba(24, 144, 255, 0.1)',
        backdropFilter: 'blur(12px)',
        borderRadius: borderRadiusLG,
        boxShadow: isDark
          ? '0 4px 16px rgba(0,0,0,0.3)' 
          : '0 4px 16px rgba(24, 144, 255, 0.08)'
      }}
      bodyStyle={{ 
        padding: '24px', 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center' 
      }}
    >
      <Statistic
        title={title}
        value={value}
        prefix={prefix}
        suffix={suffix}
        precision={precision}
        valueStyle={valueStyle}
      />
    </Card>
  )
} 