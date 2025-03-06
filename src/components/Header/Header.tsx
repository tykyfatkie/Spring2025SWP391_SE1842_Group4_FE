import React, { useState, useEffect } from 'react';
import { Layout, Menu, Row, Col, Space, Typography, Dropdown, Avatar } from 'antd';
import { 
  HomeOutlined, 
  UserOutlined, 
  InfoCircleOutlined, 
  ContactsOutlined 
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
    } else if (path.includes('/contact-us')) {
      setSelectedKey('contact');
    } else if (path.includes('/child-create')) {
      setSelectedKey('childs');
    } else if (path.includes('/about-us')) {
      setSelectedKey('about');
    }
  }, [location]);

  const handleLogoClick = () => {
    navigate('/home');
  };

  const handleLogout = () => {
    console.log("User logged out");
    navigate('/login');
  };

  const menu = (
    <Menu>
      <Menu.Item key="manage-profile" onClick={() => navigate('/manage-profile')}>
        Manage Profile
      </Menu.Item>
      <Menu.Item key="package" onClick={() => navigate('/package')}>
        Package
      </Menu.Item>
      <Menu.Item key="logout" danger onClick={handleLogout}>
        Logout
      </Menu.Item>    
    </Menu>
  );

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
              marginRight: '40px',
              minWidth: '100px'
            }}
          >
            <Menu.Item key="home" icon={<HomeOutlined />}>
              <a href="/home">Home</a>
            </Menu.Item>
            <Menu.Item key="contact" icon={<ContactsOutlined />}>
              <a href="/contact-us">Contact Us</a>
            </Menu.Item>
            <Menu.Item key="childs" icon={<UserOutlined />}>
              <a href="/child-create">Your Childs</a>
            </Menu.Item>
            <Menu.Item key="about" icon={<InfoCircleOutlined />}>
              <a href="/about-us">About</a>
            </Menu.Item>
          </Menu>
        </Col>

        <Col style={{ minWidth: '100px', marginLeft: '0px' }}> {/* Giảm margin để xích vào */}
          <Dropdown overlay={menu} trigger={['click']}>
            <Avatar icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
          </Dropdown>
        </Col>
      </Row>
    </Header>
  );
};

export default AppHeader;