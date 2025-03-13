import React, { useState, useEffect } from 'react';
import { Layout, Card, Select, Spin, message, Typography, Tag } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import axios from 'axios';
import Sidebar from '../../components/Sidebar/Sidebar';

const { Content } = Layout;
const { Option } = Select;
const { Title, Text } = Typography;

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
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchingBMI, setFetchingBMI] = useState<boolean>(false);

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
    }
  }, [selectedChild]);

  const fetchChildren = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Authentication token missing. Please login again.");
        return;
      }
      
      // Sử dụng URL endpoint giống như trong ChildManage.tsx
      const response = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/children/getChildByToken`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
  
      // Phần còn lại giữ nguyên
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
      console.error("Error fetching children:", error);
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
      
      // Sử dụng URL endpoint với biến môi trường
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
        })).sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()));
      } else {
        throw new Error("Invalid BMI data format received");
      }
    } catch (error: any) {
      console.error("Error fetching BMI data:", error);
      message.error(error.response?.data?.message || "Failed to load BMI tracking data");
    } finally {
      setFetchingBMI(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', margin: '-25px' }}>
      <Sidebar />
      <Content style={{ padding: '24px', background: '#f5f5f5' }}>
        <Title level={2}>BMI Tracking</Title>

        <Card title="Select Child">
          {loading ? (
            <Spin size="small" />
          ) : (
            <Select
              placeholder="Select a child"
              style={{ width: '100%' }}
              onChange={(value) => setSelectedChild(value)}
              value={selectedChild}
            >
              {children.map((child) => (
                <Option key={child.id} value={child.id}>
                  {child.name}
                </Option>
              ))}
            </Select>
          )}
        </Card>

        {selectedChild && (
          <Card title="BMI History" style={{ marginTop: 20 }}>
            {fetchingBMI ? (
              <div style={{ textAlign: 'center', padding: 50 }}>
                <Spin size="large" />
              </div>
            ) : chartData.length > 0 ? (
              <>
                <div style={{ marginBottom: 20 }}>
                  <Text strong>BMI Categories: </Text>
                  <Tag color="#91caff">Underweight (&lt; 18.5)</Tag>
                  <Tag color="#52c41a">Normal (18.5-24.9)</Tag>
                  <Tag color="#faad14">Overweight (25-29.9)</Tag>
                  <Tag color="#ff4d4f">Obese (&ge; 30)</Tag>
                </div>

                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" label={{ value: 'Date', position: 'insideBottom', offset: -5 }} />
                    <YAxis domain={['auto', 'auto']} label={{ value: 'BMI', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="bmi" name="BMI" stroke="#1677ff" activeDot={{ r: 8 }} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: 50 }}>
                <Text>No BMI tracking data available for this child.</Text>
              </div>
            )}
          </Card>
        )}
      </Content>
    </Layout>
  );
};

export default BMITrackingPage;
