import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../context/AuthContext'; 
import { useEffect } from 'react';


const AdminRoute = () => {
    const { user, loading } = useAuth();

    // 1. Handle the loading state first
    if (loading) return <div>Chargement...</div>;

    // 2. Calculate the boolean directly in the component body
    // This variable is now "scoped" to the whole component
    const isAdmin = user?.roles?.includes('ROLE_ADMIN');

    // 3. Debugging (Optional, but now it will work)
    console.log("User found:", user);
    console.log("Is Admin:", isAdmin);

    // 4. Return the logic
    return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};
export default AdminRoute;