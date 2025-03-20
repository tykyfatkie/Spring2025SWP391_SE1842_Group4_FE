import React, { useState, useEffect } from "react";
import { Layout, Menu, Row, Col, Space, Typography, Button, Dropdown, Avatar } from "antd";
import { HomeOutlined, ContactsOutlined, InfoCircleOutlined, UserOutlined, BulbFilled, GiftOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";

const { Header } = Layout;

const AppHeader: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedKey, setSelectedKey] = useState("home");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // Màu xanh dương chính
  const primaryBlue = "#0066CC";

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    const path = location.pathname;
    if (path.includes("/home")) setSelectedKey("home");
    else if (path.includes("/contact-us")) setSelectedKey("contact");
    else if (path.includes("/child-create")) setSelectedKey("childs");
    else if (path.includes("/about-us")) setSelectedKey("about");
    else if (path.includes("/child-manage")) setSelectedKey("child");
    else if (path.includes("/packages")) setSelectedKey("package");
  }, [location]);

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

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" onClick={() => navigate("/profile")}>
        Profile
      </Menu.Item>
      <Menu.Item key="security" onClick={() => navigate("/security")}>
        Security
      </Menu.Item>
      <Menu.Item key="logout" danger onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  // CSS cho menu item
  const menuItemStyle = (key: string) => ({
    cursor: "pointer", 
    color: selectedKey === key ? primaryBlue : "#000",
    fontSize: "18px", // Tăng kích thước chữ từ 16px lên 18px
    fontWeight: 600,
    fontFamily: "SoDoSans, sans-serif", // Thêm font SoDoSans
    textTransform: "uppercase",
    height: "80px", // Tăng chiều cao từ 72px lên 80px
    display: "flex",
    alignItems: "center",
    borderBottom: selectedKey === key ? `4px solid ${primaryBlue}` : "none",
    transition: "color 0.3s ease",
    "&:hover": {
      color: primaryBlue
    }
  });

  return (
    <Header style={{ 
      background: "#fff", 
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)", 
      padding: "0 40px", 
      height: "80px", // Tăng chiều cao từ 72px lên 80px
      lineHeight: "80px", // Tăng line-height từ 72px lên 80px
      position: "sticky", 
      top: 0, 
      zIndex: 1000,
      fontFamily: "SoDoSans, sans-serif", // Thêm font SoDoSans
    }}>
      <Row justify="space-between" align="middle" style={{ height: "100%" }}>
        {/* Logo */}
        <Col style={{ display: "flex", alignItems: "center" }}>
          <div onClick={handleLogoClick} style={{ cursor: "pointer", marginRight: "10px" }}>
            <img 
              src="src/assets/child.png" 
              alt="Logo" 
              style={{ height: 55 }} // Tăng kích thước logo một chút
            />
          </div>
          
          {/* Navigation Menu - Sát logo */}
          <div style={{ display: "flex", gap: "30px", marginLeft: "45px" }}> {/* Tăng khoảng cách giữa các mục */}
            <div 
              style={menuItemStyle("home")}
              onClick={() => navigate("/home")}
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
              style={menuItemStyle("about")}
              onClick={() => navigate("/about-us")}
              onMouseEnter={(e) => e.currentTarget.style.color = primaryBlue}
              onMouseLeave={(e) => e.currentTarget.style.color = selectedKey === "about" ? primaryBlue : "#000"}
            >
              About
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

        {/* Authentication Section */}
        <Col>
          <Space size="middle">
            {isAuthenticated ? (
              <>
                {/* Package Button cho người dùng đã đăng nhập */}
                <Button
                  type="primary"
                  icon={<GiftOutlined />}
                  style={{ 
                    fontWeight: 600, 
                    backgroundColor: "#FF6B00", // Màu cam nổi bật cho nút Package
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
                
                <Dropdown overlay={userMenu} trigger={["click"]}>
                  <Avatar 
                    icon={<UserOutlined />} 
                    style={{ 
                      cursor: "pointer", 
                      backgroundColor: primaryBlue,
                      size: 40 // Tăng kích thước avatar
                    }} 
                  />
                </Dropdown>
              </>
            ) : (
              <>
                {/* Package Button cho người dùng chưa đăng nhập */}
                <Button
                  type="primary"
                  icon={<GiftOutlined />}
                  style={{ 
                    fontWeight: 600, 
                    backgroundColor: "#FF6B00", // Màu cam nổi bật cho nút Package
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
                    fontSize: "18px", // Tăng kích thước chữ
                    fontFamily: "SoDoSans, sans-serif" // Thêm font SoDoSans
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
                    fontSize: "18px", // Tăng kích thước chữ
                    fontFamily: "SoDoSans, sans-serif", // Thêm font SoDoSans
                    height: "40px", // Tăng chiều cao button
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
  );
};

export default AppHeader;