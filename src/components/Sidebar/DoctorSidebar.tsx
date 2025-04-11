import React, { useState, useEffect } from 'react';
import { Layout, Menu, Typography, Avatar, Divider } from 'antd';
import { 
  UserOutlined, 
  MessageOutlined,
  LogoutOutlined,
  ArrowRightOutlined 
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
    return 'profile'; // Changed default from dashboard to profile
  };

  // Updated sidebar style to match homepage gradient
  const siderStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, rgb(30, 58, 138) 0%, rgb(59, 130, 246) 100%)',
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
      {/* Doctor Profile Section with enhanced styling */}
      <div style={{ 
        padding: collapsed ? '16px 0' : '24px 16px', 
        textAlign: 'center',
        transition: 'all 0.3s ease'
      }}>
        <div style={{
          width: collapsed ? '50px' : '100px',
          height: collapsed ? '50px' : '100px',
          borderRadius: '50%',
          overflow: 'hidden',
          margin: '0 auto',
          border: '4px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
        }}>
          <Avatar 
            size={collapsed ? 42 : 92} 
            icon={<UserOutlined />} 
            src={avatarUrl}
            style={{ 
              backgroundColor: '#fff', 
              color: '#1e3a8a',
            }} 
          />
        </div>
        
        {!collapsed && (
          <div style={{ marginTop: 16 }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '20px',
              padding: '4px 12px',
              display: 'inline-block',
              marginTop: '8px'
            }}>
              <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '12px' }}>
                {loading ? '' : doctorSpecialty}
              </Text>
            </div>
          </div>
        )}
      </div>

      <Divider style={{ 
        margin: '8px 16px 16px', 
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        display: collapsed ? 'none' : 'block'
      }} />

      {/* Navigation Menu - Updated styling */}
      <Menu 
        theme="dark" 
        mode="inline" 
        selectedKeys={[getSelectedKey()]}
        style={{ 
          fontSize: '16px', 
          background: 'transparent',
          border: 'none',
          padding: '0 8px'
        }}
      >
        <Menu.Item 
          key="profile" 
          icon={<UserOutlined />} 
          style={{
            ...menuItemStyle,
            backgroundColor: getSelectedKey() === 'profile' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
            marginBottom: '8px',
          }}
        >
          <Link to="/my-doctor">Profile</Link>
        </Menu.Item>

        <Menu.Item 
          key="consultation-response" 
          icon={<MessageOutlined />}
          style={{
            ...menuItemStyle,
            backgroundColor: getSelectedKey() === 'consultation-response' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
            marginBottom: '8px',
          }}
        >
          <Link to="/my-doctor/consultation-response">Consultation Response</Link>
        </Menu.Item>
        
        {/* Logout Menu Item - Moved right after consultation */}
        <Menu.Item 
          key="logout" 
          icon={<LogoutOutlined />} 
          onClick={handleLogout}
          style={{
            ...menuItemStyle,
            color: 'rgba(255, 255, 255, 0.9)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: collapsed ? '50%' : '12px',
            marginBottom: '8px',
          }}
        >
          {!collapsed && (
            <>
              Logout
              <ArrowRightOutlined style={{ marginLeft: 'auto' }} />
            </>
          )}
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default DoctorSidebar;