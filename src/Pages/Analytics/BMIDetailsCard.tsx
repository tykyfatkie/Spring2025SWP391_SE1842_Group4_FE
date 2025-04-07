import React from 'react';
import { Row, Col, Card, Spin, Typography, Tag, Button } from 'antd';
import { CheckCircleOutlined, LineChartOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title, Text } = Typography;

interface ChartData {
  dateTime: string;
  date: string;
  bmi: number;
  weight: number;
  height: number;
  percentile: number;
  ageInMonths?: number; 
}

interface BMIDetailsCardProps {
  selectedChild: string | null;
  selectedGender?: 'male' | 'female'; 
  chartData: ChartData[];
  fetchingBMI: boolean;
  handleOpenBmiModal: () => void;
  selectedChildDOB?: string;
}

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

const whoZScoreOffsets = {
  severelyUnderweight: -3,  
  underweight: -2,          
  normal: {                 
    min: -2,
    max: 1
  },
  overweight: 2,            
  obese: 3                 
};

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
    underweight: median + (whoZScoreOffsets.underweight * estimatedSD),
    overweight: median + (whoZScoreOffsets.overweight * estimatedSD),
    obese: median + (whoZScoreOffsets.obese * estimatedSD)
  };
};

const getWHOBmiCategory = (bmi: number, ageInMonths: number, gender: 'male' | 'female'): { 
  category: 'severely-underweight' | 'underweight' | 'normal' | 'overweight' | 'obese';
  color: string;
  label: string;
  whoBmiReference?: number;
  whoBmiRange?: string;
} => {
  const references = getWhoZScoreReferences(ageInMonths, gender);
  const whoBmiReference = references.median;
  
  if (bmi < references.underweight) {
    return { 
      category: 'underweight',
      label: 'Underweight', 
      color: '#91caff',  // Blue
      whoBmiReference,
      whoBmiRange: `< ${references.underweight.toFixed(1)}`
    };
  } else if (bmi >= references.obese) {
    return { 
      category: 'obese',
      label: 'Obese', 
      color: '#ff4d4f',  // Red
      whoBmiReference,
      whoBmiRange: `≥ ${references.obese.toFixed(1)}`
    };
  } else if (bmi >= references.overweight) {
    return { 
      category: 'overweight',
      label: 'Overweight', 
      color: '#faad14',  // Yellow/Orange
      whoBmiReference,
      whoBmiRange: `${references.overweight.toFixed(1)}-${references.obese.toFixed(1)}`
    };
  } else {
    return { 
      category: 'normal',
      label: 'Normal', 
      color: '#52c41a',  // Green
      whoBmiReference,
      whoBmiRange: `${references.underweight.toFixed(1)}-${references.overweight.toFixed(1)}`
    };
  }
};

const calculateAgeInMonths = (dateTime: string, dateOfBirth: string): number => {
  const measurementDate = moment(dateTime);
  const childDOB = moment(dateOfBirth);
  
  return measurementDate.diff(childDOB, 'months');
};

const BMIDetailsCard: React.FC<BMIDetailsCardProps> = ({
  selectedChild,
  selectedGender = 'male', 
  chartData,
  fetchingBMI,
  handleOpenBmiModal,
  selectedChildDOB
}) => {
  // Process data to include WHO reference values
  const processedData = chartData.map(record => {
    const ageInMonths = record.ageInMonths || 
      (selectedChildDOB ? calculateAgeInMonths(record.dateTime, selectedChildDOB) : 0);
    
    const bmiCategory = getWHOBmiCategory(record.bmi, ageInMonths, selectedGender);
    
    return {
      ...record,
      ageInMonths,
      bmiCategory
    };
  });

  return (
    <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
      <Col xs={24}>
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
                  <CheckCircleOutlined style={{ fontSize: '20px', color: '#1e3a8a' }} />
                </div>
                <Title level={4} style={{ margin: 0, color: '#1e3a8a' }}>BMI Details</Title>
              </div>
            </div>
          }
          style={{ 
            borderRadius: '16px', 
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
            border: 'none'
          }}
          headStyle={{ 
            borderBottom: '1px solid #f0f0f0',
            padding: '16px 24px'
          }}
          bodyStyle={{ padding: '24px' }}
        >
          {!selectedChild ? (
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '50px 20px',
              background: 'rgba(30, 58, 138, 0.05)',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                borderRadius: '50%', 
                background: 'rgba(30, 58, 138, 0.1)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginBottom: '16px' 
              }}>
                <LineChartOutlined style={{ fontSize: '32px', color: '#1e3a8a' }} />
              </div>
              <Text style={{ fontSize: '16px', color: '#4b5563', fontWeight: '500' }}>
                Please select a child first
              </Text>
              <Text style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px' }}>
                Select a child above to view their BMI records
              </Text>
            </div>
          ) : fetchingBMI ? (
            <div style={{ textAlign: 'center', padding: '50px 0' }}>
              <Spin size="large" />
            </div>
          ) : processedData.length > 0 ? (
            <>
              <div style={{ 
                marginBottom: '20px', 
                background: 'rgba(30, 58, 138, 0.05)', 
                padding: '16px', 
                borderRadius: '12px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                <Text strong style={{ marginRight: '12px', fontSize: '14px' }}>WHO BMI Categories: </Text>
                <Tag color="#91caff" style={{ borderRadius: '20px', padding: '0 12px' }}>Underweight (&lt; -2 SD)</Tag>
                <Tag color="#52c41a" style={{ borderRadius: '20px', padding: '0 12px' }}>Normal (-2 SD to +1 SD)</Tag>
                <Tag color="#faad14" style={{ borderRadius: '20px', padding: '0 12px' }}>Overweight (+1 SD to +2 SD)</Tag>
                <Tag color="#ff4d4f" style={{ borderRadius: '20px', padding: '0 12px' }}>Obese (&gt; +2 SD)</Tag>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ 
                      textAlign: 'left', 
                      padding: '12px 16px', 
                      borderBottom: '1px solid #f0f0f0',
                      color: '#1e3a8a',
                      fontWeight: 600
                    }}>Date</th>
                    <th style={{ 
                      textAlign: 'center', 
                      padding: '12px 16px', 
                      borderBottom: '1px solid #f0f0f0',
                      color: '#1e3a8a',
                      fontWeight: 600
                    }}>Weight (kg)</th>
                    <th style={{ 
                      textAlign: 'center', 
                      padding: '12px 16px', 
                      borderBottom: '1px solid #f0f0f0',
                      color: '#1e3a8a',
                      fontWeight: 600
                    }}>Height (cm)</th>
                    <th style={{ 
                      textAlign: 'center', 
                      padding: '12px 16px', 
                      borderBottom: '1px solid #f0f0f0',
                      color: '#1e3a8a',
                      fontWeight: 600
                    }}>BMI</th>
                    <th style={{ 
                      textAlign: 'center', 
                      padding: '12px 16px', 
                      borderBottom: '1px solid #f0f0f0',
                      color: '#1e3a8a',
                      fontWeight: 600
                    }}>WHO Ref.</th>
                    <th style={{ 
                      textAlign: 'center', 
                      padding: '12px 16px', 
                      borderBottom: '1px solid #f0f0f0',
                      color: '#1e3a8a',
                      fontWeight: 600
                    }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {processedData.map((record, index) => {
                    const { bmiCategory } = record;
                    
                    return (
                      <tr key={index} style={{ background: index % 2 === 0 ? '#f8fafc' : 'white' }}>
                        <td style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>{record.date}</td>
                        <td style={{ textAlign: 'center', padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>{record.weight.toFixed(1)}</td>
                        <td style={{ textAlign: 'center', padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>{record.height.toFixed(1)}</td>
                        <td style={{ 
                          textAlign: 'center', 
                          padding: '12px 16px', 
                          borderBottom: '1px solid #f0f0f0', 
                          fontWeight: 600,
                          backgroundColor: `${bmiCategory.color}15` // Light background matching status color
                        }}>
                          {record.bmi.toFixed(1)}
                        </td>
                        <td style={{ 
                          textAlign: 'center', 
                          padding: '12px 16px', 
                          borderBottom: '1px solid #f0f0f0'
                        }}>
                          {bmiCategory.whoBmiReference?.toFixed(1)} 
                          <div style={{ fontSize: '11px', color: '#6b7280' }}>
                            ({bmiCategory.whoBmiRange})
                          </div>
                        </td>
                        <td style={{ textAlign: 'center', padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
                          <Tag color={bmiCategory.color} style={{ borderRadius: '20px', padding: '0 12px' }}>
                            {bmiCategory.label}
                          </Tag>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          ) : (
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '50px 20px',
              background: 'rgba(30, 58, 138, 0.05)',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                borderRadius: '50%', 
                background: 'rgba(30, 58, 138, 0.1)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginBottom: '16px' 
              }}>
                <LineChartOutlined style={{ fontSize: '32px', color: '#1e3a8a' }} />
              </div>
              <Text style={{ fontSize: '16px', color: '#4b5563', fontWeight: '500' }}>
                No growth records found
              </Text>
              <Text style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px' }}>
                Add your first BMI record to start tracking growth patterns
              </Text>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                style={{ marginTop: '24px', background: '#1e3a8a' }}
                onClick={handleOpenBmiModal}
              >
                Add First BMI Record
              </Button>
            </div>
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default BMIDetailsCard;