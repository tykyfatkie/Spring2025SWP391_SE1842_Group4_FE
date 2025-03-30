import React, { useState, useEffect } from 'react';
import { Layout, Menu, Typography, Avatar, Divider } from 'antd';
import { 
  UserOutlined, 
  MessageOutlined,
  HomeOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const { Sider } = Layout;
const { Text } = Typography;

interface DoctorProfile {
  certificate: string;
  licenseNumber: string;
  biography: string;
  metadata: string;
  specialize: string;
  profileImg: string;
  status: number;
  userId: string;
  hospital?: string;
  user?: {
    name: string;
    userName: string;
    email: string;
    phone?: string;
    address?: string;
  };
}

const DoctorSidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        
        if (!token || !userId) {
          throw new Error("Unauthorized: Please log in");
        }
  
        const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/doctors/doctorprofile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const result = await response.json();
        if (!result.data) {
          throw new Error("No doctor profile found");
        }
  
        setDoctor(result.data);
      } catch (error: any) {
        console.error('Failed to fetch doctor profile:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorProfile();
  }, []);

  // Handle logout
  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.includes('consultation-response')) return 'consultation-response';
    if (path.includes('consultation-request')) return 'consultation-request';
    if (path.includes('appointments')) return 'appointments';
    if (path.includes('medical-records')) return 'medical-records';
    if (path.includes('profile')) return 'profile';
    return 'dashboard';
  };

const siderStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: 'linear-gradient(135deg, rgba(110, 0, 168, 0.95) 0%, rgba(185, 0, 209, 0.88) 100%)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  borderRight: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
  position: 'relative' as const,
  zIndex: 1000,
};


  const menuItemStyle = {
    margin: '8px 0',
    borderRadius: collapsed ? '50%' : '12px',
    transition: 'all 0.3s ease',
  };


  const doctorName = doctor?.user?.name || 'Dr. Unknown';
  const doctorSpecialty = doctor?.specialize || 'Doctor';
  const avatarUrl = doctor?.profileImg || null;

  return (
    <Sider 
      collapsible 
      collapsed={collapsed} 
      onCollapse={(value) => setCollapsed(value)}
      width={280} 
      theme="dark"
      style={siderStyle}
      breakpoint="lg"
      collapsedWidth={80}
    >
      {/* Doctor Profile Section */}
      <div style={{ 
        padding: collapsed ? '16px 0' : '24px 16px', 
        textAlign: 'center',
        transition: 'all 0.3s ease'
      }}>
        <Avatar 
          size={collapsed ? 50 : 80} 
          icon={<UserOutlined />} 
          src={avatarUrl}
          style={{ 
            backgroundColor: '#fff', 
            color: '#6e00a8',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
          }} 
        />
        
        {!collapsed && (
          <div style={{ marginTop: 16 }}>
            <Typography.Title level={5} style={{ color: '#fff', margin: 0 }}>
              {loading ? 'Loading...' : doctorName}
            </Typography.Title>
            <Text style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
              {loading ? '' : doctorSpecialty}
            </Text>
          </div>
        )}
      </div>

      <Divider style={{ 
        margin: '0 16px 16px', 
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        display: collapsed ? 'none' : 'block'
      }} />

      {/* Navigation Menu */}
      <Menu 
        theme="dark" 
        mode="inline" 
        selectedKeys={[getSelectedKey()]}
        style={{ 
          fontSize: '16px', 
          background: 'transparent',
          border: 'none' 
        }}
      >
        <Menu.Item 
          key="dashboard" 
          icon={<HomeOutlined />} 
          style={menuItemStyle}
        >
          <Link to="/my-doctor">Dashboard</Link>
        </Menu.Item>

        <Menu.Item 
          key="consultation-response" 
          icon={<MessageOutlined />}
          style={menuItemStyle}
        >
          <Link to="/my-doctor/consultation-response">Consultation Response</Link>
        </Menu.Item>


{/* 
        <Menu.Item 
          key="consultation-request" 
          icon={<FileTextOutlined />}
          style={menuItemStyle}
        >
          <Link to="/my-doctor/consultation-request">Consultation Request</Link>
        </Menu.Item>

        <Menu.Item 
          key="appointments" 
          icon={<CalendarOutlined />}
          style={menuItemStyle}
        >
          <Link to="/my-doctor/appointments">Appointments</Link>
        </Menu.Item>

        <Menu.Item 
          key="medical-records" 
          icon={<LineChartOutlined />}
          style={menuItemStyle}
        >
          <Link to="/my-doctor/medical-records">Medical Records</Link>
        </Menu.Item>

        <Menu.Item 
          key="profile" 
          icon={<UserOutlined />}
          style={menuItemStyle}
        >
          <Link to="/my-doctor">Profile</Link>
        </Menu.Item>

        <Menu.Item 
          key="settings" 
          icon={<SettingOutlined />}
          style={menuItemStyle}
        >
          <Link to="/my-doctor/settings">Settings</Link>
        </Menu.Item>
         */}


        {/* Logout Menu Item placed at the bottom of the menu */}
        <Menu.Item 
          key="logout" 
          icon={<LogoutOutlined />} 
          onClick={handleLogout}
          style={{
            ...menuItemStyle,
            marginTop: 'auto',
            color: 'rgba(255, 255, 255, 0.8)'
          }}
        >
          Logout
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default DoctorSidebar;