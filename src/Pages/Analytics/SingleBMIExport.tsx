import React, { useState, useEffect } from 'react';
import { Button, message, Spin } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import axios from 'axios';
import moment from 'moment';

interface ChartData {
  id: string;
  dateTime: string;
  date: string;
  bmi: number;
  weight: number;
  height: number;
  percentile: number;
  ageInMonths?: number;
}

interface ChildData {
  id: string;
  name: string;
  doB: string;
  gender: number; // 0 for male, 1 for female
  createdAt?: string;
  weight?: number;
  height?: number;
}

interface SingleBMIExportProps {
  childData: ChildData;
  bmiRecord: ChartData;
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

const SingleBMIExport: React.FC<SingleBMIExportProps> = ({ childData, bmiRecord }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [whoBmiReferenceData, setWhoBmiReferenceData] = useState<GenderSpecificBMIData>({
    male: {},
    female: {}
  });
  const [loadingWhoData, setLoadingWhoData] = useState(true);

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

  const getWhoBmiReference = (ageInMonths: number, gender: 'male' | 'female'): number => {
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

  const getWHOBmiCategory = (bmi: number, ageInMonths: number, gender: 'male' | 'female'): { 
    category: 'severely-underweight' | 'underweight' | 'normal' | 'overweight' | 'obese';
    color: string;
    label: string;
    whoBmiReference?: number;
    whoBmiRange?: string;
  } => {
    const references = getWhoZScoreReferences(ageInMonths, gender);
    const whoBmiReference = references.median;
    
    if (bmi < references.underweight) {
      return { 
        category: 'underweight',
        label: 'Underweight', 
        color: '#91caff',  // Blue
        whoBmiReference,
        whoBmiRange: `< ${references.underweight.toFixed(1)}`
      };
    } else if (bmi >= references.obese) {
      return { 
        category: 'obese',
        label: 'Obese', 
        color: '#ff4d4f',  // Red
        whoBmiReference,
        whoBmiRange: `≥ ${references.obese.toFixed(1)}`
      };
    } else if (bmi >= references.overweight) {
      return { 
        category: 'overweight',
        label: 'Overweight', 
        color: '#faad14',  // Yellow/Orange
        whoBmiReference,
        whoBmiRange: `${references.overweight.toFixed(1)}-${references.obese.toFixed(1)}`
      };
    } else {
      return { 
        category: 'normal',
        label: 'Normal', 
        color: '#52c41a',  // Green
        whoBmiReference,
        whoBmiRange: `${references.underweight.toFixed(1)}-${references.overweight.toFixed(1)}`
      };
    }
  };

  const calculateAgeInMonths = (dateTime: string, dateOfBirth: string): number => {
    const measurementDate = moment(dateTime);
    const childDOB = moment(dateOfBirth);
    
    return measurementDate.diff(childDOB, 'months');
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

    if (loadingWhoData) {
      message.warning('Please wait while WHO reference data is loading...');
      return;
    }

    setIsLoading(true);
    
    try {
      const doc = new jsPDF('portrait', 'mm', 'a4');
      const selectedGender = childData.gender === 0 ? 'male' : 'female';
      const ageInMonths = calculateAgeInMonths(bmiRecord.dateTime, childData.doB);
      const bmiCategory = getWHOBmiCategory(bmiRecord.bmi, ageInMonths, selectedGender);
      const age = calculateAge(childData.doB);
      const ageText = age.years > 0 
        ? `${age.years} years, ${age.months} months` 
        : `${age.months} months`;

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
      
      doc.text(`Name: ${childData.name}`, 30, 56);
      doc.text(`Date of Birth: ${formatDate(childData.doB)}`, 30, 64);
      doc.text(`Age: ${ageText}`, 30, 72);
      doc.text(`Gender: ${childData.gender === 0 ? 'Male' : 'Female'}`, 120, 56);
      
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
      
      doc.text(`Date of Assessment: ${formatDate(bmiRecord.date)}`, 30, 110);
      
      autoTable(doc, {
        startY: 120,
        head: [['Measurement', 'Value']],
        body: [
          ['Height', `${bmiRecord.height.toFixed(1)} cm`],
          ['Weight', `${bmiRecord.weight.toFixed(1)} kg`],
          ['BMI', `${bmiRecord.bmi.toFixed(1)}`],
          ['WHO Reference BMI', `${bmiCategory.whoBmiReference?.toFixed(1)}`],
          ['WHO BMI Range', bmiCategory.whoBmiRange || 'N/A'],
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
      doc.text('BMI Categories Reference (WHO Standards)', 105, 195, { align: 'center' });
      
      const categoryTable = [
        ['Underweight', 'Below -2 SD'],
        ['Normal', '-2 SD to +1 SD'],
        ['Overweight', '+1 SD to +2 SD'],
        ['Obesity', 'Above +2 SD']
      ];
      
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
      
      doc.setFontSize(12);
      doc.setTextColor(30, 58, 138);
      doc.text('Notes', 30, 250);
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text([
        '• BMI for children is assessed using age and gender-specific growth charts based on WHO standards.',
        '• Standard deviations (SD) are used to determine weight status categories for children.',
        '• This report uses the same WHO reference data as shown in the BMI Details table.',
        '• This is a single assessment and should be viewed as part of ongoing health monitoring.',
        '• Please consult with your healthcare provider for a comprehensive evaluation.'
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
      
      message.success('BMI report downloaded successfully!');
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
      disabled={!childData || !childData.id || !bmiRecord || isLoading || loadingWhoData}
    >
      {isLoading ? <Spin size="small" /> : loadingWhoData ? 'Loading WHO data...' : 'Export BMI Report'}
    </Button>
  );
};

export default SingleBMIExport;