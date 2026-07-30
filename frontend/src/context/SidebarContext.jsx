import { createContext, useContext } from "react";

export const SidebarContext = createContext({
  openSidebar: () => {},
  collapsed: false,
  toggleCollapsed: () => {},
});
export const useSidebar = () => useContext(SidebarContext);
