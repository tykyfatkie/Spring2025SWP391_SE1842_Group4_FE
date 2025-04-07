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
} from 'antd';
import { 
  UserOutlined, 
  PlusOutlined,
  EditOutlined,
  ArrowRightOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import AppFooter from "../../components/Footer/Footer";
import doctorImage from "../../assets/doctor.png";
import { Link, useNavigate } from 'react-router-dom';
import PremiumPackageCard from './PremiumPackageCard';
import PremiumMemberDisplay from './PremiumMemberDisplay';

const { Content } = Layout;
const { Title, Text } = Typography;

// Interfaces
interface User {
  name: string;
  // other user properties
}

interface Child {
  id: string;
  name: string;
  doB?: string;
  gender: number;
  height?: number;
  weight?: number;
  bmi?: number;
}

interface Doctor {
  id: string;
  userId: string;
  profileImg?: string;
  specialize?: string;
  user?: {
    name?: string;
  };
}

interface BmiRecord {
  dateTime: string;
  bmi: number;
  // other bmi properties
}

interface DoctorProfileResponse {
  data: Array<{
    user?: {
      name?: string;
    };
  }>;
}

// WHO BMI reference data matching the BMIDetailsCard component
const whoBmiReferenceData = {
  male: {
    0: 13.4, 3: 16.0, 6: 17.3, 9: 17.2, 12: 16.8, 15: 16.4, 18: 16.2, 
    24: 15.8, 36: 15.4, 48: 15.3, 60: 15.4, 
    72: 15.5, 84: 16.0, 96: 16.5, 108: 17.0, 120: 17.8, 
    132: 18.5, 144: 19.2, 156: 19.9, 168: 20.8, 180: 21.4, 192: 22.2, 204: 22.7, 216: 23.1, 228: 23.4
  },
  female: {
    0: 13.2, 3: 15.7, 6: 16.9, 9: 16.8, 12: 16.4, 15: 16.1, 18: 15.9, 
    24: 15.6, 36: 15.3, 48: 15.3, 60: 15.3, 
    72: 15.3, 84: 15.7, 96: 16.2, 108: 16.8, 120: 17.5, 
    132: 18.2, 144: 19.0, 156: 19.6, 168: 20.2, 180: 20.8, 192: 21.3, 204: 21.7, 216: 22.0, 228: 22.2
  }
};

// Helper functions from BMIDetailsCard
const getWhoBmiReference = (ageInMonths: number, gender: 'male' | 'female' = 'male'): number => {
  const referenceData = whoBmiReferenceData[gender];
  
  const ages = Object.keys(referenceData).map(Number).sort((a, b) => a - b);
  
  if (ageInMonths <= ages[0]) return referenceData[ages[0] as keyof typeof referenceData];
  if (ageInMonths >= ages[ages.length - 1]) return referenceData[ages[ages.length - 1] as keyof typeof referenceData];
  
  let lowerAge = ages[0];
  let upperAge = ages[ages.length - 1];
  
  for (let i = 0; i < ages.length - 1; i++) {
    if (ageInMonths >= ages[i] && ageInMonths <= ages[i + 1]) {
      lowerAge = ages[i];
      upperAge = ages[i + 1];
      break;
    }
  }
  
  const lowerBMI = referenceData[lowerAge as keyof typeof referenceData];
  const upperBMI = referenceData[upperAge as keyof typeof referenceData];
  const ratio = (ageInMonths - lowerAge) / (upperAge - lowerAge);
  
  return lowerBMI + ratio * (upperBMI - lowerBMI);
};

const getWhoZScoreReferences = (ageInMonths: number, gender: 'male' | 'female'): {
  median: number;
  underweight: number;
  overweight: number;
  obese: number;
} => {
  const median = getWhoBmiReference(ageInMonths, gender);
  
  const estimatedSD = median * 0.1;  
  
  return {
    median,
    underweight: median - (2 * estimatedSD), 
    overweight: median + (1 * estimatedSD),  
    obese: median + (2 * estimatedSD)       
  };
};

// Doctor list item component to display doctor information
const DoctorListItem: React.FC<{ doctor: Doctor }> = ({ doctor }) => {
  const navigate = useNavigate();
  
  // Extract first specialization if it contains multiple ones
  const firstSpecialization = doctor.specialize ? 
    doctor.specialize.split(',')[0].trim() : 
    "General Practice";
  
  // Function to truncate text with ellipsis
  const truncateText = (text: string | undefined, maxLength: number): string => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };
  
  // Add function to navigate to doctor profile
  const navigateToDoctorProfile = () => {
    navigate(`/doctor/${doctor.userId}`);
  };
  
  // Get the doctor name and truncate if necessary
  const doctorName = doctor.user?.name || "Doctor name not updated";
  const truncatedName = truncateText(doctorName, 20);
  const truncatedSpecialization = truncateText(firstSpecialization, 15);
  
  return (
    <div 
      key={doctor.id} 
      style={{ 
        padding: '20px', 
        borderBottom: '1px solid #f0f0f0', 
        transition: 'all 0.3s ease',
        cursor: 'pointer'
      }}
      onClick={navigateToDoctorProfile}
    >
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Avatar 
          src={doctor.profileImg || doctorImage} 
          size={64} 
          style={{ 
            border: '2px solid #e5e7eb',
            flexShrink: 0 // Prevent avatar from shrinking
          }}
        />
        <div style={{ 
          flex: 1,
          minWidth: 0, // Important for text overflow to work
          overflow: 'hidden'
        }}>
          <Text 
            strong 
            style={{ 
              display: 'block', 
              fontSize: '16px', 
              marginBottom: '4px',
              color: '#1e3a8a',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
            title={doctorName} // Show full name on hover
          >
            {truncatedName}
          </Text>
          <Tag 
            color="#f0f7ff" 
            style={{ 
              color: '#1e3a8a', 
              border: 'none', 
              fontWeight: 500,
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: 'inline-block'
            }}
            title={firstSpecialization} // Show full specialization on hover
          >
            {truncatedSpecialization}
          </Tag>
        </div>
      </div>
    </div>
  );
};

const ParentProfilePage: React.FC = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [childData, setChildData] = useState<Child | null>(null);
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [_bmiRecords, setBmiRecords] = useState<BmiRecord[]>([]);

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
        console.error("Error fetching user data:", error);
        // setError("Failed to load user data");
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
          setChildData(data.data[0]);
          
          // After getting child data, fetch BMI records for this child
          fetchBmiRecords(data.data[0].id);
        } else {
          setChildData(null);
        }
      } catch (error) {
        console.error("Error fetching child data:", error);
      }
    };

    const fetchBmiRecords = async (childId: string) => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token || !childId) {
          return;
        }
        
        const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/growth/getByChildId/${childId}`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch BMI records');
        }
        
        const data = await response.json();
        if (Array.isArray(data.data) && data.data.length > 0) {
          // Sort by date descending to get the most recent record first
          const sortedRecords = data.data.sort((a: BmiRecord, b: BmiRecord) => {
            return new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime();
          });
          
          setBmiRecords(sortedRecords);
        }
      } catch (error) {
        console.error("Error fetching BMI records:", error);
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
        
        const updatedDoctors = await Promise.all(data.data.map(async (doctor: Doctor) => {
          try {
            const profileResponse = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/doctors/doctorprofile/${doctor.userId}`);
            if (profileResponse.ok) {
              const profileData = await profileResponse.json() as DoctorProfileResponse;
              if (profileData.data && Array.isArray(profileData.data) && profileData.data.length > 0) {
                // Create user property if it doesn't exist
                doctor.user = {
                  name: profileData.data[0].user?.name || "Doctor has not updated"
                };
              }
            }
          } catch (profileError) {
            console.error("Error fetching doctor profile:", profileError);
          }
          return doctor;
        }));

        setDoctors(updatedDoctors);
      } catch (error) {
        console.error("Error fetching doctors:", error);
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

  // Updated BMI status function that matches the WHO guidelines used in BMIDetailsCard
  const getBmiStatus = (bmi: number | undefined) => {
    if (!bmi) return { color: '#1e3a8a', status: 'normal', text: 'No data' };
    
    // Calculate the child's age in months
    const calculateAgeInMonths = () => {
      if (!childData || !childData.doB) return 24; // Default to 24 months if no data
      
      const birthDate = new Date(childData.doB);
      const today = new Date();
      
      return (today.getFullYear() - birthDate.getFullYear()) * 12 + 
             (today.getMonth() - birthDate.getMonth());
    };
    
    const ageInMonths = calculateAgeInMonths();
    const gender = childData && childData.gender === 0 ? 'male' : 'female';
    
    const references = getWhoZScoreReferences(ageInMonths, gender);
    
    if (bmi < references.underweight) {
      return { color: '#91caff', status: 'exception', text: 'Underweight' };
    } else if (bmi >= references.obese) {
      return { color: '#ff4d4f', status: 'exception', text: 'Obese' };
    } else if (bmi >= references.overweight) {
      return { color: '#faad14', status: 'active', text: 'Overweight' };
    } else {
      return { color: '#52c41a', status: 'success', text: 'Normal' };
    }
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
                <PremiumMemberDisplay />
                </div>
              </div>
            </Col>
            <Col xs={24} md={8} style={{ textAlign: 'right' }}>
            <Link to="/child-analytics">
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
            </Link>
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
                  <DoctorListItem key={doctor.id} doctor={doctor} />
                ))}
                <div style={{ padding: '16px', textAlign: 'center' }}>
                  <Link to="/doctor">
                    <Button type="link" style={{ color: '#1e3a8a', fontWeight: 600 }}>
                      View All Doctors <ArrowRightOutlined />
                    </Button>
                  </Link>
                </div>
              </Card>

              <PremiumPackageCard />
            </Col>
          </Row>
        )}
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default ParentProfilePage;