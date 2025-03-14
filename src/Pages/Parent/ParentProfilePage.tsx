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
import AppFooter from "../../components/Footer/Footer";
import doctorImage from "../../assets/doctor.png";
import { Link } from 'react-router-dom';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const ParentProfilePage: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [userData, setUserData] = useState<any>(null);
  const [childData, setChildData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token || token.split('.').length !== 3) {
          message.error("Invalid token. Please log in again.");
          setLoading(false);
          return;
        }

        const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/users/profile`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 401) {
            message.error("Unauthorized: Please log in again.");
            return;
          }
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setUserData(data.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchChildData = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          message.error("Authentication information missing.");
          return;
        }

        const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/children/getChildByToken`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch child data');
        }

        const data = await response.json();
        if (Array.isArray(data.data) && data.data.length > 0) {
          setChildData(data.data[0]); // Chỉ lấy 1 trẻ đầu tiên
        } else {
          setChildData(null);
        }
      } catch (error) {
        console.error('Error fetching child data:', error);
        message.error('Failed to load child information');
      }
    };

    const fetchDoctors = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/doctors/all`);
        if (!response.ok) {
          throw new Error('Failed to fetch doctors');
        }
        const data = await response.json();
        if (!Array.isArray(data.data)) {
          throw new Error('Invalid API response: Expected an array');
        }
        // Call the API to get the doctor names
        const updatedDoctors = await Promise.all(data.data.map(async (doctor) => {
          try {
            const profileResponse = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/doctors/doctorprofile/${doctor.userId}`);
            if (profileResponse.ok) {
              const profileData = await profileResponse.json();
              if (profileData.data && Array.isArray(profileData.data) && profileData.data.length > 0) {
                doctor.user = { name: profileData.data[0].user?.name || "Bác sĩ chưa cập nhật tên" };
              }
            }
          } catch (profileError) {
            console.error("Error fetching doctor profile:", profileError);
          }
          return doctor;
        }));

        setDoctors(updatedDoctors);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        message.error('Failed to load doctors');
      }
    };

    fetchUserData();
    fetchChildData();
    fetchDoctors();
  }, []);

  return (
    <Layout style={{ minHeight: '100vh', margin: '-25px' }}>
      <Content style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto', marginBottom: '50px' }}>
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
                  </div>
                }
              >
                {childData ? (
                  <Card type="inner" style={{ marginTop: '16px' }}>
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <Title level={5}>{childData.name}</Title>
                        <p>Age: {childData.age || "N/A"}</p>
                        <p>Gender: {childData.gender === 0 ? "Male" : "Female"}</p>
                        <p>Last Checkup: {childData.lastCheckup || "N/A"}</p>
                      </Col>
                      <Col span={12}>
                        <Title level={5}>BMI</Title>
                        <Progress
                          percent={75}
                          status="active"
                          format={() => `${childData.bmi || "N/A"} kg/m²`}
                        />
                        <p>Height: {childData.height || "N/A"} cm</p>
                        <p>Weight: {childData.weight || "N/A"} kg</p>
                      </Col>
                    </Row>
                  </Card>
                ) : (
                  <Text>No child information available.</Text>
                )}
              </Card>
            </Col>

            <Col span={8}>
              <Card title="Recommended Doctors" bodyStyle={{ padding: '0' }}>
                {doctors.map(doctor => (
                  <div key={doctor.id} style={{ padding: '16px', borderBottom: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <Avatar src={doctor.profileImg || doctorImage} size={48} />
                      <div style={{ flex: 1 }}>
                        <Text strong style={{ display: 'block', fontSize: '16px' }}>{doctor.user?.name || "Bác sĩ chưa cập nhật tên"}</Text>
                        <Text type="secondary" style={{ fontSize: '14px', marginTop: '4px', display: 'block' }}>{doctor.specialize}</Text>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px' }}>
                      <Rate disabled defaultValue={4.5} style={{ fontSize: '16px' }} />
                      <Button type="primary" size="middle">Follow</Button>
                    </div>
                  </div>
                ))}
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
