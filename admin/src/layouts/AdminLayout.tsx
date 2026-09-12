import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  const [mobileSidebarOpen, setMobileSidebarOpen] =
    useState(false);

  return (
    <div className="min-h-screen bg-[#f7f7f7] text-black">
      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() =>
          setMobileSidebarOpen(false)
        }
        onToggleCollapse={() =>
          setSidebarCollapsed(
            (current) => !current
          )
        }
      />

      <div
        className={`min-h-screen transition-all duration-300 ${
          sidebarCollapsed
            ? "lg:pl-[82px]"
            : "lg:pl-[250px]"
        }`}
      >
        <Topbar
          onOpenMobileSidebar={() =>
            setMobileSidebarOpen(true)
          }
        />

        <main className="min-h-[calc(100vh-80px)] p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;