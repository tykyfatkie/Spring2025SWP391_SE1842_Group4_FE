import React, { useState, useEffect } from "react";
import { Layout, Table, Button, Space, Modal, message } from "antd";
import axiosInstance from "../../utils/axiosInstance";
import Sidebar from "../../components/Sidebar/Sidebar";
import CollapsibleHeader from "../ChildManage/CollapsibleHeader";

const { Content } = Layout;

const API_BASE_URL = `${import.meta.env.VITE_API_ENDPOINT}/request/my-request`;


// Define interface for consultation request
interface ConsultationRequest {
  id: string | number;
  doctorName: string;
  status: string; // Changed to string to handle any format the API returns
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

      const response = await axiosInstance.get(API_BASE_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("API Response:", response.data); // Log the entire response

      // Check the actual structure of your response
      if (Array.isArray(response.data)) {
        setRequests(response.data);
      } else if (response.data && Array.isArray((response.data as ApiResponse).items)) {
        setRequests((response.data as ApiResponse).items || []);
      } else if (response.data && Array.isArray((response.data as ApiResponse).data)) {
        setRequests((response.data as ApiResponse).data || []);
      } else {
        // If none of the expected formats, try to determine if there's data in another format
        const responseData = response.data;
        if (responseData && typeof responseData === 'object') {
          // Look for any array property that might contain our data
          const possibleArrayProps = Object.keys(responseData).filter(key => 
            Array.isArray(responseData[key])
          );
          
          if (possibleArrayProps.length > 0) {
            // Use the first array found
            setRequests(responseData[possibleArrayProps[0]]);
          } else {
            setRequests([]);
          }
        } else {
          setRequests([]);
        }
      }
    } catch (error: any) {
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
          }
        },
      });
    } catch (error: any) {
    }
  };

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
      render: (status: string) => {
        let color = "#000000";
        let displayText = status;
        
        switch(status) {
          case "Approve":
            color = "#52c41a"; // Green
            displayText = "Approved";
            break;
          case "Pending":
            color = "#faad14"; // Yellow/Orange
            displayText = "Pending";
            break;
          case "Reject":
            color = "#f5222d"; // Red
            displayText = "Rejected";
            break;
          case "Archived":
            color = "#8c8c8c"; // Gray
            displayText = "Archived";
            break;
        }
        
        return <span style={{ color }}>{displayText}</span>;
      },
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
          {record.status === "Pending" && (
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

  const RequestsTable = () => (
    <div style={{ background: "white", borderRadius: "8px", padding: "16px", boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.03)" }}>
      <Table
        columns={columns}
        dataSource={requests}
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