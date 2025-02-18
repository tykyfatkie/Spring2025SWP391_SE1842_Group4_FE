import React from 'react';
import { Layout, Typography, Row, Col, Card, Space, Form, Input, Button, message } from 'antd';
import { 
  TeamOutlined, 
  SafetyOutlined, 
  RocketOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import GuestHeader from '../../components/Header/GuestHeader';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

export const AboutPage: React.FC = () => {
  return (
    <Layout>
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

export const ContactPage: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Contact form values:', values);
    message.success('Message sent successfully! We will get back to you soon.');
    form.resetFields();
  };

  return (
    <Layout>
      <GuestHeader />
      <Layout.Content style={{ padding: '40px 50px', background: '#fff' }}>
        <Space direction="vertical" size={64} style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <Title>Contact Us</Title>
            <Paragraph style={{ fontSize: '18px' }}>
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </Paragraph>
          </div>

          <Row gutter={[32, 32]} justify="center">
            <Col xs={24} md={8}>
              <Card hoverable>
                <Space direction="vertical" align="center" style={{ width: '100%', textAlign: 'center' }}>
                  <MailOutlined style={{ fontSize: '24px', color: '#1677ff' }} />
                  <Title level={4}>Email Us</Title>
                  <Text>support@childgrowth.com</Text>
                </Space>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card hoverable>
                <Space direction="vertical" align="center" style={{ width: '100%', textAlign: 'center' }}>
                  <PhoneOutlined style={{ fontSize: '24px', color: '#1677ff' }} />
                  <Title level={4}>Call Us</Title>
                  <Text>+1 (555) 123-4567</Text>
                </Space>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card hoverable>
                <Space direction="vertical" align="center" style={{ width: '100%', textAlign: 'center' }}>
                  <EnvironmentOutlined style={{ fontSize: '24px', color: '#1677ff' }} />
                  <Title level={4}>Visit Us</Title>
                  <Text>123 Growth Street, Health City, HC 12345</Text>
                </Space>
              </Card>
            </Col>
          </Row>

          <Row justify="center">
            <Col xs={24} md={16} lg={12}>
              <Card title="Send us a Message" bordered={false}>
                <Form form={form} layout="vertical" onFinish={onFinish} size="large">
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter your name' }]}>
                        <Input placeholder="Your name" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                          { required: true, message: 'Please enter your email' },
                          { type: 'email', message: 'Please enter a valid email' }
                        ]}
                      >
                        <Input placeholder="Your email" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item name="subject" label="Subject" rules={[{ required: true, message: 'Please enter a subject' }]}>
                    <Input placeholder="Message subject" />
                  </Form.Item>
                  <Form.Item name="message" label="Message" rules={[{ required: true, message: 'Please enter your message' }]}>
                    <TextArea rows={6} placeholder="Your message" />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                      Send Message
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
          </Row>
        </Space>
      </Layout.Content>
    </Layout>
  );
};
