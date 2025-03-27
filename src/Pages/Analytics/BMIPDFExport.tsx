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

const BMIPDFExport: React.FC<BMIPDFExportProps> = ({ childData, bmiRecords }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Function to get BMI category
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
      
      // Add BMI category legend
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('BMI Categories:', 20, 70);
      
      doc.setTextColor(145, 202, 255); // Underweight
      doc.text('Underweight (< 18.5)', 40, 70);
      
      doc.setTextColor(82, 196, 26); // Normal
      doc.text('Normal (18.5-24.9)', 90, 70);
      
      doc.setTextColor(250, 173, 20); // Overweight
      doc.text('Overweight (25-29.9)', 140, 70);
      
      doc.setTextColor(255, 77, 79); // Obese
      doc.text('Obese (≥ 30)', 190, 70);
      
      // If there are BMI records, add the table
      if (bmiRecords.length > 0) {
        // Create table data
        const tableData = bmiRecords.map(record => [
          formatDate(record.date),
          record.weight.toFixed(1),
          record.height.toFixed(1),
          record.bmi.toFixed(1),
          getBMICategory(record.bmi).label
        ]);
        
        // Add table using the autoTable function directly
        autoTable(doc, {
          head: [['Date', 'Weight (kg)', 'Height (cm)', 'BMI', 'Status']],
          body: tableData,
          startY: 80,
          theme: 'grid',
          headStyles: { fillColor: [30, 58, 138], textColor: [255, 255, 255] },
          alternateRowStyles: { fillColor: [248, 250, 252] },
          margin: { top: 80 }
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
        doc.text('Note: This report shows BMI trends over time. Regular monitoring helps ensure healthy development.', 
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