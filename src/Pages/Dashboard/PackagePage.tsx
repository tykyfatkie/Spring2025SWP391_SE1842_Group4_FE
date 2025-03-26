import { useState, useEffect } from "react";
import { Form, Input, InputNumber, Button, message, Card, Table, Space, Modal, Popconfirm, Select } from "antd";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from "axios";

const PackagesPage = () => {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentPackage, setCurrentPackage] = useState(null);

  const fetchPackages = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}/user-packages/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.data) {
        setPackages(response.data.data);
      } else {
        console.error("Unexpected response format:", response.data);
        message.error("Unexpected data format from server.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      message.error("Failed to fetch packages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const showEditModal = (record : any) => {
    setCurrentPackage(record);
    editForm.setFieldsValue({
      packageName: record.packageName,
      description: record.description,
      price: record.price,
      billingCycle: record.billingCycle,
      maxChildrentAllowed: record.maxChildrentAllowed,
      status: record.status
    });
    setIsEditModalVisible(true);
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    setCurrentPackage(null);
    editForm.resetFields();
  };

  const handleSubmit = async (values : any) => {
    setSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      await axios.post(`${import.meta.env.VITE_API_ENDPOINT}/user-packages/create`, values, {
        headers: { Authorization: `Bearer ${token}` },
      });

      message.success("Package created successfully!");
      form.resetFields();
      setIsModalVisible(false);
      fetchPackages();
    } catch (error) {
      console.error("Submit error:", error);
      message.error("Failed to create package.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (values : any) => {
    if (!currentPackage) return;

    setSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      await axios.put(`${import.meta.env.VITE_API_ENDPOINT}/user-packages/edit`, values, {
        headers: { Authorization: `Bearer ${token}` },
        params: { packageId: currentPackage.id }
      });

      message.success("Package updated successfully!");
      editForm.resetFields();
      setIsEditModalVisible(false);
      setCurrentPackage(null);
      fetchPackages();
    } catch (error) {
      console.error("Edit error:", error);
      message.error("Failed to update package.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id : any) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`${import.meta.env.VITE_API_ENDPOINT}/user-packages/delete`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { packageId: id }
      });

      message.success("Package deleted successfully!");
      fetchPackages();
    } catch (error) {
      console.error("Delete error:", error);
      message.error("Failed to delete package.");
    }
  };

  // Define table columns
  const columns = [
    {
      title: "Package Name",
      dataIndex: "packageName",
      key: "packageName",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Price (Vietnam Dong)",
      dataIndex: "price",
      key: "price",
      render: (text : any) => `${text} VND`,
    },
    {
      title: "Billing Cycle",
      dataIndex: "billingCycle",
      key: "billingCycle",
      render: (billingCycle : any) => (billingCycle === 1 ? "Monthly" : "Yearly"), // Cập nhật phần hiển thị
    },
    {
      title: "Max Children",
      dataIndex: "maxChildrentAllowed",
      key: "maxChildrentAllowed",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status : any) => (
        <span style={{
          color: status === 1 ? 'green' : 'gray',
          fontWeight: 'bold'
        }}>
          {status === 1 ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record : any) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
            shape="circle"
          />
          <Popconfirm
            title="Delete package"
            description="Are you sure you want to delete this package?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              shape="circle"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Card
        title="Packages Management"
        extra={<Button type="primary" onClick={showModal}>Create New Package</Button>}
      >
        <Table
          dataSource={packages}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Create Package Modal */}
      <Modal
        title="Create New Package"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
          <Form.Item name="packageName" label="Package Name" rules={[{ required: true, message: "Please enter package name" }]}>
            <Input placeholder="Package Name" />
          </Form.Item>

          <Form.Item name="description" label="Description" rules={[{ required: true, message: "Please enter description" }]}>
            <Input.TextArea placeholder="Description" />
          </Form.Item>

          <Form.Item name="price" label="Price (VND)" rules={[{ required: true, message: "Please enter price" }]}>
            <InputNumber placeholder="Price" style={{ width: "100%" }} min={0} />
          </Form.Item>

          <Form.Item name="billingCycle" label="Billing Cycle" rules={[{ required: true, message: "Please select billing cycle" }]}>
            <Select placeholder="Select billing cycle">
              <Select.Option value={0}>Yearly</Select.Option>
              <Select.Option value={1}>Monthly</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="maxChildrentAllowed" label="Max Children Allowed" rules={[{ required: true, message: "Please enter max children allowed" }]}>
            <InputNumber placeholder="Max Children Allowed" style={{ width: "100%" }} min={0} />
          </Form.Item>

          <div style={{ textAlign: "right" }}>
            <Button style={{ marginRight: 8 }} onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={submitting}>
              Create Package
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Edit Package Modal */}
      <Modal
        title="Edit Package"
        open={isEditModalVisible}
        onCancel={handleEditCancel}
        footer={null}
        width={600}
      >
        <Form form={editForm} layout="vertical" onFinish={handleEditSubmit} autoComplete="off">
          <Form.Item name="packageName" label="Package Name" rules={[{ required: true, message: "Please enter package name" }]}>
            <Input placeholder="Package Name" />
          </Form.Item>

          <Form.Item name="description" label="Description" rules={[{ required: true, message: "Please enter description" }]}>
            <Input.TextArea placeholder="Description" />
          </Form.Item>

          <Form.Item name="price" label="Price (VND)" rules={[{ required: true, message: "Please enter price" }]}>
            <InputNumber placeholder="Price" style={{ width: "100%" }} min={0} />
          </Form.Item>

          <Form.Item name="billingCycle" label="Billing Cycle" rules={[{ required: true, message: "Please select billing cycle" }]}>
            <Select placeholder="Select billing cycle">
              <Select.Option value={0}>Yearly</Select.Option>
              <Select.Option value={1}>Monthly</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="maxChildrentAllowed" label="Max Children Allowed" rules={[{ required: true, message: "Please enter max children allowed" }]}>
            <InputNumber placeholder="Max Children Allowed" style={{ width: "100%" }} min={0} />
          </Form.Item>

          <Form.Item name="status" label="Status" rules={[{ required: true, message: "Please select status" }]}>
            <Select placeholder="Select status">
              <Select.Option value={1}>Active</Select.Option>
              <Select.Option value={0}>Inactive</Select.Option>
            </Select>
          </Form.Item>

          <div style={{ textAlign: "right" }}>
            <Button style={{ marginRight: 8 }} onClick={handleEditCancel}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={submitting}>
              Update Package
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default PackagesPage;