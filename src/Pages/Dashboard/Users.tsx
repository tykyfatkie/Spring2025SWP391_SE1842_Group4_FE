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
  const [roleIds, setRoleIds] = useState<string[]>(["00000000-0000-0000-0000-000000000001"]); 


  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
  
      const params: any = {
        SearchKeyword: searchKeyword || undefined, 
        Page: page,
        PageSize: pageSize,
      };
  
      if (roleIds.length > 0) params.RoleIds = roleIds; 
      if (status !== undefined && status !== "") params.status = status;
  
      const response = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}/users/all`, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log("API Response:", response.data);
      setUsers(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error: any) {
      message.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };
  
  

  useEffect(() => {
    fetchUsers();
  }, [searchKeyword, page, pageSize]); 

  const columns = [
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar: string) =>
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
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email: string) => <Text>{email}</Text>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status === "active" ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
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
      {/* Search Filter */}
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
