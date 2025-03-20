import { Layout, Row, Col, Typography, Space, Input, Button, Divider, Form } from 'antd';
import { FacebookOutlined, TwitterOutlined, InstagramOutlined, YoutubeOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined, SendOutlined, GlobalOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

const AppFooter = () => {
  return (
    <Footer
      style={{
        background: '#1e3a8a', // Màu xanh dương đậm giống hero section
        color: 'white',
        padding: '80px 50px 40px',
        borderTopLeftRadius: '80px',
        borderTopRightRadius: '80px',
        position: 'relative',
        overflow: 'hidden',
        marginRight: '25px' 
      }}
    >
      {/* Decorative elements */}
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.03)',
        top: '50px',
        right: '-100px',
        zIndex: 0,
      }} />
      <div style={{
        position: 'absolute',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.05)',
        bottom: '50px',
        left: '100px',
        zIndex: 0,
      }} />
      
      <Row justify="space-between" gutter={[32, 48]} style={{ position: 'relative', zIndex: 1 }}>
        <Col xs={24} sm={24} md={8} lg={8}>
          <div>
            <Title level={3} style={{ color: 'white', marginBottom: '20px', fontWeight: 600 }}>
              👶 Children Growth Tracking
            </Title>
            <Paragraph style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px', lineHeight: '1.6', marginBottom: '24px' }}>
              Track and monitor children's health and development with reliable information from trusted sources. Our platform provides scientifically backed tools for parents and healthcare professionals.
            </Paragraph>
            <Space size="middle" style={{ marginBottom: '24px' }}>
              <Button 
                type="text" 
                shape="circle" 
                icon={<FacebookOutlined style={{ fontSize: '20px', color: 'white' }} />} 
                style={{ 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  width: '40px', 
                  height: '40px' 
                }} 
              />
              <Button 
                type="text" 
                shape="circle" 
                icon={<TwitterOutlined style={{ fontSize: '20px', color: 'white' }} />} 
                style={{ 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  width: '40px', 
                  height: '40px' 
                }} 
              />
              <Button 
                type="text" 
                shape="circle" 
                icon={<InstagramOutlined style={{ fontSize: '20px', color: 'white' }} />} 
                style={{ 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  width: '40px', 
                  height: '40px' 
                }} 
              />
              <Button 
                type="text" 
                shape="circle" 
                icon={<YoutubeOutlined style={{ fontSize: '20px', color: 'white' }} />} 
                style={{ 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  width: '40px', 
                  height: '40px' 
                }} 
              />
            </Space>
          </div>
        </Col>

        <Col xs={24} sm={12} md={5} lg={5}>
          <Title 
            level={4} 
            style={{ 
              color: 'white', 
              marginBottom: '24px', 
              fontWeight: 600, 
              position: 'relative',
              paddingBottom: '12px',
            }}
          >
            Resources
            <div style={{ 
              position: 'absolute', 
              bottom: 0, 
              left: 0, 
              width: '40px', 
              height: '3px', 
              background: '#3b82f6', 
              borderRadius: '2px' 
            }} />
          </Title>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Link to="/about" style={{ color: 'rgba(255, 255, 255, 0.8)', display: 'block', fontSize: '16px', transition: 'color 0.3s' }}>About Us</Link>
            <Link to="/contact" style={{ color: 'rgba(255, 255, 255, 0.8)', display: 'block', fontSize: '16px', transition: 'color 0.3s' }}>Contact</Link>
            <Link to="/privacy" style={{ color: 'rgba(255, 255, 255, 0.8)', display: 'block', fontSize: '16px', transition: 'color 0.3s' }}>Privacy Policy</Link>
            <a href="https://www.who.int/" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255, 255, 255, 0.8)', display: 'block', fontSize: '16px', transition: 'color 0.3s' }}>
              <GlobalOutlined style={{ marginRight: '8px' }} />
              World Health Organization
            </a>
          </Space>
        </Col>

        <Col xs={24} sm={12} md={5} lg={5}>
          <Title 
            level={4} 
            style={{ 
              color: 'white', 
              marginBottom: '24px', 
              fontWeight: 600, 
              position: 'relative',
              paddingBottom: '12px',
            }}
          >
            Contact Us
            <div style={{ 
              position: 'absolute', 
              bottom: 0, 
              left: 0, 
              width: '40px', 
              height: '3px', 
              background: '#3b82f6', 
              borderRadius: '2px' 
            }} />
          </Title>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <PhoneOutlined style={{ color: '#3b82f6', marginRight: '12px', fontSize: '16px', marginTop: '4px' }} />
              <Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>+84 123 456 789</Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <MailOutlined style={{ color: '#3b82f6', marginRight: '12px', fontSize: '16px', marginTop: '4px' }} />
              <Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>info@childgrowth.com</Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <EnvironmentOutlined style={{ color: '#3b82f6', marginRight: '12px', fontSize: '16px', marginTop: '4px' }} />
              <Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Km10, Nguyen Trai Street, Ha Dong District, Hanoi, Vietnam</Text>
            </div>
          </Space>
        </Col>

        <Col xs={24} sm={12} md={6} lg={6}>
          <Title 
            level={4} 
            style={{ 
              color: 'white', 
              marginBottom: '24px', 
              fontWeight: 600, 
              position: 'relative',
              paddingBottom: '12px',
            }}
          >
            Newsletter
            <div style={{ 
              position: 'absolute', 
              bottom: 0, 
              left: 0, 
              width: '40px', 
              height: '3px', 
              background: '#3b82f6', 
              borderRadius: '2px' 
            }} />
          </Title>
          <Paragraph style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '24px' }}>
            Subscribe to our newsletter for the latest updates and insights on child health and development.
          </Paragraph>
          <Form>
            <Space.Compact style={{ width: '100%' }}>
              <Input 
                placeholder="Your email address" 
                style={{ 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  borderRight: 'none',
                  color: 'white',
                  height: '44px',
                  borderRadius: '8px 0 0 8px',
                }} 
              />
              <Button 
                type="primary" 
                icon={<SendOutlined />} 
                style={{ 
                  background: '#3b82f6', 
                  border: 'none',
                  height: '44px',
                  borderRadius: '0 8px 8px 0',
                }}
              />
            </Space.Compact>
          </Form>
        </Col>
      </Row>
      
      <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.1)', margin: '40px 0 20px' }} />
      
      <Row justify="space-between" align="middle">
        <Col xs={24} md={12} style={{ textAlign: 'center', marginBottom: { xs: 16, md: 0 } }}>
          <Text style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            Children Growth Tracking System © {new Date().getFullYear()} - Created by Group 4-SE1842
          </Text>
        </Col>
        <Col xs={24} md={12} style={{ textAlign: { xs: 'center', md: 'right' } }}>
          <Space split={<Divider type="vertical" style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />}>
            <Link to="/terms" style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px' }}>Terms</Link>
            <Link to="/privacy" style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px' }}>Privacy</Link>
            <Link to="/cookies" style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px' }}>Cookies</Link>
          </Space>
        </Col>
      </Row>
    </Footer>
  );
};

export default AppFooter;