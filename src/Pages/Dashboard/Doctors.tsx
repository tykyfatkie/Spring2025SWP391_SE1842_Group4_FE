import { useEffect, useState } from "react";
import { Table, Avatar, Tag, Space, Typography, message, Spin, Input, Button, Modal } from "antd";
import { UserOutlined, SearchOutlined, EyeOutlined, ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import type { TableColumnsType } from "antd";

const { Text } = Typography;

// ============ ĐỊNH NGHĨA KIỂU DỮ LIỆU ============
interface Doctor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  status: number;
  // Thêm các trường khác nếu API trả về thêm
}

type DoctorStatus = 0 | 1 | 2 | 4; // Các trạng thái của bác sĩ

// ============ COMPONENT CHÍNH ============
const DoctorsPage = () => {
  // ============ STATE ============
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [filterStatus, setFilterStatus] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isDoctorDetailModalVisible, setIsDoctorDetailModalVisible] = useState<boolean>(false);

  // ID vai trò bác sĩ trong hệ thống
  const DOCTOR_ROLE_ID = "00000000-0000-0000-0000-000000000003";

  // ============ API CALLS ============
  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = {
        SearchKeyword: searchKeyword || undefined,
        Page: page - 1,
        PageSize: pageSize,
        Status: filterStatus,
        RoleIds: DOCTOR_ROLE_ID,
      };

      const response = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}/users/all`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });

      setDoctors(response.data?.data?.data || []);
    } catch (error) {
      message.error("Failed to fetch doctors");
    } finally {
      setLoading(false);
    }
  };

  // ============ SIDE EFFECTS ============
  useEffect(() => {
    fetchDoctors();
  }, [page, filterStatus]);

  // ============ HANDLERS ============
  const showAddDoctorModal = () => {
    setIsModalVisible(true);
  };

  const handleViewDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsDoctorDetailModalVisible(true);
  };

  const handleDeactivateDoctor = async (doctorId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${import.meta.env.VITE_API_ENDPOINT}/users/status/${doctorId}`,
        { status: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data?.success) {
        message.success("Doctor deactivated successfully");
        fetchDoctors();
      } else {
        message.error("Failed to deactivate doctor");
      }
    } catch (error: any) {
      message.error("Failed to deactivate doctor: " + (error.response?.data?.message || error.message));
    }
  };

  // ============ HELPER FUNCTIONS ============
  const getStatusTag = (status: DoctorStatus) => {
    switch (status) {
      case 0: return <Tag color="green">Active</Tag>;
      case 1: return <Tag color="red">Inactive</Tag>;
      case 2: return <Tag color="gray">Archived</Tag>;
      case 4: return <Tag color="orange">Not Verified</Tag>;
      default: return <Tag color="default">Unknown</Tag>;
    }
  };

  // ============ TABLE CONFIG ============
  const columns: TableColumnsType<Doctor> = [
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar?: string) => avatar 
        ? <Avatar src={avatar} /> 
        : <Avatar icon={<UserOutlined />} />
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Doctor) => (
        <Text strong style={{ cursor: "pointer" }} onClick={() => handleViewDoctor(record)}>
          {text}
        </Text>
      )
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email"
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone"
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: DoctorStatus) => getStatusTag(status)
    },
    {
      title: "Actions",
      key: "actions",
      align: "right",
      render: (_: any, record: Doctor) => (
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
      )
    }
  ];

  // ============ RENDER ============
  return (
    <div>
      {/* Search and Filter Section */}
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={showAddDoctorModal}>
          Add Doctor
        </Button>

        <div style={{ display: "flex", gap: "10px" }}>
          <Button 
            type={filterStatus === 0 ? "primary" : "default"} 
            onClick={() => setFilterStatus(0)}
            icon={<UserOutlined />}
          >
            Active Doctors
          </Button>
          <Button 
            type={filterStatus === 1 ? "primary" : "default"} 
            onClick={() => setFilterStatus(1)}
            icon={<ExclamationCircleOutlined />}
          >
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

      {/* Doctors Table */}
      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
      ) : (
        <Table
          columns={columns}
          dataSource={doctors}
          rowKey="id"
          pagination={{
            current: page,
            pageSize: pageSize,
            onChange: (newPage) => setPage(newPage),
            showSizeChanger: false
          }}
        />
      )}

      {/* Add Doctor Modal */}
      <Modal
        title="Add New Doctor"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        {/* Form thêm bác sĩ mới sẽ được thêm ở đây */}
      </Modal>

      {/* Doctor Detail Modal */}
      <Modal
        title={`Doctor Details: ${selectedDoctor?.name || ''}`}
        open={isDoctorDetailModalVisible}
        onCancel={() => setIsDoctorDetailModalVisible(false)}
        footer={null}
      >
        {/* Chi tiết bác sĩ sẽ được thêm ở đây */}
      </Modal>
    </div>
  );
};

export default DoctorsPage;