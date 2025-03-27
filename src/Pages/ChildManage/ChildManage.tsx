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
  EyeInvisibleOutlined, 
  EyeOutlined,
  LineChartOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Sidebar from "../../components/Sidebar/Sidebar";
import CollapsibleHeader from "./CollapsibleHeader";
import ChildProfilesLayout from "./ChildProfilesLayout";
import EditChildModal from "./EditChildModal";

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
      message.error(error.response?.data?.message || "You do not have any child yet!");
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
      message.error(error.response?.data?.message || "You do not have any hidden child yet!");
    } finally {
      setArchivedLoading(false);
    }
  };

  // Hàm tính tuổi theo tháng
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
      dob: moment(child.doB),
      gender: child.gender,
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
          } finally {
            setLoading(false);
          }
        },
      });
    } catch (error: any) {
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
            message.error(error.response?.data?.message || "Failed to hide child record.");
          }
        },
      });
    } catch (error: any) {
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
          }
        },
      });
    } catch (error: any) {
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
          {/* BMI View Button for archived children too */}
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
        <Content style={{ padding: '24px', background: '#f8fafc' }}>
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
    </Layout>
  );
};

export default ChildManage;
