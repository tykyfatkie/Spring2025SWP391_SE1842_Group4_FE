import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Layout, Typography, Row, Col, Card, Tabs, Rate, Button, Avatar, Tag, Timeline, Spin, Alert } from 'antd';
import { UserOutlined, EnvironmentOutlined, PhoneOutlined, MailOutlined, ArrowRightOutlined } from '@ant-design/icons';
import AppFooter from "../../components/Footer/Footer";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

// Main color variables to maintain consistency
const colors = {
  primary: {
    light: '#3b82f6', // Light blue
    main: '#1e3a8a',  // Dark blue
    gradient: 'linear-gradient(135deg, rgb(30, 58, 138) 0%, rgb(59, 130, 246) 100%)'
  },
  secondary: {
    light: '#f0f2f5', // Light background
    main: '#ffffff'   // White
  }
};

  interface DoctorProfile {
    id: string;
    certificate: string | null;
    licenseNumber: string | null;
    biography: string | null;
    metadata: string | null;
    specialize: string | null;
    profileImg: string;
    status: number;
    userId: string;
    ratingAvg: number | null;
    degrees: string | null;
    research: string | null;
    languages: string | null;
    user?: {
      name: string;
      userName: string;
      email: string;
      phone?: string;
      address?: string;
    };
  }

const DoctorProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        if (!id) {
          throw new Error("Doctor ID is required");
        }

        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        // First, try to fetch using the doctor-specific endpoint
        try {
          const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/doctors/doctorprofile/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Cache-Control': 'no-cache',
            },
          });

          if (response.ok) {
            const result = await response.json();
            if (result.data && Array.isArray(result.data) && result.data.length > 0) {
              setDoctor(result.data[0]);
              setLoading(false);
              return;
            }
          }
        } catch (e) {
          console.error("Error fetching from doctor profile endpoint:", e);
          // Continue to fallback method
        }

        // Fallback: Try to fetch from the users endpoint
        const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/users/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Cache-Control': 'no-cache',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const userData = await response.json();
        
        // Extract doctor data from user data
        let doctorData: DoctorProfile | null = null;
        
        if (userData.data) {
          const user = userData.data;
          
          if (user.doctor) {
            // User object has a nested doctor object
            doctorData = {
              ...user.doctor,
              user: {
                name: user.name,
                userName: user.userName,
                email: user.email,
                phone: user.phone,
                address: user.address
              },
              profileImg: user.profileImg || user.avatar || "",
              id: user.id
            };
          } else {
            // Create doctor profile from user data
            doctorData = {
              id: user.id,
              userId: user.id,
              certificate: null,
              licenseNumber: null,
              biography: null,
              metadata: user.metadata,
              specialize: null,
              profileImg: user.profileImg || user.avatar || "",
              status: 1,
              ratingAvg: 5,
              degrees: null,
              research: null,
              languages: null,
              user: {
                name: user.name,
                userName: user.userName,
                email: user.email,
                phone: user.phone,
                address: user.address
              }
            };
          }
        }

        if (!doctorData) {
          throw new Error("Could not retrieve doctor information");
        }

        setDoctor(doctorData);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorProfile();
  }, [id]);

  const getMetadata = () => {
    try {
      if (doctor?.metadata) {
        return JSON.parse(doctor.metadata);
      }
      return null;
    } catch (e) {
      return null;
    }
  };

  const metadata = getMetadata();

  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh', margin: '-25px', background: 'white' }}>
        <Content style={{ padding: '0 20px', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <Spin size="large" />
          </div>
        </Content>
      </Layout>
    );
  }

  if (error || !doctor) {
    return (
      <Layout style={{ minHeight: '100vh', margin: '-25px', background: 'white' }}>
        <Content style={{ padding: '0 20px', maxWidth: '1200px', margin: '0 auto' }}>
          <Alert
            message="Error retrieving doctor information"
            description={error || "Doctor information not found"}
            type="error"
            showIcon
            style={{ marginTop: '24px', borderRadius: '12px' }}
          />
        </Content>
      </Layout>
    );
  }

  // Parse degrees, certificates, research and languages from API data
  const degreesArray = doctor.degrees ? doctor.degrees.split(',').map(item => item.trim()) : [];
  const experienceYears = metadata?.years ? [`${metadata.years} years of experience`] : [];
  const degrees = degreesArray.length > 0 ? degreesArray : experienceYears.length > 0 ? experienceYears : ["N/A"];
  
  const certificatesArray = doctor.certificate ? doctor.certificate.split(',').map(item => item.trim()) : [];
  const certificates = certificatesArray.length > 0 ? certificatesArray : doctor.licenseNumber ? [`License: ${doctor.licenseNumber}`] : ["N/A"];
  
  const researchArray = doctor.research ? doctor.research.split(',').map(item => item.trim()) : [];
  const research = researchArray.length > 0 ? researchArray : ["N/A"];
  
  const languagesArray = doctor.languages ? doctor.languages.split(',').map(item => item.trim()) : [];
  const languages = languagesArray.length > 0 ? languagesArray : ["English", "Vietnamese"];
  
  const specializationsArray = doctor.specialize ? doctor.specialize.split(',').map(item => item.trim()) : [];
  const specializations = specializationsArray.length > 0 ? specializationsArray : 
                         (metadata?.specialization ? [metadata.specialization] : ["General Practice"]);

  // Extract hospital information if available
  const hospital = metadata?.hospital || "N/A";

  // Get rating value
  const ratingValue = doctor.ratingAvg || 5;

  return (
    <Layout style={{ minHeight: '100vh', margin: '-25px', background: 'white' }}>
      <Content style={{ 
        padding: '0 20px', 
        maxWidth: '1200px', 
        margin: '0 auto',
        marginBottom: '50px',
        marginTop: '30px'
      }}>
        {/* Header with gradient background - similar to homepage */}
        <div style={{
          position: 'relative',
          borderRadius: '30px',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          marginBottom: '30px',
        }}>
          <div style={{
            background: colors.primary.gradient,
            padding: '24px 32px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Decorative elements like in homepage */}
            <div style={{
              position: 'absolute',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.05)',
              top: '-150px',
              left: '-100px',
            }} />
            <div style={{
              position: 'absolute',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.08)',
              bottom: '-100px',
              right: '50px',
            }} />
            
            <div style={{ position: 'relative', zIndex: 2 }}>
              <Title level={2} style={{ color: 'white', margin: 0 }}>
                Doctor Information
              </Title>
              <Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Detailed information and schedule of the doctor
              </Text>
            </div>
          </div>
        </div>
        
        <Card style={{ 
          marginTop: '24px', 
          borderRadius: '20px', 
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' 
        }}>
          <Row gutter={24}>
            <Col span={8}>
              <div style={{ 
                borderRadius: '16px', 
                overflow: 'hidden', 
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' 
              }}>
                <img 
                  src={doctor.profileImg} 
                  alt={doctor.user?.name || "Doctor Profile"} 
                  style={{ width: '100%' }}
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/300x400?text=Doctor+Image';
                  }}
                />
              </div>
              <Button 
                type="primary" 
                block 
                style={{ 
                  marginTop: '16px',
                  borderRadius: '50px',
                  height: '52px',
                  fontWeight: '600',
                  background: colors.primary.gradient,
                  border: 'none',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)'
                }}
              >
                Contact <ArrowRightOutlined style={{ marginLeft: '8px' }} />
              </Button>
            </Col>
            <Col span={16}>
              <Title level={2} style={{ marginBottom: '12px' }}>{doctor.user?.name || doctor.biography || "Doctor"}</Title>
              <Rate disabled defaultValue={ratingValue} style={{ fontSize: '16px' }} />
              <Text style={{ marginLeft: '8px' }}>(80 reviews)</Text>
              
              <Row style={{ marginTop: '16px' }}>
                <Col span={24}>
                  <Tag color="blue" style={{ padding: '6px 12px', borderRadius: '16px', fontWeight: 500 }}>
                    {doctor.specialize || "General Practice"}
                  </Tag>
                  <Tag color="green" style={{ padding: '6px 12px', borderRadius: '16px', fontWeight: 500 }}>
                    {metadata?.years ? `${metadata.years} years experience` : "Experienced doctor"}
                  </Tag>
                </Col>
              </Row>

              <div style={{ 
                marginTop: '24px', 
                padding: '16px', 
                background: colors.secondary.light, 
                borderRadius: '16px' 
              }}>
                <Paragraph style={{ margin: 0 }}>
                  <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                    <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                      <EnvironmentOutlined style={{ marginRight: '12px', color: colors.primary.light }} /> 
                      Clinic: {hospital}
                    </li>
                    <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                      <PhoneOutlined style={{ marginRight: '12px', color: colors.primary.light }} /> 
                      Phone: {doctor.user?.phone || "N/A"}
                    </li>
                    <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                      <MailOutlined style={{ marginRight: '12px', color: colors.primary.light }} /> 
                      Email: {doctor.user?.email || "N/A"}
                    </li>
                  </ul>
                </Paragraph>
              </div>
            </Col>
          </Row>

          <Tabs 
            defaultActiveKey="1" 
            style={{ marginTop: '32px' }}
            tabBarStyle={{ 
              marginBottom: '24px',
              fontWeight: 500
            }}
          >
            <TabPane tab="General Information" key="1">
              <Title level={4}>Degrees & Certificates</Title>
              <Row gutter={[24, 24]}>
                <Col span={12}>
                  <Card 
                    title="Education" 
                    size="small"
                    style={{ 
                      borderRadius: '16px', 
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' 
                    }}
                  >
                    {degrees.map((degree, index) => (
                      <p key={index}>• {degree}</p>
                    ))}
                  </Card>
                </Col>
                <Col span={12}>
                  <Card 
                    title="Professional Certificates" 
                    size="small"
                    style={{ 
                      borderRadius: '16px', 
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' 
                    }}
                  >
                    {certificates.map((cert, index) => (
                      <p key={index}>• {cert}</p>
                    ))}
                  </Card>
                </Col>
              </Row>

              <Title level={4} style={{ marginTop: '24px' }}>Expertise</Title>
              <Row gutter={[24, 24]}>
                <Col span={12}>
                  <Card 
                    title="Specialization Areas" 
                    size="small"
                    style={{ 
                      borderRadius: '16px', 
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' 
                    }}
                  >
                    {specializations.map((spec, index) => (
                      <Tag 
                        color="blue" 
                        key={index} 
                        style={{ 
                          margin: '4px', 
                          padding: '4px 12px', 
                          borderRadius: '12px' 
                        }}
                      >
                        {spec}
                      </Tag>
                    ))}
                  </Card>
                </Col>
                <Col span={12}>
                  <Card 
                    title="Languages" 
                    size="small"
                    style={{ 
                      borderRadius: '16px', 
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' 
                    }}
                  >
                    {languages.map((lang, index) => (
                      <Tag 
                        color="green" 
                        key={index} 
                        style={{ 
                          margin: '4px', 
                          padding: '4px 12px', 
                          borderRadius: '12px' 
                        }}
                      >
                        {lang}
                      </Tag>
                    ))}
                  </Card>
                </Col>
              </Row>

              <Title level={4} style={{ marginTop: '24px' }}>Research & Publications</Title>
              <Card 
                size="small"
                style={{ 
                  borderRadius: '16px', 
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' 
                }}
              >
                {research.map((item, index) => (
                  <p key={index}>• {item}</p>
                ))}
              </Card>

              <Title level={4} style={{ marginTop: '24px' }}>Work Experience</Title>
              <Card
                style={{ 
                  borderRadius: '16px', 
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' 
                }}
              >
                <Timeline>
                  <Timeline.Item color={colors.primary.light}>
                    {metadata?.years ? `${new Date().getFullYear() - parseInt(metadata.years)} - ${new Date().getFullYear()}` : "2018 - present"}: Doctor at {hospital}
                  </Timeline.Item>
                  <Timeline.Item color={colors.primary.light}>
                    Professional experience of {metadata?.years || "many"} years
                  </Timeline.Item>
                </Timeline>
              </Card>
            </TabPane>

            <TabPane tab="Reviews" key="2">
              <Row gutter={[16, 16]}>
                {[1, 2, 3].map((review) => (
                  <Col span={24} key={review}>
                    <Card
                      style={{ 
                        borderRadius: '16px', 
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' 
                      }}
                    >
                      <Row align="middle">
                        <Avatar size={48} icon={<UserOutlined />} style={{ backgroundColor: colors.primary.light }} />
                        <div style={{ marginLeft: '12px' }}>
                          <Text strong>Anonymous User</Text>
                          <br />
                          <Rate disabled defaultValue={5} style={{ fontSize: '12px' }} />
                          <Text type="secondary" style={{ marginLeft: '8px' }}>1 month ago</Text>
                        </div>
                      </Row>
                      <Paragraph style={{ marginTop: '12px' }}>
                        The doctor is very dedicated and professional. I am very satisfied with the medical service.
                      </Paragraph>
                    </Card>
                  </Col>
                ))}
              </Row>
            </TabPane>

          </Tabs>
        </Card>
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default DoctorProfilePage;