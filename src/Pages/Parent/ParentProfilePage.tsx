import React, { useState } from 'react';
import { 
  Layout, 
  Typography, 
  Row, 
  Col, 
  Card, 
  Avatar, 
  Button, 
  Table, 
  Tag, 
  Timeline, 
  Statistic, 
  Progress, 
  Rate,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  InputNumber
} from 'antd';
import { 
  UserOutlined, 
  CrownOutlined, 
  DollarOutlined, 
  HeartOutlined, 
  CommentOutlined,
  PlusOutlined
} from '@ant-design/icons';
import GuestHeader from "../../components/Header/GuestHeader";
import AppFooter from "../../components/Footer/Footer";
import doctorImage from "../../assets/doctor.png";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

// Mock data
const childrenData = [
  {
    id: 1,
    name: "Nguyễn Văn An",
    age: 5,
    gender: "Nam",
    weight: 20,
    height: 110,
    bmi: 16.5,
    lastCheckup: "2024-03-15",
  }
];

const transactionHistory = [
  {
    id: 1,
    date: "2024-03-15",
    type: "Nạp tiền",
    amount: 1000000,
    status: "Thành công"
  },
  {
    id: 2,
    date: "2024-03-10",
    type: "Thanh toán gói Premium",
    amount: -500000,
    status: "Thành công"
  }
];

const recommendedDoctors = [
  {
    id: 1,
    name: "Bs. Nguyễn Văn A",
    specialty: "Nhi khoa",
    rating: 4.9,
    image: doctorImage
  },
  {
    id: 2,
    name: "Bs. Trần Thị B",
    specialty: "Dinh dưỡng",
    rating: 4.8,
    image: doctorImage
  },
  {
    id: 3,
    name: "Bs. Lê Văn C",
    specialty: "Nhi khoa",
    rating: 4.7,
    image: doctorImage
  }
];

const ParentProfilePage: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleAddChild = (values: any) => {
    console.log('New child values:', values);
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <Layout style={{ minHeight: '100vh', margin: '-25px', width: '1420px' }}>
      <GuestHeader />
      <Content style={{ 
        padding: '24px', 
        maxWidth: '1000px',
        margin: '0 auto',
        marginBottom: '50px'
      }}>
        <Row gutter={[24, 24]}>
          {/* Left Column - Main Content */}
          <Col span={16}>
            {/* Profile Header */}
            <Card>
              <Row gutter={16} align="middle">
                <Col>
                  <Avatar size={64} icon={<UserOutlined />} />
                </Col>
                <Col>
                  <Title level={3}>Nguyễn Văn Bình</Title>
                  <Tag color="gold"><CrownOutlined /> Premium Member</Tag>
                </Col>
              </Row>
            </Card>

            {/* Account Balance & Quick Actions */}
            <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Số dư tài khoản"
                    value={1500000}
                    prefix={<DollarOutlined />}
                    suffix="VNĐ"
                  />
                  <Button type="primary" style={{ marginTop: '16px' }}>
                    Nạp tiền
                  </Button>
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Bác sĩ đang theo dõi"
                    value={5}
                    prefix={<HeartOutlined />}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Lượt bình luận"
                    value={12}
                    prefix={<CommentOutlined />}
                  />
                </Card>
              </Col>
            </Row>

            {/* Children Information */}
            <Card 
              style={{ marginTop: '24px' }}
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Title level={4} style={{ margin: 0 }}>Thông tin trẻ</Title>
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={() => setIsModalVisible(true)}
                  >
                    Thêm trẻ
                  </Button>
                </div>
              }
            >
              {childrenData.map(child => (
                <Card key={child.id} type="inner" style={{ marginTop: '16px' }}>
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Title level={5}>{child.name}</Title>
                      <p>Tuổi: {child.age}</p>
                      <p>Giới tính: {child.gender}</p>
                      <p>Lần khám gần nhất: {child.lastCheckup}</p>
                    </Col>
                    <Col span={12}>
                      <Title level={5}>Chỉ số BMI</Title>
                      <Progress
                        percent={75}
                        status="active"
                        format={() => `${child.bmi} kg/m²`}
                      />
                      <p>Chiều cao: {child.height} cm</p>
                      <p>Cân nặng: {child.weight} kg</p>
                    </Col>
                  </Row>
                </Card>
              ))}
            </Card>

            {/* Add Child Modal */}
            <Modal
              title="Thêm thông tin trẻ"
              open={isModalVisible}
              onCancel={() => {
                setIsModalVisible(false);
                form.resetFields();
              }}
              footer={[
                <Button key="cancel" onClick={() => {
                  setIsModalVisible(false);
                  form.resetFields();
                }}>
                  Hủy
                </Button>,
                <Button key="submit" type="primary" onClick={() => form.submit()}>
                  Thêm
                </Button>
              ]}
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={handleAddChild}
              >
                <Form.Item
                  name="name"
                  label="Họ và tên"
                  rules={[{ required: true, message: 'Vui lòng nhập tên trẻ' }]}
                >
                  <Input placeholder="Nhập họ và tên trẻ" />
                </Form.Item>

                <Form.Item
                  name="birthDate"
                  label="Ngày sinh"
                  rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
                >
                  <DatePicker style={{ width: '100%' }} placeholder="Chọn ngày sinh" />
                </Form.Item>

                <Form.Item
                  name="gender"
                  label="Giới tính"
                  rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
                >
                  <Select placeholder="Chọn giới tính">
                    <Option value="male">Nam</Option>
                    <Option value="female">Nữ</Option>
                  </Select>
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="height"
                      label="Chiều cao (cm)"
                      rules={[{ required: true, message: 'Vui lòng nhập chiều cao' }]}
                    >
                      <InputNumber min={1} style={{ width: '100%' }} placeholder="Nhập chiều cao" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="weight"
                      label="Cân nặng (kg)"
                      rules={[{ required: true, message: 'Vui lòng nhập cân nặng' }]}
                    >
                      <InputNumber min={1} style={{ width: '100%' }} placeholder="Nhập cân nặng" />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Modal>

            {/* Transaction History */}
            <Card style={{ marginTop: '24px' }}>
              <Title level={4}>Lịch sử giao dịch</Title>
              <Table
                dataSource={transactionHistory}
                columns={[
                  { title: 'Ngày', dataIndex: 'date' },
                  { title: 'Loại giao dịch', dataIndex: 'type' },
                  { 
                    title: 'Số tiền', 
                    dataIndex: 'amount',
                    render: (amount) => (
                      <Text type={amount > 0 ? 'success' : 'danger'}>
                        {amount.toLocaleString()} VNĐ
                      </Text>
                    )
                  },
                  { 
                    title: 'Trạng thái', 
                    dataIndex: 'status',
                    render: (status) => (
                      <Tag color="green">{status}</Tag>
                    )
                  },
                ]}
                pagination={false}
              />
            </Card>

            {/* Comment History */}
            <Card style={{ marginTop: '24px' }}>
              <Title level={4}>Lịch sử bình luận</Title>
              <Timeline>
                <Timeline.Item>Bình luận về Bs. Nguyễn Văn A - 2 ngày trước</Timeline.Item>
                <Timeline.Item>Đánh giá dịch vụ khám - 1 tuần trước</Timeline.Item>
                <Timeline.Item>Hỏi đáp về dinh dưỡng - 2 tuần trước</Timeline.Item>
              </Timeline>
            </Card>
          </Col>

          {/* Right Column - Recommendations */}
          <Col span={8}>
            <Card 
              title="Bác sĩ gợi ý" 
              bodyStyle={{ padding: '0' }}
            >
              {recommendedDoctors.map(doctor => (
                <div key={doctor.id} style={{ 
                  padding: '16px',
                  borderBottom: '1px solid #f0f0f0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '16px'
                  }}>
                    <Avatar src={doctor.image} size={48} />
                    <div style={{ flex: 1 }}>
                      <Text strong style={{ 
                        display: 'block',
                        fontSize: '16px'
                      }}>
                        {doctor.name}
                      </Text>
                      <Text type="secondary" style={{ 
                        fontSize: '14px',
                        marginTop: '4px',
                        display: 'block'
                      }}>
                        {doctor.specialty}
                      </Text>
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '4px'
                  }}>
                    <Rate 
                      disabled 
                      defaultValue={doctor.rating} 
                      style={{ fontSize: '16px' }} 
                    />
                    <Button type="primary" size="middle">
                      Theo dõi
                    </Button>
                  </div>
                </div>
              ))}
            </Card>

            {/* Membership Info */}
            <Card title="Thông tin gói thành viên" style={{ marginTop: '24px' }}>
              <p><CrownOutlined /> Gói Premium</p>
              <p>Ngày hết hạn: 15/04/2024</p>
              <Button type="primary" block style={{ marginTop: '16px' }}>
                Gia hạn gói
              </Button>
            </Card>
          </Col>
        </Row>
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default ParentProfilePage;