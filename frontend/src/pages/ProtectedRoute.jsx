
import { Navigate, Outlet } from 'react-router';

const ProtectedRoute = () => {
    const token = localStorage.getItem('token');
    // If no token, send them to /login
    return token ? <Outlet /> : <Navigate to="/login" replace />;
};
export default ProtectedRoute;