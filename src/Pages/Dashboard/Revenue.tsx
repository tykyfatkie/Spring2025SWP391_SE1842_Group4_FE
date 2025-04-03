import { useEffect, useState } from "react";
import { 
  Table, 
  Button, 
  Input, 
  Spin, 
  Modal, 
  Space, 
  Card, 
  Statistic,
  Typography,
  Row,
  Col,
  Divider
} from "antd";
import { 
  SearchOutlined, 
  EyeOutlined,
  FilterOutlined
} from "@ant-design/icons";
import axios from "axios";
import type { TableProps } from "antd";

const { Text, Title } = Typography;

interface Owner {
  id: string;
  name: string;
}

interface Package {
  id: string;
  packageName: string;
}

interface RevenueItem {
  packageId: string;
  ownerId: string;
  packages: Package; // Nested object for package details
  owner: Owner;     // Nested object for owner details
  totalPackages: number;
  activePackages: number;
  expiredPackages: number;
  totalRevenuePerPackage: number;
}

interface RevenueData {
  packagesSummary: RevenueItem[];
  totalRevenueAllPackages: number;
}

const RevenuePage = () => {
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [selectedRevenue, setSelectedRevenue] = useState<RevenueItem | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const fetchRevenues = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}/user-packages/admin/packages-summary`, {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "application/json",
        },
      });
      
      if (response.data && response.data.data) {
        setRevenueData(response.data.data);
      } else {
        console.error("Unexpected API response structure:", response.data);
        setRevenueData(null);
      }
    } catch (error) {
      console.error("Error fetching revenues:", error);
      setRevenueData(null);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = () => {
    fetchRevenues();
  };

  useEffect(() => {
    fetchRevenues();
  }, [page]);

  const handleViewRevenue = (revenue: RevenueItem) => {
    setSelectedRevenue(revenue);
    setIsModalVisible(true);
  };

  const revenueColumns: TableProps<RevenueItem>['columns'] = [
    {
      title: "Package Name",
      key: "packageName",
      render: (_, record) => (
        <Text strong style={{ cursor: "pointer", color: '#60a5fa' }} onClick={() => handleViewRevenue(record)}>
          {record.packages?.packageName || record.packageId || 'N/A'}
        </Text>
      ),
    },
    {
      title: "Owner Name",
      key: "ownerName",
      render: (_, record) => record.owner?.name || record.ownerId || 'N/A',
    },
    {
      title: "Total Revenue",
      dataIndex: "totalRevenuePerPackage",
      key: "totalRevenuePerPackage",
      render: (value: number) => 
        value !== undefined && value !== null 
          ? `${value.toLocaleString()} VND` 
          : '0 VND',
    },
    {
      title: "Actions",
      key: "actions",
      align: "right",
      render: (_: any, record: RevenueItem) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewRevenue(record)}
            type="primary"
            style={{ 
              backgroundColor: '#3b82f6', 
              borderRadius: '50px',
              border: 'none'
            }}
            shape="circle"
          />
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
      {/* Header Section */}
      <Row align="middle" style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Title level={2} style={{ 
            marginBottom: 0, 
            color: '#3b82f6' 
          }}>Revenue Management</Title>
          <Text type="secondary">Track revenue across all packages in your system</Text>
        </Col>
      </Row>

      {/* Total Revenue Summary Card */}
      <Card 
        style={{ 
          marginBottom: 24, 
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb'
        }}
      >
        <Row>
          <Col span={24}>
            <Statistic
              title={<Text strong style={{ fontSize: '16px', color: '#3b82f6' }}>Total Revenue Across All Packages</Text>}
              value={revenueData?.totalRevenueAllPackages || 0}
              suffix="VND"
              precision={0}
              valueStyle={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '24px' }}
              formatter={(value) => `${value.toLocaleString()}`}
            />
          </Col>
        </Row>
      </Card>

      {/* Card with Search */}
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
          <Col span={24}>
            <Input.Group compact>
              <Input
                placeholder="Search by package or owner name..."
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

      {/* Revenue Table */}
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
              <Text type="secondary">Loading revenue data...</Text>
            </div>
          </div>
        ) : (
          <Table
            columns={revenueColumns}
            dataSource={revenueData?.packagesSummary || []}
            rowKey="packageId"
            pagination={{
              current: page,
              pageSize: 10,
              onChange: (newPage) => setPage(newPage),
              showSizeChanger: false,
              style: { marginTop: 16 }
            }}
          />
        )}
      </Card>

      {/* Revenue Details Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Text strong style={{ color: '#3b82f6', fontSize: '18px' }}>
              Revenue Details
            </Text>
          </div>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button 
            key="close" 
            type="primary"
            onClick={() => setIsModalVisible(false)}
            style={{ 
              borderRadius: '50px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              border: 'none'
            }}
          >
            Close
          </Button>
        ]}
        width={700}
        style={{ top: 20 }}
        bodyStyle={{ padding: '24px' }}
      >
        {selectedRevenue && (
          <>
            <Card 
              bordered={false} 
              style={{ 
                boxShadow: 'none',
                background: 'rgba(59, 130, 246, 0.05)',
                borderRadius: '12px',
                padding: '8px',
                marginBottom: '16px'
              }}
            >
              <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <Title level={3} style={{ 
                  margin: '12px 0 0', 
                  color: '#3b82f6' 
                }}>{selectedRevenue.packages?.packageName || selectedRevenue.packageId || 'N/A'}</Title>
              </div>
              
              <Divider style={{ 
                margin: '12px 0', 
                borderColor: '#e5e7eb' 
              }} />
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <Text type="secondary">Package ID</Text>
                  <div style={{ wordBreak: 'break-all' }}>{selectedRevenue.packageId}</div>
                </div>
                
                <div>
                  <Text type="secondary">Owner Name</Text>
                  <div>{selectedRevenue.owner?.name || 'N/A'}</div>
                </div>
                
                <div>
                  <Text type="secondary">Owner ID</Text>
                  <div style={{ wordBreak: 'break-all' }}>{selectedRevenue.ownerId}</div>
                </div>
              </div>
            </Card>
            
            <Card
              bordered={false}
              style={{ 
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb'
              }}
              title={
                <Text strong style={{ color: '#3b82f6' }}>Package Statistics</Text>
              }
            >
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Statistic 
                    title="Total Revenue" 
                    value={selectedRevenue.totalRevenuePerPackage !== undefined ? 
                      selectedRevenue.totalRevenuePerPackage : 0} 
                    suffix="VND"
                    formatter={(value) => `${value.toLocaleString()}`}
                    valueStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic 
                    title="Total Packages" 
                    value={selectedRevenue.totalPackages || 0}
                    valueStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic 
                    title="Active Packages" 
                    value={selectedRevenue.activePackages || 0}
                    valueStyle={{ color: '#10b981', fontWeight: 'bold' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic 
                    title="Expired Packages" 
                    value={selectedRevenue.expiredPackages || 0}
                    valueStyle={{ color: '#f43f5e', fontWeight: 'bold' }}
                  />
                </Col>
              </Row>
            </Card>
          </>
        )}
      </Modal>
    </div>
  );
};

export default RevenuePage;