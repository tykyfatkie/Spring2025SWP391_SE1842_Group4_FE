import React from 'react';
import { Layout, Menu, Row, Col, Space, Typography, Button } from 'antd';
import { 
    ContactsOutlined,
    HomeOutlined, 
    InfoCircleOutlined,
    LoginOutlined,
    UserAddOutlined
} from '@ant-design/icons';

const { Header } = Layout;
const { Title } = Typography;

const GuestHeader: React.FC = () => {
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
              WebkitTextFillColor: 'transparent'
            }}
          >
            Child Growth Tracking
          </Title>
        </Col>

        {/* Navigation Menu */}
        <Col flex="auto">
          <Menu 
            mode="horizontal" 
            defaultSelectedKeys={['home']}
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
              <a href="/about">About</a>
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
          </Space>
        </Col>
      </Row>
    </Header>
  );
};

export default GuestHeader;
