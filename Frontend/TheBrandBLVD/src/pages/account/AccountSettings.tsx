import { useEffect, useState } from "react";
import {
  Check,
  ChevronRight,
  Lock,
  LogOut,
  Mail,
  Save,
  ShieldCheck,
  User,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "https://the-brand-blvd.onrender.com";

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
}

const AccountSettings = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<UserData | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const [notification, setNotification] = useState({
    show: false,
    type: "success" as "success" | "error",
    message: "",
  });

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/auth/me`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        navigate("/login");
        return;
      }

      const currentUser = data.user;

      setUser(currentUser);
      setName(currentUser.name || "");
      setEmail(currentUser.email || "");
    } catch (error) {
      console.error("Fetch account error:", error);

      showNotification(
        "error",
        "Unable to load your account information."
      );
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (
    type: "success" | "error",
    message: string
  ) => {
    setNotification({
      show: true,
      type,
      message,
    });

    setTimeout(() => {
      setNotification((current) => ({
        ...current,
        show: false,
      }));
    }, 3500);
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      showNotification("error", "Please enter your name.");
      return;
    }

    try {
      setSaving(true);

      /*
       * This endpoint will be connected to the backend:
       * PUT /api/auth/profile
       *
       * For now the frontend is ready for it.
       */

      const response = await fetch(
        `${API_URL}/api/auth/profile`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to update profile."
        );
      }

      setUser(data.user);

      showNotification(
        "success",
        "Your profile has been updated successfully."
      );
    } catch (error) {
      console.error("Update profile error:", error);

      showNotification(
        "error",
        error instanceof Error
          ? error.message
          : "Failed to update your profile."
      );
    } finally {
      setSaving(false);
    }
  };

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

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Logout failed."
        );
      }

      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);

      showNotification(
        "error",
        "Unable to logout. Please try again."
      );
    } finally {
      setLoggingOut(false);
    }
  };

  const formatMemberSince = (date?: string) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 w-48 bg-black/[0.06]" />
            <div className="h-4 w-72 bg-black/[0.06]" />

            <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
              <div className="h-72 bg-black/[0.04]" />
              <div className="h-96 bg-black/[0.04]" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-black">
      {/* Notification */}
      {notification.show && (
        <div className="fixed right-5 top-5 z-[100] w-[calc(100%-40px)] max-w-sm">
          <div
            className={`flex items-start gap-3 px-4 py-4 shadow-2xl ${
              notification.type === "success"
                ? "bg-black text-white"
                : "bg-red-600 text-white"
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {notification.type === "success" ? (
                <Check size={18} />
              ) : (
                <span className="text-sm font-bold">!</span>
              )}
            </div>

            <p className="text-sm leading-5">
              {notification.message}
            </p>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-16">
        {/* Header */}
        <div className="mb-10">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-black/40">
            My Account
          </p>

          <h1 className="text-3xl font-medium tracking-[-0.04em] md:text-4xl">
            Account Settings
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-black/50">
            Manage your personal information and account
            preferences.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          {/* Account Navigation */}
          <aside className="h-fit">
            <nav className="space-y-1">
              <Link
                to="/account"
                className="flex items-center justify-between px-4 py-3.5 text-sm text-black/55 transition hover:bg-black/[0.04] hover:text-black"
              >
                <span>Account Overview</span>
                <ChevronRight size={16} />
              </Link>

              <Link
                to="/orders"
                className="flex items-center justify-between px-4 py-3.5 text-sm text-black/55 transition hover:bg-black/[0.04] hover:text-black"
              >
                <span>My Orders</span>
                <ChevronRight size={16} />
              </Link>

              <div className="flex items-center justify-between bg-black px-4 py-3.5 text-sm text-white">
                <span>Account Settings</span>
                <User size={16} />
              </div>
            </nav>

            {/* Account summary */}
            <div className="mt-8 border-t border-black/[0.08] pt-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/35">
                Account
              </p>

              <p className="mt-3 truncate text-sm font-medium">
                {user?.name}
              </p>

              <p className="mt-1 truncate text-xs text-black/45">
                {user?.email}
              </p>

              <p className="mt-4 text-[11px] text-black/35">
                Member since{" "}
                {formatMemberSince(user?.createdAt)}
              </p>
            </div>
          </aside>

          {/* Main Settings */}
          <div className="space-y-8">
            {/* Personal Information */}
            <section className="border border-black/[0.08]">
              <div className="border-b border-black/[0.08] px-5 py-5 md:px-7">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center bg-black text-white">
                    <User size={17} />
                  </div>

                  <div>
                    <h2 className="text-base font-medium">
                      Personal Information
                    </h2>

                    <p className="mt-1 text-xs text-black/45">
                      Update your basic account information.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 md:p-7">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Name */}
                  <div>
                    <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-black/45">
                      Full Name
                    </label>

                    <div className="relative">
                      <User
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
                      />

                      <input
                        type="text"
                        value={name}
                        onChange={(event) =>
                          setName(event.target.value)
                        }
                        className="h-12 w-full bg-[#f7f7f7] pl-11 pr-4 text-sm outline-none transition focus:bg-[#f1f1f1]"
                        placeholder="Your full name"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-black/45">
                      Email Address
                    </label>

                    <div className="relative">
                      <Mail
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
                      />

                      <input
                        type="email"
                        value={email}
                        disabled
                        className="h-12 w-full cursor-not-allowed bg-[#f1f1f1] pl-11 pr-4 text-sm text-black/45 outline-none"
                      />
                    </div>

                    <p className="mt-2 text-[11px] text-black/35">
                      Email address cannot be changed here.
                    </p>
                  </div>
                </div>

                <div className="mt-7 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="inline-flex h-11 items-center gap-2 bg-black px-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Save size={15} />

                    {saving
                      ? "Saving..."
                      : "Save Changes"}
                  </button>
                </div>
              </div>
            </section>

            {/* Security */}
            <section className="border border-black/[0.08]">
              <div className="border-b border-black/[0.08] px-5 py-5 md:px-7">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center bg-black text-white">
                    <Lock size={17} />
                  </div>

                  <div>
                    <h2 className="text-base font-medium">
                      Password & Security
                    </h2>

                    <p className="mt-1 text-xs text-black/45">
                      Keep your account secure.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 md:p-7">
                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#f5f5f5]">
                      <ShieldCheck
                        size={18}
                        className="text-black/60"
                      />
                    </div>

                    <div>
                      <p className="text-sm font-medium">
                        Password
                      </p>

                      <p className="mt-1 text-xs leading-5 text-black/45">
                        Change your password regularly to keep
                        your account protected.
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/account/change-password"
                    className="inline-flex h-10 items-center justify-center border border-black px-5 text-[10px] font-semibold uppercase tracking-[0.16em] transition hover:bg-black hover:text-white"
                  >
                    Change Password
                  </Link>
                </div>
              </div>
            </section>

            {/* Account Information */}
            <section className="border border-black/[0.08]">
              <div className="border-b border-black/[0.08] px-5 py-5 md:px-7">
                <h2 className="text-base font-medium">
                  Account Information
                </h2>

                <p className="mt-1 text-xs text-black/45">
                  Information about your The Brand BLVD account.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-px bg-black/[0.08] md:grid-cols-3">
                <div className="bg-white p-5">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-black/35">
                    Account Type
                  </p>

                  <p className="mt-2 text-sm font-medium capitalize">
                    {user?.role || "Customer"}
                  </p>
                </div>

                <div className="bg-white p-5">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-black/35">
                    Status
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />

                    <p className="text-sm font-medium">
                      Active
                    </p>
                  </div>
                </div>

                <div className="bg-white p-5">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-black/35">
                    Member Since
                  </p>

                  <p className="mt-2 text-sm font-medium">
                    {formatMemberSince(user?.createdAt)}
                  </p>
                </div>
              </div>
            </section>

            {/* Logout */}
            <section className="border border-black/[0.08]">
              <div className="flex flex-col justify-between gap-5 p-5 md:flex-row md:items-center md:p-7">
                <div>
                  <h2 className="text-sm font-medium">
                    Sign out
                  </h2>

                  <p className="mt-1 text-xs text-black/45">
                    Sign out of your The Brand BLVD account on
                    this device.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="inline-flex h-10 items-center justify-center gap-2 border border-black px-5 text-[10px] font-semibold uppercase tracking-[0.16em] transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <LogOut size={15} />

                  {loggingOut
                    ? "Signing Out..."
                    : "Sign Out"}
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AccountSettings;