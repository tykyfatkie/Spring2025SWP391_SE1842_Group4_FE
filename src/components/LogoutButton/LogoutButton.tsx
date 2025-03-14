import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { LogoutOutlined } from "@ant-design/icons";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.clear(); 

    navigate("/login");
  };

  return (
    <Button type="primary" danger icon={<LogoutOutlined />} onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;

