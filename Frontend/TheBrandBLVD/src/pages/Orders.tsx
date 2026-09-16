import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Package, ChevronRight } from "lucide-react";
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

interface OrdersResponse {
  success: boolean;
  orders: Order[];
  message?: string;
}

const Orders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
  "https://the-brand-blvd.onrender.com/api/orders/my",
  {
    method: "GET",
    credentials: "include",
  }
);

if (response.status === 401) {
  navigate("/login");
  return;
}

const contentType = response.headers.get("content-type");

if (!contentType?.includes("application/json")) {
  throw new Error(
    `Server returned an invalid response (${response.status})`
  );
}

const data: OrdersResponse = await response.json();

if (!response.ok) {
  throw new Error(
    data.message || "Failed to load orders"
  );
}

setOrders(data.orders || []);

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load orders"
          );
        }

        setOrders(data.orders || []);
      } catch (error) {
        console.error("Fetch orders error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong while loading your orders."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-PK", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusLabel = (status: Order["orderStatus"]) => {
    return status.replace("-", " ");
  };

  if (loading) {
    return (
      <main className="flex min-h-[80vh] items-center justify-center bg-[#f9f9f9]">
        <p className="text-[10px] uppercase tracking-[0.3em]">
          Loading Orders...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-[80vh] flex-col items-center justify-center bg-[#f9f9f9] px-6 text-center">
        <p className="mb-6 text-xs uppercase tracking-[0.2em]">
          {error}
        </p>

        <Link
          to="/"
          className="bg-black px-8 py-4 text-[10px] uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-80"
        >
          Back To Home
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f9f9f9] px-6 py-24 md:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 flex items-end justify-between border-b border-black/10 pb-8">
          <div>
            <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-black/50">
              Your Account
            </p>

            <h1 className="text-4xl font-light uppercase tracking-[0.08em] md:text-6xl">
              Orders
            </h1>
          </div>

          <Link
            to="/shop"
            className="hidden items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-black/50 transition hover:text-black md:flex"
          >
            Continue Shopping
            <ChevronRight size={13} strokeWidth={1.5} />
          </Link>
        </div>

        {/* Empty Orders */}
        {orders.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
            <Package
              size={32}
              strokeWidth={1}
              className="mb-8"
            />

            <p className="mb-6 text-xs uppercase tracking-[0.25em] text-black/50">
              You haven't placed any orders yet
            </p>

            <Link
              to="/shop"
              className="bg-black px-10 py-4 text-[10px] uppercase tracking-[0.25em] text-white transition-opacity hover:opacity-80"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.05,
                }}
                className="bg-white p-6 md:p-8"
              >
                {/* Order Header */}
                <div className="flex flex-col gap-5 border-b border-black/10 pb-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="mb-2 text-[9px] uppercase tracking-[0.2em] text-black/40">
                      Order
                    </p>

                    <p className="text-xs tracking-[0.08em]">
                      #{order._id.slice(-8).toUpperCase()}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-6">
                    <div>
                      <p className="mb-2 text-[9px] uppercase tracking-[0.2em] text-black/40">
                        Date
                      </p>

                      <p className="text-xs">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div>
                      <p className="mb-2 text-[9px] uppercase tracking-[0.2em] text-black/40">
                        Status
                      </p>

                      <span
                        className={`text-[9px] uppercase tracking-[0.15em] ${
                          order.orderStatus === "cancelled"
                            ? "text-black/40"
                            : order.orderStatus === "delivered"
                              ? "text-black"
                              : "text-black/70"
                        }`}
                      >
                        {getStatusLabel(order.orderStatus)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Products */}
                <div className="space-y-6 py-7">
                  {order.items.map((item, itemIndex) => (
                    <div
                      key={`${order._id}-${itemIndex}`}
                      className="flex gap-5"
                    >
                      {/* Product Image */}
                      <div className="h-28 w-20 shrink-0 overflow-hidden bg-[#f7f7f7] md:h-32 md:w-24">
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

                      {/* Product Info */}
                      <div className="flex flex-1 flex-col justify-between py-1">
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
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="border-t border-black/10 pt-6">
                  <div className="grid gap-6 md:grid-cols-3">
                    <div>
                      <p className="mb-2 text-[9px] uppercase tracking-[0.2em] text-black/40">
                        Delivery
                      </p>

                      <p className="text-xs uppercase tracking-[0.08em]">
                        {order.deliveryMethod}
                      </p>
                    </div>

                    <div>
                      <p className="mb-2 text-[9px] uppercase tracking-[0.2em] text-black/40">
                        Payment
                      </p>

                      <p className="text-xs uppercase tracking-[0.08em]">
                        {order.paymentMethod === "cod"
                          ? "Cash On Delivery"
                          : "Card"}
                      </p>
                    </div>

                    <div>
                      <p className="mb-2 text-[9px] uppercase tracking-[0.2em] text-black/40">
                        Payment Status
                      </p>

                      <p className="text-xs uppercase tracking-[0.08em]">
                        {order.paymentStatus}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col gap-6 border-t border-black/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="mb-2 text-[9px] uppercase tracking-[0.2em] text-black/40">
                        Order Total
                      </p>

                      <p className="text-lg">
                        PKR {order.total.toLocaleString()}
                      </p>
                    </div>

                    <Link
                      to={`/orders/${order._id}`}
                      className="flex items-center justify-center gap-2 border border-black px-7 py-4 text-[9px] uppercase tracking-[0.2em] transition-colors hover:bg-black hover:text-white"
                    >
                      View Order
                      <ChevronRight
                        size={13}
                        strokeWidth={1.5}
                      />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Orders;