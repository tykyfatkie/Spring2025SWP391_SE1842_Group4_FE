import React, { useState, useEffect } from 'react';
import { Tag, Spin } from 'antd';
import { CrownOutlined } from '@ant-design/icons';

interface Package {
  packageId: string;
  packageName: string;
  priceAtSubscription: number;
  startDate: string;
  expireDate: string;
  maxChildrenAllowed: number;
  status: number;
}

const PremiumMemberDisplay: React.FC = () => {
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
      } catch (error: any) {
        setError('Error fetching package data');
        console.error('Error fetching package:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPackage();
  }, []);

  if (loading) {
    return (
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
        <Spin size="small" style={{ marginRight: '6px' }} /> Loading...
      </Tag>
    );
  }

  // Optionally display an error message if there's an error
  if (error) {
    return (
      <Tag 
        color="#fff1f2" 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          padding: '4px 12px', 
          borderRadius: '20px',
          color: '#881337',
          fontWeight: 600
        }}
      >
        Basic Member
      </Tag>
    );
  }

  return (
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
      <CrownOutlined style={{ marginRight: '6px', color: '#fbbf24' }} /> 
      {userPackage ? `${userPackage.packageName} Member` : 'Basic Member'}
    </Tag>
  );
};

export default PremiumMemberDisplay;