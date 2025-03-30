import React, { useState, useEffect } from 'react';
import { Layout, Typography, Table, Spin, message } from 'antd';
import axiosInstance from '../../utils/axiosInstance';
import Sidebar from "../../components/Sidebar/Sidebar";

const { Content } = Layout;
const { Title } = Typography;

const API_BASE_URL = `${import.meta.env.VITE_API_ENDPOINT}/request/my-request`;

interface ConsultationRequest {
  id: string | number;
  doctorName: string;
  status: string;
  date: string;
}


interface ApiResponse {
  items?: ConsultationRequest[];
  data?: ConsultationRequest[];

}

const UserConsultationRequests: React.FC = () => {
  const [requests, setRequests] = useState<ConsultationRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchConsultationRequests();
  }, []);

  const fetchConsultationRequests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token'); 
      if (!token) {
        message.error('Authentication token missing');
        setLoading(false);
        return;
      }

      const response = await axiosInstance.get<ConsultationRequest[] | ApiResponse>(API_BASE_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (Array.isArray(response.data)) {
        setRequests(response.data);
      } else if (response.data && Array.isArray((response.data as ApiResponse).items)) {
        setRequests((response.data as ApiResponse).items || []);
      } else if (response.data && Array.isArray((response.data as ApiResponse).data)) {
        setRequests((response.data as ApiResponse).data || []);
      } else {
        message.warning('No consultation requests found');
        setRequests([]);
      }
    } catch (error: any) {
      setRequests([]);
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
              locale={{ emptyText: 'No consultation requests found' }}
            />
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserConsultationRequests;
