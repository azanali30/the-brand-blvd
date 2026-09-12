import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  MapPin,
  Package,
  Phone,
  Clock,
  RefreshCw,
  Truck,
  User,
  XCircle,
} from "lucide-react";

import type {
  Order,
  OrderStatus,
  PaymentStatus,
} from "./types";

const API_URL = "http://localhost:5000";

const statusConfig: Record<
  OrderStatus,
  {
    label: string;
  }
> = {
  pending: {
    label: "Pending",
  },
  confirmed: {
    label: "Confirmed",
  },
  processing: {
    label: "Processing",
  },
  shipped: {
    label: "Shipped",
  },
  delivered: {
    label: "Delivered",
  },
  cancelled: {
    label: "Cancelled",
  },
};

const paymentConfig: Record<
  PaymentStatus,
  {
    label: string;
  }
> = {
  pending: {
    label: "Pending",
  },
  paid: {
    label: "Paid",
  },
  failed: {
    label: "Failed",
  },
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-PK", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function getStatusClasses(status: OrderStatus) {
  switch (status) {
    case "delivered":
      return "bg-black text-white";

    case "cancelled":
      return "bg-neutral-200 text-neutral-700";

    case "shipped":
      return "bg-neutral-800 text-white";

    case "processing":
      return "bg-neutral-700 text-white";

    case "confirmed":
      return "border border-neutral-300 bg-neutral-100 text-black";

    default:
      return "border border-neutral-300 bg-white text-neutral-700";
  }
}

function getPaymentClasses(status: PaymentStatus) {
  switch (status) {
    case "paid":
      return "bg-black text-white";

    case "failed":
      return "bg-neutral-200 text-neutral-700";

    default:
      return "border border-neutral-300 bg-white text-neutral-700";
  }
}

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const [error, setError] = useState("");
  const [cancelError, setCancelError] = useState("");

  const fetchOrder = useCallback(
    async (isRefresh = false) => {
      if (!id) {
        setError("Order ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setError("");

        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const response = await fetch(
          `${API_URL}/api/orders/${id}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Failed to fetch order details."
          );
        }

        const receivedOrder =
          data?.order ||
          data?.data ||
          data;

        setOrder(receivedOrder);
      } catch (err) {
        console.error(
          "Order details fetch error:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load order details."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [id]
  );

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleCancelOrder = async () => {
    if (!id || !order) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancelError("");
      setCancelling(true);

      const response = await fetch(
        `${API_URL}/api/orders/${id}/cancel`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to cancel the order."
        );
      }

      const updatedOrder =
        data?.order ||
        data?.data ||
        data;

      if (
        updatedOrder &&
        updatedOrder._id
      ) {
        setOrder(updatedOrder);
      } else {
        await fetchOrder(true);
      }
    } catch (err) {
      console.error(
        "Cancel order error:",
        err
      );

      setCancelError(
        err instanceof Error
          ? err.message
          : "Unable to cancel this order."
      );
    } finally {
      setCancelling(false);
    }
  };

  const canCancel =
    order?.orderStatus === "pending" ||
    order?.orderStatus === "confirmed";

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-neutral-500">
          <RefreshCw
            size={18}
            className="animate-spin"
          />
          Loading order details...
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="space-y-6">
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 transition hover:text-black"
        >
          <ArrowLeft size={17} />
          Back to Orders
        </Link>

        <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-white px-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
            <Package
              size={24}
              className="text-neutral-500"
            />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-black">
            Unable to load order
          </h2>

          <p className="mt-2 max-w-md text-sm text-neutral-500">
            {error ||
              "The requested order could not be found."}
          </p>

          <button
            type="button"
            onClick={() => fetchOrder()}
            className="mt-5 inline-flex h-10 items-center gap-2 rounded-full bg-black px-5 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            <RefreshCw size={15} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const customerName =
    order.user?.name ||
    `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Link
            to="/orders"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition hover:text-black"
          >
            <ArrowLeft size={16} />
            Back to Orders
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-mono text-2xl font-semibold tracking-tight text-black sm:text-3xl">
              #
              {order._id
                .slice(-8)
                .toUpperCase()}
            </h1>

            <span
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${getStatusClasses(
                order.orderStatus
              )}`}
            >
              {statusConfig[
                order.orderStatus
              ].label}
            </span>
          </div>

          <p className="mt-2 flex items-center gap-2 text-sm text-neutral-500">
            <CalendarDays size={15} />

            {formatDate(order.createdAt)}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => fetchOrder(true)}
            disabled={refreshing}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-5 text-sm font-medium text-black transition hover:border-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />
            Refresh
          </button>

          {canCancel && (
            <button
              type="button"
              onClick={handleCancelOrder}
              disabled={cancelling}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-neutral-300 bg-white px-5 text-sm font-medium text-black transition hover:border-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              <XCircle size={16} />

              {cancelling
                ? "Cancelling..."
                : "Cancel Order"}
            </button>
          )}
        </div>
      </div>

      {/* Cancel Error */}
      {cancelError && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 text-sm text-neutral-700">
          {cancelError}
        </div>
      )}

      {/* Order Summary */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Customer */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white">
              <User size={18} />
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-neutral-400">
                Customer
              </p>

              <h2 className="mt-1 text-base font-semibold text-black">
                {customerName}
              </h2>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-neutral-400">
                Email
              </p>

              <p className="mt-1 break-all text-sm text-neutral-700">
                {order.user?.email ||
                  order.shippingAddress.email}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-neutral-400">
                Phone
              </p>

              <p className="mt-1 flex items-center gap-2 text-sm text-neutral-700">
                <Phone size={14} />
                {order.shippingAddress.phone}
              </p>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white">
              <CreditCard size={18} />
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-neutral-400">
                Payment
              </p>

              <h2 className="mt-1 text-base font-semibold text-black">
                {order.paymentMethod ===
                "cod"
                  ? "Cash on Delivery"
                  : "Card Payment"}
              </h2>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-neutral-400">
                Payment Status
              </p>

              <span
                className={`mt-2 inline-flex rounded-full px-3 py-1.5 text-xs font-medium ${getPaymentClasses(
                  order.paymentStatus
                )}`}
              >
                {
                  paymentConfig[
                    order.paymentStatus
                  ].label
                }
              </span>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-neutral-400">
                Delivery
              </p>

              <p className="mt-1 flex items-center gap-2 text-sm text-neutral-700">
                <Truck size={14} />

                {order.deliveryMethod ===
                "express"
                  ? "Express Delivery"
                  : "Standard Delivery"}
              </p>
            </div>
          </div>
        </div>

        {/* Shipping */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white">
              <MapPin size={18} />
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-neutral-400">
                Shipping
              </p>

              <h2 className="mt-1 text-base font-semibold text-black">
                Delivery Address
              </h2>
            </div>
          </div>

          <div className="mt-6 text-sm leading-6 text-neutral-700">
            <p className="font-medium text-black">
              {order.shippingAddress.firstName}{" "}
              {order.shippingAddress.lastName}
            </p>

            <p>
              {order.shippingAddress.address}
            </p>

            <p>
              {order.shippingAddress.city}
              {order.shippingAddress
                .postalCode
                ? `, ${order.shippingAddress.postalCode}`
                : ""}
            </p>

            <p className="mt-2">
              {order.shippingAddress.phone}
            </p>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <div className="border-b border-neutral-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <Package size={19} />

            <div>
              <h2 className="text-base font-semibold text-black">
                Order Items
              </h2>

              <p className="mt-1 text-xs text-neutral-500">
                {order.items.length}{" "}
                {order.items.length === 1
                  ? "product"
                  : "products"}
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-neutral-100">
          {order.items.map((item, index) => {
            const image =
              item.image ||
              item.product?.images?.[0];

            return (
              <div
                key={`${item.product?._id || item.name}-${index}`}
                className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center"
              >
                {/* Product Image */}
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                  {image ? (
                    <img
                      src={image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Package
                        size={25}
                        className="text-neutral-400"
                      />
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-black">
                    {item.name}
                  </h3>

                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-500">
                    {item.size && (
                      <span>
                        Size:{" "}
                        <strong className="font-medium text-black">
                          {item.size}
                        </strong>
                      </span>
                    )}

                    {item.color && (
                      <span>
                        Color:{" "}
                        <strong className="font-medium text-black">
                          {item.color}
                        </strong>
                      </span>
                    )}

                    <span>
                      Qty:{" "}
                      <strong className="font-medium text-black">
                        {item.quantity}
                      </strong>
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="sm:text-right">
                  <p className="text-sm font-semibold text-black">
                    {formatCurrency(
                      item.price *
                        item.quantity
                    )}
                  </p>

                  <p className="mt-1 text-xs text-neutral-500">
                    {formatCurrency(item.price)}{" "}
                    × {item.quantity}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Summary */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Status Timeline */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <h2 className="text-base font-semibold text-black">
            Order Status
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Current order progress
          </p>

          <div className="mt-6 space-y-4">
            {[
              "pending",
              "confirmed",
              "processing",
              "shipped",
              "delivered",
            ].map((status) => {
              const isCurrent =
                order.orderStatus === status;

              const statusOrder = [
                "pending",
                "confirmed",
                "processing",
                "shipped",
                "delivered",
              ];

              const currentIndex =
                statusOrder.indexOf(
                  order.orderStatus
                );

              const itemIndex =
                statusOrder.indexOf(status);

              const isCompleted =
                order.orderStatus !==
                  "cancelled" &&
                currentIndex >= itemIndex;

              return (
                <div
                  key={status}
                  className="flex items-center gap-4"
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                      isCompleted
                        ? "bg-black text-white"
                        : "bg-neutral-100 text-neutral-400"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2
                        size={17}
                      />
                    ) : (
<Clock size={17} />                    )}
                  </div>

                  <div>
                    <p
                      className={`text-sm font-medium ${
                        isCurrent
                          ? "text-black"
                          : "text-neutral-500"
                      }`}
                    >
                      {
                        statusConfig[
                          status as OrderStatus
                        ].label
                      }
                    </p>

                    {isCurrent && (
                      <p className="mt-0.5 text-xs text-neutral-400">
                        Current status
                      </p>
                    )}
                  </div>
                </div>
              );
            })}

            {order.orderStatus ===
              "cancelled" && (
              <div className="flex items-center gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-200 text-neutral-700">
                  <XCircle size={17} />
                </div>

                <div>
                  <p className="text-sm font-medium text-black">
                    Cancelled
                  </p>

                  <p className="mt-0.5 text-xs text-neutral-400">
                    This order has been cancelled
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Price Summary */}
        <div className="rounded-2xl bg-black p-6 text-white">
          <h2 className="text-base font-semibold">
            Order Summary
          </h2>

          <div className="mt-6 space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">
                Subtotal
              </span>

              <span>
                {formatCurrency(
                  order.subtotal
                )}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-neutral-400">
                Delivery
              </span>

              <span>
                {order.deliveryFee > 0
                  ? formatCurrency(
                      order.deliveryFee
                    )
                  : "Free"}
              </span>
            </div>

            <div className="border-t border-neutral-800 pt-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">
                  Total
                </span>

                <span className="text-xl font-semibold">
                  {formatCurrency(
                    order.total
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-neutral-900 p-4">
            <p className="text-xs uppercase tracking-[0.15em] text-neutral-500">
              Payment Method
            </p>

            <p className="mt-2 text-sm font-medium">
              {order.paymentMethod === "cod"
                ? "Cash on Delivery"
                : "Card Payment"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}