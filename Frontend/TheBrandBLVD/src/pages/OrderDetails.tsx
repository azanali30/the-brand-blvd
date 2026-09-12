import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, Package, X, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image?: string;
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode?: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  deliveryMethod: "standard" | "express";
  deliveryFee: number;
  paymentMethod: "card" | "cod";
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  subtotal: number;
  total: number;
  createdAt: string;
}

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `http://localhost:5000/api/orders/${id}`,
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
            data.message || "Failed to load order"
          );
        }

        setOrder(data.order);
      } catch (error) {
        console.error("Fetch order error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load order."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id, navigate]);

  const handleCancelOrder = async () => {
  setShowCancelModal(false);
  setCancelling(true);

  try {
    const response = await fetch(
      `http://localhost:5000/api/orders/${order?._id}/cancel`,
      {
        method: "PUT",
        credentials: "include",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to cancel order");
    }

    setOrder(data.order);
  } catch (error) {
    console.error("Cancel order error:", error);

    setError(
      error instanceof Error
        ? error.message
        : "Something went wrong while cancelling the order."
    );
  } finally {
    setCancelling(false);
  }
};

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-PK", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const statusSteps = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
  ] as const;

  const currentStep = order
    ? statusSteps.indexOf(
        order.orderStatus as (typeof statusSteps)[number]
      )
    : -1;

  if (loading) {
    return (
      <main className="flex min-h-[80vh] items-center justify-center bg-[#f9f9f9]">
        <p className="text-[10px] uppercase tracking-[0.3em]">
          Loading Order...
        </p>
      </main>
    );
  }

  if (error && !order) {
    return (
      <main className="flex min-h-[80vh] flex-col items-center justify-center bg-[#f9f9f9] px-6 text-center">
        <p className="mb-6 text-xs uppercase tracking-[0.2em]">
          {error}
        </p>

        <Link
          to="/orders"
          className="bg-black px-8 py-4 text-[10px] uppercase tracking-[0.2em] text-white"
        >
          Back To Orders
        </Link>
      </main>
    );
  }

  if (!order) return null;

  return (
    <main className="min-h-screen bg-[#f9f9f9] px-6 py-24 md:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-14">
          <Link
            to="/orders"
            className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-black/50 transition hover:text-black"
          >
            <ArrowLeft size={13} strokeWidth={1.5} />
            Back To Orders
          </Link>

          <div className="mt-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-black/40">
                Order Details
              </p>

              <h1 className="text-3xl font-light uppercase tracking-[0.08em] md:text-5xl">
                #{order._id.slice(-8).toUpperCase()}
              </h1>

              <p className="mt-4 text-[9px] uppercase tracking-[0.15em] text-black/40">
                Placed {formatDate(order.createdAt)}
              </p>
            </div>

            {order.orderStatus !== "cancelled" &&
              (order.orderStatus === "pending" ||
                order.orderStatus === "confirmed") && (
                <button
                  type="button"
                  onClick={() => setShowCancelModal(true)}
                  disabled={cancelling}
                  className="flex items-center justify-center gap-2 border border-black px-6 py-4 text-[9px] uppercase tracking-[0.2em] transition hover:bg-black hover:text-white disabled:opacity-40"
                >
                  <X size={13} strokeWidth={1.5} />

                  {cancelling
                    ? "Cancelling..."
                    : "Cancel Order"}
                </button>
              )}
          </div>
        </div>

        {error && order && (
          <div className="mb-8 bg-black px-5 py-4 text-[9px] uppercase tracking-[0.15em] text-white">
            {error}
          </div>
        )}

        {/* Cancelled */}
        {order.orderStatus === "cancelled" ? (
          <div className="mb-12 bg-white p-8 md:p-10">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center bg-black text-white">
                <X size={18} strokeWidth={1.5} />
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.15em]">
                  Order Cancelled
                </p>

                <p className="mt-2 text-[9px] uppercase tracking-[0.12em] text-black/40">
                  This order has been cancelled successfully.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Tracking */
          <div className="mb-12 bg-white p-8 md:p-10">
            <div className="mb-10 flex items-center gap-3">
              <Package size={18} strokeWidth={1.5} />

              <h2 className="text-sm font-light uppercase tracking-[0.15em]">
                Order Status
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
              {statusSteps.map((step, index) => {
                const active = index <= currentStep;

                return (
                  <div key={step} className="relative">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                          active
                            ? "bg-black text-white"
                            : "border border-black/20 text-black/30"
                        }`}
                      >
                        {active ? (
                          <Check
                            size={13}
                            strokeWidth={1.5}
                          />
                        ) : (
                          <span className="text-[9px]">
                            {index + 1}
                          </span>
                        )}
                      </div>

                      <p
                        className={`text-[8px] uppercase tracking-[0.12em] ${
                          active
                            ? "text-black"
                            : "text-black/30"
                        }`}
                      >
                        {step}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
          {/* Items */}
          <div className="bg-white p-8 md:p-10">
            <h2 className="mb-8 text-sm font-light uppercase tracking-[0.15em]">
              Items
            </h2>

            <div className="space-y-8">
              {order.items.map((item, index) => (
                <motion.div
                  key={`${order._id}-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-5 border-b border-black/10 pb-8 last:border-0 last:pb-0"
                >
                  <div className="h-32 w-24 shrink-0 overflow-hidden bg-[#f7f7f7]">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-[7px] uppercase tracking-[0.2em] text-black/20">
                          BLVD
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.1em]">
                        {item.name}
                      </p>

                      <div className="mt-3 space-y-1 text-[8px] uppercase tracking-[0.12em] text-black/40">
                        {item.size && (
                          <p>Size: {item.size}</p>
                        )}

                        {item.color && (
                          <p>Color: {item.color}</p>
                        )}

                        <p>Quantity: {item.quantity}</p>
                      </div>
                    </div>

                    <p className="mt-4 text-xs">
                      PKR{" "}
                      {(
                        item.price * item.quantity
                      ).toLocaleString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-6">
            <div className="bg-white p-8">
              <h2 className="mb-8 text-sm font-light uppercase tracking-[0.15em]">
                Order Summary
              </h2>

              <div className="space-y-5">
                <div className="flex justify-between text-xs">
                  <span className="text-[9px] uppercase tracking-[0.15em] text-black/50">
                    Subtotal
                  </span>

                  <span>
                    PKR {order.subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-[9px] uppercase tracking-[0.15em] text-black/50">
                    Delivery
                  </span>

                  <span>
                    {order.deliveryFee === 0
                      ? "FREE"
                      : `PKR ${order.deliveryFee.toLocaleString()}`}
                  </span>
                </div>

                <div className="border-t border-black/10 pt-6">
                  <div className="flex justify-between">
                    <span className="text-[10px] uppercase tracking-[0.15em]">
                      Total
                    </span>

                    <span className="text-lg">
                      PKR {order.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div className="bg-white p-8">
              <h2 className="mb-7 text-sm font-light uppercase tracking-[0.15em]">
                Shipping Address
              </h2>

              <div className="space-y-2 text-[10px] uppercase tracking-[0.1em]">
                <p>
                  {order.shippingAddress.firstName}{" "}
                  {order.shippingAddress.lastName}
                </p>

                <p className="text-black/50">
                  {order.shippingAddress.address}
                </p>

                <p className="text-black/50">
                  {order.shippingAddress.city}
                  {order.shippingAddress.postalCode
                    ? `, ${order.shippingAddress.postalCode}`
                    : ""}
                </p>

                <p className="pt-3 text-black/50">
                  {order.shippingAddress.phone}
                </p>

                <p className="text-black/50">
                  {order.shippingAddress.email}
                </p>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white p-8">
              <h2 className="mb-7 text-sm font-light uppercase tracking-[0.15em]">
                Payment
              </h2>

              <div className="space-y-4 text-[9px] uppercase tracking-[0.12em]">
                <div className="flex justify-between">
                  <span className="text-black/40">
                    Method
                  </span>

                  <span>
                    {order.paymentMethod === "cod"
                      ? "Cash On Delivery"
                      : "Card"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-black/40">
                    Status
                  </span>

                  <span>{order.paymentStatus}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-black/40">
                    Delivery
                  </span>

                  <span>{order.deliveryMethod}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showCancelModal && (
  <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      className="w-full max-w-md bg-white p-8 shadow-2xl"
    >
      {/* Icon */}
      <div className="mb-6 flex h-12 w-12 items-center justify-center border border-black">
        <AlertTriangle size={20} strokeWidth={1.5} />
      </div>

      {/* Content */}
      <h2 className="text-xl font-medium uppercase tracking-tight">
        Cancel Order?
      </h2>

      <p className="mt-3 text-sm leading-6 text-black/60">
        Are you sure you want to cancel this order? This action cannot be
        undone.
      </p>

      {/* Buttons */}
      <div className="mt-8 flex gap-3">
        <button
          type="button"
          onClick={() => setShowCancelModal(false)}
          className="flex-1 border border-black px-5 py-3 text-xs font-medium uppercase tracking-[0.15em] transition hover:bg-black hover:text-white"
        >
          Keep Order
        </button>

        <button
          type="button"
          onClick={handleCancelOrder}
          disabled={cancelling}
          className="flex-1 bg-black px-5 py-3 text-xs font-medium uppercase tracking-[0.15em] text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {cancelling ? "Cancelling..." : "Yes, Cancel"}
        </button>
      </div>
    </motion.div>
  </div>
)}
    </main>
    
  );
};

export default OrderDetails;