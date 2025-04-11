import React from 'react';
import { Select, DatePicker, Typography, Button, Alert } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';
import type { Dayjs } from 'dayjs';
import moment from 'moment';

const { Text } = Typography;
const { RangePicker } = DatePicker;

interface BMIFiltersProps {
  displayMode: 'day' | 'month' | 'year';
  setDisplayMode: (mode: 'day' | 'month' | 'year') => void;
  dateRange: [Dayjs, Dayjs] | null;
  setDateRange: (dates: [Dayjs, Dayjs] | null) => void;
  isFiltered: boolean;
  filteredDataLength: number;
  onDateRangeChange: (startDate?: string, endDate?: string) => void;
  clearAllFilters: () => void;
}

const BMIFilters: React.FC<BMIFiltersProps> = ({
  displayMode,
  setDisplayMode,
  dateRange,
  setDateRange,
  isFiltered,
  filteredDataLength,
  onDateRangeChange,
  clearAllFilters
}) => {
  
  const handleDateRangeChange: RangePickerProps['onChange'] = (dates, dateStrings) => {
    setDateRange(dates as [Dayjs, Dayjs] | null);
    
    if (dates && dates[0] && dates[1]) {
      const startDate = dateStrings[0];
      const endDate = dateStrings[1];
      
      console.log("Date range selected for API:", startDate, "to", endDate);
      
      onDateRangeChange(startDate, endDate);
    } else {
      console.log("Clearing date range filters");
      onDateRangeChange(undefined, undefined);
    }
  };

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
                {filteredDataLength === 0 && (
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
    <>
      {renderFilters()}
      {renderFilterStatus()}
    </>
  );
};

export default BMIFilters;