import React from 'react'
import { Card, Row, Col, Avatar, Typography, Space, Tag, Button } from 'antd'
import { theme } from 'antd'
import { AvatarUpload } from '@/components/avatar-upload'

const { Title, Paragraph } = Typography

interface WelcomeCardProps {
  username?: string
  email?: string
  welcomeText: string
  adminText: string
  onlineText: string
  configCheckText?: string
  backendDemoText?: string
  onConfigCheck?: () => void
  onBackendDemo?: () => void
  isDark?: boolean
  colorPrimary: string
}

export const WelcomeCard: React.FC<WelcomeCardProps> = ({
  username = 'User',
  email = 'user@example.com',
  welcomeText,
  adminText,
  onlineText,
  configCheckText,
  backendDemoText,
  onConfigCheck,
  onBackendDemo,
  isDark = false,
  colorPrimary
}) => {
  const {
    token: { borderRadiusLG },
  } = theme.useToken()

  const showButtons = configCheckText && backendDemoText && onConfigCheck && onBackendDemo

  return (
    <Card 
      style={{ 
        marginBottom: 16,
        height: 180,
        background: isDark
          ? 'linear-gradient(135deg, rgba(38,38,38,0.9) 0%, rgba(58,58,58,0.7) 50%, rgba(38,38,38,0.9) 100%)'
          : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.8) 50%, rgba(255,255,255,0.95) 100%)',
        border: isDark
          ? '1px solid rgba(255,255,255,0.12)' 
          : '1px solid rgba(24, 144, 255, 0.12)',
        backdropFilter: 'blur(12px)',
        borderRadius: borderRadiusLG,
        boxShadow: isDark
          ? '0 4px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)' 
          : '0 4px 16px rgba(24, 144, 255, 0.1), inset 0 1px 0 rgba(255,255,255,0.9)'
      }}
      bodyStyle={{ padding: '24px', height: '100%' }}
    >
      <Row gutter={[24, 16]} align="middle" style={{ height: '100%' }}>
        <Col style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AvatarUpload 
            size={64} 
            showUpload={false}
            style={{ 
              backgroundColor: colorPrimary,
              boxShadow: isDark
                ? `0 4px 16px ${colorPrimary}66` 
                : `0 4px 16px ${colorPrimary}50`
            }}
          />
        </Col>
        <Col flex="auto">
          <Title level={3} style={{ margin: 0 }}>
            {welcomeText}，{username}！
          </Title>
          <Paragraph style={{ 
            margin: '8px 0 0 0', 
            color: isDark ? '#bfbfbf' : '#666' 
          }}>
            {email}
          </Paragraph>
          <Space style={{ marginTop: 12 }}>
            <Tag color="blue">{adminText}</Tag>
            <Tag color="green">{onlineText}</Tag>
          </Space>
        </Col>
        {showButtons && (
          <Col>
            <Space>
              <Button type="primary" onClick={onConfigCheck}>
                {configCheckText}
              </Button>
              <Button onClick={onBackendDemo}>
                {backendDemoText}
              </Button>
            </Space>
          </Col>
        )}
      </Row>
    </Card>
  )
} 