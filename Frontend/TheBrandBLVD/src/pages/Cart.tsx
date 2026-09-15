import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";

// ==========================================
// TYPES
// ==========================================

interface ProductVariant {
  size: string;
  price: number;
  stock: number;
}

interface Product {
  _id: string;
  name: string;
  category: string;
  images: string[];
  variants: ProductVariant[];
  colors: string[];
  isNewArrival: boolean;
  isFeatured: boolean;
  isActive: boolean;
}

interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

interface CartData {
  items: CartItem[];
}

// ==========================================
// HELPERS
// ==========================================

const getSelectedVariant = (
  product: Product,
  selectedSize?: string
): ProductVariant | null => {
  if (!selectedSize || !Array.isArray(product.variants)) {
    return null;
  }

  const normalizedSize = selectedSize.trim().toUpperCase();

  return (
    product.variants.find(
      (variant) =>
        variant.size.trim().toUpperCase() === normalizedSize
    ) || null
  );
};

// ==========================================
// COMPONENT
// ==========================================

const Cart = () => {
  const { cart, loading, refreshCart } = useCart();

  const [message, setMessage] = useState("");

  // ==========================================
  // CLEAR MESSAGE
  // ==========================================

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [message]);

  // ==========================================
  // UPDATE QUANTITY
  // ==========================================

  const updateQuantity = async (
    productId: string,
    quantity: number,
    size?: string,
    color?: string
  ) => {
    try {
      if (quantity < 1) {
        return;
      }

      const response = await fetch(
        `https://the-brand-blvd.onrender.com/api/cart/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            quantity,
            size,
            color,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to update cart");
        return;
      }

      await refreshCart();
    } catch (error) {
      console.error("Update quantity error:", error);
      setMessage("Something went wrong");
    }
  };

  // ==========================================
  // REMOVE ITEM
  // ==========================================

  const removeItem = async (
    productId: string,
    size?: string,
    color?: string
  ) => {
    try {
      const response = await fetch(
        `https://the-brand-blvd.onrender.com/api/cart/${productId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            size,
            color,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to remove item");
        return;
      }

      await refreshCart();
    } catch (error) {
      console.error("Remove item error:", error);
      setMessage("Something went wrong");
    }
  };

  // ==========================================
  // CLEAR CART
  // ==========================================

  const clearCart = async () => {
    try {
      const response = await fetch(
        "https://the-brand-blvd.onrender.com/api/cart",
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to clear cart");
        return;
      }

      await refreshCart();
    } catch (error) {
      console.error("Clear cart error:", error);
      setMessage("Something went wrong");
    }
  };

  // ==========================================
  // CALCULATE SUBTOTAL
  // ==========================================

  const subtotal = cart.items.reduce(
    (total, item) => {
      const selectedVariant = getSelectedVariant(
        item.product,
        item.size
      );

      const price = selectedVariant
        ? Number(selectedVariant.price)
        : 0;

      return total + price * Number(item.quantity);
    },
    0
  );

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f9f9f9] px-6 py-32 md:px-12">
        <div className="mx-auto max-w-7xl">
          <p className="text-center text-xs uppercase tracking-[0.3em]">
            Loading Cart...
          </p>
        </div>
      </main>
    );
  }

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <main className="min-h-screen bg-[#f9f9f9] px-6 py-24 md:px-12">
      <div className="mx-auto max-w-7xl">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="mb-16 flex items-end justify-between border-b border-black/10 pb-8">
          <div>
            <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-black/50">
              Your Selection
            </p>

            <h1 className="text-4xl font-light uppercase tracking-[0.08em] md:text-6xl">
              Cart
            </h1>
          </div>

          {cart.items.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="text-[10px] uppercase tracking-[0.2em] text-black/50 transition-colors hover:text-black"
            >
              Clear Cart
            </button>
          )}
        </div>

        {/* ======================================
            MESSAGE
        ====================================== */}

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-center text-xs uppercase tracking-[0.15em]"
          >
            {message}
          </motion.div>
        )}

        {/* ======================================
            EMPTY CART
        ====================================== */}

        {cart.items.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
            <p className="mb-6 text-xs uppercase tracking-[0.25em] text-black/50">
              Your cart is currently empty
            </p>

            <Link
              to="/shop"
              className="bg-black px-10 py-4 text-[10px] uppercase tracking-[0.25em] text-white transition-opacity hover:opacity-80"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-16 lg:grid-cols-[1fr_380px]">

            {/* ==================================
                CART ITEMS
            ================================== */}

            <div>
              <div className="space-y-10">

                {cart.items.map((item, index) => {
                  const selectedVariant = getSelectedVariant(
                    item.product,
                    item.size
                  );

                  const itemPrice = selectedVariant
                    ? Number(selectedVariant.price)
                    : 0;

                  const availableStock = selectedVariant
                    ? Number(selectedVariant.stock)
                    : 0;

                  const itemTotal =
                    itemPrice * Number(item.quantity);

                  const isOutOfStock =
                    !selectedVariant ||
                    availableStock <= 0;

                  const isMaxQuantity =
                    selectedVariant
                      ? item.quantity >= availableStock
                      : true;

                  return (
                    <motion.div
                      key={`${item.product._id}-${item.size}-${item.color}`}
                      initial={{
                        opacity: 0,
                        y: 15,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: index * 0.05,
                      }}
                      className="flex gap-6 border-b border-black/10 pb-10"
                    >

                      {/* ==============================
                          PRODUCT IMAGE
                      ============================== */}

                      <Link
                        to={`/product/${item.product._id}`}
                        className="block h-40 w-32 shrink-0 overflow-hidden bg-white md:h-52 md:w-40"
                      >
                        {item.product.images?.[0] ? (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[9px] uppercase tracking-[0.2em] text-black/30">
                            No Image
                          </div>
                        )}
                      </Link>

                      {/* ==============================
                          PRODUCT INFO
                      ============================== */}

                      <div className="flex flex-1 flex-col justify-between">

                        <div>

                          <p className="mb-2 text-[9px] uppercase tracking-[0.2em] text-black/40">
                            {item.product.category}
                          </p>

                          <Link
                            to={`/product/${item.product._id}`}
                            className="text-sm uppercase tracking-[0.12em] transition-opacity hover:opacity-50 md:text-base"
                          >
                            {item.product.name}
                          </Link>

                          {/* PRICE */}

                          {selectedVariant ? (
                            <p className="mt-3 text-sm">
                              PKR {itemPrice.toLocaleString()}
                            </p>
                          ) : (
                            <p className="mt-3 text-sm text-black/40">
                              Price unavailable
                            </p>
                          )}

                          {/* SIZE / COLOR */}

                          <div className="mt-4 flex flex-wrap gap-5 text-[10px] uppercase tracking-[0.15em] text-black/50">

                            {item.size && (
                              <span>
                                Size: {item.size}
                              </span>
                            )}

                            {item.color && (
                              <span>
                                Color: {item.color}
                              </span>
                            )}

                          </div>

                          {/* STOCK WARNING */}

                          {selectedVariant &&
                            availableStock <= 3 &&
                            availableStock > 0 && (
                              <p className="mt-3 text-[9px] uppercase tracking-[0.15em] text-black/50">
                                Only {availableStock}{" "}
                                left
                              </p>
                            )}

                          {isOutOfStock && (
                            <p className="mt-3 text-[9px] uppercase tracking-[0.15em]">
                              This size is currently unavailable
                            </p>
                          )}

                        </div>

                        {/* ==============================
                            BOTTOM CONTROLS
                        ============================== */}

                        <div className="mt-6 flex items-center justify-between">

                          {/* QUANTITY */}

                          <div className="flex items-center gap-4">

                            <button
                              type="button"
                              disabled={
                                item.quantity <= 1 ||
                                isOutOfStock
                              }
                              onClick={() =>
                                updateQuantity(
                                  item.product._id,
                                  item.quantity - 1,
                                  item.size,
                                  item.color
                                )
                              }
                              className="transition-opacity disabled:cursor-not-allowed disabled:opacity-20"
                            >
                              <Minus
                                size={14}
                                strokeWidth={1.5}
                              />
                            </button>

                            <span className="min-w-5 text-center text-xs">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              disabled={
                                isMaxQuantity ||
                                isOutOfStock
                              }
                              onClick={() =>
                                updateQuantity(
                                  item.product._id,
                                  item.quantity + 1,
                                  item.size,
                                  item.color
                                )
                              }
                              className="transition-opacity disabled:cursor-not-allowed disabled:opacity-20"
                            >
                              <Plus
                                size={14}
                                strokeWidth={1.5}
                              />
                            </button>

                          </div>

                          {/* ITEM TOTAL */}

                          <div className="hidden text-xs md:block">
                            PKR{" "}
                            {itemTotal.toLocaleString()}
                          </div>

                          {/* REMOVE */}

                          <button
                            type="button"
                            onClick={() =>
                              removeItem(
                                item.product._id,
                                item.size,
                                item.color
                              )
                            }
                            className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-black/40 transition-colors hover:text-black"
                          >
                            <Trash2
                              size={13}
                              strokeWidth={1.5}
                            />

                            Remove
                          </button>

                        </div>
                      </div>
                    </motion.div>
                  );
                })}

              </div>
            </div>

            {/* ==================================
                ORDER SUMMARY
            ================================== */}

            <div className="lg:sticky lg:top-28 lg:self-start">

              <div className="bg-white p-8 md:p-10">

                <p className="mb-8 text-[10px] uppercase tracking-[0.3em] text-black/50">
                  Order Summary
                </p>

                <div className="space-y-5">

                  {/* SUBTOTAL */}

                  <div className="flex justify-between text-xs uppercase tracking-[0.1em]">
                    <span>
                      Subtotal
                    </span>

                    <span>
                      PKR {subtotal.toLocaleString()}
                    </span>
                  </div>

                  {/* SHIPPING */}

                  <div className="flex justify-between text-xs uppercase tracking-[0.1em] text-black/50">
                    <span>
                      Shipping
                    </span>

                    <span>
                      Calculated at checkout
                    </span>
                  </div>

                  {/* TOTAL */}

                  <div className="border-t border-black/10 pt-6">

                    <div className="flex justify-between">

                      <span className="text-xs uppercase tracking-[0.15em]">
                        Total
                      </span>

                      <span className="text-sm">
                        PKR {subtotal.toLocaleString()}
                      </span>

                    </div>
                  </div>
                </div>

                {/* CHECKOUT */}

                <Link
                  to="/checkout"
                  className="mt-10 flex w-full items-center justify-center bg-black px-8 py-5 text-[10px] uppercase tracking-[0.25em] text-white transition-opacity hover:opacity-80"
                >
                  Proceed To Checkout
                </Link>

                {/* CONTINUE SHOPPING */}

                <Link
                  to="/shop"
                  className="mt-6 flex items-center justify-center gap-2 text-[9px] uppercase tracking-[0.2em] text-black/50 hover:text-black"
                >
                  <ArrowLeft
                    size={13}
                    strokeWidth={1.5}
                  />

                  Continue Shopping
                </Link>

              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Cart;