import React, { useEffect, useState } from 'react';
import { Layout, Typography, Row, Col, Card, Menu, Spin, Alert, Button, Modal, Select, Form, Input } from 'antd';
import AppFooter from "../../components/Footer/Footer";
import { Link } from 'react-router-dom';

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

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

interface Child {
  id: string;
  name: string;
}

const DoctorPage: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');
  const [doctorId, setDoctorId] = useState<string>('');

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

  const fetchChildren = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Authentication token missing. Please login again.");
        return;
      }
      
      const response = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/children/getChildByToken`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
  
      if (response.data?.data && Array.isArray(response.data.data)) {
        setChildren(response.data.data.map((child: any) => ({
          id: child.id,
          name: child.name || `Child ${child.id.substring(0, 8)}`,
        })));
      } else {
        throw new Error("Invalid data format received");
      }
    } catch (error: any) {
      console.error("Error fetching children:", error);
      message.error(error.response?.data?.message || "Failed to load children data");
    } finally {
      setLoading(false);
    }
  };
  
  const handleMessageClick = (doctorId: string) => {
    setDoctorId(doctorId);
    fetchChildren();
    setIsModalVisible(true);
  };

  const handleSendMessage = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/request/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorReceiveId: doctorId,
          childId: selectedChildId,
          title: 'Consultation Request',
          description: message,
          attachments: '',  
        }),
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
                      Message
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
          <Form.Item label="Select Child" required>
            {children.length === 0 ? (
             <Spin size="small" />
           ) : (
              <Select onChange={(value) => setSelectedChildId(value)} placeholder="Select a child">
                {children.map((child) => (
                  <Option key={child.id} value={child.id}>{child.name}</Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Message" required>
            <Input.TextArea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message here"
              rows={4}
            />
          </Form.Item>
        </Form>
      </Modal>

      <AppFooter />
    </Layout>
  );
};

export default DoctorPage;
