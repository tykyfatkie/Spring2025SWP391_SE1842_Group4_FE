import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, message, Spin, Space, Layout, Form, Input, DatePicker, Select, Tabs } from "antd";
import { EditOutlined, DeleteOutlined, EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Sidebar from "../../components/Sidebar/Sidebar";

const { Content } = Layout;
const { Option } = Select;
const { TabPane } = Tabs;

const ChildManage: React.FC = () => {
  const [children, setChildren] = useState<any[]>([]);
  const [archivedChildren, setArchivedChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [archivedLoading, setArchivedLoading] = useState<boolean>(false);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [editingChild, setEditingChild] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("active");
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

  const fetchArchivedChildren = async () => {
    setArchivedLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        message.error("Authentication information missing. Please login again.");
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/children/archive-list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 && response.data?.data) {
        setArchivedChildren(response.data.data);
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || "Failed to fetch archived children data.");
      console.error("Error fetching archived children:", error);
    } finally {
      setArchivedLoading(false);
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

      if (!token) {
        message.error("Authentication information missing. Please login again.");
        return;
      }

      const formattedValues = {
        name: values.name?.trim(),
        dob: values.dob ? moment(values.dob).format("YYYY-MM-DD") : undefined,
        gender: values.gender,
        weight: values.weight ? Number(values.weight) : null,
        height: values.height ? Number(values.height) : null,
        notes: values.notes?.trim() || "",
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

      if (!token) {
        message.error("Authentication information missing. Please login again.");
        return;
      }

      Modal.confirm({
        title: "Are you sure you want to delete this child's record?",
        content: "This action cannot be undone.",
        okText: "Yes, Delete",
        okType: "danger",
        cancelText: "Cancel",
        onOk: async () => {
          setLoading(true);
          try {
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
              if (activeTab === "active") {
                fetchChildren();
              } else {
                fetchArchivedChildren();
              }
            }
          } catch (error: any) {
            message.error(error.response?.data?.message || "Failed to delete child.");
            console.error("Error deleting child:", error);
          } finally {
            setLoading(false);
          }
        },
      });
    } catch (error: any) {
      console.error("Error in delete child flow:", error);
    }
  };

  const handleHideChild = async (childId: string) => {
    try {
      const token = localStorage.getItem("token");
  
      if (!token) {
        message.error("Authentication information missing. Please login again.");
        return;
      }
  
      Modal.confirm({
        title: "Hide Child Record",
        content: "Are you sure you want to hide this child's record? You can unhide it later if needed.",
        okText: "Yes, Hide",
        cancelText: "Cancel",
        onOk: async () => {
          try {
            await axios.post(
              `${import.meta.env.VITE_API_ENDPOINT}/children/hideChildren/${childId}`,
              true,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );
  
            message.success("Child record hidden successfully");
  
            // Cập nhật UI ngay lập tức mà không cần gọi lại API
            setChildren((prevChildren) => prevChildren.filter(child => child.id !== childId));
            setArchivedChildren((prevArchived) => [
              ...prevArchived,
              children.find(child => child.id === childId),
            ]);
          } catch (error: any) {
            console.error("Error hiding child:", error);
            message.error(error.response?.data?.message || "Failed to hide child record.");
          }
        },
      });
    } catch (error: any) {
      console.error("Error in hide child flow:", error);
    }
  };
  
  

  const handleUnhideChild = async (childId: string) => {
    try {
      const token = localStorage.getItem("token");
  
      if (!token) {
        message.error("Authentication information missing. Please login again.");
        return;
      }
  
      Modal.confirm({
        title: "Unhide Child Record",
        content: "Are you sure you want to unhide this child's record?",
        okText: "Yes, Unhide",
        cancelText: "Cancel",
        onOk: async () => {
          try {
            await axios.post(
              `${import.meta.env.VITE_API_ENDPOINT}/children/hideChildren/${childId}`,
              false,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );
  
            message.success("Child record unhidden successfully");
  
            // Cập nhật UI ngay lập tức mà không cần gọi lại API
            setArchivedChildren((prevArchived) =>
              prevArchived.filter(child => child.id !== childId)
            );
            setChildren((prevChildren) => [
              ...prevChildren,
              archivedChildren.find(child => child.id === childId),
            ]);
          } catch (error: any) {
            console.error("Error unhiding child:", error);
            message.error(error.response?.data?.message || "Failed to unhide child record.");
          }
        },
      });
    } catch (error: any) {
      console.error("Error in unhide child flow:", error);
    }
  };
  

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    if (key === "archived" && archivedChildren.length === 0) {
      fetchArchivedChildren();
    }
  };

  const activeColumns = [
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
          <Button 
            icon={<EditOutlined />} 
            onClick={() => handleEditChild(record)} 
            type="default" 
          />
          <Button 
            icon={<EyeInvisibleOutlined />} 
            onClick={() => handleHideChild(record.id)} 
            type="default"
            title="Hide"
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

  const archivedColumns = [
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
          <Button 
            icon={<EyeOutlined />} 
            onClick={() => handleUnhideChild(record.id)} 
            type="default"
            title="Unhide"
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
    <Layout style={{ minHeight: "100vh", margin: "-25px" }}>
      <Sidebar />
      <Content style={{ padding: "20px" }}>
        <h1>Manage Children</h1>

        <Tabs activeKey={activeTab} onChange={handleTabChange}>
          <TabPane tab="Active Children" key="active">
            {loading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
                <Spin size="large" />
              </div>
            ) : (
              <Table dataSource={children} columns={activeColumns} rowKey="id" pagination={{ pageSize: 10 }} />
            )}
          </TabPane>
          <TabPane tab="Hidden Children" key="archived">
            {archivedLoading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
                <Spin size="large" />
              </div>
            ) : (
              <Table dataSource={archivedChildren} columns={archivedColumns} rowKey="id" pagination={{ pageSize: 10 }} />
            )}
          </TabPane>
        </Tabs>

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