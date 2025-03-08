import React from 'react';
import { Layout, Typography, Button, Card, Row, Col, Space, Statistic } from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import AppFooter from '../../components/Footer/Footer';
import HomePagePicture from '../../assets/homepaagepic.jpg';
import DoctorImage from '../../assets/doctor.png';
import { SmileOutlined, HeartOutlined, StarOutlined, UserOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const Homepage: React.FC = () => {
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

  const doctors = [
    { name: "Dr. John Doe", specialty: "Pediatrician", image: DoctorImage, description: "Experienced in child health and development." },
    { name: "Dr. Jane Smith", specialty: "Nutritionist", image: DoctorImage, description: "Specializes in child nutrition and dietary planning." },
    { name: "Dr. Alice Johnson", specialty: "Psychologist", image: DoctorImage, description: "Expert in child psychology and behavioral issues." },
    { name: "Dr. Mike Brown", specialty: "General Practitioner", image: DoctorImage, description: "Provides comprehensive health care for children." }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
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
        <div style={{ padding: '64px 0', background: '#fff' }}>
          <Row justify="center" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <Col span={24} style={{ textAlign: 'center', marginBottom: 48 }}>
              <Title level={2}>Our Doctors</Title>
            </Col>
            <Col span={24}>
              <Swiper
                effect="coverflow"
                grabCursor={true}
                slidesPerView={3} // Hiển thị 3 bác sĩ
                spaceBetween={30} // Khoảng cách giữa các bác sĩ
                autoplay={{ delay: 2500, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                modules={[EffectCoverflow, Pagination, Autoplay]}
                className="mySwiper"
                style={{ width: '100%', padding: '50px 0' }}
              >
                {doctors.map((doctor, index) => (
                  <SwiperSlide key={index} style={{ width: '250px', position: 'relative' }}> 
                    <Card 
                      hoverable 
                      style={{
                        textAlign: 'center',
                        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
                        borderRadius: '16px',
                        transition: 'transform 0.3s ease-in-out',
                        backdropFilter: 'blur(10px)', 
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        height: '350px', // Chiều cao của card
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <div style={{ 
                        width: '90px', 
                        height: '90px', 
                        borderRadius: '50%', 
                        overflow: 'hidden', 
                        margin: '0 auto', 
                        marginBottom: '16px' 
                      }}>
                        <img 
                          src={doctor.image} 
                          alt={doctor.name} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      </div>
                      <div style={{ padding: '16px' }}>
                        <Title level={4} style={{ margin: 0 }}>{doctor.name}</Title>
                        <Paragraph style={{ fontWeight: 'bold', color: '#1890ff', margin: 0 }}>{doctor.specialty}</Paragraph>
                        <Paragraph style={{ color: 'rgba(0, 0, 0, 0.65)', margin: 0 }}>{doctor.description}</Paragraph>
                      </div>
                    </Card>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      borderRadius: '16px',
                      backdropFilter: 'blur(20px)', 
                      backgroundColor: 'rgba(255, 255, 255, 0.4)', 
                      zIndex: -1
                    }} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </Col>
          </Row>
        </div>

        {/* Stats Section */}
        <div style={{ background: '#f0f5ff', padding: '64px 0' }}>
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