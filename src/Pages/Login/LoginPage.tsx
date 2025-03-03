import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Row, Col, Divider, message, Space } from 'antd';
import { MailOutlined, LockOutlined, GoogleOutlined, FacebookOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../../features/auth/authApi'; 
import { login, setLoading } from '../../features/auth/authSlice';
import axios from 'axios';


const { Title, Text } = Typography;

const LoginPage = () => {
  const [form] = Form.useForm();
  const [loginMutation, { isLoading, error }] = useLoginMutation();  
  const navigate = useNavigate()

  const onFinish = async (values: any) => {
    loginMutation(values)
    try {
      setLoading(true);
      
      const apiData = {
        email: values.email,
        password: values.password,
      };
      
      const response = await axios.post('https://localhost:7217/api/v1/auth/login', apiData);
      
      if (response.status === 200) {
        message.success('Login successful!');
        setTimeout(() => {
          navigate('/home');
        }, 1500);
      }
    } catch (error: any) {
      if (error.response) {
        message.error(error.response.data.message || 'Login failed. Please try again.');
      } else {
        message.error('Network error. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
     
}
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
}

export default LoginPage