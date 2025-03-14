import React, { useState, useEffect } from 'react';
import { Layout, Typography, Table, Spin, message } from 'antd';
import axiosInstance from '../../utils/axiosInstance';
import Footer from '../../components/Footer/Footer';
import Sidebar from "../../components/Sidebar/Sidebar";

const { Content } = Layout;
const { Title } = Typography;

const API_BASE_URL = `${import.meta.env.VITE_API_ENDPOINT}/request/my-request`;

const UserConsultationRequests: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchConsultationRequests();
  }, []);

  const fetchConsultationRequests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token'); 
      if (!token) {
        message.error('No authorization token found');
        setLoading(false);
        return;
      }

      const response = await axiosInstance.get(API_BASE_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      
      if (Array.isArray(response.data)) {
        setRequests(response.data); 
      } else if (response.data && response.data.items) {
        setRequests(response.data.items); 
      } else {
        message.error('You have not sent any consultation yet.');
        setRequests([]); 
      }
    } catch (error: any) {
      message.error('Failed to fetch consultation requests');
      console.error('Error fetching consultation requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Request ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Doctor',
      dataIndex: 'doctorName',
      key: 'doctorName',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', margin: '-25px' }}>
      <Sidebar /> 

      <Layout>
        <Content style={{ padding: '24px', background: '#f5f5f5' }}>
          <Title level={4}>Your Consultation Requests</Title>
          {loading ? (
            <Spin size="large" />
          ) : (
            <Table
              columns={columns}
              dataSource={requests}
              rowKey="id"
              pagination={false}
            />
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserConsultationRequests;
