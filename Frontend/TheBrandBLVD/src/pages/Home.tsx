import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ProductVariant {
  size: string;
  price: number;
  stock: number;
}

interface Product {
  _id: string;
  name: string;
  images: string[];
  category: string;
  variants: ProductVariant[];
  isFeatured: boolean;
  isActive: boolean;
  isNewArrival: boolean;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  group: string;
  description?: string;
  image?: string;
  isActive: boolean;
}

const API_URL = "https://the-brand-blvd.onrender.com";

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] =
    useState(true);

  const [error, setError] = useState("");
  const [categoriesError, setCategoriesError] =
    useState("");

  // =========================================================
  // PRODUCT HELPERS
  // =========================================================

  const getTotalStock = (product: Product) => {
    if (!Array.isArray(product.variants)) {
      return 0;
    }

    return product.variants.reduce(
      (total, variant) =>
        total + Number(variant.stock || 0),
      0
    );
  };

  const getStartingPrice = (product: Product) => {
    if (
      !Array.isArray(product.variants) ||
      product.variants.length === 0
    ) {
      return 0;
    }

    const prices = product.variants
      .map((variant) => Number(variant.price))
      .filter(
        (price) =>
          Number.isFinite(price) && price >= 0
      );

    if (prices.length === 0) {
      return 0;
    }

    return Math.min(...prices);
  };

  const getMaximumPrice = (product: Product) => {
    if (
      !Array.isArray(product.variants) ||
      product.variants.length === 0
    ) {
      return 0;
    }

    const prices = product.variants
      .map((variant) => Number(variant.price))
      .filter(
        (price) =>
          Number.isFinite(price) && price >= 0
      );

    if (prices.length === 0) {
      return 0;
    }

    return Math.max(...prices);
  };

  // =========================================================
  // FETCH PRODUCTS + CATEGORIES
  // =========================================================

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        setCategoriesLoading(true);

        const [
          productsResponse,
          categoriesResponse,
        ] = await Promise.all([
          fetch(`${API_URL}/api/products`, {
            method: "GET",
          }),

          fetch(`${API_URL}/api/categories`, {
            method: "GET",
          }),
        ]);

        // =====================================================
        // PRODUCTS
        // =====================================================

        const productsData =
          await productsResponse.json();

        if (!productsResponse.ok) {
          throw new Error(
            productsData?.message ||
              "Failed to fetch products."
          );
        }

        const productList =
          Array.isArray(productsData.products)
            ? productsData.products
            : Array.isArray(productsData.data)
            ? productsData.data
            : Array.isArray(productsData)
            ? productsData
            : [];

        setProducts(productList);

        // =====================================================
        // CATEGORIES
        // =====================================================

        const categoriesData =
          await categoriesResponse.json();

        if (!categoriesResponse.ok) {
          throw new Error(
            categoriesData?.message ||
              "Failed to fetch categories."
          );
        }

        const categoryList =
          Array.isArray(categoriesData.categories)
            ? categoriesData.categories
            : Array.isArray(categoriesData.data)
            ? categoriesData.data
            : Array.isArray(categoriesData)
            ? categoriesData
            : [];

        setCategories(categoryList);
      } catch (error) {
        console.error(
          "Failed to fetch home data:",
          error
        );

        setError("Unable to load products.");

        setCategoriesError(
          "Unable to load categories."
        );
      } finally {
        setLoading(false);
        setCategoriesLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // =========================================================
  // ACTIVE PRODUCTS
  // =========================================================

  const activeProducts = products.filter(
    (product) => product.isActive
  );

  // =========================================================
  // FEATURED PRODUCTS
  // =========================================================

  const featuredProducts = activeProducts
    .filter((product) => product.isFeatured)
    .slice(0, 8);

  // =========================================================
  // ACTIVE CATEGORIES
  // ONLY FIRST 3 ACTIVE CATEGORIES
  // =========================================================

  const activeCategories = categories
    .filter((category) => category.isActive)
    .slice(0, 3);

  return (
    <main className="bg-white text-black">

      {/* =====================================================
          HERO SECTION
      ===================================================== */}

      <section className="relative flex min-h-[calc(100vh-80px)] items-center overflow-hidden px-6 md:px-10 lg:px-14">
        <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-8">

          {/* LEFT CONTENT */}
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            className="max-w-xl"
          >
            <p className="mb-6 text-xs font-medium uppercase tracking-[0.3em] text-black/50">
              The Brand BLVD
            </p>

            <h1 className="text-5xl font-medium uppercase leading-[0.9] tracking-[-0.05em] sm:text-7xl lg:text-[90px]">
              Define
              <br />
              Your Elegance.
            </h1>

            <p className="mt-8 max-w-md text-sm leading-6 text-black/60">
              Premium traditional and formal wear
              for the modern gentleman. From
              timeless shalwar kameez to exquisite
              sherwanis and groom collections.
            </p>

            <Link
              to="/shop"
              className="mt-10 inline-flex items-center gap-3 bg-black px-7 py-4 text-xs font-medium uppercase tracking-[0.2em] text-white transition-transform duration-300 hover:scale-[1.02]"
            >
              Shop Collection

              <ArrowRight
                size={16}
                strokeWidth={1.5}
              />
            </Link>
          </motion.div>

          {/* RIGHT HERO IMAGE */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.9,
              ease: "easeOut",
            }}
            className="relative aspect-[3/4] w-full overflow-hidden bg-[#f9f9f9] lg:aspect-[4/5]"
          >
            <img
              src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1400&auto=format&fit=crop&q=85"
              alt="The Brand BLVD - Premium Men's Fashion"
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-black/5" />
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          CATEGORIES
      ===================================================== */}

      <section
        id="categories"
        className="px-6 py-24 md:px-10 md:py-32 lg:px-14"
      >
        <div className="mx-auto max-w-[1600px]">

          {/* HEADER */}
          <div className="mb-14 flex items-end justify-between">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.25em] text-black/50">
                Explore
              </p>

              <h2 className="text-3xl font-medium uppercase tracking-tight md:text-5xl">
                Categories
              </h2>
            </div>

            <Link
              to="/shop"
              className="hidden items-center gap-2 text-xs uppercase tracking-[0.18em] sm:flex"
            >
              View All

              <ArrowRight
                size={15}
                strokeWidth={1.5}
              />
            </Link>
          </div>

          {/* CATEGORY LOADING */}
          {categoriesLoading && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {Array.from({ length: 3 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="aspect-[4/5] animate-pulse bg-[#f5f5f5]"
                  />
                )
              )}
            </div>
          )}

          {/* CATEGORY ERROR */}
          {!categoriesLoading &&
            categoriesError && (
              <div className="py-20 text-center">
                <p className="text-sm text-black/50">
                  {categoriesError}
                </p>
              </div>
            )}

          {/* CATEGORY GRID */}
          {!categoriesLoading &&
            !categoriesError && (
              <>
                {activeCategories.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {activeCategories.map(
                      (category, index) => (
                        <Link
                          key={category._id}
                          to={`/shop?category=${encodeURIComponent(
                            category.slug
                          )}`}
                        >
                          <motion.div
                            initial={{
                              opacity: 0,
                              y: 20,
                            }}
                            whileInView={{
                              opacity: 1,
                              y: 0,
                            }}
                            viewport={{
                              once: true,
                            }}
                            transition={{
                              duration: 0.5,
                              delay: index * 0.1,
                            }}
                            whileHover={{
                              scale: 1.01,
                            }}
                            className="group relative aspect-[4/5] overflow-hidden bg-[#f9f9f9]"
                          >

                            {/* =================================================
                                CATEGORY IMAGE FROM DATABASE
                            ================================================= */}

                            {category.image ? (
                              <img
                                src={category.image}
                                alt={category.name}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                                onError={(event) => {
                                  event.currentTarget.style.display =
                                    "none";
                                }}
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-[#f5f5f5]">
                                <span className="text-xs uppercase tracking-[0.2em] text-black/30">
                                  No Image
                                </span>
                              </div>
                            )}

                            {/* GRADIENT */}
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                            {/* CATEGORY INFO */}
                            <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                              <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                                {category.group ||
                                  "Collection"}
                              </p>

                              <div className="mt-2 flex items-end justify-between gap-4">
                                <h3 className="text-2xl font-medium uppercase tracking-tight">
                                  {category.name}
                                </h3>

                                <ArrowRight
                                  size={20}
                                  strokeWidth={1.3}
                                  className="shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                                />
                              </div>
                            </div>
                          </motion.div>
                        </Link>
                      )
                    )}
                  </div>
                ) : (
                  <div className="py-20 text-center">
                    <p className="text-sm text-black/50">
                      No categories available.
                    </p>
                  </div>
                )}
              </>
            )}
        </div>
      </section>

      {/* =====================================================
          FEATURED PRODUCTS
      ===================================================== */}

      <section className="px-6 py-24 md:px-10 md:py-32 lg:px-14">
        <div className="mx-auto max-w-[1600px]">

          {/* HEADER */}
          <div className="mb-14">
            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-black/50">
              Just In
            </p>

            <h2 className="text-3xl font-medium uppercase tracking-tight md:text-5xl">
              Featured Collection
            </h2>
          </div>

          {/* PRODUCT LOADING */}
          {loading && (
            <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map(
                (_, index) => (
                  <div key={index}>
                    <div className="aspect-[3/4] animate-pulse bg-[#f9f9f9]" />

                    <div className="mt-4 h-3 w-2/3 animate-pulse bg-[#f9f9f9]" />

                    <div className="mt-2 h-3 w-1/3 animate-pulse bg-[#f9f9f9]" />
                  </div>
                )
              )}
            </div>
          )}

          {/* PRODUCT ERROR */}
          {!loading && error && (
            <div className="py-20 text-center">
              <p className="text-sm text-black/50">
                {error}
              </p>
            </div>
          )}

          {/* PRODUCT GRID */}
          {!loading && !error && (
            <>
              {featuredProducts.length > 0 ? (
                <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
                  {featuredProducts.map(
                    (product, index) => {
                      const totalStock =
                        getTotalStock(product);

                      const startingPrice =
                        getStartingPrice(product);

                      const maximumPrice =
                        getMaximumPrice(product);

                      const isSoldOut =
                        totalStock === 0;

                      const hasMultiplePrices =
                        maximumPrice !==
                          startingPrice &&
                        maximumPrice > 0;

                      return (
                        <Link
                          key={product._id}
                          to={`/product/${product._id}`}
                        >
                          <motion.div
                            initial={{
                              opacity: 0,
                              y: 20,
                            }}
                            whileInView={{
                              opacity: 1,
                              y: 0,
                            }}
                            viewport={{
                              once: true,
                            }}
                            transition={{
                              duration: 0.5,
                              delay: index * 0.1,
                            }}
                            className="group cursor-pointer"
                          >

                            {/* PRODUCT IMAGE */}
                            <div className="relative aspect-[3/4] overflow-hidden bg-[#f9f9f9]">
                              <motion.img
                                whileHover={{
                                  scale: 1.03,
                                }}
                                transition={{
                                  duration: 0.5,
                                  ease: "easeInOut",
                                }}
                                src={
                                  product.images?.[0] ||
                                  ""
                                }
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />

                              {/* NEW BADGE */}
                              {product.isNewArrival && (
                                <span className="absolute left-3 top-3 bg-white px-3 py-1 text-[10px] font-medium uppercase tracking-[0.15em]">
                                  New
                                </span>
                              )}

                              {/* SOLD OUT */}
                              {isSoldOut && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                  <span className="bg-white px-4 py-2 text-[10px] font-medium uppercase tracking-[0.15em]">
                                    Sold Out
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* PRODUCT INFO */}
                            <div className="mt-4">
                              <h3 className="text-xs font-medium uppercase tracking-[0.12em]">
                                {product.name}
                              </h3>

                              <p className="mt-1 text-sm text-black/60">
                                {product.category}
                              </p>

                              {/* PRICE */}
                              {startingPrice > 0 ? (
                                <p className="mt-1 text-sm font-medium">
                                  {hasMultiplePrices
                                    ? "From "
                                    : ""}
                                  PKR{" "}
                                  {startingPrice.toLocaleString()}
                                </p>
                              ) : (
                                <p className="mt-1 text-sm text-black/40">
                                  Price unavailable
                                </p>
                              )}
                            </div>
                          </motion.div>
                        </Link>
                      );
                    }
                  )}
                </div>
              ) : (
                <div className="py-20 text-center">
                  <p className="text-sm text-black/50">
                    No featured products available.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* =====================================================
          CTA SECTION
      ===================================================== */}

      <section className="px-6 py-32 md:px-10 lg:px-14">
        <motion.div
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.8,
          }}
          className="mx-auto max-w-[1600px] text-center"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-black/50">
            The Brand BLVD
          </p>

          <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-medium uppercase leading-none tracking-tight md:text-6xl">
            Less Noise.
            <br />
            More Elegance.
          </h2>

          <Link
            to="/shop"
            className="mt-10 inline-flex bg-black px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-white transition-transform duration-300 hover:scale-[1.02]"
          >
            Explore Collection
          </Link>
        </motion.div>
      </section>
    </main>
  );
};

export default Home;