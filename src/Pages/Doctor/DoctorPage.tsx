import React, { useEffect, useState } from 'react';
import { Layout, Typography, Row, Col, Card, Spin, Alert, Button, Modal, Form, Input, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import AppFooter from "../../components/Footer/Footer";

const { Content } = Layout;
const { Title } = Typography;

interface Doctor {
  id: string;
  certificate: string;
  licenseNumber: string;
  biography: string;
  metadata: string;
  specialize: string;
  profileImg: string;
  status: number;
  userId: string;
  user?: {
    name: string;
  };
}

const DoctorPage: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [messageText, setMessageText] = useState<string>('');
  const [doctorId, setDoctorId] = useState<string>('');
  const [fileList, setFileList] = useState<any[]>([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/doctors/all`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (!Array.isArray(data.data)) {
          throw new Error("Invalid API response: Expected an array");
        }

        const updatedDoctors = await Promise.all(data.data.map(async (doctor) => {
          try {
            const profileResponse = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/doctors/doctorprofile/${doctor.userId}`);
            if (profileResponse.ok) {
              const profileData = await profileResponse.json();
              if (profileData.data && Array.isArray(profileData.data) && profileData.data.length > 0) {
                doctor.user = { name: profileData.data[0].user?.name || "Doctor not updated" };
              }
            }
          } catch (profileError) {
            console.error("Error fetching doctor profile:", profileError);
          }
          return doctor;
        }));

        setDoctors(updatedDoctors);
      } catch (error: any) {
        console.error("Fetch Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleMessageClick = (doctorId: string) => {
    setDoctorId(doctorId);
    setIsModalVisible(true);
  };

  const handleSendMessage = async () => {
    try {
      const formData = new FormData();
      formData.append('doctorReceiveId', doctorId);
      formData.append('title', 'Consultation Request');
      formData.append('description', messageText);

      fileList.forEach(file => {
        formData.append('attachments', file.originFileObj);
      });

      const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/request/send`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      Modal.success({
        content: 'Message sent successfully!',
      });
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleFileChange = ({ fileList }: any) => {
    setFileList(fileList);
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
            <Row gutter={[16, 16]} style={{ flexWrap: 'wrap' }}>
              {!loading && !error && doctors.map((doctor) => (
                <Col span={8} key={doctor.id}>
                  <Card
                    hoverable
                    cover={<img alt={doctor.user?.name || "Doctor Image"} src={doctor.profileImg} style={{ transition: 'transform 0.5s', objectFit: 'cover', width: '100%', height: '250px' }} />}
                    style={{ marginBottom: '20px', marginTop: '20px', transition: 'transform 0.5s, box-shadow 0.5s' }}
                  >
                    <Card.Meta
                      title={<div className="title">{doctor.user?.name || "Doctor not updated"}</div>}
                      description={
                        <>
                          <p>Specialization: {doctor.specialize}</p>
                          <p>License: {doctor.licenseNumber}</p>
                        </>
                      }
                    />
                    <Button type="primary" block onClick={() => handleMessageClick(doctor.id)}>
                      Contact for support
                    </Button>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Content>

      <Modal
        title="Send Message to Doctor"
        visible={isModalVisible}
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
            >
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      <AppFooter />
    </Layout>
  );
};

export default DoctorPage;