import React from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";

const About: React.FC = () => {
  return (
    <main className="bg-white text-black">

      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="relative min-h-[85vh] overflow-hidden px-6 md:px-10 lg:px-14">
        <div className="mx-auto flex min-h-[85vh] max-w-[1600px] flex-col justify-between pb-12 pt-20">

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-between"
          >
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-black/50">
              About The Brand
            </p>

            <motion.div
              animate={{ y: [0, 7, 0] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ArrowDown size={18} strokeWidth={1.2} />
            </motion.div>
          </motion.div>

          <div className="relative">
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="mb-5 text-xs uppercase tracking-[0.25em] text-black/40"
            >
              Est. 2026
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="max-w-6xl text-[16vw] font-medium leading-[0.8] tracking-[-0.08em] md:text-[13vw] lg:text-[11vw]"
            >
              WE
              <br />
              DEFINE
              <br />
              STYLE.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="absolute bottom-0 right-0 hidden max-w-xs text-sm leading-6 text-black/50 md:block"
            >
              The Brand BLVD is a modern fashion label built around
              individuality, confidence and timeless design.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-between"
          >
            <span className="text-[10px] uppercase tracking-[0.2em] text-black/40">
              Scroll To Explore
            </span>

            <span className="text-[10px] uppercase tracking-[0.2em] text-black/40">
              01 / 05
            </span>
          </motion.div>

        </div>
      </section>


      {/* =====================================================
          BRAND STATEMENT
      ===================================================== */}
      <section className="px-6 py-28 md:px-10 md:py-40 lg:px-14">
        <div className="mx-auto max-w-[1600px]">

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9 }}
            className="grid grid-cols-1 gap-12 lg:grid-cols-12"
          >
            <div className="lg:col-span-3">
              <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-black/40">
                Our Philosophy
              </p>
            </div>

            <div className="lg:col-span-8 lg:col-start-5">
              <h2 className="text-3xl font-medium leading-[1.05] tracking-[-0.04em] md:text-5xl lg:text-6xl">
                Fashion doesn't need to shout.
                <span className="text-black/30">
                  {" "}
                  It speaks through the details.
                </span>
              </h2>

              <p className="mt-10 max-w-2xl text-sm leading-7 text-black/50 md:text-base">
                We believe clothing should feel effortless. Every piece
                is designed with a focus on clean silhouettes, considered
                details and everyday versatility.
              </p>

              <p className="mt-6 max-w-2xl text-sm leading-7 text-black/50 md:text-base">
                BLVD is more than a clothing brand. It's a mindset —
                confident, understated and unapologetically individual.
              </p>
            </div>
          </motion.div>

        </div>
      </section>


      {/* =====================================================
          VISUAL PLACEHOLDER - WITH BLACK AND WHITE BACKGROUND IMAGE
      ===================================================== */}
      <section className="px-6 md:px-10 lg:px-14">
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative mx-auto flex min-h-[60vh] max-w-[1600px] items-center justify-center overflow-hidden bg-black"
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-70"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1600&auto=format&fit=crop&q=80')",
            }}
          />
          
          {/* Black Overlay for better contrast */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Content */}
          <div className="relative z-10 text-center">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">
              The Brand BLVD
            </p>

            <h3 className="mt-5 text-5xl font-medium tracking-[-0.06em] text-white md:text-8xl">
              BLVD
            </h3>

            <p className="mt-5 text-xs uppercase tracking-[0.2em] text-white/40">
              Premium Traditional & Formal Wear
            </p>
          </div>
        </motion.div>
      </section>


      {/* =====================================================
          NUMBERS
      ===================================================== */}
      <section className="px-6 py-28 md:px-10 md:py-40 lg:px-14">
        <div className="mx-auto max-w-[1600px]">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-black/40">
              BLVD By Numbers
            </p>
          </motion.div>

          <div className="mt-16 grid grid-cols-2 gap-y-16 md:grid-cols-4 md:gap-10">

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-5xl font-medium tracking-[-0.05em] md:text-7xl">
                01
              </p>
              <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-black/40">
                Vision
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <p className="text-5xl font-medium tracking-[-0.05em] md:text-7xl">
                ∞
              </p>
              <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-black/40">
                Possibilities
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-5xl font-medium tracking-[-0.05em] md:text-7xl">
                24/7
              </p>
              <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-black/40">
                Your Style
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <p className="text-5xl font-medium tracking-[-0.05em] md:text-7xl">
                BLVD
              </p>
              <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-black/40">
                Identity
              </p>
            </motion.div>

          </div>
        </div>
      </section>


      {/* =====================================================
          VALUES
      ===================================================== */}
      <section className="bg-[#f7f7f7] px-6 py-28 md:px-10 md:py-40 lg:px-14">
        <div className="mx-auto max-w-[1600px]">

          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-4"
            >
              <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-black/40">
                What We Stand For
              </p>

              <h2 className="mt-6 text-4xl font-medium tracking-[-0.05em] md:text-6xl">
                Less.
                <br />
                But Better.
              </h2>
            </motion.div>

            <div className="lg:col-span-7 lg:col-start-6">

              {[
                {
                  number: "01",
                  title: "Simplicity",
                  text: "We remove the unnecessary and focus on what matters.",
                },
                {
                  number: "02",
                  title: "Quality",
                  text: "Every detail should feel intentional, from fabric to finish.",
                },
                {
                  number: "03",
                  title: "Individuality",
                  text: "Your style belongs to you. We simply give it a foundation.",
                },
                {
                  number: "04",
                  title: "Progress",
                  text: "We constantly evolve while staying true to our identity.",
                },
              ].map((item, index) => (
                <motion.div
                  key={item.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                  }}
                  className="group flex gap-8 py-8"
                >
                  <span className="text-[10px] tracking-[0.2em] text-black/30">
                    {item.number}
                  </span>

                  <div>
                    <h3 className="text-xl font-medium tracking-[-0.02em]">
                      {item.title}
                    </h3>

                    <p className="mt-3 max-w-lg text-sm leading-6 text-black/50">
                      {item.text}
                    </p>
                  </div>

                  <ArrowRight
                    size={18}
                    strokeWidth={1.2}
                    className="ml-auto mt-1 shrink-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                </motion.div>
              ))}

            </div>
          </div>
        </div>
      </section>


      {/* =====================================================
          FINAL CTA
      ===================================================== */}
      <section className="px-6 py-32 text-center md:py-48">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-black/40">
            Ready To Define Yours?
          </p>

          <h2 className="mt-6 text-5xl font-medium tracking-[-0.06em] md:text-8xl">
            FIND YOUR
            <br />
            BLVD.
          </h2>

          <Link
            to="/shop"
            className="mt-10 inline-flex items-center gap-3 bg-black px-7 py-4 text-xs font-medium uppercase tracking-[0.2em] text-white transition-transform duration-300 hover:scale-[1.02]"
          >
            Explore Collection
            <ArrowRight size={16} strokeWidth={1.5} />
          </Link>

          <a
            href="#"
            className="mx-auto mt-10 flex w-fit items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-black/40 transition-colors hover:text-black"
          >
            <FaInstagram size={15} />
            Follow The Brand
          </a>
        </motion.div>
      </section>

    </main>
  );
};

export default About;