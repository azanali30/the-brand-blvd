import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";
import { motion } from "framer-motion";

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

interface Cart {
  items: CartItem[];
}

// ==========================================
// HELPER
// ==========================================

const getSelectedVariant = (
  product: Product,
  selectedSize?: string
): ProductVariant | null => {
  if (
    !selectedSize ||
    !Array.isArray(product?.variants)
  ) {
    return null;
  }

  const normalizedSize = selectedSize
    .trim()
    .toUpperCase();

  return (
    product.variants.find(
      (variant) =>
        variant.size?.trim().toUpperCase() ===
        normalizedSize
    ) || null
  );
};

// ==========================================
// CHECKOUT
// ==========================================

const Checkout: React.FC = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [paymentMethod, setPaymentMethod] =
    useState<"card" | "cod">("card");

  const [deliveryMethod, setDeliveryMethod] =
    useState<"standard" | "express">("standard");

  const [placingOrder, setPlacingOrder] =
    useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  // ==========================================
  // FETCH CART
  // ==========================================

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "https://the-brand-blvd.onrender.com/api/cart",
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (response.status === 401) {
          navigate("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load cart"
          );
        }

        setCart(data.cart);
      } catch (error) {
        console.error(
          "Checkout cart error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load your cart."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [navigate]);

  // ==========================================
  // SUBTOTAL
  // ==========================================

  const subtotal = useMemo(() => {
    if (!cart?.items?.length) {
      return 0;
    }

    return cart.items.reduce(
      (total, item) => {
        const selectedVariant =
          getSelectedVariant(
            item.product,
            item.size
          );

        if (!selectedVariant) {
          return total;
        }

        const price = Number(
          selectedVariant.price
        );

        const quantity = Number(
          item.quantity
        );

        if (
          !Number.isFinite(price) ||
          !Number.isFinite(quantity)
        ) {
          return total;
        }

        return total + price * quantity;
      },
      0
    );
  }, [cart]);

  // ==========================================
  // DELIVERY
  // ==========================================

  const deliveryFee =
    deliveryMethod === "express"
      ? 500
      : 0;

  // ==========================================
  // TOTAL
  // ==========================================

  const total = subtotal + deliveryFee;

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // ==========================================
  // PLACE ORDER
  // ==========================================

  const handlePlaceOrder = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!cart?.items?.length) {
      setError("Your cart is empty.");
      return;
    }

    // ------------------------------------------
    // Check that every cart item has a valid
    // selected variant
    // ------------------------------------------

    for (const item of cart.items) {
      const selectedVariant =
        getSelectedVariant(
          item.product,
          item.size
        );

      if (!selectedVariant) {
        setError(
          `${item.product.name} - selected size is no longer available.`
        );
        return;
      }

      if (
        Number(selectedVariant.stock) <
        Number(item.quantity)
      ) {
        setError(
          `Not enough stock for ${item.product.name} - ${selectedVariant.size}.`
        );
        return;
      }
    }

    setError("");
    setPlacingOrder(true);

    try {
      const response = await fetch(
        "https://the-brand-blvd.onrender.com/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            shippingAddress: {
              firstName: form.firstName,
              lastName: form.lastName,
              email: form.email,
              phone: form.phone,
              address: form.address,
              city: form.city,
              postalCode: form.postalCode,
            },
            deliveryMethod,
            paymentMethod,
          }),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to place order"
        );
      }

      console.log(
        "Order created:",
        data.order
      );

      navigate("/orders");
    } catch (error) {
      console.error(
        "Place order error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while placing your order."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="flex min-h-[80vh] items-center justify-center bg-white">
        <p className="text-[10px] uppercase tracking-[0.3em]">
          Loading Checkout...
        </p>
      </main>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error && !cart?.items?.length) {
    return (
      <main className="flex min-h-[80vh] flex-col items-center justify-center bg-white px-6">
        <p className="mb-6 text-center text-xs uppercase tracking-[0.2em]">
          {error}
        </p>

        <Link
          to="/cart"
          className="text-[10px] uppercase tracking-[0.2em] underline underline-offset-8"
        >
          Back To Cart
        </Link>
      </main>
    );
  }

  // ==========================================
  // EMPTY CART
  // ==========================================

  if (!cart?.items?.length) {
    return (
      <main className="flex min-h-[80vh] flex-col items-center justify-center bg-white px-6">
        <p className="text-xs uppercase tracking-[0.25em]">
          Your Bag Is Empty
        </p>

        <Link
          to="/shop"
          className="mt-8 bg-black px-8 py-4 text-[10px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-black/90"
        >
          Continue Shopping
        </Link>
      </main>
    );
  }

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <main className="bg-white text-black">

      {/* ======================================
          HEADER
      ====================================== */}

      <section className="border-b border-black/10 px-6 py-8 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">

          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-black/50 transition hover:text-black"
          >
            <ArrowLeft
              size={14}
              strokeWidth={1.5}
            />

            Back To Cart
          </Link>

          <div className="mt-8 flex items-center justify-between">

            <h1 className="text-2xl font-light uppercase tracking-[0.15em] md:text-3xl">
              Checkout
            </h1>

            <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.15em] text-black/45">
              <Lock
                size={13}
                strokeWidth={1.5}
              />

              Secure Checkout
            </div>

          </div>
        </div>
      </section>

      {/* ======================================
          CHECKOUT
      ====================================== */}

      <section className="px-6 py-12 md:px-12 lg:px-20 lg:py-16">

        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1fr_420px]">

          {/* ==================================
              LEFT - FORM
          ================================== */}

          <motion.form
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
            }}
            onSubmit={handlePlaceOrder}
            className="max-w-3xl"
          >

            {/* =================================
                CONTACT
            ================================= */}

            <div>

              <div className="mb-8">

                <p className="text-[10px] uppercase tracking-[0.3em] text-black/40">
                  01
                </p>

                <h2 className="mt-3 text-lg font-light uppercase tracking-[0.12em]">
                  Contact Information
                </h2>

              </div>

              <div className="grid gap-5 md:grid-cols-2">

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="EMAIL ADDRESS"
                  required
                  className="border-b border-black/20 bg-transparent px-0 py-4 text-xs tracking-[0.08em] outline-none transition focus:border-black"
                />

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="PHONE NUMBER"
                  required
                  className="border-b border-black/20 bg-transparent px-0 py-4 text-xs tracking-[0.08em] outline-none transition focus:border-black"
                />

              </div>
            </div>

            {/* =================================
                SHIPPING
            ================================= */}

            <div className="mt-16">

              <div className="mb-8">

                <p className="text-[10px] uppercase tracking-[0.3em] text-black/40">
                  02
                </p>

                <h2 className="mt-3 text-lg font-light uppercase tracking-[0.12em]">
                  Shipping Address
                </h2>

              </div>

              <div className="grid gap-5 md:grid-cols-2">

                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="FIRST NAME"
                  required
                  className="border-b border-black/20 bg-transparent px-0 py-4 text-xs tracking-[0.08em] outline-none transition focus:border-black"
                />

                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="LAST NAME"
                  required
                  className="border-b border-black/20 bg-transparent px-0 py-4 text-xs tracking-[0.08em] outline-none transition focus:border-black"
                />

                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="STREET ADDRESS"
                  required
                  className="border-b border-black/20 bg-transparent px-0 py-4 text-xs tracking-[0.08em] outline-none transition focus:border-black md:col-span-2"
                />

                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="CITY"
                  required
                  className="border-b border-black/20 bg-transparent px-0 py-4 text-xs tracking-[0.08em] outline-none transition focus:border-black"
                />

                <input
                  type="text"
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                  placeholder="POSTAL CODE"
                  className="border-b border-black/20 bg-transparent px-0 py-4 text-xs tracking-[0.08em] outline-none transition focus:border-black"
                />

              </div>
            </div>

            {/* =================================
                DELIVERY
            ================================= */}

            <div className="mt-16">

              <div className="mb-8">

                <p className="text-[10px] uppercase tracking-[0.3em] text-black/40">
                  03
                </p>

                <h2 className="mt-3 text-lg font-light uppercase tracking-[0.12em]">
                  Delivery Method
                </h2>

              </div>

              <div className="space-y-3">

                {/* STANDARD */}

                <button
                  type="button"
                  onClick={() =>
                    setDeliveryMethod("standard")
                  }
                  className={`flex w-full items-center justify-between bg-[#f7f7f7] px-5 py-5 text-left transition ${
                    deliveryMethod === "standard"
                      ? "ring-1 ring-black"
                      : ""
                  }`}
                >

                  <div>

                    <p className="text-[10px] uppercase tracking-[0.15em]">
                      Standard Delivery
                    </p>

                    <p className="mt-2 text-[9px] uppercase tracking-[0.12em] text-black/40">
                      3–5 Business Days
                    </p>

                  </div>

                  <span className="text-xs">
                    FREE
                  </span>

                </button>

                {/* EXPRESS */}

                <button
                  type="button"
                  onClick={() =>
                    setDeliveryMethod("express")
                  }
                  className={`flex w-full items-center justify-between bg-[#f7f7f7] px-5 py-5 text-left transition ${
                    deliveryMethod === "express"
                      ? "ring-1 ring-black"
                      : ""
                  }`}
                >

                  <div>

                    <p className="text-[10px] uppercase tracking-[0.15em]">
                      Express Delivery
                    </p>

                    <p className="mt-2 text-[9px] uppercase tracking-[0.12em] text-black/40">
                      1–2 Business Days
                    </p>

                  </div>

                  <span className="text-xs">
                    PKR 500
                  </span>

                </button>

              </div>
            </div>

            {/* =================================
                PAYMENT
            ================================= */}

            <div className="mt-16">

              <div className="mb-8">

                <p className="text-[10px] uppercase tracking-[0.3em] text-black/40">
                  04
                </p>

                <h2 className="mt-3 text-lg font-light uppercase tracking-[0.12em]">
                  Payment
                </h2>

              </div>

              <div className="space-y-3">

                {/* CARD */}

                <button
                  type="button"
                  onClick={() =>
                    setPaymentMethod("card")
                  }
                  className={`w-full bg-[#f7f7f7] p-6 text-left transition ${
                    paymentMethod === "card"
                      ? "ring-1 ring-black"
                      : ""
                  }`}
                >

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                          paymentMethod === "card"
                            ? "border-black"
                            : "border-black/30"
                        }`}
                      >
                        {paymentMethod === "card" && (
                          <div className="h-2.5 w-2.5 rounded-full bg-black" />
                        )}
                      </div>

                      <p className="text-[10px] uppercase tracking-[0.15em]">
                        Credit / Debit Card
                      </p>

                    </div>

                    <span className="text-[9px] uppercase tracking-[0.1em] text-black/40">
                      Secure
                    </span>

                  </div>

                  {paymentMethod === "card" && (
                    <div
                      onClick={(e) =>
                        e.stopPropagation()
                      }
                      className="mt-6 space-y-5"
                    >

                      <input
                        type="text"
                        placeholder="CARD NUMBER"
                        inputMode="numeric"
                        maxLength={19}
                        className="w-full border-b border-black/20 bg-transparent px-0 py-4 text-xs tracking-[0.08em] outline-none transition focus:border-black"
                      />

                      <div className="grid gap-5 sm:grid-cols-2">

                        <input
                          type="text"
                          placeholder="MM / YY"
                          maxLength={5}
                          className="border-b border-black/20 bg-transparent px-0 py-4 text-xs tracking-[0.08em] outline-none transition focus:border-black"
                        />

                        <input
                          type="password"
                          placeholder="CVV"
                          inputMode="numeric"
                          maxLength={4}
                          className="border-b border-black/20 bg-transparent px-0 py-4 text-xs tracking-[0.08em] outline-none transition focus:border-black"
                        />

                      </div>

                      <input
                        type="text"
                        placeholder="CARDHOLDER NAME"
                        className="w-full border-b border-black/20 bg-transparent px-0 py-4 text-xs tracking-[0.08em] outline-none transition focus:border-black"
                      />

                      <p className="text-[8px] leading-5 tracking-[0.08em] text-black/40">
                        Your card information will be securely processed by our payment provider.
                      </p>

                    </div>
                  )}

                </button>

                {/* COD */}

                <button
                  type="button"
                  onClick={() =>
                    setPaymentMethod("cod")
                  }
                  className={`w-full bg-[#f7f7f7] p-6 text-left transition ${
                    paymentMethod === "cod"
                      ? "ring-1 ring-black"
                      : ""
                  }`}
                >

                  <div className="flex items-center gap-3">

                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                        paymentMethod === "cod"
                          ? "border-black"
                          : "border-black/30"
                      }`}
                    >
                      {paymentMethod === "cod" && (
                        <div className="h-2.5 w-2.5 rounded-full bg-black" />
                      )}
                    </div>

                    <p className="text-[10px] uppercase tracking-[0.15em]">
                      Cash On Delivery
                    </p>

                  </div>

                  {paymentMethod === "cod" && (
                    <p className="mt-4 pl-8 text-[8px] leading-5 tracking-[0.08em] text-black/40">
                      Pay when your order is delivered to your address.
                    </p>
                  )}

                </button>

              </div>
            </div>

            {/* =================================
                ERROR
            ================================= */}

            {error && (
              <div className="mt-8 bg-black px-5 py-4 text-center text-[9px] uppercase tracking-[0.15em] text-white">
                {error}
              </div>
            )}

            {/* =================================
                PLACE ORDER
            ================================= */}

            <button
              type="submit"
              disabled={placingOrder}
              className="mt-10 w-full bg-black px-8 py-5 text-[10px] font-medium uppercase tracking-[0.25em] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {placingOrder
                ? "Processing..."
                : "Place Order"}
            </button>

          </motion.form>

          {/* ==================================
              RIGHT - ORDER SUMMARY
          ================================== */}

          <motion.aside
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
              delay: 0.1,
            }}
            className="h-fit bg-[#f7f7f7] p-6 md:p-8"
          >

            {/* SUMMARY HEADER */}

            <div className="flex items-center justify-between">

              <h2 className="text-sm font-light uppercase tracking-[0.15em]">
                Order Summary
              </h2>

              <span className="text-[9px] uppercase tracking-[0.15em] text-black/40">
                {cart.items.length}{" "}
                {cart.items.length === 1
                  ? "Item"
                  : "Items"}
              </span>

            </div>

            {/* =================================
                ITEMS
            ================================= */}

            <div className="mt-8 space-y-6">

              {cart.items.map((item) => {

                const selectedVariant =
                  getSelectedVariant(
                    item.product,
                    item.size
                  );

                const itemPrice =
                  selectedVariant
                    ? Number(
                        selectedVariant.price
                      )
                    : 0;

                const itemTotal =
                  itemPrice *
                  Number(item.quantity);

                return (
                  <div
                    key={`${item.product._id}-${item.size}-${item.color}`}
                    className="flex gap-4"
                  >

                    {/* IMAGE */}

                    <div className="h-28 w-20 flex-shrink-0 overflow-hidden bg-white">

                      {item.product.images?.length >
                      0 ? (
                        <img
                          src={
                            item.product.images[0]
                          }
                          alt={
                            item.product.name
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="text-[7px] uppercase tracking-widest text-black/20">
                            BLVD
                          </span>
                        </div>
                      )}

                    </div>

                    {/* INFO */}

                    <div className="flex min-w-0 flex-1 flex-col justify-between">

                      <div>

                        <p className="text-[10px] uppercase tracking-[0.1em]">
                          {item.product.name}
                        </p>

                        <div className="mt-2 space-y-1 text-[8px] uppercase tracking-[0.12em] text-black/40">

                          {item.size && (
                            <p>
                              Size: {item.size}
                            </p>
                          )}

                          {item.color && (
                            <p>
                              Color: {item.color}
                            </p>
                          )}

                          <p>
                            Qty: {item.quantity}
                          </p>

                        </div>

                      </div>

                      <p className="text-xs">
                        PKR{" "}
                        {itemTotal.toLocaleString()}
                      </p>

                    </div>

                  </div>
                );
              })}

            </div>

            {/* DIVIDER */}

            <div className="my-8 h-px bg-black/10" />

            {/* TOTALS */}

            <div className="space-y-4 text-xs">

              {/* SUBTOTAL */}

              <div className="flex justify-between">

                <span className="text-[9px] uppercase tracking-[0.15em] text-black/50">
                  Subtotal
                </span>

                <span>
                  PKR{" "}
                  {subtotal.toLocaleString()}
                </span>

              </div>

              {/* DELIVERY */}

              <div className="flex justify-between">

                <span className="text-[9px] uppercase tracking-[0.15em] text-black/50">
                  Delivery
                </span>

                <span>
                  {deliveryFee === 0
                    ? "FREE"
                    : `PKR ${deliveryFee.toLocaleString()}`}
                </span>

              </div>

            </div>

            {/* DIVIDER */}

            <div className="my-6 h-px bg-black/10" />

            {/* TOTAL */}

            <div className="flex items-center justify-between">

              <span className="text-[10px] uppercase tracking-[0.2em]">
                Total
              </span>

              <span className="text-lg">
                PKR{" "}
                {total.toLocaleString()}
              </span>

            </div>

          </motion.aside>

        </div>
      </section>
    </main>
  );
};

export default Checkout;