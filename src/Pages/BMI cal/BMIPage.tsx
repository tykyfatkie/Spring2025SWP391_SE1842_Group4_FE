import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, message, Spin, Space, Layout, Form, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Sidebar from "../../components/Sidebar/Sidebar";

const { Content } = Layout;


const BMIPage: React.FC = () => {
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [bmiModalVisible, setBmiModalVisible] = useState<boolean>(false);
  const [selectedChild, setSelectedChild] = useState<any>(null);
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
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBmiModal = (child: any) => {
    setSelectedChild(child);
    setBmiModalVisible(true);
    form.resetFields();
  };

  const handleSaveBMI = async () => {
    try {
      const values = await form.validateFields();
      const token = localStorage.getItem("token");

      if (!token) {
        message.error("Authentication information missing. Please login again.");
        return;
      }

      // Tính số tháng tuổi từ ngày sinh
      const ageInMonths = moment().diff(moment(selectedChild.doB, "YYYY-MM-DD"), "months");

      const payload = {
        childId: selectedChild.id,
        height: Number(values.height),
        weight: Number(values.weight),
        ageInMonths: ageInMonths,
        gender: selectedChild.gender, // Lấy từ dữ liệu trẻ
        notes: values.notes?.trim() || "",
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_ENDPOINT}/bmi/save`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        message.success("BMI record saved successfully!");
        setBmiModalVisible(false);
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || "Failed to save BMI record.");
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
          <Button 
            icon={<PlusOutlined />} 
            onClick={() => handleOpenBmiModal(record)} 
            type="primary"
          >
            BMI
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh", margin: "-25px" }}>
      <Sidebar />
      <Content style={{ padding: "20px" }}>
        <h1>BMI Management</h1>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
            <Spin size="large" />
          </div>
        ) : (
          <Table dataSource={children} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
        )}

        <Modal
          title="Enter BMI Details"
          visible={bmiModalVisible}
          onCancel={() => setBmiModalVisible(false)}
          onOk={handleSaveBMI}
          okText="Save"
        >
          <Form form={form} layout="vertical">
            <Form.Item label="Child's Name">
              <Input value={selectedChild?.name} disabled />
            </Form.Item>

            <Form.Item label="Gender">
              <Input value={selectedChild?.gender === 0 ? "Male" : "Female"} disabled />
            </Form.Item>

            <Form.Item label="Age (Months)">
              <Input value={moment().diff(moment(selectedChild?.doB, "YYYY-MM-DD"), "months")} disabled />
            </Form.Item>

            <Form.Item name="height" label="Height (cm)" rules={[{ required: true, message: "Please enter height!" }]}>
              <Input type="number" placeholder="Enter height" />
            </Form.Item>

            <Form.Item name="weight" label="Weight (kg)" rules={[{ required: true, message: "Please enter weight!" }]}>
              <Input type="number" placeholder="Enter weight" />
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

export default BMIPage;