import React, { useEffect, useState } from 'react';
import { Layout, Typography, Card, Row, Col, Space, Statistic } from 'antd';
import AppFooter from '../../components/Footer/Footer';
import { SmileOutlined, HeartOutlined, StarOutlined, UserOutlined, CheckCircleOutlined } from '@ant-design/icons';
import DoctorsSection from '../../components/Doctor section/DoctorsSection ';

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

  const statistics = [
    { title: "Happy Parents", value: "15,000+", icon: <SmileOutlined /> },
    { title: "Health Professionals", value: "500+", icon: <UserOutlined /> },
    { title: "Children Tracked", value: "25,000+", icon: <HeartOutlined /> },
    { title: "Positive Reviews", value: "10,000+", icon: <StarOutlined /> }
  ];


  return (
    <Layout style={{ minHeight: '100vh', margin: "-25px", background: 'white' }}>
      <Content>

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

          <div
            style={{
              width: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 48px',
              background: '#1e3a8a', 
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
            }}
          >

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
              
            </div>
          </div>


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
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'gray' }} />
                <div style={{ marginLeft: '12px' }}>
                  <Text style={{ fontSize: '14px', fontWeight: 600 }}>Dr. Phat Tai     </Text>
                  <Text style={{ fontSize: '12px', color: 'gray' }}>     Pediatrician</Text>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Row gutter={[16, 24]} style={{ padding: '48px 12px' }}>
          {features.map((feature, index) => (
            <Col key={index} xs={24} sm={12} md={6}>
              <Card
                bordered={false}
                style={{ borderRadius: '20px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
                bodyStyle={{ textAlign: 'center' }}
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

        <Row gutter={[16, 24]} justify="center" style={{ padding: '48px 12px', backgroundColor: '#f0f2f5' }}>
          {statistics.map((stat, index) => (
            <Col key={index} xs={24} sm={12} md={6}>
              <Card
                bordered={false}
                style={{
                  borderRadius: '20px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                  textAlign: 'center',
                }}
              >
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  valueStyle={{ fontSize: '32px', fontWeight: 600 }}
                  prefix={stat.icon}
                />
              </Card>
            </Col>
          ))}
        </Row>
        <DoctorsSection doctors={doctors} loading={loading} error={error} />
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default Homepage;
