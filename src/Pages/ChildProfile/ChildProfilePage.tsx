import React, { useState } from 'react';
import { 
  Form, 
  Input, 
  InputNumber, 
  DatePicker, 
  Button, 
  Typography, 
  Card, 
  Select, 
  message, 
  Space,
  Layout
} from 'antd';
import moment from 'moment';
import axiosInstance from '../../utils/axiosInstance.ts'; 
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Sidebar from '../../components/Sidebar/Sidebar.tsx';

const { Content } = Layout;
const { Option } = Select;

interface ChildProfile {
  parentId: string;
  name: string;
  dob: string;
  gender: number;
  weight: number;
  height: number;
  bmi: number;
  bmiCategoryId: string;
  bmiPercentile: number;
  notes: string;
  groupAge: number;
}

const ChildProfilePage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<ChildProfile | null>(null);

  const calculateBMI = () => {
    const weight = form.getFieldValue('weight');
    const height = form.getFieldValue('height');

    if (weight && height && height > 0) {
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);
      form.setFieldsValue({ bmi: parseFloat(bmi.toFixed(1)) });
    } else {
      form.setFieldsValue({ bmi: 0 });
    }
  };

  const saveProfile = async (values: ChildProfile) => {
    setLoading(true);
    try {
      if (values.dob && moment.isMoment(values.dob)) {
        values.dob = values.dob.format('YYYY-MM-DD'); // Ensure correct format
      }

      console.log('Submitting data:', values); // Debugging output

      let response;
      if (editing && currentProfile) {
        response = await axiosInstance.put(`/children/${currentProfile.parentId}`, values);
        message.success('Profile updated successfully!');
      } else {
        response = await axiosInstance.post('/children/create', values);
        message.success('Profile created successfully!');
      }

      console.log('Server response:', response.data);
      resetForm();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to save profile. Please try again.');
      console.error('Error saving profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    form.resetFields();
    setEditing(false);
    setCurrentProfile(null);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header />
      <Layout>
        <Sidebar />  {/* Sidebar Component */}
        <Content style={{ padding: '24px', background: '#f5f5f5' }}>
          <Card title={editing ? "Edit Child Profile" : "Create Child Profile"} style={{ maxWidth: 800, margin: '0 auto' }}>
            <Form
              form={form}
              layout="vertical"
              onFinish={saveProfile}
              initialValues={{
                parentId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                gender: 0,
                weight: 0,
                height: 0,
                bmi: 0,
                bmiCategoryId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                bmiPercentile: 0,
                groupAge: 0
              }}
              validateTrigger={['onBlur', 'onChange']}
            >
              <Form.Item name="parentId" hidden>
                <Input />
              </Form.Item>
              
              <Form.Item 
                name="name" 
                label="Child's Name" 
                rules={[{ required: true, message: 'Please enter the child\'s name' }]}
                validateTrigger="onBlur"
              > 
                <Input placeholder="Enter child's name" /> 
              </Form.Item>
              
              <Form.Item 
                name="dob" 
                label="Date of Birth" 
                rules={[{ required: true, message: 'Please select date of birth' }]}
                validateTrigger="onBlur"
              > 
                <DatePicker 
                  style={{ width: '100%' }} 
                  format="DD-MM-YYYY" 
                  placeholder="DD-MM-YYYY"
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
              
              <Space size="large" style={{ display: 'flex' }}>
                <Form.Item 
                  name="weight" 
                  label="Weight (kg)" 
                  rules={[{ required: true, message: 'Please enter weight' }]} 
                  style={{ width: '100%' }}
                  validateTrigger="onBlur"
                > 
                  <InputNumber 
                    min={0} 
                    precision={1} 
                    style={{ width: '100%' }} 
                    placeholder="Enter weight in kg" 
                    onChange={() => setTimeout(calculateBMI, 0)}
                  /> 
                </Form.Item>
                
                <Form.Item 
                  name="height" 
                  label="Height (cm)" 
                  rules={[{ required: true, message: 'Please enter height' }]} 
                  style={{ width: '100%' }}
                  validateTrigger="onBlur"
                > 
                  <InputNumber 
                    min={0} 
                    precision={1} 
                    style={{ width: '100%' }} 
                    placeholder="Enter height in cm" 
                    onChange={() => setTimeout(calculateBMI, 0)}
                  /> 
                </Form.Item>
                
                <Form.Item name="bmi" label="BMI" style={{ width: '100%' }}> 
                  <InputNumber min={0} precision={1} style={{ width: '100%' }} readOnly disabled /> 
                </Form.Item>
              </Space>
              
              <Form.Item name="notes" label="Notes"> 
                <Input.TextArea rows={4} placeholder="Enter any additional notes" /> 
              </Form.Item>
              
              <Form.Item> 
                <Space>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    {editing ? 'Update Profile' : 'Create Profile'}
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

export default ChildProfilePage;
