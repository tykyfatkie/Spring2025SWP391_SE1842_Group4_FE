import React from 'react';
import { Layout, Typography, Row, Col } from 'antd';
import { Link } from 'react-router-dom';

const { Footer } = Layout;
const { Text } = Typography;

const AppFooter: React.FC = () => {
  return (
    <Footer style={{ textAlign: 'center', backgroundColor: '#f0f2f5', padding: '24px 0' }}>
      <Row justify="center" gutter={[16, 16]}>
        <Col>
          <Link to="/about">About Us</Link>
        </Col>
        <Col>
          <Link to="/contact">Contact</Link>
        </Col>
        <Col>
          <Link to="/privacy">Privacy Policy</Link>
        </Col>
      </Row>
      <Row justify="center" style={{ marginTop: '16px' }}>
        <Col>
          <Text type="secondary">
            Children Growth Tracking System ©{new Date().getFullYear()} Created by Group 4-SE1842
          </Text>
        </Col>
      </Row>
    </Footer>
  );
};

export default AppFooter;