import { motion } from "framer-motion";
import { FaInstagram } from "react-icons/fa";

import {
  ArrowRight,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

const Contact = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Backend/contact API baad mein connect karenge
    console.log("Message submitted");
  };

  return (
    <section className="bg-white text-black">
      {/* Header */}
      <div className="mx-auto max-w-[1600px] px-6 pb-16 pt-20 md:px-10 md:pb-20 md:pt-28 lg:px-14">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-black/50">
            Get In Touch
          </p>

          <h1 className="mt-5 text-5xl font-medium tracking-[-0.05em] md:text-7xl lg:text-8xl">
            Contact Us.
          </h1>

          <p className="mt-7 max-w-xl text-sm leading-7 text-black/50 md:text-base">
            Have a question about your order, our products, or The Brand
            BLVD? We'd love to hear from you.
          </p>
        </motion.div>
      </div>

      {/* Contact Content */}
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-16 px-6 pb-28 md:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24 lg:px-14">

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-black/50">
            Information
          </p>

          <div className="mt-10 space-y-9">

            {/* Email */}
            <div className="flex items-start gap-5">
              <Mail
                size={20}
                strokeWidth={1.5}
                className="mt-1 shrink-0"
              />

              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em]">
                  Email
                </p>

                <a
                  href="mailto:hello@thebrandblvd.com"
                  className="mt-2 block text-sm text-black/50 transition-colors hover:text-black"
                >
                  hello@thebrandblvd.com
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-5">
              <Phone
                size={20}
                strokeWidth={1.5}
                className="mt-1 shrink-0"
              />

              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em]">
                  Phone
                </p>

                <a
                  href="tel:+0000000000"
                  className="mt-2 block text-sm text-black/50 transition-colors hover:text-black"
                >
                  +00 000 000 000
                </a>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-5">
              <MapPin
                size={20}
                strokeWidth={1.5}
                className="mt-1 shrink-0"
              />

              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em]">
                  Studio
                </p>

                <p className="mt-2 max-w-xs text-sm leading-6 text-black/50">
                  The Brand BLVD
                  <br />
                  Karachi, Pakistan
                </p>
              </div>
            </div>

            {/* Social */}
            <div className="pt-5">
              <p className="text-xs font-medium uppercase tracking-[0.18em]">
                Follow Us
              </p>

              <a
                href="#"
                className="mt-5 flex w-fit items-center gap-3 text-sm text-black/50 transition-colors hover:text-black"
              >

                <FaInstagram size={19} />                
                Instagram
              </a>
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-black/50">
            Send A Message
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-10"
          >
            {/* Name + Email */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

              <div>
                <label
                  htmlFor="name"
                  className="mb-3 block text-[10px] font-medium uppercase tracking-[0.2em]"
                >
                  Name
                </label>

                <input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  required
                  className="w-full bg-[#f8f8f8] px-4 py-4 text-sm outline-none transition-colors duration-300 placeholder:text-black/30 focus:bg-[#f1f1f1]"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-3 block text-[10px] font-medium uppercase tracking-[0.2em]"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="Your email"
                  required
                  className="w-full bg-[#f8f8f8] px-4 py-4 text-sm outline-none transition-colors duration-300 placeholder:text-black/30 focus:bg-[#f1f1f1]"
                />
              </div>

            </div>

            {/* Subject */}
            <div className="mt-6">
              <label
                htmlFor="subject"
                className="mb-3 block text-[10px] font-medium uppercase tracking-[0.2em]"
              >
                Subject
              </label>

              <input
                id="subject"
                type="text"
                placeholder="What can we help you with?"
                required
                className="w-full bg-[#f8f8f8] px-4 py-4 text-sm outline-none transition-colors duration-300 placeholder:text-black/30 focus:bg-[#f1f1f1]"
              />
            </div>

            {/* Message */}
            <div className="mt-6">
              <label
                htmlFor="message"
                className="mb-3 block text-[10px] font-medium uppercase tracking-[0.2em]"
              >
                Message
              </label>

              <textarea
                id="message"
                rows={7}
                placeholder="Write your message..."
                required
                className="w-full resize-none bg-[#f8f8f8] px-4 py-4 text-sm outline-none transition-colors duration-300 placeholder:text-black/30 focus:bg-[#f1f1f1]"
              />
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="mt-8 flex w-full items-center justify-center gap-3 bg-black px-6 py-5 text-xs font-medium uppercase tracking-[0.2em] text-white md:w-auto md:min-w-[220px]"
            >
              Send Message
              <ArrowRight size={16} strokeWidth={1.5} />
            </motion.button>
          </form>
        </motion.div>
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-[#f8f8f8] px-6 py-20 text-center md:py-28"
      >
        <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-black/40">
          The Brand BLVD
        </p>

        <h2 className="mt-5 text-3xl font-medium tracking-[-0.04em] md:text-5xl">
          We're here to help.
        </h2>

        <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-black/50">
          Whether it's styling advice or help with an order, our team is
          always ready to assist.
        </p>
      </motion.div>
    </section>
  );
};

export default Contact;
