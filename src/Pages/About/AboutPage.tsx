import React from 'react';
import { Layout, Typography, Row, Col, Card, Space, Divider, Avatar, Button, Tag } from 'antd';
import AppFooter from '../../components/Footer/Footer';
import { 
  TeamOutlined, 
  SafetyOutlined, 
  RocketOutlined,
  HeartOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  UserOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  BarChartOutlined,
  BulbOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const AboutPage: React.FC = () => {
  const navigate = useNavigate();
  
  const teamMembers = [
    {
      name: "Dr. Đỗ Khánh Huy",
      role: "Chief Medical Officer",
      bio: "Pediatric specialist with over 15 years of experience in child growth and development research.",
      avatar: "../../../src/assets/avatar1.jpg"
    },
    {
      name: "Đỗ Khánh Huy",
      role: "Lead Developer",
      bio: "Experienced software engineer passionate about creating technology that improves healthcare accessibility.",
      avatar: "../../../src/assets/avatar2.jpg"
    },
    {
      name: "Đỗ Khánh Huy",
      role: "Product Manager",
      bio: "Former healthcare administrator with a focus on user experience and healthcare system integration.",
      avatar: "../../../src/assets/avatar3.jpg"
    },
    {
      name: "Đỗ Khánh Huy",
      role: "Child Development Specialist",
      bio: "Child psychologist specializing in developmental milestones and early childhood assessment tools.",
      avatar: "../../../src/assets/avatar3.jpg"
    }
  ];

  const milestones = [
    {
      year: "2020",
      title: "Foundation",
      description: "Started with a team of 5 dedicated professionals focused on child health tracking."
    },
    {
      year: "2021",
      title: "First Platform Launch",
      description: "Released our first version of the growth tracking system with WHO standards integration."
    },
    {
      year: "2022",
      title: "Healthcare Professional Network",
      description: "Expanded our platform to include a network of certified pediatricians and specialists."
    },
    {
      year: "2023",
      title: "National Recognition",
      description: "Received recognition from the Ministry of Health for innovation in child healthcare."
    },
    {
      year: "2024",
      title: "Platform Expansion",
      description: "Expanded features to include comprehensive developmental milestone tracking and AI-assisted growth predictions."
    }
  ];
  
  const values = [
    {
      icon: <SafetyOutlined style={{ fontSize: '32px', color: '#1e3a8a' }} />,
      title: "Privacy & Security",
      description: "We prioritize the security of your data with strict privacy measures and full compliance with healthcare regulations."
    },
    {
      icon: <HeartOutlined style={{ fontSize: '32px', color: '#1e3a8a' }} />,
      title: "Child-Centered Approach",
      description: "Every feature is designed with your child's wellbeing as our top priority, ensuring holistic development tracking."
    },
    {
      icon: <TrophyOutlined style={{ fontSize: '32px', color: '#1e3a8a' }} />,
      title: "Scientific Excellence",
      description: "Our methodologies and standards are based on peer-reviewed research and WHO-approved growth standards."
    },
    {
      icon: <TeamOutlined style={{ fontSize: '32px', color: '#1e3a8a' }} />,
      title: "Community Support",
      description: "We believe in the power of community, connecting parents and healthcare providers for shared insights and support."
    }
  ];
  
  return (
    <Layout style={{ minHeight: '100vh', margin: "-25px", background: 'white' }}>
      <Content>
        {/* Hero Section */}
        <div style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
          padding: '80px 0',
          color: 'white',
          textAlign: 'center',
          borderRadius: '0 0 30px 30px',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '60px',
          marginRight: '50px',
        }}>
          {/* Decorative elements */}
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
          
          <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px', position: 'relative', zIndex: 2 }}>
            <div style={{ 
              display: 'inline-block', 
              padding: '8px 16px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              marginBottom: '16px'
            }}>
              <span style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>OUR STORY</span>
            </div>
            
            <Title level={1} style={{ color: 'white', fontSize: '48px', marginBottom: '24px', fontWeight: 700 }}>
              Dedicated to Child Growth & Development
            </Title>
            
            <Paragraph style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.9)', maxWidth: '700px', margin: '0 auto 32px', lineHeight: 1.6 }}>
              We combine scientific expertise with innovative technology to help parents and healthcare professionals monitor children's growth, ensuring every child reaches their full potential.
            </Paragraph>
            
            <Space size="middle">
              <Button 
                type="primary" 
                size="large" 
                style={{ 
                  borderRadius: '50px', 
                  paddingLeft: '28px', 
                  paddingRight: '28px',
                  height: '52px',
                  background: 'white',
                  color: '#1e3a8a',
                  border: 'none',
                  fontWeight: 600,
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
                }}
                onClick={() => navigate("/contact")}
              >
                Contact Us
              </Button>
              <Button 
                size="large"
                style={{ 
                  borderRadius: '50px', 
                  borderColor: 'rgba(255, 255, 255, 0.3)', 
                  color: 'white',
                  paddingLeft: '28px', 
                  paddingRight: '28px',
                  height: '52px',
                  background: 'transparent',
                  fontWeight: 500,
                }}
                onClick={() => navigate("/register")}
              >
                Join Us
              </Button>
            </Space>
          </div>
        </div>
        
        {/* Our Mission and Vision Section */}
        <Row justify="center" style={{ maxWidth: 1200, margin: '0 auto 80px', padding: '0 24px' }}>
          <Col span={24} style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ 
              display: 'inline-block', 
              padding: '8px 16px',
              background: 'rgba(30, 58, 138, 0.1)',
              borderRadius: '20px',
              marginBottom: '16px'
            }}>
              <span style={{ color: '#1e3a8a', fontWeight: '600', fontSize: '14px' }}>OUR PURPOSE</span>
            </div>
            <Title level={2} style={{ color: '#1e3a8a', marginBottom: '16px', fontSize: '36px' }}>
              Mission & Vision
            </Title>
            <Paragraph style={{ color: '#4b5563', fontSize: '18px', maxWidth: '700px', margin: '0 auto' }}>
              Guided by scientific principles and a passion for child welfare
            </Paragraph>
          </Col>
          
          <Col xs={24} lg={12} style={{ padding: '16px' }}>
            <Card 
              style={{ 
                height: '100%', 
                borderRadius: '16px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
                border: 'none',
              }} 
              bodyStyle={{ padding: '32px' }}
            >
              <div style={{ 
                width: '70px', 
                height: '70px', 
                borderRadius: '50%', 
                background: 'rgba(30, 58, 138, 0.1)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginBottom: '24px'
              }}>
                <RocketOutlined style={{ fontSize: '32px', color: '#1e3a8a' }} />
              </div>
              
              <Title level={3} style={{ color: '#1e3a8a', marginBottom: '16px', fontSize: '24px' }}>
                Our Mission
              </Title>
              
              <Paragraph style={{ color: '#4b5563', fontSize: '16px', lineHeight: '1.8', marginBottom: '24px' }}>
                To empower parents and healthcare professionals with scientifically accurate tools and resources for tracking child growth and development, ensuring every child receives the attention and care needed for optimal health outcomes.
              </Paragraph>
              
              <Space direction="vertical" size="middle" style={{ width: '100%', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircleOutlined style={{ color: '#3b82f6', marginRight: '12px' }} />
                  <Text style={{ color: '#4b5563' }}>Provide accurate growth tracking tools</Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircleOutlined style={{ color: '#3b82f6', marginRight: '12px' }} />
                  <Text style={{ color: '#4b5563' }}>Connect parents with healthcare experts</Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircleOutlined style={{ color: '#3b82f6', marginRight: '12px' }} />
                  <Text style={{ color: '#4b5563' }}>Educate on healthy developmental milestones</Text>
                </div>
              </Space>
            </Card>
          </Col>
          
          <Col xs={24} lg={12} style={{ padding: '16px' }}>
            <Card 
              style={{ 
                height: '100%', 
                borderRadius: '16px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
                border: 'none',
              }} 
              bodyStyle={{ padding: '32px' }}
            >
              <div style={{ 
                width: '70px', 
                height: '70px', 
                borderRadius: '50%', 
                background: 'rgba(30, 58, 138, 0.1)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginBottom: '24px'
              }}>
                <BulbOutlined style={{ fontSize: '32px', color: '#1e3a8a' }} />
              </div>
              
              <Title level={3} style={{ color: '#1e3a8a', marginBottom: '16px', fontSize: '24px' }}>
                Our Vision
              </Title>
              
              <Paragraph style={{ color: '#4b5563', fontSize: '16px', lineHeight: '1.8', marginBottom: '24px' }}>
                To become the global leader in child growth monitoring technology, creating a world where every child's development is properly tracked, understood, and optimized through data-driven insights and professional guidance.
              </Paragraph>
              
              <Space direction="vertical" size="middle" style={{ width: '100%', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircleOutlined style={{ color: '#3b82f6', marginRight: '12px' }} />
                  <Text style={{ color: '#4b5563' }}>Global standard for growth tracking</Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircleOutlined style={{ color: '#3b82f6', marginRight: '12px' }} />
                  <Text style={{ color: '#4b5563' }}>Accessible to families worldwide</Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircleOutlined style={{ color: '#3b82f6', marginRight: '12px' }} />
                  <Text style={{ color: '#4b5563' }}>Advance child health through data insights</Text>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
        
        {/* Core Values Section */}
        <div style={{ 
          padding: '80px 0', 
          background: '#f8fafc',
          marginBottom: '80px',
          borderRadius: '30px',
          marginRight: '50px'
        }}>
          <Row justify="center" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <Col span={24} style={{ textAlign: 'center', marginBottom: '40px' }}>
              <div style={{ 
                display: 'inline-block', 
                padding: '8px 16px',
                background: 'rgba(30, 58, 138, 0.1)',
                borderRadius: '20px',
                marginBottom: '16px'
              }}>
                <span style={{ color: '#1e3a8a', fontWeight: '600', fontSize: '14px' }}>WHAT DRIVES US</span>
              </div>
              <Title level={2} style={{ color: '#1e3a8a', marginBottom: '16px', fontSize: '36px' }}>
                Our Core Values
              </Title>
              <Paragraph style={{ color: '#4b5563', fontSize: '18px', maxWidth: '700px', margin: '0 auto' }}>
                The principles that guide our decisions and shape our platform
              </Paragraph>
            </Col>
            
            <Row gutter={[24, 24]} style={{ width: '100%' }}>
              {values.map((value, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <Card 
                    hoverable 
                    style={{ 
                      height: '100%', 
                      borderRadius: '16px',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
                      border: 'none',
                    }} 
                    bodyStyle={{ padding: '32px 24px' }}
                  >
                    <div style={{ 
                      marginBottom: '24px',
                      width: '70px',
                      height: '70px',
                      borderRadius: '50%',
                      background: 'rgba(30, 58, 138, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {value.icon}
                    </div>
                    
                    <Title level={4} style={{ color: '#1e3a8a', marginBottom: '16px', fontSize: '20px' }}>
                      {value.title}
                    </Title>
                    
                    <Paragraph style={{ color: '#4b5563', fontSize: '15px', lineHeight: '1.6' }}>
                      {value.description}
                    </Paragraph>
                  </Card>
                </Col>
              ))}
            </Row>
          </Row>
        </div>
        
        {/* Our Team Section */}
        <Row justify="center" style={{ maxWidth: 1200, margin: '0 auto 80px', padding: '0 24px' }}>
          <Col span={24} style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ 
              display: 'inline-block', 
              padding: '8px 16px',
              background: 'rgba(30, 58, 138, 0.1)',
              borderRadius: '20px',
              marginBottom: '16px'
            }}>
              <span style={{ color: '#1e3a8a', fontWeight: '600', fontSize: '14px' }}>OUR EXPERTS</span>
            </div>
            <Title level={2} style={{ color: '#1e3a8a', marginBottom: '16px', fontSize: '36px' }}>
              Meet Our Team
            </Title>
            <Paragraph style={{ color: '#4b5563', fontSize: '18px', maxWidth: '700px', margin: '0 auto' }}>
              Dedicated professionals committed to improving child health outcomes
            </Paragraph>
          </Col>
          
          <Row gutter={[24, 24]} style={{ width: '100%' }}>
            {teamMembers.map((member, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card 
                  hoverable 
                  style={{ 
                    height: '100%', 
                    borderRadius: '16px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
                    border: 'none',
                    overflow: 'hidden'
                  }} 
                  bodyStyle={{ padding: '0' }}
                >
                  <div style={{ position: 'relative' }}>
                    <div style={{ 
                      height: '120px', 
                      background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                      position: 'relative'
                    }} />
                    <Avatar 
                      size={100}
                      icon={<UserOutlined />}
                      src={member.avatar}
                      style={{ 
                        position: 'absolute', 
                        bottom: '-50px', 
                        left: '50%', 
                        transform: 'translateX(-50%)',
                        border: '4px solid white',
                        background: '#1e3a8a'
                      }}
                    />
                  </div>
                  
                  <div style={{ padding: '60px 24px 24px', textAlign: 'center' }}>
                    <Title level={4} style={{ color: '#1e3a8a', marginBottom: '8px', fontSize: '20px' }}>
                      {member.name}
                    </Title>
                    
                    <Tag color="#e6f2ff" style={{ color: '#1e3a8a', marginBottom: '16px', border: 'none' }}>
                      {member.role}
                    </Tag>
                    
                    <Paragraph style={{ color: '#4b5563', fontSize: '14px', lineHeight: '1.6' }}>
                      {member.bio}
                    </Paragraph>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Row>
        
        {/* Our Journey Timeline */}
        <div style={{ 
          padding: '80px 0', 
          background: 'linear-gradient(to bottom, #f0f7ff, #e6f0fd)',
          marginBottom: '80px',
          borderRadius: '30px',
          marginRight: '50px'
        }}>
          <Row justify="center" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <Col span={24} style={{ textAlign: 'center', marginBottom: '60px' }}>
              <div style={{ 
                display: 'inline-block', 
                padding: '8px 16px',
                background: 'rgba(30, 58, 138, 0.1)',
                borderRadius: '20px',
                marginBottom: '16px'
              }}>
                <span style={{ color: '#1e3a8a', fontWeight: '600', fontSize: '14px' }}>OUR JOURNEY</span>
              </div>
              <Title level={2} style={{ color: '#1e3a8a', marginBottom: '16px', fontSize: '36px' }}>
                Company Milestones
              </Title>
              <Paragraph style={{ color: '#4b5563', fontSize: '18px', maxWidth: '700px', margin: '0 auto' }}>
                A look at our growth and achievements over the years
              </Paragraph>
            </Col>
            
            <Col span={24}>
              <div style={{ position: 'relative' }}>
                {/* Vertical line */}
                <div style={{ 
                  position: 'absolute', 
                  left: '50%', 
                  top: 0, 
                  bottom: 0, 
                  width: '2px', 
                  background: '#cbd5e1',
                  transform: 'translateX(-50%)',
                  zIndex: 1
                }} />
                
                {milestones.map((milestone, index) => (
  <Row key={index} style={{ marginBottom: index === milestones.length - 1 ? 0 : '64px', position: 'relative', zIndex: 2 }}>
    {/* Left side - for even items (0, 2, 4) */}
    <Col xs={0} md={11} style={{ 
      padding: '16px',
      textAlign: 'right',
      display: index % 2 === 0 ? 'block' : 'none',
    }}>
      {index % 2 === 0 && (
        <>
          <Title level={4} style={{ color: '#1e3a8a', marginBottom: '8px', fontSize: '20px' }}>
            {milestone.title}
          </Title>
          
          <Paragraph style={{ color: '#4b5563', fontSize: '15px', lineHeight: '1.6', margin: 0 }}>
            {milestone.description}
          </Paragraph>
        </>
      )}
    </Col>
    
    {/* Center column with dot and year - FIXED VERSION */}
    <Col xs={24} md={2} style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'flex-start',
      position: 'relative',
      height: '150px'
    }}>
      {/* Dot */}
      <div style={{ 
        width: '20px', 
        height: '20px', 
        borderRadius: '50%', 
        background: '#1e3a8a',
        border: '4px solid white',
        boxShadow: '0 0 0 2px #1e3a8a',
        position: 'absolute',
        top: '0px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 2
      }} />
      
      {/* Year circle */}
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: 'white',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
        border: '2px solid #1e3a8a',
        position: 'absolute',
        top: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 2
      }}>
        <Text style={{ color: '#1e3a8a', fontSize: '18px', fontWeight: 600 }}>
          {milestone.year}
        </Text>
      </div>
    </Col>
    
    {/* Right side - for odd items (1, 3, 5) */}
    <Col xs={0} md={11} style={{ 
      padding: '16px',
      textAlign: 'left',
      display: index % 2 === 1 ? 'block' : 'none'
      // Removed the marginLeft: '500px' that could cause alignment issues
    }}>
      {index % 2 === 1 && (
        <>
          <Title level={4} style={{ color: '#1e3a8a', marginBottom: '8px', fontSize: '20px' }}>
            {milestone.title}
          </Title>
          
          <Paragraph style={{ color: '#4b5563', fontSize: '15px', lineHeight: '1.6', margin: 0 }}>
            {milestone.description}
          </Paragraph>
        </>
      )}
    </Col>
    
    {/* Mobile view - centered content */}
    <Col xs={24} md={0} style={{ 
      padding: '16px',
      textAlign: 'center',
      order: index % 2 === 0 ? 1 : 3
    }}>
      <Title level={4} style={{ color: '#1e3a8a', marginBottom: '8px', fontSize: '20px' }}>
        {milestone.title}
      </Title>
      
      <Paragraph style={{ color: '#4b5563', fontSize: '15px', lineHeight: '1.6', margin: 0 }}>
        {milestone.description}
      </Paragraph>
    </Col>
  </Row>
))}
              </div>
            </Col>
          </Row>
        </div>
        
        {/* CTA Section */}
        <div style={{ 
          padding: '80px 24px', 
          background: '#1e3a8a', 
          borderRadius: '30px',
          margin: '0 24px 60px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Decorative elements */}
          <div style={{
            position: 'absolute',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
            top: '-100px',
            right: '-100px',
          }} />
          <div style={{
            position: 'absolute',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
            bottom: '-50px',
            left: '100px',
          }} />
          
          <Row justify="center" align="middle" style={{ maxWidth: 1000, margin: '0 auto', position: 'relative', zIndex: 2 }}>
            <Col xs={24} md={16} style={{ textAlign: 'center', marginBottom: { xs: '32px', md: '0' } }}>
              <Title level={2} style={{ color: 'white', marginBottom: '16px', fontSize: '36px', fontWeight: 700 }}>
                Join Our Mission
              </Title>
              <Paragraph style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '18px', marginBottom: '0' }}>
                Be part of our journey to revolutionize child growth tracking and improve health outcomes for children worldwide.
              </Paragraph>
            </Col>
            <Col xs={24} md={8} style={{ textAlign: 'center' }}>
              <Button 
                type="primary" 
                size="large" 
                onClick={() => navigate("/contact")}
                style={{
                  height: '52px',
                  padding: '0 32px',
                  fontSize: '16px',
                  fontWeight: '600',
                  borderRadius: '8px',
                  background: 'white',
                  color: '#1e3a8a',
                  border: 'none',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                }}
              >
                Contact Us
              </Button>
            </Col>
          </Row>
        </div>
      </Content>

      {/* Footer */}
      <AppFooter />
    </Layout>
  );
};

export default AboutPage;