import React, { useState, useEffect } from 'react';
import { Layout, Menu, Row, Col, Space, Typography, Button, Avatar } from 'antd';
import { 
  HomeOutlined, 
  UserOutlined, 
  InfoCircleOutlined, 
  DashboardOutlined,
  ContactsOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';

const { Header } = Layout;
const { Title } = Typography;

const AppHeader: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedKey, setSelectedKey] = useState('home');

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/home')) {
      setSelectedKey('home');
    } else if (path.includes('/dashboard')) {
      setSelectedKey('dashboard');
    } else if (path.includes('/contact-us')) {
      setSelectedKey('contact');
    } else if (path.includes('/profile')) {
      setSelectedKey('profile');
    } else if (path.includes('/about-us')) {
      setSelectedKey('about');
    }
  }, [location]);

  const handleLogoClick = () => {
    navigate('/home');
  };

  const handleLogout = () => {
    // Handle logout logic here
    console.log("User logged out");
    navigate('/login');
  };

  return (
    <Header 
      style={{ 
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 1,
        width: '100%'
      }}
    >
      <Row justify="space-between" align="middle" style={{ height: '100%' }}>
        <Col>
          <Space align="center" size={16} onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
            <Title 
              level={4} 
              style={{ 
                margin: 0,
                background: 'linear-gradient(45deg, #1890ff, #722ed1)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Child Growth Tracking
            </Title>
          </Space>
        </Col>
        
        <Col flex="auto">
          <Menu 
            mode="horizontal" 
            selectedKeys={[selectedKey]}
            style={{ 
              border: 'none',
              justifyContent: 'center',
              marginLeft: '0px'
            }}
          >
            <Menu.Item key="home" icon={<HomeOutlined />}>
              <a href="/home">Home</a>
            </Menu.Item>
            <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
              <a href="/dashboard">Dashboard</a>
            </Menu.Item>
            <Menu.Item key="contact" icon={<ContactsOutlined />}>
              <a href="/contact-us">Contact Us</a>
            </Menu.Item>
            <Menu.Item key="profile" icon={<UserOutlined />}>
              <a href="/child-create">Profile</a>
            </Menu.Item>
            <Menu.Item key="about" icon={<InfoCircleOutlined />}>
              <a href="/about-us">About</a>
            </Menu.Item>
          </Menu>
        </Col>

        <Col>
          <Space>
            <Button type="primary" onClick={() => navigate('/manage-profile')}>
              Manage Profile
            </Button>
            <Button type="default" danger onClick={handleLogout}>
              Logout
            </Button>
            <Avatar icon={<UserOutlined />} />
          </Space>
        </Col>
      </Row>
    </Header>
  );
};

export default AppHeader;
