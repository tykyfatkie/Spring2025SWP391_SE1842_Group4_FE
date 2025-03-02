import { Table, Avatar, Tag, Space, Typography } from "antd";
import { UserOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { Text } = Typography;

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
    title: "Tên",
    dataIndex: "name",
    key: "name",
    render: (text) => <Text strong>{text}</Text>,
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    render: (email) => <Text>{email}</Text>,
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    render: (status) => (
      <Tag color={status === "active" ? "green" : "red"}>
        {status === "active" ? "Hoạt động" : "Không hoạt động"}
      </Tag>
    ),
  },
  {
    title: "Hành động",
    key: "actions",
    render: (_, record) => (
      <Space>
        <a style={{ color: "#1677ff" }}>
          <EditOutlined /> Sửa
        </a>
        <a style={{ color: "red" }}>
          <DeleteOutlined /> Xóa
        </a>
      </Space>
    ),
  },
];

const users = [
  {
    key: "1",
    avatar: "https://i.pravatar.cc/40",
    name: "Nguyễn Văn A",
    email: "a@example.com",
    status: "active",
  },
  {
    key: "2",
    avatar: "",
    name: "Trần Thị B",
    email: "b@example.com",
    status: "inactive",
  },
];

const UserPage = () => {
  return <Table columns={columns} dataSource={users} rowKey="key" />;
};

export default UserPage;
