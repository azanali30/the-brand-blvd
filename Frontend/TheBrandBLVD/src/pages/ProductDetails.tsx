import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ArrowLeft, Minus, Plus } from "lucide-react";
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
}

const ProductDetails = () => {
  const navigate = useNavigate();
  const { refreshCart } = useCart();

  const { id } = useParams<{ id: string }>();

  const [cartLoading, setCartLoading] = useState(false);
  const [cartMessage, setCartMessage] = useState("");

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  /*
   * Get currently selected variant
   */
  const selectedVariant = product?.variants?.find(
    (variant) => variant.size === selectedSize
  );

  /*
   * Selected variant stock
   */
  const selectedStock = selectedVariant?.stock ?? 0;

  /*
   * Selected variant price
   */
  const selectedPrice = selectedVariant?.price ?? 0;

  /*
   * Add product to cart
   */
  const handleAddToCart = async () => {
    if (!product) return;

    if (!selectedVariant) {
      setCartMessage("Please select a size.");
      return;
    }

    if (selectedStock <= 0) {
      setCartMessage("Selected size is out of stock.");
      return;
    }

    if (quantity > selectedStock) {
      setCartMessage(
        `Only ${selectedStock} item${
          selectedStock === 1 ? "" : "s"
        } available.`
      );
      return;
    }

    try {
      setCartLoading(true);
      setCartMessage("");

      const response = await fetch(
        "https://the-brand-blvd.onrender.com/api/cart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            productId: product._id,
            quantity,
            size: selectedSize,
            color: selectedColor,
          }),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        navigate("/login");
        return;
      }

      if (!response.ok) {
        setCartMessage(
          data.message || "Failed to add product to cart"
        );
        return;
      }

      await refreshCart();

      setCartMessage("Added to cart successfully");
    } catch (error) {
      console.error("Add to cart error:", error);
      setCartMessage("Something went wrong");
    } finally {
      setCartLoading(false);
    }
  };

  /*
   * Fetch product
   */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `https://the-brand-blvd.onrender.com/api/products/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Product not found"
          );
        }

        const fetchedProduct: Product = data.product;

        setProduct(fetchedProduct);
        setSelectedImage(0);
        setQuantity(1);

        /*
         * Select first available size automatically
         */
        if (fetchedProduct.variants?.length > 0) {
          const firstAvailableVariant =
            fetchedProduct.variants.find(
              (variant) => variant.stock > 0
            );

          setSelectedSize(
            firstAvailableVariant?.size ||
              fetchedProduct.variants[0].size
          );
        } else {
          setSelectedSize("");
        }

        /*
         * Select first color automatically
         */
        if (fetchedProduct.colors?.length > 0) {
          setSelectedColor(
            fetchedProduct.colors[0]
          );
        } else {
          setSelectedColor("");
        }
      } catch (error) {
        console.error("Product fetch error:", error);

        setError("Product could not be loaded.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  /*
   * When size changes, reset quantity
   */
  useEffect(() => {
    setQuantity(1);
    setCartMessage("");
  }, [selectedSize]);

  /*
   * Quantity controls
   */
  const decreaseQuantity = () => {
    setQuantity((current) =>
      Math.max(1, current - 1)
    );
  };

  const increaseQuantity = () => {
    setQuantity((current) =>
      Math.min(selectedStock, current + 1)
    );
  };

  /*
   * Loading
   */
  if (loading) {
    return (
      <main className="flex min-h-[80vh] items-center justify-center bg-white">
        <p className="text-xs uppercase tracking-[0.3em]">
          Loading Product...
        </p>
      </main>
    );
  }

  /*
   * Error
   */
  if (error || !product) {
    return (
      <main className="flex min-h-[80vh] flex-col items-center justify-center bg-white px-6">
        <p className="mb-6 text-xs uppercase tracking-[0.2em]">
          {error || "Product not found"}
        </p>

        <Link
          to="/shop"
          className="text-[10px] uppercase tracking-[0.2em] underline underline-offset-8"
        >
          Back To Shop
        </Link>
      </main>
    );
  }

  return (
    <main className="bg-white text-black">
      {/* Back */}
      <div className="px-6 pt-8 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-black/50 transition-colors hover:text-black"
          >
            <ArrowLeft
              size={14}
              strokeWidth={1.5}
            />

            Back To Shop
          </Link>
        </div>
      </div>

      {/* Product */}
      <section className="px-6 pb-24 pt-10 md:px-12 lg:px-20 lg:pt-16">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Product Gallery */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            {/* Main Image */}
            <div className="overflow-hidden bg-[#f7f7f7]">
              <div className="aspect-[3/4]">
                {product.images?.length > 0 ? (
                  <motion.img
                    key={
                      product.images[selectedImage]
                    }
                    src={
                      product.images[selectedImage]
                    }
                    alt={product.name}
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="text-xs uppercase tracking-[0.2em] text-black/30">
                      The Brand BLVD
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {product.images.map(
                  (image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() =>
                        setSelectedImage(index)
                      }
                      className={`relative h-24 w-20 shrink-0 overflow-hidden bg-[#f7f7f7] transition ${
                        selectedImage === index
                          ? "ring-1 ring-black"
                          : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${
                          index + 1
                        }`}
                        className="h-full w-full object-cover"
                      />

                      {selectedImage ===
                        index && (
                        <div className="absolute inset-0 ring-1 ring-inset ring-black" />
                      )}
                    </button>
                  )
                )}
              </div>
            )}
          </motion.div>

          {/* Information */}
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
              duration: 0.6,
            }}
            className="flex flex-col justify-center"
          >
            {/* Category */}
            <p className="text-[10px] uppercase tracking-[0.3em] text-black/45">
              {product.category}
            </p>

            {/* Product Name */}
            <h1 className="mt-5 text-3xl font-light uppercase tracking-[0.08em] md:text-4xl">
              {product.name}
            </h1>

            {/* Dynamic Price */}
            <p className="mt-6 text-lg tracking-[0.05em]">
              {selectedVariant
                ? `PKR ${selectedPrice.toLocaleString()}`
                : "Select a size"}
            </p>

            <div className="my-8 h-px bg-black/10" />

            {/* Description */}
            <p className="max-w-lg text-sm leading-7 text-black/60">
              {product.description}
            </p>

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div className="mt-10">
                <p className="mb-4 text-[10px] uppercase tracking-[0.2em]">
                  Color
                </p>

                <div className="flex flex-wrap gap-3">
                  {product.colors.map(
                    (color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() =>
                          setSelectedColor(color)
                        }
                        className={`px-5 py-3 text-[10px] uppercase tracking-[0.15em] transition ${
                          selectedColor ===
                          color
                            ? "bg-black text-white"
                            : "bg-[#f5f5f5] text-black hover:bg-[#ebebeb]"
                        }`}
                      >
                        {color}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.variants?.length > 0 && (
              <div className="mt-8">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-[0.2em]">
                    Size
                  </p>

                  {selectedVariant && (
                    <p className="text-[9px] uppercase tracking-[0.15em] text-black/40">
                      {selectedStock > 0
                        ? `${selectedStock} available`
                        : "Out of stock"}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  {product.variants.map(
                    (variant) => {
                      const isSelected =
                        selectedSize ===
                        variant.size;

                      const isOutOfStock =
                        variant.stock <= 0;

                      return (
                        <button
                          key={variant.size}
                          type="button"
                          disabled={
                            isOutOfStock
                          }
                          onClick={() =>
                            setSelectedSize(
                              variant.size
                            )
                          }
                          className={`relative min-w-14 px-4 py-3 text-[10px] uppercase tracking-[0.15em] transition ${
                            isSelected
                              ? "bg-black text-white"
                              : isOutOfStock
                              ? "cursor-not-allowed bg-[#f5f5f5] text-black/25"
                              : "bg-[#f5f5f5] text-black hover:bg-[#ebebeb]"
                          }`}
                        >
                          {variant.size}

                          {isOutOfStock && (
                            <span className="absolute left-1/2 top-1/2 h-px w-full -translate-x-1/2 -translate-y-1/2 rotate-45 bg-black/20" />
                          )}
                        </button>
                      );
                    }
                  )}
                </div>

                {/* Selected variant info */}
                {selectedVariant && (
                  <div className="mt-4 flex items-center gap-5 text-[9px] uppercase tracking-[0.15em] text-black/40">
                    <span>
                      Price: PKR{" "}
                      {selectedPrice.toLocaleString()}
                    </span>

                    <span>
                      Stock: {selectedStock}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* No variants */}
            {product.variants?.length === 0 && (
              <div className="mt-8 bg-[#f7f7f7] px-4 py-4">
                <p className="text-[9px] uppercase tracking-[0.15em] text-black/45">
                  No size variants available
                </p>
              </div>
            )}

            {/* Quantity */}
            <div className="mt-8">
              <p className="mb-4 text-[10px] uppercase tracking-[0.2em]">
                Quantity
              </p>

              <div className="flex w-fit items-center bg-[#f5f5f5]">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={
                    quantity <= 1 ||
                    selectedStock <= 0
                  }
                  className="p-4 transition hover:bg-[#ebebeb] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <Minus
                    size={14}
                    strokeWidth={1.5}
                  />
                </button>

                <span className="w-12 text-center text-xs">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={
                    !selectedVariant ||
                    quantity >= selectedStock
                  }
                  className="p-4 transition hover:bg-[#ebebeb] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <Plus
                    size={14}
                    strokeWidth={1.5}
                  />
                </button>
              </div>
            </div>

            {/* Stock */}
            <p className="mt-6 text-[9px] uppercase tracking-[0.18em] text-black/45">
              {!selectedVariant
                ? "Select a size"
                : selectedStock > 0
                ? `${selectedStock} ${
                    selectedStock === 1
                      ? "item"
                      : "items"
                  } available in ${
                    selectedVariant.size
                  }`
                : `${selectedVariant.size} is out of stock`}
            </p>

            {/* Add to Cart */}
            <motion.button
              type="button"
              onClick={handleAddToCart}
              disabled={
                !selectedVariant ||
                selectedStock === 0 ||
                cartLoading
              }
              whileHover={{
                scale:
                  selectedVariant &&
                  selectedStock > 0
                    ? 1.01
                    : 1,
              }}
              whileTap={{
                scale:
                  selectedVariant &&
                  selectedStock > 0
                    ? 0.98
                    : 1,
              }}
              className="mt-8 w-full bg-black px-8 py-5 text-[10px] font-medium uppercase tracking-[0.25em] text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
            >
              {cartLoading
                ? "Adding..."
                : !selectedVariant
                ? "Select Size"
                : selectedStock === 0
                ? "Out Of Stock"
                : "Add To Cart"}
            </motion.button>

            {/* Cart Message */}
            {cartMessage && (
              <p
                className={`mt-4 text-center text-[9px] uppercase tracking-[0.15em] ${
                  cartMessage.includes(
                    "successfully"
                  )
                    ? "text-black"
                    : "text-red-500"
                }`}
              >
                {cartMessage}
              </p>
            )}
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default ProductDetails;