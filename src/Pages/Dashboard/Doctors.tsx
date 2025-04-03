import { useEffect, useState } from "react";
import { 
  Table, 
  Avatar, 
  Tag, 
  Space, 
  Typography, 
  message, 
  Spin, 
  Input, 
  Button, 
  Modal, 
  Form, 
  Card,
  Row,
  Col,
  Divider
} from "antd";
import { 
  UserOutlined, 
  SearchOutlined, 
  EyeOutlined, 
  PlusOutlined,
  CheckCircleOutlined,
  FilterOutlined
} from "@ant-design/icons";
import axios from "axios";
import type { TableColumnsType } from "antd";

const { Text, Title } = Typography;

interface Doctor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  status: DoctorStatus;
}

interface NewDoctorForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

type DoctorStatus = 0 | 1 | 2 | 4; 

const DoctorsPage = () => {
  // ============ STATE ============
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isDoctorDetailModalVisible, setIsDoctorDetailModalVisible] = useState<boolean>(false);
  const [addDoctorForm] = Form.useForm();
  const [addDoctorLoading, setAddDoctorLoading] = useState<boolean>(false);

  // ID vai trò bác sĩ trong hệ thống
  const DOCTOR_ROLE_ID = "00000000-0000-0000-0000-000000000003";

  // ============ API CALLS ============
  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = {
        SearchKeyword: searchKeyword || undefined,
        // Removed pagination parameters to get all doctors
        // Set a large value for PageSize to get all doctors
        PageSize: 1000,
        Status: filterStatus,
        RoleIds: DOCTOR_ROLE_ID,
      };

      const response = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}/users/all`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });

      setDoctors(response.data?.data?.data || []);
    } catch (error) {
      message.error("Failed to fetch doctors");
    } finally {
      setLoading(false);
    }
  };

  // Add new doctor using the correct API endpoint
  const addDoctor = async (values: NewDoctorForm) => {
    setAddDoctorLoading(true);
    try {
      const token = localStorage.getItem("token");
      const doctorData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_ENDPOINT}/auth/register/doctor`, 
        doctorData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data?.success) {
        message.success("Doctor added successfully");
        setIsModalVisible(false);
        addDoctorForm.resetFields();
        fetchDoctors();
      } else {
        message.error("Failed to add doctor");
      }
    } catch (error: any) {
      message.error("Failed to add doctor: " + (error.response?.data?.message || error.message));
    } finally {
      setAddDoctorLoading(false);
    }
  };

  // ============ SIDE EFFECTS ============
  useEffect(() => {
    fetchDoctors();
  }, [filterStatus]); // Removed page dependency since we're not using pagination

  // ============ HANDLERS ============
  const showAddDoctorModal = () => {
    addDoctorForm.resetFields();
    setIsModalVisible(true);
  };

  const handleAddDoctor = () => {
    addDoctorForm.validateFields()
      .then(values => {
        addDoctor(values);
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const handleViewDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsDoctorDetailModalVisible(true);
  };


  // ============ HELPER FUNCTIONS ============
  const getStatusTag = (status: DoctorStatus) => {
    switch (status) {
      case 0: return <Tag color="#4ade80" style={{ borderRadius: '12px', padding: '2px 12px' }}>Active</Tag>;
      case 1: return <Tag color="#f87171" style={{ borderRadius: '12px', padding: '2px 12px' }}>Inactive</Tag>;
      case 2: return <Tag color="#9ca3af" style={{ borderRadius: '12px', padding: '2px 12px' }}>Archived</Tag>;
      case 4: return <Tag color="#facc15" style={{ borderRadius: '12px', padding: '2px 12px' }}>Not Verified</Tag>;
      default: return <Tag color="#9ca3af" style={{ borderRadius: '12px', padding: '2px 12px' }}>Unknown</Tag>;
    }
  };

  // ============ TABLE CONFIG ============
  const columns: TableColumnsType<Doctor> = [
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar?: string) => avatar 
        ? <Avatar src={avatar} size={40} /> 
        : <Avatar icon={<UserOutlined />} size={40} style={{ backgroundColor: '#3b82f6' }} />
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Doctor) => (
        <Text strong style={{ cursor: "pointer", color: '#60a5fa' }} onClick={() => handleViewDoctor(record)}>
          {text}
        </Text>
      )
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email"
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (phone: string) => phone || 'N/A'
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: DoctorStatus) => getStatusTag(status)
    },
    {
      title: "Actions",
      key: "actions",
      align: "right",
      render: (_: any, record: Doctor) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewDoctor(record)}
            type="primary"
            style={{ 
              backgroundColor: '#3b82f6', 
              borderRadius: '50px',
              border: 'none'
            }}
            shape="circle"
          />
        </Space>
      )
    }
  ];

  // ============ RENDER ============
  return (
    <div style={{ 
      background: '#fff', 
      minHeight: '100vh',
      padding: 0, 
      margin: 0, 
      width: '100%', 
      overflow: 'hidden' 
    }}>
      {/* Header Section */}
      <Row align="middle" style={{ marginBottom: 24 }}>
        <Col span={16}>
          <Title level={2} style={{ 
            marginBottom: 0, 
            color: '#3b82f6' 
          }}>Doctors Management</Title>
          <Text type="secondary">Manage all healthcare professionals in your system</Text>
        </Col>
        <Col span={8} style={{ textAlign: 'right' }}>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={showAddDoctorModal}
            style={{ 
              borderRadius: '50px', 
              paddingLeft: '24px', 
              paddingRight: '24px',
              height: '46px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              border: 'none',
              boxShadow: '0 8px 16px rgba(37, 99, 235, 0.3)',
            }}
          >
            Add Doctor
          </Button>
        </Col>
      </Row>

      {/* Card with Filter and Search */}
      <Card 
        style={{ 
          marginBottom: 24, 
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb'
        }}
      >
        <Row gutter={16} align="middle">
          <Col span={16}>
            <Space size="middle">
              <Button 
                type={filterStatus === 0 ? "primary" : "default"} 
                onClick={() => setFilterStatus(0)}
                icon={<CheckCircleOutlined />}
                style={{ 
                  borderRadius: '50px', 
                  backgroundColor: filterStatus === 0 ? '#3b82f6' : '#f3f4f6',
                  borderColor: filterStatus === 0 ? '#3b82f6' : '#d1d5db',
                }}
              >
                Active Doctors
              </Button>


            </Space>
          </Col>
          <Col span={8}>
            <Input.Group compact>
              <Input
                placeholder="Search doctors..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                style={{ 
                  width: 'calc(100% - 40px)',
                  borderTopLeftRadius: '50px',
                  borderBottomLeftRadius: '50px',
                  backgroundColor: '#ffffff',
                  borderColor: '#d1d5db'
                }}
                prefix={<SearchOutlined style={{ color: '#60a5fa' }} />}
                allowClear
              />
              <Button 
                type="primary" 
                onClick={fetchDoctors}
                icon={<FilterOutlined />}
                style={{ 
                  width: '40px',
                  borderTopRightRadius: '50px',
                  borderBottomRightRadius: '50px',
                  backgroundColor: '#3b82f6',
                  border: 'none'
                }}
              />
            </Input.Group>
          </Col>
        </Row>
      </Card>

      {/* Doctors Table */}
      <Card
        style={{ 
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb'
        }}
      >
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <Spin size="large" />
            <div style={{ marginTop: 16 }}>
              <Text type="secondary">Loading doctors data...</Text>
            </div>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={doctors}
            rowKey="id"
            pagination={false} // Removed pagination
          />
        )}
      </Card>

      {/* Add Doctor Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PlusOutlined style={{ color: '#60a5fa' }} />
            <span>Add New Doctor</span>
          </div>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button 
            key="back" 
            onClick={() => setIsModalVisible(false)}
            style={{ 
              borderRadius: '50px',
              backgroundColor: '#f3f4f6',
              borderColor: '#d1d5db',
            }}
          >
            Cancel
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            loading={addDoctorLoading} 
            onClick={handleAddDoctor}
            style={{ 
              borderRadius: '50px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              border: 'none'
            }}
          >
            Add Doctor
          </Button>,
        ]}
        width={520}
        style={{ top: 20 }}
        bodyStyle={{ padding: '24px' }}
      >
        <Form
          form={addDoctorForm}
          layout="vertical"
          name="addDoctorForm"
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter doctor\'s full name' }]}
          >
            <Input 
              placeholder="Enter doctor's full name" 
              style={{ 
                borderRadius: '50px',
                backgroundColor: '#ffffff',
                borderColor: '#d1d5db'
              }}
              prefix={<UserOutlined style={{ color: '#60a5fa' }} />}
            />
          </Form.Item>
          
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input 
              placeholder="Enter email address" 
              style={{ 
                borderRadius: '50px',
                backgroundColor: '#ffffff',
                borderColor: '#d1d5db'
              }}
              prefix={<span style={{ color: '#60a5fa' }}>@</span>}
            />
          </Form.Item>
          
          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[{ required: true, message: 'Please enter phone number' }]}
          >
            <Input 
              placeholder="Enter phone number" 
              style={{ 
                borderRadius: '50px',
                backgroundColor: '#ffffff',
                borderColor: '#d1d5db'
              }}
              prefix={<span style={{ color: '#60a5fa' }}>📞</span>}
            />
          </Form.Item>
          
          <Divider style={{ borderColor: '#e5e7eb' }} />
          
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please enter password' },
              { min: 6, message: 'Password must be at least 6 characters' }
            ]}
          >
            <Input.Password 
              placeholder="Enter password" 
              style={{ 
                borderRadius: '50px',
                backgroundColor: '#ffffff',
                borderColor: '#d1d5db'
              }}
            />
          </Form.Item>
          
          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password 
              placeholder="Confirm password" 
              style={{ 
                borderRadius: '50px',
                backgroundColor: '#ffffff',
                borderColor: '#d1d5db'
              }}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Doctor Detail Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {selectedDoctor?.avatar ? (
              <Avatar src={selectedDoctor.avatar} size={40} />
            ) : (
              <Avatar icon={<UserOutlined />} size={40} style={{ backgroundColor: '#3b82f6' }} />
            )}
            <span>Doctor Details</span>
          </div>
        }
        open={isDoctorDetailModalVisible}
        onCancel={() => setIsDoctorDetailModalVisible(false)}
        footer={[
          <Button 
            key="close" 
            type="primary"
            onClick={() => setIsDoctorDetailModalVisible(false)}
            style={{ 
              borderRadius: '50px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              border: 'none'
            }}
          >
            Close
          </Button>
        ]}
        width={450}
        style={{ top: 20 }}
        bodyStyle={{ padding: '24px' }}
      >
        {selectedDoctor && (
          <Card 
            bordered={false} 
            style={{ 
              boxShadow: 'none',
              background: 'rgba(59, 130, 246, 0.05)',
              borderRadius: '12px',
              padding: '8px'
            }}
          >
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
              {selectedDoctor?.avatar ? (
                <Avatar src={selectedDoctor.avatar} size={80} />
              ) : (
                <Avatar icon={<UserOutlined />} size={80} style={{ backgroundColor: '#3b82f6' }} />
              )}
              <Title level={3} style={{ 
                margin: '12px 0 0', 
                color: '#3b82f6' 
              }}>{selectedDoctor.name}</Title>
              {getStatusTag(selectedDoctor.status)}
            </div>
            
            <Divider style={{ 
              margin: '12px 0', 
              borderColor: '#e5e7eb' 
            }} />
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <Text type="secondary">Email</Text>
                <div>{selectedDoctor.email}</div>
              </div>
              
              <div>
                <Text type="secondary">Phone</Text>
                <div>{selectedDoctor.phone || 'N/A'}</div>
              </div>
              
              <div>
                <Text type="secondary">ID</Text>
                <div style={{ wordBreak: 'break-all' }}>{selectedDoctor.id}</div>
              </div>
            </div>
          </Card>
        )}
      </Modal>
    </div>
  );
};

export default DoctorsPage;