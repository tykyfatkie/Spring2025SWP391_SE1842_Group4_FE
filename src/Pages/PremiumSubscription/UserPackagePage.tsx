import React, { useState, useEffect } from "react";
import { Card, Button, Typography, Layout, Spin, Result } from "antd";
import { HomeOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;

interface PackageType {
  packageId: string;
  packageName: string;
  priceAtSubscription: number;
  startDate: string;
  expireDate: string;
  maxChildrentAllowed: number;
  status: number;
}

const UserPackagePage: React.FC = () => {
  const [userPackage, setUserPackage] = useState<PackageType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserPackage();
  }, []);

  const fetchUserPackage = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found");
        setLoading(false);
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/user-packages/getUserPackage`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': '*/*'
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user package");
      }

      const responseData = await response.json();

      if (responseData.code === 200 && responseData.data && responseData.data.length > 0) {
        setUserPackage(responseData.data[0]);
      } else {
        setError("No package information found");
      }
    } catch (error: any) {
      setError(error.message || "Failed to load package information");
    } finally {
      setLoading(false);
    }
  };

  const handleReturnHome = () => {
    navigate("/home");
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateDuration = (startDate: string, expireDate: string) => {
    if (!startDate || !expireDate) return 0;
    const start = new Date(startDate);
    const end = new Date(expireDate);
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    return months;
  };

  const packageStyle = {
    primary: '#7e22ce',
    gradient: 'linear-gradient(135deg, #7e22ce 0%, #a855f7 100%)',
    label: 'Ultra'
  };

  const packageFeatures = [
    "Full access to all premium features",
    "Priority customer support",
    "Advanced child development tracking",
    "Personalized growth insights",
    "Access to exclusive educational content"
  ];

  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh', background: 'white' }}>
        <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Spin size="large" />
        </Content>
      </Layout>
    );
  }

  if (error || !userPackage) {
    return (
      <Layout style={{ minHeight: '100vh', background: 'white' }}>
        <Content>
          <Result
            status="warning"
            title="No Active Subscription"
            subTitle={error || "You don't have an active subscription package"}
            extra={
              <Button 
                type="primary" 
                onClick={handleReturnHome}
                style={{
                  borderRadius: '50px',
                  height: '48px',
                  padding: '0 28px',
                  fontSize: '16px',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                  border: 'none',
                }}
              >
                Return to Home
              </Button>
            }
          />
        </Content>
      </Layout>
    );
  }

  const durationMonths = calculateDuration(userPackage.startDate, userPackage.expireDate);
  
  return (
    <Layout style={{ 
      minHeight: '120vh', 
      margin: '-25px', 
      background: 'white',
    }}>
      <Content>
        {/* Hero Section */}
        <div style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
          padding: '60px 0',
          color: 'white',
          textAlign: 'center',
          borderRadius: '0 0 30px 30px',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '60px',
          marginRight: '50px',
        }}>
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
              <span style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>MY SUBSCRIPTION</span>
            </div>
            
            <Title level={1} style={{ 
              color: 'white', 
              fontSize: '48px', 
              marginBottom: '24px', 
              fontWeight: 700 
            }}>
              Current Subscription Plan
            </Title>
            
            <Paragraph style={{ 
              fontSize: '18px', 
              color: 'rgba(255, 255, 255, 0.9)', 
              maxWidth: '700px', 
              margin: '0 auto 32px', 
              lineHeight: 1.6 
            }}>
              Thank you for subscribing! You currently have access to all premium features included in your plan.
            </Paragraph>
            
            <Button 
              size="large"
              onClick={handleReturnHome}
              style={{ 
                borderRadius: '50px', 
                borderColor: 'rgba(255, 255, 255, 0.3)', 
                color: 'white',
                paddingLeft: '28px', 
                paddingRight: '28px',
                height: '52px',
                background: 'transparent',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto'
              }}
            >
              <HomeOutlined style={{ marginRight: 8 }} /> Return to Home
            </Button>
          </div>
        </div>

        {/* Package Details Section */}
        <div style={{ 
          padding: '0 24px', 
          maxWidth: 800, 
          margin: '0 auto' 
        }}>
          <Card
            style={{
              borderRadius: '16px',
              boxShadow: '0 15px 40px rgba(0,0,0,0.08)',
              overflow: 'hidden',
              border: 'none',
              position: 'relative'
            }}
            bodyStyle={{ padding: 0 }}
          >
            <div style={{
              background: packageStyle.gradient,
              padding: '30px 20px 50px',
              position: 'relative',
              color: 'white',
              textAlign: 'center'
            }}>
              <div style={{
                position: 'absolute',
                top: 10,
                left: -30,
                backgroundColor: packageStyle.primary,
                color: 'white',
                padding: '5px 30px',
                transform: 'rotate(-45deg)',
                fontWeight: 'bold',
                zIndex: 1,
                borderRadius: '0 0 5px 5px',
                fontSize: 12
              }}>
                {packageStyle.label}
              </div>

              <Title level={2} style={{ 
                color: 'white', 
                margin: 0, 
                fontWeight: 'bold' 
              }}>
                {userPackage.packageName}
              </Title>
              <Text style={{ 
                fontSize: 16, 
                color: 'rgba(255,255,255,0.9)',
                display: 'block',
                marginTop: 8
              }}>
                {new Intl.NumberFormat("en-US").format(userPackage.priceAtSubscription)} VND/year
              </Text>
            </div>

            <div style={{ padding: '30px' }}>
              <div style={{ 
                borderBottom: '1px solid #f0f0f0', 
                paddingBottom: '20px', 
                marginBottom: '20px' 
              }}>
                <Title level={4} style={{ color: '#1e3a8a' }}>Subscription Details</Title>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                  <div style={{ flex: '1 1 200px' }}>
                    <Text style={{ color: '#6b7280', display: 'block' }}>Start Date</Text>
                    <Text strong>{formatDate(userPackage.startDate)}</Text>
                  </div>
                  
                  <div style={{ flex: '1 1 200px' }}>
                    <Text style={{ color: '#6b7280', display: 'block' }}>Expiration Date</Text>
                    <Text strong>{formatDate(userPackage.expireDate)}</Text>
                  </div>
                  
                  <div style={{ flex: '1 1 200px' }}>
                    <Text style={{ color: '#6b7280', display: 'block' }}>Duration</Text>
                    <Text strong>{durationMonths} months</Text>
                  </div>
                  
                  <div style={{ flex: '1 1 200px' }}>
                    <Text style={{ color: '#6b7280', display: 'block' }}>Max Children Allowed</Text>
                    <Text strong>{userPackage.maxChildrentAllowed}</Text>
                  </div>
                </div>
              </div>
              
              <Title level={4} style={{ color: '#1e3a8a' }}>Included Features</Title>
              
              <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                {packageFeatures.map((feature, idx) => (
                  <li key={idx} style={{ 
                    padding: "8px 0", 
                    fontSize: 16,
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <CheckCircleOutlined style={{ 
                      color: packageStyle.primary, 
                      marginRight: 12,
                      fontSize: 18
                    }} />
                    {feature}
                  </li>
                ))}
                
                <li style={{ 
                  padding: "8px 0", 
                  fontSize: 16,
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <CheckCircleOutlined style={{ 
                    color: packageStyle.primary, 
                    marginRight: 12,
                    fontSize: 18
                  }} />
                  Track up to {userPackage.maxChildrentAllowed} children
                </li>
              </ul>
              
              <Button 
                type="primary" 
                block
                onClick={handleReturnHome}
                style={{
                  marginTop: 40,
                  height: 52,
                  fontSize: 16,
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                  border: 'none',
                  borderRadius: 26,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <HomeOutlined style={{ marginRight: 8 }} /> Return to Home
              </Button>
            </div>
          </Card>
        </div>
      </Content>
    </Layout>
  );
};

export default UserPackagePage;