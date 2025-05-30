import React from 'react';
import { Typography, Tag } from 'antd';

const { Text } = Typography;


const BMICategories: React.FC = () => {
  return (
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
};


export default BMICategories;
