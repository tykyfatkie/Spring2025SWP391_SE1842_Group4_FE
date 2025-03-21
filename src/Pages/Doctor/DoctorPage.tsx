import React, { useEffect, useState } from 'react';
import { Layout, Typography, Row, Col, Card, Spin, Alert, Button, Modal, Form, Input, Upload, message } from 'antd';
import { UploadOutlined, EyeOutlined } from '@ant-design/icons';
import AppFooter from "../../components/Footer/Footer";
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;
const { Title } = Typography;

interface User {
  id: string;
  name: string;
  email: string;
  profileImg?: string;
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

const DoctorPage: React.FC = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [messageText, setMessageText] = useState<string>('');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [fileList, setFileList] = useState<any[]>([]);

  // Doctor role ID constant
  const DOCTOR_ROLE_ID = '00000000-0000-0000-0000-000000000003';

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        // Using the users/all API with RoleIds filter
        const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/users/all?RoleIds=${DOCTOR_ROLE_ID}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Get the raw text of the response first to log it
        const responseText = await response.text();
        console.log("Raw API Response:", responseText);
        
        // Try to parse the JSON
        let data;
        try {
          data = JSON.parse(responseText);
          console.log("Parsed API Response:", data);
        } catch (parseError) {
          throw new Error(`Failed to parse API response as JSON: ${responseText.substring(0, 200)}...`);
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
              // Log the keys if it's an object but not in an expected format
              console.log("Available keys in response:", Object.keys(data));
              throw new Error(`Could not find doctors array in API response. Available keys: ${Object.keys(data).join(', ')}`);
            }
          }
        } else {
          throw new Error(`API response is not a valid object: ${typeof data}`);
        }
        
        console.log("Extracted doctors data:", doctorsData);
        setDoctors(doctorsData);
        
      } catch (error: any) {
        console.error("Fetch Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleMessageClick = (doctorId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedDoctorId(doctorId);
    setIsModalVisible(true);
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
  const isFileTypeAccepted = (file: any) => {
    const isAccepted = acceptedFileTypes.includes(file.type);
    if (!isAccepted) {
      message.error(`File type ${file.type} is not supported. Please upload JPG, PNG, GIF or PDF files.`);
    }
    return isAccepted || Upload.LIST_IGNORE;
  };

  const handleSendMessage = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      if (!messageText.trim()) {
        message.error('Please enter a message');
        return;
      }

      const formData = new FormData();
      formData.append('doctorReceiveId', selectedDoctorId);
      formData.append('title', 'Consultation Request');
      formData.append('description', messageText);

      // Add each file to the FormData
      if (fileList.length > 0) {
        fileList.forEach((file, index) => {
          // Make sure we have the original file object
          if (file.originFileObj) {
            formData.append(`attachments`, file.originFileObj);
          }
        });
      }

      console.log("Sending request to:", `${import.meta.env.VITE_API_ENDPOINT}/request/send`);
      console.log("Form data entries:", [...formData.entries()].map(entry => `${entry[0]}: ${entry[1]}`));

      const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/request/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Remove Content-Type header to let the browser set it with the proper boundary
          // for multipart/form-data
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error response:", errorText);
        throw new Error(`Failed to send message. Server responded with ${response.status}: ${errorText}`);
      }

      message.success('Message sent successfully!');
      setIsModalVisible(false);
      setMessageText('');
      setFileList([]);
    } catch (error: any) {
      console.error('Error sending message:', error);
      message.error(`Failed to send message: ${error.message}`);
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

  const navigateToDoctorProfile = (userId: string) => {
    console.log("Navigating to doctor profile with userId:", userId);
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
                          src={doctor.profileImg || 'https://via.placeholder.com/300x250'} 
                          style={{ 
                            transition: 'transform 0.5s', 
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
                      transition: 'transform 0.5s, box-shadow 0.5s',
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
        onOk={handleSendMessage}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form>
          <Form.Item label="Message" required>
            <Input.TextArea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Enter your message here"
              rows={4}
            />
          </Form.Item>
          <Form.Item label="Upload Image or PDF">
            <Upload
              fileList={fileList}
              onChange={handleFileChange}
              beforeUpload={() => false} // Prevent auto upload
              accept=".jpg,.jpeg,.png,.gif,.pdf" // This provides a filter in the file picker dialog
            >
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#999' }}>
              Supported file types: JPG, PNG, GIF, PDF
            </div>
          </Form.Item>
        </Form>
      </Modal>

      <AppFooter />
    </Layout>
  );
};

export default DoctorPage;