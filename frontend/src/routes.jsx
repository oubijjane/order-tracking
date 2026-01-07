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
import CompaniesList from "./pages/CompaniesList";
import EditCompanyPage from "./pages/EditCompany";
import CreateCompanyPage from "./pages/CreateNewCompany";
import BrandsList from "./pages/BrandList";
import EditPage from "./pages/EditPage";
import EditUserForm from "./components/EditUser";
import EditCompany from "./components/EditCompany";
import EditBrand from "./components/EditBrand";
import BrandForm from "./components/NewBrandForm";











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
          { path: "search", element: <SearchPage /> },
          {
            element: <AdminRoute />, // Nested guard for admin only
            children: [
              { path: "admin", element: <AdminDashBoard /> },
              { path: "admin/Utilisateurs", element: <UserList /> },
              {
                path: "admin/edit", element: <EditPage />,
                children: [
                  {
                    path: "user/:id", // Resolves to: admin/edit/user/:id
                    element: <EditUserForm /> // This is the Child
                  },
                {
                    path: "company/:id", 
                    element: <EditCompany /> 
                  },
                {
                    path: "brand/:id", 
                    element: <EditBrand /> 
                  },
                ]
              },
              { path: "admin/Utilisateurs/create-user", element: <CreateNewUser /> },
              { path: "admin/Companies", element: <CompaniesList /> },
              { path: "admin/Companies/create-company", element: <CreateCompanyPage /> },
              { path: "admin/Marques", element: <BrandsList /> },
              { path: "admin/Marques/create-brand", element: <BrandForm /> },
            ]
          },
        ],
      },
    ],
  },
];

export default routes;