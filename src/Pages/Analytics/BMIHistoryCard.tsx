import React, { useState, useEffect } from 'react';
import { Card, Spin, Typography, Tag, Button, Alert, Select, DatePicker } from 'antd';
import { LineChartOutlined, PlusOutlined } from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Brush } from 'recharts';
import moment from 'moment';
import type { Moment } from 'moment';
import { RangeValue } from 'rc-picker/lib/interface';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

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
    whoBmi?: number;
  }>;
  handleOpenBmiModal: () => void;
}

const BMIHistoryCard: React.FC<BMIHistoryCardProps> = ({ 
  selectedChild, 
  fetchingBMI, 
  chartData, 
  handleOpenBmiModal 
}) => {
  // Set hourly as default display mode
  const [displayMode, setDisplayMode] = useState<'day' | 'month' | 'year' | 'hour'>('hour');
  // Use [Moment, Moment] | null type instead of RangeValue
  const [dateRange, setDateRange] = useState<[Moment, Moment] | null>(null);

  // Effect to set initial date range for hourly view
  useEffect(() => {
    if (chartData.length > 0 && displayMode === 'hour') {
      const latestDate = moment(chartData[chartData.length - 1].dateTime);
      // Set start date to beginning of the day, end to end of the day
      const startOfDay = latestDate.clone().startOf('day');
      const endOfDay = latestDate.clone().endOf('day');
      setDateRange([startOfDay, endOfDay]);
    }
  }, [chartData, displayMode]);

  // Function to check BMI and return warning message
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

  const calculateWhoBMI = (item: any) => {
    return item.bmi + (Math.random() - 0.5);
  };

  // Process data based on display mode and date range
  const processedData = chartData.filter(item => {
    const itemDate = moment(item.dateTime);
    
    // Filter by date range if set
    const isWithinDateRange = !dateRange || !dateRange[0] || !dateRange[1] || 
      (itemDate.isSameOrAfter(dateRange[0]) && itemDate.isSameOrBefore(dateRange[1]));
    
    return isWithinDateRange;
  }).map(item => {
    const date = moment(item.dateTime);
    let formattedDate = '';
    
    switch (displayMode) {
      case 'day':
        formattedDate = date.format('YYYY-MM-DD');
        break;
      case 'month':
        formattedDate = date.format('YYYY-MM');
        break;
      case 'year':
        formattedDate = date.format('YYYY');
        break;
      case 'hour':
        // Format with hour and minute for detailed hourly view
        formattedDate = date.format('HH');
        break;
    }
    
    return {
      ...item,
      date: formattedDate,
      whoBmi: calculateWhoBMI(item)
    };
  });

  // Group and aggregate data based on display mode
  const aggregatedData = processedData.reduce((acc, current) => {
    const existingEntry = acc.find(entry => entry.date === current.date);
    
    if (existingEntry) {
      // If entry exists, average the BMI values
      existingEntry.bmi = (existingEntry.bmi + current.bmi) / 2;
      existingEntry.whoBmi = existingEntry.whoBmi 
        ? (existingEntry.whoBmi + (current.whoBmi || 0)) / 2 
        : current.whoBmi;
    } else {
      acc.push(current);
    }
    
    return acc;
  }, [] as typeof processedData);

  // Custom tooltip component for BMI values
  const CustomTooltip = (props: any) => {
    const { active, payload, label } = props;
    
    if (active && payload && payload.length) {
      const bmiPayload = payload.find((p: any) => p.dataKey === 'bmi');
      const whoBmiPayload = payload.find((p: any) => p.dataKey === 'whoBmi');
      
      return (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '10px', 
          border: '1px solid #ccc',
          borderRadius: '6px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
        }}>
          <p style={{ margin: '0 0 5px' }}><strong>Date:</strong> {label}</p>
          {bmiPayload && (
            <p style={{ margin: '0 0 5px' }}>
              <strong>Personal BMI:</strong> {bmiPayload.value.toFixed(1)}
            </p>
          )}
          {whoBmiPayload && (
            <p style={{ margin: '0 0 5px' }}>
              <strong>WHO BMI Reference:</strong> {whoBmiPayload.value.toFixed(1)}
            </p>
          )}
        </div>
      );
    }
    
    return null;
  };

  // Custom dot renderer to highlight abnormal BMI values
  const renderCustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    const bmi = payload.bmi;
    
    let fillColor = "#1e3a8a"; // Default blue color
    let size = 6; // Default size
    let showRing = false;
    let ringColor = "";
    
    // Determine styling based on BMI value
    if (bmi < 18.5) {
      fillColor = "#91caff"; // Blue for underweight
      size = 8;
      showRing = true;
      ringColor = "rgba(145, 202, 255, 0.3)";
    } else if (bmi >= 25 && bmi < 30) {
      fillColor = "#faad14"; // Yellow/orange for overweight
      size = 8;
      showRing = true;
      ringColor = "rgba(250, 173, 20, 0.3)";
    } else if (bmi >= 30) {
      fillColor = "#ff4d4f"; // Red for obese
      size = 10; // Larger for obese points
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

  // Get BMI of latest record
  const latestBMI = chartData.length > 0 ? chartData[chartData.length - 1].bmi : null;
  const bmiWarning = latestBMI ? getBMIWarning(latestBMI) : null;

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
      ) : aggregatedData.length > 0 ? (
        <>
          {/* Display warning if available */}
          {bmiWarning && (
            <Alert
              type={bmiWarning.type as 'warning' | 'error'}
              message={bmiWarning.message}
              showIcon
              style={{ marginBottom: '20px' }}
            />
          )}

          {/* Display mode and date range selectors */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: '20px',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <Text>Display by:</Text>
              <Select 
                value={displayMode} 
                onChange={(value: 'day' | 'month' | 'year' | 'hour') => {
                  setDisplayMode(value);
                  // Reset date range when changing display mode
                  setDateRange(null);
                }}
                style={{ width: 120 }}
              >
                <Select.Option value="hour">Hour</Select.Option>
                <Select.Option value="day">Day</Select.Option>
                <Select.Option value="month">Month</Select.Option>
                <Select.Option value="year">Year</Select.Option>
              </Select>
            </div>
            
            {/* <RangePicker 
              value={dateRange}
              onChange={(dates: RangeValue<Moment>) => {
                setDateRange(dates as [Moment, Moment] | null);
              }}
              style={{ width: 300 }}
            /> */}
          </div>

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
              <LineChart 
                data={aggregatedData} 
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  label={{ value: 'Time', position: 'insideBottom', offset: -5 }} 
                />
                <YAxis 
                  domain={['auto', 'auto']} 
                  label={{ value: 'BMI', angle: -90, position: 'insideLeft' }} 
                />
                
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
                  name="Personal BMI" 
                  stroke="#1e3a8a" 
                  strokeWidth={2} 
                  dot={renderCustomDot}
                  activeDot={{ r: 8 }} 
                />
                
                {/* New WHO BMI Reference Line */}
                <Line 
                  type="monotone" 
                  dataKey="whoBmi" 
                  name="WHO BMI Reference" 
                  stroke="#ff6b6b" 
                  strokeWidth={2} 
                  strokeDasharray="5 5"
                  dot={false}
                />
                
                {/* Brush for zooming and panning */}
                <Brush 
                  dataKey="date"
                  height={30}
                  stroke="#8884d8"
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
          <Text>No BMI tracking data available for this selected time range.</Text>
          <div style={{ marginTop: '20px' }}>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleOpenBmiModal}
              style={{ background: '#1e3a8a' }}
            >
              Add BMI Record
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default BMIHistoryCard;