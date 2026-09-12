import React from "react";
import { motion } from "framer-motion";
import { FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";
import { ArrowUp } from "lucide-react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-white text-black">

      {/* Main Footer */}
      <div className="mx-auto max-w-[1600px] px-6 pb-12 pt-24 md:px-10 lg:px-14">

        {/* Top Section */}
        <div className="grid grid-cols-1 gap-14 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block">
              <div className="flex items-center gap-2">
            <img
              src="/Logo.png"
              alt="The Brand BLVD"
              className="h-10 w-auto object-contain"
            />
                <span className="text-xl font-light tracking-[0.2em] uppercase">
                  BLVD
                </span>
              </div>
            </Link>

            <p className="mt-7 max-w-md text-sm leading-6 text-black/60">
              Premium traditional and formal wear for the modern gentleman.
              From timeless shalwar kameez to exquisite sherwanis and groom collections.
            </p>

            {/* Newsletter */}
            <div className="mt-10 max-w-md">
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em]">
                Join The BLVD
              </p>

              <div className="flex items-center gap-4">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full bg-[#f9f9f9] px-4 py-4 text-sm text-black outline-none placeholder:text-black/40"
                />

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="shrink-0 bg-black px-6 py-4 text-xs font-medium uppercase tracking-[0.15em] text-white transition-colors hover:bg-black/90"
                >
                  Join
                </motion.button>
              </div>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-xs font-medium uppercase tracking-[0.2em]">
              Shop
            </h3>

            <div className="mt-6 flex flex-col gap-4">
              <Link
                to="/shop"
                className="w-fit text-sm text-black/60 transition-colors duration-300 hover:text-black"
              >
                All Products
              </Link>

              <Link
                to="/#collection"
                className="w-fit text-sm text-black/60 transition-colors duration-300 hover:text-black"
              >
                Collection
              </Link>

              <Link
                to="/shop?category=new-arrivals"
                className="w-fit text-sm text-black/60 transition-colors duration-300 hover:text-black"
              >
                New Arrivals
              </Link>

              <Link
                to="/shop?category=best-sellers"
                className="w-fit text-sm text-black/60 transition-colors duration-300 hover:text-black"
              >
                Best Sellers
              </Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-medium uppercase tracking-[0.2em]">
              The Brand
            </h3>

            <div className="mt-6 flex flex-col gap-4">
              <Link
                to="/about"
                className="w-fit text-sm text-black/60 transition-colors duration-300 hover:text-black"
              >
                About Us
              </Link>

              <Link
                to="/contact"
                className="w-fit text-sm text-black/60 transition-colors duration-300 hover:text-black"
              >
                Contact
              </Link>

              <Link
                to="/orders"
                className="w-fit text-sm text-black/60 transition-colors duration-300 hover:text-black"
              >
                My Orders
              </Link>

              <Link
                to="/login"
                className="w-fit text-sm text-black/60 transition-colors duration-300 hover:text-black"
              >
                My Account
              </Link>
            </div>
          </div>
        </div>

        {/* Middle Section */}
        <div className="mt-24 flex flex-col justify-between gap-8 md:flex-row md:items-end">

          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-black/40">
              Follow The Brand BLVD
            </p>

            <div className="mt-5 flex items-center gap-5">

              <motion.a
                href="#"
                whileHover={{ y: -2 }}
                aria-label="Instagram"
                className="text-black/60 transition-colors hover:text-black"
              >
                <FaInstagram size={19} />
              </motion.a>

              <motion.a
                href="#"
                whileHover={{ y: -2 }}
                aria-label="Facebook"
                className="text-black/60 transition-colors hover:text-black"
              >
                <FaFacebook size={19} />
              </motion.a>

              <motion.a
                href="#"
                whileHover={{ y: -2 }}
                aria-label="Twitter"
                className="text-black/60 transition-colors hover:text-black"
              >
                <FaTwitter size={19} />
              </motion.a>

            </div>
          </div>

          {/* Back To Top */}
          <motion.button
            onClick={scrollToTop}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
            className="flex w-fit items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-black/60 transition-colors hover:text-black"
          >
            Back To Top
            <ArrowUp size={16} strokeWidth={1.5} />
          </motion.button>

        </div>

        {/* Bottom */}
        <div className="mt-20 flex flex-col justify-between gap-5 md:flex-row md:items-center">

          <p className="text-[10px] uppercase tracking-[0.15em] text-black/40">
            © {new Date().getFullYear()} The Brand BLVD. All Rights Reserved.
          </p>

          <div className="flex gap-6">
            <Link
              to="/privacy"
              className="text-[10px] uppercase tracking-[0.15em] text-black/40 transition-colors hover:text-black"
            >
              Privacy
            </Link>

            <Link
              to="/terms"
              className="text-[10px] uppercase tracking-[0.15em] text-black/40 transition-colors hover:text-black"
            >
              Terms
            </Link>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;