import { Layout, Row, Col, Typography, Space, Input } from 'antd';
import { FacebookOutlined, TwitterOutlined, InstagramOutlined, YoutubeOutlined, MailOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';


const { Footer } = Layout;
const { Title, Text } = Typography;

const AppFooter = () => {
  return (
    <Footer
      style={{
        background: 'linear-gradient(90deg, #3b82f6, #a78bfa)',
        color: 'white',
        padding: '60px 50px',
        borderTopLeftRadius: '80px',
        borderTopRightRadius: '80px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Row justify="space-between" gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Title level={4} style={{ color: 'white' }}>👶 Children Growth Tracking</Title>
          <Text style={{ color: '#e0f2fe' }}>
            Track and monitor children's health and development with reliable information from trusted sources.
          </Text>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Title level={5} style={{ color: 'white', borderBottom: '2px solid white', display: 'inline-block', paddingBottom: '5px', marginBottom: '10px' }}>Resources</Title>
            <div className="moving-box"></div>
            <Link to="/about" style={{ color: '#e0f2fe', display: 'block' }}>About Us</Link>
            <Link to="/contact" style={{ color: '#e0f2fe', display: 'block' }}>Contact</Link>
            <Link to="/privacy" style={{ color: '#e0f2fe', display: 'block' }}>Privacy Policy</Link>
            <a href="https://www.who.int/" target="_blank" rel="noopener noreferrer" style={{ color: '#e0f2fe', display: 'block' }}>World Health Organization (WHO)</a>

        </Col>

        <Col xs={24} sm={12} md={6}>
  <Title
    level={5}
    style={{
      color: 'white',
      borderBottom: '2px solid white',
      display: 'inline-block',
      paddingBottom: '5px',
      marginBottom: '30px',
      maxWidth: '150px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      lineHeight: '1.5', // Căn chỉnh chiều cao dòng
      marginLeft: '20px',
    }}
  >
    Newsletter
  </Title>
  <Input
    placeholder="Enter your email id"
    prefix={<MailOutlined style={{ color: '#e0f2fe' }} />}
    style={{
      borderRadius: '20px',
      background: 'transparent',
      border: '1px solid #e0f2fe',
      color: 'white',
      width: '250px', // Giảm chiều rộng
      height: '35px', // Giảm chiều cao hơn
      padding: '0 20px', // Điều chỉnh padding
      marginLeft: '-90px',
    }}
  />
  <Space size="middle" style={{ margin: '20px' }}>
    <FacebookOutlined style={{ fontSize: '20px', color: '#e0f2fe' }} />
    <TwitterOutlined style={{ fontSize: '20px', color: '#e0f2fe' }} />
    <InstagramOutlined style={{ fontSize: '20px', color: '#e0f2fe' }} />
    <YoutubeOutlined style={{ fontSize: '20px', color: '#e0f2fe' }} />
  </Space>
</Col>
      </Row>
      
      <Row justify="center" style={{ marginTop: '20px', borderTop: '1px solid #e0f2fe', paddingTop: '10px' }}>
        <Text style={{ color: '#e0f2fe' }}>Children Growth Tracking System © {new Date().getFullYear()} - Created by Group 4-SE1842</Text>
      </Row>
    </Footer>
  );
};

export default AppFooter;