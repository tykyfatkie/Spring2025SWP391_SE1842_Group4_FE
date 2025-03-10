import { useEffect, useState } from "react";
import { Table, Avatar, Tag, Space, Typography, message, Spin, Input, Button } from "antd";
import { UserOutlined, SearchOutlined, EyeOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [roleIds, setRoleIds] = useState(["00000000-0000-0000-0000-000000000001"]);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const params = {
        SearchKeyword: searchKeyword || undefined,
        Page: page,
        PageSize: pageSize,
        RoleIds: roleIds.length > 0 ? roleIds : undefined
      };

      const response = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}/users/all`, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = response.data.data.data;
      setUsers(Array.isArray(userData) ? userData : []);

    } catch (error) {
      message.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, pageSize]);

  // Function to handle viewing a user's children
  const handleViewChildren = (userId) => {
    localStorage.setItem("parentId", userId);
    navigate("/my-admin/children-view");
  };

  const columns = [
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar) =>
        avatar ? (
          <Avatar src={avatar} />
        ) : (
          <Avatar icon={<UserOutlined />} />
        ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <a onClick={() => handleViewChildren(record.id)}>
          <Text strong>{text}</Text>
        </a>
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
      render: (status) => (
        <Tag color={status === 3 ? "green" : "red"}>
          {status === 3 ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              handleViewChildren(record.id);
            }}
            type="primary"
            ghost
          >
            View Children
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: "flex", gap: "10px" }}>
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
          columns={columns}
          dataSource={users}
          rowKey="id"
          onRow={(record) => ({
            onClick: () => handleViewChildren(record.id),
            style: { cursor: 'pointer' }
          })}
          pagination={{
            current: page + 1,
            pageSize,
            onChange: (page) => setPage(page - 1),
            showSizeChanger: true,
            pageSizeOptions: ["6", "10", "20"],
            onShowSizeChange: (_, size) => setPageSize(size),
          }}
        />
      )}
    </div>
  );
};

export default UsersPage;