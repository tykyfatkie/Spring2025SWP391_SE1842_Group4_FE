import React from 'react';
import { Layout, Typography, Button, Row, Col } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

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
              {/* Inline SVG Animation */}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 100 100" 
                width="180" 
                height="180"
                style={{ margin: '0 auto 20px' }}
              >
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  fill="white" 
                  stroke="#1e3a8a" 
                  strokeWidth="4"
                  strokeDasharray="283"
                  strokeDashoffset="283"
                >
                  <animate 
                    attributeName="stroke-dashoffset" 
                    from="283" 
                    to="0" 
                    dur="0.8s" 
                    fill="freeze" 
                  />
                  <animate 
                    attributeName="fill" 
                    from="white" 
                    to="#e6f7ff" 
                    dur="0.8s" 
                    fill="freeze" 
                    begin="0.8s"
                  />
                </circle>
                <path 
                  d="M30,50 L45,65 L70,35" 
                  fill="none" 
                  stroke="#1e3a8a" 
                  strokeWidth="6" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  strokeDasharray="100"
                  strokeDashoffset="100"
                >
                  <animate 
                    attributeName="stroke-dashoffset" 
                    from="100" 
                    to="0" 
                    dur="0.5s" 
                    fill="freeze"
                    begin="0.5s"
                  />
                </path>
              </svg>
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