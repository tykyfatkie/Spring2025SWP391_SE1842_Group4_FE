import React from 'react';
import { Layout, Typography, Button, Row, Col } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const PaymentSuccessful: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout style={{ 
      minHeight: '90vh', 
      background: '#f0f7ff',
      margin: '-25px' 
    }}>
      <Content style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(30, 58, 138, 0.05)',
          top: '-100px',
          left: '-100px',
        }} />
        <div style={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'rgba(30, 58, 138, 0.08)',
          bottom: '-50px',
          right: '50px',
        }} />

        <div style={{
          maxWidth: '600px',
          width: '100%',
          padding: '48px 24px',
          textAlign: 'center',
          background: 'white',
          borderRadius: '30px',
          boxShadow: '0 15px 40px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(30, 58, 138, 0.1)',
          position: 'relative',
          zIndex: 2
        }}>
          <Row justify="center" align="middle" gutter={[0, 24]}>
            <Col span={24}>
              <DotLottieReact
                src="https://lottie.host/31fc79ff-8552-4f14-bb62-77b5f8b93af3/cD4jFkoxSd.lottie"
                loop
                autoplay
                style={{ 
                  width: '250px', 
                  height: '250px', 
                  margin: '0 auto 20px' 
                }}
              />
            </Col>
            
            <Col span={24}>
              <div style={{ 
                display: 'inline-block', 
                padding: '8px 16px',
                background: 'rgba(30, 58, 138, 0.1)',
                borderRadius: '20px',
                marginBottom: '16px'
              }}>
                <span style={{ color: '#1e3a8a', fontWeight: '600', fontSize: '14px' }}>
                  PAYMENT CONFIRMED
                </span>
              </div>

              <Title level={2} style={{ 
                color: '#1e3a8a', 
                marginBottom: '16px',
                fontSize: '36px',
                fontWeight: 700
              }}>
                Payment Successful
              </Title>
              
              <Paragraph style={{ 
                color: '#4b5563', 
                fontSize: '16px', 
                maxWidth: '500px', 
                margin: '0 auto 32px',
                lineHeight: '1.6',
                textAlign: 'center'
              }}>
                Thank you for your payment! Your transaction has been processed successfully. 
                You can now access all features of our Child Growth Tracking System.
              </Paragraph>
              
              <Button 
                type="primary" 
                size="large" 
                onClick={() => navigate("/")}
                style={{
                  height: '52px',
                  padding: '0 32px',
                  fontSize: '16px',
                  fontWeight: '600',
                  borderRadius: '50px', 
                  background: '#1e3a8a',
                  border: 'none',
                  boxShadow: '0 8px 20px rgba(30, 58, 138, 0.25)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto'
                }}
                icon={<ArrowLeftOutlined />}
              >
                Back to Home
              </Button>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default PaymentSuccessful;