import React, { useState, useEffect } from 'react';
import { Card, Spin, Typography, Button, Alert } from 'antd';
import { LineChartOutlined, PlusOutlined } from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Brush } from 'recharts';
import moment from 'moment';
import type { Dayjs } from 'dayjs';
import axios from 'axios';
import BMIFilters from './BMIFiltersProps';
import BMICategories from './BMICategories';
import BMIChartTooltip from './BMITooltipProps';

const { Title, Text } = Typography;

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
  selectedChildDOB?: string; 
}

interface BMIReferenceData {
  [key: number]: number;
}

interface GenderSpecificBMIData {
  male: BMIReferenceData;
  female: BMIReferenceData;
}

interface WHODataItem {
  ageMonth: number;
  bmiPercentile: number;
  bmi: number;
  gender: number; // 0 for male, 1 for female
}

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

const BMIHistoryCard: React.FC<BMIHistoryCardProps> = ({ 
  selectedChild, 
  selectedGender = 'male', 
  fetchingBMI, 
  chartData, 
  handleOpenBmiModal,
  onDateRangeChange,
  selectedChildDOB
}) => {
  const [displayMode, setDisplayMode] = useState<'day' | 'month' | 'year'>('day');
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [originalData, setOriginalData] = useState(chartData);
  const [filteredData, setFilteredData] = useState(chartData);
  const [isFiltered, setIsFiltered] = useState(false);
  
  // Add state for WHO reference data
  const [whoBmiReferenceData, setWhoBmiReferenceData] = useState<GenderSpecificBMIData>({
    male: {},
    female: {}
  });
  
  const [loadingWhoData, setLoadingWhoData] = useState(true);

  // Fetch WHO data from API
// Fetch WHO data from API
useEffect(() => {
  const fetchWHOData = async () => {
    try {
      setLoadingWhoData(true);
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Authentication token missing");
        setLoadingWhoData(false);
        return;
      }
      
      const response = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/WHOData/all`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data?.data) {
        const whoData: WHODataItem[] = response.data.data;
        
        // Process WHO data into the format we need
        const maleData: BMIReferenceData = {};
        const femaleData: BMIReferenceData = {};
        
        // Filter for median percentile (50%)
        whoData.forEach(item => {
          if (item.bmiPercentile === 50) {
            if (item.gender === 0) { // Male
              maleData[item.ageMonth] = item.bmi;
            } else if (item.gender === 1) { // Female
              femaleData[item.ageMonth] = item.bmi;
            }
          }
        });
        
        setWhoBmiReferenceData({
          male: maleData,
          female: femaleData
        });
        
        console.log("WHO BMI data loaded:", { maleData, femaleData });
      } else {
        throw new Error("Invalid WHO data format received");
      }
      
      setLoadingWhoData(false);
    } catch (error) {
      console.error("Error fetching WHO BMI data:", error);
      setLoadingWhoData(false);
    }
  };
  
  fetchWHOData();
}, []);
  
  useEffect(() => {
    console.log("New chart data received from API:", chartData);
    console.log("Number of records:", chartData.length);
    
    setFilteredData(chartData);
    setOriginalData(chartData);
  }, [chartData]);

  const clearAllFilters = () => {
    setDateRange(null);
    setFilteredData(originalData);
    setIsFiltered(false);
    onDateRangeChange(undefined, undefined);
  };
  
  const getWhoBmiReference = (ageInMonths: number, gender: 'male' | 'female' = 'male'): number => {
    const referenceData = whoBmiReferenceData[gender];
    
    if (Object.keys(referenceData).length === 0) {
      return 0; // Return default if data not loaded yet
    }
    
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

  const calculateAgeInMonths = (dateTime: string, dateOfBirth: string): number => {
    const measurementDate = moment(dateTime);
    const childDOB = moment(dateOfBirth);
    
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
    
    const ageInMonths = item.ageInMonths || 
    (selectedChildDOB ? calculateAgeInMonths(item.dateTime, selectedChildDOB) : 0);
    
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
  const latestAgeInMonths = latestRecord ? (latestRecord.ageInMonths || (selectedChildDOB ? calculateAgeInMonths(latestRecord.dateTime, selectedChildDOB) : 0)) : null;
  const bmiWarning = (latestBMI && latestAgeInMonths) ? getBMIWarning(latestBMI, latestAgeInMonths) : null;

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
      ) : fetchingBMI || loadingWhoData ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <div style={{ marginTop: '10px' }}>
            {loadingWhoData ? 'Loading WHO reference data...' : 'Loading BMI data...'}
          </div>
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

          {/* Use our new filter component */}
          <BMIFilters
            displayMode={displayMode}
            setDisplayMode={setDisplayMode}
            dateRange={dateRange}
            setDateRange={setDateRange}
            isFiltered={isFiltered}
            filteredDataLength={filteredData.length}
            onDateRangeChange={(startDate, endDate) => {
              onDateRangeChange(startDate, endDate);
              setIsFiltered(startDate !== undefined && endDate !== undefined);
            }}
            clearAllFilters={clearAllFilters}
          />

          {/* Use our new BMI categories component */}
          <BMICategories />

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
                  
                  {/* Use our custom tooltip component */}
                  <Tooltip content={
                    <BMIChartTooltip 
                      active={false} 
                      payload={[]} 
                      label="" 
                      aggregatedData={aggregatedData}
                      selectedGender={selectedGender}
                      getWHOBmiCategory={getWHOBmiCategory}
                    />
                  } />
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