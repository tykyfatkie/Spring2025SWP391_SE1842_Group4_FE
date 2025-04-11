import { useState } from "react";
import { Layout, Menu, Typography, Avatar, Button, Space } from "antd";
import { 
  UserOutlined, 
  CrownOutlined, 
  DollarOutlined, 
  MedicineBoxOutlined,
  DashboardOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BarChartOutlined
} from "@ant-design/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton/LogoutButton";

const { Sider, Content, Header } = Layout;
const { Title, Text } = Typography;

const DefaultLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      key: "/my-admin/dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard"
    },
    {
      key: "/my-admin/revenue",
      icon: <DollarOutlined />,
      label: "Revenue"
    },
    {
      key: "/my-admin/users",
      icon: <UserOutlined />,
      label: "Users"
    },
    {
      key: "/my-admin/doctors",
      icon: <MedicineBoxOutlined />,
      label: "Doctors"
    },
    {
      key: "/my-admin/bmi",
      icon: <BarChartOutlined /> ,
      label: "BMI"
    },
    {
      key: "/my-admin/packages",
      icon: <CrownOutlined />,
      label: "Packages"
    }
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider 
        collapsible 
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={250}
        style={{
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          background: 'white',
          overflow: 'auto',
          height: '100vh',
          position: 'sticky',
          top: 0,
          left: 0,
        }}
      >
        <div
          style={{
            padding: collapsed ? '16px 8px' : '16px',
            margin: '16px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            color: '#1e3a8a',
          }}
        >
          {!collapsed && (
            <Title level={4} style={{ margin: 0, color: '#1e3a8a' }}>
              Child Growth
            </Title>
          )}
          {collapsed && (
            <Avatar style={{ background: '#1e3a8a', color: 'white' }} size="large">
              CG
            </Avatar>
          )}
        </div>

        {/* Menu Sidebar */}
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={(e) => navigate(e.key)}
          style={{ 
            background: 'white',
            borderRight: 'none',
          }}
          theme="light"
          items={menuItems}
        />

        <div style={{ 
          padding: '16px', 
          position: 'absolute', 
          bottom: '70px', 
          width: '100%',
          textAlign: collapsed ? 'center' : 'left'
        }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {!collapsed && (
              <div style={{ width: '100%' }}>
                <LogoutButton />
              </div>
            )}
          </Space>
        </div>
      </Sider>

      {/* Main Layout */}
      <Layout>
        {/* Header */}
        <Header
          style={{
            background: 'white',
            padding: '0 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '64px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            position: 'sticky',
            top: 0,
            zIndex: 1,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              color: '#1e3a8a',
            }}
          />
          
          <Space>
            <Avatar style={{ background: '#1e3a8a', color: 'white' }}>A</Avatar>
            <Text strong style={{ color: '#1e3a8a' }}>Admin</Text>
          </Space>
        </Header>

        <Content style={{ 
          padding: '24px', 
          margin: '24px', 
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          minHeight: 'auto'
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default DefaultLayout;