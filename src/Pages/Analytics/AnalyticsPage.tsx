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
  const [] = useState<boolean>(false); 
  const [form] = Form.useForm();

  // Function to get BMI category
  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Underweight', color: '#91caff' };
    if (bmi < 25) return { label: 'Normal', color: '#52c41a' };
    if (bmi < 30) return { label: 'Overweight', color: '#faad14' };
    return { label: 'Obese', color: '#ff4d4f' };
  };

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

  const fetchBMIData = async (childId: string) => {
    setFetchingBMI(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Authentication token missing. Please login again.");
        return;
      }
      
      const response = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/bmi/tracking?childId=${childId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
  
      if (response.data?.value?.data && Array.isArray(response.data.value.data)) {
        setChartData(response.data.value.data.map((record: BMIRecord) => ({
          dateTime: record.createdAt,
          date: new Date(record.createdAt).toLocaleDateString(),
          bmi: record.bmi,
          weight: record.weight,
          height: record.height,
          percentile: record.bmiPercentile
        })).sort((a: { dateTime: string | number | Date; }, b: { dateTime: string | number | Date; }) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()));
      } else {
        throw new Error("Invalid BMI data format received");
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || "Failed to load BMI tracking data");
      setChartData([]);
    } finally {
      setFetchingBMI(false);
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
  
      // Đảm bảo chúng ta KHÔNG xử lý doY ở đây nữa
      // vì đã được xử lý trong BMIModalForm
      const payload = {
        childId: selectedChild,
        height: Number(values.height),
        weight: Number(values.weight),
        gender: selectedChildData.gender,
        notes: values.notes?.trim() || "",
        doY: values.doY, // Sử dụng giá trị đã được định dạng từ BMIModalForm
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
        message.success("BMI record saved successfully!");
        setBmiModalVisible(false);
        
        // Fetch updated BMI data after saving
        await fetchBMIData(selectedChild);
        
        Modal.confirm({
          title: 'BMI Record Saved',
          content: 'Would you like to export this BMI record as a PDF?',
          okText: 'Yes, Export',
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
              });
            } else {
              message.warning('No data available to export');
            }
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
        <Content style={{ padding: '24px', background: '#f8fafc' }}>
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
            fetchingBMI={fetchingBMI}
            chartData={chartData}
            handleOpenBmiModal={handleOpenBmiModal}
          />
        </Col>
          </Row>

          {/* BMI Details Card - Always display when child is selected, even if there's no data */}
          <BMIDetailsCard 
            selectedChild={selectedChild}
            chartData={chartData}
            fetchingBMI={fetchingBMI}
            handleOpenBmiModal={handleOpenBmiModal}
            getBMICategory={getBMICategory}
          />
        </Content>
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