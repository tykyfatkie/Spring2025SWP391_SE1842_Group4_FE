import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Layout, Typography, Row, Col, Card, Tabs, Rate, Button, Avatar, Tag, Timeline, Spin, Alert } from 'antd';
import { UserOutlined, ClockCircleOutlined, EnvironmentOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import AppFooter from "../../components/Footer/Footer";
import Doctor from "../../assets/doctor.png";

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
  user?: {
    name: string;
    userName: string;
    email: string;
    phone?: string;
    address?: string;
  };
}

const DoctorProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        if (!id) {
          throw new Error("Doctor ID is required");
        }

        const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/doctors/doctorprofile/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        if (!result.data || !Array.isArray(result.data) || result.data.length === 0) {
          throw new Error("Invalid API response or no doctor found");
        }

        setDoctor(result.data[0]);
      } catch (error: any) {
        console.error("Fetch Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorProfile();
  }, [id]);

  const getMetadata = () => {
    try {
      if (doctor?.metadata) {
        return JSON.parse(doctor.metadata);
      }
      return null;
    } catch (e) {
      console.error("Error parsing metadata:", e);
      return null;
    }
  };

  const metadata = getMetadata();

  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh', margin: '-25px' }}>
        <Content style={{ padding: '0 20px', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <Spin size="large" />
          </div>
        </Content>
      </Layout>
    );
  }

  if (error || !doctor) {
    return (
      <Layout style={{ minHeight: '100vh', margin: '-25px' }}>
        <Content style={{ padding: '0 20px', maxWidth: '1200px', margin: '0 auto' }}>
          <Alert
            message="Error retrieving doctor information"
            description={error || "Doctor information not found"}
            type="error"
            showIcon
            style={{ marginTop: '24px' }}
          />
        </Content>
      </Layout>
    );
  }

  const degrees = metadata?.years ? [`${metadata.years} years of experience`] : ["Doctor of Medicine", "Master of Medicine"];
  const certificates = [doctor.certificate || "Specialty certificate"];
  const research = ["Clinical research", "Scientific publications"];
  const languages = ["Vietnamese", "English"];
  const specializations = doctor.specialize ? [doctor.specialize] : ["General Medicine"];

  const hospital = metadata?.hospital || "Hospital";

  return (
    <Layout style={{ minHeight: '100vh', margin: '-25px' }}>
      <Content style={{ 
        padding: '0 20px', 
        maxWidth: '1200px', 
        margin: '0 auto',
        marginBottom: '50px'
      }}>
        <Card style={{ marginTop: '24px' }}>
          <Row gutter={24}>
            <Col span={8}>
            <img 
              src={doctor.profileImg} 
              alt={doctor.biography} 
              style={{ width: '100%', borderRadius: '8px' }}
              onError={(e) => {
                e.target.src = Doctor; 
              }}
            />

              <Button type="primary" block style={{ marginTop: '16px' }}>
                Make an appointment
              </Button>
            </Col>
            <Col span={16}>
              <Title level={2}>{doctor.user?.name || doctor.biography}</Title>
              <Rate disabled defaultValue={4.5} style={{ fontSize: '16px' }} />
              <Text style={{ marginLeft: '8px' }}>(80 reviews)</Text>
              
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

              <Title level={4} style={{ marginTop: '24px' }}>Work Experience</Title>
              <Timeline>
                <Timeline.Item>{metadata?.years ? `${new Date().getFullYear() - parseInt(metadata.years)} - ${new Date().getFullYear()}` : "2018 - present"}: Doctor at {hospital || "Hospital"}</Timeline.Item>
                <Timeline.Item>Specialized work experience {metadata?.years || "many"} years</Timeline.Item>
              </Timeline>
            </TabPane>

            <TabPane tab="Reviews" key="2">
              <Row gutter={[16, 16]}>
                {[1, 2, 3].map((review) => (
                  <Col span={24} key={review}>
                    <Card>
                      <Row align="middle">
                        <Avatar icon={<UserOutlined />} />
                        <div style={{ marginLeft: '12px' }}>
                          <Text strong>Anonymous User</Text>
                          <br />
                          <Rate disabled defaultValue={5} style={{ fontSize: '12px' }} />
                          <Text type="secondary" style={{ marginLeft: '8px' }}>1 month ago</Text>
                        </div>
                      </Row>
                      <Paragraph style={{ marginTop: '12px' }}>
                        The doctor is very dedicated and professional. I am very satisfied with the medical service.
                      </Paragraph>
                    </Card>
                  </Col>
                ))}
              </Row>
            </TabPane>

            <TabPane tab="Appointment Schedule" key="3">
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
          </Tabs>
        </Card>
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default DoctorProfilePage;
