import { Outlet, useLocation } from 'react-router-dom';
import { Layout } from 'antd';
import AppHeader from '../Header/Header'; // Import AppHeader

const { Content } = Layout;

function MainLayout() {
  const location = useLocation();
  
  // Kiểm tra xem có phải là trang login hoặc register không
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <Layout
      style={{
        minHeight: '100vh',
        overflow: 'hidden',
      }}
    >
      {!isAuthPage && <AppHeader />} {/* Chỉ hiển thị AppHeader nếu không phải là trang auth */}
      
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