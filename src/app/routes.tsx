import { createBrowserRouter } from "react-router";
// Fixed paths: Pages are in ./pages/
import { LoginPage } from "./pages/LoginPage";
import { MenuPage } from "./pages/MenuPage";
import { CartPage } from "./pages/CartPage";
import { OrdersPage } from "./pages/OrdersPage";
// Layout and Dashboard are in ./components/
import { StaffDashboard } from "./components/StaffDashboard";
import { Layout } from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: LoginPage },
      { path: "menu", Component: MenuPage },
      { path: "cart", Component: CartPage },
      { path: "orders", Component: OrdersPage },
      { path: "staff", Component: StaffDashboard },
    ],
  },
]);