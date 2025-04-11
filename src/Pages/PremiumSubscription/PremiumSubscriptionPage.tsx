import React, { useState, useEffect } from "react";
import { Card, Button, Typography, Layout, Spin } from "antd";
import { CheckCircleOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { initiateVnPayPayment } from "../../services/PaymentService";
import { useNavigate } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;

interface PackageType {
  description: any;
  id: string;
  packageName: string;
  price: number;
  durationMonths: number;
  maxChildrentAllowed: number;
  billingCycle: number;
  status: number;
}

const PremiumSubscriptionPage: React.FC = () => {
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submittingPackageId, setSubmittingPackageId] = useState<string | null>(null);
  const [checkingUserPackage, setCheckingUserPackage] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkUserPackage();
  }, []);

  const checkUserPackage = async () => {
    setCheckingUserPackage(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/user-packages/getUserPackage`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const responseData = await response.json();
        
        if (responseData && responseData.data) {
          navigate("/user-package");
          return;
        }
      }
      
      fetchPackages();
    } catch (error) {
      fetchPackages();
    } finally {
      setCheckingUserPackage(false);
    }
  };

  const fetchPackages = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/user-packages/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        // Handle error
      }

      const responseData = await response.json();

      if (responseData && responseData.data) {
        const activePackages = responseData.data.filter((pkg: PackageType) => pkg.status === 1);
        const sortedPackages = [...activePackages].sort((a, b) => a.price - b.price);
        setPackages(sortedPackages);
      }
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (packageId: string, price: number) => {
    setSubmitting(true);
    setSubmittingPackageId(packageId);
  
    try {
      const selectedPackage = packages.find(pkg => pkg.id === packageId);
      if (!selectedPackage) {
        return;
      }
  
      const paymentUrl = await initiateVnPayPayment({
        packageId,
        amount: price,
        description: `Subscribe to ${selectedPackage.packageName} for ${selectedPackage.durationMonths}`,
      });
  
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        // Handle error
      }
    } catch (error: any) {
      // Handle error
    } finally {
      setSubmitting(false);
      setSubmittingPackageId(null);
    }
  };
  
  const getBillingCycleText = (billingCycle: number) => {
    return billingCycle === 0 ? "monthly" : "yearly";
  };

  const packageColors = [
    {
      primary: '#1e3a8a',
      gradient: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
      label: 'Basic'
    },
    {
      primary: '#7e22ce',
      gradient: 'linear-gradient(135deg, #7e22ce 0%, #a855f7 100%)',
      label: 'Standard'
    },
    {
      primary: '#d97706',
      gradient: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
      label: 'Premium'
    },
    {
      primary: '#dc2626',
      gradient: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
      label: 'Ultimate'
    },
    {
      primary: '#059669',
      gradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
      label: 'Enterprise'
    }
  ];

  if (checkingUserPackage) {
    return (
      <Layout style={{ minHeight: '100vh', background: 'white' }}>
        <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Spin size="large" />
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ 
      minHeight: '130vh', 
      margin: '-25px', 
      background: 'white', 
      marginBottom: "-30px"

    }}>
      <Content>
        {/* Enhanced Hero Section */}
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
              <span style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>SUBSCRIPTION PLANS</span>
            </div>
            
            <Title level={1} style={{ 
              color: 'white', 
              fontSize: '48px', 
              marginBottom: '24px', 
              fontWeight: 700 
            }}>
              Choose Your Premium Plan
            </Title>
            
            <Paragraph style={{ 
              fontSize: '18px', 
              color: 'rgba(255, 255, 255, 0.9)', 
              maxWidth: '700px', 
              margin: '0 auto 32px', 
              lineHeight: 1.6 
            }}>
              Unlock exclusive features and maximize our system's potential. Select the package that best suits your needs and growth objectives with flexible, affordable options.
            </Paragraph>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '16px' 
            }}>
            </div>
          </div>
        </div>

        {/* Packages Section */}
        <div style={{ 
          padding: '0 24px', 
          maxWidth: 1200, 
          margin: '0 auto' 
        }}>
          {loading ? (
            <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
          ) : (
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              justifyContent: 'center', 
              gap: '24px' 
            }}>
              {packages.map((plan, index) => {
              const colorScheme = packageColors[index % packageColors.length];
              const isLoadingThisPackage = submitting && submittingPackageId === plan.id;
              const billingCycleText = getBillingCycleText(plan.billingCycle);

              return (
                <Card
                  key={plan.id}
                  style={{
                    width: 320,
                    borderRadius: '16px',
                    boxShadow: '0 15px 40px rgba(0,0,0,0.08)',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    border: 'none',
                    position: 'relative'
                  }}
                  bodyStyle={{ padding: 0 }}
                  hoverable
                >
                  <div style={{
                    background: colorScheme.gradient,
                    padding: '30px 20px 50px',
                    position: 'relative',
                    color: 'white'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: 10,
                      left: -30,
                      backgroundColor: colorScheme.primary,
                      color: 'white',
                      padding: '5px 30px',
                      transform: 'rotate(-45deg)',
                      fontWeight: 'bold',
                      zIndex: 1,
                      borderRadius: '0 0 5px 5px',
                      fontSize: 12
                    }}>
                      {colorScheme.label}
                    </div>

                    <Title level={1} style={{ 
                      color: 'white', 
                      margin: 0, 
                      fontWeight: 'bold' 
                    }}>
                      {new Intl.NumberFormat("vi-VN").format(plan.price)}
                      <span style={{ 
                        fontSize: 16, 
                        fontWeight: 'normal', 
                        verticalAlign: 'top' 
                      }}> VND</span>
                    </Title>
                    <Text style={{ 
                      fontSize: 14, 
                      color: 'rgba(255,255,255,0.8)' 
                    }}>
                      /{billingCycleText}
                    </Text>
                  </div>

                  <div style={{ padding: '24px 20px' }}>
                    <Title level={4} style={{ 
                      marginBottom: 20, 
                      color: '#1e3a8a' 
                    }}>
                      {plan.packageName}
                    </Title>

                    <ul style={{ 
                      listStyleType: 'none', 
                      padding: 0, 
                      margin: 0, 
                      textAlign: 'left', 
                      height: 200 
                    }}>
                      {Array.isArray(plan.description) ? (
                        plan.description.map((desc, idx) => (
                          <li key={idx} style={{ 
                            padding: "8px 0", 
                            fontSize: 14,
                            display: 'flex',
                            alignItems: 'center'
                          }}>
                            <CheckCircleOutlined style={{ 
                              color: colorScheme.primary, 
                              marginRight: 8 
                            }} />
                            {desc}
                          </li>
                        ))
                      ) : (
                        <li style={{ 
                          padding: "8px 0", 
                          fontSize: 14,
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          <CheckCircleOutlined style={{ 
                            color: colorScheme.primary, 
                            marginRight: 8 
                          }} />
                          {typeof plan.description === 'string' ? plan.description : 'Features included'}
                        </li>
                      )}
                      
                      <li style={{ 
                        padding: "8px 0", 
                        fontSize: 14,
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <CheckCircleOutlined style={{ 
                          color: colorScheme.primary, 
                          marginRight: 8 
                        }} />
                        Track up to {plan.maxChildrentAllowed} children
                      </li>                      
                    </ul>

                    <Button
                      type="primary"
                      block
                      loading={isLoadingThisPackage}
                      disabled={submitting}
                      style={{
                        marginTop: 30,
                        height: 52,
                        fontSize: 16,
                        fontWeight: 'bold',
                        background: colorScheme.gradient,
                        border: 'none',
                        borderRadius: 26,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onClick={() => handleSubscribe(plan.id, plan.price)}
                    >
                      Subscribe Now <ArrowRightOutlined style={{ marginLeft: 8 }} />
                    </Button>
                  </div>
                </Card>
              );
            })}

            </div>
          )}
        </div>
      </Content>
      
    </Layout>
  );
};

export default PremiumSubscriptionPage;