import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import AppHeader from '../Header/Header';

const { Content } = Layout;

function MainLayout() {
  const location = useLocation();
  const token = localStorage.getItem('token'); // Lấy token từ localStorage
  
  // Kiểm tra xem có phải là trang login hoặc register không
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

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
      {!isAuthPage && <AppHeader />}
      
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