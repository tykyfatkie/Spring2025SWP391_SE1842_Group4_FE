import React from 'react';
import { Layout, Typography, Row, Col, Card, Space, Form, Input, Button, message } from 'antd';
import AppFooter from '../../components/Footer/Footer';
import { EnvironmentOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const ContactPage: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = () => {
    message.success('Message sent successfully! We will get back to you soon.');
    form.resetFields();
  };

  return (
    <Layout style={{ minHeight: '100vh', margin: '-25px', background: 'white' }}>
      <Layout.Content>
        {/* Hero Section with styling similar to Homepage */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            height: '400px',
            overflow: 'hidden',
            marginBottom: '30px',
            marginTop: '30px',
            position: 'relative',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            borderRadius: '0 0 30px 30px',
            marginRight: '50px',
          }}
        >
          {/* Left Content Section */}
          <div
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 48px',
              background: '#1e3a8a',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
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
            
            <div style={{ maxWidth: '800px', textAlign: 'center', position: 'relative', zIndex: 2 }}>
              <div style={{ 
                display: 'inline-block', 
                padding: '8px 16px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                marginBottom: '16px'
              }}>
                <span style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>GET IN TOUCH</span>
              </div>
              
              <Title level={1} style={{ color: 'white', fontSize: '52px', marginBottom: '24px', fontWeight: 700, lineHeight: 1.2 }}>
                Contact Us
              </Title>
              <Paragraph style={{ fontSize: 18, marginBottom: 32, color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.6 }}>
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </Paragraph>
            </div>
          </div>
        </div>

        <Space direction="vertical" size={64} style={{ width: '95%', padding: '0 24px 60px' }}>
          {/* Contact Cards Section */}
          <Row gutter={[32, 32]} justify="center" style={{ marginBottom: '20px' }}>
            <Col xs={24} md={8}>
              <Card 
                hoverable 
                style={{ 
                  height: '100%', 
                  borderRadius: '16px',
                  border: 'none',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.3s ease',
                  overflow: 'hidden',
                  position: 'relative'
                }}
                bodyStyle={{ padding: '32px 24px' }}
              >
                <div style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  right: 0, 
                  height: '6px', 
                  background: '#1e3a8a',
                  opacity: 0.7 
                }}/>
                <Space direction="vertical" align="center" style={{ width: '100%', textAlign: 'center' }}>
                  <div style={{ 
                    marginBottom: '28px',
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'rgba(30, 58, 138, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 28px'
                  }}>
                    <MailOutlined style={{ fontSize: '40px', color: '#1e3a8a' }} />
                  </div>
                  <Title level={3} style={{ fontSize: '22px', marginBottom: '16px', color: '#1e3a8a', fontWeight: 600 }}>
                    Email Us
                  </Title>
                  <Text style={{ color: '#4b5563', fontSize: '16px' }}>support@childgrowth.com</Text>
                </Space>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card 
                hoverable 
                style={{ 
                  height: '100%', 
                  borderRadius: '16px',
                  border: 'none',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.3s ease',
                  overflow: 'hidden',
                  position: 'relative'
                }}
                bodyStyle={{ padding: '32px 24px' }}
              >
                <div style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  right: 0, 
                  height: '6px', 
                  background: '#1e3a8a',
                  opacity: 0.7 
                }}/>
                <Space direction="vertical" align="center" style={{ width: '100%', textAlign: 'center' }}>
                  <div style={{ 
                    marginBottom: '28px',
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'rgba(30, 58, 138, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 28px'
                  }}>
                    <PhoneOutlined style={{ fontSize: '40px', color: '#1e3a8a' }} />
                  </div>
                  <Title level={3} style={{ fontSize: '22px', marginBottom: '16px', color: '#1e3a8a', fontWeight: 600 }}>
                    Call Us
                  </Title>
                  <Text style={{ color: '#4b5563', fontSize: '16px' }}>+1 (555) 123-4567</Text>
                </Space>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card 
                hoverable 
                style={{ 
                  height: '100%', 
                  borderRadius: '16px',
                  border: 'none',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.3s ease',
                  overflow: 'hidden',
                  position: 'relative'
                }}
                bodyStyle={{ padding: '32px 24px' }}
              >
                <div style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  right: 0, 
                  height: '6px', 
                  background: '#1e3a8a',
                  opacity: 0.7 
                }}/>
                <Space direction="vertical" align="center" style={{ width: '100%', textAlign: 'center' }}>
                  <div style={{ 
                    marginBottom: '28px',
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'rgba(30, 58, 138, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 28px'
                  }}>
                    <EnvironmentOutlined style={{ fontSize: '40px', color: '#1e3a8a' }} />
                  </div>
                  <Title level={3} style={{ fontSize: '22px', marginBottom: '16px', color: '#1e3a8a', fontWeight: 600 }}>
                    Visit Us
                  </Title>
                  <Text style={{ color: '#4b5563', fontSize: '16px' }}>123 Growth Street, Health City, HC 12345</Text>
                </Space>
              </Card>
            </Col>
          </Row>

          {/* Form Section */}
          <Row justify="center">
            <Col xs={24} md={20} lg={16}>
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div style={{ 
                  display: 'inline-block', 
                  padding: '8px 16px',
                  background: 'rgba(30, 58, 138, 0.1)',
                  borderRadius: '20px',
                  marginBottom: '16px'
                }}>
                  <span style={{ color: '#1e3a8a', fontWeight: '600', fontSize: '14px' }}>MESSAGE US</span>
                </div>
                <Title level={2} style={{ color: '#1e3a8a', marginBottom: '16px', fontSize: '36px' }}>
                  Send us a Message
                </Title>
                <Paragraph style={{ color: '#4b5563', fontSize: '18px', maxWidth: '700px', margin: '0 auto' }}>
                  We're here to help with any questions you might have about child growth tracking
                </Paragraph>
              </div>
              
              <Card 
                bordered={false}
                style={{ 
                  borderRadius: '16px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
                  border: 'none',
                }}
                bodyStyle={{ padding: '32px' }}
              >
                <Form form={form} layout="vertical" onFinish={onFinish} size="large">
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter your name' }]}>
                        <Input 
                          placeholder="Your name" 
                          style={{ 
                            borderRadius: '8px', 
                            height: '50px'
                          }} 
                        />
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
                        <Input 
                          placeholder="Your email" 
                          style={{ 
                            borderRadius: '8px', 
                            height: '50px'
                          }} 
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item name="subject" label="Subject" rules={[{ required: true, message: 'Please enter a subject' }]}>
                    <Input 
                      placeholder="Message subject" 
                      style={{ 
                        borderRadius: '8px', 
                        height: '50px'
                      }} 
                    />
                  </Form.Item>
                  <Form.Item name="message" label="Message" rules={[{ required: true, message: 'Please enter your message' }]}>
                    <TextArea 
                      rows={6} 
                      placeholder="Your message" 
                      style={{ 
                        borderRadius: '8px'
                      }} 
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      block
                      style={{
                        height: '52px',
                        fontSize: '16px',
                        fontWeight: '600',
                        borderRadius: '8px',
                        background: '#1e3a8a',
                        border: 'none',
                        boxShadow: '0 8px 20px rgba(30, 58, 138, 0.25)',
                        transition: 'all 0.3s ease'
                      }}
                    >
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
