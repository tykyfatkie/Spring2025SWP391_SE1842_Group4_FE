import { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, message, Spin, Typography, Input, Card, Space } from "antd";
import { SearchOutlined, InfoCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import type { TableColumnsType } from "antd";

const { Title } = Typography;

// ============ ĐỊNH NGHĨA KIỂU DỮ LIỆU ============
interface Child {
  id: string;
  fullName?: string;
  gender?: string;
  dateOfBirth?: string;
  parentName?: string;
  bloodType?: string;
  // Các trường khác từ API nếu có
}

// ============ COMPONENT CHÍNH ============
const ChildrenList = () => {
  // ============ STATE ============
  const [children, setChildren] = useState<Child[]>([]);
  const [filteredChildren, setFilteredChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  const navigate = useNavigate();

  // ============ API CALLS ============
  const fetchChildrenByParent = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const parentId = localStorage.getItem("parentId");
      
      if (!token || !parentId) {
        message.error("Authentication required. Please login again.");
        navigate("/login");
        return;
      }
      
      const response = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/children/getChildByParent`,
        {
          params: { parentId },
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        const data: Child[] = response.data?.data || [];
        setChildren(data);
        setFilteredChildren(data);
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        message.error("Session expired. Please login again.");
        localStorage.clear();
        navigate("/login");
      } else {
        message.error("Failed to fetch children data. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ============ SIDE EFFECTS ============
  useEffect(() => {
    fetchChildrenByParent();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [children, searchText]);

  // ============ FILTERS ============
  const applyFilters = () => {
    let result = [...children];
    
    if (searchText) {
      result = result.filter(child => 
        child.fullName?.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    setFilteredChildren(result);
  };

  // ============ HANDLERS ============
  const viewChildDetails = (childId: string) => {
    navigate(`/children/${childId}`);
  };

  // ============ TABLE CONFIG ============
  const columns: TableColumnsType<Child> = [
    {
      title: "Tên",
      dataIndex: "fullName",
      key: "fullName",
      render: (text?: string) => text || "N/A"
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (text?: string) => text || "N/A"
    },
    {
      title: "Ngày sinh",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      render: (text?: string) => text ? moment(text).format("DD/MM/YYYY") : "N/A"
    },
    {
      title: "Phụ huynh",
      dataIndex: "parentName",
      key: "parentName",
      render: (text?: string) => text || "N/A"
    },
    {
      title: "Nhóm máu",
      dataIndex: "bloodType",
      key: "bloodType",
      render: (text?: string) => text || "N/A"
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: any, record: Child) => (
        <Button 
          icon={<InfoCircleOutlined />} 
          onClick={() => viewChildDetails(record.id)} 
          type="primary"
          ghost
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  // ============ RENDER ============
  return (
    <div style={{ padding: "20px" }}>
      <Card>
        <Title level={4}>Danh sách trẻ em</Title>
        
        <Space style={{ marginBottom: 16 }}>
          <Input
            placeholder="Tìm kiếm theo tên..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            allowClear
            prefix={<SearchOutlined />}
            style={{ width: 250 }}
          />
          
          <Button onClick={fetchChildrenByParent}>Làm mới</Button>
        </Space>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
            <Spin size="large" />
          </div>
        ) : (
          <Table
            dataSource={filteredChildren}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            locale={{ emptyText: 'Không tìm thấy dữ liệu' }}
          />
        )}
      </Card>
    </div>
  );
};

export default ChildrenList;
