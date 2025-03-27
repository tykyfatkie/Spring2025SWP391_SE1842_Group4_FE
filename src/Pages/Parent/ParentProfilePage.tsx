import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Typography, 
  Row, 
  Col, 
  Card, 
  Avatar, 
  Button, 
  Tag, 
  Progress, 
  Rate} from 'antd';
import { 
  UserOutlined, 
  CrownOutlined, 
  PlusOutlined,
  EditOutlined,
  CheckCircleOutlined,
  HeartOutlined,
  ArrowRightOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import AppFooter from "../../components/Footer/Footer";
import doctorImage from "../../assets/doctor.png";
import { Link } from 'react-router-dom';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const ParentProfilePage: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [childData, setChildData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token || token.split('.').length !== 3) {
          setLoading(false);
          return;
        }

        const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/users/profile`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
          if (response.status === 401) {
            return;
          }
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setUserData(data.data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    const fetchChildData = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          return;
        }

        const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/children/getChildByToken`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch child data');
        }

        const data = await response.json();
        if (Array.isArray(data.data) && data.data.length > 0) {
          setChildData(data.data[0]); // Get first child only
        } else {
          setChildData(null);
        }
      } catch (error) {
      }
    };

    const fetchDoctors = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/doctors/all`);
        if (!response.ok) {
          throw new Error('Failed to fetch doctors');
        }
        const data = await response.json();
        if (!Array.isArray(data.data)) {
          throw new Error('Invalid API response: Expected an array');
        }
        const updatedDoctors = await Promise.all(data.data.map(async (doctor: { userId: any; user: { name: any; }; }) => {
          try {
            const profileResponse = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/doctors/doctorprofile/${doctor.userId}`);
            if (profileResponse.ok) {
              const profileData = await profileResponse.json();
              if (profileData.data && Array.isArray(profileData.data) && profileData.data.length > 0) {
                doctor.user = { name: profileData.data[0].user?.name || "Doctor has not updated " };
              }
            }
          } catch (profileError) {
          }
          return doctor;
        }));

        setDoctors(updatedDoctors);
      } catch (error) {
      }
    };

    fetchUserData();
    fetchChildData();
    fetchDoctors();
  }, []);

  const calculateAge = (doB: string) => {
    const birthDate = new Date(doB);
    const today = new Date();
    
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
  
    if (months < 0) {
      years--;
      months += 12;
    }
  
    return `${years} years ${months} months`;
  };

  const getBmiStatus = (bmi: number) => {
    if (!bmi) return { color: '#1e3a8a', status: 'normal', text: 'No data' };
    
    if (bmi < 18.5) return { color: '#3b82f6', status: 'exception', text: 'Underweight' };
    if (bmi < 25) return { color: '#10b981', status: 'success', text: 'Normal' };
    if (bmi < 30) return { color: '#f59e0b', status: 'active', text: 'Overweight' };
    return { color: '#ef4444', status: 'exception', text: 'Obese' };
  };

  return (
    <Layout style={{ minHeight: '100vh', margin: '-25px', background: 'white' }}>
      <Content style={{ padding: '40px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Hero section with user profile */}
        <div 
          style={{ 
            padding: '40px', 
            background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', 
            borderRadius: '20px', 
            marginBottom: '40px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(30, 58, 138, 0.2)'
          }}
        >
          {/* Decorative elements */}
          <div style={{
            position: 'absolute',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
            top: '-100px',
            right: '-100px',
            zIndex: 0
          }} />
          <div style={{
            position: 'absolute',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
            bottom: '-50px',
            left: '50px',
            zIndex: 0
          }} />

          <Row gutter={[24, 24]} align="middle" style={{ position: 'relative', zIndex: 1 }}>
            <Col xs={24} md={3}>
              <div style={{ 
                width: '100px', 
                height: '100px', 
                background: 'white', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)'
              }}>
                <Avatar size={90} icon={<UserOutlined />} style={{ background: '#e6f0fd', color: '#1e3a8a' }} />
              </div>
            </Col>
            <Col xs={24} md={13}>
              <div style={{ color: 'white' }}>
                <Title level={2} style={{ color: 'white', margin: 0, display: 'flex', alignItems: 'center' }}>
                  {userData ? userData.name : "Loading..."} 
                  <Link to="/manage-profile" style={{ marginLeft: '12px', fontSize: '18px', color: 'white' }}>
                    <EditOutlined />
                  </Link>
                </Title>
                <div style={{ display: 'flex', marginTop: '12px' }}>
                  <Tag 
                    color="#f0f7ff" 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      padding: '4px 12px', 
                      borderRadius: '20px',
                      color: '#1e3a8a',
                      fontWeight: 600
                    }}
                  >
                    <CrownOutlined style={{ marginRight: '6px', color: '#fbbf24' }} /> Premium Member
                  </Tag>
                </div>
              </div>
            </Col>
            <Col xs={24} md={8} style={{ textAlign: 'right' }}>
              <Button 
                type="primary" 
                size="large"
                style={{ 
                  borderRadius: '50px', 
                  background: 'white', 
                  color: '#1e3a8a',
                  border: 'none',
                  height: '44px',
                  fontWeight: 600,
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                  paddingLeft: '24px',
                  paddingRight: '24px'
                }}
              >
                Track New Growth Data <ArrowRightOutlined style={{ marginLeft: '6px' }} />
              </Button>
            </Col>
          </Row>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              {/* Child Information */}
              <Card 
                style={{ 
                  marginBottom: '24px', 
                  borderRadius: '16px', 
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                  border: 'none'
                }}
                title={
                  <div style={{ padding: '8px 0' }}>
                    <div style={{ 
                      display: 'inline-block', 
                      padding: '6px 14px',
                      background: 'rgba(30, 58, 138, 0.1)',
                      borderRadius: '20px',
                      marginBottom: '8px'
                    }}>
                      <span style={{ color: '#1e3a8a', fontWeight: '600', fontSize: '13px' }}>CHILD DATA</span>
                    </div>
                    <Title level={4} style={{ margin: '8px 0 0 0', color: '#1e3a8a' }}>Child Information</Title>
                  </div>
                }
                extra={
                  <Button 
                    type="link" 
                    icon={<EditOutlined />}
                    style={{ color: '#1e3a8a', fontWeight: 500 }}
                  >
                    Update
                  </Button>
                }
                bodyStyle={{ padding: '24px' }}
              >
                {childData ? (
                  <Row gutter={[24, 24]}>
                    <Col xs={24} md={12}>
                      <div style={{ 
                        background: '#f8fafc', 
                        borderRadius: '16px', 
                        padding: '24px',
                        height: '100%'
                      }}>
                        <Title level={4} style={{ marginTop: 0, marginBottom: '16px', color: '#1e3a8a' }}>{childData.name}</Title>
                        
                        <div style={{ marginBottom: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                            <div style={{ 
                              width: '32px', 
                              height: '32px', 
                              borderRadius: '50%', 
                              background: 'rgba(30, 58, 138, 0.1)', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              marginRight: '12px'
                            }}>
                              <CalendarOutlined style={{ color: '#1e3a8a' }} />
                            </div>
                            <div>
                              <Text type="secondary" style={{ display: 'block', fontSize: '13px' }}>Age</Text>
                              <Text strong>{childData.doB ? calculateAge(childData.doB) : "N/A"}</Text>
                            </div>
                          </div>
                          
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                            <div style={{ 
                              width: '32px', 
                              height: '32px', 
                              borderRadius: '50%', 
                              background: 'rgba(30, 58, 138, 0.1)', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              marginRight: '12px'
                            }}>
                              <UserOutlined style={{ color: '#1e3a8a' }} />
                            </div>
                            <div>
                              <Text type="secondary" style={{ display: 'block', fontSize: '13px' }}>Gender</Text>
                              <Text strong>{childData.gender === 0 ? "Male" : "Female"}</Text>
                            </div>
                          </div>
                          
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ 
                              width: '32px', 
                              height: '32px', 
                              borderRadius: '50%', 
                              background: 'rgba(30, 58, 138, 0.1)', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              marginRight: '12px'
                            }}>
                              <HeartOutlined style={{ color: '#1e3a8a' }} />
                            </div>
                            <div>
                              <Text type="secondary" style={{ display: 'block', fontSize: '13px' }}>Last Checkup</Text>
                              <Text strong>{childData.lastCheckup || "N/A"}</Text>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>
                    
                    <Col xs={24} md={12}>
                      <div style={{ 
                        background: '#f8fafc', 
                        borderRadius: '16px', 
                        padding: '24px',
                        height: '100%'
                      }}>
                        <Title level={4} style={{ marginTop: 0, marginBottom: '24px', color: '#1e3a8a' }}>
                          Growth Metrics
                        </Title>
                        
                        {childData.bmi ? (
                          <div style={{ marginBottom: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                              <Text strong>BMI</Text>
                              <Text type="secondary">{getBmiStatus(childData.bmi).text}</Text>
                            </div>
                            <Progress
                              percent={(childData.bmi / 30) * 100}
                              showInfo={false}
                              strokeColor={getBmiStatus(childData.bmi).color}
                              style={{ marginBottom: '8px' }}
                            />
                            <Text style={{ 
                              display: 'inline-block', 
                              padding: '4px 10px',
                              background: 'white',
                              borderRadius: '20px',
                              fontSize: '14px',
                              fontWeight: 600,
                              color: '#1e3a8a'
                            }}>
                              {childData.bmi ? childData.bmi.toFixed(1) : "N/A"} kg/m²
                            </Text>
                          </div>
                        ) : (
                          <Text type="secondary">BMI data not available</Text>
                        )}
                        
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                          <div style={{ 
                            flex: 1, 
                            minWidth: '120px', 
                            background: 'white',
                            padding: '16px',
                            borderRadius: '12px',
                            textAlign: 'center'
                          }}>
                            <Text type="secondary" style={{ display: 'block', fontSize: '13px', marginBottom: '8px' }}>Height</Text>
                            <Title level={4} style={{ margin: 0, color: '#1e3a8a' }}>{childData.height || "N/A"} <small style={{ fontSize: '14px', fontWeight: 'normal' }}>cm</small></Title>
                          </div>
                          
                          <div style={{ 
                            flex: 1, 
                            minWidth: '120px', 
                            background: 'white',
                            padding: '16px',
                            borderRadius: '12px',
                            textAlign: 'center'
                          }}>
                            <Text type="secondary" style={{ display: 'block', fontSize: '13px', marginBottom: '8px' }}>Weight</Text>
                            <Title level={4} style={{ margin: 0, color: '#1e3a8a' }}>{childData.weight || "N/A"} <small style={{ fontSize: '14px', fontWeight: 'normal' }}>kg</small></Title>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <Title level={4} style={{ color: '#6b7280', fontWeight: 'normal', marginBottom: '24px' }}>
                      No child information available.
                    </Title>
                    <Button 
                      type="primary" 
                      icon={<PlusOutlined />}
                      size="large"
                      style={{ 
                        background: '#1e3a8a',
                        border: 'none',
                        borderRadius: '8px',
                        height: '44px',
                        fontWeight: 600,
                        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                        paddingLeft: '24px',
                        paddingRight: '24px'
                      }}
                    >
                      Add Child Information
                    </Button>
                  </div>
                )}
              </Card>

              {/* Developmental Milestones or Additional Section */}
              <Card 
                style={{ 
                  marginBottom: '24px', 
                  borderRadius: '16px', 
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                  border: 'none'
                }}
                title={
                  <div style={{ padding: '8px 0' }}>
                    <div style={{ 
                      display: 'inline-block', 
                      padding: '6px 14px',
                      background: 'rgba(30, 58, 138, 0.1)',
                      borderRadius: '20px',
                      marginBottom: '8px'
                    }}>
                      <span style={{ color: '#1e3a8a', fontWeight: '600', fontSize: '13px' }}>DEVELOPMENT</span>
                    </div>
                    <Title level={4} style={{ margin: '8px 0 0 0', color: '#1e3a8a' }}>Developmental Milestones</Title>
                  </div>
                }
                bodyStyle={{ padding: '24px' }}
              >
                <div style={{ textAlign: 'center', padding: '30px 20px' }}>
                  <Title level={4} style={{ color: '#6b7280', fontWeight: 'normal', marginBottom: '24px' }}>
                    Track important developmental milestones in your child's growth journey.
                  </Title>
                  <Button 
                    type="primary"
                    size="large"
                    style={{ 
                      background: '#1e3a8a',
                      border: 'none',
                      borderRadius: '8px',
                      height: '44px',
                      fontWeight: 600,
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                      paddingLeft: '24px',
                      paddingRight: '24px'
                    }}
                  >
                    View Milestones
                  </Button>
                </div>
              </Card>
            </Col>

            <Col xs={24} lg={8}>
              {/* Recommended Doctors Card */}
              <Card 
                style={{ 
                  marginBottom: '24px', 
                  borderRadius: '16px', 
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                  border: 'none'
                }}
                title={
                  <div style={{ padding: '8px 0' }}>
                    <div style={{ 
                      display: 'inline-block', 
                      padding: '6px 14px',
                      background: 'rgba(30, 58, 138, 0.1)',
                      borderRadius: '20px',
                      marginBottom: '8px'
                    }}>
                      <span style={{ color: '#1e3a8a', fontWeight: '600', fontSize: '13px' }}>EXPERTS</span>
                    </div>
                    <Title level={4} style={{ margin: '8px 0 0 0', color: '#1e3a8a' }}>Recommended Doctors</Title>
                  </div>
                }
                bodyStyle={{ padding: '0' }}
              >
                {doctors.slice(0, 3).map(doctor => (
                  <div 
                    key={doctor.id} 
                    style={{ 
                      padding: '20px', 
                      borderBottom: '1px solid #f0f0f0', 
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <Avatar 
                        src={doctor.profileImg || doctorImage} 
                        size={64} 
                        style={{ border: '2px solid #e5e7eb' }}
                      />
                      <div style={{ flex: 1 }}>
                        <Text 
                          strong 
                          style={{ 
                            display: 'block', 
                            fontSize: '16px', 
                            marginBottom: '4px',
                            color: '#1e3a8a' 
                          }}
                        >
                          {doctor.user?.name || "Doctor name not updated"}
                        </Text>
                        <Tag color="#f0f7ff" style={{ color: '#1e3a8a', border: 'none', fontWeight: 500 }}>
                          {doctor.specialize}
                        </Tag>
                        <div style={{ marginTop: '12px' }}>
                          <Rate disabled defaultValue={4.5} style={{ fontSize: '14px', color: '#fbbf24' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div style={{ padding: '16px', textAlign: 'center' }}>
                  <Button type="link" style={{ color: '#1e3a8a', fontWeight: 600 }}>
                    View All Doctors <ArrowRightOutlined />
                  </Button>
                </div>
              </Card>

              {/* Premium Features or Tips Card */}
              <Card 
                style={{ 
                  marginBottom: '24px', 
                  borderRadius: '16px', 
                  overflow: 'hidden',
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                }}
              >
                <div style={{ 
                  padding: '30px 24px',
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '16px 16px 0 0'
                }}>
                  {/* Decorative elements */}
                  <div style={{
                    position: 'absolute',
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.05)',
                    top: '-50px',
                    right: '-50px',
                  }} />
                  
                  <CrownOutlined style={{ fontSize: '40px', color: '#fbbf24', marginBottom: '16px' }} />
                  <Title level={3} style={{ color: 'white', marginTop: 0, marginBottom: '12px' }}>
                    Premium Benefits
                  </Title>
                  <Paragraph style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px', marginBottom: '24px' }}>
                    You have access to exclusive features and personalized advice from experts.
                  </Paragraph>
                </div>
                
                <div style={{ padding: '24px' }}>
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                      <CheckCircleOutlined style={{ color: '#1e3a8a', marginRight: '12px' }} />
                      <Text strong>Advanced growth analytics</Text>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                      <CheckCircleOutlined style={{ color: '#1e3a8a', marginRight: '12px' }} />
                      <Text strong>Priority doctor consultations</Text>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                      <CheckCircleOutlined style={{ color: '#1e3a8a', marginRight: '12px' }} />
                      <Text strong>Personalized nutrition plans</Text>
                    </div>
                  </div>
                  <Link to="/package">
                    <Button
                      type="primary"
                      block
                      style={{
                        background: "#1e3a8a",
                        border: "none",
                        borderRadius: "8px",
                        height: "44px",
                        fontWeight: 600,
                      }}
                    >
                      Explore Premium Features
                    </Button>
                  </Link>
                </div>
              </Card>
            </Col>
          </Row>
        )}
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default ParentProfilePage;