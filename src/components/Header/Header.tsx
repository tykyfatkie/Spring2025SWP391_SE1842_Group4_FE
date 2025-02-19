import React from 'react';
import { Layout, Menu, Row, Col, Space, Typography, Button, Avatar } from 'antd';
import { 
  HomeOutlined, 
  UserOutlined, 
  InfoCircleOutlined, 
  DashboardOutlined,
  ContactsOutlined,
  SettingOutlined
} from '@ant-design/icons';

const { Header } = Layout;
const { Title } = Typography;

const AppHeader: React.FC = () => {
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
          <Space align="center" size={16}>
            {/* <Avatar 
              size={40}
              style={{ 
                backgroundColor: '#1890ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              CGT
            </Avatar> */}
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
            defaultSelectedKeys={['home']}
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
            <a href="/profile">Profile</a>
            </Menu.Item>
            <Menu.Item key="about" icon={<InfoCircleOutlined />}>
              About
            </Menu.Item>
          </Menu>
        </Col>

        <Col>
          <Space>
            <Button 
              type="text" 
              icon={<SettingOutlined />}
              style={{ fontSize: '16px' }}
            />
            <Avatar icon={<UserOutlined />} />
          </Space>
        </Col>
      </Row>
    </Header>
  );
};

export default AppHeader;