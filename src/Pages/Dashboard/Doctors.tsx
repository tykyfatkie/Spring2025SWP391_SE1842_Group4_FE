import { useEffect, useState } from "react";
import { Table, Avatar, Tag, Space, Typography, message, Spin } from "antd";
import { UserOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

const { Text } = Typography;

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
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
            headers: {
              Authorization: `Bearer ${token}`, // Include token in headers
            },
          }
        );
        setDoctors(response.data.data); // Ensure response structure matches
      } catch (error: any) {
        message.error("Failed to fetch doctors");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const columns = [
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar: string) =>
        avatar ? <Avatar src={avatar} /> : <Avatar icon={<UserOutlined />} />,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email: string) => <Text>{email}</Text>,
    },
    {
      title: "Specialty",
      dataIndex: "specialty",
      key: "specialty",
      render: (specialty: string) => <Text>{specialty}</Text>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "active" ? "green" : "orange"}>
          {status === "active" ? "Verfied" : "Not Verfied"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <a style={{ color: "red" }}>
            <DeleteOutlined /> Disable
          </a>
        </Space>
      ),
    },
  ];

  return loading ? (
    <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
  ) : (
    <Table columns={columns} dataSource={doctors} rowKey="id" />
  );
};

export default DoctorsPage;
