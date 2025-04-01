import React, { useState } from 'react';
import { Button, Typography, Space } from 'antd';
import { UpOutlined, DownOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

interface CollapsibleHeaderProps {
  title: string;
  subtitle: string;
  description: string;
  features?: string[];
  defaultCollapsed?: boolean;
}

const CollapsibleHeader: React.FC<CollapsibleHeaderProps> = ({
  title,
  subtitle,
  description,
  features = [],
  defaultCollapsed = false,
}) => {
  const [collapsed, setCollapsed] = useState<boolean>(defaultCollapsed);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div style={{ 
      marginBottom: '40px', 
      background: 'linear-gradient(135deg, rgb(30, 58, 138) 0%, rgb(59, 130, 246) 100%)', 
      padding: collapsed ? '24px 32px' : '48px 32px', 
      borderRadius: '20px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      transition: 'padding 0.3s ease-in-out'
    }}>
      {/* Decorative elements */}
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.05)',
        top: '-100px',
        left: '-100px',
      }} />
      <div style={{
        position: 'absolute',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.08)',
        bottom: '-50px',
        right: '50px',
      }} />
      
      {/* Header with toggle button */}
      <div style={{
        padding: '0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        zIndex: 3
      }}>
        <div>
          <div style={{
            display: 'inline-block',
            padding: '8px 16px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            marginBottom: '8px'
          }}>
            <span style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>{subtitle}</span>
          </div>
          <Title level={2} style={{ color: 'white', margin: 0, fontWeight: 700 }}>
            {title}
          </Title>
        </div>
        
        {/* Collapse/Expand Button */}
        <Button 
          type="default"
          shape="circle"
          icon={collapsed ? <DownOutlined /> : <UpOutlined />}
          onClick={toggleCollapse}
          style={{
            backgroundColor: 'white',
            color: '#1e3a8a',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px'
          }}
          aria-label={collapsed ? "Expand" : "Collapse"}
        />
      </div>
      
      {/* Collapsible Content */}
      <div style={{
        padding: collapsed ? '0' : '24px 0 0 0',
        maxHeight: collapsed ? '0' : '500px',
        opacity: collapsed ? 0 : 1,
        transition: 'all 0.3s ease-in-out',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 2
      }}>
        <Paragraph style={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.9)', maxWidth: '700px' }}>
          {description}
        </Paragraph>
        
        {features.length > 0 && (
          <Space direction="vertical" size="middle" style={{ width: '100%', marginTop: '24px' }}>
            {features.map((feature, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircleOutlined style={{ color: '#3b82f6', marginRight: '12px' }} />
                <Text style={{ color: 'white' }}>{feature}</Text>
              </div>
            ))}
          </Space>
        )}
      </div>
    </div>
  );
};

export default CollapsibleHeader;
