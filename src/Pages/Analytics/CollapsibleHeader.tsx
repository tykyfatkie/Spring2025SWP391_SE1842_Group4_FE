import React, { useState } from 'react';
import { Button, Typography, Space } from 'antd';
import { UpOutlined, DownOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface CollapsibleHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  features?: string[];
}

const CollapsibleHeader: React.FC<CollapsibleHeaderProps> = ({
  title,
  subtitle = 'BMI MANAGEMENT',
  description = 'Monitor your child\'s Body Mass Index (BMI) over time. This tracking tool helps you visualize growth patterns and ensure healthy development according to WHO standards.',
  features = [
    'Visualize BMI trends over time',
    'Compare with WHO standard percentiles',
    'Record new BMI measurements easily'
  ]
}) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  
  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div style={{ 
      marginBottom: '40px', 
      background: 'linear-gradient(135deg, rgb(30, 58, 138) 0%, rgb(59, 130, 246) 100%)', 
      borderRadius: '20px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
    }}>
      {/* Header Section with collapse button */}
      <div style={{ 
        padding: '20px 32px',
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
          <Title level={3} style={{ color: 'white', margin: 0, fontWeight: 700 }}>
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
        padding: collapsed ? '0 32px' : '0 32px 32px 32px',
        maxHeight: collapsed ? '0' : '500px',
        opacity: collapsed ? 0 : 1,
        transition: 'all 0.3s ease-in-out',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 2
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
          zIndex: 1
        }} />
        <div style={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.08)',
          bottom: '-50px',
          right: '50px',
          zIndex: 1
        }} />
        
        <Paragraph style={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.9)', maxWidth: '700px' }}>
          {description}
        </Paragraph>
        
        <Space direction="vertical" size="middle" style={{ width: '100%', marginTop: '24px' }}>
          {features.map((feature, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
              <CheckCircleOutlined style={{ color: '#3b82f6', marginRight: '12px' }} />
              <Text style={{ color: 'white' }}>{feature}</Text>
            </div>
          ))}
        </Space>
      </div>
    </div>
  );
};

export default CollapsibleHeader;