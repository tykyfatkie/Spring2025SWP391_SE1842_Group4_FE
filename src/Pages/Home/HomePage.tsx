import React, { useEffect, useState } from 'react';
import { Layout, Typography, Button, Card, Row, Col, Space, Statistic} from 'antd';
import AppFooter from '../../components/Footer/Footer';
import HomePagePicture from '../../assets/homepaagepic.jpg';
import { SmileOutlined, HeartOutlined, StarOutlined, UserOutlined } from '@ant-design/icons';
import DoctorsSection from '../../components/Doctor section/DoctorsSection ';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

interface Doctor {
  id: string;
  certificate: string;
  licenseNumber: string;
  biography: string;
  metadata: string;
  specialize: string;
  profileImg: string;
  status: number;
  userId: string;
}

const Homepage: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('https://localhost:7217/api/v1/doctors/all');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (!Array.isArray(data.data)) {
          throw new Error("Invalid API response: Expected an array");
        }

        // Randomly select 4 or 5 doctors
        const shuffledDoctors = data.data.sort(() => 0.5 - Math.random());
        const selectedDoctors = shuffledDoctors.slice(0, 5); // Limit to 5 doctors
        setDoctors(selectedDoctors);
      } catch (error: any) {
        console.error("Fetch Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const features = [
    {
      icon: <SmileOutlined style={{ fontSize: '48px', color: '#1890ff' }} />,
      title: "User-Friendly",
      description: "Easy to use interface for parents and healthcare professionals."
    },
    {
      icon: <HeartOutlined style={{ fontSize: '48px', color: '#1890ff' }} />,
      title: "Health Tracking",
      description: "Track your child's health metrics seamlessly."
    },
    {
      icon: <StarOutlined style={{ fontSize: '48px', color: '#1890ff' }} />,
      title: "Expert Guidance",
      description: "Access to a network of trusted healthcare experts."
    },
    {
      icon: <UserOutlined style={{ fontSize: '48px', color: '#1890ff' }} />,
      title: "Community Support",
      description: "Join a community of parents for sharing experiences."
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', margin: '-25px'}}>
      <Content>
        {/* Hero Section */}
        <div style={{ background: 'linear-gradient(to right, #e6f7ff, #f0f5ff)', padding: '64px 0' }}>
          <Row justify="center" align="middle" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <Col xs={24} md={12}>
              <Title level={1}>Smart Child Growth Tracking System</Title>
              <Paragraph style={{ fontSize: 16, marginBottom: 32 }}>
                Track your child's development scientifically and accurately.
                Trusted by thousands of parents and healthcare professionals.
              </Paragraph>
              <Space size="middle">
                <Button type="primary" size="large">Get Started</Button>
                <Button size="large">Learn More</Button>
              </Space>
            </Col>
            <Col xs={24} md={12} style={{ textAlign: 'center', paddingLeft: '90px' }}>
              <img src={HomePagePicture} alt="Baby care illustration" style={{ maxWidth: '100%', height: 'auto' }} />
            </Col>
          </Row>
        </div>

        {/* Features Section */}
        <div style={{ padding: '64px 0', background: '#fff' }}>
          <Row justify="center" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <Col span={24} style={{ textAlign: 'center', marginBottom: 48 }}>
              <Title level={2}>Key Features</Title>
            </Col>
            {features.map((feature, index) => (
              <Col xs={24} sm={12} lg={6} key={index} style={{ padding: 12 }}>
                <Card 
                  hoverable 
                  style={{ height: '100%', textAlign: 'center' }}
                  bodyStyle={{ padding: 24 }}
                >
                  <div style={{ marginBottom: 24 }}>
                    {feature.icon}
                  </div>
                  <Title level={3} style={{ fontSize: 20, marginBottom: 16 }}>
                    {feature.title}
                  </Title>
                  <Paragraph style={{ color: 'rgba(0, 0, 0, 0.65)' }}>
                    {feature.description}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Doctors Section */}
        <DoctorsSection doctors={doctors} loading={loading} error={error} />

        {/* Stats Section */}
        <div style={{ background: '#f0f5ff', padding: '64px 0'}}>
          <Row justify="center" gutter={[32, 32]} style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <Col xs={24} md={8}>
              <Card bordered={false}>
                <Statistic
                  title="Trusted Users"
                  value={10000}
                  suffix="+"
                  style={{ textAlign: 'center' }}
                />
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card bordered={false}>
                <Statistic
                  title="Accompanying Doctors"
                  value={50}
                  suffix="+"
                  style={{ textAlign: 'center' }}
                />
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card bordered={false}>
                <Statistic
                  title="Accuracy Rate"
                  value={99.9}
                  suffix="%"
                  style={{ textAlign: 'center' }}
                />
              </Card>
            </Col>
          </Row>
        </div>
      </Content>

      {/* Footer */}
      <AppFooter />
    </Layout>
  );
};

export default Homepage;