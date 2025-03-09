import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, Form, Input, DatePicker, Select, message, Spin, Space, Layout } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Sidebar from '../../components/Sidebar/Sidebar'; // Nhập Sidebar

const { Option } = Select;
const { Content } = Layout;

const ChildManage: React.FC = () => {
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalType, setModalType] = useState<"edit">("edit");
  const [selectedChild, setSelectedChild] = useState<any>(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Fetch children data on component mount
  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    setLoading(true);
    try {
      const parentId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      
      if (!parentId || !token) {
        message.error("Authentication information missing. Please login again.");
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/children/getChildByParent/${parentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 200 && response.data) {
        setChildren(response.data.data || []);
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || "Failed to fetch children data.");
      console.error("Error fetching children:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditChild = (child: any) => {
    setModalType("edit");
    setSelectedChild(child);
    form.setFieldsValue({
      fullName: child.fullName,
      gender: child.gender,
      dateOfBirth: child.dateOfBirth ? moment(child.dateOfBirth) : null,
      bloodType: child.bloodType,
      allergies: child.allergies,
      medicalConditions: child.medicalConditions,
    });
    setModalVisible(true);
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

  const handleViewChild = (childId: string) => {
    navigate(`/child-details/${childId}`);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const token = localStorage.getItem("token");
      const parentId = localStorage.getItem("userId");
      
      if (!token || !parentId) {
        message.error("Authentication information missing. Please login again.");
        navigate("/login");
        return;
      }

      setLoading(true);
      
      // Format the data
      const childData = {
        ...values,
        parentId: parentId,
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format("YYYY-MM-DD") : null
      };

      if (modalType === "edit" && selectedChild) {
        // Update existing child
        const response = await axios.put(
          `${import.meta.env.VITE_API_ENDPOINT}/children/${selectedChild.id}`,
          childData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.status === 200) {
          message.success("Child updated successfully");
          setModalVisible(false);
          fetchChildren();
        }
      }
    } catch (error: any) {
      if (error.errorFields) {
        message.error("Please fill in all required fields correctly.");
      } else {
        message.error(error.response?.data?.message || "Operation failed. Please try again.");
        console.error("Error in child operation:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Date of Birth",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      render: (text: string) => text ? moment(text).format("DD/MM/YYYY") : "N/A",
    },
    {
      title: "Blood Type",
      dataIndex: "bloodType",
      key: "bloodType",
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

        <Modal
          title="Edit Child Information"
          open={modalVisible}
          onOk={handleModalOk}
          onCancel={() => setModalVisible(false)}
          confirmLoading={loading}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
          >
            <Form.Item
              name="fullName"
              label="Full Name"
              rules={[{ required: true, message: "Please enter child's full name" }]}
            >
              <Input placeholder="Enter child's full name" />
            </Form.Item>

            <Form.Item
              name="gender"
              label="Gender"
              rules={[{ required: true, message: "Please select gender" }]}
            >
              <Select placeholder="Select gender">
                <Option value="Male">Male</Option>
                <Option value="Female">Female</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="dateOfBirth"
              label="Date of Birth"
              rules={[{ required: true, message: "Please select date of birth" }]}
            >
              <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
            </Form.Item>

            <Form.Item
              name="bloodType"
              label="Blood Type"
            >
              <Select placeholder="Select blood type">
                <Option value="A+">A+</Option>
                <Option value="A-">A-</Option>
                <Option value="B+">B+</Option>
                <Option value="B-">B-</Option>
                <Option value="AB+">AB+</Option>
                <Option value="AB-">AB-</Option>
                <Option value="O+">O+</Option>
                <Option value="O-">O-</Option>
                <Option value="Unknown">Unknown</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="allergies"
              label="Allergies"
            >
              <Input.TextArea placeholder="List any allergies (if none, leave blank)" rows={2} />
            </Form.Item>

            <Form.Item
              name="medicalConditions"
              label="Medical Conditions"
            >
              <Input.TextArea placeholder="List any medical conditions (if none, leave blank)" rows={2} />
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default ChildManage;