import { App } from "./App";
import HomePage from "./pages/HomePage";
import ErrorPage from "./pages/ErrorPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import CreateOrderPage from "./pages/CreateOrderPage";
import EditOrderPage from "./pages/EditOrderPage";
import DashBoard from "./pages/DashBoard";
import LogIn from "./pages/LogIn";
import ProtectedRoute from "./pages/ProtectedRoute";
import OrdersByStatus from "./pages/OrderByStatus";
import SearchPage from "./pages/SearchPage";
import AdminDashBoard from "./pages/AdminDashBoard";
import AdminRoute from "./pages/AdminRoute";
import EditUserPage from "./pages/EditUser";
import UserList from "./pages/UsersList";
import CreateNewUser from "./pages/CreatNewUser";




const routes = [
  { 
    path: "/login", 
    element: <LogIn /> 
  },
  {
    path: "/",
    element: <App />, 
    errorElement: <ErrorPage />,
    children: [
      // --- PROTECTED ROUTES ---
      {
        element: <ProtectedRoute />, // All routes inside this block need a token
        children: [
          { index: true, element: <DashBoard /> },
          { path: "orders", element: <HomePage /> },
          { path: "create", element: <CreateOrderPage /> },
          { path: "orders/:id", element: <OrderDetailsPage /> },
          { path: "edit/:id", element: <EditOrderPage /> },
          { path: "status/:status", element: <OrdersByStatus /> },
          {path: "search", element: <SearchPage />},
          {
            element: <AdminRoute />, // Nested guard for admin only
            children: [
              { path: "admin", element: <AdminDashBoard /> },
              { path: "admin/Utilisateurs", element: <UserList /> },
              { path: "admin/Utilisateurs/:id", element: <EditUserPage /> },
              { path: "admin/Utilisateurs/create-user", element: <CreateNewUser /> },
            ]
          },
        ],
      },
    ],
  },
];

export default routes;