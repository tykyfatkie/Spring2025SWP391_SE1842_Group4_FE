import { useEffect, useState } from "react";
import { Table, Avatar, Tag, Space, Typography, message, Spin, Input, Button, Modal } from "antd";
import { UserOutlined, SearchOutlined, EyeOutlined, FileOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import axios from "axios";

const { Text } = Typography;

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isChildrenLoading, setIsChildrenLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [] = useState(10);
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

  const fetchChildrenByParentId = async (parentId : any) => {
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

  useEffect(() => {
    fetchUsers();
  }, [page, filterStatus]);

  const resetChildrenData = () => {
    setChildren([]);
  };

  const handleViewUser = async (user : any) => {
    setSelectedUser(user);
    setIsModalVisible(true);
    setIsChildrenLoading(true); // Đảm bảo hiển thị loading
    try {
      await fetchChildrenByParentId(user.id);
    } catch (error) {
      console.error("Error fetching children:", error);
    }
  };

  const handleDeactivateUser = async (userId : any) => {
    try {
      const token = localStorage.getItem("token");

      // Kiểm tra thông tin status từ backend
      console.log("Sending deactivation request for user:", userId);

      const response = await axios.patch(
        `${import.meta.env.VITE_API_ENDPOINT}/users/status/${userId}`,
        { status: 0 }, // Thử với status: 0 nếu API hiểu ngược lại
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("API Response:", response.data);

      if (response.data && response.data.success) {
        message.success("User deactivated successfully");
        fetchUsers(); // Làm mới danh sách user
      } else {
        message.error("Failed to deactivate user");
      }
    } catch (error : any) {
      console.error("Deactivate error:", error);
      message.error("Failed to deactivate user: " + (error.response?.data?.message || error.message));
    }
  };

  const getStatusTag = (status : any) => {
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
              render: (status : any) => getStatusTag(status),
            },
            {
              title: "Actions",
              key: "actions",
              align: "right",
              render: (_, record) => (
                <Space>
                  <Button
                    icon={<EyeOutlined />}
                    onClick={() => handleViewUser(record)}
                    type="primary"
                    shape="circle"
                  />
                  {record.status === 0 && (
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

      <Modal
        title={`Children of ${selectedUser?.name}`}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          resetChildrenData(); // Reset children khi đóng modal
        }}
        afterClose={resetChildrenData} // Đảm bảo reset sau khi modal đóng hoàn toàn
        footer={null}
        width={800}
      >
        {isChildrenLoading ? (
          <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
        ) : (
          <Table
            columns={[
              {
                title: "Name",
                dataIndex: "name",
                key: "name",
              },
              {
                title: "Date of birth", // Tiêu đề cột
                dataIndex: "doB", // Trường dữ liệu
                key: "doB",
                render: (doB) => {
                  // Định dạng ngày tháng năm thành DD/MM/YYYY
                  const date = new Date(doB);
                  const day = String(date.getDate()).padStart(2, '0'); // Đảm bảo 2 chữ số cho ngày
                  const month = String(date.getMonth() + 1).padStart(2, '0'); // Đảm bảo 2 chữ số cho tháng
                  const year = date.getFullYear(); // Năm
                  const formattedDate = `${day}/${month}/${year}`; // Định dạng DD/MM/YYYY
                  return <span>{formattedDate}</span>;
                },
              },
              {
                title: "Gender",
                dataIndex: "gender",
                key: "gender",
              },
            ]}
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