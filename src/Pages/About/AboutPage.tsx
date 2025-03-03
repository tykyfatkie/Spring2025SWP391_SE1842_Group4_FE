import React from 'react';
import { Layout, Typography, Row, Col, Card, Space } from 'antd';
import { 
  TeamOutlined, 
  SafetyOutlined, 
  RocketOutlined
} from '@ant-design/icons';
import GuestHeader from '../../components/Header/GuestHeader';

const { Title, Paragraph } = Typography;

const AboutPage: React.FC = () => {

  return (
    <Layout style={{ minHeight: '100vh', margin: '-25px', width: '1420px' }}>
      <GuestHeader />
      <Layout.Content style={{ padding: '40px 50px', background: '#fff' }}>
        <Space direction="vertical" size={64} style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <Title>About Child Growth Tracking</Title>
            <Paragraph style={{ fontSize: '18px', maxWidth: '800px', margin: '0 auto' }}>
              We are dedicated to helping parents and healthcare providers monitor and optimize children's growth and development through our comprehensive tracking system.
            </Paragraph>
          </div>

          {/* Mission & Values */}
          <Row gutter={[32, 32]} justify="center">
            <Col xs={24} md={8}>
              <Card hoverable>
                <Space direction="vertical" align="center" style={{ width: '100%', textAlign: 'center' }}>
                  <TeamOutlined style={{ fontSize: '36px', color: '#1677ff' }} />
                  <Title level={4}>Our Mission</Title>
                  <Paragraph>
                    To empower parents and healthcare providers with tools and insights for optimal child development monitoring.
                  </Paragraph>
                </Space>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card hoverable>
                <Space direction="vertical" align="center" style={{ width: '100%', textAlign: 'center' }}>
                  <SafetyOutlined style={{ fontSize: '36px', color: '#1677ff' }} />
                  <Title level={4}>Our Values</Title>
                  <Paragraph>
                    We prioritize accuracy, privacy, and user-friendly experience in tracking children's growth journey.
                  </Paragraph>
                </Space>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card hoverable>
                <Space direction="vertical" align="center" style={{ width: '100%', textAlign: 'center' }}>
                  <RocketOutlined style={{ fontSize: '36px', color: '#1677ff' }} />
                  <Title level={4}>Our Vision</Title>
                  <Paragraph>
                    To become the leading platform for child growth monitoring and development tracking worldwide.
                  </Paragraph>
                </Space>
              </Card>
            </Col>
          </Row>
        </Space>
      </Layout.Content>
    </Layout>
  );
};

export default AboutPage;
