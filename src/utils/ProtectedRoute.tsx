import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  Component: React.FC;
  role: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ Component, role }) => {
  const userRole = localStorage.getItem("role");

  if (!userRole) {
    return <Navigate to="/login" replace />; 
  }

  if (!role.includes(userRole)) {
    return <Navigate to="/" replace />; 
  }

  return <Component />;
};

export default ProtectedRoute;


