import React, { useEffect, useState } from 'react';
import { Layout, Typography, Button, Card, Row, Col, Space, Statistic } from 'antd';
import AppFooter from '../../components/Footer/Footer';
import { SmileOutlined, HeartOutlined, StarOutlined, UserOutlined } from '@ant-design/icons';
import DoctorsSection from '../../components/Doctor section/DoctorsSection ';
import { useNavigate } from 'react-router-dom';

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

const backgroundImages = [
  '../../../src/assets/home1.jpg',
  '../../../src/assets/home2.jpg',
  '../../../src/assets/home3.jpg',
  '../../../src/assets/home4.jpg',
  '../../../src/assets/home5.jpg'
];

const Homepage: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/doctors/all`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (!Array.isArray(data.data)) {
          throw new Error("Invalid API response: Expected an array");
        }

        const shuffledDoctors = data.data.sort(() => 0.5 - Math.random());
        const selectedDoctors = shuffledDoctors.slice(0, 5);
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000);

    return () => clearInterval(interval); 
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
    <Layout style={{ minHeight: '100vh', margin: "-25px" }}>
      <Content>
        {/* Hero Section with Right-to-Left Sliding Background */}
        <div
          style={{
            position: 'relative',
            height: '400px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            background: 'linear-gradient(to right, rgba(230, 247, 255, 0.8), rgba(240, 245, 255, 0.8))'
          }}
        >
          {/* Background Image Container */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              overflow: 'hidden',
            }}
          >
            {backgroundImages.map((image, index) => (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'blur(10px)',
                  transition: 'transform 1.5s ease-in-out, opacity 1.5s ease-in-out',
                  transform: `translateX(${(index - currentImageIndex) * 100}%)`,
                  opacity: index === currentImageIndex ? 1 : 0
                }}
              />
            ))}
          </div>

          {/* Centered Content */}
          <Row
            justify="center"
            align="middle"
            style={{
              position: 'relative',
              zIndex: 2,
              maxWidth: '800px'
            }}
          >
            <Col>
              <Title level={1}>Smart Child Growth Tracking System</Title>
              <Paragraph style={{ fontSize: 16, marginBottom: 32 }}>
                Track your child's development scientifically and accurately.
                Trusted by thousands of parents and healthcare professionals.
              </Paragraph>
              <Space size="middle">
                <Button type="primary" size="large" onClick={() => navigate("/login")}>Get Started</Button>
                <Button size="large">Learn More</Button>
              </Space>
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
                <Card hoverable style={{ height: '100%', textAlign: 'center' }} bodyStyle={{ padding: 24 }}>
                  <div style={{ marginBottom: 24 }}>{feature.icon}</div>
                  <Title level={3} style={{ fontSize: 20, marginBottom: 16 }}>
                    {feature.title}
                  </Title>
                  <Paragraph style={{ color: 'rgba(0, 0, 0, 0.65)' }}>{feature.description}</Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Doctors Section */}
        <DoctorsSection doctors={doctors} loading={loading} error={error} />

      </Content>

      {/* Footer */}
      <AppFooter />
    </Layout>
  );
};

export default Homepage;
