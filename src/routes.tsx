import { createBrowserRouter } from "react-router-dom";
import Auth from "./views/Auth";
import Dashboard from "./views/Dashboard";
import Folders from "./views/Folders";
import Layout from "./views/Layout";
import Folder from "./views/Folder";
import Files from "./views/Files";
import File from "./views/File";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Auth />,
  },
  {
    path: "/dashboard",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Dashboard/>,
      },
      {
        path: "folder",
        element: <Folders />,
      },
      {
        path: "folder/:folderid",
        element: <Folder />,
      },
      {
        path: "file",
        element: <Files />,
      },
      {
        path: "file/:fileId",
        element: <File />,
      },
    ],
  },
]);
