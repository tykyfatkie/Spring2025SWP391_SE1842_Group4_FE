import { useEffect, useState } from 'react';
import { Row, Col, Typography, Card, Spin, Alert, Button } from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import { useNavigate } from 'react-router-dom';

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
  user?: {
    name: string;
  };
}

const DoctorsSection = ({ doctors, loading, error }: { doctors: Doctor[], loading: boolean, error: string | null }) => {
  const [doctorsWithNames, setDoctorsWithNames] = useState<Doctor[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctorNames = async () => {
      try {
        const updatedDoctors = await Promise.all(doctors.map(async (doctor) => {
          if (!doctor.user?.name) {
            const profileResponse = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/doctors/doctorprofile/${doctor.userId}`);
            if (profileResponse.ok) {
              const profileData = await profileResponse.json();
              if (profileData.data && Array.isArray(profileData.data) && profileData.data.length > 0) {
                doctor.user = { name: profileData.data[0].user?.name || "Bác sĩ chưa cập nhật tên" };
              }
            }
          }
          return doctor;
        }));

        setDoctorsWithNames(updatedDoctors);
      } catch (error) {
        console.error("Error fetching doctor names:", error);
      }
    };

    if (doctors.length > 0) {
      fetchDoctorNames();
    }
  }, [doctors]);

  // Styled button like Starbucks but keeping the original colors
  const buttonStyle = {
    height: '50px',
    borderRadius: '30px',
    border: '1px solid #0050b3',
    background: '#0050b3',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 600,
    padding: '0 25px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    marginTop: '20px',
    fontFamily: 'SoDoSans, sans-serif',
  };

  return (
    <div style={{ padding: '90px 0', background: '#e6f7ff', color: '#000' }}>
      <Row justify="center" align="middle" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <Col xs={24} md={10} style={{ paddingRight: '40px' }}>
          {/* Styled text section similar to Starbucks ad but with original colors */}
          <div style={{ textAlign: 'left', marginBottom: '30px' }}>
            <Title level={2} style={{ 
              color: '#0050b3', 
              fontSize: '36px', 
              fontWeight: 700, 
              marginBottom: '24px',
              fontFamily: 'SoDoSans, sans-serif' 
            }}>
              Meet Our Expert Doctors
            </Title>
            
            <Paragraph style={{ 
              color: '#333', 
              fontSize: '18px', 
              lineHeight: '1.6', 
              marginBottom: '30px',
              fontFamily: 'SoDoSans, sans-serif'
            }}>
              Our team consists of highly experienced and dedicated professionals ready to provide the best healthcare services.
            </Paragraph>
            
            <Button 
              type="primary" 
              size="large" 
              onClick={() => navigate('/doctor')}
              style={buttonStyle}
            >
              View All Doctors
            </Button>
          </div>
        </Col>

        <Col xs={24} md={14}>
          {loading && <Spin size="large" style={{ display: 'block', textAlign: 'center' }} />}
          {error && <Alert message="Error fetching doctors data" description={error} type="error" showIcon />}

          <Swiper
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            loop={true}
            spaceBetween={40}
            slidesPerView={'auto'}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000 }}
          >
            {doctorsWithNames.map((doctor, index) => (
              <SwiperSlide key={index} style={{ width: '280px', position: 'relative' }}>
                <Card
                  hoverable
                  onClick={() => navigate(`/doctor/${doctor.userId}`)}
                  style={{ textAlign: 'center' }}
                >
                  <div>
                    <img
                      src={doctor.profileImg || "https://via.placeholder.com/110"}
                      alt={doctor.user?.name || "Doctor Image"}
                      style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                    />
                  </div>
                  <Card.Meta
                    title={<div>{doctor.user?.name || "Bác sĩ chưa cập nhật tên"}</div>}
                    description={<p>Chuyên môn: {doctor.specialize || "Không có chuyên môn"}</p>}
                  />
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