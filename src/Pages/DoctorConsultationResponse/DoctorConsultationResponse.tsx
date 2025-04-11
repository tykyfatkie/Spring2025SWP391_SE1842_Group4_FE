import React, { useState, useEffect } from 'react';
import { Layout, Typography, Table, Spin, Button, message, Card, Row, Col, Alert, Space, Image, Modal, Tabs } from 'antd';
import { MessageOutlined, ClockCircleOutlined, CheckCircleOutlined, FileOutlined, PaperClipOutlined, EyeOutlined } from '@ant-design/icons';
import axiosInstance from '../../utils/axiosInstance';
import DoctorSidebar from '../../components/Sidebar/DoctorSidebar';
import DoctorResponseForm from './DoctorResponseForm'; 

const { Content } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

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

const API_ENDPOINT = '/request/doctor-request';

const DoctorConsultationResponse: React.FC = () => {
  const [allRequests, setAllRequests] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [approvedRequests, setApprovedRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current: 0,
    pageSize: 0,
    total: 0
  });
  
  // State for managing response form
  const [responseFormVisible, setResponseFormVisible] = useState<boolean>(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  
  // State for managing view response modal
  const [viewResponseModalVisible, setViewResponseModalVisible] = useState<boolean>(false);
  const [responseDetails, setResponseDetails] = useState<any>(null);
  const [loadingResponse, setLoadingResponse] = useState<boolean>(false);

  useEffect(() => {
    fetchDoctorRequests();
  }, [pagination.current, pagination.pageSize]);

  const fetchDoctorRequests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
  
      const response = await axiosInstance.get(API_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          Page: pagination.current,
          PageSize: pagination.pageSize,
        }
      });
  
      console.log("API Response:", response); // Debugging log
  
      if (response.data && response.data.data && response.data.data.data) {
        const formattedRequests = response.data.data.data.map((req: any) => ({
          ...req,
          statusTag: getStatusTag(req.status),
          formattedDate: formatDate(req.createdAt)
        }));
  
        setAllRequests(formattedRequests);
        
        // Filter requests by status
        const pending = formattedRequests.filter((req: any) => req.status === 2);
        const approved = formattedRequests.filter((req: any) => req.status === 0);
  
        setPendingRequests(pending);
        setApprovedRequests(approved);
        
        setPagination({
          ...pagination,
          total: response.data.totalCount || formattedRequests.length
        });
  
        console.log("Formatted Requests:", formattedRequests);
      } else {
        setError('No requests found');
        setAllRequests([]);
        setPendingRequests([]);
        setApprovedRequests([]);
      }
    } catch (error: any) {
      setError('Failed to fetch requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  const getStatusTag = (status: number) => {
    const statusMap: Record<number, { color: string, text: string }> = {
      0: { color: 'success', text: 'Approved' },
      1: { color: 'blue', text: 'New' },
      2: { color: 'orange', text: 'Pending' },
      3: { color: 'processing', text: 'In Progress' },
      4: { color: 'error', text: 'Cancelled' }
    };
    
    const defaultStatus = { color: 'default', text: `Status: ${status}` };
    return statusMap[status] || defaultStatus;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
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
    setResponseFormVisible(true);
  };

  const handleViewResponse = async (request: any) => {
    setLoadingResponse(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoadingResponse(false);
        return;
      }
  
      // Use the correct API endpoint format
      const response = await axiosInstance.get(`/response/request-${request.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
  
      console.log('Response data:', response.data);
  
      if (response.data && response.data.data) {
        const responseData = response.data.data;
        
        setResponseDetails({
          title: responseData.title || 'No Title',
          content: responseData.content || 'No content provided',
          attachments: responseData.attachments || '',
          responseDate: responseData.responseDate || null,
          consultationRequest: {
            title: request.title || 'No Title',
            description: request.description || 'No description',
            attachments: request.attachments || '',
            requestDate: request.createdAt || null
          }
        });
        
        setViewResponseModalVisible(true);
      }
    } catch (error: any) {
      message.error('Failed to fetch response details');
    } finally {
      setLoadingResponse(false);
    }
  };

  const handleResponseSuccess = () => {
    // Refresh request list after successful response
    fetchDoctorRequests();
    setResponseFormVisible(false);
  };

  const handleTableChange = (pagination: any) => {
    setPagination({
      ...pagination,
      current: pagination.current,
      pageSize: pagination.pageSize
    });
  };

  // Function to get file extension from URL
  const getFileType = (url: string) => {
    if (!url) return 'unknown';
    const extension = url.split('.').pop()?.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension || '')) {
      return 'image';
    } else if (['pdf'].includes(extension || '')) {
      return 'pdf';
    } else if (['doc', 'docx'].includes(extension || '')) {
      return 'word';
    } else if (['xls', 'xlsx'].includes(extension || '')) {
      return 'excel';
    }
    
    return 'file';
  };

  const renderAttachments = (attachments: string) => {
    if (!attachments) return null;
    
    // Clean up attachments string if it has brackets or quotes
    const cleanAttachments = attachments.replace(/[\[\]"']/g, '');
    
    const attachmentList = cleanAttachments.split(',').map(att => att.trim()).filter(Boolean);
    
    if (attachmentList.length === 0) return null;
    
    return (
      <Space>
        {attachmentList.map((url, index) => {
          // Clean up individual URL
          const cleanUrl = url.replace(/[\[\]"']/g, '');
          const fileType = getFileType(cleanUrl);
          
          if (fileType === 'image') {
            return (
              <Image 
                key={index}
                src={cleanUrl}
                width={40}
                height={40}
                style={{ objectFit: 'cover', borderRadius: '4px' }}
                preview={{ src: cleanUrl }}
              />
            );
          } else if (fileType === 'pdf') {
            return (
              <Button 
                key={index}
                icon={<FileOutlined />} 
                size="small"
                onClick={() => window.open(url, '_blank')}
                style={{ borderRadius: '4px' }}
              >
                PDF
              </Button>
            );
          } else {
            return (
              <Button 
                key={index}
                icon={<PaperClipOutlined />} 
                size="small"
                onClick={() => window.open(url, '_blank')}
                style={{ borderRadius: '4px' }}
              >
                File
              </Button>
            );
          }
        })}
      </Space>
    );
  };

  const getCommonColumns = () => [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: any) => (
        <div>
          <Text 
            strong 
            ellipsis={{ tooltip: text }} 
            style={{ color: record.status === 2 ? '#f59e0b' : '#50C520' }} 
          >
            {text || 'No Title'}
          </Text>
          <div>
            <Text type="secondary" style={{ fontSize: '12px' }} ellipsis={{ tooltip: record.description }}>
              {record.description || 'No description provided'}
            </Text>
          </div>
        </div>
      ),
    },    
    {
      title: 'Attachments',
      dataIndex: 'attachments',
      key: 'attachments',
      render: (attachments: string) => renderAttachments(attachments),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ClockCircleOutlined style={{ marginRight: '8px', color: '#8c8c8c' }} />
          <Text>{formatDate(text)}</Text>
        </div>
      ),
    }
  ];

  // Column definition for pending requests table
  const pendingColumns = [
    ...getCommonColumns(),
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

  // Column definition for approved requests table
  const approvedColumns = [
    ...getCommonColumns(),
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <Button 
          type="primary" 
          onClick={() => handleViewResponse(record)}
          icon={<EyeOutlined />}
          loading={loadingResponse}
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
          View Response
        </Button>
      ),
    },
  ];

  // Render the table with appropriate data and columns
  const renderTable = (dataSource: any[], columns: any[]) => {
    if (loading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <Spin size="large" />
        </div>
      );
    }
    
    if (error) {
      return (
        <Alert
          message="Could not retrieve requests"
          description={error}
          type="warning"
          showIcon
        />
      );
    }
    
    if (dataSource.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Text type="secondary" style={{ fontSize: '16px' }}>
            No requests found in this category.
          </Text>
        </div>
      );
    }
    
    return (
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        // pagination={pagination}
        onChange={handleTableChange}
        style={{ margin: '0' }}
      />
    );
  };

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
                    Doctor Requests
                  </Title>
                  <Text type="secondary">
                    Manage and respond to patient requests
                  </Text>
                </Col>
                <Col>
                  <Button 
                    type="primary" 
                    onClick={fetchDoctorRequests}
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
                      {allRequests.filter(req => req.status === 1).length || 0}
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
                      {pendingRequests.length || 0}
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
                    <Title level={5} style={{ margin: 0, color: '#262626' }}>Approved</Title>
                    <Title level={3} style={{ margin: '4px 0 0 0' }}>
                      {approvedRequests.length || 0}
                    </Title>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>

          {/* Tabs with Tables */}
          <Card 
            style={{ 
              marginTop: '24px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
            }}
            bodyStyle={{ padding: '16px' }}
          >
            <Tabs defaultActiveKey="pending" type="card">
              <TabPane 
                tab={
                  <span>
                    <ClockCircleOutlined style={{ marginRight: '8px', color: '#f59e0b' }} />
                    Pending Requests ({pendingRequests.length})
                  </span>
                } 
                key="pending"
              >
                {renderTable(pendingRequests, pendingColumns)}
              </TabPane>
              <TabPane 
                tab={
                  <span>
                    <CheckCircleOutlined style={{ marginRight: '8px', color: '#22c55e' }} />
                    Approved Requests ({approvedRequests.length})
                  </span>
                } 
                key="approved"
              >
                {renderTable(approvedRequests, approvedColumns)}
              </TabPane>
            </Tabs>
          </Card>
          
          {/* Response Form Modal */}
          {selectedRequest && (
            <DoctorResponseForm
              visible={responseFormVisible}
              onCancel={() => setResponseFormVisible(false)}
              requestData={selectedRequest}
              onSuccess={handleResponseSuccess}
            />
          )}
          
          {/* View Response Modal */}
          <Modal
            title={
              <div>
                <Title level={4} style={{ margin: 0, color: colors.primary.main }}>
                  Response Details
                </Title>
                <Text type="secondary">
                  {responseDetails?.title || 'No Title'}
                </Text>
              </div>
            }
            open={viewResponseModalVisible}
            onCancel={() => {
              setViewResponseModalVisible(false);
              setResponseDetails(null);
            }}
            footer={[
              <Button
                key="close"
                onClick={() => {
                  setViewResponseModalVisible(false);
                  setResponseDetails(null);
                }}
                style={{ 
                  borderRadius: '50px',
                  paddingLeft: '20px',
                  paddingRight: '20px',
                  height: '35px',
                }}
              >
                Close
              </Button>
            ]}
            width={700}
            style={{ borderRadius: '12px' }}
          >
            {responseDetails ? (
              <div>
                <Card style={{ marginBottom: '16px', borderRadius: '12px' }}>
                  <Row gutter={[16, 16]}>
                    <Col span={24}>
                      <Title level={5}>Response Content</Title>
                      <Text>{responseDetails.content || 'No content provided'}</Text>
                    </Col>
                    
                    {responseDetails.attachments && (
                      <Col span={24}>
                        <Title level={5}>Attachments</Title>
                        {renderAttachments(responseDetails.attachments)}
                      </Col>
                    )}
                    
                    <Col span={12}>
                      <Text type="secondary">Response Date:</Text>
                      <div>
                        <Text>{formatDate(responseDetails.responseDate)}</Text>
                      </div>
                    </Col>
                    
                    <Col span={12}>
                      <Text type="secondary">Request Date:</Text>
                      <div>
                        <Text>
                          {responseDetails.consultationRequest && 
                           formatDate(responseDetails.consultationRequest.requestDate)}
                        </Text>
                      </div>
                    </Col>
                  </Row>
                </Card>
                
                <Card style={{ borderRadius: '12px' }}>
                  <Title level={5}>Original Request</Title>
                  {responseDetails.consultationRequest && (
                    <Row gutter={[16, 16]}>
                      <Col span={24}>
                        <Text type="secondary">Title:</Text>
                        <div>
                          <Text strong>{responseDetails.consultationRequest.title || 'No Title'}</Text>
                        </div>
                      </Col>
                      
                      <Col span={24}>
                        <Text type="secondary">Description:</Text>
                        <div>
                          <Text>{responseDetails.consultationRequest.description || 'No description'}</Text>
                        </div>
                      </Col>
                      
                      {responseDetails.consultationRequest.attachments && (
                        <Col span={24}>
                          <Text type="secondary">Attachments:</Text>
                          <div style={{ marginTop: '8px' }}>
                            {renderAttachments(responseDetails.consultationRequest.attachments)}
                          </div>
                        </Col>
                      )}
                    </Row>
                  )}
                </Card>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                <Spin />
              </div>
            )}
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DoctorConsultationResponse;