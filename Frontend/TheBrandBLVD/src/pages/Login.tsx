import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";




const Login = () => {

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

  const navigate = useNavigate();

  const { refreshUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
    window.location.href = "https://the-brand-blvd.onrender.com/api/auth/google";

  setLoading(true);
  setError("");

  try {
    const response = await fetch("https://the-brand-blvd.onrender.com/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
  setError(data.message || "Login failed");
  return;
}

console.log("Login successful:", data);

await refreshUser();

navigate("/");
  } catch (error) {
    console.error("Login error:", error);
    setError("Unable to connect to the server");
  } finally {
    setLoading(false);
  }
};

  const handleGoogleLogin = () => {
    // Google authentication backend mein baad mein connect karenge
  window.location.href = "https://the-brand-blvd.onrender.com/api/auth/google";
  };

  return (
    <section className="min-h-[80vh] bg-white px-6 py-16 text-black md:px-10 lg:px-14">
      <div className="mx-auto flex min-h-[70vh] max-w-[520px] flex-col justify-center">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-black/50">
            Welcome Back
          </p>

          <h1 className="mt-4 text-4xl font-medium tracking-[-0.04em] md:text-5xl">
            Sign In
          </h1>

          <p className="mx-auto mt-5 max-w-sm text-sm leading-6 text-black/50">
            Sign in to your account to continue your BLVD experience.
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-12"
        >
          {/* Google Login */}
          <motion.button
            type="button"
            onClick={handleGoogleLogin}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="flex w-full items-center justify-center gap-3 bg-[#f8f8f8] px-6 py-4 text-xs font-medium uppercase tracking-[0.18em] text-black transition-colors duration-300 hover:bg-[#f1f1f1]"
          >
            {/* Google Icon */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.805 10.023H12v3.955h5.635c-.595 2.1-2.386 3.56-5.635 3.56a5.538 5.538 0 1 1 0-11.076c1.58 0 2.99.595 4.095 1.57l2.88-2.88C17.205 3.315 14.81 2.25 12 2.25a9.75 9.75 0 1 0 0 19.5c5.625 0 9.375-3.75 9.375-9.375 0-.795-.09-1.59-.195-2.352h.625Z"
                fill="currentColor"
              />
            </svg>

            Continue With Google
          </motion.button>

          {/* Divider */}
          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-black/10" />

            <span className="text-[9px] uppercase tracking-[0.2em] text-black/40">
              Or
            </span>

            <div className="h-px flex-1 bg-black/10" />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-3 block text-[10px] font-medium uppercase tracking-[0.2em]"
            >
              Email Address
            </label>

            <input
  id="email"
  type="email"
  placeholder="Enter your email"
  required
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="w-full bg-[#f8f8f8] px-4 py-4 text-sm outline-none transition-colors duration-300 placeholder:text-black/30 focus:bg-[#f1f1f1]"
/>
          </div>

          {/* Password */}
          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-[10px] font-medium uppercase tracking-[0.2em]"
              >
                Password
              </label>

              <button
                type="button"
                className="text-[10px] uppercase tracking-[0.12em] text-black/50 transition-colors hover:text-black"
              >
                Forgot Password?
              </button>
            </div>

            <input
  id="password"
  type="password"
  placeholder="Enter your password"
  required
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  className="w-full bg-[#f8f8f8] px-4 py-4 text-sm outline-none transition-colors duration-300 placeholder:text-black/30 focus:bg-[#f1f1f1]"
/>
          </div>

          {/* Sign In Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="mt-8 flex w-full items-center justify-center gap-3 bg-black px-6 py-4 text-xs font-medium uppercase tracking-[0.2em] text-white"
          >
            Sign In
            <ArrowRight size={16} strokeWidth={1.5} />
          </motion.button>
        </motion.form>

        {/* Register */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-10 text-center"
        >
          <p className="text-sm text-black/50">
            Don't have an account?
          </p>

          <Link
            to="/register"
            className="mt-3 inline-block text-xs font-medium uppercase tracking-[0.18em] underline underline-offset-4 transition-opacity hover:opacity-50"
          >
            Create Account
          </Link>
        </motion.div>

      </div>
    </section>
  );
};

export default Login;
