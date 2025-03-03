import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { 
  UserOutlined, 
  LineChartOutlined,
  DashboardOutlined, 
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Sider 
      collapsible 
      collapsed={collapsed} 
      onCollapse={(value) => setCollapsed(value)}
      width={260} 
      theme="dark"
      style={{ 
        minHeight: '100vh',
        paddingTop: '10px',
        background: 'rgba(0, 140, 255, 0.84)', // Semi-transparent background
        backdropFilter: 'blur(12px)', // Gaussian Blur Effect
        WebkitBackdropFilter: 'blur(12px)', // Safari Support
        borderRight: '1px solid rgba(255, 255, 255, 0.2)', // Subtle border
      }}
    >
      {/* Navigation Menu */}
      <Menu 
        theme="dark" 
        mode="inline" 
        defaultSelectedKeys={['dashboard']}
        style={{ fontSize: '16px', background: 'transparent' }} // Transparent Menu
      >
        <Menu.Item key="analytics" icon={<LineChartOutlined />}>
          <Link to="/child-analytics">Analytics</Link>
        </Menu.Item>

        <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
          <Link to="/dashboard">Dashboard</Link>
        </Menu.Item>

        <Menu.Item key="create-profile" icon={<UserOutlined />}>
          <Link to="/child-create">Create Child Profile</Link>
        </Menu.Item>

        <Menu.Item key="manage-profile" icon={<UserOutlined />}>
          <Link to="/child-edit">Manage Children</Link>
        </Menu.Item>

      </Menu>
    </Sider>
  );
};

export default Sidebar;
