// Modifying DoctorProfilePage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Layout, Typography, Row, Col, Card, Tabs, Rate, Button, Avatar, Tag, Timeline, Spin, Alert } from 'antd';
import { UserOutlined, ClockCircleOutlined, EnvironmentOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import AppFooter from "../../components/Footer/Footer";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

interface DoctorProfile {
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
    userName: string;
    email: string;
    phone?: string;
    address?: string;
  };
}

const DoctorProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        if (!id) {
          throw new Error("Doctor ID is required");
        }

        const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/doctors/doctorprofile/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        if (!result.data || !Array.isArray(result.data) || result.data.length === 0) {
          throw new Error("Invalid API response or no doctor found");
        }

        setDoctor(result.data[0]);
      } catch (error: any) {
        console.error("Fetch Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorProfile();
  }, [id]);

  const getMetadata = () => {
    try {
      if (doctor?.metadata) {
        return JSON.parse(doctor.metadata);
      }
      return null;
    } catch (e) {
      console.error("Error parsing metadata:", e);
      return null;
    }
  };

  const metadata = getMetadata();

  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh', margin: '-25px' }}>
        <Content style={{ padding: '0 20px', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <Spin size="large" />
          </div>
        </Content>
      </Layout>
    );
  }

  if (error || !doctor) {
    return (
      <Layout style={{ minHeight: '100vh', margin: '-25px' }}>
        <Content style={{ padding: '0 20px', maxWidth: '1200px', margin: '0 auto' }}>
          <Alert
            message="Lỗi khi lấy thông tin bác sĩ"
            description={error || "Không tìm thấy thông tin bác sĩ"}
            type="error"
            showIcon
            style={{ marginTop: '24px' }}
          />
        </Content>
      </Layout>
    );
  }

  // Extract degrees, certificates, and research items from metadata if available
  const degrees = metadata?.years ? [`${metadata.years} năm kinh nghiệm`] : ["Tiến sĩ Y khoa", "Thạc sĩ Y học"];
  const certificates = [doctor.certificate || "Chứng chỉ chuyên khoa"];
  const research = ["Nghiên cứu lâm sàng", "Công bố khoa học"];
  const languages = ["Tiếng Việt", "Tiếng Anh"];
  const specializations = doctor.specialize ? [doctor.specialize] : ["Đa khoa"];

  // Extract hospital information if available
  const hospital = metadata?.hospital || "Bệnh viện";

  return (
    <Layout style={{ minHeight: '100vh', margin: '-25px' }}>
      <Content style={{ 
        padding: '0 20px', 
        maxWidth: '1200px', 
        margin: '0 auto',
        marginBottom: '50px'
      }}>
        <Card style={{ marginTop: '24px' }}>
          <Row gutter={24}>
            <Col span={8}>
              <img 
                src={doctor.profileImg} 
                alt={doctor.biography} 
                style={{ width: '100%', borderRadius: '8px' }}
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/300x400?text=Doctor+Image';
                }}
              />
              <Button type="primary" block style={{ marginTop: '16px' }}>
                Đặt lịch khám
              </Button>
            </Col>
            <Col span={16}>
              <Title level={2}>{doctor.user?.name || doctor.biography}</Title>
              <Rate disabled defaultValue={4.5} style={{ fontSize: '16px' }} />
              <Text style={{ marginLeft: '8px' }}>(80 đánh giá)</Text>
              
              <Row style={{ marginTop: '16px' }}>
                <Col span={24}>
                  <Tag color="blue">{doctor.specialize || "Bác sĩ chuyên khoa"}</Tag>
                  <Tag color="green">{metadata?.years ? `${metadata.years} năm kinh nghiệm` : "Bác sĩ kinh nghiệm"}</Tag>
                </Col>
              </Row>

              <Paragraph style={{ marginTop: '16px' }}>
                <ul>
                  <li><EnvironmentOutlined /> Phòng khám: {hospital || "Chưa cập nhật"}</li>
                  <li><PhoneOutlined /> Số điện thoại: {doctor.user?.phone || "Chưa cập nhật"}</li>
                  <li><MailOutlined /> Email: {doctor.user?.email || "Chưa cập nhật"}</li>
                  <li><ClockCircleOutlined /> Giờ làm việc: 8:00 - 17:00 (Thứ 2 - Thứ 7)</li>
                </ul>
              </Paragraph>
            </Col>
          </Row>

          <Tabs defaultActiveKey="1" style={{ marginTop: '24px' }}>
            <TabPane tab="Thông tin chung" key="1">
              <Title level={4}>Bằng cấp & Chứng chỉ</Title>
              <Row gutter={[24, 24]}>
                <Col span={12}>
                  <Card title="Học vấn" size="small">
                    {degrees.map((degree, index) => (
                      <p key={index}>• {degree}</p>
                    ))}
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="Chứng chỉ chuyên môn" size="small">
                    {certificates.map((cert, index) => (
                      <p key={index}>• {cert}</p>
                    ))}
                  </Card>
                </Col>
              </Row>

              <Title level={4} style={{ marginTop: '24px' }}>Chuyên môn</Title>
              <Row gutter={[24, 24]}>
                <Col span={12}>
                  <Card title="Lĩnh vực chuyên sâu" size="small">
                    {specializations.map((spec, index) => (
                      <Tag color="blue" key={index} style={{ margin: '4px' }}>
                        {spec}
                      </Tag>
                    ))}
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="Ngôn ngữ" size="small">
                    {languages.map((lang, index) => (
                      <Tag color="green" key={index} style={{ margin: '4px' }}>
                        {lang}
                      </Tag>
                    ))}
                  </Card>
                </Col>
              </Row>

              <Title level={4} style={{ marginTop: '24px' }}>Nghiên cứu & Công bố</Title>
              <Card size="small">
                {research.map((item, index) => (
                  <p key={index}>• {item}</p>
                ))}
              </Card>

              <Title level={4} style={{ marginTop: '24px' }}>Kinh nghiệm làm việc</Title>
              <Timeline>
                <Timeline.Item>{metadata?.years ? `${new Date().getFullYear() - parseInt(metadata.years)} - ${new Date().getFullYear()}` : "2018 - nay"}: Bác sĩ tại {hospital || "Bệnh viện"}</Timeline.Item>
                <Timeline.Item>Kinh nghiệm làm việc chuyên môn {metadata?.years || "nhiều"} năm</Timeline.Item>
              </Timeline>
            </TabPane>

            <TabPane tab="Đánh giá" key="2">
              <Row gutter={[16, 16]}>
                {[1, 2, 3].map((review) => (
                  <Col span={24} key={review}>
                    <Card>
                      <Row align="middle">
                        <Avatar icon={<UserOutlined />} />
                        <div style={{ marginLeft: '12px' }}>
                          <Text strong>Người dùng ẩn danh</Text>
                          <br />
                          <Rate disabled defaultValue={5} style={{ fontSize: '12px' }} />
                          <Text type="secondary" style={{ marginLeft: '8px' }}>1 tháng trước</Text>
                        </div>
                      </Row>
                      <Paragraph style={{ marginTop: '12px' }}>
                        Bác sĩ rất tận tâm và chuyên nghiệp. Tôi rất hài lòng với dịch vụ khám chữa bệnh.
                      </Paragraph>
                    </Card>
                  </Col>
                ))}
              </Row>
            </TabPane>

            <TabPane tab="Lịch khám" key="3">
              <Title level={4}>Lịch khám trong tuần</Title>
              <Row gutter={[16, 16]}>
                {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'].map((day) => (
                  <Col span={8} key={day}>
                    <Card title={day} size="small">
                      <p>Sáng: 8:00 - 12:00</p>
                      <p>Chiều: 13:30 - 17:00</p>
                    </Card>
                  </Col>
                ))}
              </Row>
            </TabPane>
          </Tabs>
        </Card>
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default DoctorProfilePage;