import React, { useState, useEffect } from "react";
import { Layout, Table, Button, Space, Modal, message } from "antd";
import axiosInstance from "../../utils/axiosInstance";
import Sidebar from "../../components/Sidebar/Sidebar";
import CollapsibleHeader from "../ChildManage/CollapsibleHeader";

const { Content } = Layout;
// Removed unused Title import

const API_BASE_URL = `${import.meta.env.VITE_API_ENDPOINT}/request/my-request`;

// Define interface for consultation request
interface ConsultationRequest {
  id: string | number;
  doctorName: string;
  status: string;
  date: string;
  // Add other properties that might be in your response
}

// Define possible API response structures
interface ApiResponse {
  items?: ConsultationRequest[];
  data?: ConsultationRequest[];
  // Add other possible structures
}

const UserConsultationRequests: React.FC = () => {
  const [requests, setRequests] = useState<ConsultationRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("all");

  useEffect(() => {
    fetchConsultationRequests();
  }, []);

  const fetchConsultationRequests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axiosInstance.get<ConsultationRequest[] | ApiResponse>(API_BASE_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Check the actual structure of your response
      if (Array.isArray(response.data)) {
        setRequests(response.data);
      } else if (response.data && Array.isArray((response.data as ApiResponse).items)) {
        setRequests((response.data as ApiResponse).items || []);
      } else if (response.data && Array.isArray((response.data as ApiResponse).data)) {
        setRequests((response.data as ApiResponse).data || []);
      } else {
        setRequests([]);
      }
    } catch (error: any) {
      console.error("Error fetching consultation requests:", error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async (requestId: string | number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      Modal.confirm({
        title: "Cancel Consultation Request",
        content: "Are you sure you want to cancel this consultation request?",
        okText: "Yes, Cancel",
        okType: "danger",
        cancelText: "No",
        onOk: async () => {
          try {
            await axiosInstance.put(
              `${import.meta.env.VITE_API_ENDPOINT}/request/cancel/${requestId}`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            message.success("Consultation request canceled successfully");
            fetchConsultationRequests();
          } catch (error: any) {
            message.error("Failed to cancel the request");
          }
        },
      });
    } catch (error: any) {
      message.error("An error occurred");
    }
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const filteredRequests = activeTab === "all" 
    ? requests 
    : requests.filter(request => 
        activeTab === "pending" 
          ? request.status.toLowerCase() === "pending" 
          : request.status.toLowerCase() === activeTab
      );

  const columns = [
    {
      title: "Request ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Doctor",
      dataIndex: "doctorName",
      key: "doctorName",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <span style={{ 
          color: status.toLowerCase() === "approved" ? "#52c41a" : 
                 status.toLowerCase() === "pending" ? "#faad14" : 
                 status.toLowerCase() === "rejected" ? "#f5222d" : 
                 status.toLowerCase() === "canceled" ? "#8c8c8c" : "#000000" 
        }}>
          {status}
        </span>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: ConsultationRequest) => (
        <Space>
          {record.status.toLowerCase() === "pending" && (
            <Button
              danger
              onClick={() => handleCancelRequest(record.id)}
              style={{
                borderRadius: "8px",
                height: "38px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Cancel
            </Button>
          )}
          <Button
            type="primary"
            onClick={() => {}}
            style={{
              borderRadius: "8px",
              height: "38px",
              background: "#1e3a8a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Details
          </Button>
        </Space>
      ),
    },
  ];

  const tabList = [
    {
      key: "all",
      tab: "All Requests",
    },
    {
      key: "pending",
      tab: "Pending",
    },
    {
      key: "approved",
      tab: "Approved",
    },
    {
      key: "rejected",
      tab: "Rejected",
    },
    {
      key: "canceled",
      tab: "Canceled",
    },
  ];

  const RequestsTable = () => (
    <div style={{ background: "white", borderRadius: "8px", padding: "16px", boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.03)" }}>
      <div style={{ marginBottom: "16px", borderBottom: "1px solid #f0f0f0" }}>
        <Space size="middle">
          {tabList.map(item => (
            <span
              key={item.key}
              onClick={() => handleTabChange(item.key)}
              style={{
                padding: "12px 0",
                marginRight: "24px",
                cursor: "pointer",
                borderBottom: activeTab === item.key ? "2px solid #1e3a8a" : "none",
                color: activeTab === item.key ? "#1e3a8a" : "inherit",
                fontWeight: activeTab === item.key ? 600 : 400,
              }}
            >
              {item.tab}
            </span>
          ))}
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filteredRequests}
        rowKey="id"
        pagination={{
          pageSize: 10,
          position: ["bottomCenter"],
        }}
        loading={loading}
        locale={{ emptyText: "No consultation requests found" }}
      />
    </div>
  );

  return (
    <Layout style={{ minHeight: "100vh", margin: "-25px", background: "white", marginRight: "25px" }}>
      <Layout>
        <Sidebar />
        <Content style={{ padding: "24px", background: "#f8fafc", marginLeft: "260px" }}>
          <CollapsibleHeader
            title="Consultation Requests"
            subtitle="MANAGE REQUESTS"
            description="View and manage all your consultation requests. Track the status of your requests and cancel pending requests if needed."
            features={[
              "View all consultation requests",
              "Filter requests by status",
              "Cancel pending requests",
              "See consultation details"
            ]}
            defaultCollapsed={false}
          />

          <div style={{ marginTop: "24px" }}>
            <RequestsTable />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserConsultationRequests;