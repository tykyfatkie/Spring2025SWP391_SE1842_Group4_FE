import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, message, Spin, Space, Layout, Form, Input, DatePicker, Select } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Sidebar from "../../components/Sidebar/Sidebar";

const { Content } = Layout;
const { Option } = Select;

const ChildManage: React.FC = () => {
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [editingChild, setEditingChild] = useState<any>(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        message.error("Authentication information missing. Please login again.");
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/children/getChildByToken`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 && response.data?.data) {
        setChildren(response.data.data);
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || "Failed to fetch children data.");
      console.error("Error fetching children:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleHideChild = async (childId: string) => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = `${import.meta.env.VITE_API_ENDPOINT}/children/hideChildren/${childId}`;
      
      console.log("Calling API:", apiUrl);
      console.log("Child ID:", childId);
    
      const response = await axios.post(
        apiUrl, 
        true, // Gửi đúng format body
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    
      if (response.status === 200) {
        message.success("Child hidden successfully");
        fetchChildren();
      }
    } catch (error: any) {
      console.error("Error hiding child:", error);
      message.error(error.response?.data?.message || "Failed to hide child.");
    }
  };
  
  
  

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (gender: number) => (gender === 0 ? "Male" : "Female"),
    },
    {
      title: "Date of Birth",
      dataIndex: "doB",
      key: "doB",
      render: (text: string) => {
        return text && moment(text, "YYYY-MM-DD", true).isValid()
          ? moment(text).format("YYYY/MM/DD")
          : "Invalid Date";
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEditChild(record)} type="default" />
          <Button icon={<EyeOutlined />} onClick={() => handleHideChild(record.id)} />
          <Button icon={<DeleteOutlined />} onClick={() => handleDeleteChild(record.id)} danger />
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh", margin: "-25px" }}>
      <Sidebar />
      <Content style={{ padding: "20px" }}>
        <h1>Manage Children</h1>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
            <Spin size="large" />
          </div>
        ) : (
          <Table dataSource={children} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
        )}
      </Content>
    </Layout>
  );
};

export default ChildManage;
