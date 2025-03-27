import { useEffect, useState } from "react";
import { Layout, Menu, Switch, theme, ConfigProvider } from "antd";
import { UserOutlined,  BulbOutlined, CrownOutlined } from "@ant-design/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton/LogoutButton";

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
            <Menu.Item key="/my-admin/users" icon={<UserOutlined />}>
              Users
            </Menu.Item>
            <Menu.Item key="/my-admin/doctors" icon={<UserOutlined />}>
              Doctors
            </Menu.Item>
            {/* <Menu.Item key="/my-admin/settings" icon={<SettingOutlined />}>
              Settings
            </Menu.Item> */}
            <Menu.Item key="/my-admin/packages" icon={<CrownOutlined />}>
              Package
            </Menu.Item>
            </Menu>
              <div style={{ padding: "16px" }}>
            <LogoutButton />
</div>
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

          <Content style={{ padding: "16px" }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default DefaultLayout;