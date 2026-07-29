import { Outlet } from "react-router-dom";
import DesktopNavbar from "./DesktopNavbar";
import BottomNav from "./BottomNav";

export default function Layout() {
  return (
    <>
      <DesktopNavbar />
      <div className="content-wrap">
        <Outlet />
      </div>
      <BottomNav />
    </>
  );
}
