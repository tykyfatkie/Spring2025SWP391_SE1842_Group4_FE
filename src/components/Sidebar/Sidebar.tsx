import React, { useState } from 'react';
import { Layout, Menu, Typography, Avatar, Divider } from 'antd';
import {
  LineChartOutlined,
  AppstoreOutlined,
  TeamOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

const { Sider } = Layout;
const { Title } = Typography;

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  // Determine the current active menu item based on URL path
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.includes('child-analytics')) return 'analytics';
    if (path.includes('child-create')) return 'create-profile';
    if (path.includes('child-manage')) return 'manage-profile';
    if (path.includes('consultation-requests')) return 'consultation-requests';
    return 'analytics'; // Default to analytics instead of dashboard
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      width={260}
      style={{
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 80, 
        overflow: 'auto',
        background: '#1e3a8a', 
        boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
        zIndex: 999, 
      }}
    >
      {/* Logo and Title Section */}
      <div
        style={{
          padding: collapsed ? '16px 8px' : '24px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '8px',
        }}
      >
        <Avatar
          size={collapsed ? 36 : 40}
          style={{ 
            background: 'white',
            color: '#1e3a8a',
            marginRight: collapsed ? 0 : 12,
          }}
          icon={<AppstoreOutlined />}
        />
        {!collapsed && (
          <Title
            level={4}
            style={{
              color: 'white',
              margin: 0,
              fontSize: '18px',
              fontWeight: 600,
            }}
          >
            Growth Tracker
          </Title>
        )}
      </div>

      {/* Navigation Menu */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        style={{ 
          fontSize: '15px', 
          background: 'transparent',
          borderRight: 'none',
        }}
      >
        {!collapsed && (
          <div style={{ padding: '0 16px 8px', color: 'rgba(255, 255, 255, 0.5)', fontSize: '12px', marginTop: '4px' }}>
            CHILD MANAGEMENT
          </div>
        )}
        
        <Menu.Item 
          key="analytics" 
          icon={<LineChartOutlined />}
          style={{ margin: '4px 0' }}
        >
          <Link to="/child-analytics">Analytics</Link>
        </Menu.Item>
        
        
        <Menu.Item 
          key="manage-profile" 
          icon={<TeamOutlined />}
          style={{ margin: '4px 0' }}
        >
          <Link to="/child-manage">Manage Children</Link>
        </Menu.Item>
        
        <Divider 
          style={{ 
            margin: '12px 0', 
            borderColor: 'rgba(255, 255, 255, 0.1)',
            display: collapsed ? 'none' : 'block',
          }} 
        />
        
        {!collapsed && (
          <div style={{ padding: '0 16px 8px', color: 'rgba(255, 255, 255, 0.5)', fontSize: '12px' }}>
            TOOLS & SERVICES
          </div>
        )}        
        
        <Menu.Item 
          key="consultation-requests" 
          icon={<MessageOutlined />}
          style={{ margin: '4px 0' }}
        >
          <Link to="/consultation-requests">Consultations</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;