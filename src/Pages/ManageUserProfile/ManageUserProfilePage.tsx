import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  message, 
  Layout, 
  Typography, 
  Spin 
} from 'antd';
import axiosInstance from '../../utils/axiosInstance';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Sidebar from '../../components/Sidebar/Sidebar';

const { Content } = Layout;
const { Title } = Typography;

const API_BASE_URL = 'https://localhost:7217/api/v1/users';

const ManageUserProfile: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setProfileLoading(true);
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/profile`);
      form.setFieldsValue(response.data);
    } catch (error: any) {
      message.error('Failed to fetch user profile');
      console.error('Error fetching profile:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const updateProfile = async (values: any) => {
    setLoading(true);
    try {
      await axiosInstance.put(`${API_BASE_URL}/update-profile`, values);
      message.success('Profile updated successfully!');
    } catch (error: any) {
      message.error('Failed to update profile. Please try again.');
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', margin: '-25px', width: '1420px' }}>
      <Header />
      <Layout>
        <Sidebar />
        <Content style={{ padding: '24px', background: '#f5f5f5' }}>
          <Card title="Manage Profile" style={{ maxWidth: 600, margin: '0 auto' }}>
            <Title level={4}>Update Your Information</Title>
            {profileLoading ? (
              <Spin size="large" />
            ) : (
              <Form form={form} layout="vertical" onFinish={updateProfile}>
                <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter your name' }]}> 
                  <Input placeholder="Enter your name" /> 
                </Form.Item>
                
                <Form.Item name="phone" label="Phone" rules={[{ required: true, message: 'Please enter your phone number' }]}> 
                  <Input placeholder="Enter your phone number" /> 
                </Form.Item>
                
                <Form.Item name="address" label="Address" rules={[{ required: true, message: 'Please enter your address' }]}> 
                  <Input placeholder="Enter your address" /> 
                </Form.Item>       
                
                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    Update Profile
                  </Button>
                </Form.Item>
              </Form>
            )}
          </Card>
        </Content>
      </Layout>
      <Footer />
    </Layout>
  );
};

export default ManageUserProfile;
