import { useEffect, useState } from "react";
import { Table, Button, Input, Spin, Modal, Space, Card, Statistic } from "antd";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import axios from "axios";
import type { TableProps } from "antd";


interface RevenueItem {
  packageId: string;
  ownerId: string;
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
      
      console.log("API Response:", response.data);
      
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
    // Since we're using API data directly, you might want to implement a client-side filter
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
      title: "Package ID",
      dataIndex: "packageId",
      key: "packageId",
    },
    {
      title: "Owner ID",
      dataIndex: "ownerId",
      key: "ownerId",
    },
    {
      title: "Total Revenue",
      dataIndex: "totalRevenuePerPackage",
      key: "totalRevenuePerPackage",
      render: (value: number) => 
        value !== undefined && value !== null 
          ? `${value} VND` 
          : '0 VND',
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: RevenueItem) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewRevenue(record)}
            type="primary"
            shape="circle"
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Total Revenue Summary Card */}
      <Card style={{ marginBottom: 16 }}>
        <Statistic
          title="Total Revenue Across All Packages"
          value={revenueData?.totalRevenueAllPackages || 0}
          suffix="VND"
          precision={2}
          valueStyle={{ color: '#3f8600', fontWeight: 'bold', fontSize: '24px' }}
        />
      </Card>

      <div style={{ marginBottom: 16, display: "flex", justifyContent: "right", gap: "10px" }}>
        <Input
          placeholder="Search revenues..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          allowClear
          style={{ width: 250 }}
        />
        <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
          Search
        </Button>
      </div>

      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
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
          }}
        />
      )}

      <Modal
        title={`Revenue Details for Package ${selectedRevenue?.packageId || 'N/A'}`}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedRevenue ? (
          <div>
            <p><strong>Package ID:</strong> {selectedRevenue.packageId}</p>
            <p><strong>Owner ID:</strong> {selectedRevenue.ownerId}</p>
            <p><strong>Total Revenue:</strong> {selectedRevenue.totalRevenuePerPackage !== undefined ? 
              `${selectedRevenue.totalRevenuePerPackage} VND` : '0 VND'}</p>
            <p><strong>Total Packages:</strong> {selectedRevenue.totalPackages}</p>
            <p><strong>Active Packages:</strong> {selectedRevenue.activePackages}</p>
            <p><strong>Expired Packages:</strong> {selectedRevenue.expiredPackages}</p>
          </div>
        ) : (
          <p>No details available.</p>
        )}
      </Modal>
    </div>
  );
};

export default RevenuePage;