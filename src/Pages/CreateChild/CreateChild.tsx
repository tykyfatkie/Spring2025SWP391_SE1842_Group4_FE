import React, { useState } from 'react';
import { 
  Form, 
  Input, 
  DatePicker, 
  Button, 
  Card, 
  Select, 
  message, 
  Space,
  Layout,
} from 'antd';
import moment from 'moment';
import axios from 'axios'; 
import Sidebar from '../../components/Sidebar/Sidebar.tsx';

const { Content } = Layout;
const { Option } = Select;

const CreateChild: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_ENDPOINT,
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    }
  });

  const saveProfile = async (values: any) => {
    setLoading(true);
  
    const token = localStorage.getItem('token');
    if (!token) {
      message.error('Authentication failed. Please log in again.');
      return;
    }
  
    try {
      const formattedValues = {
        name: values.name,
        DoB: values.DoB ? values.DoB.format('YYYY-MM-DD') : undefined,
        gender: Number(values.gender),
      };
  
      console.log('Submitting data:', formattedValues);
  
      const response = await axios.post(
        `${import.meta.env.VITE_API_ENDPOINT}/children/create`,
        formattedValues,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      message.success('Profile created successfully!');
      resetForm();
    } catch (error: any) {
      console.error('Error saving profile:', error);
      console.log('Server Response:', error.response?.data);
      message.error(error.response?.data?.message || 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const resetForm = () => {
    form.resetFields();
  };

  return (
    <Layout style={{ minHeight: '100vh', margin: "-25px" }}>
      <Layout>
        <Sidebar />
        <Content style={{ padding: '24px', background: '#f5f5f5' }}>
          <Card title="Create Child Profile" style={{ maxWidth: 800, margin: '0 auto' }}>
            <Form
              form={form}
              layout="vertical"
              onFinish={saveProfile}
              initialValues={{ gender: 0 }}
              validateTrigger={['onBlur', 'onChange']}
            >
              <Form.Item 
                name="name" 
                label="Child's Name" 
                rules={[{ required: true, message: 'Please enter the child\'s name' }]}
              > 
                <Input placeholder="Enter child's name" /> 
              </Form.Item>
              
              <Form.Item 
                name="DoB" 
                label="Date of Birth" 
                rules={[
                  {
                    required: true, 
                    message: 'Please select date of birth',
                  }, 
                  {
                    validator: (_, value) =>
                      value && value.isAfter(moment(), 'day')
                        ? Promise.reject(new Error('Date of birth cannot be in the future'))
                        : Promise.resolve(),
                  }
                ]}
              > 
                <DatePicker 
                  style={{ width: '100%' }} 
                  format="YYYY-MM-DD" 
                  placeholder="YYYY-MM-DD"
                  disabledDate={(current) => current && current.isAfter(moment(), 'day')} // Chặn chọn ngày tương lai
                /> 
              </Form.Item>
              
              <Form.Item 
                name="gender" 
                label="Gender" 
                rules={[{ required: true, message: 'Please select gender' }]}
              > 
                <Select placeholder="Select gender">
                  <Option value={0}>Male</Option>
                  <Option value={1}>Female</Option>
                </Select> 
              </Form.Item>
              
              <Form.Item> 
                <Space>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    Create Profile
                  </Button>
                  <Button onClick={resetForm}>Cancel</Button>
                </Space> 
              </Form.Item>
            </Form>
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

export default CreateChild;
