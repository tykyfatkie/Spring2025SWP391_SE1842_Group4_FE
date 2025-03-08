import React, { useEffect, useState } from 'react';
import { Layout, Typography, Row, Col, Card, Menu, Spin, Alert } from 'antd';
import AppFooter from "../../components/Footer/Footer";
import { Link } from 'react-router-dom';

const { Content } = Layout;
const { Title } = Typography;

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

const DoctorPage: React.FC = () => {
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

        setDoctors(data.data);
      } catch (error: any) {
        console.error("Fetch Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

return (
  <Layout style={{ minHeight: '100vh', margin: '-25px' }}>
    <Content style={{ padding: '0 10px', maxWidth: '1300px', marginLeft: '100px', marginTop: '70px' }}>
      <Row gutter={16} style={{ display: 'flex' }}>
        {/* Cột chứa danh sách bác sĩ */}
        <Col span={18} style={{ display: 'flex', flexDirection: 'column' }}>
          <Title level={2} style={{ marginBottom: '10px', color: '#0b4778',  }}>Doctor</Title>
          {loading && <Spin size="large" style={{ display: 'block', textAlign: 'center' }} />}
          {error && (
            <Alert
              message="Lỗi khi lấy dữ liệu bác sĩ"
              description={error}
              type="error"
              showIcon
              style={{ marginBottom: '20px' }}
            />
          )}
          <Row gutter={[16, 16]} style={{ flexWrap: 'wrap' }}>
            {!loading && !error && doctors.map((doctor) => (
              <Col span={8} key={doctor.id}>
                <Link to={`/doctor/${doctor.id}`}>
                  <Card
                    hoverable
                    cover={<img alt={doctor.biography} src={doctor.profileImg} style={{ transition: 'transform 0.5s' }} />}
                    style={{ marginBottom: '20px', marginTop: '20px', transition: 'transform 0.5s, box-shadow 0.5s' }}
                    onMouseEnter={(e) => {
                      const card = e.currentTarget;
                      card.style.transform = 'translateY(-10px)';
                      card.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      const card = e.currentTarget;
                      card.style.transform = 'none';
                      card.style.boxShadow = 'none';
                    }}
                  >
                    <Card.Meta
                      title={<div className="title">{doctor.biography}</div>}
                      description={
                        <>
                          <p>Chuyên môn: {doctor.specialize}</p>
                          <p>Giấy phép: {doctor.licenseNumber}</p>
                        </>
                      }
                    />
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </Col>

        {/* Cột chứa danh mục */}
        <Col span={6} style={{ paddingLeft: '20px' }}>
          <Card title="Danh mục" style={{ position: 'sticky', top: '80px', marginLeft: '40px', paddingLeft: '10px', marginTop: '60px' }}>
            <Menu>
              <Menu.Item key="1"><Link to="/chuyen-khoa">Bác sĩ chuyên khoa</Link></Menu.Item>
              <Menu.Item key="2"><Link to="/tu-van">Tư vấn sức khỏe</Link></Menu.Item>
              <Menu.Item key="3"><Link to="/khach-hang">Khách hàng</Link></Menu.Item>
              <Menu.Item key="4"><Link to="/tin-tuc">Tin tức y tế</Link></Menu.Item>
            </Menu>
          </Card>
        </Col>
      </Row>
    </Content>
    <AppFooter />
  </Layout>
);

};

export default DoctorPage;