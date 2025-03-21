import { useEffect, useState } from "react";
import { Table, Avatar, Tag, Space, Typography, message, Spin, Input, Button, Modal, Form } from "antd";
import { UserOutlined, SearchOutlined, EyeOutlined, ExclamationCircleOutlined, PlusOutlined, EyeInvisibleOutlined, EyeTwoTone, FileOutlined } from "@ant-design/icons";
import axios from "axios";

const { Text } = Typography;

const DoctorsPage = () => {
  // Các state khác giữ nguyên
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterStatus, setFilterStatus] = useState(0); // Mặc định hiển thị Active
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isDoctorDetailModalVisible, setIsDoctorDetailModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  // DOCTOR_ROLE_ID - giả định đây là ID vai trò của bác sĩ trong hệ thống
  // (Có thể cần điều chỉnh dựa trên hệ thống thực tế của bạn)
  const DOCTOR_ROLE_ID = "00000000-0000-0000-0000-000000000003"; 

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      // Cấu hình tham số dựa trên API users/all
      const params = {
        SearchKeyword: searchKeyword || undefined,
        Page: page - 1,
        PageSize: pageSize,
        Status: filterStatus,
        RoleIds: DOCTOR_ROLE_ID, // Tham số quan trọng để lọc ra chỉ bác sĩ
      };

      const response = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}/users/all`, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Giả sử cấu trúc dữ liệu trả về giống với API users
      if (response.data && response.data.data) {
        setDoctors(response.data.data.data || []);
      } else {
        setDoctors([]);
      }
    } catch (error) {
      console.error("Fetch doctors error:", error);
      message.error("Failed to fetch doctors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [page, filterStatus]); // Re-fetch khi page hoặc status thay đổi

  // Các phương thức khác giữ nguyên
  const showAddDoctorModal = () => {
    setIsModalVisible(true);
  };

  const handleViewDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    // Fetch thêm thông tin chi tiết nếu cần
    // fetchDoctorDetails(doctor.id);
    setIsDoctorDetailModalVisible(true);
  };

  const handleDeactivateDoctor = async (doctorId) => {
    try {
      const token = localStorage.getItem("token");
      console.log("Sending deactivation request for doctor:", doctorId);

      // Sử dụng API tương tự như user để cập nhật trạng thái
      const response = await axios.patch(
        `${import.meta.env.VITE_API_ENDPOINT}/users/status/${doctorId}`,
        { status: 1 }, // 1 là inactive
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.success) {
        message.success("Doctor deactivated successfully");
        fetchDoctors(); // Refresh danh sách
      } else {
        message.error("Failed to deactivate doctor");
      }
    } catch (error) {
      console.error("Deactivate error:", error);
      message.error("Failed to deactivate doctor: " + (error.response?.data?.message || error.message));
    }
  };

  // Các phương thức xử lý form, getStatusTag, và phần return giữ nguyên

  return (
    <div>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={showAddDoctorModal}>
          Add Doctor
        </Button>

        <div style={{ display: "flex", gap: "10px" }}>
          <Button type={filterStatus === 0 ? "primary" : "default"} onClick={() => setFilterStatus(0)} icon={<UserOutlined />}>
            Active Doctors
          </Button>
          <Button type={filterStatus === 1 ? "primary" : "default"} onClick={() => setFilterStatus(1)} icon={<ExclamationCircleOutlined />}>
            Inactive Doctors
          </Button>
          <Input
            placeholder="Search doctors..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            allowClear
            style={{ width: 250 }}
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={fetchDoctors}>
            Search
          </Button>
        </div>
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
                <Text strong style={{ cursor: "pointer" }} onClick={() => handleViewDoctor(record)}>
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
              title: "Phone",
              dataIndex: "phone",
              key: "phone",
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
                  <Button
                    icon={<EyeOutlined />}
                    onClick={() => handleViewDoctor(record)}
                    type="primary"
                    shape="circle"
                  />
                  {record.status === 0 && (
                    <Button
                      icon={<ExclamationCircleOutlined />}
                      type="default"
                      danger
                      onClick={() => handleDeactivateDoctor(record.id)}
                      shape="circle"
                    />
                  )}
                </Space>
              ),
            },
          ]}
          dataSource={doctors}
          rowKey="id"
          pagination={{
            current: page,
            pageSize: pageSize,
            onChange: (newPage) => setPage(newPage),
            showSizeChanger: false,
          }}
        />
      )}

      {/* Modal thêm bác sĩ mới và Modal chi tiết bác sĩ giữ nguyên */}
    </div>
  );
};

// getStatusTag helper function
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

export default DoctorsPage;