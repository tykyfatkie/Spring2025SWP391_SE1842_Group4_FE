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

// Add a default placeholder image
const DEFAULT_PLACEHOLDER = '/assets/doctor-placeholder.png'; // Update with your actual placeholder path

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
  
  // Doctor role ID constant
  const DOCTOR_ROLE_ID = '00000000-0000-0000-0000-000000000003';

  // Memoize the fetch doctors function to prevent unnecessary re-renders
  const fetchDoctors = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      // Using the users/all API with RoleIds filter
      const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/users/all?RoleIds=${DOCTOR_ROLE_ID}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache', // Prevent caching issues
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Get the response as JSON directly
      let data;
      try {
        data = await response.json();
      } catch (parseError: any) {
        const responseText = await response.text();
        console.error("Failed to parse API response as JSON:", responseText.substring(0, 200));
        throw new Error(`Failed to parse API response as JSON: ${parseError.message}`);
      }
      
      // Handle the nested data structure correctly
      let doctorsData: User[] = [];
      
      if (data && typeof data === 'object') {
        // First check if the response has a 'data' property
        if (data.data) {
          // Check if data.data is an array
          if (Array.isArray(data.data)) {
            doctorsData = data.data;
          } 
          // Check if data.data is an object that contains another 'data' array
          else if (data.data.data && Array.isArray(data.data.data)) {
            doctorsData = data.data.data;
          }
          // If data.data is a single object, wrap it in an array
          else if (typeof data.data === 'object' && !Array.isArray(data.data)) {
            doctorsData = [data.data];
          }
        } 
        // Check other common response patterns
        else if (Array.isArray(data)) {
          doctorsData = data;
        } else if (data.users && Array.isArray(data.users)) {
          doctorsData = data.users;
        } else if (data.doctors && Array.isArray(data.doctors)) {
          doctorsData = data.doctors;
        } else if (data.results && Array.isArray(data.results)) {
          doctorsData = data.results;
        } else {
          // Check if data itself is a valid doctor object (single doctor case)
          if (data.id && data.name) {
            doctorsData = [data];
          } else {
            throw new Error(`Could not find doctors array in API response.`);
          }
        }
      } else {
        throw new Error(`API response is not a valid object: ${typeof data}`);
      }
      
      setDoctors(doctorsData);
      
    } catch (error: any) {
      console.error("Fetch Error:", error);
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

  // Helper function to validate image URLs
  const isValidImageUrl = (url?: string): boolean => {
    if (!url) return false;
    return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/');
  };

  // Improved image URL getter with validation
  const getDoctorImageUrl = (doctor: User): string => {
    const doctorId = doctor.id;
    
    // Check if this image previously had a loading error
    if (imageLoadErrors[doctorId]) {
      return DEFAULT_PLACEHOLDER;
    }

    if (isValidImageUrl(doctor.avatar)) {
      return doctor.avatar!;
    } else if (isValidImageUrl(doctor.profileImg)) {
      return doctor.profileImg!;
    }
    
    // Return default placeholder if no valid image URL
    return DEFAULT_PLACEHOLDER;
  };

  // Image error handler to track failed images
  const handleImageError = (doctorId: string) => {
    setImageLoadErrors(prev => ({
      ...prev,
      [doctorId]: true
    }));
  };

  // These are the allowed file types
  const acceptedFileTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'application/pdf'
  ];

  // Function to check if file type is allowed
  const isFileTypeAccepted = (file: any): boolean => {
    const isAccepted = acceptedFileTypes.includes(file.type);
    if (!isAccepted) {
      message.error(`File type ${file.type} is not supported. Please upload JPG, PNG, GIF or PDF files.`);
    }
    return isAccepted;
  };

  // Function to upload a single file
  const uploadFile = async (file: File): Promise<string> => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
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

      if (!response.ok) {
        const responseText = await response.text();
        throw new Error(`Upload failed with status: ${response.status}. Response: ${responseText.substring(0, 500)}`);
      }

      // Try to parse the JSON response
      const data: UploadResponse = await response.json();
      
      if (data && data.url) {
        return data.url;
      } else {
        throw new Error("Invalid response format from upload API");
      }
    } catch (error: any) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  // Function to upload all pending files
  const uploadPendingFiles = async (): Promise<string[]> => {
    // Filter files that need to be uploaded (no URL yet)
    const pendingFiles = fileList.filter(fileItem => 
      fileItem.originFileObj && !fileItem.url && fileItem.status !== 'error'
    );
    
    if (pendingFiles.length === 0) {
      // Return current uploaded URLs if no new files to upload
      return [...uploadedFileUrls];
    }

    try {
      setUploading(true);
      
      const newUrls: string[] = [];
      const allUrls = [...uploadedFileUrls]; // Start with already uploaded URLs
      
      // Upload files one by one
      for (const fileItem of pendingFiles) {
        try {
          const url = await uploadFile(fileItem.originFileObj);
          newUrls.push(url);
          allUrls.push(url);
          
          // Update file item with URL and status
          fileItem.url = url;
          fileItem.status = 'done';
        } catch (error: any) {
          console.error("Fetch Error:", error);
          const errorText = error instanceof Error ? error.message : String(error);
          setError(errorText);
        }
      }
      
      // Update the file list
      setFileList([...fileList]);
      
      // Update state with all URLs
      setUploadedFileUrls(allUrls);
      
      return allUrls;
    } catch (error: any) {
      message.error(`Error uploading files: ${error.message}`);
      return [...uploadedFileUrls]; // Return existing URLs on error
    } finally {
      setUploading(false);
    }
  };

  // Manual upload function
  const handleUploadFiles = async () => {
    if (fileList.length === 0) {
      message.info('No files selected for upload');
      return;
    }

    message.loading('Uploading files...', 0);
    const urls = await uploadPendingFiles();
    message.destroy(); // Remove the loading message
    
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
        throw new Error("No token found");
      }
  
      if (!messageText.trim()) {
        message.error('Please enter a message');
        return;
      }

      setSendingMessage(true);
      
      // First, upload any pending files
      const messageLoadingKey = 'sendingMessage';
      message.loading({ content: 'Uploading files and sending message...', key: messageLoadingKey });
      
      // Upload any pending files first
      const allFileUrls = await uploadPendingFiles();
      
      // Create a request object with attachments as a string (JSON.stringify the array)
      const requestData: RequestData = {
        dto: {
          doctorReceiveId: selectedDoctorId,
          title: 'Consultation Request',
          description: messageText,
          attachments: JSON.stringify(allFileUrls) // Convert array to JSON string
        }
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
        console.error("Failed to parse API response as JSON:", responseText.substring(0, 200));
        throw new Error(`Failed to parse API response: ${responseText}`);
      }
  
      message.success({ content: 'Message sent successfully!', key: messageLoadingKey });
      setIsModalVisible(false);
      setMessageText('');
      setFileList([]);
      setUploadedFileUrls([]);
    } catch (error: any) {
      message.error(`Failed to send message: ${error.message}`);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleFileChange = ({ fileList }: any) => {
    // Filter out files that don't pass validation
    const validFiles = fileList.filter((file: any) => {
      // If the file is already uploaded or being uploaded, consider it valid
      if (file.status === 'done' || file.status === 'uploading') {
        return true;
      }
      
      // For new files, validate the type
      return acceptedFileTypes.includes(file.type);
    });
    
    setFileList(validFiles);
  };

  const handleBeforeUpload = (file: any) => {
    const isValid = isFileTypeAccepted(file);
    if (!isValid) {
      return Upload.LIST_IGNORE;
    }
    
    // Always return false to prevent auto upload
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
                          loading="lazy" // Add lazy loading
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
            disabled={fileList.length === 0 || sendingMessage}
            style={{ marginRight: 8 }}
          >
            Upload Files
          </Button>,
          <Button 
            key="send" 
            type="primary" 
            icon={<SendOutlined />}
            onClick={handleSendMessage} 
            loading={sendingMessage}
            disabled={!messageText.trim() || uploading}
          >
            Send Message
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item 
            label="Message" 
            required
            rules={[{ required: true, message: 'Please enter your message' }]}
          >
            <Input.TextArea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Enter your message here"
              rows={4}
              disabled={uploading || sendingMessage}
            />
          </Form.Item>
          <Form.Item label="Upload Files (Optional)">
            <Upload
              fileList={fileList}
              onChange={handleFileChange}
              beforeUpload={handleBeforeUpload}
              multiple={true}
              accept=".jpg,.jpeg,.png,.gif,.pdf"
              disabled={uploading || sendingMessage}
              showUploadList={{
                showRemoveIcon: true,
                removeIcon: (file) => (
                  <Button 
                    type="text" 
                    size="small" 
                    danger
                    disabled={uploading || sendingMessage}
                    onClick={() => {
                      // Remove file from state
                      const newFileList = fileList.filter(item => item.uid !== file.uid);
                      setFileList(newFileList);
                      
                      // Also remove from uploaded URLs if it exists there
                      if (file.url) {
                        const newUrls = uploadedFileUrls.filter(url => url !== file.url);
                        setUploadedFileUrls(newUrls);
                      }
                    }}
                  >
                    Remove
                  </Button>
                )
              }}
            >
              <Button icon={<UploadOutlined />} disabled={uploading || sendingMessage}>
                Select Files
              </Button>
            </Upload>
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#999' }}>
              Supported file types: JPG, PNG, GIF, PDF
            </div>
            {uploadedFileUrls.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <p>Uploaded files:</p>
                <ul>
                  {uploadedFileUrls.map((url, index) => (
                    <li key={index}>
                      <a href={url} target="_blank" rel="noopener noreferrer">
                        {url.split('/').pop()}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Form.Item>
        </Form>
      </Modal>

      <AppFooter />
    </Layout>
  );
};

export default DoctorPage;