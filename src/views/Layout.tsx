import Header from "../components/Header";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Header />
      <div style={{ width: "100%", height: "93%" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
