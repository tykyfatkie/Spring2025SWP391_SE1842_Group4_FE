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
      message.error(error.response?.data?.message || "You do not have any children yet.");
      console.error("Error fetching children:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditChild = (child: any) => {
    setEditingChild(child);
    setEditModalVisible(true);

    form.setFieldsValue({
      name: child.name,
      dob: moment(child.doB),
      gender: child.gender,
      weight: child.weight,
      height: child.height,
      notes: child.notes,
    });
  };

  const handleUpdateChild = async () => {
    try {
      const values = await form.validateFields();
      const token = localStorage.getItem("token");

      const formattedValues = {
        name: values.name,
        dob: values.dob ? moment(values.dob).format("YYYY-MM-DD") : undefined,
        gender: values.gender,
        weight: Number(values.weight),
        height: Number(values.height),
        notes: values.notes || "", // Nếu notes là undefined thì thay bằng chuỗi rỗng ""
      };
      

      const response = await axios.put(
        `${import.meta.env.VITE_API_ENDPOINT}/children/update/${editingChild.id}`,
        formattedValues,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        message.success("Child updated successfully!");
        fetchChildren(); 
        setEditModalVisible(false);
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || "Failed to update child.");
      console.error("Error updating child:", error);
    }
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
            `${import.meta.env.VITE_API_ENDPOINT}/children/delete/${childId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
  
          if (response.status === 200) {
            message.success("Child deleted successfully");
            fetchChildren();
          }
        },
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

        <Modal
          title="Edit Child Profile"
          visible={editModalVisible}
          onCancel={() => setEditModalVisible(false)}
          onOk={handleUpdateChild}
          okText="Update"
        >
          <Form form={form} layout="vertical">
            <Form.Item name="name" label="Child's Name" rules={[{ required: true }]}>
              <Input placeholder="Enter child's name" />
            </Form.Item>

            <Form.Item name="dob" label="Date of Birth" rules={[{ required: true }]}>
              <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
            </Form.Item>

            <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
              <Select placeholder="Select gender">
                <Option value={0}>Male</Option>
                <Option value={1}>Female</Option>
              </Select>
            </Form.Item>

            <Form.Item name="weight" label="Weight (kg)">
              <Input type="number" placeholder="Enter weight" />
            </Form.Item>

            <Form.Item name="height" label="Height (cm)">
              <Input type="number" placeholder="Enter height" />
            </Form.Item>

            <Form.Item name="notes" label="Notes">
              <Input.TextArea placeholder="Additional notes" />
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default ChildManage;
