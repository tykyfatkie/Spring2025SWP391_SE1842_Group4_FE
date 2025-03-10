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
  Layout
} from 'antd';
import moment from 'moment';
import axiosInstance from '../../utils/axiosInstance.ts'; 
import Footer from '../../components/Footer/Footer.tsx';
import Sidebar from '../../components/Sidebar/Sidebar.tsx';

const { Content } = Layout;
const { Option } = Select;

interface ChildProfile {
  name: string;
  doB: string;
  gender: number;
}

const CreateChild: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const saveProfile = async (values: ChildProfile) => {
    setLoading(true);
    try {
      // Định dạng lại doB thành chuỗi 'YYYY-MM-DD'
      const formattedValues = {
        ...values,
        doB: values.doB ? moment(values.doB).format('YYYY-MM-DD') : undefined,
      };

      console.log('Submitting data:', formattedValues);
      
      const response = await axiosInstance.post('/children/create', formattedValues);
      message.success('Profile created successfully!');
      console.log('Server response:', response.data);
      resetForm();
    } catch (error: any) {
      console.error('Error saving profile:', error);
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors)
          .flat()
          .join(', ');
        message.error(errorMessages || 'Failed to save profile. Please try again.');
      } else {
        message.error('Failed to save profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    form.resetFields();
  };

  return (
    <Layout style={{ minHeight: '100vh', margin: '-25px' }}>
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
                validateTrigger="onBlur"
              > 
                <Input placeholder="Enter child's name" /> 
              </Form.Item>
              
              <Form.Item 
                name="doB" 
                label="Date of Birth" 
                rules={[{ required: true, message: 'Please select date of birth' }]}
                validateTrigger="onBlur"
              > 
                <DatePicker 
                  style={{ width: '100%' }} 
                  format="YYYY-MM-DD" 
                  placeholder="YYYY-MM-DD"
                /> 
              </Form.Item>
              
              <Form.Item 
                name="gender" 
                label="Gender" 
                rules={[{ required: true, message: 'Please select gender' }]}
                validateTrigger="onChange"
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
      <Footer />
    </Layout>
  );
};

export default CreateChild;