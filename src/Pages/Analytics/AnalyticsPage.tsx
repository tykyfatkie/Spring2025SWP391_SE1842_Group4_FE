import React, { useState, useEffect } from 'react';
import { Layout, Card, Select, Spin, message } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import axios from 'axios';
import Sidebar from '../../components/Sidebar/Sidebar.tsx';
import Footer from '../../components/Footer/Footer';

const { Content } = Layout;
const { Option } = Select;

const AnalyticsPage: React.FC = () => {
  const [children, setChildren] = useState<{ id: string; name: string }[]>([]);
  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    setLoading(true);
    axios.get(`/api/v1/children/getChildByToken`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}` // Nếu API cần token
      }
    })
    .then((response) => {
      if (response.data && Array.isArray(response.data)) {
        setChildren(response.data);
      } else {
        throw new Error("Invalid data format");
      }
    })
    .catch((error) => {
      if (error.response) {
        console.error("API Error:", error.response.data);
        message.error(`API Error: ${error.response.status} - ${error.response.data.message || "Unknown error"}`);
      } else {
        console.error("Network error:", error);
        message.error("Failed to fetch children data. Please check your connection.");
      }
    })
    .finally(() => setLoading(false));
  }, []);
  

  useEffect(() => {
    if (selectedChildren.length > 0) {
      setLoading(true);
      const requests = selectedChildren.map(childId =>
        axios.get(`/api/v1/bmi/tracking?childId=${childId}`)
      );
      
      Promise.all(requests)
        .then((responses) => {
          const mergedData = responses.flatMap(response =>
            response.data.value.data.map((entry: any) => ({
              date: new Date(entry.createdAt).toLocaleDateString(),
              bmi: entry.bmi,
              childId: entry.childrentId,
            }))
          );
          setAnalyticsData(mergedData);
        })
        .catch((error) => {
          message.error("Failed to load analytics data.");
          console.error("Error fetching analytics:", error);
        })
        .finally(() => setLoading(false));
    }
  }, [selectedChildren]);

  return (
    <Layout style={{ minHeight: '100vh', margin: '-25px' }}>
      <Layout>
        <Sidebar /> 
        <Content style={{ padding: '24px', background: '#f5f5f5' }}>
          <Card title="Select Child Profiles">
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Select children"
              value={selectedChildren}
              onChange={(values) => setSelectedChildren(values)}
            >
              {children.map((child) => (
                <Option key={child.id} value={child.id}>
                  {child.name}
                </Option>
              ))}
            </Select>
          </Card>

          {loading ? (
            <Spin size="large" style={{ display: 'block', margin: '20px auto' }} />
          ) : (
            <>
              <Card title="BMI Tracking Over Time" style={{ marginTop: 20 }}>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="bmi" stroke="#007AFF" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AnalyticsPage;
