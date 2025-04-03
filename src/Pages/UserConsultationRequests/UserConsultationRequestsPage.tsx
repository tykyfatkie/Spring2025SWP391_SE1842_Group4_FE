import React, { useState, useEffect } from "react";
import { Layout, Table, Button, Space, Modal, message } from "antd";
import axiosInstance from "../../utils/axiosInstance";
import Sidebar from "../../components/Sidebar/Sidebar";
import CollapsibleHeader from "../ChildManage/CollapsibleHeader";

const { Content } = Layout;

const API_BASE_URL = `${import.meta.env.VITE_API_ENDPOINT}/request/my-request`;
const DOCTOR_PROFILE_API = `${import.meta.env.VITE_API_ENDPOINT}/doctors/doctorprofile`;

// Define interface for consultation request based on actual API response
interface ConsultationRequest {
  id: string;
  title: string;
  description: string;
  status: number;
  userRequestId: string;
  doctorReceiveId: string;
  requestDate: string;
  createdAt: string;
  updatedAt: string;
  attachments: string[];
  doctorName: string; // Will be populated from doctor profile API
}

// Interface for doctor profile data
interface DoctorProfile {
  id: string;
  fullName: string;
  specialty?: string;
  avatarUrl?: string;
}

const UserConsultationRequests: React.FC = () => {
  const [requests, setRequests] = useState<ConsultationRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [detailsModalVisible, setDetailsModalVisible] = useState<boolean>(false);
  const [selectedRequest, setSelectedRequest] = useState<ConsultationRequest | null>(null);
  const [doctorProfiles, setDoctorProfiles] = useState<Record<string, DoctorProfile>>({});

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
  
      console.log("API Response:", response.data);
      
      // Handle the nested data structure from the API response
      if (response.data && response.data.data && response.data.data.data) {
        // Access the deeply nested data array
        const responseData = response.data.data.data;
        
        // Map the data to match our component's expected structure
        const formattedRequests = responseData.map((item: any) => {
          // Parse attachments from string to array
          let parsedAttachments = [];
          try {
            if (typeof item.attachments === 'string') {
              parsedAttachments = JSON.parse(item.attachments);
            } else if (Array.isArray(item.attachments)) {
              parsedAttachments = item.attachments;
            }
          } catch (e) {
            console.error("Error parsing attachments:", e);
          }
          
          return {
            id: item.id || "",
            title: item.title || "Consultation Request",
            description: item.description || "",
            status: typeof item.status === 'number' ? item.status : 1, // Default to pending if not a number
            userRequestId: item.userRequestId || "",
            doctorReceiveId: item.doctorReceiveId || "",
            requestDate: item.requestDate || item.createdAt,
            createdAt: item.createdAt || "",
            updatedAt: item.updatedAt || "",
            attachments: parsedAttachments,
            doctorName: `Doctor ${item.doctorReceiveId?.substring(0, 6) || ""}` // Default name, will be updated
          };
        });
        
        setRequests(formattedRequests);
        
        // Fetch doctor profiles for all doctor IDs
        const doctorIds = formattedRequests
        .map((req: ConsultationRequest) => req.doctorReceiveId)
        .filter((id: string) => id && id.length > 0);
        
        const uniqueDoctorIds = [...new Set(doctorIds)] as string[];
        fetchDoctorProfiles(uniqueDoctorIds, formattedRequests);
        
      } else {
        setRequests([]);
        console.error("Unexpected response format:", response.data);
      }
    } catch (error: any) {
      console.error("Error fetching consultation requests:", error);
      setRequests([]);
      message.error("Failed to load consultation requests");
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctorProfiles = async (doctorIds: string[], requests: ConsultationRequest[]) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    
    try {
      const profilePromises = doctorIds.map(async (doctorId) => {
        try {
          const response = await axiosInstance.get(`${DOCTOR_PROFILE_API}/${doctorId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          console.log(`Full doctor profile response for ${doctorId}:`, response.data);
          
          // Check if the API response contains doctor data
          if (response.data && response.data.data) {
            return {
              id: doctorId,
              profile: response.data.data
            };
          }
          return null;
        } catch (error) {
          console.error(`Error fetching doctor profile for ${doctorId}:`, error);
          return null;
        }
      });
      
      const profiles = await Promise.all(profilePromises);
      const validProfiles = profiles.filter(profile => profile !== null);
      
      // Create a map of doctor IDs to profiles
      const profileMap: Record<string, DoctorProfile> = {};
      validProfiles.forEach(item => {
        if (item) {
          // Access the name from the user object if it exists
          const profile = item.profile;
          const userName = profile.user?.name || profile.user?.fullName;
          
          profileMap[item.id] = {
            id: item.id,
            fullName: userName || profile.fullName || `Doctor ${item.id.substring(0, 6)}`,
            specialty: profile.specialty,
            avatarUrl: profile.avatarUrl || profile.user?.avatar
          };
          
          console.log(`Extracted name for doctor ${item.id}:`, profileMap[item.id].fullName);
        }
      });
      
      setDoctorProfiles(profileMap);
      
      // Create a completely new array for the updated requests
      const updatedRequests = requests.map(request => {
        const doctorProfile = profileMap[request.doctorReceiveId];
        if (doctorProfile) {
          return {
            ...request,
            doctorName: doctorProfile.fullName
          };
        }
        return request;
      });
      
      console.log("Updated requests with doctor names:", updatedRequests);
      setRequests(updatedRequests);
      
    } catch (error) {
      console.error("Error fetching doctor profiles:", error);
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
            console.error("Error canceling request:", error);
            message.error("Failed to cancel consultation request");
          }
        },
      });
    } catch (error: any) {
      console.error("Error in cancel request flow:", error);
    }
  };

  const showDetailsModal = (request: ConsultationRequest) => {
    setSelectedRequest(request);
    setDetailsModalVisible(true);
  };

  const handleDetailsModalClose = () => {
    setDetailsModalVisible(false);
    setSelectedRequest(null);
  };

  // Convert numeric status to string representation
  const getStatusText = (status: number): string => {
    switch(status) {
      case 1: return "Pending";
      case 2: return "Approved";
      case 3: return "Rejected";
      case 4: return "Canceled";
      case 5: return "Archived";
      default: return "Unknown";
    }
  };

  const columns = [
    {
      title: "Request ID",
      dataIndex: "id",
      key: "id",
      width: "15%", // Smaller width for ID
    },
    {
      title: "Doctor",
      dataIndex: "doctorName",
      key: "doctorName",
      width: "30%",
      render: (_: any, record: ConsultationRequest) => {
        return <span>{record.doctorName}</span>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "15%", // Set width for status
      render: (status: number) => {
        let color = "#000000";
        const displayText = getStatusText(status);
        
        switch(status) {
          case 2: // Approved
            color = "#52c41a"; // Green
            break;
          case 1: // Pending
            color = "#faad14"; // Yellow/Orange
            break;
          case 3: // Rejected
            color = "#f5222d"; // Red
            break;
          case 5: // Archived
            color = "#8c8c8c"; // Gray
            break;
          case 4: // Canceled
            color = "#d9d9d9"; // Light Gray
            break;
        }
        
        return <span style={{ color }}>{displayText}</span>;
      },
    },
    {
      title: "Date",
      dataIndex: "requestDate",
      key: "requestDate",
      width: "20%", // Set width for date
      render: (date: string) => {
        // Format the date nicely
        const formattedDate = date ? new Date(date).toLocaleString() : "Unknown";
        return <span>{formattedDate}</span>;
      }
    },
    {
      title: "Actions",
      key: "actions",
      width: "20%", // Set width for actions
      render: (_: any, record: ConsultationRequest) => (
        <Space>
          {record.status === 1 && ( // Only show cancel button for Pending requests
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
            onClick={() => showDetailsModal(record)}
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

          {/* Details Modal */}
          <Modal
            title="Consultation Request Details"
            open={detailsModalVisible}
            onCancel={handleDetailsModalClose}
            footer={[
              <Button key="close" onClick={handleDetailsModalClose}>
                Close
              </Button>
            ]}
            width={600}
          >
            {selectedRequest && (
              <div>
                <div style={{ marginBottom: "16px" }}>
                  <h3 style={{ fontSize: "18px", marginBottom: "8px" }}>Request Information</h3>
                  <p><strong>Request ID:</strong> {selectedRequest.id}</p>
                  <p><strong>Status:</strong> <span style={{ 
                    color: selectedRequest.status === 2 ? "#52c41a" : 
                          selectedRequest.status === 1 ? "#faad14" : 
                          selectedRequest.status === 3 ? "#f5222d" : 
                          selectedRequest.status === 5 ? "#8c8c8c" : 
                          selectedRequest.status === 4 ? "#d9d9d9" : "#000000"
                  }}>{getStatusText(selectedRequest.status)}</span></p>
                  <p><strong>Date:</strong> {new Date(selectedRequest.requestDate).toLocaleString()}</p>
                  <p><strong>Doctor:</strong> {
                    doctorProfiles[selectedRequest.doctorReceiveId]?.fullName || 
                    selectedRequest.doctorName
                  }</p>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <h3 style={{ fontSize: "18px", marginBottom: "8px" }}>Description</h3>
                  <div style={{ 
                    padding: "12px", 
                    background: "#f9f9f9", 
                    borderRadius: "8px",
                    minHeight: "100px"
                  }}>
                    {selectedRequest.description || "No description provided."}
                  </div>
                </div>

                {selectedRequest.attachments && selectedRequest.attachments.length > 0 && (
                  <div>
                    <h3 style={{ fontSize: "18px", marginBottom: "8px" }}>Attachments</h3>
                    <ul style={{ listStyleType: "none", padding: 0 }}>
                      {selectedRequest.attachments.map((attachment, index) => (
                        <li key={index} style={{ marginBottom: "8px" }}>
                          <a 
                            href={attachment} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              padding: "8px 12px",
                              background: "#f0f5ff",
                              borderRadius: "4px",
                              color: "#1e3a8a",
                              textDecoration: "none"
                            }}
                          >
                            <span>Attachment {index + 1}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserConsultationRequests;