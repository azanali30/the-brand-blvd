import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

interface ProductVariant {
  size: string;
  price: number;
  stock: number;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  images: string[];
  variants: ProductVariant[];
  colors: string[];
  isNewArrival: boolean;
  isFeatured: boolean;
  isActive: boolean;
}

const Shop = () => {
  const [searchParams] = useSearchParams();

  const selectedCategory = searchParams.get("category");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const url = selectedCategory
          ? `http://localhost:5000/api/products?category=${encodeURIComponent(
              selectedCategory
            )}`
          : "http://localhost:5000/api/products";

        const response = await fetch(url);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch products"
          );
        }

        setProducts(data.products || []);
      } catch (error) {
        console.error("Products fetch error:", error);
        setError("Unable to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  const formatCategoryName = (category?: string) => {
    if (!category) return "All Products";

    return category
      .split("-")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ");
  };

  // Get the lowest price from all product variants
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

  // Check whether different variants have different prices
  const hasMultiplePrices = (product: Product) => {
    if (
      !Array.isArray(product.variants) ||
      product.variants.length === 0
    ) {
      return false;
    }

    const prices = product.variants
      .map((variant) => Number(variant.price))
      .filter((price) => Number.isFinite(price));

    if (prices.length <= 1) {
      return false;
    }

    return Math.min(...prices) !== Math.max(...prices);
  };

  if (loading) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center bg-white">
        <p className="text-xs uppercase tracking-[0.3em] text-black">
          Loading Collection...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center bg-white">
        <p className="text-xs uppercase tracking-[0.2em] text-black">
          {error}
        </p>
      </section>
    );
  }

  return (
    <main className="bg-white text-black">
      {/* Header */}
      <section className="px-6 pb-16 pt-24 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <p className="mb-5 text-[10px] uppercase tracking-[0.35em] text-black/50">
            The Brand BLVD
          </p>

          <h1 className="text-4xl font-light uppercase tracking-[0.08em] md:text-6xl">
            {formatCategoryName(selectedCategory)}
          </h1>

          <p className="mt-6 max-w-xl text-sm leading-7 text-black/60">
            Discover our curated collection of refined
            menswear, traditional wear and timeless
            formal essentials.
          </p>
        </div>
      </section>

      {/* Product Grid */}
      <section className="px-6 pb-24 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-[0.25em] text-black/50">
              {products.length}{" "}
              {products.length === 1
                ? "Product"
                : "Products"}
            </p>

            {selectedCategory && (
              <Link
                to="/shop"
                className="text-[10px] uppercase tracking-[0.2em] transition-opacity hover:opacity-50"
              >
                View All
              </Link>
            )}
          </div>

          {products.length === 0 ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="text-center">
                <p className="text-xs uppercase tracking-[0.25em] text-black/50">
                  No products available
                </p>

                {selectedCategory && (
                  <Link
                    to="/shop"
                    className="mt-5 inline-block text-[10px] uppercase tracking-[0.2em] underline underline-offset-4"
                  >
                    View All Products
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
              {products.map((product, index) => {
                const startingPrice =
                  getStartingPrice(product);

                const differentPrices =
                  hasMultiplePrices(product);

                return (
                  <motion.div
                    key={product._id}
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
                      delay: index * 0.05,
                    }}
                  >
                    <Link
                      to={`/product/${product._id}`}
                    >
                      <div className="group">
                        {/* Image */}
                        <div className="relative aspect-[3/4] overflow-hidden bg-[#f7f7f7]">
                          {product.images?.length > 0 ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                              onError={(event) => {
                                event.currentTarget.style.display =
                                  "none";
                              }}
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <span className="text-[10px] uppercase tracking-[0.2em] text-black/30">
                                The Brand BLVD
                              </span>
                            </div>
                          )}

                          {product.isNewArrival && (
                            <span className="absolute left-3 top-3 bg-white px-3 py-2 text-[9px] uppercase tracking-[0.15em]">
                              New
                            </span>
                          )}
                        </div>

                        {/* Info */}
                        <div className="pt-4">
                          <p className="mb-2 text-[9px] uppercase tracking-[0.18em] text-black/45">
                            {formatCategoryName(
                              product.category
                            )}
                          </p>

                          <h2 className="text-xs font-medium uppercase tracking-[0.08em]">
                            {product.name}
                          </h2>

                          {/* Variant Price */}
                          {startingPrice > 0 ? (
                            <p className="mt-2 text-xs tracking-[0.05em]">
                              {differentPrices
                                ? "From "
                                : ""}
                              PKR{" "}
                              {startingPrice.toLocaleString()}
                            </p>
                          ) : (
                            <p className="mt-2 text-xs tracking-[0.05em] text-black/40">
                              Price unavailable
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Shop;   