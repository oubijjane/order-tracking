import { App } from "./App";
import HomePage from "./pages/HomePage";
import ErrorPage from "./pages/ErrorPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import CreateOrderPage from "./pages/CreateOrderPage";
import EditOrderPage from "./pages/EditOrderPage";
import DashBoard from "./pages/DashBoard";

const routes = [
  {
    path: "/",
    element: <App />, // The Layout (Navbar + Outlet)
    children: [
        // 1. "index: true" means this loads when path is exactly "/"
        { index: true, element: <DashBoard /> },
        
        // 2. Future routes (ready for you to build)
        { path: "orders", element: <HomePage /> },
        { path: "create", element: <CreateOrderPage /> },
        { path: "orders/:id", element: <OrderDetailsPage /> },
        { path: "edit/:id", element: <EditOrderPage /> },
    ],
    errorElement: <ErrorPage />,
  },
];

export default routes;