import React from 'react';

interface BMITooltipProps {
  active: boolean;
  payload: any[];
  label: string;
  aggregatedData: any[];
  selectedGender: 'male' | 'female';
  getWHOBmiCategory: (bmi: number, ageInMonths: number, gender: 'male' | 'female') => {
    category: 'severely-underweight' | 'underweight' | 'normal' | 'overweight' | 'obese';
    color: string;
  };
}

const BMIChartTooltip: React.FC<BMITooltipProps> = ({ 
  active, 
  payload, 
  label, 
  aggregatedData,
  selectedGender,
  getWHOBmiCategory
}) => {
  if (active && payload && payload.length) {
    const bmiPayload = payload.find((p) => p.dataKey === 'bmi');
    const whoBmiPayload = payload.find((p) => p.dataKey === 'whoBmi');
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

export default BMIChartTooltip;