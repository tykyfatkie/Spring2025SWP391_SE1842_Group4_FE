import React, { useState, useEffect } from 'react';
import { Layout, message, Row, Col, Modal, Form } from 'antd';
import axios from 'axios';
import Sidebar from '../../components/Sidebar/Sidebar';
import CollapsibleHeader from './CollapsibleHeader';
import BMIDetailsCard from './BMIDetailsCard';
import BMIModalForm from './BMIModalForm';
import ChildSelectorCard from './ChildSelectorCard';
import BMIHistoryCard from './BMIHistoryCard';

const { Content } = Layout;

interface Child {
  id: string;
  name: string;
  doB: string;
  gender: number;
  weight: number;
  height: number;
  bmi: number;
  bmiPercentile: number;
}

interface BMIRecord {
  id: string;
  childrentId: string;
  weight: number;
  height: number;
  bmi: number;
  bmiPercentile: number;
  createdAt: string;
}


interface ChartData {
  dateTime: string;
  date: string;
  bmi: number;
  weight: number;
  height: number;
  percentile: number;
}

const BMITrackingPage: React.FC = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [selectedChildData, setSelectedChildData] = useState<Child | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchingBMI, setFetchingBMI] = useState<boolean>(false);
  const [bmiModalVisible, setBmiModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchChildren();
  }, []);

  useEffect(() => {
    if (selectedChild) {
      fetchBMIData(selectedChild); 
      const childData = children.find(child => child.id === selectedChild) || null;
      setSelectedChildData(childData);
    }
  }, [selectedChild, children]);

  const fetchChildren = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Authentication token missing. Please login again.");
        return;
      }
      
      const response = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/children/getChildByToken`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
  
      if (response.data?.data && Array.isArray(response.data.data)) {
        setChildren(response.data.data.map((child: any) => ({
          id: child.id,
          name: child.name || `Child ${child.id.substring(0, 8)}`,
          doB: child.doB,
          gender: child.gender,
          weight: child.weight,
          height: child.height,
          bmi: child.bmi,
          bmiPercentile: child.bmiPercentile
        })));
      } else {
        throw new Error("Invalid data format received");
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || "Failed to load children data");
    } finally {
      setLoading(false);
    }
  };

  const fetchBMIData = async (childId: string, startDate?: string, endDate?: string) => {
    setFetchingBMI(true);
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      message.error("Authentication token missing. Please login again.");
      return;
    }
    
    let url = `${import.meta.env.VITE_API_ENDPOINT}/bmi/tracking?childId=${childId}`;
    
    if (startDate && startDate.trim() !== '') {
      const startDateObj = new Date(startDate);
      const formattedStartDate = `${startDateObj.toISOString().split('T')[0]}T12:11:16.641652Z`;
      url += `&startDate=${encodeURIComponent(formattedStartDate)}`;
      console.log("Using start date:", formattedStartDate);
    }
    
    if (endDate && endDate.trim() !== '') {
      const endDateTime = new Date(endDate);
      endDateTime.setHours(23, 59, 59, 999);
      const formattedEndDate = endDateTime.toISOString(); 
      url += `&endDate=${encodeURIComponent(formattedEndDate)}`;
      console.log("Using end date:", formattedEndDate);
    }
    
    console.log("Fetching BMI data with URL:", url);
    
    const response = await axios.get(
      url,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
  
      console.log("BMI data received, count:", response.data?.value?.data?.length || 0);
  
      if (response.data?.value?.data && Array.isArray(response.data.value.data)) {
        const processedData = response.data.value.data.map((record: BMIRecord) => {
          const dateObj = new Date(record.createdAt);
          console.log("Processing date:", record.createdAt, "->", dateObj.toISOString());
          return {
            dateTime: record.createdAt,
            date: dateObj.toLocaleDateString(),
            bmi: record.bmi,
            weight: record.weight,
            height: record.height,
            percentile: record.bmiPercentile
          };
        }).sort((a: ChartData, b: ChartData) => 
          new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
        
        setChartData(processedData);
        console.log("Chart data after processing:", processedData.length, "records");
      } else {
        throw new Error("Invalid BMI data format received");
      }
    } catch (error: any) {
      console.error("Error fetching BMI data:", error);
      console.error("Error response data:", error.response?.data);
      message.error(error.response?.data?.message || "Failed to load BMI tracking data");
      setChartData([]);
    } finally {
      setFetchingBMI(false);
    }
  };

  const handleDateRangeChange = (startDate?: string, endDate?: string) => {
    if (selectedChild) {
      console.log("Filtering by date range:", startDate, "to", endDate);
      fetchBMIData(selectedChild, startDate, endDate);
    }
  };

  const handleOpenBmiModal = () => {
    if (!selectedChild || !selectedChildData) {
      message.error("Please select a child first.");
      return;
    }
    setBmiModalVisible(true);
    form.resetFields();
  };

  const handleSaveBMI = async (values: any) => {
    try {
      if (!selectedChild || !selectedChildData) {
        message.error("No child selected");
        return;
      }
  
      const token = localStorage.getItem("token");
  
      if (!token) {
        message.error("Authentication information missing. Please login again.");
        return;
      }
  
      const payload = {
  childId: selectedChild,
  height: Number(values.height),
  weight: Number(values.weight),
  gender: selectedChildData.gender,
  notes: values.notes?.trim() || "",
  createdAt: values.doY ? new Date(values.doY).toISOString() : new Date().toISOString(),
};
  
      console.log("BMI Save Payload:", payload);
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_ENDPOINT}/bmi/save`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.status === 200) {
        setBmiModalVisible(false);
        
        await fetchBMIData(selectedChild);
        
        Modal.success({
          title: 'BMI Record Added Successfully!',
          content: `New BMI data for ${selectedChildData.name} has been saved and updated in the system.`,
          okText: 'OK',
          onOk: () => {
            Modal.confirm({
              title: 'Export BMI Report',
              content: 'Would you like to export this BMI record as a PDF?',
              okText: 'Yes, Export PDF',
              cancelText: 'No, Thanks',
              onOk: () => {
                if (selectedChildData && chartData.length > 0) {
                  const latestRecord = chartData[chartData.length - 1];
                  import('./SingleBMIExport').then(module => {
                    const { generatePDF } = module.default.prototype;
                    generatePDF.call({
                      childData: selectedChildData,
                      bmiRecord: latestRecord
                    });
                  }).catch(() => {
                    message.error('Could not generate PDF file');
                  });
                } else {
                  message.warning('No data available to export');
                }
              }
            });
          }
        });
      }
    } catch (error: any) {
      console.error("BMI Save Error:", error);
      console.error("Error response data:", error.response?.data);
      console.error("Error status:", error.response?.status);
    
      message.error(error.response?.data?.message || "Failed to save BMI record.");
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', margin: "-25px", background: 'white', marginRight: '25px' }}>
      <Layout>
        <Sidebar />
        <Layout style={{ marginLeft: 0 }}>
        <Content style={{ padding: '24px', background: '#f8fafc', marginLeft: '260px' }}>
          {/* Collapsible Section */}
          <CollapsibleHeader 
            title="Track and Manage Your Child's BMI"
            subtitle="BMI MANAGEMENT"
            description="Monitor your child's Body Mass Index (BMI) over time. This tracking tool helps you visualize growth patterns and ensure healthy development according to WHO standards."
            features={[
              'Visualize BMI trends over time',
              'Compare with WHO standard percentiles',
              'Record new BMI measurements easily'
            ]}
          />

          <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <ChildSelectorCard
              loading={loading}
              children={children}
              selectedChild={selectedChild}
              setSelectedChild={setSelectedChild}
              selectedChildData={selectedChildData}
              chartData={chartData}
              handleOpenBmiModal={handleOpenBmiModal}
            />
          </Col>

          <Col xs={24} md={16}>
          <BMIHistoryCard
            selectedChild={selectedChild}
            selectedGender={selectedChildData?.gender === 0 ? 'male' : 'female'}
            fetchingBMI={fetchingBMI}
            chartData={chartData}
            handleOpenBmiModal={handleOpenBmiModal}
            onDateRangeChange={handleDateRangeChange}
            selectedChildDOB={selectedChildData?.doB} // Pass the DOB here
          />
        </Col>
          </Row>

          {/* BMI Details Card - Always display when child is selected, even if there's no data */}
          <BMIDetailsCard 
            selectedChild={selectedChild}
            selectedGender={selectedChildData?.gender === 0 ? 'female' : 'male'}
            chartData={chartData}
            fetchingBMI={fetchingBMI}
            handleOpenBmiModal={handleOpenBmiModal}
            selectedChildDOB={selectedChildData?.doB} // Add this line to pass the DOB
          />
        </Content>
      </Layout>
      </Layout>

      {/* Modal for adding new BMI record */}
      <BMIModalForm
        visible={bmiModalVisible}
        onCancel={() => setBmiModalVisible(false)}
        onSave={handleSaveBMI}
        form={form}
        selectedChildData={selectedChildData}
      />
    </Layout>
    
  );
};

export default BMITrackingPage;