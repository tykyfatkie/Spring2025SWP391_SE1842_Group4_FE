import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Row, 
  Col, 
  Card, 
  DatePicker, 
  Select, 
  InputNumber, 
  message, 
  Spin, 
  Typography 
} from 'antd';
import { 
  UserOutlined, 
  CalendarOutlined, 
  ArrowLeftOutlined 
} from '@ant-design/icons';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import Header from '../../components/Header/Header';

const { Title, Text } = Typography;
const { Option } = Select;

interface ChildData {
  name: string;
  dateOfBirth: string;
  gender: string;
  weight: number;
  height: number;
}

export const UpdateChildPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch child data when component mounts
  useEffect(() => {
    const fetchChildData = async () => {
      try {
        setFetchLoading(true);
        const response = await axios.get(`/api/v1/children/${id}`);
        
        if (response.data) {
          // Format the date to be compatible with DatePicker
          const dateOfBirth = response.data.dateOfBirth ? dayjs(response.data.dateOfBirth) : null;
          
          form.setFieldsValue({
            ...response.data,
            dateOfBirth
          });
        }
      } catch (error: any) {
        message.error('Failed to fetch child data. Please try again.');
        console.error('Error fetching child data:', error);
      } finally {
        setFetchLoading(false);
      }
    };

    if (id) {
      fetchChildData();
    }
  }, [id, form]);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      
      // Format the data according to API requirements
      const apiData: ChildData = {
        name: values.name,
        dateOfBirth: values.dateOfBirth.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
        gender: values.gender,
        weight: values.weight,
        height: values.height
      };
      
      // Call the update API
      const response = await axios.put(`/api/v1/children/${id}`, apiData);
      
      if (response.status === 200) {
        message.success('Child information updated successfully!');
        // Navigate back to child details or list page
        setTimeout(() => {
          navigate('/children');
        }, 1500);
      }
    } catch (error: any) {
      if (error.response) {
        message.error(error.response.data.message || 'Update failed. Please try again.');
      } else {
        message.error('Network error. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/children');
  };

  return (
    <>
      <Header />
      <Row justify="center" align="middle" style={{ padding: '24px' }}>
        <Col xs={24} sm={20} md={16} lg={12} xl={10}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Button 
                  icon={<ArrowLeftOutlined />} 
                  type="text" 
                  onClick={handleCancel}
                  style={{ marginRight: '12px' }}
                />
                <Title level={4} style={{ margin: 0 }}>Update Child Information</Title>
              </div>
            }
            bordered={false} 
            style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          >
            {fetchLoading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <Spin size="large" />
                <Text style={{ display: 'block', marginTop: '16px' }}>Loading child information...</Text>
              </div>
            ) : (
              <Form
                form={form}
                name="updateChild"
                onFinish={onFinish}
                layout="vertical"
                requiredMark={false}
              >
                <Form.Item
                  name="name"
                  label="Child's Name"
                  rules={[{ required: true, message: 'Please enter child\'s name' }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Enter full name" />
                </Form.Item>

                <Form.Item
                  name="dateOfBirth"
                  label="Date of Birth"
                  rules={[{ required: true, message: 'Please select date of birth' }]}
                >
                  <DatePicker 
                    style={{ width: '100%' }} 
                    format="YYYY-MM-DD" 
                    placeholder="Select date"
                    suffixIcon={<CalendarOutlined />}
                  />
                </Form.Item>

                <Form.Item
                  name="gender"
                  label="Gender"
                  rules={[{ required: true, message: 'Please select gender' }]}
                >
                  <Select placeholder="Select gender">
                    <Option value="male">Male</Option>
                    <Option value="female">Female</Option>
                    <Option value="other">Other</Option>
                  </Select>
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="weight"
                      label="Weight (kg)"
                      rules={[{ required: true, message: 'Please enter weight' }]}
                    >
                      <InputNumber 
                        min={0} 
                        step={0.1} 
                        precision={1}
                        style={{ width: '100%' }} 
                        placeholder="Weight in kg"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="height"
                      label="Height (cm)"
                      rules={[{ required: true, message: 'Please enter height' }]}
                    >
                      <InputNumber 
                        min={0} 
                        step={0.1} 
                        precision={1}
                        style={{ width: '100%' }} 
                        placeholder="Height in cm"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item style={{ marginTop: '24px' }}>
                  <Button type="primary" htmlType="submit" loading={loading} block>
                    Update Information
                  </Button>
                </Form.Item>
              </Form>
            )}
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default UpdateChildPage;
