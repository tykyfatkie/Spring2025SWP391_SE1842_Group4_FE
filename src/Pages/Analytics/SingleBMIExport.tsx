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

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Underweight', color: '#91caff' };
    if (bmi < 25) return { label: 'Normal', color: '#52c41a' };
    if (bmi < 30) return { label: 'Overweight', color: '#faad14' };
    return { label: 'Obese', color: '#ff4d4f' };
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

      const doc = new jsPDF('portrait', 'mm', 'a4');
      
      doc.setFontSize(18);
      doc.setTextColor(30, 58, 138); 
      doc.text('BMI Assessment Report', 105, 20, { align: 'center' });
      

      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 28, { align: 'center' });
      

      doc.setDrawColor(30, 58, 138);
      doc.setLineWidth(0.5);
      doc.line(20, 32, 190, 32);
      

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      

      doc.setFillColor(248, 250, 252); 
      doc.rect(20, 40, 170, 35, 'F');
      
      doc.setFontSize(14);
      doc.setTextColor(30, 58, 138);
      doc.text('Child Information', 30, 48);
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      
      const age = calculateAge(childData.doB);
      const ageText = age.years > 0 
        ? `${age.years} years, ${age.months} months` 
        : `${age.months} months`;
      

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
      

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      
      const bmiCategory = getBMICategory(bmiRecord.bmi);
      

      doc.text(`Date of Assessment: ${formatDate(bmiRecord.date)}`, 30, 110);
      

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
      

      doc.setFontSize(12);
      doc.setTextColor(30, 58, 138);
      doc.text('BMI Categories Reference', 105, 195, { align: 'center' });
      

      autoTable(doc, {
        startY: 200,
        head: [['Category', 'BMI Range']],
        body: [
          ['Underweight', 'Less than 18.5'],
          ['Normal weight', '18.5 - 24.9'],
          ['Overweight', '25 - 29.9'],
          ['Obesity', '30 or greater']
        ],
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
      

      doc.setFontSize(12);
      doc.setTextColor(30, 58, 138);
      doc.text('Notes', 30, 250);
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text([
        '• BMI is an indicator of body fatness and is used to screen for potential health problems.',
        '• This is a single assessment and should be viewed as part of ongoing health monitoring.',
        '• Please consult with your healthcare provider for a comprehensive evaluation.',
        '• Regular monitoring of BMI helps track growth patterns and development.'
      ], 30, 260);
      

      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(
        'This report is generated for informational purposes only and is not a medical document.',
        105,
        280,
        { align: 'center', maxWidth: 150 }
      );
      

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