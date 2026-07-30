import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { SidebarContext } from "../context/SidebarContext";

export default function Layout() {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem("sidebar_collapsed") === "1");

  useEffect(() => {
    localStorage.setItem("sidebar_collapsed", collapsed ? "1" : "0");
  }, [collapsed]);

  return (
    <SidebarContext.Provider
      value={{
        openSidebar: () => setOpen(true),
        collapsed,
        toggleCollapsed: () => setCollapsed((c) => !c),
      }}
    >
      <div className={`admin-shell ${collapsed ? "sidebar-collapsed" : ""}`}>
        <Sidebar open={open} onClose={() => setOpen(false)} collapsed={collapsed} onToggleCollapsed={() => setCollapsed((c) => !c)} />
        <div className="admin-main">
          <Outlet />
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
