import { useEffect, useState } from "react";
import { Table, Avatar, Tag, Space, Typography, message, Spin, Input, Button } from "antd";
import { UserOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import axios from "axios";

const { Text } = Typography;

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [page, setPage] = useState(0); 
  const [pageSize, setPageSize] = useState(10); 
  // Fix TypeScript error - removed type annotation
  const [roleIds, setRoleIds] = useState(["00000000-0000-0000-0000-000000000001"]); 

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
  
      console.log("API Response:", response.data);
      
      // Fix data extraction - access nested data structure
      const userData = response.data.data.data;
      setUsers(Array.isArray(userData) ? userData : []);
      
    } catch (error) {
      console.error("Fetch error:", error);
      message.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, pageSize]); // Removed searchKeyword to prevent automatic search on every keystroke
  
  // Add separate useEffect for debugging to see updated state
  useEffect(() => {
    console.log("Users State:", users);
  }, [users]);

  // Modify columns to match API response structure
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
      render: (text) => <Text strong>{text}</Text>,
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
          <a style={{ color: "#1677ff" }}>
            <EditOutlined /> Edit
          </a>
          <a style={{ color: "red" }}>
            <DeleteOutlined /> Delete
          </a>
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
          pagination={{
            current: page + 1, // Ant Design pagination starts from 1
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