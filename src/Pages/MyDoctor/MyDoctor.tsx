import React, { useState } from 'react';
import { Layout, Typography, Row, Col, Card, Tag, Spin, Alert, Button, Empty } from 'antd';
import { CheckCircleOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import DoctorSidebar from '../../components/Sidebar/DoctorSidebar';


const { Content } = Layout;
const { Title, Text } = Typography;

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
  hospital?: string;
  user?: {
    name: string;
    userName: string;
    email: string;
    phone?: string;
    address?: string;
  };
}

interface Metadata {
  years?: string;
  specialization?: string;
  hospital?: string;
  [key: string]: any;
}

const MyDoctorProfilePage: React.FC = () => {
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        if (!token || !userId) {
          throw new Error("Unauthorized: Please log in");
        }
  
        // Try fetching from doctor endpoint
        try {
          const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/doctors/doctorprofile/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Cache-Control': 'no-cache',
            },
          });
  
          if (response.ok) {
            const result = await response.json();
            if (result.data) {
              // Check if data is an array
              if (Array.isArray(result.data) && result.data.length > 0) {
                setDoctor(result.data[0]);
              } else {
                setDoctor(result.data);
              }
              setLoading(false);
              return;
            }
          }
        } catch (e) {
          console.error(e);
        }
  
        const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache',
          },
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const userData = await response.json();
          
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
              metadata: user.metadata || "{}",
              specialize: null,
              profileImg: user.profileImg || user.avatar || "",
              status: 1,
              ratingAvg: null,
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
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
  
    fetchDoctorProfile();
  }, []);
  
  const getMetadata = (): Metadata | null => {
    try {
      if (doctor?.metadata) {
        return JSON.parse(doctor.metadata);
      }
      return null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return null;
    }
  };

  const metadata = getMetadata();

  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh', background: '#f5f7fa' }}>
        <DoctorSidebar />
        <Layout style={{ background: '#f5f7fa' }}>
          <Content style={{ 
            padding: '30px', 
            maxWidth: '1200px', 
            margin: '0 auto',
            marginBottom: '30px'
          }}>
            <Spin size="large" />
          </Content>
        </Layout>
      </Layout>
    );
  }

  if (error || !doctor) {
    return (
      <Layout style={{ minHeight: '100vh', background: '#f5f7fa' }}>
        <DoctorSidebar />
        <Layout style={{ background: '#f5f7fa' }}>
          <Content style={{ 
            padding: '30px', 
            maxWidth: '1200px', 
            margin: '0 auto',
            marginBottom: '30px'
          }}>
            <Alert
              message="Error retrieving doctor information"
              description={error || "Doctor information not found"}
              type="error"
              showIcon
              style={{ marginTop: '24px' }}
            />
          </Content>
        </Layout>
      </Layout>
    );
  }

  // Parse data from API without hardcoding default values
  const degreesArray = doctor.degrees ? doctor.degrees.split(',').map(item => item.trim()) : [];
  const experienceYears = metadata?.years ? parseInt(metadata.years) : 0;
  
  const certificatesArray = doctor.certificate ? doctor.certificate.split(',').map(item => item.trim()) : [];
  
  const researchArray = doctor.research ? doctor.research.split(',').map(item => item.trim()) : [];
  
  const languagesArray = doctor.languages ? doctor.languages.split(',').map(item => item.trim()) : [];
  
  const specializationsArray = doctor.specialize ? doctor.specialize.split(',').map(item => item.trim()) : [];

  // Get hospital information
  const hospital = metadata?.hospital || doctor.hospital || "";

  // Check if profile has any meaningful data
  const hasProfileData = !!(
    doctor.degrees || 
    doctor.certificate || 
    doctor.research || 
    doctor.languages || 
    doctor.specialize
  );

  return (
    <Layout style={{ minHeight: '100vh', marginLeft: '-25px', marginTop: '-24px', marginBottom: '-24px', background: '#f5f7fa' }}>
      <DoctorSidebar />
      <Layout style={{ background: '#f5f7fa' }}>
        <Content style={{ 
          padding: '30px', 
          maxWidth: '1995px', 
          margin: '0 auto',
          marginBottom: '30px'
        }}>
          {/* Profile Header Card with Blue Gradient */}
          <Card 
            style={{ 
              marginTop: '24px', 
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)'
            }}
            bodyStyle={{ padding: 0 }}
          >

            {/* Header with Gradient */}
            <div style={{ 
              background: colors.primary.gradient,
              padding: '30px',
              color: 'white'
            }}>
              <Row gutter={24} align="middle" justify="start">
                <Col xs={24} md={6} style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <div style={{ 
                    width: '150px', 
                    height: '150px', 
                    margin: '0 auto',
                    borderRadius: '50%',
                    border: '5px solid white',
                    overflow: 'hidden',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: '#f0f0f0'
                  }}>
                    <img 
                      src={doctor.profileImg } 
                      alt={doctor.user?.name || "Doctor"} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.currentTarget.src = '';
                      }}
                    />
                  </div>
                </Col>
                <Col xs={24} md={18}>
                <Title level={2} style={{ color: 'white', margin: 0 }}>
                    {doctor.user?.name || "Dr. Unknown"}
                  </Title>
                  <Text style={{ color: 'white', display: 'block', marginTop: '8px', fontSize: '16px' }}>
                    <MailOutlined style={{ marginRight: '8px' }} /> 
                    {doctor.user?.email || "No email available"}
                  </Text>
                  <Text style={{ color: 'white', display: 'block', marginTop: '8px', fontSize: '16px' }}>
                    <PhoneOutlined style={{ marginRight: '8px' }} /> 
                    {doctor.user?.phone || "No phone available"}
                  </Text>
                </Col>
              </Row>
            </div>

            {/* Button Section - Create or Update Profile */}
            <div style={{ padding: '20px 30px', textAlign: 'center' }}>
            {!hasProfileData && (
  <Button 
    type="primary" 
    size="large"
    style={{ 
      borderRadius: '50px',
      padding: '0 30px',
      height: '44px',
      background: colors.primary.main,
      border: 'none',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    }}
    onClick={() => navigate('/create-doctor-profile')}
  >
    Create Profile
  </Button>
)}
            </div>
          </Card>

          {/* Only show sections if profile data exists */}
          {hasProfileData && (
            <>
              {/* Degrees & Certificates Section */}
              {(degreesArray.length > 0 || certificatesArray.length > 0) && (
                <Card 
                  title={<Title level={4} style={{ margin: 0 }}>Degrees & Certificates</Title>}
                  style={{ 
                    marginTop: '24px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <Row gutter={[24, 24]}>
                    {degreesArray.length > 0 && (
                      <Col xs={24} md={12}>
                        <Card 
                          title="Education" 
                          type="inner"
                          style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}
                        >
                          <ul style={{ paddingLeft: '20px' }}>
                            {degreesArray.map((degree, index) => (
                              <li key={index} style={{ margin: '8px 0' }}>
                                {degree}
                              </li>
                            ))}
                          </ul>
                        </Card>
                      </Col>
                    )}
                    {certificatesArray.length > 0 && (
                      <Col xs={24} md={degreesArray.length > 0 ? 12 : 24}>
                        <Card 
                          title="Professional Certificates" 
                          type="inner"
                          style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}
                        >
                          <ul style={{ paddingLeft: '20px' }}>
                            {certificatesArray.map((cert, index) => (
                              <li key={index} style={{ margin: '8px 0' }}>
                                {cert}
                              </li>
                            ))}
                          </ul>
                        </Card>
                      </Col>
                    )}
                  </Row>
                </Card>
              )}

              {/* Expertise Section */}
              {(specializationsArray.length > 0 || languagesArray.length > 0) && (
                <Card 
                  title={<Title level={4} style={{ margin: 0 }}>Expertise</Title>}
                  style={{ 
                    marginTop: '24px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <Row gutter={[24, 24]}>
                    {specializationsArray.length > 0 && (
                      <Col xs={24} md={12}>
                        <Card 
                          title="Specialization Areas" 
                          type="inner"
                          style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}
                        >
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {specializationsArray.map((spec, index) => (
                              <Tag 
                                color="blue" 
                                key={index} 
                                style={{ 
                                  margin: '4px',
                                  padding: '6px 15px',
                                  borderRadius: '20px',
                                  fontSize: '14px'
                                }}
                              >
                                {spec}
                              </Tag>
                            ))}
                          </div>
                        </Card>
                      </Col>
                    )}
                    {languagesArray.length > 0 && (
                      <Col xs={24} md={specializationsArray.length > 0 ? 12 : 24}>
                        <Card 
                          title="Languages" 
                          type="inner"
                          style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}
                        >
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {languagesArray.map((lang, index) => (
                              <Tag 
                                color="green" 
                                key={index} 
                                style={{ 
                                  margin: '4px',
                                  padding: '6px 15px',
                                  borderRadius: '20px',
                                  fontSize: '14px'
                                }}
                              >
                                {lang}
                              </Tag>
                            ))}
                          </div>
                        </Card>
                      </Col>
                    )}
                  </Row>
                </Card>
              )}

              {/* Research & Publications Section */}
              {researchArray.length > 0 && (
                <Card 
                  title={<Title level={4} style={{ margin: 0 }}>Research & Publications</Title>}
                  style={{ 
                    marginTop: '24px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <ul style={{ paddingLeft: '20px' }}>
                    {researchArray.map((item, index) => (
                      <li key={index} style={{ margin: '12px 0' }}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {/* Work Experience Section */}
              {experienceYears > 0 && hospital && (
                <Card 
                  title={<Title level={4} style={{ margin: 0 }}>Work Experience</Title>}
                  style={{ 
                    marginTop: '24px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <div style={{ padding: '10px' }}>
                    {/* Only display work experience if we have years and hospital data */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '15px' }}>
                      <div style={{ color: '#1890ff', marginRight: '10px', marginTop: '3px', fontSize: '16px' }}>
                        <CheckCircleOutlined />
                      </div>
                      <Text>
                        {new Date().getFullYear() - experienceYears} - {new Date().getFullYear()}: Doctor at {hospital}
                      </Text>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '15px' }}>
                      <div style={{ color: '#1890ff', marginRight: '10px', marginTop: '3px', fontSize: '16px' }}>
                        <CheckCircleOutlined />
                      </div>
                      <Text>Professional experience of {experienceYears} years</Text>
                    </div>
                  </div>
                </Card>
              )}
            </>
          )}

          {!hasProfileData && (
            <Card 
              style={{ 
                marginTop: '24px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                textAlign: 'center',
                padding: '40px 0'
              }}
            >
              <Empty
                description="No profile information available"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
              <div style={{ marginTop: '20px' }}>
                <Text type="secondary">
                  Please create your profile to provide your medical qualifications and expertise
                </Text>
              </div>
            </Card>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MyDoctorProfilePage;