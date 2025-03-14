import React, { useEffect, useState } from 'react';
import { Row, Col, Typography, Card, Spin, Alert, Button } from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules';
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
  const [doctorsWithNames, setDoctorsWithNames] = useState<Doctor[]>([]); // New state to store doctors with names
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

        setDoctorsWithNames(updatedDoctors); // Update the doctorsWithNames state with updated data
      } catch (error) {
        console.error("Error fetching doctor names:", error);
      }
    };

    if (doctors.length > 0) {
      fetchDoctorNames(); // Fetch names only when doctors data is available
    }
  }, [doctors]); // Re-run this effect when the doctors list changes

  return (
    <div style={{ padding: '64px 0', background: '#e6f7ff', color: '#000' }}>
      <Row justify="center" align="middle" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <Col xs={24} md={10} style={{ paddingRight: '40px' }}>
          <Title level={2} style={{ color: '#0050b3' }}>Meet Our Expert Doctors</Title>
          <Paragraph style={{ color: '#333', fontSize: '16px' }}>
            Our team consists of highly experienced and dedicated professionals ready to provide the best healthcare services.
          </Paragraph>
          <Button 
            type="primary" 
            size="large" 
            onClick={() => navigate('/doctor')}
          >
            View All Doctors →
          </Button>
        </Col>

        <Col xs={24} md={14}>
          {loading && <Spin size="large" style={{ display: 'block', textAlign: 'center' }} />}
          {error && <Alert message="Error fetching doctors data" description={error} type="error" showIcon />}

          {/* Swiper will render only once doctorsWithNames are updated */}
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
