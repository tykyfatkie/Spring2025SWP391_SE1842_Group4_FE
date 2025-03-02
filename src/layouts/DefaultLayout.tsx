import { useEffect, useState } from "react";
import { Layout, Menu, Switch, theme, ConfigProvider } from "antd";
import { DashboardOutlined, UserOutlined, SettingOutlined, BulbOutlined } from "@ant-design/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const { Sider, Content, Header } = Layout;

const DefaultLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  return (
    <ConfigProvider theme={{ algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
      <Layout style={{ minHeight: "100vh" }}>
        {/* Sidebar */}
        <Sider collapsible theme={darkMode ? "dark" : "light"}>
          <div
            style={{
              height: "32px",
              margin: "16px",
              color: darkMode ? "#fff" : "#000",
              textAlign: "center",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            My Admin
          </div>

          {/* Menu Sidebar */}
          <Menu
            theme={darkMode ? "dark" : "light"}
            mode="inline"
            selectedKeys={[location.pathname]}
            onClick={(e) => navigate(e.key)}
          >
            <Menu.Item key="/dashboard" icon={<DashboardOutlined />}>
              Dashboard
            </Menu.Item>
            <Menu.Item key="/users" icon={<UserOutlined />}>
              Users
            </Menu.Item>
            <Menu.Item key="/settings" icon={<SettingOutlined />}>
              Settings
            </Menu.Item>
          </Menu>
        </Sider>

        {/* Main Layout */}
        <Layout>
          {/* Header */}
          <Header
            style={{
              background: darkMode ? "#333" : "#fff",
              padding: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "18px", fontWeight: "bold", color: darkMode ? "#fff" : "#000" }}>
              Admin Panel
            </span>
            <Switch
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              checkedChildren={<BulbOutlined />}
              unCheckedChildren={<BulbOutlined />}
            />
          </Header>

          {/* Nội dung */}
          <Content style={{ padding: "16px" }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default DefaultLayout;
