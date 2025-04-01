import React, { useState, useEffect } from 'react';
import { Card, Spin, Typography, Tag, Button, Alert, Select, DatePicker } from 'antd';
import { LineChartOutlined, PlusOutlined } from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Brush } from 'recharts';
import moment from 'moment';
import type { RangePickerProps } from 'antd/es/date-picker';
import type { Dayjs } from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface BMIHistoryCardProps {
  selectedChild: string | null;
  selectedGender?: 'male' | 'female'; 
  fetchingBMI: boolean;
  chartData: Array<{
    dateTime: string;
    date: string;
    bmi: number;
    weight: number;
    height: number;
    percentile: number;
    ageInMonths?: number; 
  }>;
  handleOpenBmiModal: () => void;
  onDateRangeChange: (startDate?: string, endDate?: string) => void;
}

interface BMIReferenceData {
  [key: number]: number;
}

interface GenderSpecificBMIData {
  male: BMIReferenceData;
  female: BMIReferenceData;
}

const whoBmiReferenceData: GenderSpecificBMIData = {
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
  
  if (ageInMonths <= ages[0]) return referenceData[ages[0]];
  if (ageInMonths >= ages[ages.length - 1]) return referenceData[ages[ages.length - 1]];
  
  let lowerAge = ages[0];
  let upperAge = ages[ages.length - 1];
  
  for (let i = 0; i < ages.length - 1; i++) {
    if (ageInMonths >= ages[i] && ageInMonths <= ages[i + 1]) {
      lowerAge = ages[i];
      upperAge = ages[i + 1];
      break;
    }
  }
  
  const lowerBMI = referenceData[lowerAge];
  const upperBMI = referenceData[upperAge];
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
} => {
  const references = getWhoZScoreReferences(ageInMonths, gender);
  
  if (bmi < references.underweight) {
    return { 
      category: 'underweight', 
      color: '#91caff'  // Blue
    };
  } else if (bmi >= references.obese) {
    return { 
      category: 'obese', 
      color: '#ff4d4f'  // Red
    };
  } else if (bmi >= references.overweight) {
    return { 
      category: 'overweight', 
      color: '#faad14'  // Yellow/Orange
    };
  } else {
    return { 
      category: 'normal', 
      color: '#52c41a'  // Green
    };
  }
};

const BMIHistoryCard: React.FC<BMIHistoryCardProps> = ({ 
  selectedChild, 
  selectedGender = 'male', 
  fetchingBMI, 
  chartData, 
  handleOpenBmiModal,
  onDateRangeChange
}) => {
  const [displayMode, setDisplayMode] = useState<'day' | 'month' | 'year'>('day');
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [originalData, setOriginalData] = useState(chartData);
  const [filteredData, setFilteredData] = useState(chartData);
  const [isFiltered, setIsFiltered] = useState(false);

  useEffect(() => {
    console.log("New chart data received from API:", chartData);
    console.log("Number of records:", chartData.length);
    
    setFilteredData(chartData);
    setOriginalData(chartData);
  }, [chartData]);

  const handleDateRangeChange: RangePickerProps['onChange'] = (dates, dateStrings) => {
    setDateRange(dates as [Dayjs, Dayjs] | null);
    
    if (dates && dates[0] && dates[1] && selectedChild) {
      const startDate = dateStrings[0];
      const endDate = dateStrings[1];
      
      console.log("Date range selected for API:", startDate, "to", endDate);
      
      onDateRangeChange(startDate, endDate);
      setIsFiltered(true);
    } else {
      console.log("Clearing date range filters");
      setIsFiltered(false);
      onDateRangeChange(undefined, undefined);
    }
  };

  const clearAllFilters = () => {
    setDateRange(null);
    setFilteredData(originalData);
    setIsFiltered(false);
    onDateRangeChange(undefined, undefined);
  };
  
  const getBMIWarning = (bmi: number, ageInMonths: number) => {
    const category = getWHOBmiCategory(bmi, ageInMonths, selectedGender);
    
    if (category.category === 'underweight') {
      return {
        type: 'warning',
        message: 'The child falls below the WHO underweight threshold for their age. Please consult a healthcare professional.',
      };
    } else if (category.category === 'obese') {
      return {
        type: 'error',
        message: 'The child exceeds the WHO obesity threshold for their age. Please consult a healthcare professional.',
      };
    }
    return null;
  };

  const calculateAgeInMonths = (dateTime: string): number => {
    const measurementDate = moment(dateTime);
    const childDOB = moment().subtract(14, 'months'); 
    
    return measurementDate.diff(childDOB, 'months');
  };

  const processedData = filteredData.map(item => {
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
    }
    
    const ageInMonths = item.ageInMonths || calculateAgeInMonths(item.dateTime);
    
    const whoBmi = getWhoBmiReference(ageInMonths, selectedGender);
    
    const zScoreRefs = getWhoZScoreReferences(ageInMonths, selectedGender);
    
    return {
      ...item,
      date: formattedDate,
      ageInMonths,
      whoBmi,
      whoUnderweight: zScoreRefs.underweight,
      whoOverweight: zScoreRefs.overweight,
      whoObese: zScoreRefs.obese,
      category: getWHOBmiCategory(item.bmi, ageInMonths, selectedGender).category
    };
  });

  const aggregatedData = processedData.reduce((acc, current) => {
    const existingEntry = acc.find(entry => entry.date === current.date);
    
    if (existingEntry) {
      existingEntry.bmi = (existingEntry.bmi + current.bmi) / 2;
      existingEntry.whoBmi = (existingEntry.whoBmi + current.whoBmi) / 2;
      existingEntry.whoUnderweight = (existingEntry.whoUnderweight + current.whoUnderweight) / 2;
      existingEntry.whoOverweight = (existingEntry.whoOverweight + current.whoOverweight) / 2;
      existingEntry.whoObese = (existingEntry.whoObese + current.whoObese) / 2;
    } else {
      acc.push(current);
    }
    
    return acc;
  }, [] as typeof processedData);

  const CustomTooltip = (props: any) => {
    const { active, payload, label } = props;
    
    if (active && payload && payload.length) {
      const bmiPayload = payload.find((p: any) => p.dataKey === 'bmi');
      const whoBmiPayload = payload.find((p: any) => p.dataKey === 'whoBmi');
      const item = aggregatedData.find(d => d.date === label);
      
      if (!item || !bmiPayload) return null;
      
      const category = getWHOBmiCategory(bmiPayload.value, item.ageInMonths, selectedGender);
      
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
          {bmiPayload && (
            <p style={{ margin: '0 0 5px' }}>
              <strong>Status:</strong> <span style={{ color: category.color }}>{category.category.charAt(0).toUpperCase() + category.category.slice(1)}</span>
            </p>
          )}
          {item && (
            <>
              <p style={{ margin: '0 0 5px' }}><strong>Age:</strong> {item.ageInMonths} months</p>
              <p style={{ margin: '0 0 5px' }}><strong>Height:</strong> {item.height} cm</p>
              <p style={{ margin: '0 0 5px' }}><strong>Weight:</strong> {item.weight} kg</p>
            </>
          )}
        </div>
      );
    }
    
    return null;
  };

  const renderCustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    const category = getWHOBmiCategory(payload.bmi, payload.ageInMonths, selectedGender);
    
    const { color: fillColor } = category;
    let size = 6; 
    let showRing = false;
    let ringColor = "";
    
    if (category.category === 'underweight' || category.category === 'obese') {
      size = 8;
      showRing = true;
      ringColor = `${fillColor}40`; 
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

  const latestRecord = chartData.length > 0 ? chartData[chartData.length - 1] : null;
  const latestBMI = latestRecord ? latestRecord.bmi : null;
  const latestAgeInMonths = latestRecord ? (latestRecord.ageInMonths || calculateAgeInMonths(latestRecord.dateTime)) : null;
  const bmiWarning = (latestBMI && latestAgeInMonths) ? getBMIWarning(latestBMI, latestAgeInMonths) : null;

  const renderBMICategories = () => (
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
  );

  const renderFilters = () => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      marginBottom: '20px',
      gap: '10px',
      flexWrap: 'wrap'
    }}>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <Text>Display by:</Text>
        <Select 
          value={displayMode} 
          onChange={(value: 'day' | 'month' | 'year') => {
            setDisplayMode(value);
          }}
          style={{ width: 120 }}
        >
          <Select.Option value="day">Day</Select.Option>
          <Select.Option value="month">Month</Select.Option>
          <Select.Option value="year">Year</Select.Option>
        </Select>
      </div>
      
      {/* Date Range Picker with future date prevention */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <Text>Filter date range:</Text>
        <RangePicker 
          value={dateRange}
          onChange={handleDateRangeChange}
          disabledDate={(current) => {
            return current && current > moment().endOf('day');
          }}
          style={{ width: 280 }}
          allowClear={true}
          placeholder={['Start date', 'End date']}
        />
      </div>
    </div>
  );

  const renderFilterStatus = () => (
    isFiltered && dateRange && dateRange[0] && dateRange[1] && (
      <div style={{ marginBottom: '16px' }}>
        <Alert
          type="info"
          message={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Text>Showing BMI data from: </Text>
                <Text strong>
                  {dateRange[0].format('YYYY-MM-DD')} to {dateRange[1].format('YYYY-MM-DD')}
                </Text>
                {filteredData.length === 0 && (
                  <span> (No data found in this range)</span>
                )}
              </div>
              <Button type="link" onClick={clearAllFilters}>
                Clear Filter
              </Button>
            </div>
          }
          showIcon
          style={{ backgroundColor: 'rgba(30, 58, 138, 0.05)' }}
        />
      </div>
    )
  );

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
      ) : (
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

          {/* Always show filters */}
          {renderFilters()}

          {/* Show filter status */}
          {renderFilterStatus()}

          {/* Always show BMI categories */}
          {renderBMICategories()}

          {chartData.length > 0 && aggregatedData.length > 0 ? (
            <div style={{ 
              background: 'white', 
              borderRadius: '12px', 
              padding: '24px', 
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' 
            }}>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart 
                  data={aggregatedData} 
                  margin={{ top: 5, right: 30, left: 20, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    label={{ 
                      value: displayMode === 'day' ? 'Date' : displayMode === 'month' ? 'Month' : 'Year', 
                      position: 'insideBottom', 
                      offset: -5 
                    }} 
                  />
                  <YAxis 
                    domain={['auto', 'auto']} 
                    label={{ value: 'BMI', angle: -90, position: 'insideLeft' }} 
                  />
                  
                  {/* Dynamic reference lines based on WHO standards */}
                  {aggregatedData.length > 0 && (
                    <>
                      <ReferenceLine 
                        y={aggregatedData[0].whoUnderweight} 
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
                        y={aggregatedData[0].whoOverweight} 
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
                        y={aggregatedData[0].whoObese} 
                        stroke="#ff4d4f" 
                        strokeDasharray="3 3" 
                        label={{ 
                          value: 'Obese', 
                          position: 'insideTopLeft', 
                          fill: '#ff4d4f',
                          fontSize: 12
                        }} 
                      />
                    </>
                  )}
                  
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
                  
                  {/* WHO BMI Reference Line */}
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
                    height={20}
                    stroke="#8884d8"
                    y={375}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '50px',
              background: 'rgba(30, 58, 138, 0.05)',
              borderRadius: '12px'
            }}>
              <Text>No BMI tracking data available{isFiltered ? " for this selected time range" : ""}.</Text>
              <div style={{ marginTop: '20px' }}>
                {isFiltered && (
                  <Button 
                    type="default"
                    onClick={clearAllFilters}
                    style={{ marginRight: '10px' }}
                  >
                    Clear Filters
                  </Button>
                )}
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
        </>
      )}
    </Card>
  );
};

export default BMIHistoryCard;