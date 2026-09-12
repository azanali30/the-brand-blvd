import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Backend registration baad mein connect karenge
    navigate("/");
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
            The Brand BLVD
          </p>

          <h1 className="mt-4 text-4xl font-medium tracking-[-0.04em] md:text-5xl">
            Create Account
          </h1>

          <p className="mx-auto mt-5 max-w-sm text-sm leading-6 text-black/50">
            Create your BLVD account and make every style yours.
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
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-3 block text-[10px] font-medium uppercase tracking-[0.2em]"
            >
              Full Name
            </label>

            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              required
              className="w-full bg-[#f8f8f8] px-4 py-4 text-sm outline-none transition-colors duration-300 placeholder:text-black/30 focus:bg-[#f1f1f1]"
            />
          </div>

          {/* Email */}
          <div className="mt-6">
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
              className="w-full bg-[#f8f8f8] px-4 py-4 text-sm outline-none transition-colors duration-300 placeholder:text-black/30 focus:bg-[#f1f1f1]"
            />
          </div>

          {/* Password */}
          <div className="mt-6">
            <label
              htmlFor="password"
              className="mb-3 block text-[10px] font-medium uppercase tracking-[0.2em]"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Create a password"
              required
              minLength={6}
              className="w-full bg-[#f8f8f8] px-4 py-4 text-sm outline-none transition-colors duration-300 placeholder:text-black/30 focus:bg-[#f1f1f1]"
            />
          </div>

          {/* Confirm Password */}
          <div className="mt-6">
            <label
              htmlFor="confirmPassword"
              className="mb-3 block text-[10px] font-medium uppercase tracking-[0.2em]"
            >
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              required
              minLength={6}
              className="w-full bg-[#f8f8f8] px-4 py-4 text-sm outline-none transition-colors duration-300 placeholder:text-black/30 focus:bg-[#f1f1f1]"
            />
          </div>

          {/* Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="mt-8 flex w-full items-center justify-center gap-3 bg-black px-6 py-4 text-xs font-medium uppercase tracking-[0.2em] text-white"
          >
            Create Account
            <ArrowRight size={16} strokeWidth={1.5} />
          </motion.button>
        </motion.form>

        {/* Login */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-10 text-center"
        >
          <p className="text-sm text-black/50">
            Already have an account?
          </p>

          <Link
            to="/login"
            className="mt-3 inline-block text-xs font-medium uppercase tracking-[0.18em] underline underline-offset-4 transition-opacity hover:opacity-50"
          >
            Sign In
          </Link>
        </motion.div>

      </div>
    </section>
  );
};

export default Register;
