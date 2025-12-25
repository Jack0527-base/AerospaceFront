import React from 'react'
import { Card, Space, Typography, Progress } from 'antd'
import { theme } from 'antd'

const { Text } = Typography

interface SystemStatusCardProps {
  title: string
  cpuUsageText: string
  memoryUsageText: string
  diskUsageText: string
  cpuPercent?: number
  memoryPercent?: number
  diskPercent?: number
  isDark?: boolean
}

export const SystemStatusCard: React.FC<SystemStatusCardProps> = ({
  title,
  cpuUsageText,
  memoryUsageText,
  diskUsageText,
  cpuPercent = 30,
  memoryPercent = 68,
  diskPercent = 45,
  isDark = false
}) => {
  const {
    token: { borderRadiusLG },
  } = theme.useToken()

  return (
    <Card 
      title={title}
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
      bodyStyle={{ padding: '24px', height: 'calc(100% - 57px)' }}
    >
      <Space direction="vertical" style={{ width: '100%', height: '100%', justifyContent: 'center' }}>
        <div style={{ marginBottom: 16 }}>
          <Text>{cpuUsageText}</Text>
          <Progress percent={cpuPercent} size="small" />
        </div>
        <div style={{ marginBottom: 16 }}>
          <Text>{memoryUsageText}</Text>
          <Progress percent={memoryPercent} size="small" status="active" />
        </div>
        <div>
          <Text>{diskUsageText}</Text>
          <Progress percent={diskPercent} size="small" />
        </div>
      </Space>
    </Card>
  )
} 