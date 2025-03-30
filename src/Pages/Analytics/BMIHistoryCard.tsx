// Trong file BMITrackingPage.tsx, cần sửa hàm fetchBMIData để lấy dữ liệu BMI:

const fetchBMIData = async (childId: string) => {
  setFetchingBMI(true);
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      message.error("Authentication token missing. Please login again.");
      return;
    }
    
    const response = await axios.get(
      `${import.meta.env.VITE_API_ENDPOINT}/bmi/getByChildId`,
      {
        params: { childId },
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    if (response.data?.data && Array.isArray(response.data.data)) {
      // Format and transform the data
      const formattedData = response.data.data.map((item: BMIRecord) => ({
        dateTime: item.createdAt,
        date: moment(item.createdAt).format('YYYY-MM-DD'),
        bmi: item.bmi,
        weight: item.weight,
        height: item.height,
        percentile: item.bmiPercentile
      }));
      
      // Sort data by date
      const sortedData = formattedData.sort((a, b) => 
        new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
      );
      
      setChartData(sortedData);
    } else {
      setChartData([]);
    }
  } catch (error: any) {
    console.error("Error fetching BMI data:", error);
    message.error(error.response?.data?.message || "Failed to load BMI data");
    setChartData([]);
  } finally {
    setFetchingBMI(false);
  }
};

// Chỉnh sửa BMIHistoryCard.tsx để cải thiện hiển thị và chức năng lọc:

import React, { useState, useEffect } from 'react';
import { Card, Spin, Typography, Tag, Button, Alert, DatePicker, Space, Slider, Empty } from 'antd';
import { LineChartOutlined, PlusOutlined, FilterOutlined } from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import moment from 'moment';

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
  }>;
  handleOpenBmiModal: () => void;
}

const BMIHistoryCard: React.FC<BMIHistoryCardProps> = ({ selectedChild, fetchingBMI, chartData, handleOpenBmiModal }) => {
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState<[moment.Moment | null, moment.Moment | null] | null>(null);
  const [sliderRange, setSliderRange] = useState<[number, number]>([0, 100]);
  const [showFilters, setShowFilters] = useState(false);
  const [maxDays, setMaxDays] = useState(0);

  // Process data to show only most recent entry per day
  useEffect(() => {
    if (chartData.length > 0) {
      // Group by date and take most recent entry per day
      const dailyData = chartData.reduce((acc: any, current: any) => {
        const date = current.date;
        
        if (!acc[date] || new Date(current.dateTime) > new Date(acc[date].dateTime)) {
          acc[date] = current;
        }
        
        return acc;
      }, {});
      
      // Convert back to array
      let processedData = Object.values(dailyData);
      
      // Apply date filtering if range is selected
      if (dateRange && dateRange[0] && dateRange[1]) {
        processedData = processedData.filter((item: any) => {
          const itemDate = moment(item.date, "YYYY-MM-DD");
          return itemDate.isSameOrAfter(dateRange[0], 'day') && 
                 itemDate.isSameOrBefore(dateRange[1], 'day');
        });
      }
      
      // Sort by date
      processedData = processedData.sort((a: any, b: any) => 
        new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
      );
      
      setFilteredData(processedData);
      
      // Calculate max days for slider
      if (processedData.length > 1) {
        const firstDate = moment(processedData[0].date);
        const lastDate = moment(processedData[processedData.length - 1].date);
        setMaxDays(lastDate.diff(firstDate, 'days'));
      } else {
        setMaxDays(0);
      }
    } else {
      setFilteredData([]);
      setMaxDays(0);
    }
  }, [chartData, dateRange]);

  // Initialize date range when chart data changes
  useEffect(() => {
    if (chartData.length > 0 && !dateRange) {
      // Default to showing all data
      const firstDate = moment(chartData[0].date);
      const lastDate = moment(chartData[chartData.length - 1].date);
      
      if (firstDate.isBefore(lastDate)) {
        setDateRange([firstDate, lastDate]);
      }
    }
  }, [chartData]);

  const handleDateRangeChange = (dates: any) => {
    setDateRange(dates);
  };

  const handleSliderChange = (range: [number, number]) => {
    if (filteredData.length > 0) {
      const startDate = moment(filteredData[0].date).add(range[0], 'days');
      const endDate = moment(filteredData[0].date).add(range[1], 'days');
      setDateRange([startDate, endDate]);
    }
  };

  const resetFilters = () => {
    if (chartData.length > 0) {
      const firstDate = moment(chartData[0].date);
      const lastDate = moment(chartData[chartData.length - 1].date);
      setDateRange([firstDate, lastDate]);
    } else {
      setDateRange(null);
    }
  };

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

  const latestBMI = filteredData.length > 0 ? filteredData[filteredData.length - 1].bmi : null;
  const bmiWarning = latestBMI ? getBMIWarning(latestBMI) : null;

  const CustomTooltip = (props: any) => {
    const { active, payload, label } = props;
    
    if (active && payload && payload.length) {
      const bmi = payload[0].value;
      const dataPoint = filteredData.find(item => item.date === label);
      
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
          {dataPoint && (
            <>
              <p style={{ margin: '0 0 5px' }}><strong>Weight:</strong> {dataPoint.weight} kg</p>
              <p style={{ margin: '0 0 5px' }}><strong>Height:</strong> {dataPoint.height} cm</p>
            </>
          )}
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
            <div>
              {filteredData.length > 0 && (
                <Button 
                  icon={<FilterOutlined />} 
                  onClick={() => setShowFilters(!showFilters)}
                  type={showFilters ? "primary" : "default"}
                  style={showFilters ? { background: '#1e3a8a' } : {}}
                >
                  Filter
                </Button>
              )}
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={handleOpenBmiModal}
                style={{ background: '#1e3a8a', marginLeft: '8px' }}
              >
                Add BMI
              </Button>
            </div>
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
      {showFilters && filteredData.length > 0 && (
        <div style={{ 
          marginBottom: '20px', 
          background: 'rgba(30, 58, 138, 0.05)', 
          padding: '16px', 
          borderRadius: '12px' 
        }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text strong>Date Range Filter:</Text>
              <Button size="small" onClick={resetFilters}>Reset</Button>
            </div>
            <RangePicker 
              style={{ width: '100%' }} 
              value={dateRange}
              onChange={handleDateRangeChange}
              allowClear
            />
            {maxDays > 5 && (
              <div style={{ marginTop: '10px' }}>
                <Text strong>Quick Range Selector:</Text>
                <Slider 
                  range 
                  value={[
                    dateRange && dateRange[0] && filteredData.length > 0 ? 
                      moment(dateRange[0]).diff(moment(filteredData[0].date), 'days') : 0,
                    dateRange && dateRange[1] && filteredData.length > 0 ? 
                      moment(dateRange[1]).diff(moment(filteredData[0].date), 'days') : 
                      maxDays
                  ]}
                  min={0} 
                  max={maxDays} 
                  onChange={handleSliderChange}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6b7280' }}>
                  <span>{filteredData.length > 0 ? filteredData[0].date : ''}</span>
                  <span>{filteredData.length > 0 ? filteredData[filteredData.length - 1].date : ''}</span>
                </div>
              </div>
            )}
          </Space>
        </div>
      )}

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
      ) : filteredData.length > 0 ? (
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
              <LineChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  label={{ value: 'Date', position: 'insideBottom', offset: -5 }}
                  tickFormatter={(value) => moment(value).format('DD/MM')}
                />
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
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Text>No BMI tracking data available for this child.</Text>
            }
          />
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