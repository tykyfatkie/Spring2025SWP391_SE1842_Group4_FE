import React from 'react';
import { Layout, Typography, Space, Button } from 'antd';
import AppFooter from '../../components/Footer/Footer';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const AboutPage: React.FC = () => {
  const navigate = useNavigate();
  

  
  
  return (
    <Layout style={{ minHeight: '100vh', margin: "-25px", background: 'white' }}>
      <Content>
        {/* Hero Section */}
        <div style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
          padding: '80px 0',
          color: 'white',
          textAlign: 'center',
          borderRadius: '0 0 30px 30px',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '60px',
          marginRight: '50px',
        }}>
          {/* Decorative elements */}
          <div style={{
            position: 'absolute',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
            top: '-100px',
            left: '-100px',
          }} />
          <div style={{
            position: 'absolute',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
            bottom: '-50px',
            right: '50px',
          }} />
          
          <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px', position: 'relative', zIndex: 2 }}>
            <div style={{ 
              display: 'inline-block', 
              padding: '8px 16px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              marginBottom: '16px'
            }}>
              <span style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>OUR STORY</span>
            </div>
            
            <Title level={1} style={{ color: 'white', fontSize: '48px', marginBottom: '24px', fontWeight: 700 }}>
              Dedicated to Child Growth & Development
            </Title>
            
            <Paragraph style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.9)', maxWidth: '700px', margin: '0 auto 32px', lineHeight: 1.6 }}>
              We combine scientific expertise with innovative technology to help parents and healthcare professionals monitor children's growth, ensuring every child reaches their full potential.
            </Paragraph>
            
            <Space size="middle">
              <Button 
                type="primary" 
                size="large" 
                style={{ 
                  borderRadius: '50px', 
                  paddingLeft: '28px', 
                  paddingRight: '28px',
                  height: '52px',
                  background: 'white',
                  color: '#1e3a8a',
                  border: 'none',
                  fontWeight: 600,
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
                }}
                onClick={() => navigate("/contact-us")}
              >
                Contact Us
              </Button>
              <Button 
                size="large"
                style={{ 
                  borderRadius: '50px', 
                  borderColor: 'rgba(255, 255, 255, 0.3)', 
                  color: 'white',
                  paddingLeft: '28px', 
                  paddingRight: '28px',
                  height: '52px',
                  background: 'transparent',
                  fontWeight: 500,
                }}
                onClick={() => navigate("/register")}
              >
                Join Us
              </Button>
            </Space>
          </div>
        </div>
        
        {/* Content continues unchanged */}
      </Content>

      {/* Footer */}
      <AppFooter />
    </Layout>
  );
};

export default AboutPage;
