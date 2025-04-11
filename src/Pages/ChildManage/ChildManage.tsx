import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Button, 
  Modal, 
  message, 
  Space, 
  Layout, 
  Form, 
} from "antd";
import { 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  LineChartOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Sidebar from "../../components/Sidebar/Sidebar";
import CollapsibleHeader from "./CollapsibleHeader";
import ChildProfilesLayout from "./ChildProfilesLayout";
import EditChildModal from "./EditChildModal";
import DeleteChildModal from "./DeleteChildModal";

const { Content } = Layout;

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
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [deletingChild, setDeletingChild] = useState<any>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

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
      console.error("Failed to fetch children:", error.message);
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
      console.error("Failed to fetch children:", error.message);
    } finally {
      setArchivedLoading(false);
    }
  };

  const calculateAgeInMonths = (birthDate: string) => {
    if (!birthDate || !moment(birthDate, "YYYY-MM-DD", true).isValid()) {
      return "N/A";
    }
    
    const today = moment();
    const dob = moment(birthDate);
    const months = today.diff(dob, 'months');
    
    return months;
  };

  const handleEditChild = (child: any) => {
    setEditingChild(child);
    setEditModalVisible(true);

    form.setFieldsValue({
      name: child.name,
    });
  };

  const handleUpdateChild = async () => {
    try {
      const values = await form.validateFields();
      const token = localStorage.getItem("token");
  
      if (!token) {
        return;
      }
  
      const formattedValues = {
        name: values.name?.trim(),
        dob: editingChild.doB, // Giữ nguyên giá trị cũ
        gender: editingChild.gender, // Giữ nguyên giá trị cũ
        weight: editingChild.weight, 
        height: editingChild.height, 
        notes: editingChild.notes || "", 
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
      console.error("Failed to update child:", error.message);
    }
  };

  const performDeleteChild = async (childId: string, token: string) => {
    console.log("Starting delete operation for child ID:", childId);
    try {
      setLoading(true);
      message.loading({ content: "Deleting...", key: "deleteLoading" });
      
      const deleteUrl = `${import.meta.env.VITE_API_ENDPOINT}/children/delete/${childId}`;
      console.log("Delete URL:", deleteUrl);
      
      const response = await axios.delete(
        deleteUrl,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      console.log("Delete API response:", response);
      
      if (response.status === 200) {
        message.success({ content: "Deleted successfully!", key: "deleteLoading" });
        // Refresh the data after successful deletion
        if (activeTab === "active") {
          await fetchChildren();
        } else {
          await fetchArchivedChildren();
        }
      } else {
        message.error({ content: "Failed to delete. Please try again.", key: "deleteLoading" });
      }
    } catch (error: any) {
      console.error("Delete API error:", error);
      message.error({ 
        content: `Error: ${error.response?.data?.message || error.message || "Unknown error"}`, 
        key: "deleteLoading" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChild = (childId: string) => {
    const childToDelete = children.find(child => child.id === childId) || 
                          archivedChildren.find(child => child.id === childId);
    
    setDeletingChild(childToDelete);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!deletingChild) return;
    
    setDeleteLoading(true);
    const token = localStorage.getItem("token");
    
    if (!token) {
      message.error("You need to log in again!");
      navigate("/login");
      return;
    }
    
    try {
      await performDeleteChild(deletingChild.id, token);
      setDeleteModalVisible(false);
    } finally {
      setDeleteLoading(false);
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
        zIndex: 1050,
        mask: true,
        maskClosable: false,
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
            console.error("Failed to unhide child:", error.message);
          }
        },
      });
    } catch (error: any) {
      console.error("Failed to process unhide child:", error.message);
    }
  };
  
  const handleTabChange = (key: string) => {
    setActiveTab(key);
    if (key === "archived" && archivedChildren.length === 0) {
      fetchArchivedChildren();
    }
  };

  const navigateToCreateChild = () => {
    navigate("/child-create");
  };

  const navigateToBMITracking = (childId: string) => {
    navigate(`/child-analytics?childId=${childId}`);
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
      title: "Age (Months)",
      key: "ageMonths",
      render: (_: any, record: any) => {
        const months = calculateAgeInMonths(record.doB);
        return <span>{months} {months === 1 ? "month" : "months"}</span>;
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
            danger
            icon={<DeleteOutlined />} 
            onClick={() => handleDeleteChild(record.id)}
            style={{
              borderRadius: '8px',
              height: '38px',
              width: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          />
          {/* BMI View Button */}
          <Button 
            icon={<LineChartOutlined />} 
            onClick={() => navigateToBMITracking(record.id)} 
            type="primary"
            title="View BMI"
            style={{
              borderRadius: '8px',
              height: '38px',
              background: '#1e3a8a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
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
      title: "Age (Months)",
      key: "ageMonths",
      render: (_: any, record: any) => {
        const months = calculateAgeInMonths(record.doB);
        return <span>{months} {months === 1 ? "month" : "months"}</span>;
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
            onClick={() => {
              console.log("Delete button clicked for child ID:", record.id);
              handleDeleteChild(record.id);
            }} 
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
          <Button 
            icon={<LineChartOutlined />} 
            onClick={() => navigateToBMITracking(record.id)} 
            type="primary"
            title="View BMI"
            style={{
              borderRadius: '8px',
              height: '38px',
              background: '#1e3a8a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
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
        <Content style={{ padding: '24px', background: '#f8fafc', marginLeft: '260px' }}>
        <CollapsibleHeader
          title="Manage Child Profiles"
          subtitle="MANAGE PROFILES"
          description="View and manage all your children's profiles. Edit profile information, hide inactive profiles, or remove profiles you no longer need. You can also view BMI tracking for each child."
          features={[
            "Edit profile information",
            "Hide profiles temporarily",
            "Restore hidden profiles",
            "Track BMI and growth patterns"
          ]}
          defaultCollapsed={false}
        />

        <ChildProfilesLayout
          activeTab={activeTab}
          handleTabChange={handleTabChange}
          loading={loading}
          archivedLoading={archivedLoading}
          children={children}
          archivedChildren={archivedChildren}
          activeColumns={activeColumns}
          archivedColumns={archivedColumns}
          navigateToCreateChild={navigateToCreateChild}
        />

        <EditChildModal
          visible={editModalVisible}
          onCancel={() => setEditModalVisible(false)}
          onUpdate={handleUpdateChild}
          form={form}
          initialValues={editingChild}
        />
        </Content>
      </Layout>

      <DeleteChildModal
        visible={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        onDelete={confirmDelete}
        loading={deleteLoading}
        childName={deletingChild?.name}
      />
    </Layout>
  );
};

export default ChildManage;