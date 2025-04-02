import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import AppHeader from '../Header/Header';

const { Content } = Layout;

function MainLayout() {
  const location = useLocation();
  const token = localStorage.getItem('token'); // Lấy token từ localStorage
  
  // Kiểm tra xem có phải là trang login hoặc register không
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  
  // Thêm điều kiện kiểm tra cho trang DoctorConsultationResponse
  const isConsultationResponsePage = location.pathname === '/my-doctor/consultation-response';

  const isMyDoctorProfilePage = location.pathname === '/my-doctor'; 

  const isMyDoctorCreateProfilePage = location.pathname === '/create-doctor-profile'; 

  const isForgotPasswordPage = location.pathname === '/forgot-password'; 

  const isUpdateDoctorProfile = location.pathname === '/update-doctor-profile'; 
  
  
  // Nếu đã đăng nhập và cố gắng truy cập trang auth, chuyển hướng về /home
  if (token && isAuthPage) {
    return <Navigate to="/home" replace />;
  }

  return (
    <Layout
      style={{
        minHeight: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* Hiển thị header nếu không phải trang xác thực và không phải trang consultation response */}
      {!isAuthPage && !isConsultationResponsePage && !isMyDoctorProfilePage && !isForgotPasswordPage && !isMyDoctorCreateProfilePage && !isUpdateDoctorProfile && <AppHeader /> }
      
      <Content
        style={{
          margin: '24px',
          overflow: 'initial',
          width: '100vw',
        }}
      >
        <Outlet />
      </Content>
    </Layout>
  );
}

export default MainLayout;