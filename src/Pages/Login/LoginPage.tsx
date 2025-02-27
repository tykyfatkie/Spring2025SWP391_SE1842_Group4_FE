import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Row, Col, Divider, message, Space } from 'antd';
import { MailOutlined, LockOutlined, GoogleOutlined, FacebookOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../../features/auth/authApi'; // Import đúng API hook
import { login } from '../../features/auth/authSlice'; // Import action login từ authSlice


const { Title, Text } = Typography;

export const LoginPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();  // Sử dụng dispatch để gọi action login
  const [loginMutation, { isLoading, error }] = useLoginMutation();  // Lấy hook từ apiSlice

  const onFinish = async (values: any) => {
    try {
      const loginValues = { 
        ...values, 
        authType: 0, 
        redirect: "string" 
      };
  
      // Gọi API login
      const result = await loginMutation(loginValues);
      
      // Kiểm tra kết quả trả về đúng cấu trúc
      if ('data' in result) {
        console.log('Login success', result.data);
        // Đảm bảo result.data có chứa accessToken
        if (result.data && result.data.accessToken) {
          dispatch(login({ accessToken: result.data.accessToken }));
          navigate('/dashboard');
        } else {
          console.error('Missing accessToken in response:', result.data);
          message.error('Invalid response from server');
        }
      } else {
        console.error('Login error:', result.error);
        message.error('Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      message.error('Something went wrong. Please try again!');
    }
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Col xs={23} sm={20} md={16} lg={12} xl={8}>
        <Card bordered={false} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
            <Title level={2}>Welcome Back</Title>
            <Text type="secondary">Sign in to Child Growth Tracking System</Text>

            <Form form={form} name="login" onFinish={onFinish} layout="vertical" size="large">
              <Form.Item
                name="email"
                rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Please enter a valid email!' }]}
              >
                <Input prefix={<MailOutlined />} placeholder="Email" />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Password" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block loading={isLoading}>
                  Sign In
                </Button>
              </Form.Item>

              <Form.Item>
                <a href="/forgot-password">Forgot password?</a>
              </Form.Item>
            </Form>

            <Divider plain>Or continue with</Divider>

            <Space size="middle">
              <Button icon={<GoogleOutlined />}>Google</Button>
              <Button icon={<FacebookOutlined />}>Facebook</Button>
            </Space>

            <Text>
              Don't have an account? <a href="/register">Sign up now</a>
            </Text>
          </Space>
        </Card>
      </Col>
    </Row>
  );
};

export default LoginPage;
