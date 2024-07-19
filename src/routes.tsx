import { createBrowserRouter } from "react-router-dom";
import Auth from "./views/Auth";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Auth />,
  },
]);
