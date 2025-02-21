import React from 'react';
import { Layout, Typography, Button, Card, Row, Col, Statistic, Space } from 'antd';
import { HeartOutlined, LineChartOutlined, UserOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import GuestHeader from '../../components/Header/GuestHeader';
import AppFooter from '../../components/Footer/Footer';
import HomePagePicture from '../../assets/homepaagepic.jpg';
import { Link } from 'react-router-dom';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const Homepage: React.FC = () => {
  const features = [
    {
      icon: <LineChartOutlined style={{ fontSize: '48px', color: '#1890ff' }} />,
      title: "Track Weight & Height",
      description: "Record and monitor children's physical development over time.",
      link: "/guestbmi"
    },
    {
      icon: <UserOutlined style={{ fontSize: '48px', color: '#52c41a' }} />,
      title: "Growth Index",
      description: "Assess BMI and compare it with WHO standards."
    },
    {
      icon: <MedicineBoxOutlined style={{ fontSize: '48px', color: '#722ed1' }} />,
      title: "Intellectual Development",
      description: "Monitor important developmental milestones of children."
    },
    {
      icon: <HeartOutlined style={{ fontSize: '48px', color: '#f5222d' }} />,
      title: "Vaccination Schedule",
      description: "Remind parents about vaccination appointments and regular health check-ups."
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <GuestHeader />

      {/* Hero Section */}
      <Content>
        <div style={{ background: 'linear-gradient(to right, #e6f7ff, #f0f5ff)', padding: '64px 0' }}>
          <Row justify="center" align="middle" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <Col xs={24} md={12}>
              <Title level={1} style={{ marginBottom: 24 }}>
                Smart Child Growth Tracking System
              </Title>
              <Paragraph style={{ fontSize: 16, marginBottom: 32 }}>
                  Track your child's development scientifically and accurately.
                  Trusted by thousands of parents and healthcare professionals.
              </Paragraph>
              <Space size="middle">
                <Button type="primary" size="large">
                  Get Started
                </Button>
                <Button size="large">
                  Learn More
                </Button>
              </Space>
            </Col>
            <Col xs={24} md={12} style={{ textAlign: 'center', paddingLeft: '90px' }}>
              <img 
                src={HomePagePicture}
                alt="Baby care illustration"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
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
                <Link to={feature.link || '#'}> {/* Thêm liên kết cho Track Weight & Height */}
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
                </Link>
              </Col>
            ))}
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

      <AppFooter />
    </Layout>
  );
};

export default Homepage;