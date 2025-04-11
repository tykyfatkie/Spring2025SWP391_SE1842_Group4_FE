import React, { useEffect } from 'react';
import { Card, Select, Spin, Button, Typography, Space } from 'antd';
import { PlusOutlined, LineChartOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import BMIPDFExport from './BMIPDFExport';
import SingleBMIExport from './SingleBMIExport';

const { Option } = Select;
const { Title, Paragraph } = Typography;

interface Child {
  id: string;
  name: string;
  doB: string;  
  gender: number;  
  weight: number;
  height: number;
  bmi: number;
  bmiPercentile: number;
}

interface ChartData {
  id: string;
  dateTime: string;
  date: string;
  bmi: number;
  weight: number;
  height: number;
  percentile: number;
}

interface ChildSelectorCardProps {
  loading: boolean;
  children: Child[];
  selectedChild: string | null;
  setSelectedChild: (childId: string) => void;
  selectedChildData: Child | null;
  chartData: ChartData[];
  handleOpenBmiModal: () => void;
}

// Helper function to calculate age in months
const calculateAgeInMonths = (dateOfBirth: string): number => {
  const birthDate = new Date(dateOfBirth);
  const currentDate = new Date();
  
  const years = currentDate.getFullYear() - birthDate.getFullYear();
  const months = currentDate.getMonth() - birthDate.getMonth();
  
  return years * 12 + months;
};

// Helper function to get gender label
const getGenderLabel = (genderCode: number): string => {
  switch(genderCode) {
    case 0: return 'Male';
    case 1: return 'Female';
    default: return 'Unknown';
  }
};

const ChildSelectorCard: React.FC<ChildSelectorCardProps> = ({
  loading,
  children,
  selectedChild,
  setSelectedChild,
  selectedChildData,
  chartData,
  handleOpenBmiModal
}) => {
  const location = useLocation();
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const childId = searchParams.get('childId');
    
    if (childId && children.some(child => child.id === childId)) {
      setSelectedChild(childId);
    }
  }, [location, children, setSelectedChild]);

  return (
    <Card 
      title={
        <div style={{ padding: '8px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              background: 'rgba(30, 58, 138, 0.1)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginRight: '16px' 
            }}>
              <LineChartOutlined style={{ fontSize: '20px', color: '#1e3a8a' }} />
            </div>
            <Title level={4} style={{ margin: 0, color: '#1e3a8a' }}>Select Child</Title>
          </div>
        </div>
      }
      style={{ 
        borderRadius: '16px', 
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
        border: 'none',
        height: '100%'
      }}
      headStyle={{ 
        borderBottom: '1px solid #f0f0f0',
        padding: '16px 24px'
      }}
      bodyStyle={{ padding: '24px' }}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Paragraph style={{ marginBottom: '20px', color: '#4b5563' }}>
            Select a child to view their BMI history and track their growth over time.
          </Paragraph>
          <Select
            placeholder="Select a child"
            style={{ width: '100%', borderRadius: '8px', height: '45px', marginBottom: '20px' }}
            onChange={(value) => setSelectedChild(value)}
            value={selectedChild}
            size="large"
            optionLabelProp="label"
          >
            {children.map((child) => (
              <Option 
                key={child.id} 
                value={child.id}
                label={child.name}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{child.name}</span>
                  <span style={{ color: '#888' }}>
                    {calculateAgeInMonths(child.doB)} months | {getGenderLabel(child.gender)}
                  </span>
                </div>
              </Option>
            ))}
          </Select>
          
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              size="large" 
              style={{ width: '100%', height: '45px', borderRadius: '8px' }}
              onClick={handleOpenBmiModal}
              disabled={!selectedChild}
            >
              Add New BMI Record
            </Button>
            
            {/* BMI Export options */}
            {selectedChild && selectedChildData && (
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <BMIPDFExport 
                  childData={selectedChildData} 
                  bmiRecords={chartData}
                />
                
                {/* Add the single record export button if there are records */}
                {chartData.length > 0 && (
                  <SingleBMIExport 
                    childData={selectedChildData}
                    bmiRecord={chartData[chartData.length - 1]} // Use the most recent record
                  />
                )}
              </Space>
            )}
          </Space>
        </>
      )}
    </Card>
  );
};

export default ChildSelectorCard;