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
import CreateCompanyPage from "./pages/CreateNewCompany";
import BrandsList from "./pages/BrandList";
import EditPage from "./pages/EditPage";
import EditUserForm from "./components/EditUser";
import EditCompany from "./components/EditCompany";
import EditBrand from "./components/EditBrand";
import CreatBrandPage from "./pages/CreateNewBrand";
import ModelsList from "./pages/ModelsListPage";
import EditModelPage from "./pages/EditModelPage";
import CreatModelPage from "./pages/CreateNewModel";
import CommentsList from "./pages/CommentList";
import EditCommentForm from "./components/EditComment";
import CityList from "./pages/CityList";
import EditCityForm from "./components/EditCity";
import CreatCityPage from "./pages/CreateNewCity";
import TransitList from "./pages/TransitList";
import EditTransitForm from "./components/EditTransitCompany";
import CreatTransitPage from "./pages/CreateNewTransitCompany";
import ReportPage from "./pages/ReportPages";






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
                    path: "companie/:id", 
                    element: <EditCompany /> 
                  },
                {
                    path: "brand/:id", 
                    element: <EditBrand /> 
                  },
                  {
                    path: "comment/:id", 
                    element: <EditCommentForm /> 
                  },
                  {
                    path: "city/:id", 
                    element: <EditCityForm /> 
                  },
                  {
                    path: "transport/:id", 
                    element: <EditTransitForm /> 
                  },
                ]
              },
              { path: "admin/Utilisateurs/create-user", element: <CreateNewUser /> },
              { path: "admin/Companies", element: <CompaniesList /> },
              { path: "admin/Companies/create-company", element: <CreateCompanyPage /> },
              { path: "admin/Marques", element: <BrandsList /> },
              { path: "admin/Marques/create-brand", element: <CreatBrandPage /> },
              { path: "admin/Modèles", element: <ModelsList /> },
              { path: "admin/Modèles/edit/:id", element: <EditModelPage /> },
              { path: "admin/Modèles/create-model", element: <CreatModelPage /> },
              { path: "admin/commentaires", element: <CommentsList /> },
              { path: "admin/Villes", element: <CityList /> },
              { path: "admin/Transport", element: <TransitList /> },
              { path: "admin/Villes/create-city", element: <CreatCityPage /> },
              { path: "admin/Transport/create-transit", element: <CreatTransitPage /> },
              { path: "report", element: <ReportPage /> },
          
            ]
          },
        ],
      },
    ],
  },
];

export default routes;