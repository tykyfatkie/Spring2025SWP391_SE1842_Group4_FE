// path/to/DoctorPage.tsx
import React from 'react';
import { Layout, Typography, Row, Col, Card, Menu } from 'antd';
import AppFooter from "../../components/Footer/Footer";
import GuestHeader from "../../components/Header/GuestHeader";
import doctorImage from "../../assets/doctor.png";
import { Link } from 'react-router-dom';

const { Content } = Layout;
const { Title } = Typography;

const players = [
  { id: 1, name: "A", price: "86,000 đ", description: "A", rating: 4.9, reviews: 100, image: doctorImage },
  { id: 2, name: "B", price: "60,000 đ", description: "B", rating: 4.9, reviews: 250, image: doctorImage },
  { id: 3, name: "C", price: "79,000 đ", description: "C", rating: 5, reviews: 52, image: doctorImage },
  { id: 4, name: "D", price: "89,000 đ", description: "D", rating: 5, reviews: 137, image: doctorImage },
];

const DoctorPage: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh', margin: '-25px', width: '1420px' }}>
      <GuestHeader />
      <Content style={{ padding: '0 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <Row gutter={16}>
          <Col span={18}>
            <Title level={2} style={{ marginBottom: '20px', color: '#0b4778' }}>Doctor</Title>
            <Row gutter={16}>
              {players.map((player, index) => (
                <Col span={6} key={index}>
                  <Link to={`/doctor/${player.id}`}>
                  <div className="card" style={{ perspective: '1000px' }}>
                    <div className="wrapper" style={{ position: 'relative', overflow: 'visible' }}>
                      <Card
                        hoverable
                        cover={<img alt={player.name} src={player.image} style={{ transition: 'transform 0.5s', position: 'relative', zIndex: 1 }} />}
                        style={{ marginBottom: '20px', transition: 'transform 0.5s, box-shadow 0.5s' }}
                        onMouseEnter={(e) => {
                          const card = e.currentTarget;
                          card.style.transform = 'translateY(30px) rotateX(10deg)';
                          card.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.3)';
                          const img = card.querySelector('img');
                          if (img) img.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                          const card = e.currentTarget;
                          card.style.transform = 'none';
                          card.style.boxShadow = 'none';
                          const img = card.querySelector('img');
                          if (img) img.style.transform = 'none';
                        }}
                      >
                        <Card.Meta
                          title={<div className="title">{player.name}</div>}
                          description={
                            <>
                              <p>{player.price}</p>
                              <p>{player.description}</p>
                              <p>⭐ {player.rating} ({player.reviews} reviews)</p>
                            </>
                          }
                        />
                      </Card>
                    </div>
                  </div>
                  </Link>
                </Col>
              ))}
            </Row>
          </Col>
          <Col span={6} style={{ paddingLeft: '20px' }}>
            <Card title="Danh mục" style={{ marginTop: '80px' }}>
              <Menu>
                <Menu.Item key="1"><a href="/chuyen-khoa">Bác sĩ chuyên khoa</a></Menu.Item>
                <Menu.Item key="2"><a href="/tu-van">Tư vấn sức khỏe</a></Menu.Item>
                <Menu.Item key="3"><a href="/khach-hang">Khách hàng</a></Menu.Item>
                <Menu.Item key="4"><a href="/tin-tuc">Tin tức y tế</a></Menu.Item>
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