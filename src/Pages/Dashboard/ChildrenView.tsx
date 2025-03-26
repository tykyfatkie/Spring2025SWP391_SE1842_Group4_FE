import { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, message, Spin, Typography, Input, Card, Space, Tag } from "antd";
import { SearchOutlined, InfoCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const ChildrenList = () => {
  const [children, setChildren] = useState([]);
  const [filteredChildren, setFilteredChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchChildrenByParent();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [children, searchText]);

  const fetchChildrenByParent = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const parentId = localStorage.getItem("parentId"); // Using parentId as parentId
      
      if (!token) {
        message.error("Authentication token is missing. Please login again.");
        navigate("/login");
        return;
      }
      
      if (!parentId) {
        message.error("Parent ID is missing. Please login again.");
        navigate("/login");
        return;
      }
      
      const response = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/children/getChildByParent`,
        {
          params: { parentId },
          headers: {
            'Authorization': `Bearer ${token}`, // Thêm token vào headers
            'Content-Type': 'application/json',
            'Accept': '*/*'
          }
        }
      );

      if (response.status === 200 && response.data) {
        setChildren(response.data.data || []);
        setFilteredChildren(response.data.data || []);
      }
    } catch (error : any) {
      console.error("Error fetching children:", error);
      
      if (error.response?.status === 401) {
        message.error("Your session has expired. Please login again.");
        localStorage.clear();
        navigate("/login");
      } else {
        message.error("Failed to fetch children data. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...children];
    
    // Apply text search filter
    if (searchText) {
      result = result.filter(child => 
        child.fullName?.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    setFilteredChildren(result);
  };

  const viewChildDetails = (childId : any) => {
    navigate(`/children/${childId}`);
  };

  const columns = [
    {
      title: "Tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Ngày sinh",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      render: (text : any) => text ? moment(text).format("DD/MM/YYYY") : "N/A",
    },
    {
      title: "Phụ huynh",
      dataIndex: "parentName",
      key: "parentName",
      render: (text : any) => text || "N/A"
    },
    {
      title: "Nhóm máu",
      dataIndex: "bloodType",
      key: "bloodType",
      render: (text : any) => text || "N/A",
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_ : any, record : any) => (
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
