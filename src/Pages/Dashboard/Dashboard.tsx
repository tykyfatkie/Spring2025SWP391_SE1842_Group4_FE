import { useEffect, useState } from "react";
import { 
  Card, 
  Spin, 
  Typography, 
  Row, 
  Col,
  Statistic,
  Divider,
  Empty
} from "antd";
import { 
  AreaChartOutlined,
  TeamOutlined
} from "@ant-design/icons";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";

const { Text, Title } = Typography;

interface ProfitData {
  date: string;
  totalProfit: number;
}

interface UserRoleData {
  roleName: string;
  userCount: number;
}

interface ProfitApiResponse {
  data: ProfitData[];
  code: number;
  message: string;
}

interface UserRoleApiResponse {
  data: UserRoleData[];
  code: number;
  message: string;
}

// Colors for the pie chart
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const ProfitDashboard = () => {
  const [profitData, setProfitData] = useState<ProfitData[]>([]);
  const [userRoleData, setUserRoleData] = useState<UserRoleData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userRoleLoading, setUserRoleLoading] = useState<boolean>(true);
  const [totalProfit, setTotalProfit] = useState<number>(0);
  const [totalUsers, setTotalUsers] = useState<number>(0);

  const fetchProfitData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get<ProfitApiResponse>(`${import.meta.env.VITE_API_ENDPOINT}/user-packages/daily-profit`, {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "application/json",
        },
      });
      
      if (response.data && response.data.data) {
        const formattedData = response.data.data.map(item => ({
          ...item,
          date: new Date(item.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }),
          // Add a formatted amount for tooltip display
          formattedProfit: `${item.totalProfit.toLocaleString()} VND`
        }));
        
        setProfitData(formattedData);
        
        // Calculate total profit
        const total = formattedData.reduce((sum, item) => sum + item.totalProfit, 0);
        setTotalProfit(total);
      } else {
        console.error("Unexpected API response structure:", response.data);
        setProfitData([]);
      }
    } catch (error) {
      console.error("Error fetching profit data:", error);
      setProfitData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRoleData = async () => {
    setUserRoleLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get<UserRoleApiResponse>(`${import.meta.env.VITE_API_ENDPOINT}/users/user-count-by-role`, {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "application/json",
        },
      });
      
      if (response.data && response.data.data) {
        setUserRoleData(response.data.data);
        
        // Calculate total users
        const total = response.data.data.reduce((sum, item) => sum + item.userCount, 0);
        setTotalUsers(total);
      } else {
        console.error("Unexpected API response structure for user roles:", response.data);
        setUserRoleData([]);
      }
    } catch (error) {
      console.error("Error fetching user role data:", error);
      setUserRoleData([]);
    } finally {
      setUserRoleLoading(false);
    }
  };

  useEffect(() => {
    fetchProfitData();
    fetchUserRoleData();
  }, []);


  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ 
          backgroundColor: '#fff', 
          padding: '10px', 
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{payload[0].payload.date}</p>
          <p style={{ 
            margin: '5px 0 0', 
            color: '#3b82f6' 
          }}>
            Profit: {payload[0].payload.formattedProfit}
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for pie chart
  const PieChartTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ 
          backgroundColor: '#fff', 
          padding: '10px', 
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{payload[0].payload.roleName}</p>
          <p style={{ 
            margin: '5px 0 0', 
            color: payload[0].color 
          }}>
            Users: {payload[0].payload.userCount} ({((payload[0].payload.userCount / totalUsers) * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom label for pie chart - Fixed parameters to remove unused vars warning
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, payload
  }: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    payload: UserRoleData;
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {payload.roleName} ({payload.userCount})
      </text>
    );
  };

  return (
    <div style={{ 
      background: '#fff', 
      minHeight: '100vh',
      padding: 0, 
      margin: 0, 
      width: '100%', 
      overflow: 'hidden' 
    }}>
      {/* Header Section */}
      <Row align="middle" style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Title level={2} style={{ 
            marginBottom: 0, 
            color: '#3b82f6' 
          }}>Dashboard</Title>
          <Text type="secondary">Track profit trends and user statistics</Text>
        </Col>
      </Row>

      {/* Summary Stats Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12}>
          <Card 
            style={{ 
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              height: '100%'
            }}
          >
            <Statistic
              title={<Text strong style={{ fontSize: '16px', color: '#3b82f6' }}>Total Profit</Text>}
              value={totalProfit}
              suffix="VND"
              precision={0}
              valueStyle={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '24px' }}
              formatter={(value) => `${value.toLocaleString()}`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card 
            style={{ 
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              height: '100%'
            }}
          >
            <Statistic
              title={<Text strong style={{ fontSize: '16px', color: '#10b981' }}>Total Users</Text>}
              value={totalUsers}
              precision={0}
              valueStyle={{ color: '#10b981', fontWeight: 'bold', fontSize: '24px' }}
              formatter={(value) => `${value.toLocaleString()}`}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row gutter={16}>
        {/* Profit Chart Card */}
        <Col xs={24} lg={14} style={{ marginBottom: 24 }}>
  <Card
    title={
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <AreaChartOutlined style={{ color: '#3b82f6', marginRight: 8 }} />
        <Text strong style={{ fontSize: '16px' }}>Daily Profit Chart</Text>
      </div>
    }
    style={{ 
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#ffffff',
      border: '1px solid #e5e7eb',
      height: '100%',
    }}
  >
    {loading ? (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text type="secondary">Loading profit data...</Text>
        </div>
      </div>
    ) : profitData.length > 0 ? (
      <div style={{ width: '100%', height: 350 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={profitData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#6b7280' }}
              tickLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
              tick={{ fill: '#6b7280' }}
              tickLine={{ stroke: '#e5e7eb' }}
            />
            <RechartsTooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="totalProfit" 
              name="Profit (VND)"
              stroke="#ef4444" 
              strokeWidth={3}
              dot={{ r: 6, fill: '#ef4444', stroke: '#fff', strokeWidth: 2 }}
              activeDot={{ r: 8, fill: '#dc2626', stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    ) : (
      <Empty
        description="No profit data available"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        style={{ padding: '40px 0' }}
      />
    )}
  </Card>
</Col>

        {/* User Role Pie Chart */}
        <Col xs={24} lg={10} style={{ marginBottom: 24 }}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <TeamOutlined style={{ color: '#10b981', marginRight: 8 }} />
                <Text strong style={{ fontSize: '16px' }}>User Roles Distribution</Text>
              </div>
            }
            style={{ 
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              height: '100%'
            }}
          >
            {userRoleLoading ? (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <Spin size="large" />
                <div style={{ marginTop: 16 }}>
                  <Text type="secondary">Loading user role data...</Text>
                </div>
              </div>
            ) : userRoleData.length > 0 ? (
              <div style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={userRoleData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="userCount"
                    >
                      {userRoleData.map((_, i) => (
                        <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip content={<PieChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <Empty
                description="No user role data available"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                style={{ padding: '40px 0' }}
              />
            )}
          </Card>
        </Col>
      </Row>

      {/* Profit Details Card */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Text strong style={{ fontSize: '16px' }}>Profit Details</Text>
          </div>
        }
        style={{ 
          marginTop: 24,
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb'
        }}
      >
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" />
          </div>
        ) : profitData.length > 0 ? (
          <>
            {profitData.map((item, index) => (
              <div key={index}>
                <Row gutter={16} align="middle" style={{ padding: '12px 0' }}>
                  <Col span={12}>
                    <Text>{item.date}</Text>
                  </Col>
                  <Col span={12} style={{ textAlign: 'right' }}>
                    <Text strong style={{ color: '#3b82f6' }}>
                      {item.totalProfit.toLocaleString()} VND
                    </Text>
                  </Col>
                </Row>
                {index < profitData.length - 1 && (
                  <Divider style={{ margin: '0' }} />
                )}
              </div>
            ))}
          </>
        ) : (
          <Empty
            description="No profit data available"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ padding: '40px 0' }}
          />
        )}
      </Card>

      {/* User Role Details Card */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Text strong style={{ fontSize: '16px' }}>User Role Details</Text>
          </div>
        }
        style={{ 
          marginTop: 24,
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb'
        }}
      >
        {userRoleLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" />
          </div>
        ) : userRoleData.length > 0 ? (
          <>
            {userRoleData.map((item, index) => (
              <div key={index}>
                <Row gutter={16} align="middle" style={{ padding: '12px 0' }}>
                  <Col span={12}>
                    <Text>{item.roleName}</Text>
                  </Col>
                  <Col span={12} style={{ textAlign: 'right' }}>
                    <Text strong style={{ 
                      color: COLORS[index % COLORS.length]
                    }}>
                      {item.userCount} users ({((item.userCount / totalUsers) * 100).toFixed(1)}%)
                    </Text>
                  </Col>
                </Row>
                {index < userRoleData.length - 1 && (
                  <Divider style={{ margin: '0' }} />
                )}
              </div>
            ))}
          </>
        ) : (
          <Empty
            description="No user role data available"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ padding: '40px 0' }}
          />
        )}
      </Card>
    </div>
  );
};

export default ProfitDashboard;