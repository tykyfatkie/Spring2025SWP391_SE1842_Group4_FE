import React, { useState, useEffect } from 'react';
import { Layout, Typography, Table, Spin, Button, message, Modal, Input } from 'antd';
import axiosInstance from '../../utils/axiosInstance';
import DoctorSidebar from '../../components/Sidebar/DoctorSidebar';

const { Content } = Layout;
const { Title } = Typography;

const API_BASE_URL = `${import.meta.env.VITE_API_ENDPOINT}/response`;

const DoctorConsultationResponse: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingResponse, setLoadingResponse] = useState<boolean>(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [responseModalVisible, setResponseModalVisible] = useState<boolean>(false);
  const [responseContent, setResponseContent] = useState<string>('');

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

      const requestId = localStorage.getItem('requestId'); 
      const response = await axiosInstance.get(`${API_BASE_URL}/request-${requestId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (Array.isArray(response.data)) {
        setRequests(response.data);
      } else {
        message.error('You have not received any consultation requests yet!');
        setRequests([]);
      }
    } catch (error: any) {
      message.error('You have not received any consultation requests yet!');
      console.error('You have not received any consultation requests yet!', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = (requestId: string) => {
    setSelectedRequestId(requestId);
    setResponseModalVisible(true);
  };

  const handleSendResponse = async () => {
    if (!responseContent) {
      message.error('Please enter your response.');
      return;
    }

    setLoadingResponse(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.post(
        `${API_BASE_URL}/send`,
        {
          requestId: selectedRequestId,
          title: 'Consultation Response',
          content: responseContent,
          attachments: '',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        message.success('Response sent successfully!');
        setResponseModalVisible(false);
        setResponseContent('');
        fetchConsultationRequests(); 
      }
    } catch (error: any) {
      message.error('Failed to send response');
      console.error('Error sending response:', error);
    } finally {
      setLoadingResponse(false);
    }
  };

  const columns = [
    {
      title: 'Request ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Patient Name',
      dataIndex: 'patientName',
      key: 'patientName',
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
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: { id: string; }) => (
        <Button type="primary" onClick={() => handleResponse(record.id)}>
          Respond
        </Button>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', margin: '-25px' }}>
      <DoctorSidebar />
      <Layout>
        <Content style={{ padding: '24px', background: '#f5f5f5' }}>
          <Title level={4}>Consultation Requests</Title>
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

      {/* Modal for response */}
      <Modal
        title="Respond to Consultation Request"
        visible={responseModalVisible}
        onOk={handleSendResponse}
        onCancel={() => setResponseModalVisible(false)}
        confirmLoading={loadingResponse}
      >
        <Input.TextArea
          rows={4}
          value={responseContent}
          onChange={(e) => setResponseContent(e.target.value)}
          placeholder="Enter your response"
        />
      </Modal>
    </Layout>
  );
};

export default DoctorConsultationResponse;
