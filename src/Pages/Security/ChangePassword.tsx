import { useState } from 'react';
import { Layout, Typography, Button, Card, Form, Input, message, Space, Divider } from 'antd';
import { LockOutlined, KeyOutlined, CheckCircleOutlined, ArrowRightOutlined, UserOutlined } from '@ant-design/icons';
import AppFooter from '../../components/Footer/Footer';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const ChangePasswordPage = () => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChangePassword = async (values: { currentPassword: any; newPassword: any; }) => {
    setSubmitting(true);
    const token = localStorage.getItem("token");

    if (!token) {
      setSubmitting(false);
      message.error("You are not logged in. Please log in to change your password.");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_ENDPOINT}/user/change-password`,
        {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      message.success("Password changed successfully!");
      form.resetFields();
    } catch (error : any) {
      message.error(error.response?.data?.message || "Failed to change password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', margin: "-25px", background: 'white' }}>
      <Content>
        {/* Header Section with blue background */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgb(30, 58, 138) 0%, rgb(59, 130, 246) 100%)',
            color: 'white',
            padding: '60px 48px',
            borderRadius: '0 0 30px 30px',
            marginBottom: '40px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            overflow: 'hidden',
            marginRight: '50px',
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
          
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
            <div style={{ 
              display: 'inline-block', 
              padding: '8px 16px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              marginBottom: '16px'
            }}>
              <span style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>ACCOUNT SECURITY</span>
            </div>
            
            <Title level={1} style={{ color: 'white', fontSize: '40px', marginBottom: '16px', fontWeight: 700, lineHeight: 1.2 }}>
              Change Your Password
            </Title>
            <Paragraph style={{ fontSize: 18, marginBottom: 32, color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.6 }}>
              Keep your account secure by updating your password regularly
            </Paragraph>
          </div>
        </div>

        {/* Form Section */}
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 24px 60px' }}>
          <Card 
            style={{ 
              borderRadius: '16px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
              border: 'none',
              overflow: 'hidden',
              position: 'relative'
            }}
            bodyStyle={{ padding: '40px 32px' }}
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

            <div style={{ marginBottom: '32px', textAlign: 'center' }}>
              <div style={{ 
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'rgba(30, 58, 138, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px'
              }}>
                <LockOutlined style={{ fontSize: '40px', color: '#1e3a8a' }} />
              </div>
              
              <Title level={3} style={{ color: '#1e3a8a', marginBottom: '8px', fontWeight: 600 }}>Password Security</Title>
              <Paragraph style={{ color: '#4b5563', fontSize: '16px' }}>
                Please enter your current password and choose a strong new password
              </Paragraph>
            </div>
            
            <Divider style={{ margin: '24px 0' }} />
            
            <Form 
              form={form} 
              layout="vertical" 
              onFinish={handleChangePassword}
              requiredMark={false}
            >
              <Form.Item
                name="currentPassword"
                label={<span style={{ color: '#1e3a8a', fontWeight: 500 }}>Current Password</span>}
                rules={[{ required: true, message: "Please enter your current password." }]}
              >
                <Input.Password 
                  prefix={<KeyOutlined style={{ color: '#1e3a8a' }} />}
                  placeholder="Enter current password" 
                  size="large"
                  style={{ borderRadius: '8px', height: '50px' }}
                />
              </Form.Item>

              <Divider dashed style={{ margin: '24px 0' }} />

              <Form.Item
                name="newPassword"
                label={<span style={{ color: '#1e3a8a', fontWeight: 500 }}>New Password</span>}
                rules={[
                  { required: true, message: "Please enter a new password." },
                  { min: 8, message: "Password must be at least 8 characters long." },
                ]}
                extra="Your password should be at least 8 characters and include a mix of letters, numbers, and symbols"
              >
                <Input.Password 
                  prefix={<LockOutlined style={{ color: '#1e3a8a' }} />}
                  placeholder="Enter new password" 
                  size="large"
                  style={{ borderRadius: '8px', height: '50px' }}
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label={<span style={{ color: '#1e3a8a', fontWeight: 500 }}>Confirm New Password</span>}
                dependencies={["newPassword"]}
                rules={[
                  { required: true, message: "Please confirm your new password." },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Passwords do not match."));
                    },
                  }),
                ]}
              >
                <Input.Password 
                  prefix={<CheckCircleOutlined style={{ color: '#1e3a8a' }} />}
                  placeholder="Confirm new password" 
                  size="large"
                  style={{ borderRadius: '8px', height: '50px' }}
                />
              </Form.Item>

              <Space direction="vertical" size="middle" style={{ width: '100%', marginTop: '32px' }}>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={submitting} 
                  block
                  size="large"
                  style={{ 
                    height: '52px',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '16px',
                    background: '#1e3a8a',
                    border: 'none',
                    boxShadow: '0 8px 20px rgba(30, 58, 138, 0.25)',
                  }}
                >
                  Update Password <ArrowRightOutlined style={{ marginLeft: '8px' }} />
                </Button>
                
                <Button 
                  type="link" 
                  onClick={() => navigate("/account")}
                  style={{ color: '#1e3a8a', fontWeight: 500 }}
                >
                  Back to Account Settings
                </Button>
              </Space>
            </Form>
            
            <div style={{ marginTop: '32px', padding: '16px', background: 'rgba(30, 58, 138, 0.05)', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'start' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  background: 'rgba(30, 58, 138, 0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginRight: '16px',
                  flexShrink: 0
                }}>
                  <UserOutlined style={{ color: '#1e3a8a', fontSize: '20px' }} />
                </div>
                <div>
                  <Text style={{ display: 'block', color: '#1e3a8a', fontWeight: 600, marginBottom: '4px' }}>Security Tip</Text>
                  <Text style={{ color: '#4b5563', fontSize: '14px' }}>
                    For maximum security, use a unique password that you don't use for other accounts and update it regularly.
                  </Text>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default ChangePasswordPage;
