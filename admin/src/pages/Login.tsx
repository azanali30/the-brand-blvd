import { useState, type FormEvent } from "react";
import { Lock, Mail, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://the-brand-blvd.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Invalid email or password"
        );
      }

      // Only admin can enter admin panel
      if (data.user?.role !== "admin") {
        setError(
          "Access denied. This account is not an admin account."
        );
        return;
      }

      navigate("/");
    } catch (error) {
      console.error("Admin login error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to login"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f7f7] px-6">
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
          ease: "easeOut",
        }}
        className="w-full max-w-md"
      >
        {/* Brand */}
        <div className="mb-10 text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-black/45">
            The Brand BLVD
          </p>

          <h1 className="mt-4 text-3xl font-light uppercase tracking-[0.08em]">
            Admin Portal
          </h1>

          <p className="mt-3 text-xs text-black/45">
            Sign in to manage your store
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white p-7 shadow-[0_20px_60px_rgba(0,0,0,0.06)] md:p-9">
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Email */}
            <div>
              <label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.18em] text-black/55">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={16}
                  strokeWidth={1.5}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-black/35"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="admin@example.com"
                  required
                  autoComplete="email"
                  className="w-full bg-[#f7f7f7] py-4 pl-11 pr-4 text-sm outline-none transition focus:bg-[#f1f1f1]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.18em] text-black/55">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={16}
                  strokeWidth={1.5}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-black/35"
                />

                <input
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="w-full bg-[#f7f7f7] py-4 pl-11 pr-4 text-sm outline-none transition focus:bg-[#f1f1f1]"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-black px-4 py-3 text-xs leading-5 text-white">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 bg-black py-4 text-[10px] font-medium uppercase tracking-[0.2em] text-white transition hover:bg-black/85 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                "Signing In..."
              ) : (
                <>
                  Sign In
                  <ArrowRight
                    size={15}
                    strokeWidth={1.5}
                  />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-[10px] uppercase tracking-[0.15em] text-black/30">
          The Brand BLVD · Administration
        </p>
      </motion.div>
    </main>
  );
};

export default Login;