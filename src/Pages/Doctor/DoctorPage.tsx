import React, { useEffect, useState, useCallback } from 'react';
import { Layout, Typography, Row, Col, Card, Spin, Alert, Button, Modal, Form, Input, Upload, message } from 'antd';
import { UploadOutlined, EyeOutlined, SendOutlined } from '@ant-design/icons';
import AppFooter from "../../components/Footer/Footer";
import { useNavigate } from 'react-router-dom';
import { UploadFile, UploadChangeParam } from 'antd/es/upload/interface';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

// Type definitions
interface Doctor {
  id: string;
  certificate: string;
  licenseNumber: string;
  biography: string;
  metadata: string;
  specialize: string;
  status: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  profileImg?: string;
  avatar?: string;
  doctor?: Doctor;
  specialize?: string;
  licenseNumber?: string;
  metadata?: string;
  userId?: string; // Added userId field to store original user ID
  user?: User; // Add this to allow nested user objects
}

interface UploadResponse {
  url: string;
}

// Constants
const DEFAULT_PLACEHOLDER = '/assets/doctor-placeholder.png';
const DOCTOR_ROLE_ID = '00000000-0000-0000-0000-000000000003';
const ACCEPTED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'application/pdf'
];

const DoctorPage: React.FC = () => {
  const navigate = useNavigate();
  
  // State management
  const [doctors, setDoctors] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [messageText, setMessageText] = useState<string>('');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploadedFileUrls, setUploadedFileUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [sendingMessage, setSendingMessage] = useState<boolean>(false);
  const [imageLoadErrors, setImageLoadErrors] = useState<Record<string, boolean>>({});
  
  // Fetch the token from local storage
  const getToken = (): string => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }
    return token;
  };
  
  // Extract doctors from API response
  const extractDoctorsFromResponse = (responseData: any): User[] => {
    if (!responseData) return [];
    
    // Handle different response structures
    if (responseData.data) {
      if (Array.isArray(responseData.data)) {
        return responseData.data;
      } 
      if (responseData.data.data && Array.isArray(responseData.data.data)) {
        return responseData.data.data;
      }
      if (typeof responseData.data === 'object' && !Array.isArray(responseData.data)) {
        return [responseData.data];
      }
    }
    
    if (Array.isArray(responseData)) {
      return responseData;
    }
    
    if (responseData.users && Array.isArray(responseData.users)) {
      return responseData.users;
    }
    
    if (responseData.doctors && Array.isArray(responseData.doctors)) {
      return responseData.doctors;
    }
    
    if (responseData.results && Array.isArray(responseData.results)) {
      return responseData.results;
    }
    
    if (responseData.id && responseData.name) {
      return [responseData];
    }
    
    throw new Error("Could not find doctors array in API response.");
  };

  // Fetch doctor profile data
  const fetchDoctorProfile = async (doctorId: string, token: string): Promise<User | null> => {
    try {
      const profileResponse = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/doctors/doctorprofile/${doctorId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache',
        },
      });
      
      if (!profileResponse.ok) return null;
      
      const profileData = await profileResponse.json();
      
      if (profileData?.data?.length > 0) {
        return profileData.data[0];
      }
      
      return null;
    } catch (error) {
      console.error(`Error fetching doctor profile for ${doctorId}:`, error);
      return null;
    }
  };

  // Fetch all doctors
  const fetchDoctors = useCallback(async () => {
    try {
      const token = getToken();
      
      const userResponse = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/users/all?RoleIds=${DOCTOR_ROLE_ID}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache', 
        },
      });
  
      if (!userResponse.ok) {
        throw new Error(`HTTP error! Status: ${userResponse.status}`);
      }
  
      const userData = await userResponse.json();
      const doctorUsers = extractDoctorsFromResponse(userData);
      
      // Enrich with doctor profile data
      const enrichedDoctors: User[] = [];
      
      for (const doctor of doctorUsers) {
        // Store the original userId before enrichment
        const userId = doctor.id;
        
        const profileData = await fetchDoctorProfile(doctor.id, token);
        
        if (profileData) {
          // Merge the detailed profile with basic user data
          enrichedDoctors.push({
            ...doctor,
            ...profileData,
            userId: userId, // Keep track of the original userId
            // Keep the user info if it exists
            user: {
              ...doctor,
              ...(profileData.user || {})
            }
          });
        } else {
          // Ensure userId is saved even without profile data
          enrichedDoctors.push({
            ...doctor,
            userId: userId
          });
        }
      }
      
      setDoctors(enrichedDoctors);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  // Image handling
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
    } 
    
    if (isValidImageUrl(doctor.profileImg)) {
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

  // File handling
  const isFileTypeAccepted = (file: File): boolean => {
    const isAccepted = ACCEPTED_FILE_TYPES.includes(file.type);
    if (!isAccepted) {
      message.error(`File type ${file.type} is not supported. Please upload JPG, PNG, GIF or PDF files.`);
    }
    return isAccepted;
  };

  const uploadFile = async (file: File): Promise<string> => {
    const token = getToken();
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': '*/*'
      },
      body: formData
    });

    if (!response.ok) {
      const responseText = await response.text();
      throw new Error(`Upload failed with status: ${response.status}. Response: ${responseText.substring(0, 500)}`);
    }

    const data: UploadResponse = await response.json();
    
    if (data?.url) {
      return data.url;
    }
    
    throw new Error("Invalid response format from upload API");
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
      const updatedFileList = [...fileList];
      
      for (const fileItem of pendingFiles) {
        try {
          if (!fileItem.originFileObj) continue;
          
          const url = await uploadFile(fileItem.originFileObj);
          newUrls.push(url);
          allUrls.push(url);
          
          // Update file item status
          const index = updatedFileList.findIndex(item => item.uid === fileItem.uid);
          if (index !== -1) {
            updatedFileList[index] = {
              ...updatedFileList[index],
              url,
              status: 'done'
            };
          }
        } catch (error: any) {
          setError(error instanceof Error ? error.message : String(error));
        }
      }
      
      setFileList(updatedFileList);
      setUploadedFileUrls(allUrls);
      
      return allUrls;
    } catch (error: any) {
      message.error(`Error uploading files: ${error.message}`);
      return [...uploadedFileUrls];
    } finally {
      setUploading(false);
    }
  };

  // Event handlers
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

  const handleSendMessage = async (): Promise<void> => {
    try {
      const token = getToken();
  
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
        throw new Error(`Failed to send message: ${responseText}`);
      }
  
      message.success({ content: 'Message sent successfully!', key: messageLoadingKey });
      resetFormState();
    } catch (error: any) {
      message.error(`Failed to send message: ${error.message}`);
    } finally {
      setSendingMessage(false);
    }
  };

  const resetFormState = () => {
    setIsModalVisible(false);
    setMessageText('');
    setFileList([]);
    setUploadedFileUrls([]);
  };

  const handleFileChange = (info: UploadChangeParam<UploadFile>) => {
    const validFiles = info.fileList.filter((file) => {
      if (file.status === 'done' || file.status === 'uploading') {
        return true;
      }
      
      return file.originFileObj && ACCEPTED_FILE_TYPES.includes(file.originFileObj.type);
    });
    
    setFileList(validFiles);
  };

  const handleBeforeUpload = (file: File) => {
    const isValid = isFileTypeAccepted(file);
    if (!isValid) {
      return Upload.LIST_IGNORE;
    }
    
    return false; // Prevent auto upload
  };

  const handleMessageClick = (event: React.MouseEvent, doctorId: string) => {
    event.stopPropagation();
    setSelectedDoctorId(doctorId);
    setIsModalVisible(true);
  };

  // Modified: Updated to use the stored userId
  const navigateToDoctorProfile = (doctor: User) => {
    // Always use the original userId for navigation
    const userId = doctor.userId || doctor.id;
    
    if (userId) {
      navigate(`/doctor/${userId}`);
    } else {
      console.error("User ID not found");
      // Fallback if no userId
      if (doctor.doctor?.id) {
        navigate(`/doctor/${doctor.doctor.id}`);
      } else {
        message.error("Cannot view doctor profile due to missing ID information");
      }
    }
  };

  // Parse doctor metadata safely
  const parseMetadata = (metadataString?: string) => {
    if (!metadataString) return {};
    try {
      return JSON.parse(metadataString);
    } catch {
      return {};
    }
  };

  // Get doctor specialization
  const getDoctorSpecialization = (doctor: User): string => {
    return doctor.doctor?.specialize || 
           doctor.specialize || 
           parseMetadata(doctor.metadata)?.specialization || 
           "General Practice";
  };

  // Get doctor license number
  const getDoctorLicenseNumber = (doctor: User): string => {
    return doctor.doctor?.licenseNumber || 
           doctor.licenseNumber || 
           parseMetadata(doctor.metadata)?.licenseNumber || 
           "N/A";
  };

  // UI Components
  const renderHeroBanner = () => (
    <div
      style={{
        display: 'flex',
        height: '400px',
        marginBottom: '30px',
        position: 'relative',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        borderRadius: '0 0 30px 30px',
      }}
    >
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 48px',
          background: 'linear-gradient(135deg, rgb(30, 58, 138) 0%, rgb(59, 130, 246) 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
          top: '-100px',
          left: '-100px',
        }} />
        <div style={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.08)',
          bottom: '-50px',
          right: '50px',
        }} />
        
        <div style={{ maxWidth: '800px', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <div style={{ 
            display: 'inline-block', 
            padding: '8px 16px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            marginBottom: '16px'
          }}>
            <span style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>FIND A DOCTOR</span>
          </div>
          
          <Title level={1} style={{ color: 'white', fontSize: '52px', marginBottom: '24px', fontWeight: 700, lineHeight: 1.2 }}>
            Our Doctors
          </Title>
          <Paragraph style={{ fontSize: 18, marginBottom: 32, color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.6 }}>
            Find and connect with our qualified specialists to help with your child's growth and development.
          </Paragraph>
        </div>
      </div>
    </div>
  );

  const renderDoctorCard = (doctor: User) => (
    <Col xs={24} md={12} lg={8} key={doctor.id}>
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
          height: '100%',
          borderRadius: '16px',
          border: 'none',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s ease',
          overflow: 'hidden',
          position: 'relative'
        }}
        bodyStyle={{ padding: '24px' }}
        actions={[
          <Button 
            key="view" 
            type="primary" 
            icon={<EyeOutlined />}
            // Modified: Pass entire doctor object to the navigation function
            onClick={() => navigateToDoctorProfile(doctor)}
            style={{
              margin: '0 8px',
              background: '#1e3a8a',
              borderColor: '#1e3a8a'
            }}
          >
            View Profile
          </Button>,
          <Button 
            key="contact"
            onClick={(e) => handleMessageClick(e, doctor.doctor?.id || doctor.id)}
            style={{
              margin: '0 8px'
            }}
          >
            Contact
          </Button>
        ]}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: '#1e3a8a', opacity: 0.7 }} />
        <Card.Meta
          title={<div style={{ fontSize: '22px', color: '#1e3a8a', fontWeight: 600, marginBottom: '8px' }}>{doctor.name || "Doctor"}</div>}
          description={
            <div style={{ color: '#4b5563' }}>
              <p><strong>Specialization:</strong> {getDoctorSpecialization(doctor)}</p>
              <p><strong>License:</strong> {getDoctorLicenseNumber(doctor)}</p>
            </div>
          }
        />
      </Card>
    </Col>
  );

  const renderMessageModal = () => (
    <Modal
      title={<div style={{ color: '#1e3a8a', fontSize: '20px', fontWeight: 600 }}>Send Message to Doctor</div>}
      open={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      width={600}
      style={{ borderRadius: '16px' }}
      bodyStyle={{ padding: '24px' }}
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
          style={{
            background: '#1e3a8a',
            borderColor: '#1e3a8a'
          }}
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
            style={{ borderRadius: '8px' }}
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
  );

  return (
    <Layout style={{ minHeight: '100vh', background: 'white', margin: '-25px' }}>
      {renderHeroBanner()}

      <Content style={{ width: '95%', maxWidth: '1300px', margin: '0 auto', padding: '0 24px 60px' }}>
        {loading && <Spin size="large" style={{ display: 'flex', justifyContent: 'center', margin: '40px auto' }} />}
        
        {error && (
          <Alert
            message="Error fetching doctors"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: '20px', borderRadius: '8px' }}
          />
        )}
        
        {!loading && !error && doctors.length === 0 && (
          <Alert
            message="No doctors found"
            description="No doctors were found matching the criteria."
            type="info"
            showIcon
            style={{ marginBottom: '20px', borderRadius: '8px' }}
          />
        )}
        
        <Row gutter={[32, 32]} style={{ marginTop: '20px' }}>
          {!loading && !error && doctors.map(renderDoctorCard)}
        </Row>
      </Content>

      {renderMessageModal()}

      <AppFooter />
    </Layout>
  );
};

export default DoctorPage;