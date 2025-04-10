import React, { useState, useEffect } from "react";
import { Layout, Table, Button, Space, Modal, Tabs } from "antd";
import axiosInstance from "../../utils/axiosInstance";
import Sidebar from "../../components/Sidebar/Sidebar";
import CollapsibleHeader from "../ChildManage/CollapsibleHeader";

const { Content } = Layout;
const { TabPane } = Tabs;

const API_BASE_URL = `${import.meta.env.VITE_API_ENDPOINT}/request/my-request`;
const DOCTOR_PROFILE_API = `${import.meta.env.VITE_API_ENDPOINT}/doctors/doctorprofile`;
const RESPONSE_API_URL = `${import.meta.env.VITE_API_ENDPOINT}/response/request-`;

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
  doctorName: string; 
}

interface DoctorProfile {
  id: string;
  fullName: string;
  specialty?: string;
  avatarUrl?: string;
}

interface ConsultationResponse {
  requestId: string;
  doctorId: string;
  responseDate: any;
  title: any;
  content: any;
  attachments: string[];
  consultationStatus?: number;
  updatedAt?: string; 
}

const UserConsultationRequests: React.FC = () => {
  const [requests, setRequests] = useState<ConsultationRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [detailsModalVisible, setDetailsModalVisible] = useState<boolean>(false);
  const [selectedRequest, setSelectedRequest] = useState<ConsultationRequest | null>(null);
  const [doctorProfiles, setDoctorProfiles] = useState<Record<string, DoctorProfile>>({});
  const [consultationResponse, setConsultationResponse] = useState<ConsultationResponse | null>(null);
  const [loadingResponse, setLoadingResponse] = useState<boolean>(false);

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
      
      if (response.data && response.data.data && response.data.data.data) {
        const responseData = response.data.data.data;     
        const formattedRequests = responseData.map((item: any) => {
          let parsedAttachments = [];
          try {
            if (typeof item.attachments === 'string') {
              parsedAttachments = JSON.parse(item.attachments);
            } else if (Array.isArray(item.attachments)) {
              parsedAttachments = item.attachments;
            }
          } catch (e) {
          }
          
          return {
            id: item.id || "",
            title: item.title || "Consultation Request",
            description: item.description || "",
            status: typeof item.status === 'number' ? item.status : 1, 
            userRequestId: item.userRequestId || "",
            doctorReceiveId: item.doctorReceiveId || "",
            requestDate: item.requestDate || item.createdAt,
            createdAt: item.createdAt || "",
            updatedAt: item.updatedAt || "",
            attachments: parsedAttachments,
            doctorName: `Doctor ${item.doctorReceiveId?.substring(0, 6) || ""}` 
          };
        });
        
        setRequests(formattedRequests);
        
        const doctorIds = formattedRequests
        .map((req: ConsultationRequest) => req.doctorReceiveId)
        .filter((id: string) => id && id.length > 0);
        
        const uniqueDoctorIds = [...new Set(doctorIds)] as string[];
        fetchDoctorProfiles(uniqueDoctorIds, formattedRequests);
        
      } else {
        setRequests([]);
      }
    } catch (error: any) {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchConsultationResponse = async (requestId: string) => {
    setLoadingResponse(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoadingResponse(false);
        return;
      }
  
      const response = await axiosInstance.get(`${RESPONSE_API_URL}${requestId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.data && 
          response.data.data && 
          Array.isArray(response.data.data.data) && 
          response.data.data.data.length > 0) {
        
        const responseData = response.data.data.data[0];
        
        const formattedResponse: ConsultationResponse = {
          requestId: responseData.requestId || "",
          doctorId: responseData.doctorId || "",
          responseDate: responseData.responseDate || responseData.createdAt || "",
          title: responseData.title || "",
          content: responseData.content || "",
          attachments: [],
          consultationStatus: responseData.status
        };
  
        try {
          if (typeof responseData.attachments === 'string' && responseData.attachments) {
            formattedResponse.attachments = JSON.parse(responseData.attachments);
          } else if (Array.isArray(responseData.attachments)) {
            formattedResponse.attachments = responseData.attachments;
          }
        } catch (e) {
          formattedResponse.attachments = [];
        }
  
        setConsultationResponse(formattedResponse);
      } else {
        setConsultationResponse(null);
      }
    } catch (error) {
      setConsultationResponse(null);
    } finally {
      setLoadingResponse(false);
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
          
          if (response.data && response.data.data) {
            return {
              id: doctorId,
              profile: response.data.data
            };
          }
          return null;
        } catch (error) {
          return null;
        }
      });
      
      const profiles = await Promise.all(profilePromises);
      const validProfiles = profiles.filter(profile => profile !== null);
      
      const profileMap: Record<string, DoctorProfile> = {};
      validProfiles.forEach(item => {
        if (item) {
          const profile = Array.isArray(item.profile) ? item.profile[0] : item.profile;
          
          profileMap[item.id] = {
            id: item.id,
            fullName: profile.user?.name || `Doctor ${item.id.substring(0, 6)}`,
            specialty: profile.specialize || profile.specialize,
            avatarUrl: profile.profileImg || profile.user?.avatar
          };    
        }
      });
      
      setDoctorProfiles(profileMap);
      
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
      setRequests(updatedRequests);
      
    } catch (error) {
    }
  };

  const showDetailsModal = async (request: ConsultationRequest) => {
    setSelectedRequest(request);
    setDetailsModalVisible(true);
    await fetchConsultationResponse(request.id);
  };

  const handleDetailsModalClose = () => {
    setDetailsModalVisible(false);
    setSelectedRequest(null);
    setConsultationResponse(null);
  };

  const getStatusText = (status: number): string => {
    if (status === undefined || status === null) {
      return "Unknown";
    }
    
    switch(status) {
      case 0: return "Approved";
      case 1: return "Rejected";
      case 2: return "Pending";
      case 3: return "Archived";
      default: return "Canceled";
    }
  };

  const columns = [
    {
      title: "Request ID",
      dataIndex: "id",
      key: "id",
      width: "15%", 
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
      width: "15%", 
      render: (status: number) => {
        let color = "#000000";
        const displayText = getStatusText(status);
        
        switch(status) {
          case 0: // Approved
            color = "#52c41a";
            break;
          case 2: // Pending
            color = "#faad14";
            break;
          case 1: // Rejected
            color = "#f5222d"; 
            break;
          case 3: // Archived
            color = "#8c8c8c"; 
            break;
        }
        
        return <span style={{ color }}>{displayText}</span>;
      },
    },
    {
      title: "Date",
      dataIndex: "requestDate",
      key: "requestDate",
      width: "20%", 
      render: (date: string) => {
        const formattedDate = date ? new Date(date).toLocaleString('vi-VN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }) : "Unknown";
        return <span>{formattedDate}</span>;
      }
    },
    {
      title: "Actions",
      key: "actions",
      width: "20%", 
      render: (_: any, record: ConsultationRequest) => (
        <Space>
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

  const renderDoctorResponse = () => {
    if (loadingResponse) {
      return <div style={{ textAlign: "center", padding: "20px" }}>Loading doctor's response...</div>;
    }

    if (!consultationResponse) {
      return (
        <div style={{ 
          padding: "40px 20px", 
          textAlign: "center", 
          background: "#f9f9f9", 
          borderRadius: "8px" 
        }}>
          <p>No response received from the doctor yet.</p>
        </div>
      );
    }

    const renderContent = () => {
      const content = consultationResponse?.content;
      
      if (content === null || content === undefined || content === "") {
        return <div>No content provided.</div>;
      }
      
      if (typeof content === 'object' && content !== null) {
        return <pre>{JSON.stringify(content, null, 2)}</pre>;
      }
      
      return <div style={{ whiteSpace: 'pre-wrap' }}>{content}</div>;
    };

    return (
      <div>
        <div style={{ marginBottom: "16px" }}>
          <h3 style={{ fontSize: "18px", marginBottom: "8px" }}>Response from Doctor</h3>
          <p><strong>Date:</strong> {consultationResponse.updatedAt ? 
            new Date(consultationResponse.updatedAt).toLocaleString('vi-VN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            }) : consultationResponse.responseDate ?
            new Date(consultationResponse.responseDate).toLocaleString('vi-VN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            }) : 'Unknown'}</p>
          <p><strong>Title:</strong> {consultationResponse.title}</p>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <h3 style={{ fontSize: "18px", marginBottom: "8px" }}>Content</h3>
          <div style={{ 
            padding: "12px", 
            background: "#f0f7ff", 
            borderRadius: "8px",
            minHeight: "100px"
          }}>
            {renderContent()}
          </div>
        </div>

        {consultationResponse.attachments && consultationResponse.attachments.length > 0 && (
          <div>
            <h3 style={{ fontSize: "18px", marginBottom: "8px" }}>Response Attachments</h3>
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {consultationResponse.attachments.map((attachment, index) => (
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
                      background: "#e6f7ff",
                      borderRadius: "4px",
                      color: "#1890ff",
                      textDecoration: "none"
                    }}
                  >
                    <span>Response Attachment {index + 1}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout style={{ minHeight: "100vh", margin: "-25px", background: "white", marginRight: "25px" }}>
      <Layout>
        <Sidebar />
        <Content style={{ padding: "24px", background: "#f8fafc", marginLeft: "260px" }}>
          <CollapsibleHeader
            title="Consultation Requests"
            subtitle="MANAGE REQUESTS"
            description="View and manage all your consultation requests. Track the status of your requests and view consultation details."
            features={[
              "View all consultation requests",
              "See consultation details",
              "Read doctor responses"
            ]}
            defaultCollapsed={false}
          />

          <div style={{ marginTop: "24px" }}>
            <RequestsTable />
          </div>

          <Modal
            title="Consultation Request Details"
            open={detailsModalVisible}
            onCancel={handleDetailsModalClose}
            footer={[
              <Button key="close" onClick={handleDetailsModalClose}>
                Close
              </Button>
            ]}
            width={800}
          >
            {selectedRequest && (
              <Tabs defaultActiveKey="request">
                <TabPane tab="Request Details" key="request">
                  <div>
                    <div style={{ marginBottom: "16px" }}>
                      <h3 style={{ fontSize: "18px", marginBottom: "8px" }}>Request Information</h3>
                      <p><strong>Request ID:</strong> {selectedRequest.id}</p>
                      <p><strong>Status:</strong> <span style={{ 
                        color: selectedRequest.status === 0 ? "#52c41a" : 
                              selectedRequest.status === 2 ? "#faad14" : 
                              selectedRequest.status === 1 ? "#f5222d" : 
                              selectedRequest.status === 3 ? "#8c8c8c" : 
                              "#000000"
                      }}>{getStatusText(selectedRequest.status)}</span></p>
                      <p><strong>Date:</strong> {new Date(selectedRequest.updatedAt || selectedRequest.requestDate).toLocaleString('vi-VN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}</p>
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
                </TabPane>
                <TabPane tab="Doctor's Response" key="response">
                  {renderDoctorResponse()}
                </TabPane>
              </Tabs>
            )}
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserConsultationRequests;