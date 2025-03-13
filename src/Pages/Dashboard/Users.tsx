import { useEffect, useState } from "react";
import { Table, Avatar, Tag, Space, Typography, message, Spin, Input, Button, Modal } from "antd";
import { UserOutlined, SearchOutlined, EyeOutlined, FileOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import axios from "axios";

const { Text } = Typography;

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterStatus, setFilterStatus] = useState(3);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = {
        SearchKeyword: searchKeyword || undefined,
        Page: page - 1,
        PageSize: 10,
        Status: filterStatus,
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

  useEffect(() => {
    fetchUsers();
  }, [page, filterStatus]);

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const handleDeactivateUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${import.meta.env.VITE_API_ENDPOINT}/users/deactivate/${userId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      message.success("User deactivated successfully");
      fetchUsers();
    } catch (error) {
      message.error("Failed to deactivate user");
    }
  };

  const getStatusTag = (status) => {
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

  return (
    <div>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "right", gap: "10px" }}>
        <Button type={filterStatus === 0 ? "primary" : "default"} onClick={() => setFilterStatus(0)} icon={<UserOutlined />}>
          Active Users
        </Button>
        <Button type={filterStatus === 1 ? "primary" : "default"} onClick={() => setFilterStatus(1)} icon={<ExclamationCircleOutlined />}>
          Inactive Users
        </Button>
        <Button type={filterStatus === 2 ? "primary" : "default"} onClick={() => setFilterStatus(2)} icon={<FileOutlined />}>
          Archived Users
        </Button>
        {/* <Button type={filterStatus === 4 ? "primary" : "default"} onClick={() => setFilterStatus(4)} icon={<EyeOutlined />}>
          Not Verified Users
        </Button> */}
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
          columns={[
            {
              title: "Avatar",
              dataIndex: "avatar",
              key: "avatar",
              render: (avatar) => avatar ? <Avatar src={avatar} /> : <Avatar icon={<UserOutlined />} />, 
            },
            {
              title: "Name",
              dataIndex: "name",
              key: "name",
              render: (text, record) => (
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
              render: (status) => getStatusTag(status),
            },
            {
              title: "Actions",
              key: "actions",
              align: "right",
              render: (_, record) => (
                <Space>
                  <Button icon={<EyeOutlined />} onClick={() => handleViewUser(record)} type="primary" ghost>
                    View Details
                  </Button>
                  {record.status === 0 && (
                    <Button type="default" danger onClick={() => handleDeactivateUser(record.id)}>
                      Deactivate
                    </Button>
                  )}
                </Space>
              ),
            },
          ]}
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
    </div>
  );
};

export default UsersPage;
