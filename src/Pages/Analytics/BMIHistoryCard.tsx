import React from 'react';
import { Card, Spin, Typography, Tag, Button, Alert } from 'antd';
import { LineChartOutlined, PlusOutlined } from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

const { Title, Text } = Typography;

interface BMIHistoryCardProps {
  selectedChild: string | null;
  fetchingBMI: boolean;
  chartData: Array<{
    dateTime: string;
    date: string;
    bmi: number;
    weight: number;
    height: number;
    percentile: number;
  }>;
  handleOpenBmiModal: () => void;
}

const BMIHistoryCard: React.FC<BMIHistoryCardProps> = ({ selectedChild, fetchingBMI, chartData, handleOpenBmiModal }) => {

  const getBMIWarning = (bmi: number) => {
    if (bmi < 18.5) {
      return {
        type: 'warning',
        message: 'The child is underweight (BMI < 18.5). Please consult a healthcare professional.',
      };
    } else if (bmi >= 30) {
      return {
        type: 'error',
        message: 'The child is obese (BMI ≥ 30). Please consult a healthcare professional.',
      };
    }
    return null;
  };


  const latestBMI = chartData.length > 0 ? chartData[chartData.length - 1].bmi : null;
  const bmiWarning = latestBMI ? getBMIWarning(latestBMI) : null;


  const CustomTooltip = (props: any) => {
    const { active, payload, label } = props;
    
    if (active && payload && payload.length) {
      const bmi = payload[0].value;
      let statusText = "Normal";
      let statusColor = "#52c41a"; 
      
      if (bmi < 18.5) {
        statusText = "Underweight";
        statusColor = "#91caff"; 
      } else if (bmi >= 25 && bmi < 30) {
        statusText = "Overweight";
        statusColor = "#faad14"; 
      } else if (bmi >= 30) {
        statusText = "Obese";
        statusColor = "#ff4d4f"; 
      }
      
      return (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '10px', 
          border: '1px solid #ccc',
          borderRadius: '6px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
        }}>
          <p style={{ margin: '0 0 5px' }}><strong>Date:</strong> {label}</p>
          <p style={{ margin: '0 0 5px' }}><strong>BMI:</strong> {bmi.toFixed(1)}</p>
          <div style={{ 
            backgroundColor: statusColor, 
            color: 'white', 
            padding: '2px 8px', 
            borderRadius: '10px', 
            display: 'inline-block',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            {statusText}
          </div>
        </div>
      );
    }
    
    return null;
  };


  const renderCustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    const bmi = payload.bmi;
    
    let fillColor = "#1e3a8a"; 
    let size = 6; 
    let showRing = false;
    let ringColor = "";
    

    if (bmi < 18.5) {
      fillColor = "#91caff"; 
      size = 8;
      showRing = true;
      ringColor = "rgba(145, 202, 255, 0.3)";
    } else if (bmi >= 25 && bmi < 30) {
      fillColor = "#faad14"; 
      size = 8;
      showRing = true;
      ringColor = "rgba(250, 173, 20, 0.3)";
    } else if (bmi >= 30) {
      fillColor = "#ff4d4f"; 
      size = 10; 
      showRing = true;
      ringColor = "rgba(255, 77, 79, 0.3)";
    }
    
    return (
      <g>
        {showRing && (
          <circle cx={cx} cy={cy} r={size * 1.8} fill={ringColor} />
        )}
        <circle cx={cx} cy={cy} r={size} fill={fillColor} />
      </g>
    );
  };

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
            <Title level={4} style={{ margin: 0, color: '#1e3a8a' }}>BMI History</Title>
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
            No health records available
          </Text>
          <Text style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px' }}>
            Please select a child to view their BMI history
          </Text>
        </div>
      ) : fetchingBMI ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : chartData.length > 0 ? (
        <>

          {bmiWarning && (
            <Alert
              type={bmiWarning.type as 'warning' | 'error'}
              message={bmiWarning.message}
              showIcon
              style={{ marginBottom: '20px' }}
            />
          )}

          <div style={{ 
            marginBottom: '20px', 
            background: 'rgba(30, 58, 138, 0.05)', 
            padding: '16px', 
            borderRadius: '12px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <Text strong style={{ marginRight: '12px', fontSize: '14px' }}>BMI Categories: </Text>
            <Tag color="#91caff" style={{ borderRadius: '20px', padding: '0 12px' }}>Underweight (&lt; 18.5)</Tag>
            <Tag color="#52c41a" style={{ borderRadius: '20px', padding: '0 12px' }}>Normal (18.5-24.9)</Tag>
            <Tag color="#faad14" style={{ borderRadius: '20px', padding: '0 12px' }}>Overweight (25-29.9)</Tag>
            <Tag color="#ff4d4f" style={{ borderRadius: '20px', padding: '0 12px' }}>Obese (&ge; 30)</Tag>
          </div>

          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            padding: '24px', 
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' 
          }}>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" label={{ value: 'Date', position: 'insideBottom', offset: -5 }} />
                <YAxis domain={['auto', 'auto']} label={{ value: 'BMI', angle: -90, position: 'insideLeft' }} />
                

                <ReferenceLine 
                  y={18.5} 
                  stroke="#91caff" 
                  strokeDasharray="3 3" 
                  label={{ 
                    value: 'Underweight', 
                    position: 'insideBottomLeft', 
                    fill: '#91caff',
                    fontSize: 12
                  }} 
                />
                <ReferenceLine 
                  y={25} 
                  stroke="#faad14" 
                  strokeDasharray="3 3" 
                  label={{ 
                    value: 'Overweight', 
                    position: 'insideBottomLeft', 
                    fill: '#faad14',
                    fontSize: 12
                  }} 
                />
                <ReferenceLine 
                  y={30} 
                  stroke="#ff4d4f" 
                  strokeDasharray="3 3" 
                  label={{ 
                    value: 'Obese', 
                    position: 'insideTopLeft', 
                    fill: '#ff4d4f',
                    fontSize: 12
                  }} 
                />
                
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="bmi" 
                  name="BMI" 
                  stroke="#1e3a8a" 
                  strokeWidth={2} 
                  dot={renderCustomDot}
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: '50px',
          background: 'rgba(30, 58, 138, 0.05)',
          borderRadius: '12px'
        }}>
          <Text>No BMI tracking data available for this child.</Text>
          <div style={{ marginTop: '20px' }}>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleOpenBmiModal}
              style={{ background: '#1e3a8a' }}
            >
              Add First BMI Record
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default BMIHistoryCard;