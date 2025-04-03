import { useEffect, useState } from "react";
import { 
  Table, 
  Avatar, 
  Tag, 
  Space, 
  Typography, 
  message, 
  Spin, 
  Input, 
  Button, 
  Modal,
  Card,
  Row,
  Col,
  Divider
} from "antd";
import { 
  UserOutlined, 
  SearchOutlined, 
  EyeOutlined, 
  CheckCircleOutlined,
  CloseCircleOutlined,
  FilterOutlined
} from "@ant-design/icons";
import axios from "axios";
import type { TableProps } from "antd";

const { Text, Title } = Typography;

// ============ TYPE DEFINITIONS ============
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: UserStatus;
}

interface Child {
  id: string;
  name: string;
  doB?: string;
  gender?: string;
}

type UserStatus = 0 | 1 | 2 | 4;

// ============ MAIN COMPONENT ============
const UsersPage = () => {
  // ============ STATE ============
  const [users, setUsers] = useState<User[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isChildrenLoading, setIsChildrenLoading] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<number>(0);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalUsers, setTotalUsers] = useState<number>(0);

  // ============ API CALLS ============
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = {
        SearchKeyword: searchKeyword || undefined,
        Status: filterStatus,
        RoleIds: "00000000-0000-0000-0000-000000000004",
        Page: page,
        PageSize: pageSize
      };

      const response = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}/users/all`, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update users and total count
      setUsers(response.data.data.data || []);
      setTotalUsers(response.data.data.totalRecords || 0);
    } catch (error) {
      message.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const fetchChildrenByParentId = async (parentId: string) => {
    setIsChildrenLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}/children/getChildByParent`, {
        params: { parentId },
        headers: { Authorization: `Bearer ${token}` },
      });
      setChildren(response.data.data || []);
    } catch (error) {
      message.error("No children found for this parent!");
    } finally {
      setIsChildrenLoading(false);
    }
  };

  // ============ SIDE EFFECTS ============
  useEffect(() => {
    fetchUsers();
  }, [filterStatus, page, pageSize]);

  // ============ HANDLERS ============
  const resetChildrenData = () => {
    setChildren([]);
  };

  const handleViewUser = async (user: User) => {
    setSelectedUser(user);
    setIsModalVisible(true);
    setIsChildrenLoading(true);
    try {
      await fetchChildrenByParentId(user.id);
    } catch (error) {
      message.error("Error fetching children");
    }
  };

  const handleUserStatusChange = async (userId: string, status: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${import.meta.env.VITE_API_ENDPOINT}/users/status/${userId}?status=${status}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchUsers();
    } catch (error) {
      // Silent error handling
    }
  };

  const handleSearch = () => {
    setPage(0); // Reset to first page when searching
    fetchUsers();
  };

  // ============ HELPER FUNCTIONS ============
  const getStatusTag = (status: UserStatus) => {
    switch (status) {
      case 0: return <Tag color="#4ade80" style={{ borderRadius: '12px', padding: '2px 12px' }}>Active</Tag>;
      case 1: return <Tag color="#f87171" style={{ borderRadius: '12px', padding: '2px 12px' }}>Inactive</Tag>;
      case 2: return <Tag color="#9ca3af" style={{ borderRadius: '12px', padding: '2px 12px' }}>Archived</Tag>;
      case 4: return <Tag color="#facc15" style={{ borderRadius: '12px', padding: '2px 12px' }}>Not Verified</Tag>;
      default: return <Tag color="#9ca3af" style={{ borderRadius: '12px', padding: '2px 12px' }}>Unknown</Tag>;
    }
  };

  // ============ TABLE COLUMNS CONFIG ============
  const userColumns: TableProps<User>['columns'] = [
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar?: string) => avatar 
        ? <Avatar src={avatar} size={40} /> 
        : <Avatar icon={<UserOutlined />} size={40} style={{ backgroundColor: '#3b82f6' }} />
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: User) => (
        <Text strong style={{ cursor: "pointer", color: '#60a5fa' }} onClick={() => handleViewUser(record)}>
          {text}
        </Text>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: UserStatus) => getStatusTag(status),
    },
    {
      title: "Actions",
      key: "actions",
      align: "right",
      render: (_: any, record: User) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewUser(record)}
            type="primary"
            style={{ 
              backgroundColor: '#3b82f6', 
              borderRadius: '50px',
              border: 'none'
            }}
            shape="circle"
          />
          {record.status === 0 && (
            <Button
              icon={<CloseCircleOutlined />}
              type="default"
              danger
              onClick={() => handleUserStatusChange(record.id, 1)}
              shape="circle"
              style={{ borderRadius: '50px' }}
            />
          )}
          {record.status === 1 && (
            <Button
              icon={<CheckCircleOutlined />}
              type="default"
              onClick={() => handleUserStatusChange(record.id, 0)}
              shape="circle"
              style={{ borderRadius: '50px' }}
            />
          )}
        </Space>
      ),
    },
  ];

  const childColumns: TableProps<Child>['columns'] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Date of birth",
      dataIndex: "doB",
      key: "doB",
      render: (doB?: string) => {
        if (!doB) return <span>N/A</span>;
        const date = new Date(doB);
        return <span>{date.toLocaleDateString()}</span>;
      },
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (gender?: number) => {
        if (gender === 0) return 'Boy';
        return 'Girl';
      },
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
        <Col span={24}>
          <Title level={2} style={{ 
            marginBottom: 0, 
            color: '#3b82f6' 
          }}>Users Management</Title>
          <Text type="secondary">Manage all users in your system</Text>
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
                type={filterStatus === 0 ? "primary" : "default"} 
                onClick={() => {
                  setFilterStatus(0);
                  setPage(0); // Reset to first page when changing filter
                }}
                icon={<CheckCircleOutlined />}
                style={{ 
                  borderRadius: '50px', 
                  backgroundColor: filterStatus === 0 ? '#3b82f6' : '#f3f4f6',
                  borderColor: filterStatus === 0 ? '#3b82f6' : '#d1d5db',
                }}
              >
                Active Users
              </Button>
              <Button 
                type={filterStatus === 1 ? "primary" : "default"} 
                onClick={() => {
                  setFilterStatus(1);
                  setPage(0); // Reset to first page when changing filter
                }}
                icon={<CloseCircleOutlined />}
                style={{ 
                  borderRadius: '50px',
                  backgroundColor: filterStatus === 1 ? '#3b82f6' : '#f3f4f6',
                  borderColor: filterStatus === 1 ? '#3b82f6' : '#d1d5db',
                }}
              >
                Inactive Users
              </Button>
            </Space>
          </Col>
          <Col span={8}>
            <Input.Group compact>
              <Input
                placeholder="Search users..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
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

      {/* Users Table */}
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
              <Text type="secondary">Loading users data...</Text>
            </div>
          </div>
        ) : (
          <Table
            columns={userColumns}
            dataSource={users}
            rowKey="id"
            pagination={{
              // Removing the pagination display elements
              current: page + 1,
              pageSize: pageSize,
              total: totalUsers,
              onChange: (newPage, newPageSize) => {
                if (newPageSize !== pageSize) {
                  setPageSize(newPageSize || 10);
                  setPage(0); // Reset to first page when changing page size
                } else {
                  setPage(newPage - 1); // Convert back to 0-based indexing
                }
              },
              showSizeChanger: true,
              // Remove the showTotal property to eliminate the "1-10 of 10 users" text
              // showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} users`,
              style: { marginTop: 16 },
              // Hide the page numbers (including the "1" button)
              itemRender: (_, type) => {
                // Return null for page and prev/next buttons to hide them
                if (type === 'page' || type === 'prev' || type === 'next') {
                  return null;
                }
                // Still render other elements like the page size changer
                return undefined;
              }
            }}
          />
        )}
      </Card>

      {/* User Details Modal with Children */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {selectedUser?.avatar ? (
              <Avatar src={selectedUser.avatar} size={40} />
            ) : (
              <Avatar icon={<UserOutlined />} size={40} style={{ backgroundColor: '#3b82f6' }} />
            )}
            <span>User Details</span>
          </div>
        }
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          resetChildrenData();
        }}
        afterClose={resetChildrenData}
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
        {selectedUser && (
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
                {selectedUser?.avatar ? (
                  <Avatar src={selectedUser.avatar} size={80} />
                ) : (
                  <Avatar icon={<UserOutlined />} size={80} style={{ backgroundColor: '#3b82f6' }} />
                )}
                <Title level={3} style={{ 
                  margin: '12px 0 0', 
                  color: '#3b82f6' 
                }}>{selectedUser.name}</Title>
                {getStatusTag(selectedUser.status)}
              </div>
              
              <Divider style={{ 
                margin: '12px 0', 
                borderColor: '#e5e7eb' 
              }} />
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <Text type="secondary">Email</Text>
                  <div>{selectedUser.email}</div>
                </div>
                
                <div>
                  <Text type="secondary">ID</Text>
                  <div style={{ wordBreak: 'break-all' }}>{selectedUser.id}</div>
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
                <Text strong style={{ color: '#3b82f6' }}>Children</Text>
              }
            >
              {isChildrenLoading ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <Spin size="large" />
                  <div style={{ marginTop: 16 }}>
                    <Text type="secondary">Loading children data...</Text>
                  </div>
                </div>
              ) : (
                children.length > 0 ? (
                  <Table
                    columns={childColumns}
                    dataSource={children}
                    rowKey="id"
                    pagination={false}
                  />
                ) : (
                  <div style={{ textAlign: 'center', padding: '24px 0' }}>
                    <Text type="secondary">No children found for this user</Text>
                  </div>
                )
              )}
            </Card>
          </>
        )}
      </Modal>
    </div>
  );
};

export default UsersPage;