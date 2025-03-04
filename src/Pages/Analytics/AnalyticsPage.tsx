import React, { useState, useEffect } from 'react';
import { Layout, Card, Table, Select, Spin, message } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import axios from 'axios';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar.tsx';
import Footer from '../../components/Footer/Footer';

const { Content } = Layout;
const { Option } = Select;

// Replace with actual Parent ID from auth
const parentId = "3fa85f64-5717-4562-b3fc-2c963f66afa6";

const AnalyticsPage: React.FC = () => {
  const [children, setChildren] = useState<{ id: string; name: string }[]>([]);
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch children profiles
  useEffect(() => {
    axios.get(`https://localhost:7217/api/v1/children/${parentId}`)
      .then((response) => {
        setChildren(response.data);
        if (response.data.length > 0) {
          setSelectedChild(response.data[0].id); // Auto-select first child
        }
      })
      .catch((error) => {
        message.error("Failed to load children profiles.");
        console.error("Error fetching children:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  // Fetch analytics data for the selected child
  useEffect(() => {
    if (selectedChild) {
      setLoading(true);
      axios.get(`/api/v1/analytics/${selectedChild}`)
        .then((response) => {
          setAnalyticsData(response.data);
        })
        .catch((error) => {
          message.error("Failed to load analytics data.");
          console.error("Error fetching analytics:", error);
        })
        .finally(() => setLoading(false));
    }
  }, [selectedChild]);

  return (
    <Layout style={{ minHeight: '100vh', margin: '-25px' }}>
      <Header />
      <Layout>
        <Sidebar /> {/* Sidebar Component */}
        <Content style={{ padding: '24px', background: '#f5f5f5' }}>
          <Card title="Select Child Profile">
            <Select
              style={{ width: '100%' }}
              placeholder="Select a child"
              value={selectedChild}
              onChange={(value) => setSelectedChild(value)}
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
              <Card title="Body Composition History" style={{ marginTop: 20 }}>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="weight" stroke="#007AFF" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="bmi" stroke="#FF5722" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              <Card title="Data Table">
                <Table
                  dataSource={analyticsData}
                  columns={[
                    { title: "Date", dataIndex: "date", key: "date" },
                    { title: "Weight (lbs)", dataIndex: "weight", key: "weight" },
                    { title: "Height (cm)", dataIndex: "height", key: "height" },
                    { title: "BMI", dataIndex: "bmi", key: "bmi" },
                  ]}
                  rowKey="date"
                  pagination={false}
                />
              </Card>
            </>
          )}
        </Content>
      </Layout>
      <Footer />
    </Layout>
  );
};

export default AnalyticsPage;
