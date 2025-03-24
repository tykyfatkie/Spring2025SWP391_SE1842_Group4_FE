import React from 'react';
import { Row, Col, Card, Spin, Typography, Tag, Button } from 'antd';
import { CheckCircleOutlined, LineChartOutlined, PlusOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface ChartData {
  dateTime: string;
  date: string;
  bmi: number;
  weight: number;
  height: number;
  percentile: number;
}

interface BMIDetailsCardProps {
  selectedChild: string | null;
  chartData: ChartData[];
  fetchingBMI: boolean;
  handleOpenBmiModal: () => void;
  getBMICategory: (bmi: number) => { label: string; color: string };
}

const BMIDetailsCard: React.FC<BMIDetailsCardProps> = ({
  selectedChild,
  chartData,
  fetchingBMI,
  handleOpenBmiModal,
  getBMICategory
}) => {
  // Remove the condition that returns null when selectedChild is not set
  // Instead, we'll show an empty state message in the card

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
            // Show this message when no child is selected
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
          ) : chartData.length > 0 ? (
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
                  }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((record, index) => {
                  const category = getBMICategory(record.bmi);
                  return (
                    <tr key={index} style={{ background: index % 2 === 0 ? '#f8fafc' : 'white' }}>
                      <td style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>{record.date}</td>
                      <td style={{ textAlign: 'center', padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>{record.weight.toFixed(1)}</td>
                      <td style={{ textAlign: 'center', padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>{record.height.toFixed(1)}</td>
                      <td style={{ textAlign: 'center', padding: '12px 16px', borderBottom: '1px solid #f0f0f0', fontWeight: 600 }}>{record.bmi.toFixed(1)}</td>
                      <td style={{ textAlign: 'center', padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
                        <Tag color={category.color} style={{ borderRadius: '20px', padding: '0 12px' }}>
                          {category.label}
                        </Tag>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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