import React from 'react';
import { Row, Col, Typography, Card, Spin, Alert, Button } from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const DoctorsSection = ({ doctors, loading, error }) => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '64px 0', background: '#e6f7ff', color: '#000' }}>
      <Row
        justify="center"
        align="middle"
        style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}
      >
        {/* Bên trái: Tiêu đề và mô tả */}
        <Col xs={24} md={10} style={{ paddingRight: '40px' }}>
          <Title level={2} style={{ color: '#0050b3' }}>
            Meet Our Expert Doctors
          </Title>
          <Paragraph style={{ color: '#333', fontSize: '16px' }}>
            Our team consists of highly experienced and dedicated professionals ready to provide the
            best healthcare services.
          </Paragraph>
          <Paragraph>
            <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#1890ff' }}>120+</span>{' '}
            Certified Doctors
          </Paragraph>
          <Button 
            type="primary" 
            size="large" 
            style={{ background: '#69c0ff', border: 'none', color: '#fff' }}
            onClick={() => navigate('/doctor')}
          >
            View All Doctors →
          </Button>
        </Col>

        {/* Bên phải: Swiper */}
        <Col xs={24} md={14}>
          {loading && <Spin size="large" style={{ display: 'block', textAlign: 'center' }} />}
          {error && (
            <Alert
              message="Error fetching doctors data"
              description={error}
              type="error"
              showIcon
              style={{ marginBottom: '20px' }}
            />
          )}

          <Swiper
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            loop={true}
            spaceBetween={40} // Tăng khoảng cách giữa các card
            slidesPerView={'auto'}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: false,
            }}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000 }}
            modules={[EffectCoverflow, Pagination, Autoplay]}
            className="mySwiper"
            style={{ width: '100%', padding: '50px 0' }}
          >
            {doctors.map((doctor, index) => (
              <SwiperSlide key={index} style={{ width: '280px', position: 'relative' }}>
                <Card
                  hoverable
                  style={{
                    textAlign: 'center',
                    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
                    borderRadius: '16px',
                    transition: 'transform 0.3s ease-in-out',
                    backdropFilter: 'blur(10px)',
                    backgroundColor: 'rgba(255, 255, 255, 0.6)',
                    height: '370px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#000',
                    border: '1px solid rgba(0, 0, 0, 0.2)'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  onClick={() => navigate(`/doctor/${doctor.userId}`)}
                >
                  <div
                    style={{
                      width: '110px',
                      height: '110px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      marginBottom: '16px',
                      border: '3px solid #69c0ff',
                    }}
                  >
                    <img
                      src={doctor.profileImg}
                      alt={doctor.biography}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ padding: '16px', textAlign: 'center' }}>
                    <Title level={4} style={{ margin: 0, color: '#0050b3' }}>
                      {doctor.biography}
                    </Title>
                    <Paragraph style={{ fontWeight: 'bold', color: '#1890ff', margin: 0 }}>
                      {doctor.specialize}
                    </Paragraph>
                    <Paragraph style={{ color: 'rgba(0, 0, 0, 0.75)', margin: 0 }}>
                      License: {doctor.licenseNumber}
                    </Paragraph>
                  </div>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </Col>
      </Row>
    </div>
  );
};

export default DoctorsSection;
