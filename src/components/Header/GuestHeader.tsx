import React, { useState, useEffect } from 'react';
import { Layout, Menu, Row, Col, Space, Typography, Button } from 'antd';
import { 
    ContactsOutlined,
    CrownOutlined,
    HomeOutlined, 
    InfoCircleOutlined,
    LoginOutlined,
    UserAddOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';

const { Header } = Layout;
const { Title } = Typography;

const GuestHeader: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedKey, setSelectedKey] = useState('home');

  // Update the selected key based on the current path
  useEffect(() => {
    const path = location.pathname;
    if (path === '/' || path === '/home') {
      setSelectedKey('home');
    } else if (path.includes('/about-us')) {
      setSelectedKey('about');
    } else if (path.includes('/contact-us')) {
      setSelectedKey('contact-us');
    }
  }, [location]);

  // Handle logo click to navigate to home page
  const handleLogoClick = () => {
    navigate('/');
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
        {/* Logo and Title */}
        <Col>
          <Title 
            level={4} 
            style={{ 
              margin: 0,
              background: 'linear-gradient(45deg, #1890ff, #722ed1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              cursor: 'pointer'
            }}
            onClick={handleLogoClick}
          >
            Child Growth Tracking
          </Title>
        </Col>

        {/* Navigation Menu */}
        <Col flex="auto">
          <Menu 
            mode="horizontal" 
            selectedKeys={[selectedKey]}
            style={{ 
              border: 'none',
              justifyContent: 'right',
              marginLeft: '80px'
            }}
          >
            <Menu.Item key="home" icon={<HomeOutlined />}>
              <a href="/">Home</a>
            </Menu.Item>
            <Menu.Item key="about" icon={<InfoCircleOutlined />}>
              <a href="/about-us">About</a>
            </Menu.Item>
            <Menu.Item key="contact-us" icon={<ContactsOutlined />}>
              <a href="/contact-us">Contact Us</a>
            </Menu.Item>
          </Menu>
        </Col>

        {/* Authentication Buttons */}
        <Col>
          <Space size="middle">
            <Button 
              type="primary" 
              icon={<LoginOutlined />}
              href="/login"
            >
              Login
            </Button>
            <Button 
              icon={<UserAddOutlined />}
              href="/register"
            >
              Register
            </Button>
            <Button
              style={{ color: '#faad14', borderColor: '#faad14' }}
              icon={<CrownOutlined style={{ color: '#faad14' }} />}
              href="/package"
            >
              Package
            </Button>
          </Space>
        </Col>
      </Row>
    </Header>
  );
};

export default GuestHeader;