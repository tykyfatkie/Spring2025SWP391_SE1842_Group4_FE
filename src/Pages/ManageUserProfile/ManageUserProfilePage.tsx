import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  message, 
  Layout, 
  Typography, 
  Spin,
  Row,
  Col,
  Divider
} from 'antd';
import { 
  UserOutlined, 
  PhoneOutlined, 
  EnvironmentOutlined,
  ArrowLeftOutlined,
  SaveOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import Footer from '../../components/Footer/Footer';

const { Content } = Layout;
const { Title, Text } = Typography;

const API_BASE_URL = `${import.meta.env.VITE_API_ENDPOINT}/users`;

const ManageUserProfile: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setProfileLoading(true);
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/profile`);
  
      if (!response.data || !response.data.data) {
        throw new Error("API response is missing 'data' key");
      }
  
      const { name, phone, address } = response.data.data;
  
      form.setFieldsValue({ 
        name: name || "", 
        phone: phone || "", 
        address: address || "" 
      });
  
    } catch (error) {
    } finally {
      setProfileLoading(false);
    }
  };

  const updateProfile = async (values: any) => {
    setLoading(true);
    try {
      await axiosInstance.put(`${API_BASE_URL}/update-profile`, values);
      message.success('Profile updated successfully!');
      setTimeout(() => {
        navigate('/profile'); 
      }, 500);  
    } catch (error: any) {
      message.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', margin: '-25px', background: 'white' }}>
      <Content>
        {/* Header Banner */}
        <div
          style={{
            height: '200px',
            background: '#1e3a8a',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 48px',
            borderRadius: '0 0 30px 30px',
            position: 'relative',
            marginBottom: '30px',
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
          
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ 
              display: 'inline-block', 
              padding: '8px 16px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              marginBottom: '16px'
            }}>
              <span style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>USER PROFILE</span>
            </div>
            <Title level={2} style={{ color: 'white', margin: 0, fontWeight: 700 }}>
              Manage Your Profile
            </Title>
          </div>
        </div>

        {/* Main Content */}
        <Row justify="center" style={{ padding: '0 24px', marginBottom: '60px' }}>
          <Col xs={24} sm={20} md={16} lg={12}>
            <Card 
              style={{ 
                borderRadius: '16px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
                border: 'none',
                overflow: 'hidden',
              }}
              bodyStyle={{ padding: '0' }}
            >
              {/* Card Header */}
              <div style={{ 
                padding: '24px 32px',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div>
                  <Title level={4} style={{ margin: 0, color: '#1e3a8a' }}>
                    Personal Information
                  </Title>
                  <Text type="secondary">
                    Update your details below
                  </Text>
                </div>
                <Button 
                  icon={<ArrowLeftOutlined />} 
                  onClick={() => navigate('/profile')}
                  style={{ 
                    border: 'none',
                    background: 'rgba(30, 58, 138, 0.1)',
                    color: '#1e3a8a',
                    borderRadius: '8px',
                    fontWeight: 500,
                  }}
                >
                  Back to Profile
                </Button>
              </div>

              {/* Form */}
              <div style={{ padding: '32px' }}>
                {profileLoading ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
                    <Spin size="large" />
                  </div>
                ) : (
                  <Form 
                    form={form} 
                    layout="vertical" 
                    onFinish={updateProfile}
                    initialValues={{ name: '', phone: '', address: '' }}
                  >
                    <Form.Item 
                      name="name" 
                      label={<Text strong>Full Name</Text>}
                      rules={[{ required: true, message: 'Please enter your name' }]}
                    > 
                      <Input 
                        prefix={<UserOutlined style={{ color: '#1e3a8a', opacity: 0.7 }} />}
                        placeholder="Enter your full name" 
                        size="large"
                        style={{ borderRadius: '8px', height: '50px' }}
                      /> 
                    </Form.Item>
                    
                    <Form.Item 
                      name="phone" 
                      label={<Text strong>Phone Number</Text>}
                      rules={[{ required: true, message: 'Please enter your phone number' }]}
                    > 
                      <Input 
                        prefix={<PhoneOutlined style={{ color: '#1e3a8a', opacity: 0.7 }} />}
                        placeholder="Enter your phone number" 
                        size="large"
                        style={{ borderRadius: '8px', height: '50px' }}
                      /> 
                    </Form.Item>
                    
                    <Form.Item 
                      name="address" 
                      label={<Text strong>Address</Text>}
                      rules={[{ required: true, message: 'Please enter your address' }]}
                    > 
                      <Input 
                        prefix={<EnvironmentOutlined style={{ color: '#1e3a8a', opacity: 0.7 }} />}
                        placeholder="Enter your address" 
                        size="large"
                        style={{ borderRadius: '8px', height: '50px' }}
                      /> 
                    </Form.Item>       
                    
                    <Divider />
                    
                    <Form.Item style={{ marginBottom: 0, textAlign: 'center' }}>
                      <Button 
                        type="primary" 
                        htmlType="submit" 
                        loading={loading}
                        icon={<SaveOutlined />}
                        size="large"
                        style={{ 
                          height: '50px', 
                          width: '100%', 
                          borderRadius: '8px',
                          fontWeight: 600,
                          background: '#1e3a8a',
                          border: 'none',
                          boxShadow: '0 8px 20px rgba(30, 58, 138, 0.25)',
                        }}
                      >
                        Save Changes
                      </Button>
                    </Form.Item>
                  </Form>
                )}
              </div>
            </Card>
            
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <Text type="secondary">
                Need help? Contact our support team at support@childgrowth.com
              </Text>
            </div>
          </Col>
        </Row>
      </Content>
      <Footer />
    </Layout>
  );
};

export default ManageUserProfile;