import React, { useState, useEffect } from "react";
import { Layout, Menu, Row, Col, Space, Typography, Button, Dropdown, Avatar } from "antd";
import {
  ContactsOutlined,
  CrownOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  LoginOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";

const { Header } = Layout;
const { Title } = Typography;

const AppHeader: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedKey, setSelectedKey] = useState("home");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    const path = location.pathname;
    if (path.includes("/home")) setSelectedKey("home");
    else if (path.includes("/contact-us")) setSelectedKey("contact");
    else if (path.includes("/child-create")) setSelectedKey("childs");
    else if (path.includes("/about-us")) setSelectedKey("about");
  }, [location]);

  const handleLogoClick = () => {
    navigate("/home");
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();

    document.cookie.split(";").forEach((cookie) => {
      document.cookie = cookie
        .replace(/^ +/, "")
        .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
    });

    setIsAuthenticated(false);
    navigate("/login");
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" onClick={() => navigate("/profile")}>
        Profile
      </Menu.Item>
      <Menu.Item key="logout" danger onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Header
      style={{
        background: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        padding: "0 24px",
        position: "sticky",
        top: 0,
        zIndex: 1,
        width: "100%",
      }}
    >
      <Row justify="space-between" align="middle" style={{ height: "100%" }}>
        {/* Logo */}
        <Col>
          <Space align="center" size={16} onClick={handleLogoClick} style={{ cursor: "pointer" }}>
            <Title
              level={4}
              style={{
                margin: 0,
                background: "linear-gradient(45deg, #1890ff, #722ed1)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Child Growth Tracking
            </Title>
          </Space>
        </Col>

        {/* Menu */}
        <Col flex="auto">
          <Menu
            mode="horizontal"
            selectedKeys={[selectedKey]}
            style={{
              border: "none",
              justifyContent: "center",
              marginRight: "40px",
              minWidth: "100px",
            }}
          >
            <Menu.Item key="home" icon={<HomeOutlined />}>
              <a href="/home">Home</a>
            </Menu.Item>
            <Menu.Item key="contact" icon={<ContactsOutlined />}>
              <a href="/contact-us">Contact Us</a>
            </Menu.Item>
            {isAuthenticated && (
              <Menu.Item key="childs" icon={<UserOutlined />}>
                <a href="/child-create">Your Childs</a>
              </Menu.Item>
            )}
            <Menu.Item key="about" icon={<InfoCircleOutlined />}>
              <a href="/about-us">About</a>
            </Menu.Item>
          </Menu>
        </Col>

        {/* Authentication Section */}
        <Col style={{ minWidth: "100px" }}>
          <Space size="middle">
            {/* Package Button (Always Visible) */}
            <Button
              style={{ color: "#faad14", borderColor: "#faad14" }}
              icon={<CrownOutlined style={{ color: "#faad14" }} />}
              onClick={() => navigate("/package")}
            >
              Package
            </Button>

            {isAuthenticated ? (
              <Dropdown overlay={userMenu} trigger={["click"]}>
                <Avatar icon={<UserOutlined />} style={{ cursor: "pointer" }} />
              </Dropdown>
            ) : (
              <>
                <Button type="primary" icon={<LoginOutlined />} href="/login">
                  Login
                </Button>
                <Button icon={<UserAddOutlined />} href="/register">
                  Register
                </Button>
              </>
            )}
          </Space>
        </Col>
      </Row>
    </Header>
  );
};

export default AppHeader;
