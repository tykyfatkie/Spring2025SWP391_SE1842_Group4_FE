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
  Typography,
  Row,
  Col,
  Modal
} from 'antd';
import moment from 'moment';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar.tsx';
import { CheckCircleOutlined, UserOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Option } = Select;
const { Title, Paragraph, Text } = Typography;

const CreateChild: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const navigate = useNavigate();

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

      // Use the axiosInstance instead of direct axios
      await axiosInstance.post(
        `/children/create`,
        formattedValues
      );

      message.success('Child profile created successfully!');
      form.resetFields();
      // Redirect to child-manage page
      navigate('/child-manage');
    } catch (error: any) {
      console.error('Error saving profile:', error);
      message.error(error.response?.data?.message || 'Please subscribe to our package to use this feature!');
    } finally {
      setLoading(false);
    }
  };
  
  // Handler for cancel button
  const handleCancel = () => {
    setIsCancelModalVisible(true);
  };
  
  // Confirm cancellation
  const confirmCancel = () => {
    form.resetFields();
    navigate('/child-manage');
    setIsCancelModalVisible(false);
  };
  
  // Cancel the cancellation
  const cancelCancel = () => {
    setIsCancelModalVisible(false);
  };
  
  // Handler for submit button
  const handleFormSubmit = () => {
    setIsConfirmModalVisible(true);
  };
  
  // Confirm submission
  const confirmSubmit = () => {
    form.submit();
    setIsConfirmModalVisible(false);
  };
  
  // Cancel the submission
  const cancelSubmit = () => {
    setIsConfirmModalVisible(false);
  };

  return (
    <Layout style={{ minHeight: '100vh', margin: "-25px", background: 'white' }}>
      <Layout>
        <Sidebar />
        <Content style={{ padding: '24px', background: '#f8fafc', marginLeft: '260px' }}>
          {/* Header Section */}
          <div style={{ 
            marginBottom: '40px', 
            background: 'linear-gradient(135deg, rgb(30, 58, 138) 0%, rgb(59, 130, 246) 100%)', 
            padding: '48px 32px', 
            borderRadius: '20px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
          }}>
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
            
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ 
                display: 'inline-block', 
                padding: '8px 16px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                marginBottom: '16px'
              }}>
                <span style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>CREATE PROFILE</span>
              </div>
              
              <Title level={2} style={{ color: 'white', marginBottom: '16px', fontWeight: 700 }}>
                Add a New Child Profile
              </Title>
              <Paragraph style={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.9)', maxWidth: '700px' }}>
                Track your child's growth and development by creating a profile. Our system uses WHO standard 
                growth charts to provide accurate insights about your child's health.
              </Paragraph>
              
              <Space direction="vertical" size="middle" style={{ width: '100%', marginTop: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircleOutlined style={{ color: '#3b82f6', marginRight: '12px' }} />
                  <Text style={{ color: 'white' }}>Track growth patterns over time</Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircleOutlined style={{ color: '#3b82f6', marginRight: '12px' }} />
                  <Text style={{ color: 'white' }}>Personalized health insights</Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircleOutlined style={{ color: '#3b82f6', marginRight: '12px' }} />
                  <Text style={{ color: 'white' }}>Age-appropriate milestone tracking</Text>
                </div>
              </Space>
            </div>
          </div>

          <Row gutter={[24, 24]} justify="center">
            <Col xs={24} md={16} lg={12}>
              <Card 
                title={
                  <div style={{ padding: '8px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '50%', 
                        background: 'rgba(30, 58, 138, 0.1)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        marginRight: '16px' 
                      }}>
                        <UserOutlined style={{ fontSize: '20px', color: '#1e3a8a' }} />
                      </div>
                      <Title level={4} style={{ margin: 0, color: '#1e3a8a' }}>Child Information</Title>
                    </div>
                  </div>
                } 
                style={{ 
                  borderRadius: '16px', 
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
                  border: 'none'
                }}
                headStyle={{ 
                  borderBottom: '1px solid #f0f0f0',
                  padding: '16px 24px'
                }}
                bodyStyle={{ padding: '32px 24px' }}
              >
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={saveProfile}
                  initialValues={{ gender: 0 }}
                  validateTrigger={['onBlur', 'onChange']}
                  size="large"
                >
                  <Form.Item 
                    name="name" 
                    label={<Text strong style={{ fontSize: '16px' }}>Child's Name</Text>} 
                    rules={[{ required: true, message: 'Please enter the child\'s name' }]}>
                    <Input 
                      placeholder="Enter child's name" 
                      style={{ 
                        borderRadius: '8px', 
                        height: '45px',
                        borderColor: '#e5e7eb'
                      }} 
                    /> 
                  </Form.Item>
                  
                  <Form.Item 
                    name="DoB" 
                    label={<Text strong style={{ fontSize: '16px' }}>Date of Birth</Text>} 
                    rules={[
                      { required: true, message: 'Please select date of birth' }
                    ]}>
                    <DatePicker 
                      style={{ 
                        width: '100%', 
                        borderRadius: '8px', 
                        height: '45px',
                        borderColor: '#e5e7eb'
                      }} 
                      format="YYYY-MM-DD" 
                      placeholder="YYYY-MM-DD"
                      disabledDate={current => current && current > moment().endOf('day')}
                    /> 
                  </Form.Item>
                  
                  <Form.Item 
                    name="gender" 
                    label={<Text strong style={{ fontSize: '16px' }}>Gender</Text>} 
                    rules={[{ required: true, message: 'Please select gender' }]}>
                    <Select 
                      placeholder="Select gender"
                      style={{ 
                        borderRadius: '8px', 
                        height: '45px'
                      }}
                    >
                      <Option value={0}>Male</Option>
                      <Option value={1}>Female</Option>
                    </Select> 
                  </Form.Item>
                  
                  <Form.Item style={{ marginTop: '32px' }}> 
                    <Space size="middle">
                      <Button 
                        type="primary" 
                        onClick={handleFormSubmit}
                        loading={loading}
                        style={{
                          height: '45px',
                          padding: '0 32px',
                          fontSize: '16px',
                          fontWeight: '500',
                          borderRadius: '8px',
                          background: '#1e3a8a',
                          border: 'none',
                          boxShadow: '0 8px 20px rgba(30, 58, 138, 0.25)',
                        }}
                      >
                        Create Profile
                      </Button>
                      <Button 
                        onClick={handleCancel}
                        style={{
                          height: '45px',
                          padding: '0 32px',
                          fontSize: '16px',
                          borderRadius: '8px',
                          borderColor: '#e5e7eb',
                        }}
                      >
                        Cancel
                      </Button>
                    </Space> 
                  </Form.Item>
                </Form>
              </Card>
            </Col>
            
            <Col xs={24} md={8} lg={6}>
              <Card 
                style={{ 
                  borderRadius: '16px', 
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
                  border: 'none',
                  height: '100%',
                  background: 'linear-gradient(to bottom, #f0f7ff, #e6f0fd)'
                }}
                bodyStyle={{ padding: '24px' }}
              >
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <div style={{ 
                    width: '60px', 
                    height: '60px', 
                    borderRadius: '50%', 
                    background: 'rgba(30, 58, 138, 0.1)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    margin: '0 auto 16px' 
                  }}>
                    <CheckCircleOutlined style={{ fontSize: '30px', color: '#1e3a8a' }} />
                  </div>
                  <Title level={4} style={{ color: '#1e3a8a', marginBottom: '8px' }}>Why Create a Profile?</Title>
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ 
                    padding: '16px',
                    background: 'white',
                    borderRadius: '12px',
                    marginBottom: '16px'
                  }}>
                    <Text strong style={{ display: 'block', marginBottom: '8px', color: '#1e3a8a' }}>Personalized Growth Charts</Text>
                    <Text style={{ color: '#4b5563', fontSize: '14px' }}>
                      Track your child's growth against WHO standards with customized charts.
                    </Text>
                  </div>
                  
                  <div style={{ 
                    padding: '16px',
                    background: 'white',
                    borderRadius: '12px',
                    marginBottom: '16px'
                  }}>
                    <Text strong style={{ display: 'block', marginBottom: '8px', color: '#1e3a8a' }}>Development Milestones</Text>
                    <Text style={{ color: '#4b5563', fontSize: '14px' }}>
                      Monitor age-appropriate developmental milestones and achievements.
                    </Text>
                  </div>
                  
                  <div style={{ 
                    padding: '16px',
                    background: 'white',
                    borderRadius: '12px'
                  }}>
                    <Text strong style={{ display: 'block', marginBottom: '8px', color: '#1e3a8a' }}>Expert Insights</Text>
                    <Text style={{ color: '#4b5563', fontSize: '14px' }}>
                      Get professional advice tailored to your child's specific growth patterns.
                    </Text>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>

      {/* Modal xác nhận tạo profile */}
      <Modal
        title="Confirm Creation"
        open={isConfirmModalVisible}
        onOk={confirmSubmit}
        onCancel={cancelSubmit}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to create this profile?</p>
        <p>Click Yes to confirm and create the child profile.</p>
      </Modal>
      
      {/* Modal xác nhận hủy */}
      <Modal
        title="Confirm Cancellation"
        open={isCancelModalVisible}
        onOk={confirmCancel}
        onCancel={cancelCancel}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to cancel?</p>
        <p>Your changes will not be saved.</p>
      </Modal>
    </Layout>
  );
};

export default CreateChild;