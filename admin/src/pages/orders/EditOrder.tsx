import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CreditCard,
  Loader2,
  MapPin,
  Package,
  Phone,
  Save,
  User,
} from "lucide-react";

import type {
  DeliveryMethod,
  Order,
  OrderStatus,
  PaymentStatus,
} from "./types";

const API_URL = "http://localhost:5000";

const orderStatusOptions: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const paymentStatusOptions: PaymentStatus[] = [
  "pending",
  "paid",
  "failed",
];

const deliveryMethodOptions: DeliveryMethod[] = [
  "standard",
  "express",
];

const formatCurrency = (amount: number) => {
  return `Rs. ${amount.toLocaleString("en-PK")}`;
};

const formatDate = (date: string) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getStatusClasses = (status: OrderStatus) => {
  switch (status) {
    case "confirmed":
      return "bg-blue-50 text-blue-700";
    case "processing":
      return "bg-purple-50 text-purple-700";
    case "shipped":
      return "bg-amber-50 text-amber-700";
    case "delivered":
      return "bg-emerald-50 text-emerald-700";
    case "cancelled":
      return "bg-red-50 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getPaymentClasses = (status: PaymentStatus) => {
  switch (status) {
    case "paid":
      return "bg-emerald-50 text-emerald-700";
    case "failed":
      return "bg-red-50 text-red-700";
    default:
      return "bg-amber-50 text-amber-700";
  }
};

const EditOrder = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [orderStatus, setOrderStatus] =
    useState<OrderStatus>("pending");

  const [paymentStatus, setPaymentStatus] =
    useState<PaymentStatus>("pending");

  const [deliveryMethod, setDeliveryMethod] =
    useState<DeliveryMethod>("standard");

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchOrder = useCallback(async () => {
    if (!id) {
      setError("Order ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/orders/${id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to load order."
        );
      }

      const fetchedOrder: Order =
        data?.order || data?.data || data;

      setOrder(fetchedOrder);

      setOrderStatus(fetchedOrder.orderStatus);
      setPaymentStatus(fetchedOrder.paymentStatus);
      setDeliveryMethod(fetchedOrder.deliveryMethod);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to load order.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleSave = async () => {
  if (!id) {
    setError("Order ID is missing.");
    return;
  }

  try {
    setSaving(true);
    setError("");

    const response = await fetch(
      `${API_URL}/api/orders/${id}`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderStatus,
          paymentStatus,
          deliveryMethod,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.message ||
          "Failed to update order."
      );
    }

    setOrder(data.order);

    setSuccessMessage("Order updated successfully.");
    
    navigate(`/orders/${id}`);
  } catch (err) {
    console.error("Update order error:", err);

    setError(
      err instanceof Error
        ? err.message
        : "Failed to update order."
    );
  } finally {
    setSaving(false);
  }
};

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <Loader2
            size={20}
            className="animate-spin"
          />
          Loading order...
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="space-y-6">
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-black"
        >
          <ArrowLeft size={17} />
          Back to Orders
        </Link>

        <div className="rounded-2xl bg-white p-10 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
            !
          </div>

          <h2 className="text-lg font-semibold">
            Unable to load order
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {error || "Order not found."}
          </p>

          <button
            onClick={fetchOrder}
            className="mt-6 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <Link
            to={`/orders/${order._id}`}
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-black"
          >
            <ArrowLeft size={17} />
            Back to Order
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">
              Edit Order
            </h1>

            <span className="rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
              #{order._id.slice(-8).toUpperCase()}
            </span>
          </div>

          <p className="mt-2 text-sm text-gray-500">
            Update order information and fulfillment settings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={`/orders/${order._id}`}
            className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black shadow-sm transition hover:bg-gray-100"
          >
            Cancel
          </Link>

          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <Loader2
                size={17}
                className="animate-spin"
              />
            ) : (
              <Save size={17} />
            )}

            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {/* Order Status */}
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-base font-semibold">
                Order Status
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage the current fulfillment stage of this order.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {orderStatusOptions.map((status) => {
                const active = orderStatus === status;

                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() =>
                      setOrderStatus(status)
                    }
                    className={`rounded-xl p-4 text-left transition ${
                      active
                        ? "ring-2 ring-black"
                        : "bg-gray-50 hover:bg-gray-100"
                    } ${
                      active
                        ? getStatusClasses(status)
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold capitalize">
                        {status}
                      </span>

                      {active && (
                        <span className="h-2 w-2 rounded-full bg-current" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Payment & Delivery */}
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-base font-semibold">
                Payment & Delivery
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage payment and delivery information.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Payment Status */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Payment Status
                </label>

                <div className="relative">
                  <select
                    value={paymentStatus}
                    onChange={(event) =>
                      setPaymentStatus(
                        event.target.value as PaymentStatus
                      )
                    }
                    className={`w-full appearance-none rounded-xl px-4 py-3 text-sm font-medium outline-none ${getPaymentClasses(
                      paymentStatus
                    )}`}
                  >
                    {paymentStatusOptions.map(
                      (status) => (
                        <option
                          key={status}
                          value={status}
                        >
                          {status
                            .charAt(0)
                            .toUpperCase() +
                            status.slice(1)}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              {/* Delivery Method */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Delivery Method
                </label>

                <select
                  value={deliveryMethod}
                  onChange={(event) =>
                    setDeliveryMethod(
                      event.target.value as DeliveryMethod
                    )
                  }
                  className="w-full rounded-xl bg-gray-50 px-4 py-3 text-sm font-medium outline-none transition focus:bg-gray-100"
                >
                  {deliveryMethodOptions.map(
                    (method) => (
                      <option
                        key={method}
                        value={method}
                      >
                        {method === "standard"
                          ? "Standard Delivery"
                          : "Express Delivery"}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>
          </section>

          {/* Shipping Address */}
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                <MapPin size={19} />
              </div>

              <div>
                <h2 className="text-base font-semibold">
                  Shipping Address
                </h2>

                <p className="text-sm text-gray-500">
                  Customer delivery information
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <InfoField
                label="First Name"
                value={order.shippingAddress.firstName}
              />

              <InfoField
                label="Last Name"
                value={order.shippingAddress.lastName}
              />

              <InfoField
                label="Email"
                value={order.shippingAddress.email}
              />

              <InfoField
                label="Phone"
                value={order.shippingAddress.phone}
              />

              <div className="sm:col-span-2">
                <InfoField
                  label="Address"
                  value={order.shippingAddress.address}
                />
              </div>

              <InfoField
                label="City"
                value={order.shippingAddress.city}
              />

              <InfoField
                label="Postal Code"
                value={
                  order.shippingAddress.postalCode ||
                  "—"
                }
              />
            </div>
          </section>

          {/* Products */}
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                <Package size={19} />
              </div>

              <div>
                <h2 className="text-base font-semibold">
                  Order Items
                </h2>

                <p className="text-sm text-gray-500">
                  Products included in this order
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {order.items.map((item, index) => {
                const image =
                  item.image ||
                  item.product?.images?.[0];

                return (
                  <div
                    key={`${item.product?._id || item.name}-${index}`}
                    className="flex gap-4 rounded-xl bg-gray-50 p-4"
                  >
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-200">
                      {image ? (
                        <img
                          src={image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-400">
                          <Package size={22} />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-semibold">
                        {item.name}
                      </h3>

                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
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

                        <span>
                          Qty: {item.quantity}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        {formatCurrency(
                          item.price * item.quantity
                        )}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {formatCurrency(item.price)} each
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right Sidebar */}
        <aside className="space-y-6">
          {/* Customer */}
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                <User size={19} />
              </div>

              <div>
                <h2 className="text-base font-semibold">
                  Customer
                </h2>

                <p className="text-xs text-gray-500">
                  Order customer
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <InfoField
                label="Name"
                value={
                  order.user?.name ||
                  `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`
                }
              />

              <InfoField
                label="Email"
                value={
                  order.user?.email ||
                  order.shippingAddress.email
                }
              />

              <InfoField
                label="Phone"
                value={order.shippingAddress.phone}
              />
            </div>
          </section>

          {/* Order Information */}
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-base font-semibold">
              Order Information
            </h2>

            <div className="space-y-4">
              <InfoRow
                icon={<CalendarDays size={17} />}
                label="Order Date"
                value={formatDate(order.createdAt)}
              />

              <InfoRow
                icon={<CreditCard size={17} />}
                label="Payment Method"
                value={
                  order.paymentMethod === "cod"
                    ? "Cash on Delivery"
                    : "Card"
                }
              />

              <InfoRow
                icon={<Package size={17} />}
                label="Delivery"
                value={
                  deliveryMethod === "express"
                    ? "Express"
                    : "Standard"
                }
              />

              <InfoRow
                icon={<Phone size={17} />}
                label="Contact"
                value={order.shippingAddress.phone}
              />
            </div>
          </section>

          {/* Price Summary */}
          <section className="rounded-2xl bg-black p-6 text-white">
            <h2 className="mb-5 text-base font-semibold">
              Price Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-white/60">
                <span>Subtotal</span>
                <span>
                  {formatCurrency(order.subtotal)}
                </span>
              </div>

              <div className="flex justify-between text-white/60">
                <span>Delivery</span>
                <span>
                  {formatCurrency(order.deliveryFee)}
                </span>
              </div>

              <div className="my-4 h-px bg-white/10" />

              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>
                  {formatCurrency(order.total)}
                </span>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

interface InfoFieldProps {
  label: string;
  value: string;
}

const InfoField = ({
  label,
  value,
}: InfoFieldProps) => {
  return (
    <div>
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <div className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-800">
        {value || "—"}
      </div>
    </div>
  );
};

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const InfoRow = ({
  icon,
  label,
  value,
}: InfoRowProps) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs text-gray-400">
          {label}
        </p>

        <p className="truncate text-sm font-medium text-gray-800">
          {value}
        </p>
      </div>
    </div>
  );
};

export default EditOrder;