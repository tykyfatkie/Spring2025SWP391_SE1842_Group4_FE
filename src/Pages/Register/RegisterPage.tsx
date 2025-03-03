import React, { useState } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Typography, 
  Row, 
  Col, 
  Divider, 
  message, 
  Space 
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  MailOutlined,
  PhoneOutlined,
  GoogleOutlined,
  FacebookOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Title, Text } = Typography;

export const RegisterPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      
      const apiData = {
        email: values.email,
        password: values.password,
        name: `${values.firstName} ${values.lastName}`,
        phone: values.phone,
        avatar: '', 
      };
      
      const response = await axios.post('https://localhost:7217/api/v1/auth/register', apiData);
      
      if (response.status === 200) {
        message.success('Registration successful!');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
    } catch (error: any) {
      if (error.response) {
        message.error(error.response.data.message || 'Registration failed. Please try again.');
      } else {
        message.error('Network error. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Col xs={23} sm={20} md={16} lg={12} xl={8}>
        <Card bordered={false} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
            <Title level={2}>Create Account</Title>
            <Text type="secondary">Join Child Growth Tracking System</Text>

            <Form
              form={form}
              name="register"
              onFinish={onFinish}
              layout="vertical"
              size="large"
              scrollToFirstError
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="firstName"
                    rules={[{ required: true, message: 'Please input your first name!' }]}
                  >
                    <Input prefix={<UserOutlined />} placeholder="First Name" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="lastName"
                    rules={[{ required: true, message: 'Please input your last name!' }]}
                  >
                    <Input prefix={<UserOutlined />} placeholder="Last Name" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="email"
                rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Please enter a valid email!' }]}
              >
                <Input prefix={<MailOutlined />} placeholder="Email" />
              </Form.Item>

              <Form.Item
                name="phone"
                rules={[{ required: true, message: 'Please input your phone number!' }, { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit phone number!' }]}
              >
                <Input prefix={<PhoneOutlined />} placeholder="Phone Number" />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }, { min: 8, message: 'Password must be at least 8 characters!' }]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Password" />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                dependencies={['password']}
                rules={[{ required: true, message: 'Please confirm your password!' }, ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match!'));
                  },
                })]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block loading={loading}>
                  Create Account
                </Button>
              </Form.Item>
            </Form>

            <Divider plain>Or register with</Divider>

            <Space size="middle">
              <Button icon={<GoogleOutlined />}>Google</Button>
              <Button icon={<FacebookOutlined />}>Facebook</Button>
            </Space>

            <Text>
              Already have an account? <a href="/login">Sign in</a>
            </Text>
          </Space>
        </Card>
      </Col>
    </Row>
  );
};

export default RegisterPage;
