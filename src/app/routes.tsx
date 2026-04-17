import { createBrowserRouter } from "react-router";
import { LoginPage } from "./components/LoginPage";
import { MenuPage } from "./components/MenuPage";
import { CartPage } from "./components/CartPage";
import { OrdersPage } from "./components/OrdersPage";
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
