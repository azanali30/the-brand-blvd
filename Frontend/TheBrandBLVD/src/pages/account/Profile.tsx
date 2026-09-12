import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
  LogOut,
  Package,
  ShieldCheck,
  User,
} from "lucide-react";

const API_URL = "http://localhost:5000";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
  googleId?: string;
  createdAt?: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  user?: UserData;
}

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<UserData | null>(null);
  const [name, setName] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // ========================================
  // NOTIFICATION
  // ========================================

  const showNotification = (
    type: "success" | "error",
    message: string
  ) => {
    setNotification({
      type,
      message,
    });

    window.setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // ========================================
  // GET CURRENT USER
  // ========================================

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/auth/me`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.status === 401) {
          navigate("/login");
          return;
        }

        const contentType =
          response.headers.get("content-type");

        if (!contentType?.includes("application/json")) {
          throw new Error(
            `Server returned an invalid response (${response.status})`
          );
        }

        const data: ApiResponse =
          await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Failed to load profile"
          );
        }

        if (data.user) {
          setUser(data.user);
          setName(data.user.name);
        }
      } catch (error) {
        console.error(
          "Get profile error:",
          error
        );

        showNotification(
          "error",
          error instanceof Error
            ? error.message
            : "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [navigate]);

  // ========================================
  // UPDATE PROFILE
  // ========================================

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const cleanName = name.trim();

    if (!cleanName) {
      showNotification(
        "error",
        "Name is required"
      );
      return;
    }

    if (cleanName === user?.name) {
      showNotification(
        "success",
        "Your profile is already up to date"
      );
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API_URL}/api/auth/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name: cleanName,
          }),
        }
      );

      const contentType =
        response.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        throw new Error(
          `Server returned an invalid response (${response.status})`
        );
      }

      const data: ApiResponse =
        await response.json();

      if (response.status === 401) {
        navigate("/login");
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to update profile"
        );
      }

      if (data.user) {
        setUser(data.user);
        setName(data.user.name);
      }

      showNotification(
        "success",
        "Profile updated successfully"
      );
    } catch (error) {
      console.error(
        "Update profile error:",
        error
      );

      showNotification(
        "error",
        error instanceof Error
          ? error.message
          : "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  // ========================================
  // LOGOUT
  // ========================================

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      const response = await fetch(
        `${API_URL}/api/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const contentType =
        response.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        throw new Error(
          `Server returned an invalid response (${response.status})`
        );
      }

      const data: ApiResponse =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to logout"
        );
      }

      navigate("/login");
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );

      showNotification(
        "error",
        error instanceof Error
          ? error.message
          : "Failed to logout"
      );
    } finally {
      setLoggingOut(false);
    }
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8">
          <div className="animate-pulse">
            <div className="h-8 w-40 bg-black/5" />

            <div className="mt-12 grid gap-10 lg:grid-cols-[220px_1fr]">
              <div className="h-64 bg-black/5" />

              <div className="space-y-6">
                <div className="h-12 bg-black/5" />
                <div className="h-12 bg-black/5" />
                <div className="h-12 bg-black/5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ========================================
  // INITIALS
  // ========================================

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((word) => word.charAt(0))
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  // ========================================
  // MEMBER SINCE
  // ========================================

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(
        "en-US",
        {
          month: "long",
          year: "numeric",
        }
      )
    : "Recently";

  return (
    <div className="min-h-screen bg-white text-black">
      {/* ========================================
          NOTIFICATION
      ======================================== */}

      {notification && (
        <div className="fixed right-5 top-5 z-50">
          <div
            className={`flex items-center gap-3 bg-black px-5 py-4 text-white shadow-2xl ${
              notification.type === "error"
                ? "border-l-4 border-white"
                : ""
            }`}
          >
            {notification.type === "success" ? (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-black">
                <Check size={14} />
              </div>
            ) : (
              <div className="flex h-6 w-6 items-center justify-center rounded-full border border-white text-xs">
                !
              </div>
            )}

            <p className="text-xs uppercase tracking-[0.12em]">
              {notification.message}
            </p>
          </div>
        </div>
      )}

      {/* ========================================
          HEADER
      ======================================== */}

      <section className="border-b border-black/5">
        <div className="mx-auto max-w-6xl px-5 py-12 md:px-8">
          <p className="text-[10px] uppercase tracking-[0.35em] text-black/45">
            Account
          </p>

          <h1 className="mt-3 text-3xl font-medium tracking-[-0.04em] md:text-5xl">
            My Profile
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-6 text-black/50">
            Manage your personal information,
            orders and account preferences.
          </p>
        </div>
      </section>

      {/* ========================================
          CONTENT
      ======================================== */}

      <main className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-16">
        <div className="grid gap-12 lg:grid-cols-[220px_1fr]">
          {/* ========================================
              SIDEBAR
          ======================================== */}

          <aside>
            {/* Avatar */}
            <div className="flex flex-col items-center lg:items-start">
              <div className="flex h-24 w-24 items-center justify-center bg-black text-2xl font-medium text-white">
                {initials}
              </div>

              <div className="mt-5 text-center lg:text-left">
                <h2 className="text-lg font-medium">
                  {user?.name}
                </h2>

                <p className="mt-1 text-xs uppercase tracking-[0.15em] text-black/40">
                  {user?.role === "admin"
                    ? "Administrator"
                    : "Customer"}
                </p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="mt-10 space-y-1">
              <Link
                to="/account/profile"
                className="flex items-center justify-between bg-black px-4 py-4 text-xs uppercase tracking-[0.14em] text-white"
              >
                <span className="flex items-center gap-3">
                  <User size={15} />
                  Profile
                </span>

                <ArrowRight size={14} />
              </Link>

              <Link
                to="/orders"
                className="flex items-center justify-between px-4 py-4 text-xs uppercase tracking-[0.14em] transition-opacity hover:opacity-50"
              >
                <span className="flex items-center gap-3">
                  <Package size={15} />
                  My Orders
                </span>

                <ArrowRight size={14} />
              </Link>

              <Link
                to="/account/change-password"
                className="flex items-center justify-between px-4 py-4 text-xs uppercase tracking-[0.14em] transition-opacity hover:opacity-50"
              >
                <span className="flex items-center gap-3">
                  <ShieldCheck size={15} />
                  Security
                </span>

                <ArrowRight size={14} />
              </Link>
            </nav>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="mt-8 flex w-full items-center gap-3 px-4 py-4 text-left text-xs uppercase tracking-[0.14em] text-black/50 transition-colors hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
            >
              <LogOut size={15} />

              {loggingOut
                ? "Signing Out..."
                : "Sign Out"}
            </button>
          </aside>

          {/* ========================================
              PROFILE FORM
          ======================================== */}

          <section>
            <div className="border-b border-black/10 pb-6">
              <p className="text-[10px] uppercase tracking-[0.3em] text-black/40">
                Personal Information
              </p>

              <h2 className="mt-2 text-2xl font-medium tracking-[-0.03em]">
                Profile Details
              </h2>

              <p className="mt-2 text-sm text-black/45">
                Update your personal information.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-10"
            >
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-3 block text-[10px] uppercase tracking-[0.2em] text-black/50"
                >
                  Full Name
                </label>

                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Enter your full name"
                  className="w-full border-b border-black/15 bg-transparent px-0 py-4 text-sm outline-none transition-colors placeholder:text-black/25 focus:border-black"
                />
              </div>

              {/* Email */}
              <div className="mt-10">
                <label
                  htmlFor="email"
                  className="mb-3 block text-[10px] uppercase tracking-[0.2em] text-black/50"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  className="w-full cursor-not-allowed border-b border-black/10 bg-black/[0.02] px-0 py-4 text-sm text-black/45 outline-none"
                />

                <p className="mt-3 text-[11px] text-black/35">
                  Email address cannot be changed
                  from your profile.
                </p>
              </div>

              {/* Account Type */}
              <div className="mt-10 grid gap-8 sm:grid-cols-2">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-black/40">
                    Account Type
                  </p>

                  <p className="mt-3 text-sm capitalize">
                    {user?.role || "customer"}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-black/40">
                    Member Since
                  </p>

                  <p className="mt-3 text-sm">
                    {memberSince}
                  </p>
                </div>
              </div>

              {/* Save */}
              <div className="mt-12">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex min-w-[190px] items-center justify-center gap-3 bg-black px-7 py-4 text-xs uppercase tracking-[0.16em] text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {saving
                    ? "Saving..."
                    : "Save Changes"}

                  {!saving && (
                    <ArrowRight size={15} />
                  )}
                </button>
              </div>
            </form>

            {/* Account Information */}
            <div className="mt-16 border-t border-black/10 pt-8">
              <p className="text-[10px] uppercase tracking-[0.3em] text-black/40">
                Account
              </p>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <Link
                  to="/orders"
                  className="group flex items-center justify-between bg-[#f7f7f7] px-5 py-6 transition-colors hover:bg-black hover:text-white"
                >
                  <div>
                    <p className="text-sm font-medium">
                      Your Orders
                    </p>

                    <p className="mt-2 text-xs text-black/45 group-hover:text-white/55">
                      View your complete order
                      history.
                    </p>
                  </div>

                  <ArrowRight size={18} />
                </Link>

                <Link
                  to="/account/change-password"
                  className="group flex items-center justify-between bg-[#f7f7f7] px-5 py-6 transition-colors hover:bg-black hover:text-white"
                >
                  <div>
                    <p className="text-sm font-medium">
                      Security
                    </p>

                    <p className="mt-2 text-xs text-black/45 group-hover:text-white/55">
                      Manage your account security.
                    </p>
                  </div>

                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Profile;