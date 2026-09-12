import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight,
  Store,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onToggleCollapse: () => void;
}

interface NavigationItem {
  name: string;
  path: string;
  icon: React.ElementType;
}

const navigationItems: NavigationItem[] = [
  {
    name: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    path: "/products",
    icon: Package,
  },
  {
    name: "Categories",
    path: "/categories",
    icon: Tags,
  },
  {
    name: "Orders",
    path: "/orders",
    icon: ShoppingBag,
  },
  {
    name: "Customers",
    path: "/customers",
    icon: Users,
  },
];

const Sidebar = ({
  collapsed,
  mobileOpen,
  onCloseMobile,
  onToggleCollapse,
}: SidebarProps) => {
  const navigate = useNavigate();

  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Logout failed."
        );
      }

      // Close mobile sidebar
      onCloseMobile();

      // Redirect to login page
      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={onCloseMobile}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen flex-col
          bg-[#0a0a0a] text-white
          transition-all duration-300
          ${collapsed ? "w-[82px]" : "w-[250px]"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div
          className={`flex h-20 items-center ${
            collapsed ? "justify-center" : "px-6"
          }`}
        >
          <Link
            to="/"
            onClick={onCloseMobile}
            className="flex items-center"
          >
            {collapsed ? (
              <div className="flex h-9 w-9 items-center justify-center bg-white text-sm font-bold text-black">
                BB
              </div>
            ) : (
              <div>
                <p className="text-sm font-semibold tracking-[0.18em]">
                  THE BRAND
                </p>

                <p className="mt-0.5 text-[9px] tracking-[0.4em] text-white/45">
                  BLVD ADMIN
                </p>
              </div>
            )}
          </Link>

          {/* Mobile Close */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="ml-auto lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-6">
          {!collapsed && (
            <p className="mb-4 px-3 text-[9px] uppercase tracking-[0.25em] text-white/30">
              Management
            </p>
          )}

          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 px-3 py-3 text-xs transition-all ${
                      isActive
                        ? "bg-white text-black"
                        : "text-white/55 hover:bg-white/5 hover:text-white"
                    } ${
                      collapsed ? "justify-center" : ""
                    }`
                  }
                >
                  <Icon
                    size={17}
                    strokeWidth={1.5}
                    className="shrink-0"
                  />

                  {!collapsed && (
                    <span>{item.name}</span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* System */}
          {!collapsed && (
            <p className="mb-4 mt-10 px-3 text-[9px] uppercase tracking-[0.25em] text-white/30">
              System
            </p>
          )}

          <nav className="space-y-1">
            <NavLink
              to="/settings"
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 text-xs transition-all ${
                  isActive
                    ? "bg-white text-black"
                    : "text-white/55 hover:bg-white/5 hover:text-white"
                } ${
                  collapsed ? "justify-center" : ""
                }`
              }
            >
              <Settings
                size={17}
                strokeWidth={1.5}
              />

              {!collapsed && <span>Settings</span>}
            </NavLink>
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="border-t border-white/10 p-3">

          {/* View Store */}
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noreferrer"
            className={`flex items-center gap-3 px-3 py-3 text-xs text-white/55 transition-colors hover:bg-white/5 hover:text-white ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <Store
              size={17}
              strokeWidth={1.5}
            />

            {!collapsed && (
              <span>View Store</span>
            )}
          </a>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className={`mt-1 flex w-full items-center gap-3 px-3 py-3 text-xs text-white/55 transition-colors hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <LogOut
              size={17}
              strokeWidth={1.5}
            />

            {!collapsed && (
              <span>
                {loggingOut
                  ? "Logging out..."
                  : "Logout"}
              </span>
            )}
          </button>
        </div>

        {/* Collapse Button */}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="absolute -right-3 top-[72px] hidden h-6 w-6 items-center justify-center rounded-full bg-white text-black shadow-md lg:flex"
          aria-label="Toggle sidebar"
        >
          {collapsed ? (
            <ChevronRight size={13} />
          ) : (
            <ChevronLeft size={13} />
          )}
        </button>
      </aside>
    </>
  );
};

export default Sidebar;