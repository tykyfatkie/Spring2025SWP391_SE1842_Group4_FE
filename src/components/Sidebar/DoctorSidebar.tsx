import React, { useState } from 'react';
import { Layout, Menu } from 'antd'; 
import { 
  UserOutlined, 
  LineChartOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import LogoutButton from '../LogoutButton/LogoutButton';

const { Sider } = Layout; 

const DoctorSidebar: React.FC = () => {
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
        background: 'rgba(185, 0, 209, 0.88)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)', 
        borderRight: '1px solid rgb(255, 255, 255)', 
      }}
    >
      {/* Navigation Menu */}
      <Menu 
        theme="dark" 
        mode="inline" 
        defaultSelectedKeys={['dashboard']}
        style={{ fontSize: '16px', background: 'transparent' }} 
      >
        <Menu.Item key="consultation-requests" icon={<UserOutlined />}>
          <Link to="/my-doctor/consultation-response">Consultation Response</Link>
        </Menu.Item>

        <Menu.Item key="consultation-requests" icon={<UserOutlined />}>
          <Link to="/my-doctor/consultation-response">Consultation Response</Link>
        </Menu.Item>    

        </Menu>
            <div style={{ padding: "16px" }}>
                <LogoutButton />
            </div>
            
    </Sider>
  );
};

export default DoctorSidebar;
