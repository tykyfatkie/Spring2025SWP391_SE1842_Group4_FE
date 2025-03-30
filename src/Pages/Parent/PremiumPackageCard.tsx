import React, { useState, useEffect } from 'react';
import { Typography, Button, Spin } from 'antd';
import { CrownOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

interface Package {
  packageId: string;
  packageName: string;
  priceAtSubscription: number;
  startDate: string;
  expireDate: string;
  maxChildrentAllowed: number; 
  status: number;
}

const PremiumPackageCard: React.FC = () => {
  const [userPackage, setUserPackage] = useState<Package | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserPackage = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token not found');
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
          throw new Error('Failed to fetch package data');
        }

        const data = await response.json();
        
        if (data.code === 200 && data.data && data.data.length > 0) {
          setUserPackage(data.data[0]);
        } else {
          setError('No package found');
        }
      } catch (error) {
        setError('Error fetching package data');
        console.error('Error fetching package:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPackage();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatPrice = (price: number) => {
    return (price / 1000).toFixed(3);
  };

  return (
    <div style={{ 
      marginBottom: '24px', 
      borderRadius: '16px', 
      overflow: 'hidden',
      border: 'none',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
    }}>
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
          {loading ? 'Loading...' : (userPackage ? `You are a ${userPackage.packageName} Member` : 'Premium Benefits')}
        </Title>
        <Paragraph style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px', marginBottom: '24px' }}>
          {loading ? (
            <Spin size="small" />
          ) : error ? (
            'Explore our premium plans for exclusive features.'
          ) : (
            userPackage ? 
            `Your subscription is valid until ${formatDate(userPackage.expireDate)}. Enjoy your premium benefits!` : 
            'Upgrade your account to access exclusive features and personalized advice.'
          )}
        </Paragraph>
      </div>
      
      <div style={{ padding: '24px', background: 'white' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin />
          </div>
        ) : error ? (
          <div>
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
                Explore Premium Plans
              </Button>
            </Link>
          </div>
        ) : (
          <div>
            {userPackage && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                  <Text strong>Plan Type:</Text>
                  <Text style={{ color: '#1e3a8a', fontWeight: 600 }}>{userPackage.packageName}</Text>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                  <Text strong>Subscription Fee:</Text>
                  <Text style={{ color: '#1e3a8a', fontWeight: 600 }}>{formatPrice(userPackage.priceAtSubscription)} VND</Text>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                  <Text strong>Max Children:</Text>
                  <Text style={{ color: '#1e3a8a', fontWeight: 600 }}>{userPackage.maxChildrentAllowed}</Text>
                </div>
                
                <div style={{ marginTop: '24px' }}>
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
              </div>
            )}
            {!userPackage && (
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
                  Explore Premium Plans
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PremiumPackageCard;