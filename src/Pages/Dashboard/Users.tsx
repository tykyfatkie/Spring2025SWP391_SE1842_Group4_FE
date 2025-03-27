import { useEffect, useState } from "react";
import { Table, Avatar, Tag, Space, Typography, message, Spin, Input, Button, Modal } from "antd";
import { UserOutlined, SearchOutlined, EyeOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import type { TableProps } from "antd";

const { Text } = Typography;

// ============ ĐỊNH NGHĨA KIỂU DỮ LIỆU ============
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: number;
  // Thêm các trường khác nếu API trả về thêm
}

interface Child {
  id: string;
  name: string;
  doB?: string; // Ngày sinh (optional)
  gender?: string; // Giới tính (optional)
}

type UserStatus = 0 | 1 | 2 | 4; // Các trạng thái người dùng theo API

// ============ COMPONENT CHÍNH ============
const UsersPage = () => {
  // ============ STATE ============
  const [users, setUsers] = useState<User[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isChildrenLoading, setIsChildrenLoading] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [filterStatus, setFilterStatus] = useState<number>(3);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  // ============ API CALLS ============
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = {
        SearchKeyword: searchKeyword || undefined,
        Page: page - 1,
        PageSize: 20,
        Status: filterStatus,
        RoleIds: "00000000-0000-0000-0000-000000000004",
      };

      const response = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}/users/all`, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(response.data.data.data || []);
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
  }, [page, filterStatus]);

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

  const handleDeactivateUser = async (userId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${import.meta.env.VITE_API_ENDPOINT}/users/status/${userId}`,
        { status: 0 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.success) {
        message.success("User deactivated successfully");
        fetchUsers();
      } else {
        message.error("Failed to deactivate user");
      }
    } catch (error: any) {
      message.error("Failed to deactivate user: " + (error.response?.data?.message || error.message));
    }
  };

  // ============ HELPER FUNCTIONS ============
  const getStatusTag = (status: UserStatus) => {
    switch (status) {
      case 0:
        return <Tag color="green">Active</Tag>;
      case 1:
        return <Tag color="red">Inactive</Tag>;
      case 2:
        return <Tag color="gray">Archived</Tag>;
      case 4:
        return <Tag color="orange">Not Verified</Tag>;
      default:
        return <Tag color="default">Unknown</Tag>;
    }
  };

  // ============ TABLE COLUMNS CONFIG ============
  const userColumns: TableProps<User>['columns'] = [
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar?: string) => avatar ? <Avatar src={avatar} /> : <Avatar icon={<UserOutlined />} />,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: User) => (
        <Text strong style={{ cursor: "pointer" }} onClick={() => handleViewUser(record)}>
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
            shape="circle"
          />
          {(record.status === 0 || record.status === 1 || record.status === 4) && (
            <Button
              icon={<ExclamationCircleOutlined />}
              type="default"
              danger
              onClick={() => handleDeactivateUser(record.id)}
              shape="circle"
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
    },
  ];

  // ============ RENDER ============
  return (
    <div>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "right", gap: "10px" }}>
        <Button type={filterStatus === 0 ? "primary" : "default"} onClick={() => setFilterStatus(0)} icon={<UserOutlined />}>
          Active Users
        </Button>
        <Button type={filterStatus === 1 ? "primary" : "default"} onClick={() => setFilterStatus(1)} icon={<ExclamationCircleOutlined />}>
          Inactive Users
        </Button>
        <Input
          placeholder="Search users..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          allowClear
          style={{ width: 250 }}
        />
        <Button type="primary" icon={<SearchOutlined />} onClick={fetchUsers}>
          Search
        </Button>
      </div>

      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
      ) : (
        <Table
          columns={userColumns}
          dataSource={users}
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
        title={`Children of ${selectedUser?.name || 'User'}`}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          resetChildrenData();
        }}
        afterClose={resetChildrenData}
        footer={null}
        width={800}
      >
        {isChildrenLoading ? (
          <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
        ) : (
          <Table
            columns={childColumns}
            dataSource={children}
            rowKey="id"
            pagination={false}
          />
        )}
      </Modal>
    </div>
  );
};

export default UsersPage;