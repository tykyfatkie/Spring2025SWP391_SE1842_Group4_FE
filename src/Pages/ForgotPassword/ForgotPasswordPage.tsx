import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Layout, Steps, message, Result } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined, KeyOutlined } from '@ant-design/icons';
import GuestHeader from '../../components/Header/GuestHeader';
import axios from 'axios';

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;
const { Step } = Steps;

const ForgotPasswordPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [email, setEmail] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);

  const handleRequestCode = async (values: { email: string }) => {
    setLoading(true);
    try {
      
      const response = await axios.post('/api/v1/auth/forgot-password/request', {
        email: values.email
      });
      
      setEmail(values.email);
      message.success('Verification code has been sent to your email');
      setCurrentStep(1);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.message || 'Failed to send verification code');
      } else {
        message.error('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (values: { code: string }) => {
    setLoading(true);
    try {
      
      const response = await axios.post('/api/v1/auth/forgot-password/verify', {
        email: email,
        code: values.code
      });
      
      
      setToken(response.data.token);
      message.success('Verification code is valid');
      setCurrentStep(2);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.message || 'Invalid verification code');
      } else {
        message.error('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (values: { password: string; confirmPassword: string }) => {
    setLoading(true);
    try {
      
      const response = await axios.post('/api/v1/auth/forgot-password/reset', {
        email: email,
        token: token,
        password: values.password
      });
      
      message.success('Password has been reset successfully');
      setCurrentStep(3);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.message || 'Failed to reset password');
      } else {
        message.error('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Form form={form} layout="vertical" onFinish={handleRequestCode}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Invalid email format' }
              ]}
            >
              <Input 
                prefix={<MailOutlined className="text-gray-400" />} 
                placeholder="Enter your registered email" 
                size="large" 
              />
            </Form.Item>
            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                block 
                size="large"
                loading={loading}
              >
                Send Verification Code
              </Button>
            </Form.Item>
          </Form>
        );
      case 1:
        return (
          <Form form={form} layout="vertical" onFinish={handleVerifyCode}>
            <Paragraph className="mb-4">
              We've sent a verification code to <Text strong>{email}</Text>. 
              Please check your inbox and enter the verification code.
            </Paragraph>
            <Form.Item
              name="code"
              label="Verification Code"
              rules={[
                { required: true, message: 'Please enter the verification code' },
                { len: 6, message: 'Verification code must be 6 characters' }
              ]}
            >
              <Input 
                prefix={<KeyOutlined className="text-gray-400" />} 
                placeholder="Enter 6-digit verification code" 
                size="large" 
              />
            </Form.Item>
            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                block 
                size="large"
                loading={loading}
              >
                Verify
              </Button>
            </Form.Item>
            <div className="text-center">
              <Button 
                type="link" 
                onClick={() => handleRequestCode({ email })}
                disabled={loading}
              >
                Resend Code
              </Button>
            </div>
          </Form>
        );
      case 2:
        return (
          <Form 
            form={form} 
            layout="vertical" 
            onFinish={handleResetPassword}
            requiredMark={false}
          >
            <Form.Item
              name="password"
              label="New Password"
              rules={[
                { required: true, message: 'Please enter a new password' },
                { min: 8, message: 'Password must be at least 8 characters' },
                {
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
                }
              ]}
              hasFeedback
            >
              <Input.Password 
                prefix={<LockOutlined className="text-gray-400" />} 
                placeholder="Create a new password" 
                size="large" 
              />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              dependencies={['password']}
              hasFeedback
              rules={[
                { required: true, message: 'Please confirm your password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords do not match'));
                  },
                }),
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined className="text-gray-400" />} 
                placeholder="Confirm your new password" 
                size="large" 
              />
            </Form.Item>
            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                block 
                size="large"
                loading={loading}
              >
                Reset Password
              </Button>
            </Form.Item>
          </Form>
        );
      case 3:
        return (
          <Result
            status="success"
            title="Password Reset Successfully!"
            subTitle="You can now log in with your new password."
            extra={[
              <Button type="primary" key="login" size="large" href="/login">
                Log In
              </Button>
            ]}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Layout className="min-h-screen bg-gray-50">
      <GuestHeader />
      <Content className="py-12">
        <div className="max-w-md mx-auto px-4">
          <Card className="shadow-md rounded-lg">
            <div className="text-center mb-6">
              <Title level={3}>Forgot Password</Title>
              <Text type="secondary">
                Reset your password in 3 simple steps
              </Text>
            </div>
            
            <Steps 
              current={currentStep} 
              className="mb-8"
              items={[
                {
                  title: 'Email',
                  icon: <UserOutlined />
                },
                {
                  title: 'Verify',
                  icon: <KeyOutlined />
                },
                {
                  title: 'Reset',
                  icon: <LockOutlined />
                }
              ]}
            />
            
            {renderStepContent()}
          </Card>
        </div>
      </Content>
    </Layout>
  );
};

export default ForgotPasswordPage;