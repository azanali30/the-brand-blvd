import {
  Search,
  Bell,
  Menu,
} from "lucide-react";

interface TopbarProps {
  onOpenMobileSidebar: () => void;
}

const Topbar = ({
  onOpenMobileSidebar,
}: TopbarProps) => {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between bg-white px-5 md:px-8">
      {/* Left */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu */}
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu
            size={21}
            strokeWidth={1.5}
          />
        </button>

        {/* Search */}
        <div className="hidden items-center gap-3 md:flex">
          <Search
            size={18}
            strokeWidth={1.5}
            className="text-black/35"
          />

          <input
            type="text"
            placeholder="Search..."
            className="w-48 bg-transparent text-xs outline-none placeholder:text-black/30"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">
        {/* Notifications */}
        <button
          type="button"
          className="relative text-black/60 transition-colors hover:text-black"
          aria-label="Notifications"
        >
          <Bell
            size={19}
            strokeWidth={1.5}
          />

          <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-black" />
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-black/10" />

        {/* Admin */}
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-xs font-medium">
              Admin
            </p>

            <p className="mt-0.5 text-[9px] uppercase tracking-[0.15em] text-black/35">
              Administrator
            </p>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-xs font-medium text-white">
            A
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;