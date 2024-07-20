import { createBrowserRouter } from "react-router-dom";
import Auth from "./views/Auth";
import Dashboard from "./views/Dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Auth />,
  },
  {
    path: "/dashboard",
    element: <Dashboard/>,
  }
]);
