import React, { useRef, useState } from 'react';
import { Button, message, Spin } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import html2canvas from 'html2canvas';

interface BMIRecord {
  date: string;
  bmi: number;
  weight: number;
  height: number;
  percentile: number;
  ageInMonths?: number; // Added for WHO reference calculation
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

interface BMIPDFExportProps {
  childData: ChildData;
  bmiRecords: BMIRecord[];
}

// Define a type for the reference data
type ReferenceDataByAge = {
  [key: number]: number;
};

// WHO BMI-for-age reference data (simplified)
const whoBmiReferenceData: { male: ReferenceDataByAge; female: ReferenceDataByAge } = {
  male: {
    // Age in months as keys, median BMI (z-score 0) as values
    0: 13.4, 3: 16.0, 6: 17.3, 9: 17.2, 12: 16.8, 15: 16.4, 18: 16.2, 
    24: 15.8, 36: 15.4, 48: 15.3, 60: 15.4, 
    72: 15.5, 84: 16.0, 96: 16.5, 108: 17.0, 120: 17.8, 
    132: 18.5, 144: 19.2, 156: 19.9, 168: 20.8, 180: 21.4, 192: 22.2, 204: 22.7, 216: 23.1, 228: 23.4
  },
  female: {
    // Age in months as keys, median BMI (z-score 0) as values
    0: 13.2, 3: 15.7, 6: 16.9, 9: 16.8, 12: 16.4, 15: 16.1, 18: 15.9, 
    24: 15.6, 36: 15.3, 48: 15.3, 60: 15.3, 
    72: 15.3, 84: 15.7, 96: 16.2, 108: 16.8, 120: 17.5, 
    132: 18.2, 144: 19.0, 156: 19.6, 168: 20.2, 180: 20.8, 192: 21.3, 204: 21.7, 216: 22.0, 228: 22.2
  }
};

// Function to calculate WHO BMI reference value based on age and gender
const getWhoBmiReference = (ageInMonths: number, gender: 'male' | 'female' = 'male'): number => {
  const referenceData = whoBmiReferenceData[gender];
  
  // Find the closest age points
  const ages = Object.keys(referenceData).map(Number).sort((a, b) => a - b);
  
  // If age is outside our range, return the closest endpoint
  if (ageInMonths <= ages[0]) return referenceData[ages[0]];
  if (ageInMonths >= ages[ages.length - 1]) return referenceData[ages[ages.length - 1]];
  
  // Find the two closest age points for interpolation
  let lowerAge = ages[0];
  let upperAge = ages[ages.length - 1];
  
  for (let i = 0; i < ages.length - 1; i++) {
    if (ageInMonths >= ages[i] && ageInMonths <= ages[i + 1]) {
      lowerAge = ages[i];
      upperAge = ages[i + 1];
      break;
    }
  }
  
  // Linear interpolation between the two closest points
  const lowerBMI = referenceData[lowerAge];
  const upperBMI = referenceData[upperAge];
  const ratio = (ageInMonths - lowerAge) / (upperAge - lowerAge);
  
  return lowerBMI + ratio * (upperBMI - lowerBMI);
};

// Function to calculate WHO z-score reference values for different categories
const getWhoZScoreReferences = (ageInMonths: number, gender: 'male' | 'female'): {
  median: number;
  underweight: number;
  overweight: number;
  obese: number;
} => {
  // Get median BMI (z-score 0)
  const median = getWhoBmiReference(ageInMonths, gender);
  
  // Approximate the standard deviation (this is a simplification)
  // In real implementation, you would use WHO tables for SD values
  const estimatedSD = median * 0.1;  // Simplified estimation
  
  return {
    median,
    underweight: median - (2 * estimatedSD), // -2 SD
    overweight: median + (1 * estimatedSD),  // +1 SD
    obese: median + (2 * estimatedSD)        // +2 SD
  };
};

// Function to determine BMI category based on WHO z-score standards
const getWHOBmiCategory = (bmi: number, ageInMonths: number, gender: 'male' | 'female'): { 
  label: string; 
  color: string 
} => {
  const references = getWhoZScoreReferences(ageInMonths, gender);
  
  if (bmi < references.underweight) {
    return { 
      label: 'Underweight', 
      color: '#91caff'  // Blue
    };
  } else if (bmi >= references.obese) {
    return { 
      label: 'Obese', 
      color: '#ff4d4f'  // Red
    };
  } else if (bmi >= references.overweight) {
    return { 
      label: 'Overweight', 
      color: '#faad14'  // Yellow/Orange
    };
  } else {
    return { 
      label: 'Normal', 
      color: '#52c41a'  // Green
    };
  }
};

// Calculate age in months from date of birth and measurement date
const calculateAgeInMonths = (measurementDate: string, dob: string): number => {
  const birthDate = new Date(dob);
  const recordDate = new Date(measurementDate);
  
  const diffMonths = (recordDate.getFullYear() - birthDate.getFullYear()) * 12 + 
                     (recordDate.getMonth() - birthDate.getMonth());
  
  return Math.max(0, diffMonths); // Ensure non-negative value
};

const BMIPDFExport: React.FC<BMIPDFExportProps> = ({ childData, bmiRecords }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const generatePDF = async () => {
    if (!chartRef.current) {
      message.error('Unable to create chart. Please try again.');
      return;
    }

    if (bmiRecords.length === 0) {
      message.warning('No BMI data available to generate report.');
      return;
    }

    setIsLoading(true);
    
    try {
      // Ensure chart is visible when converting to canvas
      chartRef.current.style.display = 'block';
      chartRef.current.style.position = 'fixed';
      chartRef.current.style.left = '-9999px';
      chartRef.current.style.visibility = 'visible';
      
      // Wait a bit to ensure chart is rendered
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Convert chart to canvas and get image data
      const canvas = await html2canvas(chartRef.current, {
        scale: 2, // Increase resolution
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      // Restore hidden state
      chartRef.current.style.display = 'none';
      
      const chartImage = canvas.toDataURL('image/png');

      // Create new PDF document
      const doc = new jsPDF('portrait', 'mm', 'a4');
      
      // Add title
      doc.setFontSize(18);
      doc.setTextColor(30, 58, 138); // Dark blue color
      doc.text('BMI Tracking Report', 105, 20, { align: 'center' });
      
      // Add child information
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Child Name: ${childData.name}`, 20, 35);
      doc.text(`Date of Birth: ${formatDate(childData.doB)}`, 20, 42);
      doc.text(`Gender: ${childData.gender === 0 ? 'Male' : 'Female'}`, 20, 49);
      doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 20, 56);
      
      // Add WHO BMI category legend
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('WHO BMI Categories:', 20, 63);
      
      // Create a proper layout for BMI categories with better spacing
      const categoryY = 70;
      const leftColumnX = 30;
      const rightColumnX = 120;
      
      doc.setTextColor(145, 202, 255); // Underweight
      doc.text('Underweight (< -2 SD)', leftColumnX, categoryY);

      doc.setTextColor(82, 196, 26); // Normal
      doc.text('Normal (-2 SD to +1 SD)', leftColumnX, categoryY + 7);

      doc.setTextColor(250, 173, 20); // Overweight
      doc.text('Overweight (+1 SD to +2 SD)', rightColumnX, categoryY);

      doc.setTextColor(255, 77, 79); // Obese
      doc.text('Obese (> +2 SD)', rightColumnX, categoryY + 7);
      
      // If there are BMI records, add the table
      if (bmiRecords.length > 0) {
        // Create table data
        const tableData = bmiRecords.map(record => {
          // Calculate age in months for each record
          const ageInMonths = record.ageInMonths || 
            calculateAgeInMonths(record.date, childData.doB);
          
          // Get WHO BMI category based on age, gender and BMI
          const gender = childData.gender === 0 ? 'male' : 'female';
          const category = getWHOBmiCategory(record.bmi, ageInMonths, gender);
          
          return [
            formatDate(record.date),
            record.weight.toFixed(1),
            record.height.toFixed(1),
            record.bmi.toFixed(1),
            category.label
          ];
        });
        
        // Add table using the autoTable function directly
        autoTable(doc, {
          head: [['Date', 'Weight (kg)', 'Height (cm)', 'BMI', 'Status']],
          body: tableData,
          startY: 85, // Adjusted to account for the new BMI categories layout
          theme: 'grid',
          headStyles: { fillColor: [30, 58, 138], textColor: [255, 255, 255] },
          alternateRowStyles: { fillColor: [248, 250, 252] },
          margin: { top: 85 }
        });
        
        // Get final Y position after table - access this differently since we're using the function
        const finalY = (doc as any).lastAutoTable?.finalY || 120;
        
        // Add chart title
        doc.setFontSize(14);
        doc.setTextColor(30, 58, 138);
        doc.text('BMI Trend Chart', 105, finalY + 15, { align: 'center' });
        
        // Add chart to PDF
        const imgWidth = 170;
        const imgHeight = 80;
        doc.addImage(
          chartImage, 
          'PNG', 
          20, // X position
          finalY + 20, // Y position
          imgWidth, 
          imgHeight
        );
        
        // Add note about the chart
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text('Note: This report shows BMI trends over time according to WHO standards. Regular monitoring helps ensure healthy development.', 
          105, finalY + 110, { align: 'center', maxWidth: 170 });
      } else {
        // If no records, add a message
        doc.setTextColor(100, 100, 100);
        doc.text('No BMI data available. Please add measurements to see trends.', 
          105, 100, { align: 'center' });
      }
      
      // Add footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Page ${i} / ${pageCount}`,
          105,
          287,
          { align: 'center' }
        );
        doc.text(
          `Generated on ${new Date().toLocaleDateString()}`,
          20,
          287
        );
      }
      
      // Save PDF with child's name
      const fileName = `${childData.name.replace(/\s+/g, '_')}_BMI_Report.pdf`;
      doc.save(fileName);
      
      message.success('BMI report downloaded successfully!');
    } catch (error) {
      message.error('Unable to create BMI report. Error: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Hidden chart for PDF rendering */}
      <div 
        ref={chartRef} 
        style={{ 
          display: 'none', // Initially hidden
          width: '600px',
          height: '300px',
          background: 'white',
          padding: '20px'
        }}
      >
        <LineChart 
          width={600} 
          height={300} 
          data={bmiRecords}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="bmi" name="BMI" stroke="#1e3a8a" activeDot={{ r: 8 }} strokeWidth={2} />
        </LineChart>
      </div>

      <Button 
        type="primary" 
        icon={isLoading ? null : <DownloadOutlined />}
        onClick={generatePDF}
        style={{ 
          background: '#1e3a8a',
          borderRadius: '8px',
          height: '45px',
          width: '100%'
        }}
        disabled={!childData || !childData.id || isLoading}
      >
        {isLoading ? <Spin size="small" /> : 'Download BMI Report'}
      </Button>
    </>
  );
};

export default BMIPDFExport;