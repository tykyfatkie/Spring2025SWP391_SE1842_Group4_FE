import React, { useState, useEffect } from "react";
import { Layout, Menu, Row, Col, Space, Typography, Button, Dropdown, Avatar } from "antd";
import { InfoCircleOutlined, UserOutlined, GiftOutlined, LogoutOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const { Header } = Layout;

const AppHeader: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedKey, setSelectedKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [hover, setHover] = useState(false);
  const [userName, setUserName] = useState<string>("");
  
  const primaryBlue = "#0066CC";

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    const path = location.pathname;

    const mainNavPages = ["/home", "/contact-us", "/doctor", "/child-manage"];
    if (!mainNavPages.some(page => path.includes(page))) {
      setSelectedKey("");
    } else {
      if (path.includes("/home")) setSelectedKey("home");
      else if (path.includes("/contact-us")) setSelectedKey("contact");
      else if (path.includes("/child-manage")) setSelectedKey("child");
    }
  }, [location]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "*/*",
          },
        });
        setUserName(response.data.data.userName);
      } catch (error) {
        console.error("Failed to load user profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleLogoClick = () => navigate("/home");

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    document.cookie.split(";").forEach((cookie) => {
      document.cookie = cookie.replace(/^ +/, "").replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
    });
    setIsAuthenticated(false);
    navigate("/login");
  };

  const menuItemBaseStyle = {
    padding: "10px 16px",
    margin: "4px 0",
    borderRadius: "6px", 
    fontSize: "16px",
    fontFamily: "SoDoSans, sans-serif",
    transition: "all 0.2s ease",
  };

  const userMenu = (
    <Menu
      style={{
        padding: "8px",
        borderRadius: "8px",
        boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
        width: "180px",
        border: "1px solid #f0f0f0"
      }}
    >
      <div style={{ padding: "8px 16px", borderBottom: "1px solid #f0f0f0", marginBottom: "4px" }}>
        <Typography.Text strong style={{ fontSize: "14px", color: "#666" }}>
          Account Options
        </Typography.Text>
      </div>
      
      <Menu.Item 
        key="profile" 
        onClick={() => navigate("/profile")}
        icon={<UserOutlined style={{ color: primaryBlue }} />}
        style={{ 
          ...menuItemBaseStyle,
          color: "#333",
        }}
        className="menu-item-hover"
      >
        Profile
      </Menu.Item>

      <Menu.Item 
        key="about" 
        onClick={() => navigate("/about-us")}
        icon={<InfoCircleOutlined style={{ color: primaryBlue }} />}
        style={{ 
          ...menuItemBaseStyle,
          color: "#333",
        }}
        className="menu-item-hover"
      >
        About
      </Menu.Item>
      
      <Menu.Item 
        key="security" 
        onClick={() => navigate("/security")}
        icon={<InfoCircleOutlined style={{ color: primaryBlue }} />}
        style={{ 
          ...menuItemBaseStyle,
          color: "#333",
        }}
        className="menu-item-hover"
      >
        Security
      </Menu.Item>
      
      <div style={{ borderTop: "1px solid #f0f0f0", margin: "4px 0" }}></div>
      
      <Menu.Item 
        key="logout" 
        danger 
        onClick={handleLogout}
        icon={<LogoutOutlined />}
        style={{ 
          ...menuItemBaseStyle,
          color: "rgba(255, 0, 0, 0.7)", 
          background: hover ? "rgba(255, 0, 0, 0.1)" : "transparent",
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        Logout
      </Menu.Item>
    </Menu>
  );

  const menuItemStyle = (key: string): React.CSSProperties => ({
    cursor: "pointer", 
    color: selectedKey === key ? primaryBlue : "#000",
    fontSize: "18px",
    fontWeight: 600,
    fontFamily: "SoDoSans, sans-serif",
    textTransform: "uppercase",
    height: "80px",
    display: "flex",
    alignItems: "center",
    borderBottom: selectedKey === key ? `4px solid ${primaryBlue}` : "none",
    transition: "color 0.3s ease"
  });

  return (
    <>
      <style>
        {`
          .menu-item-hover:hover {
            background-color: rgba(0, 102, 204, 0.05);
            color: ${primaryBlue} !important;
          }
          
          .logout-item-hover:hover {
            background-color: rgba(255, 77, 79, 0.05);
            color: #ff4d4f !important;
          }
          
          .ant-menu-item-selected {
            background-color: transparent !important;
          }
          
          /* Thêm các quy tắc CSS để đảm bảo header luôn cố định */
          .sticky-header {
            position: fixed !important;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            width: 100%;
            transition: all 0.3s ease;
          }
          
          /* Thêm padding-top cho body để tránh nội dung bị che khuất bởi header cố định */
          body {
            padding-top: 80px;
          }
        `}
      </style>
    
      <Header className="sticky-header" style={{ 
        background: "#fff", 
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)", 
        padding: "0 40px", 
        height: "80px", 
        lineHeight: "80px",
        fontFamily: "SoDoSans, sans-serif", 
      }}>
        <Row justify="space-between" align="middle" style={{ height: "100%" }}>
          <Col style={{ display: "flex", alignItems: "center" }}>
            <div onClick={handleLogoClick} style={{ cursor: "pointer", marginRight: "10px" }}>
              <img 
                src="src/assets/child.png" 
                alt="Logo" 
                style={{ height: 55 }} 
              />
            </div>
            
            <div style={{ display: "flex", gap: "30px", marginLeft: "45px" }}> 
              <div 
                style={menuItemStyle("home")}
                onClick={() => navigate("/")}
                onMouseEnter={(e) => e.currentTarget.style.color = primaryBlue}
                onMouseLeave={(e) => e.currentTarget.style.color = selectedKey === "home" ? primaryBlue : "#000"}
              >
                Home
              </div>
              <div 
                style={menuItemStyle("contact")}
                onClick={() => navigate("/contact-us")}
                onMouseEnter={(e) => e.currentTarget.style.color = primaryBlue}
                onMouseLeave={(e) => e.currentTarget.style.color = selectedKey === "contact" ? primaryBlue : "#000"}
              >
                Contact
              </div>
              <div 
                style={menuItemStyle("doctor")}
                onClick={() => navigate("/doctor")}
                onMouseEnter={(e) => e.currentTarget.style.color = primaryBlue}
                onMouseLeave={(e) => e.currentTarget.style.color = selectedKey === "doctor" ? primaryBlue : "#000"}
              >
                Doctor
              </div>
              <div 
                style={menuItemStyle("child")}
                onClick={() => navigate("/child-manage")}
                onMouseEnter={(e) => e.currentTarget.style.color = primaryBlue}
                onMouseLeave={(e) => e.currentTarget.style.color = selectedKey === "child" ? primaryBlue : "#000"}
              >
                Your Child
              </div>
            </div>
          </Col>

          <Col>
            <Space size="middle">
              {isAuthenticated ? (
                <>
                  <Button
                    type="primary"
                    icon={<GiftOutlined />}
                    style={{ 
                      fontWeight: 600, 
                      backgroundColor: "#FF6B00", 
                      borderRadius: "40px",
                      border: "none",
                      fontSize: "18px",
                      fontFamily: "SoDoSans, sans-serif",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                      marginRight: "15px"
                    }}
                    onClick={() => navigate("/package")}
                  >
                    Packages
                  </Button>
                  <span style={{ fontSize: "16px", fontWeight: 500 }}>
                    Welcome back,{" "}
                    <span style={{ color: "#1e90ff" }}>{userName}</span>
                  </span>          
                  <Dropdown overlay={userMenu} trigger={["click"]}>
                    <Avatar 
                      icon={<UserOutlined />} 
                      style={{ 
                        cursor: "pointer", 
                        backgroundColor: primaryBlue
                      }}
                      size={40}  
                    />
                  </Dropdown>
                </>
              ) : (
                <>
                  <Button
                    type="primary"
                    icon={<GiftOutlined />}
                    style={{ 
                      fontWeight: 600, 
                      backgroundColor: "#FF6B00", 
                      borderRadius: "40px",
                      border: "none",
                      fontSize: "18px",
                      fontFamily: "SoDoSans, sans-serif",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                      marginRight: "15px"
                    }}
                    onClick={() => navigate("/package")}
                  >
                    Packages
                  </Button>
                  
                  <Button 
                    type="text" 
                    style={{ 
                      fontWeight: 600, 
                      borderRadius: "40px", 
                      color: "#000",
                      fontSize: "18px", 
                      fontFamily: "SoDoSans, sans-serif" 
                    }}
                    onClick={() => navigate("/login")}
                  >
                    Sign in
                  </Button>
                  <Button 
                    type="primary" 
                    style={{ 
                      fontWeight: 600, 
                      backgroundColor: primaryBlue, 
                      borderRadius: "40px",
                      border: "none",
                      fontSize: "18px", 
                      fontFamily: "SoDoSans, sans-serif", 
                      height: "40px", 
                      display: "flex",
                      alignItems: "center"
                    }}
                    onClick={() => navigate("/register")}
                  >
                    Join now
                  </Button>
                </>
              )}
            </Space>
          </Col>
        </Row>
      </Header>
    </>
  );
};

export default AppHeader;