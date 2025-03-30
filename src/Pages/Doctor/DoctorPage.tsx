import React, { useEffect, useState, useCallback } from 'react';
import { Layout, Typography, Row, Col, Card, Spin, Alert, Button, Modal, Form, Input, Upload, message } from 'antd';
import { UploadOutlined, EyeOutlined, SendOutlined } from '@ant-design/icons';
import AppFooter from "../../components/Footer/Footer";
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;
const { Title } = Typography;

interface User {
  id: string;
  name: string;
  email: string;
  profileImg?: string;
  avatar?: string;
  doctor?: {
    id: string;
    certificate: string;
    licenseNumber: string;
    biography: string;
    metadata: string;
    specialize: string;
    status: number;
  }
}

interface UploadResponse {
  url: string;
}


const DEFAULT_PLACEHOLDER = '/assets/doctor-placeholder.png';

const DoctorPage: React.FC = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [messageText, setMessageText] = useState<string>('');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [fileList, setFileList] = useState<any[]>([]);
  const [uploadedFileUrls, setUploadedFileUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [sendingMessage, setSendingMessage] = useState<boolean>(false);
  const [imageLoadErrors, setImageLoadErrors] = useState<Record<string, boolean>>({});
  

  const DOCTOR_ROLE_ID = '00000000-0000-0000-0000-000000000003';


  const fetchDoctors = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

   
      const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/users/all?RoleIds=${DOCTOR_ROLE_ID}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache', 
        },
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError: any) {
        throw new Error(`Failed to parse API response as JSON: ${parseError.message}`);
      }
      

      let doctorsData: User[] = [];
      
      if (data && typeof data === 'object') {

        if (data.data) {

          if (Array.isArray(data.data)) {
            doctorsData = data.data;
          } 

          else if (data.data.data && Array.isArray(data.data.data)) {
            doctorsData = data.data.data;
          }

          else if (typeof data.data === 'object' && !Array.isArray(data.data)) {
            doctorsData = [data.data];
          }
        } 

        else if (Array.isArray(data)) {
          doctorsData = data;
        } else if (data.users && Array.isArray(data.users)) {
          doctorsData = data.users;
        } else if (data.doctors && Array.isArray(data.doctors)) {
          doctorsData = data.doctors;
        } else if (data.results && Array.isArray(data.results)) {
          doctorsData = data.results;
        } else {
          if (data.id && data.name) {
            doctorsData = [data];
          } else {
          }
        }
      } else {
      }
      
      setDoctors(doctorsData);
      
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const handleMessageClick = (doctorId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedDoctorId(doctorId);
    setIsModalVisible(true);
  };

  const isValidImageUrl = (url?: string): boolean => {
    if (!url) return false;
    return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/');
  };

  const getDoctorImageUrl = (doctor: User): string => {
    const doctorId = doctor.id;
    
    if (imageLoadErrors[doctorId]) {
      return DEFAULT_PLACEHOLDER;
    }

    if (isValidImageUrl(doctor.avatar)) {
      return doctor.avatar!;
    } else if (isValidImageUrl(doctor.profileImg)) {
      return doctor.profileImg!;
    }
    
    return DEFAULT_PLACEHOLDER;
  };


  const handleImageError = (doctorId: string) => {
    setImageLoadErrors(prev => ({
      ...prev,
      [doctorId]: true
    }));
  };


  const acceptedFileTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'application/pdf'
  ];

 
  const isFileTypeAccepted = (file: any): boolean => {
    const isAccepted = acceptedFileTypes.includes(file.type);
    if (!isAccepted) {
      message.error(`File type ${file.type} is not supported. Please upload JPG, PNG, GIF or PDF files.`);
    }
    return isAccepted;
  };


  const uploadFile = async (file: File): Promise<string> => {
    const token = localStorage.getItem("token");
    if (!token) {
     
    }

    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': '*/*'
        },
        body: formData
      });
    
      const data: UploadResponse = await response.json();
      
      if (data && data.url) {
        return data.url;
      } else {
        throw new Error("Invalid response format from upload API");
      }
    } catch (error: any) {
      throw error;
    }
  };


  const uploadPendingFiles = async (): Promise<string[]> => {

    const pendingFiles = fileList.filter(fileItem => 
      fileItem.originFileObj && !fileItem.url && fileItem.status !== 'error'
    );
    
    if (pendingFiles.length === 0) {
     
      return [...uploadedFileUrls];
    }

    try {
      setUploading(true);
      
      const newUrls: string[] = [];
      const allUrls = [...uploadedFileUrls]; 
      
      
      for (const fileItem of pendingFiles) {
        try {
          const url = await uploadFile(fileItem.originFileObj);
          newUrls.push(url);
          allUrls.push(url);
          
         
          fileItem.url = url;
          fileItem.status = 'done';
        } catch (error: any) {
          const errorText = error instanceof Error ? error.message : String(error);
          setError(errorText);
        }
      }
      
      
      setFileList([...fileList]);
      
     
      setUploadedFileUrls(allUrls);
      
      return allUrls;
    } catch (error: any) {
      message.error(`Error uploading files: ${error.message}`);
      return [...uploadedFileUrls];
    } finally {
      setUploading(false);
    }
  };

  
  const handleUploadFiles = async () => {
    if (fileList.length === 0) {
      message.info('No files selected for upload');
      return;
    }

    message.loading('Uploading files...', 0);
    const urls = await uploadPendingFiles();
    message.destroy(); 
    
    if (urls.length > 0) {
      message.success(`Successfully uploaded ${urls.length} file(s)`);
    }
  };

  interface RequestData {
    dto: {
      doctorReceiveId: string;
      title: string;
      description: string;
      attachments: string;
    }
  }

  const handleSendMessage = async (): Promise<void> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
      }
  
      if (!messageText.trim()) {
        message.error('Please enter a message');
        return;
      }

      setSendingMessage(true);
      
   
      const messageLoadingKey = 'sendingMessage';
      message.loading({ content: 'Uploading files and sending message...', key: messageLoadingKey });
      
   
      const allFileUrls = await uploadPendingFiles();
      

      const requestData = {
        doctorReceiveId: selectedDoctorId,
        title: 'Consultation Request',
        description: messageText,
        attachments: JSON.stringify(allFileUrls) 
      };

      const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/request/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData),
      });
  
      if (!response.ok) {
        const responseText = await response.text();
        throw new Error(`Failed to parse API response: ${responseText}`);
      }
  
      message.success({ content: 'Message sent successfully!', key: messageLoadingKey });
      setIsModalVisible(false);
      setMessageText('');
      setFileList([]);
      setUploadedFileUrls([]);
    } catch (error: any) {
    } finally {
      setSendingMessage(false);
    }
  };

  const handleFileChange = ({ fileList }: any) => {

    const validFiles = fileList.filter((file: any) => {
 
      if (file.status === 'done' || file.status === 'uploading') {
        return true;
      }
      
      return acceptedFileTypes.includes(file.type);
    });
    
    setFileList(validFiles);
  };

  const handleBeforeUpload = (file: any) => {
    const isValid = isFileTypeAccepted(file);
    if (!isValid) {
      return Upload.LIST_IGNORE;
    }
    
    return false;
  };

  const navigateToDoctorProfile = (userId: string) => {
    navigate(`/doctor/${userId}`);
  };

  return (
    <Layout style={{ minHeight: '100vh', margin: '-25px' }}>
      <Content style={{ padding: '0 10px', maxWidth: '1300px', marginLeft: '100px', marginTop: '70px' }}>
        <Row gutter={16} style={{ display: 'flex' }}>
          <Col span={18} style={{ display: 'flex', flexDirection: 'column' }}>
            <Title level={2} style={{ marginBottom: '10px', color: '#0b4778' }}>Doctors</Title>
            {loading && <Spin size="large" style={{ display: 'block', textAlign: 'center' }} />}
            {error && (
              <Alert
                message="Error fetching doctors"
                description={error}
                type="error"
                showIcon
                style={{ marginBottom: '20px' }}
              />
            )}
            {!loading && !error && doctors.length === 0 && (
              <Alert
                message="No doctors found"
                description="No doctors were found matching the criteria."
                type="info"
                showIcon
                style={{ marginBottom: '20px' }}
              />
            )}
            <Row gutter={[16, 16]} style={{ flexWrap: 'wrap' }}>
              {!loading && !error && doctors.map((doctor) => (
                <Col span={8} key={doctor.id}>
                  <Card
                    hoverable
                    cover={
                      <div style={{ position: 'relative' }}>
                        <img 
                          alt={doctor.name || "Doctor Image"} 
                          src={getDoctorImageUrl(doctor)} 
                          onError={() => handleImageError(doctor.id)}
                          loading="lazy" 
                          style={{ 
                            objectFit: 'cover', 
                            width: '100%', 
                            height: '250px' 
                          }} 
                        />
                      </div>
                    }
                    style={{ 
                      marginBottom: '20px', 
                      marginTop: '20px',
                      overflow: 'hidden'
                    }}
                    actions={[
                      <Button 
                        key="view" 
                        type="primary" 
                        icon={<EyeOutlined />} 
                        onClick={() => navigateToDoctorProfile(doctor.id)}
                      >
                        View Profile
                      </Button>,
                      <Button 
                        key="contact" 
                        onClick={(e) => handleMessageClick(doctor.doctor?.id || doctor.id, e)}
                      >
                        Contact
                      </Button>
                    ]}
                  >
                    <Card.Meta
                      title={<div className="title">{doctor.name || "Doctor"}</div>}
                      description={
                        <>
                          <p>Specialization: {doctor.doctor?.specialize || "Not specified"}</p>
                          <p>License: {doctor.doctor?.licenseNumber || "Not available"}</p>
                        </>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Content>

      <Modal
        title="Send Message to Doctor"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Cancel
          </Button>,
          <Button 
            key="upload" 
            onClick={handleUploadFiles} 
            loading={uploading} 
            icon={<UploadOutlined />}
          >
            Upload Files
          </Button>,
          <Button
            key="send"
            type="primary"
            icon={<SendOutlined />}
            loading={sendingMessage}
            onClick={handleSendMessage}
          >
            Send Message
          </Button>
        ]}
      >
        <Form
          layout="vertical"
          onFinish={handleSendMessage}
        >
          <Form.Item
            label="Message"
            name="message"
            rules={[{ required: true, message: 'Please enter your message' }]}
          >
            <Input.TextArea
              rows={4}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            />
          </Form.Item>
          
          <Form.Item
            label="Attachment(s)"
          >
            <Upload
              fileList={fileList}
              onChange={handleFileChange}
              beforeUpload={handleBeforeUpload}
              multiple
            >
              <Button icon={<UploadOutlined />}>Select Files</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      <AppFooter />
    </Layout>
  );
};

export default DoctorPage;
