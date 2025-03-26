import React, { useEffect, useState } from 'react';
import { Layout, Typography, Button, Card, Row, Col, Space, Statistic, Input } from 'antd';
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

  const statistics = [
    { title: "Happy Parents", value: "15,000+", icon: <SmileOutlined /> },
    { title: "Health Professionals", value: "500+", icon: <UserOutlined /> },
    { title: "Children Tracked", value: "25,000+", icon: <HeartOutlined /> },
    { title: "Positive Reviews", value: "10,000+", icon: <StarOutlined /> }
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
              background: '#1e3a8a', // Màu xanh dương đậm
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
            <div style={{
              position: 'absolute',
              bottom: '30px',
              right: '30px',
              background: 'rgba(255, 255, 255, 0.9)',
              padding: '16px 24px',
              borderRadius: '8px',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
              maxWidth: '280px',
            }}>
              <Text style={{ color: '#1e3a8a', fontWeight: 600, fontSize: '16px' }}>
                "Scientifically proven to help parents make informed decisions about their child's health."
              </Text>
              <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#1e3a8a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px' }}>
                  <UserOutlined style={{ color: 'white', fontSize: '20px' }} />
                </div>
                <div>
                  <Text style={{ display: 'block', fontWeight: 600, color: '#1e3a8a' }}>Dr. William Li</Text>
                  <Text style={{ color: '#4b5563', fontSize: '12px' }}>Pediatric Specialist</Text>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <Row justify="center" style={{ padding: '60px 0', background: '#f8fafc', marginBottom: '60px', borderRadius: '30px', marginRight: '60px' }}>
          <Col span={24} style={{ textAlign: 'center', marginBottom: '40px' }}>
            <Title level={2} style={{ color: '#1e3a8a', marginBottom: '16px' }}>Trusted by Thousands</Title>
            <Paragraph style={{ color: '#4b5563', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
              Join our growing community of parents and healthcare professionals
            </Paragraph>
          </Col>
          
          {statistics.map((stat, index) => (
            <Col xs={24} sm={12} md={6} key={index} style={{ padding: '16px', textAlign: 'center' }}>
              <div style={{ 
                padding: '24px', 
                background: 'white', 
                borderRadius: '16px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.03)',
                height: '100%',
              }}>
                <div style={{ 
                  width: '70px', 
                  height: '70px', 
                  borderRadius: '50%', 
                  background: 'rgba(30, 58, 138, 0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  margin: '0 auto 16px' 
                }}>
                  {React.cloneElement(stat.icon, { style: { fontSize: '32px', color: '#1e3a8a' } })}
                </div>
                <Statistic 
                  value={stat.value} 
                  valueStyle={{ color: '#1e3a8a', fontSize: '28px', fontWeight: 700 }} 
                />
                <Text style={{ color: '#4b5563', fontSize: '16px' }}>{stat.title}</Text>
              </div>
            </Col>
          ))}
        </Row>

        {/* Doctors Section */}
        <div style={{ marginBottom: '60px', padding: '0 24px', marginLeft:'-25px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ 
              display: 'inline-block', 
              padding: '8px 16px',
              background: 'rgba(30, 58, 138, 0.1)',
              borderRadius: '20px',
              marginBottom: '16px'
            }}>
              <span style={{ color: '#1e3a8a', fontWeight: '600', fontSize: '14px' }}>EXPERT TEAM</span>
            </div>
            <Title level={2} style={{ color: '#1e3a8a', marginBottom: '16px', fontSize: '36px' }}>Meet Our Specialists</Title>
            <Paragraph style={{ color: '#4b5563', fontSize: '18px', maxWidth: '700px', margin: '0 auto' }}>
              Our team of certified healthcare professionals is dedicated to providing the best care for your child
            </Paragraph>
          </div>
          <DoctorsSection doctors={doctors} loading={loading} error={error} />
        </div>

        {/* Enhanced Features Section */}
        <div style={{ 
          padding: '120px 0', 
          background: 'linear-gradient(to bottom, #f0f7ff, #e6f0fd)',
          marginBottom: '60px',
          borderRadius: '30px',
        }}>
          <Row justify="center" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <Col span={24} style={{ textAlign: 'center', marginBottom: 60 }}>
              <div style={{ 
                display: 'inline-block', 
                padding: '8px 16px',
                background: 'rgba(30, 58, 138, 0.1)',
                borderRadius: '20px',
                marginBottom: '16px'
              }}>
                <span style={{ color: '#1e3a8a', fontWeight: '600', fontSize: '14px' }}>WHY CHOOSE US</span>
              </div>
              <Title level={2} style={{ 
                color: '#1e3a8a', 
                fontSize: '36px', 
                marginTop: 0,
                marginBottom: '24px'
              }}>
                Key Features
              </Title>
              <Paragraph style={{ 
                color: '#4b5563', 
                fontSize: '18px', 
                maxWidth: '700px', 
                margin: '0 auto' 
              }}>
                Our platform provides the essential tools to help you monitor and support your child's growth journey.
              </Paragraph>
            </Col>
            
            {features.map((feature, index) => (
              <Col xs={24} sm={12} lg={6} key={index} style={{ padding: '16px' }}>
                <Card 
                  hoverable 
                  style={{ 
                    height: '100%', 
                    textAlign: 'center', 
                    borderRadius: '16px',
                    border: 'none',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.3s ease',
                    overflow: 'hidden',
                    position: 'relative'
                  }} 
                  bodyStyle={{ padding: '32px 24px' }}
                >
                  <div style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    height: '6px', 
                    background: '#1e3a8a',
                    opacity: 0.7 
                  }}/>
                  
                  <div style={{ 
                    marginBottom: '28px',
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'rgba(30, 58, 138, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 28px'
                  }}>
                    {React.cloneElement(feature.icon, { style: { fontSize: '40px', color: '#1e3a8a' } })}
                  </div>
                  
                  <Title level={3} style={{ fontSize: '22px', marginBottom: '16px', color: '#1e3a8a', fontWeight: 600 }}>
                    {feature.title}
                  </Title>
                  
                  <Paragraph style={{ color: '#4b5563', fontSize: '16px', lineHeight: '1.6' }}>
                    {feature.description}
                  </Paragraph>
                  
                  <div style={{ marginTop: '24px' }}>
                    <Button 
                      type="link" 
                      style={{ 
                        color: '#1e3a8a', 
                        fontWeight: 500, 
                        padding: 0,
                        fontSize: '16px'
                      }}
                    >
                      Learn More →
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
            
            <Col span={24} style={{ textAlign: 'center', marginTop: '48px' }}>
              <Button
                type="primary"
                size="large"
                style={{
                  height: '52px',
                  padding: '0 32px',
                  fontSize: '16px',
                  fontWeight: '500',
                  borderRadius: '8px',
                  background: '#1e3a8a',
                  border: 'none',
                  boxShadow: '0 8px 20px rgba(30, 58, 138, 0.25)',
                  transition: 'all 0.3s ease'
                }}
              >
                Explore All Features
              </Button>
            </Col>
          </Row>
        </div>

        {/* CTA Section */}
        <div style={{ 
          padding: '80px 24px', 
          background: '#1e3a8a', 
          borderRadius: '30px',
          margin: '0 24px 60px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Decorative elements */}
          <div style={{
            position: 'absolute',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
            top: '-100px',
            right: '-100px',
          }} />
          <div style={{
            position: 'absolute',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
            bottom: '-50px',
            left: '100px',
          }} />
          
          <Row justify="center" align="middle" style={{ maxWidth: 1000, margin: '0 auto', position: 'relative', zIndex: 2 }}>
            <Col xs={24} md={16} style={{ textAlign: 'center', marginBottom: { xs: '32px', md: '0' } }}>
              <Title level={2} style={{ color: 'white', marginBottom: '16px', fontSize: '36px', fontWeight: 700 }}>
                Ready to Start Tracking Your Child's Growth?
              </Title>
              <Paragraph style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '18px', marginBottom: '0' }}>
                Join thousands of parents who trust our platform for accurate growth tracking and expert advice.
              </Paragraph>
            </Col>
            <Col xs={24} md={8} style={{ textAlign: 'center' }}>
              <Button 
                type="primary" 
                size="large" 
                onClick={() => navigate("/register")}
                style={{
                  height: '52px',
                  padding: '0 32px',
                  fontSize: '16px',
                  fontWeight: '600',
                  borderRadius: '8px',
                  background: 'white',
                  color: '#1e3a8a',
                  border: 'none',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                }}
              >
                Register Now <ArrowRightOutlined style={{ marginLeft: '8px' }} />
              </Button>
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