import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Table, 
  Button, 
  Modal, 
  message, 
  Spin, 
  Space, 
  Layout, 
  Form, 
  Input, 
  DatePicker, 
  Select, 
  Tabs,
  Card,
  Typography,
  Row,
  Col
} from "antd";
import { 
  EditOutlined, 
  DeleteOutlined, 
  EyeInvisibleOutlined, 
  EyeOutlined,
  UserOutlined,
  CheckCircleOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Sidebar from "../../components/Sidebar/Sidebar";

const { Content } = Layout;
const { Option } = Select;
const { TabPane } = Tabs;
const { Title, Paragraph, Text } = Typography;

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
      // Removed weight, height, and notes from form initialization
    });
  };

  const handleUpdateChild = async () => {
    try {
      const values = await form.validateFields();
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      // Preserve the existing weight, height, and notes values when updating
      const formattedValues = {
        name: values.name?.trim(),
        dob: values.dob ? moment(values.dob).format("YYYY-MM-DD") : undefined,
        gender: values.gender,
        weight: editingChild.weight, // Preserve existing weight
        height: editingChild.height, // Preserve existing height
        notes: editingChild.notes || "", // Preserve existing notes
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
  
            setArchivedChildren((prevArchived) =>
              prevArchived.filter(child => child.id !== childId)
            );
            setChildren((prevChildren) => [
              ...prevChildren,
              archivedChildren.find(child => child.id === childId),
            ]);
          } catch (error: any) {
            console.error("Error unhiding child:", error);
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
            style={{
              borderRadius: '8px',
              height: '38px',
              width: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #e5e7eb'
            }}
          />
          <Button 
            icon={<EyeInvisibleOutlined />} 
            onClick={() => handleHideChild(record.id)} 
            type="default"
            title="Hide"
            style={{
              borderRadius: '8px',
              height: '38px',
              width: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #e5e7eb'
            }}
          />
          <Button 
            icon={<DeleteOutlined />} 
            onClick={() => handleDeleteChild(record.id)} 
            danger 
            style={{
              borderRadius: '8px',
              height: '38px',
              width: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
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
            style={{
              borderRadius: '8px',
              height: '38px',
              width: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #e5e7eb'
            }}
          />
          <Button 
            icon={<DeleteOutlined />} 
            onClick={() => handleDeleteChild(record.id)} 
            danger 
            style={{
              borderRadius: '8px',
              height: '38px',
              width: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          />
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh", margin: "-25px", background: 'white', marginRight: '25px' }}>
      <Layout>
        <Sidebar />
        <Content style={{ padding: '24px', background: '#f8fafc' }}>
          {/* Header Section */}
          <div style={{ 
            marginBottom: '40px', 
            background: '#1e3a8a', 
            padding: '48px 32px', 
            borderRadius: '20px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
          }}>
            {/* Decorative elements */}
            <div style={{
              position: 'absolute',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.05)',
              top: '-100px',
              left: '-100px',
            }} />
            <div style={{
              position: 'absolute',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.08)',
              bottom: '-50px',
              right: '50px',
            }} />
            
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ 
                display: 'inline-block', 
                padding: '8px 16px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                marginBottom: '16px'
              }}>
                <span style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>MANAGE PROFILES</span>
              </div>
              
              <Title level={2} style={{ color: 'white', marginBottom: '16px', fontWeight: 700 }}>
                Manage Child Profiles
              </Title>
              <Paragraph style={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.9)', maxWidth: '700px' }}>
                View and manage all your children's profiles. Edit profile information, hide inactive profiles, 
                or remove profiles you no longer need.
              </Paragraph>
              
              <Space direction="vertical" size="middle" style={{ width: '100%', marginTop: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircleOutlined style={{ color: '#3b82f6', marginRight: '12px' }} />
                  <Text style={{ color: 'white' }}>Edit profile information</Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircleOutlined style={{ color: '#3b82f6', marginRight: '12px' }} />
                  <Text style={{ color: 'white' }}>Hide profiles temporarily</Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircleOutlined style={{ color: '#3b82f6', marginRight: '12px' }} />
                  <Text style={{ color: 'white' }}>Restore hidden profiles</Text>
                </div>
              </Space>
            </div>
          </div>

          <Row gutter={[24, 24]}>
            <Col xs={24} lg={18}>
              <Card 
                title={
                  <div style={{ padding: '8px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '50%', 
                        background: 'rgba(30, 58, 138, 0.1)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        marginRight: '16px' 
                      }}>
                        <UserOutlined style={{ fontSize: '20px', color: '#1e3a8a' }} />
                      </div>
                      <Title level={4} style={{ margin: 0, color: '#1e3a8a' }}>Child Profiles</Title>
                    </div>
                  </div>
                } 
                style={{ 
                  borderRadius: '16px', 
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
                  border: 'none'
                }}
                headStyle={{ 
                  borderBottom: '1px solid #f0f0f0',
                  padding: '16px 24px'
                }}
                bodyStyle={{ padding: '24px' }}
              >
                <Tabs 
                  activeKey={activeTab} 
                  onChange={handleTabChange}
                  type="card"
                  style={{ 
                    marginBottom: '24px',
                  }}
                  tabBarStyle={{
                    marginBottom: '16px'
                  }}
                >
                  <TabPane 
                    tab={
                      <span style={{ padding: '4px 8px', fontWeight: 500 }}>Active Children</span>
                    } 
                    key="active"
                  >
                    {loading ? (
                      <div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
                        <Spin size="large" />
                      </div>
                    ) : (
                      <Table 
                        dataSource={children} 
                        columns={activeColumns} 
                        rowKey="id" 
                        pagination={{ pageSize: 10 }}
                        style={{
                          borderRadius: '12px',
                          overflow: 'hidden'
                        }} 
                      />
                    )}
                  </TabPane>
                  <TabPane 
                    tab={
                      <span style={{ padding: '4px 8px', fontWeight: 500 }}>Hidden Children</span>
                    } 
                    key="archived"
                  >
                    {archivedLoading ? (
                      <div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
                        <Spin size="large" />
                      </div>
                    ) : (
                      <Table 
                        dataSource={archivedChildren} 
                        columns={archivedColumns} 
                        rowKey="id" 
                        pagination={{ pageSize: 10 }}
                        style={{
                          borderRadius: '12px',
                          overflow: 'hidden'
                        }} 
                      />
                    )}
                  </TabPane>
                </Tabs>
              </Card>
            </Col>
            
            <Col xs={24} lg={6}>
              <Card 
                style={{ 
                  borderRadius: '16px', 
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
                  border: 'none',
                  background: 'linear-gradient(to bottom, #f0f7ff, #e6f0fd)'
                }}
                bodyStyle={{ padding: '24px' }}
              >
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <div style={{ 
                    width: '60px', 
                    height: '60px', 
                    borderRadius: '50%', 
                    background: 'rgba(30, 58, 138, 0.1)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    margin: '0 auto 16px' 
                  }}>
                    <CheckCircleOutlined style={{ fontSize: '30px', color: '#1e3a8a' }} />
                  </div>
                  <Title level={4} style={{ color: '#1e3a8a', marginBottom: '8px' }}>Profile Management</Title>
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ 
                    padding: '16px',
                    background: 'white',
                    borderRadius: '12px',
                    marginBottom: '16px'
                  }}>
                    <Text strong style={{ display: 'block', marginBottom: '8px', color: '#1e3a8a' }}>Keep Profiles Updated</Text>
                    <Text style={{ color: '#4b5563', fontSize: '14px' }}>
                      Regularly update your child's measurements to get the most accurate growth analysis.
                    </Text>
                  </div>
                  
                  <div style={{ 
                    padding: '16px',
                    background: 'white',
                    borderRadius: '12px',
                    marginBottom: '16px'
                  }}>
                    <Text strong style={{ display: 'block', marginBottom: '8px', color: '#1e3a8a' }}>Hide Inactive Profiles</Text>
                    <Text style={{ color: '#4b5563', fontSize: '14px' }}>
                      Hide profiles that you don't need right now but might want to access later.
                    </Text>
                  </div>
                  
                  <div style={{ 
                    padding: '16px',
                    background: 'white',
                    borderRadius: '12px'
                  }}>
                    <Text strong style={{ display: 'block', marginBottom: '8px', color: '#1e3a8a' }}>Multiple Profile Support</Text>
                    <Text style={{ color: '#4b5563', fontSize: '14px' }}>
                      Manage profiles for all your children in one convenient location.
                    </Text>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>

          <Modal
            title={
              <div style={{ padding: '8px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    background: 'rgba(30, 58, 138, 0.1)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    marginRight: '12px' 
                  }}>
                    <EditOutlined style={{ fontSize: '16px', color: '#1e3a8a' }} />
                  </div>
                  <span style={{ fontSize: '18px', fontWeight: 600, color: '#1e3a8a' }}>Edit Child Profile</span>
                </div>
              </div>
            }
            visible={editModalVisible}
            onCancel={() => setEditModalVisible(false)}
            onOk={handleUpdateChild}
            okText="Update"
            okButtonProps={{
              style: {
                background: '#1e3a8a',
                borderColor: '#1e3a8a',
                borderRadius: '8px',
                height: '40px',
                padding: '0 24px'
              }
            }}
            cancelButtonProps={{
              style: {
                borderRadius: '8px',
                height: '40px',
                padding: '0 24px'
              }
            }}
            width={600}
            bodyStyle={{ padding: '16px 24px' }}
          >
            <Form form={form} layout="vertical">
              <Form.Item
                name="name"
                label={<Text strong style={{ fontSize: '15px' }}>Child's Name</Text>}
                rules={[{ required: true, message: "Please enter child's name" }]}
              >
                <Input 
                  placeholder="Enter child's name" 
                  style={{ 
                    borderRadius: '8px', 
                    height: '42px',
                    borderColor: '#e5e7eb'
                  }} 
                />
              </Form.Item>

              <Form.Item 
                name="dob" 
                label={<Text strong style={{ fontSize: '15px' }}>Date of Birth</Text>} 
                rules={[{ required: true, message: "Please select date of birth" }]}
              >
                <DatePicker 
                  style={{ 
                    width: "100%", 
                    borderRadius: '8px', 
                    height: '42px',
                    borderColor: '#e5e7eb'
                  }} 
                  format="YYYY-MM-DD" 
                />
              </Form.Item>

              <Form.Item 
                name="gender" 
                label={<Text strong style={{ fontSize: '15px' }}>Gender</Text>} 
                rules={[{ required: true, message: "Please select gender" }]}
              >
                <Select 
                  placeholder="Select gender"
                  style={{ 
                    borderRadius: '8px'
                  }}
                >
                  <Option value={0}>Male</Option>
                  <Option value={1}>Female</Option>
                </Select>
              </Form.Item>

              {/* Removed the Weight, Height and Notes form items */}
            </Form>
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ChildManage;