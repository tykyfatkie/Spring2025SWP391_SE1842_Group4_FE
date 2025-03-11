import { useEffect, useState } from "react";
import { Table, Avatar, Tag, Space, Typography, message, Spin, Button, Modal, Form, Input, Row, Col } from "antd";
import { UserOutlined, DeleteOutlined, PlusOutlined, EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import axios from "axios";

const { Text } = Typography;

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      message.error("Authentication token is missing");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/doctors/all/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDoctors(response.data.data);
    } catch (error) {
      message.error("Failed to fetch doctors");
    } finally {
      setLoading(false);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  const handleSubmit = async (values) => {
    if (values.password !== values.confirmPassword) {
      message.error("Passwords do not match!");
      return;
    }
  
    setSubmitting(true);
    const token = localStorage.getItem("token");
  
    const apiData = {
      email: values.email,
      password: values.password,
      name: values.name,
      phone: values.phone,
      avatar: values.avatar || "",
    };
  
    try {
      const registerResponse = await axios.post(
        `${import.meta.env.VITE_API_ENDPOINT}/auth/register/doctor`,
        apiData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (registerResponse.status === 200 || registerResponse.status === 201) {
        message.success("Doctor account created successfully!");
  
        // 🔹 Đăng nhập ảo để lấy userId của Doctor mới tạo
        const tempLoginResponse = await axios.post(
          `${import.meta.env.VITE_API_ENDPOINT}/auth/login`,
          { email: values.email, password: values.password }
        );
  
        if (tempLoginResponse.status === 200) {
          const { userId } = tempLoginResponse.data.data;
          console.log("Temporary UserId:", userId);
  
          // 🔹 Lưu userId vào localStorage
          localStorage.setItem("userIdOfDoctor", userId);
  
          // 🔹 Gọi API tạo hồ sơ bác sĩ
          await createDoctorProfile(userId, values.specialty);
        }
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to create doctor account.");
    } finally {
      setSubmitting(false);
    }
  };
  

  const createDoctorProfile = async () => {
    const token = localStorage.getItem("token");
    const doctorId = localStorage.getItem("userIdOfDoctor"); // 🔹 Lấy từ localStorage
  
    if (!doctorId) {
      message.error("Doctor ID not found!");
      return;
    }
  
    const apiData = {
      id: doctorId,
      certificate: "Default Certificate",
      licenseNumber: "123456789",
      biography: "This is a default biography.",
      metadata: "{}",
      specialize: "General Medicine",
      profileImg: "",
      status: 0,
      userId: doctorId,
      ratingAvg: 0,
      degrees: "Medical Degree",
      research: "Medical Research",
      languages: "English",
    };
  
    try {
      await axios.post(
        `${import.meta.env.VITE_API_ENDPOINT}/doctors/create`,
        apiData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      message.success("Doctor profile created successfully!");
      fetchDoctors();
      form.resetFields();
      setIsModalVisible(false);
    } catch (error) {
      message.error("Failed to create doctor profile.");
    }
  };
  

  const columns = [
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar) =>
        avatar ? <Avatar src={avatar} /> : <Avatar icon={<UserOutlined />} />,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Specialty",
      dataIndex: "specialty",
      key: "specialty",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "active" ? "green" : "orange"}>
          {status === "active" ? "Verified" : "Not Verified"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "actions",
      render: (_, record) => (
        <Space>
          <a style={{ color: "red" }}>
            <DeleteOutlined /> Disable
          </a>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          Add Doctor
        </Button>
      </div>

      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
      ) : (
        <Table columns={columns} dataSource={doctors} rowKey="id" />
      )}

<Modal title="Add New Doctor" open={isModalVisible} onCancel={handleCancel} footer={null} width={600}>
  <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
    <Form.Item name="name" label="Full Name" rules={[{ required: true, message: "Please enter full name" }]}>
      <Input prefix={<UserOutlined />} placeholder="Full Name" />
    </Form.Item>

    <Form.Item name="email" label="Email" rules={[{ required: true, type: "email", message: "Please enter a valid email" }]}>
      <Input prefix={<UserOutlined />} placeholder="Email" />
    </Form.Item>

    <Form.Item name="phone" label="Phone Number" rules={[{ required: true, message: "Please enter phone number" }]}>
      <Input placeholder="Phone Number" />
    </Form.Item>

    <Form.Item name="avatar" label="Avatar URL" rules={[{ required: true, message: "Please enter avatar URL" }]}>
      <Input placeholder="Avatar URL" />
    </Form.Item>

    <Form.Item name="password" label="Password" rules={[{ required: true, message: "Please enter password" }]}>
      <Input.Password placeholder="Password" iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
    </Form.Item>

    <Form.Item name="confirmPassword" label="Confirm Password" dependencies={["password"]} rules={[
      { required: true, message: "Please confirm password" },
      ({ getFieldValue }) => ({
        validator(_, value) {
          if (!value || getFieldValue("password") === value) {
            return Promise.resolve();
          }
          return Promise.reject(new Error("Passwords do not match!"));
        },
      }),
    ]}>
      <Input.Password placeholder="Confirm Password" iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
    </Form.Item>

    <Button type="primary" htmlType="submit" loading={submitting} block>
      Create Doctor Account
    </Button>
  </Form>
</Modal>

    </div>
  );
};

export default DoctorsPage;
