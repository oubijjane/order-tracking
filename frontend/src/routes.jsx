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
          {path: "search", element: <SearchPage />}
          
        ],
      },
    ],
  },
];

export default routes;