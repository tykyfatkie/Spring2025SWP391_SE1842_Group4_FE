import React, { useState, useEffect } from 'react';
import { Layout, Typography, Row, Col, Card, Tag, Spin, Alert, Button, Tabs, Rate } from 'antd';
import { EnvironmentOutlined, PhoneOutlined, MailOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import DoctorSidebar from '../../components/Sidebar/DoctorSidebar';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

interface DoctorProfile {
  certificate: string;
  licenseNumber: string;
  biography: string;
  metadata: string;
  specialize: string;
  profileImg: string;
  status: number;
  userId: string;
  hospital?: string;
  user?: {
    name: string;
    userName: string;
    email: string;
    phone?: string;
    address?: string;
  };
}

const MyDoctorProfilePage: React.FC = () => {
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
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
  
  const getMetadata = () => {
    try {
      if (doctor?.metadata) {
        return JSON.parse(doctor.metadata);
      }
      return null;
    } catch (e) {
      return null;
    }
  };

  const metadata = getMetadata();

  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh', marginLeft: '-25px' }}>
        <DoctorSidebar />
        <Layout>
          <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Spin size="large" />
          </Content>
        </Layout>
      </Layout>
    );
  }

  if (error || !doctor) {
    return (
      <Layout style={{ minHeight: '100vh', marginLeft: '-25px' }}>
        <DoctorSidebar />
        <Layout>
          <Content style={{ padding: '20px' }}>
            <Alert
              message="Error retrieving doctor information"
              description={error || "Doctor information not found"}
              type="error"
              showIcon
              style={{ marginTop: '24px' }}
            />
          </Content>
        </Layout>
      </Layout>
    );
  }

  const degrees = metadata?.years ? [`${metadata.years} years of experience`] : ["Doctor of Medicine", "Master of Medicine"];
  const certificates = [doctor.certificate || "Specialty certificate"];
  const research = ["Clinical research", "Scientific publications"];
  const languages = ["Vietnamese", "English"];
  const specializations = doctor.specialize ? [doctor.specialize] : ["General Medicine"];

  const hospital = metadata?.hospital || doctor.hospital || "Hospital";

  return (
    <Layout style={{ minHeight: '100vh', marginLeft: '-25px', marginTop:'-24px'}}>
      <DoctorSidebar />
      <Layout>
        <Content style={{ 
          padding: '20px', 
          maxWidth: '1995px', 
          margin: '0 auto',
          marginBottom: '50px'
        }}>
          <Card style={{ marginTop: '24px' }}>
            <Row gutter={24}>
              <Col span={8}>
                <img 
                  src={doctor.profileImg} 
                  alt={doctor.user?.name || "Doctor"} 
                  style={{ width: '100%', borderRadius: '8px' }}
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/300x400?text=Doctor+Image';
                  }}
                />
                <Button 
                  type="primary" 
                  block 
                  style={{ marginTop: '16px' }}
                  onClick={() => navigate('/update-doctor-profile')}
                >
                  Update Profile
                </Button>
              </Col>
              <Col span={16}>
                <Title level={2}>{doctor.user?.name || doctor.biography}</Title>
                <Rate disabled defaultValue={4.5} style={{ fontSize: '16px' }} />
                <Text style={{ marginLeft: '8px' }}>(My Rating)</Text>
                
                <Row style={{ marginTop: '16px' }}>
                  <Col span={24}>
                    <Tag color="blue">{doctor.specialize || "Specialist"}</Tag>
                    <Tag color="green">{metadata?.years ? `${metadata.years} years of experience` : "Experienced doctor"}</Tag>
                  </Col>
                </Row>

                <Paragraph style={{ marginTop: '16px' }}>
                  <ul>
                    <li><EnvironmentOutlined /> Clinic: {hospital || "Not updated"}</li>
                    <li><PhoneOutlined /> Phone: {doctor.user?.phone || "Not updated"}</li>
                    <li><MailOutlined /> Email: {doctor.user?.email || "Not updated"}</li>
                    <li><ClockCircleOutlined /> Working hours: 8:00 AM - 5:00 PM (Monday - Saturday)</li>
                  </ul>
                </Paragraph>
              </Col>
            </Row>

            <Tabs defaultActiveKey="1" style={{ marginTop: '24px' }}>
              <TabPane tab="General Information" key="1">
                <Title level={4}>Degrees & Certifications</Title>
                <Row gutter={[24, 24]}>
                  <Col span={12}>
                    <Card title="Education" size="small">
                      {degrees.map((degree, index) => (
                        <p key={index}>• {degree}</p>
                      ))}
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card title="Specialty Certifications" size="small">
                      {certificates.map((cert, index) => (
                        <p key={index}>• {cert}</p>
                      ))}
                    </Card>
                  </Col>
                </Row>

                <Title level={4} style={{ marginTop: '24px' }}>Specializations</Title>
                <Row gutter={[24, 24]}>
                  <Col span={12}>
                    <Card title="Specialized Fields" size="small">
                      {specializations.map((spec, index) => (
                        <Tag color="blue" key={index} style={{ margin: '4px' }}>
                          {spec}
                        </Tag>
                      ))}
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card title="Languages" size="small">
                      {languages.map((lang, index) => (
                        <Tag color="green" key={index} style={{ margin: '4px' }}>
                          {lang}
                        </Tag>
                      ))}
                    </Card>
                  </Col>
                </Row>

                <Title level={4} style={{ marginTop: '24px' }}>Research & Publications</Title>
                <Card size="small">
                  {research.map((item, index) => (
                    <p key={index}>• {item}</p>
                  ))}
                </Card>
              </TabPane>

              <TabPane tab="Appointment Schedule" key="2">
                <Title level={4}>Weekly Appointment Schedule</Title>
                <Row gutter={[16, 16]}>
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                    <Col span={8} key={day}>
                      <Card title={day} size="small">
                        <p>Morning: 8:00 AM - 12:00 PM</p>
                        <p>Afternoon: 1:30 PM - 5:00 PM</p>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </TabPane>

              <TabPane tab="My Patients" key="3">
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Card title="Recent Patients">
                      <Alert
                        message="No recent patients"
                        description="Your patient list will appear here."
                        type="info"
                        showIcon
                      />
                    </Card>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MyDoctorProfilePage;
