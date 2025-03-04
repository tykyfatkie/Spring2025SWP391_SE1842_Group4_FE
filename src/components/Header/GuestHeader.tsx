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
        zIndex: 1000,
        width: '98vw',
        maxWidth: '100%', // Đảm bảo không bị tràn
        minWidth: '320px',
      }}
    >
      <Row justify="space-between" align="middle" style={{ height: '100%', flexWrap: 'nowrap', width: '100%' }}>
        {/* Logo */}
        <Col flex="1"> 
          <Title 
            level={4} 
            style={{ 
              margin: 0,
              whiteSpace: 'nowrap', 
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

        {/* Menu */}
        <Col flex="2">
          <Menu 
            mode="horizontal" 
            selectedKeys={[selectedKey]}
            style={{ 
              border: 'none',
              justifyContent: 'center',
              flex: 1,  // Dùng flex thay vì width cố định
              minWidth: '200px', // Đảm bảo không bị thu nhỏ quá mức
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

        {/* Auth Buttons */}
        <Col flex="1" style={{ textAlign: 'right' }}>
          <Space size="middle">
            <Button type="primary" icon={<LoginOutlined />} href="/login">
              Login
            </Button>
            <Button icon={<UserAddOutlined />} href="/register">
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
