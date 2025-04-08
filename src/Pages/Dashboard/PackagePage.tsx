import { useState, useEffect } from "react";
import { 
  Form, 
  Input, 
  InputNumber, 
  Button, 
  message, 
  Card, 
  Table, 
  Space, 
  Modal, 
  Popconfirm, 
  Select,
  Typography,
  Spin,
  Row,
  Col,
  Tag,
  Divider
} from "antd";
import { 
  EditOutlined, 
  DeleteOutlined, 
  PlusOutlined,
  FilterOutlined,
  SearchOutlined
} from '@ant-design/icons';
import axios from "axios";

const { Text, Title } = Typography;

interface Package {
  id: string;
  packageName: string;
  description: string;
  price: number;
  billingCycle: number;
  maxChildrentAllowed: number;
  status: number;
}

const PackagesPage = () => {
  // Initialize message API with useMessage hook
  const [messageApi, contextHolder] = message.useMessage();
  
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentPackage, setCurrentPackage] = useState<Package | null>(null);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<number>(-1); // -1 means all packages
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);

  const fetchPackages = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      // Adding search and filter parameters
      const params: any = {};
      if (searchKeyword) params.SearchKeyword = searchKeyword;
      if (filterStatus !== -1) params.Status = filterStatus;
      params.Page = page - 1;
      params.PageSize = pageSize;

      const response = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}/user-packages/all`, {
        headers: { Authorization: `Bearer ${token}` },
        params
      });

      if (response.data && response.data.data) {
        setPackages(response.data.data);
      } else {
        messageApi.error("Unexpected data format from server.");
      }
    } catch (error) {
      messageApi.error("Failed to fetch packages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, [page, filterStatus]);

  const showModal = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const showEditModal = (record: Package) => {
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
  };

  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      await axios.post(`${import.meta.env.VITE_API_ENDPOINT}/user-packages/create`, values, {
        headers: { Authorization: `Bearer ${token}` },
      });

      messageApi.success("Package created successfully!");
      form.resetFields();
      setIsModalVisible(false);
      fetchPackages();
    } catch (error: any) {
      messageApi.error("Failed to create package: " + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (values: any) => {
    if (!currentPackage) return;
  
    setSubmitting(true);
    const token = localStorage.getItem("token");
  
    try {
      await axios.put(
        `${import.meta.env.VITE_API_ENDPOINT}/user-packages/edit`, 
        {
          packageId: currentPackage.id,  
          packageName: values.packageName,
          description: values.description,
          price: values.price,
          billingCycle: values.billingCycle,
          maxChildrentAllowed: values.maxChildrentAllowed,
          status: values.status
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
  
      messageApi.success("Package updated successfully!");
      editForm.resetFields();
      setIsEditModalVisible(false);
      setCurrentPackage(null);
      fetchPackages();
    } catch (error: any) {
      messageApi.error("Failed to update package: " + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`${import.meta.env.VITE_API_ENDPOINT}/user-packages/delete`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { packageId: id }
      });

      messageApi.success("Package deleted successfully!");
      fetchPackages();
    } catch (error: any) {
      messageApi.error("Failed to delete package: " + (error.response?.data?.message || error.message));
    }
  };

  // Get status tag with styling consistent with DoctorsPage
  const getStatusTag = (status: number) => {
    switch (status) {
      case 1: return <Tag color="#4ade80" style={{ borderRadius: '12px', padding: '2px 12px' }}>Active</Tag>;
      case 0: return <Tag color="#f87171" style={{ borderRadius: '12px', padding: '2px 12px' }}>Inactive</Tag>;
      default: return <Tag color="#9ca3af" style={{ borderRadius: '12px', padding: '2px 12px' }}>Delete</Tag>;
    }
  };

  // Define table columns
  const columns = [
    {
      title: "Package Name",
      dataIndex: "packageName",
      key: "packageName",
      render: (text: string, record: Package) => (
        <Text strong style={{ cursor: "pointer", color: '#60a5fa' }} onClick={() => showEditModal(record)}>
          {text}
        </Text>
      )
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Price (VND)",
      dataIndex: "price",
      key: "price",
      render: (price: number) => price.toLocaleString() + " VND",
    },
    {
      title: "Billing Cycle",
      dataIndex: "billingCycle",
      key: "billingCycle",
      render: (billingCycle: number) => (
        billingCycle === 1 ? 
          <Tag color="#60a5fa" style={{ borderRadius: '12px', padding: '2px 12px' }}>Monthly</Tag> : 
          <Tag color="#6366f1" style={{ borderRadius: '12px', padding: '2px 12px' }}>Yearly</Tag>
      ),
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
      render: (status: number) => getStatusTag(status)
    },
    {
      title: "Actions",
      key: "actions",
      align: "right" as const,
      render: (_: any, record: Package) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
            type="primary"
            style={{ 
              backgroundColor: '#3b82f6', 
              borderRadius: '50px',
              border: 'none'
            }}
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
              icon={<DeleteOutlined />}
              danger
              shape="circle"
              style={{ borderRadius: '50px' }}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ 
      background: '#fff', 
      minHeight: '100vh',
      padding: 0, 
      margin: 0, 
      width: '100%', 
      overflow: 'hidden' 
    }}>
      {/* Add the contextHolder at the top of your component */}
      {contextHolder}
      
      {/* Header Section */}
      <Row align="middle" style={{ marginBottom: 24 }}>
        <Col span={16}>
          <Title level={2} style={{ 
            marginBottom: 0, 
            color: '#3b82f6' 
          }}>Packages Management</Title>
          <Text type="secondary">Manage subscription packages in your system</Text>
        </Col>
        <Col span={8} style={{ textAlign: 'right' }}>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={showModal}
            style={{ 
              borderRadius: '50px', 
              paddingLeft: '24px', 
              paddingRight: '24px',
              height: '46px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              border: 'none',
              boxShadow: '0 8px 16px rgba(37, 99, 235, 0.3)',
            }}
          >
            Add Package
          </Button>
        </Col>
      </Row>

      {/* Card with Filter and Search */}
      <Card 
        style={{ 
          marginBottom: 24, 
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb'
        }}
      >
        <Row gutter={16} align="middle">
          <Col span={16}>
            <Space size="middle">
              <Button 
                type={filterStatus === -1 ? "primary" : "default"} 
                onClick={() => setFilterStatus(-1)}
                icon={<FilterOutlined />}
                style={{ 
                  borderRadius: '50px', 
                  backgroundColor: filterStatus === -1 ? '#3b82f6' : '#f3f4f6',
                  borderColor: filterStatus === -1 ? '#3b82f6' : '#d1d5db',
                }}
              >
                All Packages
              </Button>
            </Space>
          </Col>
          <Col span={8}>
            <Input.Group compact>
              <Input
                placeholder="Search packages..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                style={{ 
                  width: 'calc(100% - 40px)',
                  borderTopLeftRadius: '50px',
                  borderBottomLeftRadius: '50px',
                  backgroundColor: '#ffffff',
                  borderColor: '#d1d5db'
                }}
                prefix={<SearchOutlined style={{ color: '#60a5fa' }} />}
                allowClear
              />
              <Button 
                type="primary" 
                onClick={fetchPackages}
                icon={<FilterOutlined />}
                style={{ 
                  width: '40px',
                  borderTopRightRadius: '50px',
                  borderBottomRightRadius: '50px',
                  backgroundColor: '#3b82f6',
                  border: 'none'
                }}
              />
            </Input.Group>
          </Col>
        </Row>
      </Card>

      {/* Packages Table */}
      <Card
        style={{ 
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb'
        }}
      >
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <Spin size="large" />
            <div style={{ marginTop: 16 }}>
              <Text type="secondary">Loading packages data...</Text>
            </div>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={packages}
            rowKey="id"
            pagination={{
              current: page,
              pageSize: pageSize,
              onChange: (newPage) => setPage(newPage),
              showSizeChanger: false,
              style: { marginTop: 16 }
            }}
          />
        )}
      </Card>

      {/* Add Package Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PlusOutlined style={{ color: '#60a5fa' }} />
            <span>Add New Package</span>
          </div>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button 
            key="back" 
            onClick={handleCancel}
            style={{ 
              borderRadius: '50px',
              backgroundColor: '#f3f4f6',
              borderColor: '#d1d5db',
            }}
          >
            Cancel
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            loading={submitting} 
            onClick={() => form.submit()}
            style={{ 
              borderRadius: '50px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              border: 'none'
            }}
          >
            Add Package
          </Button>,
        ]}
        width={520}
        style={{ top: 20 }}
        bodyStyle={{ padding: '24px' }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item 
            name="packageName" 
            label="Package Name" 
            rules={[{ required: true, message: "Please enter package name" }]}
          >
            <Input 
              placeholder="Enter package name" 
              style={{ 
                borderRadius: '50px',
                backgroundColor: '#ffffff',
                borderColor: '#d1d5db'
              }}
            />
          </Form.Item>

          <Form.Item 
            name="description" 
            label="Description" 
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input.TextArea 
              placeholder="Enter package description" 
              style={{ 
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                borderColor: '#d1d5db'
              }}
              rows={4}
            />
          </Form.Item>

          <Form.Item 
            name="price" 
            label="Price (VND)" 
            rules={[{ required: true, message: "Please enter price" }]}
          >
            <InputNumber 
              placeholder="Enter price in VND" 
              style={{ 
                width: "100%",
                borderRadius: '50px',
                backgroundColor: '#ffffff',
                borderColor: '#d1d5db'
              }} 
              min={0}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value: string | undefined) => value ? Number(value.replace(/\$\s?|(,*)/g, '')) : 0}
            />
          </Form.Item>

          <Form.Item 
            name="billingCycle" 
            label="Billing Cycle" 
            rules={[{ required: true, message: "Please select billing cycle" }]}
          >
            <Select 
              placeholder="Select billing cycle"
              style={{ 
                borderRadius: '50px',
                backgroundColor: '#ffffff',
                borderColor: '#d1d5db'
              }}
            >
              <Select.Option value={0}>Yearly</Select.Option>
              <Select.Option value={1}>Monthly</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item 
            name="maxChildrentAllowed" 
            label="Max Children Allowed" 
            rules={[{ required: true, message: "Please enter max children allowed" }]}
          >
            <InputNumber 
              placeholder="Enter maximum children allowed" 
              style={{ 
                width: "100%",
                borderRadius: '50px',
                backgroundColor: '#ffffff',
                borderColor: '#d1d5db'
              }} 
              min={0}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Package Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <EditOutlined style={{ color: '#60a5fa' }} />
            <span>Edit Package</span>
          </div>
        }
        open={isEditModalVisible}
        onCancel={handleEditCancel}
        footer={[
          <Button 
            key="back" 
            onClick={handleEditCancel}
            style={{ 
              borderRadius: '50px',
              backgroundColor: '#f3f4f6',
              borderColor: '#d1d5db',
            }}
          >
            Cancel
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            loading={submitting} 
            onClick={() => editForm.submit()}
            style={{ 
              borderRadius: '50px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              border: 'none'
            }}
          >
            Update Package
          </Button>,
        ]}
        width={520}
        style={{ top: 20 }}
        bodyStyle={{ padding: '24px' }}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleEditSubmit}
          autoComplete="off"
        >
          <Form.Item 
            name="packageName" 
            label="Package Name" 
            rules={[{ required: true, message: "Please enter package name" }]}
          >
            <Input 
              placeholder="Enter package name" 
              style={{ 
                borderRadius: '50px',
                backgroundColor: '#ffffff',
                borderColor: '#d1d5db'
              }}
            />
          </Form.Item>

          <Form.Item 
            name="description" 
            label="Description" 
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input.TextArea 
              placeholder="Enter package description" 
              style={{ 
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                borderColor: '#d1d5db'
              }}
              rows={4}
            />
          </Form.Item>

          <Form.Item 
            name="price" 
            label="Price (VND)" 
            rules={[{ required: true, message: "Please enter price" }]}
          >
            <InputNumber 
              placeholder="Enter price in VND" 
              style={{ 
                width: "100%",
                borderRadius: '50px',
                backgroundColor: '#ffffff',
                borderColor: '#d1d5db'
              }} 
              min={0}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value: string | undefined) => value ? Number(value.replace(/\$\s?|(,*)/g, '')) : 0}
            />
          </Form.Item>

          <Divider style={{ borderColor: '#e5e7eb' }} />

          <Form.Item 
            name="billingCycle" 
            label="Billing Cycle" 
            rules={[{ required: true, message: "Please select billing cycle" }]}
          >
            <Select 
              placeholder="Select billing cycle"
              style={{ 
                borderRadius: '50px',
                backgroundColor: '#ffffff',
                borderColor: '#d1d5db'
              }}
            >
              <Select.Option value={0}>Yearly</Select.Option>
              <Select.Option value={1}>Monthly</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item 
            name="maxChildrentAllowed" 
            label="Max Children Allowed" 
            rules={[{ required: true, message: "Please enter max children allowed" }]}
          >
            <InputNumber 
              placeholder="Enter maximum children allowed" 
              style={{ 
                width: "100%",
                borderRadius: '50px',
                backgroundColor: '#ffffff',
                borderColor: '#d1d5db'
              }} 
              min={0}
            />
          </Form.Item>

          <Form.Item 
            name="status" 
            label="Status" 
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Select 
              placeholder="Select status"
              style={{ 
                borderRadius: '50px',
                backgroundColor: '#ffffff',
                borderColor: '#d1d5db'
              }}
            >
              <Select.Option value={1}>Active</Select.Option>
              <Select.Option value={0}>Inactive</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PackagesPage;