import React, { useRef, useState, useEffect } from 'react';
import { Button, message, Spin } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import html2canvas from 'html2canvas';
import axios from 'axios';

interface BMIRecord {
  id: string; // Added id for record identification
  date: string;
  dateTime: string;
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
  gender: number;
  createdAt?: string;
  weight?: number;
  height?: number;
}

interface BMIPDFExportProps {
  childData: ChildData;
  bmiRecords: BMIRecord[];
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

const BMIPDFExport: React.FC<BMIPDFExportProps> = ({ childData, bmiRecords }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [whoBmiReferenceData, setWhoBmiReferenceData] = useState<GenderSpecificBMIData>({
    male: {},
    female: {}
  });
  const [loadingWhoData, setLoadingWhoData] = useState(true);

  // Fetch WHO data from API - similar to BMIDetailsCard
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
          
          console.log("WHO BMI data loaded for PDF export:", { maleData, femaleData });
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
    const measurementDate = new Date(dateTime);
    const childDOB = new Date(dateOfBirth);
    
    const diffMonths = (measurementDate.getFullYear() - childDOB.getFullYear()) * 12 + 
                      (measurementDate.getMonth() - childDOB.getMonth());
    
    return Math.max(0, diffMonths);
  };

  // Process data to include WHO reference values - similar to BMIDetailsCard
  const processedRecords = bmiRecords.map(record => {
    const ageInMonths = record.ageInMonths || 
      (childData.doB ? calculateAgeInMonths(record.dateTime, childData.doB) : 0);
    
    const gender = childData.gender === 0 ? 'male' : 'female';
    const bmiCategory = getWHOBmiCategory(record.bmi, ageInMonths, gender);
    
    return {
      ...record,
      ageInMonths,
      bmiCategory
    };
  });

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

    if (loadingWhoData) {
      message.info('Please wait until WHO reference data is loaded.');
      return;
    }

    setIsLoading(true);
    
    try {
      chartRef.current.style.display = 'block';
      chartRef.current.style.position = 'fixed';
      chartRef.current.style.left = '-9999px';
      chartRef.current.style.visibility = 'visible';
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const canvas = await html2canvas(chartRef.current, {
        scale: 2, 
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      chartRef.current.style.display = 'none';
      
      const chartImage = canvas.toDataURL('image/png');

      const doc = new jsPDF('portrait', 'mm', 'a4');
      
      doc.setFontSize(18);
      doc.setTextColor(30, 58, 138); 
      doc.text('BMI Tracking Report', 105, 20, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Child Name: ${childData.name}`, 20, 35);
      doc.text(`Date of Birth: ${formatDate(childData.doB)}`, 20, 42);
      doc.text(`Gender: ${childData.gender === 0 ? 'Male' : 'Female'}`, 20, 49);
      doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 20, 56);
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('WHO BMI Categories:', 20, 63);
      
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
      
      if (processedRecords.length > 0) {
        const tableData = processedRecords.map(record => {
          return [
            formatDate(record.date),
            record.weight.toFixed(1),
            record.height.toFixed(1),
            record.bmi.toFixed(1),
            record.bmiCategory.whoBmiReference?.toFixed(1) || '-',
            record.bmiCategory.label
          ];
        });
        
        autoTable(doc, {
          head: [['Date', 'Weight (kg)', 'Height (cm)', 'BMI', 'WHO Ref.', 'Status']],
          body: tableData,
          startY: 85, 
          theme: 'grid',
          headStyles: { fillColor: [30, 58, 138], textColor: [255, 255, 255] },
          alternateRowStyles: { fillColor: [248, 250, 252] },
          margin: { top: 85 }
        });
        
        const finalY = (doc as any).lastAutoTable?.finalY || 120;
        
        doc.setFontSize(14);
        doc.setTextColor(30, 58, 138);
        doc.text('BMI Trend Chart', 105, finalY + 15, { align: 'center' });
        
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
        
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text('Note: This report shows BMI trends over time according to WHO standards. Regular monitoring helps ensure healthy development.', 
          105, finalY + 110, { align: 'center', maxWidth: 170 });
      } else {
        doc.setTextColor(100, 100, 100);
        doc.text('No BMI data available. Please add measurements to see trends.', 
          105, 100, { align: 'center' });
      }
      
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
          display: 'none', 
          width: '600px',
          height: '300px',
          background: 'white',
          padding: '20px'
        }}
      >
        <LineChart 
          width={600} 
          height={300} 
          data={processedRecords}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="bmi" name="BMI" stroke="#1e3a8a" activeDot={{ r: 8 }} strokeWidth={2} />
          {/* Add WHO reference line */}
          <Line 
            type="monotone" 
            dataKey="bmiCategory.whoBmiReference" 
            name="WHO Reference" 
            stroke="#8884d8" 
            strokeDasharray="5 5" 
            strokeWidth={1}
            dot={false}
          />
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
        disabled={!childData || !childData.id || isLoading || loadingWhoData}
      >
        {isLoading ? <Spin size="small" /> : loadingWhoData ? 'Loading WHO data...' : 'Download BMI Report'}
      </Button>
    </>
  );
};

export default BMIPDFExport;