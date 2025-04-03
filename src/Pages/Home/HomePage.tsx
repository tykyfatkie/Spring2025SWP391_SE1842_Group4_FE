import React, { useEffect, useState } from 'react';
import { Layout, Typography, Button, Card, Row, Col, Space } from 'antd';
import AppFooter from '../../components/Footer/Footer';
import { SmileOutlined, HeartOutlined, StarOutlined, UserOutlined, CheckCircleOutlined, ArrowRightOutlined } from '@ant-design/icons';
import DoctorsSection from '../../components/Doctor section/DoctorsSection ';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

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
  '../../../src/assets/home.jpg'
];

const Homepage: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [, setCurrentImageIndex] = useState(0);
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
    <Layout style={{ minHeight: '100vh', margin: "-25px", background: 'white' }}>
      <Content>
        {/* Hero Section with Split Layout */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            height: '700px',
            overflow: 'hidden',
            marginBottom: '30px',
            marginTop: '30px',
            position: 'relative',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            borderRadius: '0 0 30px 30px',
            marginRight: '50px',
          }}
        >
          {/* Left Content Section */}
          <div
            style={{
              width: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 48px',
              background: 'linear-gradient(135deg, rgb(30, 58, 138) 0%, rgb(59, 130, 246) 100%)', 
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
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
            
            <div style={{ maxWidth: '480px', textAlign: 'left', position: 'relative', zIndex: 2 }}>
              <div style={{ 
                display: 'inline-block', 
                padding: '8px 16px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                marginBottom: '16px'
              }}>
                <span style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>TRUSTED BY EXPERTS</span>
              </div>
              
              <Title level={1} style={{ color: 'white', fontSize: '52px', marginBottom: '24px', fontWeight: 700, lineHeight: 1.2 }}>
                Smart Child Growth Tracking System
              </Title>
              <Paragraph style={{ fontSize: 18, marginBottom: 32, color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.6 }}>
                Track your child's development scientifically and accurately.
                Trusted by thousands of parents and healthcare professionals.
              </Paragraph>
              
              <Space direction="vertical" size="middle" style={{ width: '100%', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircleOutlined style={{ color: '#3b82f6', marginRight: '12px' }} />
                  <Text style={{ color: 'white' }}>WHO standard growth charts</Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircleOutlined style={{ color: '#3b82f6', marginRight: '12px' }} />
                  <Text style={{ color: 'white' }}>Expert pediatrician guidance</Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircleOutlined style={{ color: '#3b82f6', marginRight: '12px' }} />
                  <Text style={{ color: 'white' }}>Development milestone tracking</Text>
                </div>
              </Space>
              
              <Space size="middle">
                <Button 
                  type="primary" 
                  size="large" 
                  style={{ 
                    borderRadius: '50px', 
                    paddingLeft: '28px', 
                    paddingRight: '28px',
                    height: '52px',
                    background: 'white',
                    color: '#1e3a8a',
                    border: 'none',
                    fontWeight: 600,
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  onClick={() => navigate("/login")}
                >
                  Get Started <ArrowRightOutlined style={{ marginLeft: '8px' }} />
                </Button>
                <Button 
                  size="large"
                  style={{ 
                    borderRadius: '50px', 
                    borderColor: 'rgba(255, 255, 255, 0.3)', 
                    color: 'white',
                    paddingLeft: '28px', 
                    paddingRight: '28px',
                    height: '52px',
                    background: 'transparent',
                    fontWeight: 500,
                  }}
                >
                  Learn More
                </Button>
              </Space>
            </div>
          </div>

          {/* Right Image Section */}
          <div
            style={{
              width: '50%',
              backgroundImage: 'url(../../../src/assets/0.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
            }}
          >

          </div>
        </div>
        {/* Features Section */}
        <Row gutter={[16, 24]} style={{ padding: '48px 12px' }}>
          {features.map((feature, index) => (
            <Col key={index} xs={24} sm={12} md={6}>
              <Card
                variant="outlined"
                style={{ borderRadius: '20px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
                styles={{ body: { textAlign: 'center' } }}
              >
                <div style={{ marginBottom: '16px' }}>
                  {feature.icon}
                </div>
                <Title level={4}>{feature.title}</Title>
                <Paragraph>{feature.description}</Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
        
        {/* Doctors Section */}
        <DoctorsSection doctors={doctors} loading={loading} error={error} />
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default Homepage;