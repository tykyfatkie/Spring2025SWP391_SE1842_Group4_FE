import React, { useState, useEffect } from 'react';
import { Layout, Typography, Row, Col, Card, Avatar, Tag, Spin, Alert, Button } from 'antd';
import { UserOutlined, EnvironmentOutlined, PhoneOutlined, MailOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AppFooter from "../../components/Footer/Footer";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const MyDoctorProfilePage: React.FC = () => {
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        if (!token || !userId) {
          throw new Error("Unauthorized: Please log in");
        }
  
        const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/doctors/doctorprofile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const result = await response.json();
        if (!result.data) {
          throw new Error("No doctor profile found");
        }
  
        setDoctor(result.data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchDoctorProfile();
  }, []);
  
  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh', margin: '-25px' }}>
        <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Spin size="large" />
        </Content>
      </Layout>
    );
  }

  if (error || !doctor) {
    return (
      <Layout style={{ minHeight: '100vh', margin: '-25px' }}>
        <Content style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
          <Alert message="Lỗi" description={error || "Không tìm thấy thông tin bác sĩ"} type="error" showIcon />
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', margin: '-25px' }}>
      <Content style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', marginBottom: '50px' }}>
        <Card style={{ marginTop: '24px' }}>
          <Row gutter={24}>
            <Col span={8}>
              <Avatar size={128} src={doctor.profileImg} icon={<UserOutlined />} />
              <Tag color="blue" style={{ marginTop: '16px' }}>{doctor.specialize || "Bác sĩ chuyên khoa"}</Tag>
              <Button type="primary" block style={{ marginTop: '16px' }} onClick={() => navigate('/update-doctor-profile')}>
                Cập nhật hồ sơ
              </Button>
            </Col>
            <Col span={16}>
              <Title level={2}>{doctor.user?.name}</Title>
              <Paragraph>
                <ul>
                  <li><EnvironmentOutlined /> Phòng khám: {doctor.hospital || "Chưa cập nhật"}</li>
                  <li><PhoneOutlined /> Số điện thoại: {doctor.user?.phone || "Chưa cập nhật"}</li>
                  <li><MailOutlined /> Email: {doctor.user?.email || "Chưa cập nhật"}</li>
                  <li><ClockCircleOutlined /> Giờ làm việc: 8:00 - 17:00 (Thứ 2 - Thứ 7)</li>
                </ul>
              </Paragraph>
            </Col>
          </Row>
        </Card>
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default MyDoctorProfilePage;