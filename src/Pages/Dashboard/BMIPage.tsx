import { useEffect, useState } from "react";
import { 
  Table, 
  Typography, 
  message, 
  Spin, 
  Input, 
  Button, 
  Card,
  Row,
  Col,
  Tag,
  Select,
  Space,
  Modal,
  Form,
  InputNumber,
  Popconfirm
} from "antd";
import { 
  SearchOutlined, 
  FilterOutlined,
  ReloadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined
} from "@ant-design/icons";
import axios from "axios";
import type { TableColumnsType } from "antd";

const { Text, Title } = Typography;
const { Option } = Select;

interface BMIData {
  id: string;
  ageMonth: number;
  bmiPercentile?: number;
  bmi: number;
  gender: number; // 1 for female, 0 for male
}

const BMIDataPage = () => {
  // ============ STATE ============
  const [bmiData, setBmiData] = useState<BMIData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchMonth, setSearchMonth] = useState<string>("");
  const [filterGender, setFilterGender] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [filteredData, setFilteredData] = useState<BMIData[]>([]);
  
  // CRUD State
  const [isCreateModalVisible, setIsCreateModalVisible] = useState<boolean>(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [editingRecord, setEditingRecord] = useState<BMIData | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // ============ API CALLS ============
  const fetchBMIData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      // Fetch all data without filters from API
      const response = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}/WHOData/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data?.data || [];
      setBmiData(data);
      // Apply filters to the data
      filterData(data);
    } catch (error) {
      message.error("Failed to fetch BMI data");
      console.error("Error fetching BMI data:", error);
    } finally {
      setLoading(false);
    }
  };

  const createBMIData = async (values: BMIData) => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${import.meta.env.VITE_API_ENDPOINT}/WHOData/create`, values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      message.success("BMI data created successfully");
      setIsCreateModalVisible(false);
      form.resetFields();
      fetchBMIData(); // Refresh the list
    } catch (error) {
      message.error("Failed to create BMI data");
      console.error("Error creating BMI data:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const updateBMIData = async (values: BMIData) => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      // Include the id in the payload
      const payload = {
        ...values,
        id: editingRecord?.id 
      };
      
      await axios.put(`${import.meta.env.VITE_API_ENDPOINT}/WHOData/update`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      message.success("BMI data updated successfully");
      setIsEditModalVisible(false);
      form.resetFields();
      fetchBMIData(); // Refresh the list
    } catch (error) {
      message.error("Failed to update BMI data");
      console.error("Error updating BMI data:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteBMIData = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_API_ENDPOINT}/WHOData/delete`, {
        params: { id },
        headers: { Authorization: `Bearer ${token}` },
      });
      
      message.success("BMI data deleted successfully");
      fetchBMIData(); // Refresh the list
    } catch (error) {
      message.error("Failed to delete BMI data");
      console.error("Error deleting BMI data:", error);
    }
  };

  // ============ FILTER FUNCTION ============
  const filterData = (data = bmiData) => {
    let filtered = [...data];
    
    // Filter by month if search term exists
    if (searchMonth) {
      filtered = filtered.filter(item => 
        item.ageMonth.toString().includes(searchMonth)
      );
    }
    
    // Filter by gender if selected
    if (filterGender !== null) {
      filtered = filtered.filter(item => item.gender === filterGender);
    }
    
    setFilteredData(filtered);
    setTotalRecords(filtered.length);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // ============ SIDE EFFECTS ============
  useEffect(() => {
    fetchBMIData();
  }, []); // Only fetch on initial load

  // Apply filters when dependencies change
  useEffect(() => {
    filterData();
  }, [filterGender, searchMonth]); // Re-filter when these values change

  // ============ HANDLERS ============
  const handleSearch = () => {
    filterData();
  };

  const handleReset = () => {
    setSearchMonth("");
    setFilterGender(null);
    setCurrentPage(1);
    // Reset will show all data
    setFilteredData(bmiData);
    setTotalRecords(bmiData.length);
  };

  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size) setPageSize(size);
  };

  const showCreateModal = () => {
    form.resetFields();
    setIsCreateModalVisible(true);
  };

  const showEditModal = (record: BMIData) => {
    setEditingRecord(record);
    form.setFieldsValue({
      ageMonth: record.ageMonth,
      bmi: record.bmi,
      gender: record.gender
    });
    setIsEditModalVisible(true);
  };

  const handleCancel = () => {
    setIsCreateModalVisible(false);
    setIsEditModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        if (isEditModalVisible) {
          updateBMIData(values);
        } else {
          createBMIData(values);
        }
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  // ============ HELPER FUNCTIONS ============
  const getGenderTag = (gender: number) => {
    return gender === 0 ? 
      <Tag color="#3b82f6" style={{ borderRadius: '12px', padding: '2px 12px' }}>Male</Tag> :
      <Tag color="#ec4899" style={{ borderRadius: '12px', padding: '2px 12px' }}>Female</Tag>;
  };

  const getPercentileColor = (percentile: number) => {
    if (percentile < 5) return "#ef4444"; // Red for underweight
    if (percentile > 85) return "#f59e0b"; // Amber for overweight
    if (percentile > 95) return "#dc2626"; // Red for obese
    return "#22c55e"; // Green for normal
  };

  // ============ TABLE CONFIG ============
  const columns: TableColumnsType<BMIData> = [
    {
      title: "Age (Months)",
      dataIndex: "ageMonth",
      key: "ageMonth",
      sorter: (a, b) => a.ageMonth - b.ageMonth,
      render: (value: number) => (
        <Text strong>{value}</Text>
      )
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (gender: number) => getGenderTag(gender)
    },
    {
      title: "BMI",
      dataIndex: "bmi",
      key: "bmi",
      sorter: (a, b) => a.bmi - b.bmi,
      render: (value: number) => value.toFixed(1)
    },
    {
      title: "BMI Percentile",
      dataIndex: "bmiPercentile",
      key: "bmiPercentile",
      sorter: (a, b) => (a.bmiPercentile || 0) - (b.bmiPercentile || 0),
      render: (value: number) => (
        <Tag 
          color={getPercentileColor(value)} 
          style={{ 
            borderRadius: '12px', 
            padding: '2px 12px',
            minWidth: '60px',
            textAlign: 'center' 
          }}
        >
          {value}
        </Tag>
      )
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => {
        const percentile = record.bmiPercentile || 0;
        let status;
        let color;
        
        if (percentile < 5) {
          status = "Underweight";
          color = "#ef4444";
        } else if (percentile > 85 && percentile <= 95) {
          status = "Overweight";
          color = "#f59e0b";
        } else if (percentile > 95) {
          status = "Obese";
          color = "#dc2626";
        } else {
          status = "Normal";
          color = "#22c55e";
        }
        
        return (
          <Tag 
            color={color} 
            style={{ 
              borderRadius: '12px', 
              padding: '2px 12px' 
            }}
          >
            {status}
          </Tag>
        );
      }
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            onClick={() => showEditModal(record)}
            type="text"
            style={{ color: '#3b82f6' }}
          />
          <Popconfirm
            title="Are you sure you want to delete this record?"
            onConfirm={() => record.id && deleteBMIData(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              icon={<DeleteOutlined />} 
              type="text"
              danger
            />
          </Popconfirm>
        </Space>
      )
    }
  ];

  // ============ RENDER ============
  return (
    <div style={{ 
      background: '#fff', 
      minHeight: '100vh',
      padding: 0, 
      margin: 0, 
      width: '100%', 
      overflow: 'hidden' 
    }}>
      {/* Header Section */}
      <Row align="middle" style={{ marginBottom: 24 }}>
        <Col span={16}>
          <Title level={2} style={{ 
            marginBottom: 0, 
            color: '#3b82f6' 
          }}>BMI Data Analysis</Title>
          <Text type="secondary">World Health Organization BMI standards data</Text>
        </Col>
        <Col span={8} style={{ textAlign: 'right' }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showCreateModal}
            style={{
              borderRadius: '50px',
              backgroundColor: '#22c55e',
              border: 'none'
            }}
          >
            Create New
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
          <Col span={8}>
            <Space>
              <Select
                placeholder="Filter by Gender"
                value={filterGender !== null ? filterGender : undefined}
                onChange={(value) => setFilterGender(value)}
                allowClear
                style={{ 
                  width: '180px',
                  borderRadius: '50px'
                }}
              >
                <Option value={0}>Male</Option>
                <Option value={1}>Female</Option>
              </Select>
              
              <Button 
                icon={<ReloadOutlined />} 
                onClick={handleReset}
                style={{ 
                  borderRadius: '50px',
                  borderColor: '#d1d5db'
                }}
              >
                Reset
              </Button>
            </Space>
          </Col>
          <Col span={16}>
            <Input.Group compact>
              <Input
                placeholder="Search by month (e.g. 0, 12, 24)..."
                value={searchMonth}
                onChange={(e) => setSearchMonth(e.target.value)}
                onPressEnter={handleSearch}
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
                onClick={handleSearch}
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

      {/* BMI Data Table */}
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
              <Text type="secondary">Loading BMI data...</Text>
            </div>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey={(record) => record.id || `${record.ageMonth}-${record.gender}-${record.bmi}`}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: totalRecords,
              onChange: handlePageChange,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100'],
              showTotal: (total) => `Total ${total} records`,
              style: { marginTop: 16 }
            }}
            bordered={false}
            size="middle"
            scroll={{ x: 800 }}
          />
        )}
      </Card>

      {/* Informational Section */}
      <Card
        style={{ 
          marginTop: 24,
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb'
        }}
      >
        <Title level={4} style={{ color: '#3b82f6' }}>About BMI Percentiles</Title>
        <Row gutter={24}>
          <Col span={6}>
            <Card 
              type="inner" 
              title={<Text strong>Underweight</Text>} 
              style={{ 
                borderLeft: '4px solid #ef4444',
                borderRadius: '8px'
              }}
            >
              <Text>BMI percentile &lt; 5</Text>
            </Card>
          </Col>
          <Col span={6}>
            <Card 
              type="inner" 
              title={<Text strong>Normal Weight</Text>} 
              style={{ 
                borderLeft: '4px solid #22c55e',
                borderRadius: '8px'
              }}
            >
              <Text>BMI percentile 5-85</Text>
            </Card>
          </Col>
          <Col span={6}>
            <Card 
              type="inner" 
              title={<Text strong>Overweight</Text>} 
              style={{ 
                borderLeft: '4px solid #f59e0b',
                borderRadius: '8px'
              }}
            >
              <Text>BMI percentile 85-95</Text>
            </Card>
          </Col>
          <Col span={6}>
            <Card 
              type="inner" 
              title={<Text strong>Obese</Text>} 
              style={{ 
                borderLeft: '4px solid #dc2626',
                borderRadius: '8px'
              }}
            >
              <Text>BMI percentile &gt; 95</Text>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Create Modal */}
      <Modal
        title="Create New BMI Data"
        open={isCreateModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        confirmLoading={submitting}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="ageMonth"
            label="Age (Months)"
            rules={[{ required: true, message: 'Please input the age in months!' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="gender"
            label="Gender"
            rules={[{ required: true, message: 'Please select gender!' }]}
          >
            <Select placeholder="Select gender">
              <Option value={0}>Male</Option>
              <Option value={1}>Female</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="bmi"
            label="BMI"
            rules={[{ required: true, message: 'Please input BMI value!' }]}
          >
            <InputNumber min={0} precision={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="bmiPercentile"
            label="BMI Percentile"
            rules={[{ required: true, message: 'Please input BMI percentile!' }]}
          >
            <InputNumber min={0} max={100} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Edit BMI Data"
        open={isEditModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        confirmLoading={submitting}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="ageMonth"
            label="Age (Months)"
            rules={[{ required: true, message: 'Please input the age in months!' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="gender"
            label="Gender"
            rules={[{ required: true, message: 'Please select gender!' }]}
          >
            <Select placeholder="Select gender">
              <Option value={0}>Male</Option>
              <Option value={1}>Female</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="bmi"
            label="BMI"
            rules={[{ required: true, message: 'Please input BMI value!' }]}
          >
            <InputNumber min={0} precision={1} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BMIDataPage;