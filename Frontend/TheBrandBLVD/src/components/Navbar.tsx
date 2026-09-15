import {
  Search,
  ShoppingBag,
  Menu,
  X,
  User,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  group: string;
  isActive: boolean;
}

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  // ==========================================
  // STATE
  // ==========================================

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [shopHover, setShopHover] = useState(false);

  // ==========================================
  // FETCH CATEGORIES
  // ==========================================
const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);

        const response = await fetch(
          "https://the-brand-blvd.onrender.com/api/categories"
        );

        const data = await response.json();

        if (response.ok && data.success) {
          setCategories(data.categories || []);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error("Fetch categories error:", error);
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };
  useEffect(() => {
    

    fetchCategories();
  }, []);

  // ==========================================
  // CLOSE MOBILE MENU
  // ==========================================

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileShopOpen(false);
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = async () => {
    await logout();

    setProfileOpen(false);
    navigate("/login");
  };

  // ==========================================
  // GROUP CATEGORIES DYNAMICALLY
  // ==========================================

  const groupedCategories = categories.reduce(
    (groups, category) => {
      if (!groups[category.group]) {
        groups[category.group] = [];
      }

      groups[category.group].push(category);

      return groups;
    },
    {} as Record<string, Category[]>
  );

  // ==========================================
  // CATEGORY LINK
  // ==========================================

  const CategoryLink = ({
    category,
    mobile = false,
  }: {
    category: Category;
    mobile?: boolean;
  }) => {
    return (
      <Link
        to={`/shop?category=${category.slug}`}
        onClick={mobile ? closeMobileMenu : undefined}
        className="text-xs text-black/60 transition-colors hover:text-black"
      >
        {category.name}
      </Link>
    );
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <header className="sticky top-0 z-50 bg-white text-black">
      {/* ==========================================
          NAVBAR
      ========================================== */}

      <nav className="relative mx-auto flex h-20 max-w-[1600px] items-center px-6 md:px-10 lg:px-14">
        {/* ==========================================
            MOBILE MENU BUTTON
        ========================================== */}

        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex items-center justify-center lg:hidden"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X size={22} strokeWidth={1.5} />
          ) : (
            <Menu size={22} strokeWidth={1.5} />
          )}
        </button>

        {/* ==========================================
            LOGO
        ========================================== */}

        <Link
          to="/"
          onClick={closeMobileMenu}
          className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src="/Logo.png"
              alt="The Brand BLVD"
              className="h-10 w-auto object-contain"
            />
          </motion.div>
        </Link>

        {/* ==========================================
            DESKTOP NAVIGATION
        ========================================== */}

        <div className="ml-16 hidden items-center gap-7 lg:flex">
          {/* HOME */}

          <Link to="/" className="nav-link">
            Home
          </Link>

          {/* ==========================================
              SHOP MEGA MENU
          ========================================== */}

          <div className="relative flex h-20 items-center" onMouseEnter={() => { setShopHover(true); fetchCategories(); }} onMouseLeave={() => setShopHover(false)} >
            <button
              type="button"
              className="nav-link flex items-center gap-1"
            >
              Shop

              <ChevronDown
                size={13}
                strokeWidth={1.5}
                className={`transition-transform duration-300 ${
                  shopHover ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {shopHover && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-1/2 top-20 w-[850px] -translate-x-1/2 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
                >
                  <div className="px-12 py-10">
                    {categoriesLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <p className="text-xs text-black/30">
                          Loading categories...
                        </p>
                      </div>
                    ) : Object.keys(groupedCategories).length > 0 ? (
                      <div className="grid grid-cols-3 gap-12">
                        {Object.entries(groupedCategories).map(
                          ([groupName, groupCategories]) => (
                            <div key={groupName}>
                              {/* GROUP TITLE */}

                              <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.25em]">
                                {groupName}
                              </p>

                              {/* GROUP CATEGORIES */}

                              <div className="flex flex-col gap-3">
                                {groupCategories.map((category) => (
                                  <CategoryLink
                                    key={category._id}
                                    category={category}
                                  />
                                ))}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center py-8">
                        <p className="text-xs text-black/30">
                          No categories available
                        </p>
                      </div>
                    )}
                  </div>

                  {/* VIEW ALL */}

                  <div className="border-t border-black/5 px-12 py-5">
                    <Link
                      to="/shop"
                      className="text-[10px] font-medium uppercase tracking-[0.25em] transition-opacity hover:opacity-50"
                    >
                      View All Products →
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* COLLECTION */}

          <Link
            to="/#collection"
            className="nav-link"
          >
            Collection
          </Link>

          {/* ABOUT */}

          <Link
            to="/about"
            className="nav-link"
          >
            About
          </Link>

          {/* CONTACT */}

          <Link
            to="/contact"
            className="nav-link"
          >
            Contact
          </Link>
        </div>

        {/* ==========================================
            RIGHT ACTIONS
        ========================================== */}

        <div className="ml-auto flex items-center gap-5">
          {/* SEARCH */}

          <motion.button
            type="button"
            onClick={() => setSearchOpen(!searchOpen)}
            whileTap={{ scale: 0.9 }}
            aria-label="Search"
          >
            {searchOpen ? (
              <X size={20} strokeWidth={1.5} />
            ) : (
              <Search size={20} strokeWidth={1.5} />
            )}
          </motion.button>

          {/* ==========================================
              ACCOUNT
          ========================================== */}

          {user ? (
            <div className="relative">
              <motion.button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                whileTap={{ scale: 0.9 }}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-xs font-medium uppercase text-white"
                aria-label="Account"
              >
                {user.name.charAt(0)}
              </motion.button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-12 w-64 bg-white p-5 shadow-[0_10px_40px_rgba(0,0,0,0.08)]"
                  >
                    {/* USER INFO */}

                    <div className="border-b border-black/10 pb-4">
                      <p className="text-sm font-medium">
                        {user.name}
                      </p>

                      <p className="mt-1 truncate text-xs text-black/40">
                        {user.email}
                      </p>
                    </div>

                    {/* ACCOUNT LINKS */}

                    <div className="py-3">
                      <Link
                        to="/account/profile"
                        onClick={() => setProfileOpen(false)}
                        className="block py-2 text-xs uppercase tracking-[0.15em] transition-opacity hover:opacity-50"
                      >
                        My Profile
                      </Link>

                      <Link
                        to="/orders"
                        onClick={() => setProfileOpen(false)}
                        className="block py-2 text-xs uppercase tracking-[0.15em] transition-opacity hover:opacity-50"
                      >
                        My Orders
                      </Link>

                      <Link
  to="/account/settings"
  onClick={() => setProfileOpen(false)}
  className="block py-2 text-xs uppercase tracking-[0.15em] transition-opacity hover:opacity-50"
>
  Account Settings
</Link>
                    </div>

                    {/* LOGOUT */}

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full border-t border-black/10 pt-4 text-left text-xs uppercase tracking-[0.15em] text-black/50 transition-colors hover:text-black"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              to="/login"
              aria-label="Account"
            >
              <motion.div whileTap={{ scale: 0.9 }}>
                <User size={20} strokeWidth={1.5} />
              </motion.div>
            </Link>
          )}

          {/* ==========================================
              SHOPPING BAG
          ========================================== */}

          <Link
            to="/cart"
            className="relative"
            aria-label="Shopping bag"
          >
            <motion.div whileTap={{ scale: 0.9 }}>
              <ShoppingBag
                size={20}
                strokeWidth={1.5}
              />

              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[9px] font-medium text-white">
                {cartCount}
              </span>
            </motion.div>
          </Link>
        </div>
      </nav>

      {/* ==========================================
          SEARCH PANEL
      ========================================== */}

      <motion.div
        initial={false}
        animate={{
          height: searchOpen ? "auto" : 0,
          opacity: searchOpen ? 1 : 0,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        className="overflow-hidden bg-white"
      >
        <div className="mx-auto max-w-[1600px] px-6 pb-8 pt-2 md:px-10 lg:px-14">
          <div className="flex items-center gap-4">
            <Search
              size={20}
              strokeWidth={1.5}
              className="shrink-0"
            />

            <input
              type="text"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
              placeholder="Search products..."
              autoFocus={searchOpen}
              className="w-full bg-transparent py-4 text-lg font-light outline-none placeholder:text-black/30 md:text-2xl"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="shrink-0 text-black/40 transition-colors hover:text-black"
              >
                <X
                  size={18}
                  strokeWidth={1.5}
                />
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* ==========================================
          MOBILE NAVIGATION
      ========================================== */}

      <motion.div
        initial={false}
        animate={{
          height: mobileMenuOpen ? "auto" : 0,
          opacity: mobileMenuOpen ? 1 : 0,
        }}
        transition={{
          duration: 0.35,
          ease: "easeInOut",
        }}
        className="overflow-hidden bg-white lg:hidden"
      >
        <div className="flex flex-col px-6 pb-8 pt-4">
          {/* HOME */}

          <Link
            to="/"
            onClick={closeMobileMenu}
            className="mobile-link"
          >
            Home
          </Link>

          {/* ==========================================
              MOBILE SHOP
          ========================================== */}

          <button
            type="button"
            onClick={() =>
              setMobileShopOpen(!mobileShopOpen)
            }
            className="flex items-center justify-between py-4 text-left text-xs uppercase tracking-[0.2em]"
          >
            Shop

            {mobileShopOpen ? (
              <ChevronUp
                size={15}
                strokeWidth={1.5}
              />
            ) : (
              <ChevronDown
                size={15}
                strokeWidth={1.5}
              />
            )}
          </button>

          <AnimatePresence>
            {mobileShopOpen && (
              <motion.div
                initial={{
                  height: 0,
                  opacity: 0,
                }}
                animate={{
                  height: "auto",
                  opacity: 1,
                }}
                exit={{
                  height: 0,
                  opacity: 0,
                }}
                className="overflow-hidden"
              >
                <div className="space-y-7 pb-5 pl-4">
                  {categoriesLoading ? (
                    <p className="text-xs text-black/30">
                      Loading categories...
                    </p>
                  ) : Object.keys(groupedCategories).length > 0 ? (
                    Object.entries(groupedCategories).map(
                      ([groupName, groupCategories]) => (
                        <div key={groupName}>
                          {/* GROUP TITLE */}

                          <p className="mb-3 text-[9px] uppercase tracking-[0.25em] text-black/40">
                            {groupName}
                          </p>

                          {/* GROUP CATEGORIES */}

                          <div className="flex flex-col gap-3">
                            {groupCategories.map((category) => (
                              <CategoryLink
                                key={category._id}
                                category={category}
                                mobile
                              />
                            ))}
                          </div>
                        </div>
                      )
                    )
                  ) : (
                    <p className="text-xs text-black/30">
                      No categories available
                    </p>
                  )}

                  {/* VIEW ALL */}

                  <Link
                    to="/shop"
                    onClick={closeMobileMenu}
                    className="inline-block text-[9px] uppercase tracking-[0.25em]"
                  >
                    View All Products →
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* COLLECTION */}

          <Link
            to="/#collection"
            onClick={closeMobileMenu}
            className="mobile-link"
          >
            Collection
          </Link>

          {/* ABOUT */}

          <Link
            to="/about"
            onClick={closeMobileMenu}
            className="mobile-link"
          >
            About
          </Link>

          {/* CONTACT */}

          <Link
            to="/contact"
            onClick={closeMobileMenu}
            className="mobile-link"
          >
            Contact
          </Link>

          {/* ORDERS */}

          <Link
            to="/orders"
            onClick={closeMobileMenu}
            className="mobile-link"
          >
            Orders
          </Link>

          {/* CHECKOUT */}

          <Link
            to="/checkout"
            onClick={closeMobileMenu}
            className="mobile-link"
          >
            Checkout
          </Link>

          {/* LOGIN */}

          {!user && (
            <Link
              to="/login"
              onClick={closeMobileMenu}
              className="mobile-link"
            >
              Login
            </Link>
          )}

          {/* SIGN UP */}

          {!user && (
            <Link
              to="/register"
              onClick={closeMobileMenu}
              className="mt-3 flex items-center justify-center bg-black px-6 py-4 text-xs font-medium uppercase tracking-[0.2em] text-white"
            >
              Sign Up
            </Link>
          )}

          {/* SHOPPING BAG */}

          <Link
            to="/cart"
            onClick={closeMobileMenu}
            className="mobile-link"
          >
            Shopping Bag ({cartCount})
          </Link>
        </div>
      </motion.div>
    </header>
  );
};

export default Navbar;
