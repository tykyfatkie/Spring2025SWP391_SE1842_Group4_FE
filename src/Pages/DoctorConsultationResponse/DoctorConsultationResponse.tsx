import React, { useState, useEffect } from 'react';
import { Layout, Typography, Table, Spin, Button, message, Modal, Input, Card, Tag, Row, Col, Alert } from 'antd';
import { MessageOutlined, ClockCircleOutlined, UserOutlined, CheckCircleOutlined } from '@ant-design/icons';
import axiosInstance from '../../utils/axiosInstance';
import DoctorSidebar from '../../components/Sidebar/DoctorSidebar';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// Main color variables to maintain consistency with MyDoctorProfilePage
const colors = {
  primary: {
    light: '#3b82f6', // Light blue
    main: '#1e3a8a',  // Dark blue
    gradient: 'linear-gradient(135deg, rgb(30, 58, 138) 0%, rgb(59, 130, 246) 100%)'
  },
  secondary: {
    light: '#f0f2f5', // Light background
    main: '#ffffff'   // White
  }
};

const API_BASE_URL = `${import.meta.env.VITE_API_ENDPOINT}/response`;

const DoctorConsultationResponse: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingResponse, setLoadingResponse] = useState<boolean>(false);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [responseModalVisible, setResponseModalVisible] = useState<boolean>(false);
  const [responseContent, setResponseContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

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

      // Retrieve doctor ID or use a fallback method
      const requestId = localStorage.getItem('requestId');
      const doctorId = localStorage.getItem('userId');
      
      const response = await axiosInstance.get(`${API_BASE_URL}/doctor/${doctorId || requestId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (Array.isArray(response.data)) {
        // Map data to include status tags and formatted dates
        const formattedRequests = response.data.map(req => ({
          ...req,
          statusTag: getStatusTag(req.status),
          formattedDate: formatDate(req.date)
        }));
        setRequests(formattedRequests);
      } else {
        setError('No consultation requests found');
        setRequests([]);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to fetch consultation requests');
      message.error('Error retrieving consultation requests');
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string, text: string }> = {
      'new': { color: 'blue', text: 'New' },
      'pending': { color: 'orange', text: 'Pending' },
      'in_progress': { color: 'processing', text: 'In Progress' },
      'completed': { color: 'success', text: 'Completed' },
      'cancelled': { color: 'error', text: 'Cancelled' }
    };
    
    const defaultStatus = { color: 'default', text: status };
    return statusMap[status.toLowerCase()] || defaultStatus;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleResponse = (request: any) => {
    setSelectedRequest(request);
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
          requestId: selectedRequest?.id,
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
    } finally {
      setLoadingResponse(false);
    }
  };

  const columns = [
    {
      title: 'Patient',
      dataIndex: 'patientName',
      key: 'patientName',
      render: (text: string, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '50%', 
            backgroundColor: '#f0f2f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '12px'
          }}>
            {record.patientAvatar ? (
              <img 
                src={record.patientAvatar} 
                alt={text} 
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                onError={(e) => {
                  e.currentTarget.src = '';
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = '<UserOutlined style={{ fontSize: "20px", color: "#1e3a8a" }} />';
                }}
              />
            ) : (
              <UserOutlined style={{ fontSize: '20px', color: '#1e3a8a' }} />
            )}
          </div>
          <div>
            <Text strong>{text}</Text>
            <div>
              <Text type="secondary" style={{ fontSize: '12px' }}>ID: {record.patientId || record.id.substring(0, 8)}</Text>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Request Topic',
      dataIndex: 'topic',
      key: 'topic',
      render: (text: string, record: any) => (
        <div>
          <Text ellipsis={{ tooltip: text }}>{text || 'Medical Consultation'}</Text>
          <div>
            <Text type="secondary" style={{ fontSize: '12px' }} ellipsis={{ tooltip: record.summary }}>
              {record.summary || 'Patient requires medical advice'}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'statusTag',
      key: 'status',
      render: (statusTag: { color: string, text: string }) => (
        <Tag color={statusTag.color} style={{ borderRadius: '12px', padding: '0 8px' }}>
          {statusTag.text}
        </Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'formattedDate',
      key: 'date',
      render: (text: string) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ClockCircleOutlined style={{ marginRight: '8px', color: '#8c8c8c' }} />
          <Text>{text}</Text>
        </div>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <Button 
          type="primary" 
          onClick={() => handleResponse(record)}
          icon={<MessageOutlined />}
          style={{ 
            borderRadius: '50px',
            paddingLeft: '15px',
            paddingRight: '15px',
            height: '35px',
            background: colors.primary.gradient,
            border: 'none',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)'
          }}
        >
          Respond
        </Button>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', marginLeft: '-25px', marginTop: '-24px', marginBottom: '-24px', background: '#f5f7fa' }}>
      <DoctorSidebar />
      <Layout style={{ background: '#f5f7fa' }}>
        <Content style={{ 
          padding: '30px', 
          maxWidth: '1995px', 
          margin: '0 auto',
          marginBottom: '30px'
        }}>
          {/* Header Card */}
          <Card 
            style={{ 
              marginTop: '24px', 
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)'
            }}
          >
            <div style={{ padding: '20px' }}>
              <Row align="middle" justify="space-between">
                <Col>
                  <Title level={3} style={{ margin: 0, color: colors.primary.main }}>
                    Consultation Requests
                  </Title>
                  <Text type="secondary">
                    Manage and respond to patient consultation requests
                  </Text>
                </Col>
                <Col>
                  <Button 
                    type="primary" 
                    onClick={fetchConsultationRequests}
                    style={{ 
                      borderRadius: '50px',
                      paddingLeft: '20px',
                      paddingRight: '20px',
                      height: '40px',
                      background: colors.primary.gradient,
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    Refresh
                  </Button>
                </Col>
              </Row>
            </div>
          </Card>

          {/* Consultation Requests Table */}
          <Card 
            style={{ 
              marginTop: '24px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
            }}
            bodyStyle={{ padding: '16px' }}
          >
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                <Spin size="large" />
              </div>
            ) : error ? (
              <Alert
                message="Could not retrieve requests"
                description={error}
                type="warning"
                showIcon
              />
            ) : requests.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <Text type="secondary" style={{ fontSize: '16px' }}>
                  You have not received any consultation requests yet.
                </Text>
              </div>
            ) : (
              <Table
                columns={columns}
                dataSource={requests}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                style={{ margin: '0' }}
              />
            )}
          </Card>

          {/* Statistics Cards */}
          <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
            <Col xs={24} sm={12} lg={8}>
              <Card 
                style={{ 
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '12px', 
                    background: 'rgba(59, 130, 246, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '16px'
                  }}>
                    <MessageOutlined style={{ fontSize: '24px', color: colors.primary.light }} />
                  </div>
                  <div>
                    <Title level={5} style={{ margin: 0, color: '#262626' }}>New Requests</Title>
                    <Title level={3} style={{ margin: '4px 0 0 0' }}>
                      {requests.filter(req => req.status.toLowerCase() === 'new').length}
                    </Title>
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card 
                style={{ 
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '12px', 
                    background: 'rgba(245, 158, 11, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '16px'
                  }}>
                    <ClockCircleOutlined style={{ fontSize: '24px', color: '#f59e0b' }} />
                  </div>
                  <div>
                    <Title level={5} style={{ margin: 0, color: '#262626' }}>Pending</Title>
                    <Title level={3} style={{ margin: '4px 0 0 0' }}>
                      {requests.filter(req => req.status.toLowerCase() === 'pending' || req.status.toLowerCase() === 'in_progress').length}
                    </Title>
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card 
                style={{ 
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '12px', 
                    background: 'rgba(34, 197, 94, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '16px'
                  }}>
                    <CheckCircleOutlined style={{ fontSize: '24px', color: '#22c55e' }} />
                  </div>
                  <div>
                    <Title level={5} style={{ margin: 0, color: '#262626' }}>Completed</Title>
                    <Title level={3} style={{ margin: '4px 0 0 0' }}>
                      {requests.filter(req => req.status.toLowerCase() === 'completed').length}
                    </Title>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>

      {/* Modal for response */}
      <Modal
        title={
          <div>
            <Title level={4} style={{ margin: 0 }}>Respond to Patient</Title>
            <Text type="secondary">
              {selectedRequest?.patientName || 'Patient'} - {selectedRequest?.topic || 'Medical Consultation'}
            </Text>
          </div>
        }
        open={responseModalVisible}
        onOk={handleSendResponse}
        onCancel={() => setResponseModalVisible(false)}
        confirmLoading={loadingResponse}
        width={600}
        okText="Send Response"
        okButtonProps={{ 
          style: { 
            background: colors.primary.gradient,
            border: 'none'
          } 
        }}
      >
        <div style={{ marginBottom: '16px', paddingTop: '8px' }}>
          <Title level={5}>Patient Request:</Title>
          <Paragraph style={{ 
            background: '#f9f9f9', 
            padding: '12px', 
            borderRadius: '8px', 
            border: '1px solid #f0f0f0'
          }}>
            {selectedRequest?.content || "The patient is requesting a medical consultation."}
          </Paragraph>
        </div>
        
        <Title level={5}>Your Response:</Title>
        <TextArea
          rows={6}
          value={responseContent}
          onChange={(e) => setResponseContent(e.target.value)}
          placeholder="Enter your detailed response to the patient..."
          style={{ marginBottom: '10px' }}
        />
      </Modal>
    </Layout>
  );
};

export default DoctorConsultationResponse;