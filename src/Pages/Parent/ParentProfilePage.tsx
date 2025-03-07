import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Typography, 
  Row, 
  Col, 
  Card, 
  Avatar, 
  Button, 
  Tag, 
  Progress, 
  Rate,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  InputNumber,
  message
} from 'antd';
import { 
  UserOutlined, 
  CrownOutlined, 
  PlusOutlined,
  EditOutlined
} from '@ant-design/icons';
import GuestHeader from "../../components/Header/GuestHeader";
import AppFooter from "../../components/Footer/Footer";
import doctorImage from "../../assets/doctor.png";
import { Link } from 'react-router-dom';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

// Static data for children
const childrenData = [
  {
    id: 1,
    name: "Nguyễn Văn An",
    age: 5,
    gender: "Male",
    weight: 20,
    height: 110,
    bmi: 16.5,
    lastCheckup: "2024-03-15",
  }
];

const ParentProfilePage: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState<any[]>([]); // State to hold the list of doctors

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token || token.split('.').length !== 3) {
          message.error("Invalid token. Please log in again.");
          setLoading(false);
          return;
        }

        const response = await fetch('https://localhost:7217/api/v1/users/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error response:', errorData);
          if (response.status === 401) {
            message.error("Unauthorized: Please log in again.");            
            return;
          }
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('User data:', data);
        setUserData(data.data); // Lưu dữ liệu người dùng từ trường data
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchDoctors = async () => {
      try {
        const response = await fetch('https://localhost:7217/api/v1/doctors/all');
        if (!response.ok) {
          throw new Error('Failed to fetch doctors');
        }
        const data = await response.json();
        if (!Array.isArray(data.data)) {
          throw new Error('Invalid API response: Expected an array');
        }
        setDoctors(data.data); // Save the doctor list into state
      } catch (error) {
        console.error('Error fetching doctors:', error);
        message.error('Failed to load doctors');
      }
    };

    fetchUserData();
    fetchDoctors(); // Call the fetchDoctors function
  }, []);

  const handleAddChild = (values: any) => {
    console.log('New child values:', values);
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <Layout style={{ minHeight: '100vh', margin: '-25px' }}>
      <GuestHeader />
      <Content style={{ 
        padding: '24px', 
        maxWidth: '1000px',
        margin: '0 auto',
        marginBottom: '50px'
      }}>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <Row gutter={[24, 24]}>
            <Col span={16}>
              <Card>
                <Row gutter={16} align="middle">
                  <Col>
                    <Avatar size={64} icon={<UserOutlined />} />
                  </Col>
                  <Col>
                    <Title level={3} style={{ display: 'flex', alignItems: 'center' }}>
                      {userData ? userData.name : "Loading..."} 
                      <Link to="/manage-profile" style={{ marginLeft: '8px', fontSize: '16px', color: '#1890ff' }}>
                        <EditOutlined />
                      </Link>
                    </Title>
                    <Tag color="gold"><CrownOutlined /> Premium Member</Tag>
                  </Col>
                </Row>
              </Card>

              {/* Child Information */}
              <Card 
                style={{ marginTop: '24px' }}
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Title level={4} style={{ margin: 0 }}>Child Information</Title>
                    <Button 
                      type="primary" 
                      icon={<PlusOutlined />}
                      onClick={() => setIsModalVisible(true)}
                    >
                      Add Child
                    </Button>
                  </div>
                }
              >
                {childrenData.map(child => (
                  <Card key={child.id} type="inner" style={{ marginTop: '16px' }}>
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <Title level={5}>{child.name}</Title>
                        <p>Age: {child.age}</p>
                        <p>Gender: {child.gender}</p>
                        <p>Last Checkup: {child.lastCheckup}</p>
                      </Col>
                      <Col span={12}>
                        <Title level={5}>BMI</Title>
                        <Progress
                          percent={75}
                          status="active"
                          format={() => `${child.bmi} kg/m²`}
                        />
                        <p>Height: {child.height} cm</p>
                        <p>Weight: {child.weight} kg</p>
                      </Col>
                    </Row>
                  </Card>
                ))}
              </Card>

              <Modal
                title="Add Child Information"
                open={isModalVisible}
                onCancel={() => {
                  setIsModalVisible(false);
                  form.resetFields();
                }}
                footer={[
                  <Button key="cancel" onClick={() => {
                    setIsModalVisible(false);
                    form.resetFields();
                  }}>
                    Cancel
                  </Button>,
                  <Button key="submit" type="primary" onClick={() => form.submit()}>
                    Add
                  </Button>
                ]}
              >
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleAddChild}
                >
                  <Form.Item
                    name="name"
                    label="Full Name"
                    rules={[{ required: true, message: 'Please enter the child\'s name' }]}
                  >
                    <Input placeholder="Enter child's name" />
                  </Form.Item>

                  <Form.Item
                    name="birthDate"
                    label="Date of Birth"
                    rules={[{ required: true, message: 'Please select a date of birth' }]}
                  >
                    <DatePicker style={{ width: '100%' }} placeholder="Select date of birth" />
                  </Form.Item>

                  <Form.Item
                    name="gender"
                    label="Gender"
                    rules={[{ required: true, message: 'Please select a gender' }]}
                  >
                    <Select placeholder="Select gender">
                      <Option value="male">Male</Option>
                      <Option value="female">Female</Option>
                    </Select>
                  </Form.Item>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="height"
                        label="Height (cm)"
                        rules={[{ required: true, message: 'Please enter height' }]}
                      >
                        <InputNumber min={1} style={{ width: '100%' }} placeholder="Enter height" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="weight"
                        label="Weight (kg)"
                        rules={[{ required: true, message: 'Please enter weight' }]}
                      >
                        <InputNumber min={1} style={{ width: '100%' }} placeholder="Enter weight" />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Modal>
            </Col>

            <Col span={8}>
              <Card title="Recommended Doctors" bodyStyle={{ padding: '0' }}>
                {doctors.map(doctor => (
                  <div key={doctor.id} style={{ 
                    padding: '16px',
                    borderBottom: '1px solid #f0f0f0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '16px'
                    }}>
                      <Avatar src={doctor.profileImg || doctorImage} size={48} />
                      <div style={{ flex: 1 }}>
                        <Text strong style={{ 
                          display: 'block',
                          fontSize: '16px'
                        }}>
                          {doctor.biography}
                        </Text>
                        <Text type="secondary" style={{ 
                          fontSize: '14px',
                          marginTop: '4px',
                          display: 'block'
                        }}>
                          {doctor.specialize}
                        </Text>
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '4px'
                    }}>
                      <Rate 
                        disabled 
                        defaultValue={4.5} // Static value, or you can use actual value from API
                        style={{ fontSize: '16px' }} 
                      />
                      <Button type="primary" size="middle">
                        Follow
                      </Button>
                    </div>
                  </div>
                ))}
              </Card>

              <Card title="Membership Information" style={{ marginTop: '24px' }}>
                <p><CrownOutlined /> Premium Package</p>
                <p>Expiration Date: 15/04/2024</p>
                <Button type="primary" block style={{ marginTop: '16px' }}>
                  Renew Package
                </Button>
              </Card>
            </Col>
          </Row>
        )}
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default ParentProfilePage;