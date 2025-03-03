import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Layout, Typography, Row, Col, Card, Tabs, Rate, Button, Avatar, Tag, Timeline } from 'antd';
import { UserOutlined, ClockCircleOutlined, EnvironmentOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import AppFooter from "../../components/Footer/Footer";
import GuestHeader from "../../components/Header/GuestHeader";
import doctorImage from "../../assets/doctor.png";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const doctorsData = [
  {
    id: 1,
    name: "Bác sĩ Nguyễn Văn A",
    specialty: "Bác sĩ chuyên khoa Tim mạch",
    experience: "15 năm kinh nghiệm",
    rating: 4.9,
    reviews: 100,
    address: "123 Đường ABC, Quận 1, TP.HCM",
    phone: "0123 456 789",
    email: "doctor.a@hospital.com",
    workingHours: "8:00 - 17:00 (Thứ 2 - Thứ 7)",
    image: doctorImage,
    price: "86,000 đ",
    degrees: [
      "Tiến sĩ Y khoa - Đại học Y Hà Nội (2010)",
      "Thạc sĩ Y học - Đại học Y Dược TP.HCM (2005)",
      "Bác sĩ Đa khoa - Đại học Y Hà Nội (2000)"
    ],
    certificates: [
      "Chứng chỉ Tim mạch nâng cao - Bệnh viện Johns Hopkins (2012)",
      "Chứng nhận Specialist về Tim mạch can thiệp (2015)",
      "Fellow of the American College of Cardiology (FACC)"
    ],
    research: [
      "Nghiên cứu về bệnh mạch vành ở người trẻ tuổi (2018)",
      "Đồng tác giả 15 công trình nghiên cứu về Tim mạch",
      "Chủ nhiệm 3 đề tài nghiên cứu cấp Nhà nước"
    ],
    languages: ["Tiếng Việt", "Tiếng Anh", "Tiếng Pháp"],
    specializations: [
      "Tim mạch can thiệp",
      "Điều trị rối loạn nhịp tim",
      "Siêu âm tim",
      "Bệnh mạch vành",
      "Suy tim"
    ]
  },
  // Thêm data cho các bác sĩ khác tương tự
];

const DoctorProfilePage: React.FC = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(doctorsData[0]);

  useEffect(() => {
    const doctorId = parseInt(id || "1");
    const foundDoctor = doctorsData.find(d => d.id === doctorId) || doctorsData[0];
    setDoctor(foundDoctor);
  }, [id]);

  return (
    <Layout style={{ minHeight: '100vh', margin: '-25px' }}>
      <GuestHeader />
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
                src={doctor.image} 
                alt={doctor.name} 
                style={{ width: '100%', borderRadius: '8px' }}
              />
              <Button type="primary" block style={{ marginTop: '16px' }}>
                Đặt lịch khám
              </Button>
            </Col>
            <Col span={16}>
              <Title level={2}>{doctor.name}</Title>
              <Rate disabled defaultValue={doctor.rating} style={{ fontSize: '16px' }} />
              <Text style={{ marginLeft: '8px' }}>({doctor.reviews} đánh giá)</Text>
              
              <Row style={{ marginTop: '16px' }}>
                <Col span={24}>
                  <Tag color="blue">{doctor.specialty}</Tag>
                  <Tag color="green">{doctor.experience}</Tag>
                </Col>
              </Row>

              <Paragraph style={{ marginTop: '16px' }}>
                <ul>
                  <li><EnvironmentOutlined /> Phòng khám: {doctor.address}</li>
                  <li><PhoneOutlined /> Số điện thoại: {doctor.phone}</li>
                  <li><MailOutlined /> Email: {doctor.email}</li>
                  <li><ClockCircleOutlined /> Giờ làm việc: {doctor.workingHours}</li>
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
                    {doctor.degrees.map((degree, index) => (
                      <p key={index}>• {degree}</p>
                    ))}
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="Chứng chỉ chuyên môn" size="small">
                    {doctor.certificates.map((cert, index) => (
                      <p key={index}>• {cert}</p>
                    ))}
                  </Card>
                </Col>
              </Row>

              <Title level={4} style={{ marginTop: '24px' }}>Chuyên môn</Title>
              <Row gutter={[24, 24]}>
                <Col span={12}>
                  <Card title="Lĩnh vực chuyên sâu" size="small">
                    {doctor.specializations.map((spec, index) => (
                      <Tag color="blue" key={index} style={{ margin: '4px' }}>
                        {spec}
                      </Tag>
                    ))}
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="Ngôn ngữ" size="small">
                    {doctor.languages.map((lang, index) => (
                      <Tag color="green" key={index} style={{ margin: '4px' }}>
                        {lang}
                      </Tag>
                    ))}
                  </Card>
                </Col>
              </Row>

              <Title level={4} style={{ marginTop: '24px' }}>Nghiên cứu & Công bố</Title>
              <Card size="small">
                {doctor.research.map((item, index) => (
                  <p key={index}>• {item}</p>
                ))}
              </Card>

              <Title level={4} style={{ marginTop: '24px' }}>Kinh nghiệm làm việc</Title>
              <Timeline>
                <Timeline.Item>2008 - 2013: Bác sĩ nội trú tại Bệnh viện Bạch Mai</Timeline.Item>
                <Timeline.Item>2013 - 2018: Bác sĩ chuyên khoa tại Bệnh viện Tim Hà Nội</Timeline.Item>
                <Timeline.Item>2018 - nay: Trưởng khoa Tim mạch tại Bệnh viện ABC</Timeline.Item>
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
                          <Text strong>Nguyễn Văn X</Text>
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