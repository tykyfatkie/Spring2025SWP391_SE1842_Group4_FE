import { useEffect, useState } from "react";
import { Table, Button, Input, Spin, message, Modal, Space } from "antd";
import { SearchOutlined, EyeOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import type { TableProps } from "antd";


// ============ TYPE DEFINITIONS ============

interface Revenue {
  id: string;
  orderId: string;
  date: string;
  amount: number;
  status: number;
}

type RevenueStatus = 0 | 1 | 2; // Example: 0 - Pending, 1 - Completed, 2 - Cancelled

// ============ MAIN COMPONENT ============

const RevenuePage = () => {
  // ============ STATE ============

  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [filterStatus] = useState<RevenueStatus>(0);
  const [selectedRevenue, setSelectedRevenue] = useState<Revenue | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  // ============ API CALLS ============

  const fetchRevenues = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = {
        searchKeyword: searchKeyword || undefined,
        page: page - 1,
        pageSize: 20,
        status: filterStatus,
      };

      const response = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}/revenues`, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRevenues(response.data.data || []);
    } catch (error) {
      message.error("Failed to fetch revenues");
    } finally {
      setLoading(false);
    }
  };

  // ============ SIDE EFFECTS ============

  useEffect(() => {
    fetchRevenues();
  }, [page, filterStatus]);

  // ============ HANDLERS ============

  const handleViewRevenue = (revenue: Revenue) => {
    setSelectedRevenue(revenue);
    setIsModalVisible(true);
  };

  const handleRevenueStatusChange = async (revenueId: string, status: RevenueStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${import.meta.env.VITE_API_ENDPOINT}/revenues/status/${revenueId}?status=${status}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchRevenues();
    } catch (error) {
      message.error("Failed to update revenue status");
    }
  };

  // ============ HELPER FUNCTIONS ============

  const getStatusTag = (status: RevenueStatus) => {
    switch (status) {
      case 0:
        return <span style={{ color: "orange" }}>Pending</span>;
      case 1:
        return <span style={{ color: "green" }}>Completed</span>;
      case 2:
        return <span style={{ color: "red" }}>Cancelled</span>;
      default:
        return <span>Unknown</span>;
    }
  };

  // ============ TABLE COLUMNS CONFIG ============

  const revenueColumns: TableProps<Revenue>['columns'] = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date: string) => {
        const dateObj = new Date(date);
        return dateObj.toLocaleDateString();
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => `$${amount.toFixed(2)}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: RevenueStatus) => getStatusTag(status),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Revenue) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewRevenue(record)}
            type="primary"
            shape="circle"
          />
          {record.status === 0 && (
            <Button
              icon={<ExclamationCircleOutlined />}
              type="default"
              danger
              onClick={() => handleRevenueStatusChange(record.id, 1)}
              shape="circle"
            />
          )}
        </Space>
      ),
    },
  ];

  // ============ RENDER ============

  return (
    <div>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "right", gap: "10px" }}>
        <Input
          placeholder="Search revenues..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          allowClear
          style={{ width: 250 }}
        />
        <Button type="primary" icon={<SearchOutlined />} onClick={fetchRevenues}>
          Search
        </Button>
      </div>

      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
      ) : (
        <Table
          columns={revenueColumns}
          dataSource={revenues}
          rowKey="id"
          pagination={{
            current: page,
            pageSize: 10,
            onChange: (newPage) => setPage(newPage),
            showSizeChanger: false,
          }}
        />
      )}

      <Modal
        title={`Revenue Details for Order ${selectedRevenue?.orderId || 'N/A'}`}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedRevenue ? (
          <div>
            <p><strong>Order ID:</strong> {selectedRevenue.orderId}</p>
            <p><strong>Date:</strong> {new Date(selectedRevenue.date).toLocaleDateString()}</p>
            <p><strong>Amount:</strong> ${selectedRevenue.amount.toFixed(2)}</p>
          </div>
        ) : (
          <p>No details available.</p>
        )}
      </Modal>
    </div>
  );
};

export default RevenuePage;
