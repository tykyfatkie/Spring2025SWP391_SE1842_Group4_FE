import React from 'react';
import { Layout, Typography, Button, Row, Col } from 'antd';
import { HomeOutlined, SyncOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const PaymentFailed: React.FC = () => {
  const navigate = useNavigate();

  const handleRetryPayment = () => {
    navigate('/package');
  };

  return (
    <Layout style={{ 
      minHeight: '90vh', 
      background: '#fff2f0',
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
        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(255, 0, 0, 0.05)',
          top: '-100px',
          left: '-100px',
        }} />
        <div style={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'rgba(255, 0, 0, 0.08)',
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
          border: '1px solid rgba(255, 0, 0, 0.1)',
          position: 'relative',
          zIndex: 2
        }}>
          <Row justify="center" align="middle" gutter={[0, 24]}>
            <Col span={24}>
              {/* Inline SVG Animation - Error X Mark */}
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
                  stroke="#d32f2f" 
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
                    to="#fff2f0" 
                    dur="0.8s" 
                    fill="freeze" 
                    begin="0.8s"
                  />
                </circle>
                {/* First line of the X */}
                <line 
                  x1="35" 
                  y1="35" 
                  x2="65" 
                  y2="65" 
                  stroke="#d32f2f" 
                  strokeWidth="6" 
                  strokeLinecap="round"
                  strokeDasharray="45"
                  strokeDashoffset="45"
                >
                  <animate 
                    attributeName="stroke-dashoffset" 
                    from="45" 
                    to="0" 
                    dur="0.4s" 
                    fill="freeze"
                    begin="0.5s"
                  />
                </line>
                {/* Second line of the X */}
                <line 
                  x1="65" 
                  y1="35" 
                  x2="35" 
                  y2="65" 
                  stroke="#d32f2f" 
                  strokeWidth="6" 
                  strokeLinecap="round"
                  strokeDasharray="45"
                  strokeDashoffset="45"
                >
                  <animate 
                    attributeName="stroke-dashoffset" 
                    from="45" 
                    to="0" 
                    dur="0.4s" 
                    fill="freeze"
                    begin="0.9s"
                  />
                </line>
              </svg>
            </Col>
            
            <Col span={24}>
              <div style={{ 
                display: 'inline-block', 
                padding: '8px 16px',
                background: 'rgba(255, 0, 0, 0.1)',
                borderRadius: '20px',
                marginBottom: '16px'
              }}>
                <span style={{ color: '#d32f2f', fontWeight: '600', fontSize: '14px' }}>
                  PAYMENT FAILED
                </span>
              </div>

              <Title level={2} style={{ 
                color: '#d32f2f', 
                marginBottom: '16px',
                fontSize: '36px',
                fontWeight: 700
              }}>
                Payment Failed
              </Title>
              
              <Paragraph style={{ 
                color: '#4b5563', 
                fontSize: '16px', 
                maxWidth: '500px', 
                margin: '0 auto 32px',
                lineHeight: '1.6',
                textAlign: 'center'
              }}>
                Unfortunately, your payment could not be processed. 
                Please check your payment details and try again.
              </Paragraph>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '16px' 
              }}>
                <Button 
                  type="default" 
                  size="large" 
                  onClick={() => navigate("/")}
                  style={{
                    height: '52px',
                    padding: '0 32px',
                    fontSize: '16px',
                    fontWeight: '600',
                    borderRadius: '50px', 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  icon={<HomeOutlined />}
                >
                  Back to Home
                </Button>

                <Button 
                  type="primary" 
                  size="large" 
                  onClick={handleRetryPayment}
                  style={{
                    height: '52px',
                    padding: '0 32px',
                    fontSize: '16px',
                    fontWeight: '600',
                    borderRadius: '50px', 
                    background: '#d32f2f',
                    border: 'none',
                    boxShadow: '0 8px 20px rgba(211, 47, 47, 0.25)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  icon={<SyncOutlined />}
                >
                  Retry Payment
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default PaymentFailed;