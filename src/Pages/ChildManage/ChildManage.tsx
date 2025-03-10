import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, message, Spin, Space, Layout } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Sidebar from '../../components/Sidebar/Sidebar';

const { Content } = Layout;

const ChildManage: React.FC = () => {
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
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
            Authorization: `Bearer ${token}`
          }
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

  const handleViewChild = (childId: string) => {
    navigate(`/child-details/${childId}`);
  };

  const handleEditChild = (child: any) => {
    navigate(`/edit-child/${child.id}`);
  };

  const handleDeleteChild = async (childId: string) => {
    try {
      const token = localStorage.getItem("token");
      
      Modal.confirm({
        title: "Are you sure you want to delete this child's record?",
        content: "This action cannot be undone.",
        okText: "Yes, Delete",
        okType: "danger",
        cancelText: "Cancel",
        onOk: async () => {
          setLoading(true);
          const response = await axios.delete(
            `${import.meta.env.VITE_API_ENDPOINT}/children/${childId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
  
          if (response.status === 200) {
            message.success("Child deleted successfully");
            fetchChildren();
          }
        }
      });
    } catch (error: any) {
      message.error(error.response?.data?.message || "Failed to delete child.");
      console.error("Error deleting child:", error);
    } finally {
      setLoading(false);
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
      render: (gender: number) => gender === 0 ? "Male" : gender === 1 ? "Female" : "Other",
    },
    {
      title: "Date of Birth",
      dataIndex: "doB",
      key: "doB",
      render: (text: string) => text ? moment(text).format("DD/MM/YYYY") : "N/A",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Button 
            icon={<EyeOutlined />} 
            onClick={() => handleViewChild(record.id)} 
            type="primary"
            ghost
          />
          <Button 
            icon={<EditOutlined />} 
            onClick={() => handleEditChild(record)} 
            type="default"
          />
          <Button 
            icon={<DeleteOutlined />} 
            onClick={() => handleDeleteChild(record.id)} 
            danger
          />
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh", margin: '-25px' }}>
      <Sidebar />
      <Content style={{ padding: "20px" }}>
        <h1>Manage Children</h1>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
            <Spin size="large" />
          </div>
        ) : (
          <Table 
            dataSource={children} 
            columns={columns} 
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        )}
      </Content>
    </Layout>
  );
};

export default ChildManage;
