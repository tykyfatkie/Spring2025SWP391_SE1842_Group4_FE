import React from 'react';
import { Layout, Typography, Row, Col, Card, Space, Form, Input, Button, message } from 'antd';
import { 
  MailOutlined, 
  PhoneOutlined, 
  EnvironmentOutlined 
} from '@ant-design/icons';
import GuestHeader from '../../components/Header/GuestHeader';
import AppFooter from '../../components/Footer/Footer';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const ContactPage: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Contact form values:', values);
    message.success('Message sent successfully! We will get back to you soon.');
    form.resetFields();
  };

  return (
    <Layout style={{ minHeight: '100vh', margin: '-25px', width: '1420px' }}>
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
      <AppFooter />
    </Layout>
  );
};

export default ContactPage;
