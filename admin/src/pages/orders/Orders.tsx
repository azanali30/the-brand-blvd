import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Package,
  RefreshCw,
  Search,
  Truck,
  XCircle,
} from "lucide-react";

import type {
  Order,
  OrderStatus,
  PaymentStatus,
} from "./types";

const API_URL = "https://the-brand-blvd.onrender.com";

const statusConfig: Record<
  OrderStatus,
  {
    label: string;
    icon: typeof Clock3;
  }
> = {
  pending: {
    label: "Pending",
    icon: Clock3,
  },
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle2,
  },
  processing: {
    label: "Processing",
    icon: Package,
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
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
    month: "short",
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
      return "bg-neutral-100 text-black border border-neutral-300";

    default:
      return "bg-white text-neutral-700 border border-neutral-300";
  }
}

function getPaymentClasses(status: PaymentStatus) {
  switch (status) {
    case "paid":
      return "bg-black text-white";

    case "failed":
      return "bg-neutral-200 text-neutral-700";

    default:
      return "bg-white text-neutral-700 border border-neutral-300";
  }
}

export default function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<
    "all" | OrderStatus
  >("all");

  const [paymentFilter, setPaymentFilter] = useState<
    "all" | PaymentStatus
  >("all");

  const fetchOrders = useCallback(
    async (isRefresh = false) => {
      try {
        setError("");

        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const response = await fetch(
  `${API_URL}/api/orders/admin/all`,
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
            data?.message || "Failed to fetch orders."
          );
        }

        const receivedOrders = Array.isArray(data)
          ? data
          : Array.isArray(data?.orders)
            ? data.orders
            : Array.isArray(data?.data)
              ? data.data
              : [];

        setOrders(receivedOrders);
      } catch (err) {
        console.error("Orders fetch error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading orders."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return orders.filter((order) => {
      const customerName =
        `${order.user?.name || ""} ${
          order.shippingAddress?.firstName || ""
        } ${order.shippingAddress?.lastName || ""}`.toLowerCase();

      const customerEmail = (
        order.user?.email ||
        order.shippingAddress?.email ||
        ""
      ).toLowerCase();

      const orderId = order._id.toLowerCase();

      const matchesSearch =
        !searchTerm ||
        orderId.includes(searchTerm) ||
        customerName.includes(searchTerm) ||
        customerEmail.includes(searchTerm);

      const matchesStatus =
        statusFilter === "all" ||
        order.orderStatus === statusFilter;

      const matchesPayment =
        paymentFilter === "all" ||
        order.paymentStatus === paymentFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPayment
      );
    });
  }, [
    orders,
    search,
    statusFilter,
    paymentFilter,
  ]);

  const stats = useMemo(() => {
    const totalRevenue = orders
      .filter(
        (order) => order.orderStatus !== "cancelled"
      )
      .reduce(
        (sum, order) => sum + order.total,
        0
      );

    const pending = orders.filter(
      (order) => order.orderStatus === "pending"
    ).length;

    const processing = orders.filter(
      (order) =>
        order.orderStatus === "confirmed" ||
        order.orderStatus === "processing"
    ).length;

    const shipped = orders.filter(
      (order) => order.orderStatus === "shipped"
    ).length;

    const delivered = orders.filter(
      (order) => order.orderStatus === "delivered"
    ).length;

    return {
      total: orders.length,
      totalRevenue,
      pending,
      processing,
      shipped,
      delivered,
    };
  }, [orders]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.25em] text-neutral-500">
            Store Management
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-black sm:text-4xl">
            Orders
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
            Manage customer orders, payments and delivery
            information from one place.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchOrders(true)}
          disabled={refreshing}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-5 text-sm font-medium text-black transition hover:border-black disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={
              refreshing ? "animate-spin" : ""
            }
          />

          Refresh
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-6">
        <div className="rounded-2xl bg-black p-5 text-white">
          <p className="text-xs uppercase tracking-[0.18em] text-neutral-400">
            Total Orders
          </p>

          <p className="mt-3 text-3xl font-semibold">
            {stats.total}
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
            Revenue
          </p>

          <p className="mt-3 text-xl font-semibold tracking-tight text-black">
            {formatCurrency(stats.totalRevenue)}
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
            Pending
          </p>

          <p className="mt-3 text-3xl font-semibold text-black">
            {stats.pending}
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
            Processing
          </p>

          <p className="mt-3 text-3xl font-semibold text-black">
            {stats.processing}
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
            Shipped
          </p>

          <p className="mt-3 text-3xl font-semibold text-black">
            {stats.shipped}
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
            Delivered
          </p>

          <p className="mt-3 text-3xl font-semibold text-black">
            {stats.delivered}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-4">
        <div className="flex flex-col gap-3 lg:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search order, customer or email..."
              className="h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50 pl-11 pr-4 text-sm text-black outline-none transition placeholder:text-neutral-400 focus:border-black focus:bg-white"
            />
          </div>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value as
                  | "all"
                  | OrderStatus
              )
            }
            className="h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-black outline-none transition focus:border-black"
          >
            <option value="all">
              All Statuses
            </option>

            <option value="pending">
              Pending
            </option>

            <option value="confirmed">
              Confirmed
            </option>

            <option value="processing">
              Processing
            </option>

            <option value="shipped">
              Shipped
            </option>

            <option value="delivered">
              Delivered
            </option>

            <option value="cancelled">
              Cancelled
            </option>
          </select>

          {/* Payment */}
          <select
            value={paymentFilter}
            onChange={(event) =>
              setPaymentFilter(
                event.target.value as
                  | "all"
                  | PaymentStatus
              )
            }
            className="h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-black outline-none transition focus:border-black"
          >
            <option value="all">
              All Payments
            </option>

            <option value="pending">
              Payment Pending
            </option>

            <option value="paid">
              Paid
            </option>

            <option value="failed">
              Failed
            </option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-neutral-200 bg-white p-5">
          <AlertCircle
            size={20}
            className="mt-0.5 shrink-0 text-black"
          />

          <div>
            <p className="text-sm font-semibold text-black">
              Unable to load orders
            </p>

            <p className="mt-1 text-sm text-neutral-500">
              {error}
            </p>

            <button
              type="button"
              onClick={() => fetchOrders()}
              className="mt-3 text-sm font-medium underline underline-offset-4"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-black">
              All Orders
            </h2>

            <p className="mt-1 text-xs text-neutral-500">
              {filteredOrders.length} order
              {filteredOrders.length !== 1
                ? "s"
                : ""}{" "}
              found
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[320px] items-center justify-center">
            <div className="flex items-center gap-3 text-sm text-neutral-500">
              <RefreshCw
                size={18}
                className="animate-spin"
              />
              Loading orders...
            </div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center px-5 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
              <Package
                size={24}
                className="text-neutral-500"
              />
            </div>

            <h3 className="mt-4 text-base font-semibold text-black">
              No orders found
            </h3>

            <p className="mt-1 max-w-md text-sm text-neutral-500">
              {search ||
              statusFilter !== "all" ||
              paymentFilter !== "all"
                ? "Try changing your search or filters."
                : "There are no orders available yet."}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-neutral-100 text-left">
                    <th className="px-5 py-4 text-xs font-medium uppercase tracking-[0.15em] text-neutral-500">
                      Order
                    </th>

                    <th className="px-5 py-4 text-xs font-medium uppercase tracking-[0.15em] text-neutral-500">
                      Customer
                    </th>

                    <th className="px-5 py-4 text-xs font-medium uppercase tracking-[0.15em] text-neutral-500">
                      Items
                    </th>

                    <th className="px-5 py-4 text-xs font-medium uppercase tracking-[0.15em] text-neutral-500">
                      Total
                    </th>

                    <th className="px-5 py-4 text-xs font-medium uppercase tracking-[0.15em] text-neutral-500">
                      Payment
                    </th>

                    <th className="px-5 py-4 text-xs font-medium uppercase tracking-[0.15em] text-neutral-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-medium uppercase tracking-[0.15em] text-neutral-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.map((order) => {
                    const StatusIcon =
                      statusConfig[
                        order.orderStatus
                      ].icon;

                    const customerName =
                      order.user?.name ||
                      `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`;

                    return (
                      <tr
                        key={order._id}
                        className="border-b border-neutral-100 last:border-b-0"
                      >
                        {/* Order */}
                        <td className="px-5 py-5">
                          <div>
                            <p className="font-mono text-sm font-medium text-black">
                              #
                              {order._id
                                .slice(-8)
                                .toUpperCase()}
                            </p>

                            <p className="mt-1 text-xs text-neutral-500">
                              {formatDate(
                                order.createdAt
                              )}
                            </p>
                          </div>
                        </td>

                        {/* Customer */}
                        <td className="px-5 py-5">
                          <p className="max-w-[180px] truncate text-sm font-medium text-black">
                            {customerName}
                          </p>

                          <p className="mt-1 max-w-[200px] truncate text-xs text-neutral-500">
                            {order.user?.email ||
                              order.shippingAddress
                                .email}
                          </p>
                        </td>

                        {/* Items */}
                        <td className="px-5 py-5">
                          <p className="text-sm font-medium text-black">
                            {order.items.length}{" "}
                            {order.items.length === 1
                              ? "item"
                              : "items"}
                          </p>

                          <p className="mt-1 text-xs text-neutral-500">
                            {order.items
                              .reduce(
                                (
                                  total,
                                  item
                                ) =>
                                  total +
                                  item.quantity,
                                0
                              )}{" "}
                            units
                          </p>
                        </td>

                        {/* Total */}
                        <td className="px-5 py-5">
                          <p className="text-sm font-semibold text-black">
                            {formatCurrency(
                              order.total
                            )}
                          </p>

                          <p className="mt-1 text-xs uppercase text-neutral-400">
                            {order.paymentMethod ===
                            "cod"
                              ? "Cash on Delivery"
                              : "Card"}
                          </p>
                        </td>

                        {/* Payment */}
                        <td className="px-5 py-5">
                          <span
                            className={`inline-flex rounded-full px-3 py-1.5 text-xs font-medium ${getPaymentClasses(
                              order.paymentStatus
                            )}`}
                          >
                            {
                              paymentConfig[
                                order.paymentStatus
                              ].label
                            }
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-5">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${getStatusClasses(
                              order.orderStatus
                            )}`}
                          >
                            <StatusIcon size={13} />

                            {
                              statusConfig[
                                order.orderStatus
                              ].label
                            }
                          </span>
                        </td>

                        <td className="px-5 py-5 text-right">
  <div className="inline-flex items-center gap-4">
    <button
      type="button"
      onClick={() =>
        navigate(`/orders/${order._id}`)
      }
      className="inline-flex items-center gap-1 text-sm font-medium text-black transition hover:gap-2"
    >
      View
      <ChevronRight size={16} />
    </button>

    <button
      type="button"
      onClick={() =>
        navigate(`/orders/${order._id}/edit`)
      }
      className="rounded-full border border-neutral-200 px-4 py-2 text-xs font-medium text-black transition hover:border-black hover:bg-black hover:text-white"
    >
      Edit
    </button>
  </div>
</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="divide-y divide-neutral-100 lg:hidden">
              {filteredOrders.map((order) => {
                const StatusIcon =
                  statusConfig[
                    order.orderStatus
                  ].icon;

                const customerName =
                  order.user?.name ||
                  `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`;

                return (
                  <div
                    key={order._id}
                    className="p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-mono text-sm font-semibold text-black">
                          #
                          {order._id
                            .slice(-8)
                            .toUpperCase()}
                        </p>

                        <p className="mt-1 text-xs text-neutral-500">
                          {formatDate(
                            order.createdAt
                          )}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
  <button
    type="button"
    onClick={() =>
      navigate(`/orders/${order._id}`)
    }
    className="inline-flex items-center gap-1 text-sm font-medium text-black"
  >
    View
    <ChevronRight size={16} />
  </button>

  <button
    type="button"
    onClick={() =>
      navigate(`/orders/${order._id}/edit`)
    }
    className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-medium text-black transition hover:border-black hover:bg-black hover:text-white"
  >
    Edit
  </button>
</div>
                    </div>

                    <div className="mt-5">
                      <p className="text-sm font-semibold text-black">
                        {customerName}
                      </p>

                      <p className="mt-1 truncate text-xs text-neutral-500">
                        {order.user?.email ||
                          order.shippingAddress.email}
                      </p>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.15em] text-neutral-400">
                          Total
                        </p>

                        <p className="mt-1 text-sm font-semibold text-black">
                          {formatCurrency(
                            order.total
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] uppercase tracking-[0.15em] text-neutral-400">
                          Items
                        </p>

                        <p className="mt-1 text-sm font-semibold text-black">
                          {order.items.reduce(
                            (total, item) =>
                              total +
                              item.quantity,
                            0
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${getStatusClasses(
                          order.orderStatus
                        )}`}
                      >
                        <StatusIcon size={13} />

                        {
                          statusConfig[
                            order.orderStatus
                          ].label
                        }
                      </span>

                      <span
                        className={`inline-flex rounded-full px-3 py-1.5 text-xs font-medium ${getPaymentClasses(
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
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}