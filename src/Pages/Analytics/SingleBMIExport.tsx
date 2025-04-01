import React, { useState } from 'react';
import { Button, message, Spin } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface BMIRecord {
  date: string;
  bmi: number;
  weight: number;
  height: number;
  percentile: number;
}

interface ChildData {
  id: string;
  name: string;
  doB: string;
  gender: number;
  createdAt?: string;
  weight?: number;
  height?: number;
}

interface SingleBMIExportProps {
  childData: ChildData;
  bmiRecord: BMIRecord;
}

const SingleBMIExport: React.FC<SingleBMIExportProps> = ({ childData, bmiRecord }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Function to get BMI category based on WHO standards for children
  const getBMICategory = (bmi: number, percentile: number, age: number) => {
    // If we have percentile data, use that for categorization
    if (percentile !== undefined && !isNaN(percentile)) {
      if (percentile < 3) return { label: 'Severe thinness', color: '#91caff' };
      if (percentile < 15) return { label: 'Thinness', color: '#d3adf7' };
      if (percentile < 85) return { label: 'Normal', color: '#52c41a' };
      if (percentile < 97) return { label: 'Overweight', color: '#faad14' };
      return { label: 'Obesity', color: '#ff4d4f' };
    }
    
    // Fallback to Z-score approximation if percentile is not available
    // For children under 5 years
    if (age < 5) {
      if (bmi < 13) return { label: 'Severe thinness', color: '#91caff' };
      if (bmi < 14.5) return { label: 'Thinness', color: '#d3adf7' };
      if (bmi < 17) return { label: 'Normal', color: '#52c41a' };
      if (bmi < 19) return { label: 'Overweight', color: '#faad14' };
      return { label: 'Obesity', color: '#ff4d4f' };
    }
    
    // For children 5-19 years
    if (age >= 5 && age <= 19) {
      if (bmi < 14) return { label: 'Severe thinness', color: '#91caff' };
      if (bmi < 16) return { label: 'Thinness', color: '#d3adf7' };
      if (bmi < 23) return { label: 'Normal', color: '#52c41a' };
      if (bmi < 27) return { label: 'Overweight', color: '#faad14' };
      return { label: 'Obesity', color: '#ff4d4f' };
    }
    
    // For adults (fallback, though not ideal for this application)
    if (bmi < 18.5) return { label: 'Underweight', color: '#91caff' };
    if (bmi < 25) return { label: 'Normal weight', color: '#52c41a' };
    if (bmi < 30) return { label: 'Overweight', color: '#faad14' };
    return { label: 'Obesity', color: '#ff4d4f' };
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const calculateAge = (dobString: string) => {
    if (!dobString) return { years: 0, months: 0 };
    
    const dob = new Date(dobString);
    const now = new Date();
    
    let years = now.getFullYear() - dob.getFullYear();
    let months = now.getMonth() - dob.getMonth();
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    return { years, months };
  };

  const generatePDF = async () => {
    if (!bmiRecord) {
      message.warning('No BMI data available to generate report.');
      return;
    }

    setIsLoading(true);
    
    try {
      // Create new PDF document
      const doc = new jsPDF('portrait', 'mm', 'a4');
      
      // Add header
      doc.setFontSize(18);
      doc.setTextColor(30, 58, 138); // Dark blue color
      doc.text('BMI Assessment Report', 105, 20, { align: 'center' });
      
      // Add date and time
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 28, { align: 'center' });
      
      // Add decorative line
      doc.setDrawColor(30, 58, 138);
      doc.setLineWidth(0.5);
      doc.line(20, 32, 190, 32);
      
      // Add child information
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      
      // Create a section for child info
      doc.setFillColor(248, 250, 252); // Light blue background
      doc.rect(20, 40, 170, 35, 'F');
      
      doc.setFontSize(14);
      doc.setTextColor(30, 58, 138);
      doc.text('Child Information', 30, 48);
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      
      // Calculate age
      const age = calculateAge(childData.doB);
      const ageText = age.years > 0 
        ? `${age.years} years, ${age.months} months` 
        : `${age.months} months`;
      const ageInYears = age.years + (age.months / 12);
      
      // Child details
      doc.text(`Name: ${childData.name}`, 30, 56);
      doc.text(`Date of Birth: ${formatDate(childData.doB)}`, 30, 64);
      doc.text(`Age: ${ageText}`, 30, 72);
      doc.text(`Gender: ${childData.gender === 0 ? 'Male' : 'Female'}`, 120, 56);
      
      // BMI Assessment section
      doc.setFillColor(255, 255, 255);
      doc.rect(20, 85, 170, 100, 'F');
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.3);
      doc.rect(20, 85, 170, 100, 'S');
      
      doc.setFontSize(14);
      doc.setTextColor(30, 58, 138);
      doc.text('BMI Assessment', 105, 95, { align: 'center' });
      
      // BMI details
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      
      const bmiCategory = getBMICategory(
        bmiRecord.bmi, 
        bmiRecord.percentile, 
        ageInYears
      );
      
      // BMI data in a cleaner format
      doc.text(`Date of Assessment: ${formatDate(bmiRecord.date)}`, 30, 110);
      
      // Create a table for measurements
      autoTable(doc, {
        startY: 120,
        head: [['Measurement', 'Value']],
        body: [
          ['Height', `${bmiRecord.height.toFixed(1)} cm`],
          ['Weight', `${bmiRecord.weight.toFixed(1)} kg`],
          ['BMI', `${bmiRecord.bmi.toFixed(1)}`],
          ['Percentile', `${bmiRecord.percentile ? bmiRecord.percentile.toFixed(1) : 'N/A'}%`],
          ['Category', bmiCategory.label]
        ],
        theme: 'grid',
        headStyles: { 
          fillColor: [30, 58, 138], 
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          halign: 'center'
        },
        styles: {
          overflow: 'linebreak',
          cellWidth: 'auto',
          fontSize: 11
        },
        columnStyles: {
          0: { fontStyle: 'bold', fillColor: [248, 250, 252] }
        },
        margin: { left: 30, right: 30 }
      });
      
      // Add BMI Categories reference based on WHO charts
      doc.setFontSize(12);
      doc.setTextColor(30, 58, 138);
      doc.text('BMI Categories Reference (WHO Standards)', 105, 195, { align: 'center' });
      
      // Select appropriate categories based on age
      let categoryTable;
      if (ageInYears < 5) {
        categoryTable = [
          ['Severe thinness', 'Below -3 z-score'],
          ['Thinness', '-3 to -2 z-score'],
          ['Normal', '-2 to +1 z-score'],
          ['Overweight', '+1 to +2 z-score'],
          ['Obesity', 'Above +2 z-score']
        ];
      } else if (ageInYears <= 19) {
        categoryTable = [
          ['Severe thinness', 'Below -3 z-score'],
          ['Thinness', '-3 to -2 z-score'],
          ['Normal', '-2 to +1 z-score'],
          ['Overweight', '+1 to +2 z-score'],
          ['Obesity', 'Above +2 z-score']
        ];
      } else {
        categoryTable = [
          ['Underweight', 'Less than 18.5'],
          ['Normal weight', '18.5 - 24.9'],
          ['Overweight', '25 - 29.9'],
          ['Obesity', '30 or greater']
        ];
      }
      
      // Add category table
      autoTable(doc, {
        startY: 200,
        head: [['Category', 'Classification']],
        body: categoryTable,
        theme: 'grid',
        headStyles: { 
          fillColor: [30, 58, 138], 
          textColor: [255, 255, 255]
        },
        alternateRowStyles: { 
          fillColor: [248, 250, 252] 
        },
        margin: { left: 50, right: 50 }
      });
      
      // Add notes and recommendations
      doc.setFontSize(12);
      doc.setTextColor(30, 58, 138);
      doc.text('Notes', 30, 250);
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text([
        '• BMI for children is assessed using age and gender-specific growth charts.',
        '• WHO standards are used to determine weight status categories.',
        '• For children, percentile or z-score is more informative than the raw BMI value.',
        '• This is a single assessment and should be viewed as part of ongoing health monitoring.',
        '• Please consult with your healthcare provider for a comprehensive evaluation.'
      ], 30, 260);
      
      // Add footer
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(
        'This report is generated for informational purposes only and is not a medical document.',
        105,
        280,
        { align: 'center', maxWidth: 150 }
      );
      
      // Save PDF with child's name and date
      const dateStr = formatDate(bmiRecord.date).replace(/\//g, '-');
      const fileName = `${childData.name.replace(/\s+/g, '_')}_BMI_Report_${dateStr}.pdf`;
      doc.save(fileName);
      
      message.success('Latest BMI report downloaded successfully!');
    } catch (error) {
      message.error('Unable to create BMI report. Error: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      icon={isLoading ? null : <FileTextOutlined />}
      onClick={generatePDF}
      style={{ 
        background: '#fff',
        borderColor: '#1e3a8a',
        color: '#1e3a8a',
        borderRadius: '8px',
        height: '45px',
        width: '100%',
        marginTop: '10px'
      }}
      disabled={!childData || !childData.id || !bmiRecord || isLoading}
    >
      {isLoading ? <Spin size="small" /> : 'Export Latest BMI Record'}
    </Button>
  );
};

export default SingleBMIExport;