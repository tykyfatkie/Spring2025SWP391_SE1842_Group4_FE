import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Thêm import axios
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
  EditOutlined,
  RightOutlined // Thêm icon này để làm nút xem thêm
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
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [childData, setChildData] = useState<any>(null); // Thay đổi state để lưu dữ liệu trẻ

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
        setUserData(data.data);
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchChildData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token || token.split('.').length !== 3) {
          return;
        }
        
        const response = await axios.get(
          `${import.meta.env.VITE_API_ENDPOINT}/children/getChildByToken`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        console.log('Child data:', response.data);
        
        // Nếu có dữ liệu trẻ, lấy trẻ đầu tiên để hiển thị
        if (response.data.data && response.data.data.length > 0) {
          setChildData(response.data.data[0]);
        }
      } catch (error) {
        console.error('Error fetching child data:', error);
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
        setDoctors(data.data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        message.error('Failed to load doctors');
      }
    };

    fetchUserData();
    fetchChildData(); // Gọi API lấy dữ liệu trẻ
    fetchDoctors();
  }, []);

  const handleAddChild = async (values: any) => {
    try {
      // Thêm logic gửi dữ liệu lên API nếu cần
      console.log('New child values:', values);
      setIsModalVisible(false);
      form.resetFields();
      
      // Sau khi thêm thành công, cập nhật lại danh sách trẻ
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/children/getChildByToken`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.data && response.data.data.length > 0) {
        setChildData(response.data.data[0]);
      }
      
      message.success('Child added successfully');
    } catch (error) {
      console.error('Error adding child:', error);
      message.error('Failed to add child');
    }
  };

  // Tính BMI từ chiều cao và cân nặng
  const calculateBMI = (height: number, weight: number) => {
    // Chuyển chiều cao từ cm sang m
    const heightInMeters = height / 100;
    // Tính BMI = cân nặng / (chiều cao ^ 2)
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  return (
    <Layout style={{ minHeight: '100vh', margin: '-25px' }}>
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
                    <div>
                    <Button 
                      type="primary" 
                      icon={<PlusOutlined />}
                      style={{ marginRight: '8px' }}
                    >
                      <Link to="/child-create">Add Child</Link>
                    </Button>
                      <Link to="/child-manage">
                        <Button type="default">
                          View All <RightOutlined />
                        </Button>
                      </Link>
                    </div>
                  </div>
                }
              >
                {childData ? (
                  <Card key={childData.id} type="inner" style={{ marginTop: '16px' }}>
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <Title level={5}>{childData.name}</Title>
                        <p>Age: {childData.age || 'N/A'}</p>
                        <p>Gender: {childData.gender}</p>
                        <p>Last Checkup: {childData.lastCheckup || 'No data'}</p>
                      </Col>
                      <Col span={12}>
                        <Title level={5}>BMI</Title>
                        <Progress
                          percent={75}
                          status="active"
                          format={() => `${calculateBMI(childData.height, childData.weight)} kg/m²`}
                        />
                        <p>Height: {childData.height} cm</p>
                        <p>Weight: {childData.weight} kg</p>
                      </Col>
                    </Row>
                  </Card>
                ) : (
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <Text type="secondary">No child information. Please add a child.</Text>
                  </div>
                )}
              </Card>

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
                        defaultValue={4.5}
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