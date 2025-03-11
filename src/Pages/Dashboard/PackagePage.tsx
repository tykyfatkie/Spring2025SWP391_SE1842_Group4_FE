import { useState, useEffect } from "react";
import { Form, Input, InputNumber, Button, message, Card, Table, Space, Modal, Popconfirm } from "antd";
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

  // Fetch all packages
  const fetchPackages = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}/user-packages/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Access the data property from the response
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

  // Load packages on component mount
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

  const showEditModal = (record) => {
    setCurrentPackage(record);
    editForm.setFieldsValue({
      packageName: record.packageName,
      description: record.description,
      price: record.price,
      durationMonths: record.durationMonths,
      trialPeriodDays: record.trialPeriodDays,
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

  const handleSubmit = async (values) => {
    setSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      await axios.post(`${import.meta.env.VITE_API_ENDPOINT}/user-packages/create`, values, {
        headers: { Authorization: `Bearer ${token}` },
      });

      message.success("Package created successfully!");
      form.resetFields();
      setIsModalVisible(false);
      fetchPackages(); // Refresh the package list
    } catch (error) {
      console.error("Submit error:", error);
      message.error("Failed to create package.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (values) => {
    if (!currentPackage) return;
    
    setSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      await axios.put(`${import.meta.env.VITE_API_ENDPOINT}/user-packages/edit?packageId=${currentPackage.id}`, values, {
        headers: { Authorization: `Bearer ${token}` },
      });

      message.success("Package updated successfully!");
      editForm.resetFields();
      setIsEditModalVisible(false);
      setCurrentPackage(null);
      fetchPackages(); // Refresh the package list
    } catch (error) {
      console.error("Edit error:", error);
      message.error("Failed to update package.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`${import.meta.env.VITE_API_ENDPOINT}/user-packages/delete?packageId=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      message.success("Package deleted successfully!");
      fetchPackages(); // Refresh the package list
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
      title: "Price ($)",
      dataIndex: "price",
      key: "price",
      render: (text) => `$${text}`,
    },
    {
      title: "Duration (Months)",
      dataIndex: "durationMonths",
      key: "durationMonths",
    },
    {
      title: "Trial Period (Days)",
      dataIndex: "trialPeriodDays",
      key: "trialPeriodDays",
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
      render: (status) => (
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
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => showEditModal(record)}>Edit</Button>
          <Popconfirm
            title="Delete package"
            description="Are you sure you want to delete this package?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>Delete</Button>
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

          <Form.Item name="price" label="Price ($)" rules={[{ required: true, message: "Please enter price" }]}>
            <InputNumber placeholder="Price" style={{ width: "100%" }} min={0} />
          </Form.Item>

          <Form.Item name="durationMonths" label="Duration (Months)" rules={[{ required: true, message: "Please enter duration" }]}>
            <InputNumber placeholder="Duration (Months)" style={{ width: "100%" }} min={1} />
          </Form.Item>

          <Form.Item name="trialPeriodDays" label="Trial Period (Days)" rules={[{ required: true, message: "Please enter trial period" }]}>
            <InputNumber placeholder="Trial Period (Days)" style={{ width: "100%" }} min={0} />
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

          <Form.Item name="price" label="Price ($)" rules={[{ required: true, message: "Please enter price" }]}>
            <InputNumber placeholder="Price" style={{ width: "100%" }} min={0} />
          </Form.Item>

          <Form.Item name="durationMonths" label="Duration (Months)" rules={[{ required: true, message: "Please enter duration" }]}>
            <InputNumber placeholder="Duration (Months)" style={{ width: "100%" }} min={1} />
          </Form.Item>

          <Form.Item name="trialPeriodDays" label="Trial Period (Days)" rules={[{ required: true, message: "Please enter trial period" }]}>
            <InputNumber placeholder="Trial Period (Days)" style={{ width: "100%" }} min={0} />
          </Form.Item>

          <Form.Item name="maxChildrentAllowed" label="Max Children Allowed" rules={[{ required: true, message: "Please enter max children allowed" }]}>
            <InputNumber placeholder="Max Children Allowed" style={{ width: "100%" }} min={0} />
          </Form.Item>

          <Form.Item name="status" label="Status">
            <InputNumber 
              placeholder="Status" 
              style={{ width: "100%" }} 
              min={0} 
              max={1}
              formatter={value => (value === 1 ? 'Active' : 'Inactive')}
              parser={value => (value === 'Active' ? 1 : 0)}
            />
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