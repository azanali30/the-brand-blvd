import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Mail,
  Package,
  ShoppingBag,
  User,
} from "lucide-react";

interface Customer {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
  isActive?: boolean;
}

interface OrderItem {
  product?: string;
  name?: string;
  price?: number;
  quantity?: number;
  size?: string;
  color?: string;
  image?: string;
}

interface Order {
  _id: string;
  user?: string | {
    _id?: string;
    name?: string;
    email?: string;
  };
  items?: OrderItem[];
  totalAmount?: number;
  total?: number;
  status?: string;
  paymentStatus?: string;
  createdAt?: string;
}

const API_URL = "http://localhost:5000";

const CustomerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [customer, setCustomer] =
    useState<Customer | null>(null);

  const [orders, setOrders] = useState<Order[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // FETCH CUSTOMER + ORDERS
  // =========================================================

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      if (!id) {
        setError("Customer ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const [usersResponse, ordersResponse] =
          await Promise.all([
            fetch(`${API_URL}/api/auth/users`, {
              method: "GET",
              credentials: "include",
            }),

            fetch(`${API_URL}/api/orders/admin/all`, {
              method: "GET",
              credentials: "include",
            }),
          ]);

        const usersData =
          await usersResponse.json();

        const ordersData =
          await ordersResponse.json();

        if (
          !usersResponse.ok ||
          !usersData.success
        ) {
          throw new Error(
            usersData?.message ||
              "Failed to fetch customer."
          );
        }

        if (
          !ordersResponse.ok ||
          !ordersData.success
        ) {
          throw new Error(
            ordersData?.message ||
              "Failed to fetch orders."
          );
        }

        const users = Array.isArray(
          usersData.users
        )
          ? usersData.users
          : Array.isArray(usersData.data)
          ? usersData.data
          : [];

        const foundCustomer = users.find(
          (user: Customer) => user._id === id
        );

        if (!foundCustomer) {
          throw new Error(
            "Customer not found."
          );
        }

        setCustomer(foundCustomer);

        const allOrders = Array.isArray(
          ordersData.orders
        )
          ? ordersData.orders
          : Array.isArray(ordersData.data)
          ? ordersData.data
          : [];

        // =====================================================
        // CUSTOMER ORDERS
        // =====================================================

        const customerOrders =
          allOrders.filter((order: Order) => {
            if (typeof order.user === "string") {
              return order.user === id;
            }

            if (
              order.user &&
              typeof order.user === "object"
            ) {
              return order.user._id === id;
            }

            return false;
          });

        setOrders(customerOrders);
      } catch (error) {
        console.error(
          "Customer details error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load customer."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerDetails();
  }, [id]);

  // =========================================================
  // HELPERS
  // =========================================================

  const formatDate = (date?: string) => {
    if (!date) {
      return "—";
    }

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "—";
    }

    return parsed.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount?: number) => {
    return `PKR ${Number(
      amount || 0
    ).toLocaleString()}`;
  };

  const getInitial = (name?: string) => {
    return (
      name?.trim()?.charAt(0)?.toUpperCase() ||
      "C"
    );
  };

  const getOrderTotal = (order: Order) => {
    if (
      typeof order.totalAmount === "number"
    ) {
      return order.totalAmount;
    }

    if (typeof order.total === "number") {
      return order.total;
    }

    if (Array.isArray(order.items)) {
      return order.items.reduce(
        (total, item) =>
          total +
          Number(item.price || 0) *
            Number(item.quantity || 0),
        0
      );
    }

    return 0;
  };

  // =========================================================
  // CUSTOMER STATS
  // =========================================================

  const totalSpent = useMemo(() => {
    return orders.reduce(
      (total, order) =>
        total + getOrderTotal(order),
      0
    );
  }, [orders]);

  const completedOrders = orders.filter(
    (order) =>
      String(order.status).toLowerCase() ===
      "delivered"
  ).length;

  const pendingOrders = orders.filter(
    (order) =>
      !["delivered", "cancelled", "canceled"].includes(
        String(order.status).toLowerCase()
      )
  ).length;

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse bg-black/5" />

        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map(
            (_, index) => (
              <div
                key={index}
                className="h-28 animate-pulse bg-white"
              />
            )
          )}
        </div>

        <div className="h-80 animate-pulse bg-white" />
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error || !customer) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-red-500">
          {error || "Customer not found."}
        </p>

        <Link
          to="/customers"
          className="mt-6 inline-flex items-center gap-2 bg-black px-5 py-3 text-xs font-medium uppercase tracking-[0.15em] text-white"
        >
          <ArrowLeft size={15} />
          Back to Customers
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div>
        <Link
          to="/customers"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-black/45 transition hover:text-black"
        >
          <ArrowLeft size={15} />
          Customers
        </Link>

        <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center bg-black text-xl font-medium text-white">
              {getInitial(customer.name)}
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-black/40">
                Customer Profile
              </p>

              <h1 className="mt-1 text-3xl font-medium tracking-tight">
                {customer.name}
              </h1>

              <p className="mt-1 text-sm text-black/50">
                {customer.email}
              </p>
            </div>
          </div>

          {customer.isActive === false ? (
            <span className="w-fit bg-black px-4 py-2 text-[10px] font-medium uppercase tracking-[0.15em] text-white">
              Inactive
            </span>
          ) : (
            <span className="w-fit bg-[#ededed] px-4 py-2 text-[10px] font-medium uppercase tracking-[0.15em]">
              Active Customer
            </span>
          )}
        </div>
      </div>

      {/* =====================================================
          STATS
      ===================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <div className="bg-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-black/40">
                Total Orders
              </p>

              <p className="mt-3 text-3xl font-medium">
                {orders.length}
              </p>
            </div>

            <ShoppingBag
              size={20}
              strokeWidth={1.4}
            />
          </div>
        </div>

        <div className="bg-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-black/40">
                Completed
              </p>

              <p className="mt-3 text-3xl font-medium">
                {completedOrders}
              </p>
            </div>

            <Package
              size={20}
              strokeWidth={1.4}
            />
          </div>
        </div>

        <div className="bg-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-black/40">
                Pending
              </p>

              <p className="mt-3 text-3xl font-medium">
                {pendingOrders}
              </p>
            </div>

            <Package
              size={20}
              strokeWidth={1.4}
            />
          </div>
        </div>

        <div className="bg-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-black/40">
                Total Spent
              </p>

              <p className="mt-3 text-xl font-medium">
                {formatCurrency(totalSpent)}
              </p>
            </div>

            <ShoppingBag
              size={20}
              strokeWidth={1.4}
            />
          </div>
        </div>
      </div>

      {/* =====================================================
          CUSTOMER INFORMATION
      ===================================================== */}

      <section className="bg-white p-6 md:p-8">
        <div className="mb-7">
          <p className="text-xs uppercase tracking-[0.2em] text-black/40">
            Account
          </p>

          <h2 className="mt-2 text-xl font-medium">
            Customer Information
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">

          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center bg-[#f5f5f5]">
              <User
                size={17}
                strokeWidth={1.5}
              />
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.15em] text-black/35">
                Full Name
              </p>

              <p className="mt-1 text-sm">
                {customer.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center bg-[#f5f5f5]">
              <Mail
                size={17}
                strokeWidth={1.5}
              />
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.15em] text-black/35">
                Email Address
              </p>

              <p className="mt-1 text-sm">
                {customer.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center bg-[#f5f5f5]">
              <CalendarDays
                size={17}
                strokeWidth={1.5}
              />
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.15em] text-black/35">
                Registered
              </p>

              <p className="mt-1 text-sm">
                {formatDate(
                  customer.createdAt
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center bg-[#f5f5f5]">
              <User
                size={17}
                strokeWidth={1.5}
              />
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.15em] text-black/35">
                Account Type
              </p>

              <p className="mt-1 text-sm capitalize">
                {customer.role}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          ORDER HISTORY
      ===================================================== */}

      <section className="bg-white">
        <div className="flex items-center justify-between p-6 md:p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-black/40">
              Shopping Activity
            </p>

            <h2 className="mt-2 text-xl font-medium">
              Order History
            </h2>
          </div>

          <span className="text-xs text-black/40">
            {orders.length}{" "}
            {orders.length === 1
              ? "order"
              : "orders"}
          </span>
        </div>

        {orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#fafafa] text-left">
                  <th className="px-6 py-4 text-[10px] font-medium uppercase tracking-[0.15em] text-black/40">
                    Order
                  </th>

                  <th className="px-6 py-4 text-[10px] font-medium uppercase tracking-[0.15em] text-black/40">
                    Date
                  </th>

                  <th className="px-6 py-4 text-[10px] font-medium uppercase tracking-[0.15em] text-black/40">
                    Items
                  </th>

                  <th className="px-6 py-4 text-[10px] font-medium uppercase tracking-[0.15em] text-black/40">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-[10px] font-medium uppercase tracking-[0.15em] text-black/40">
                    Total
                  </th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="transition hover:bg-[#fafafa]"
                  >
                    <td className="px-6 py-5">
                      <Link
                        to={`/orders/${order._id}`}
                        className="text-sm font-medium hover:underline"
                      >
                        #{order._id.slice(-8).toUpperCase()}
                      </Link>
                    </td>

                    <td className="px-6 py-5 text-sm text-black/55">
                      {formatDate(
                        order.createdAt
                      )}
                    </td>

                    <td className="px-6 py-5 text-sm text-black/55">
                      {order.items?.reduce(
                        (total, item) =>
                          total +
                          Number(
                            item.quantity || 0
                          ),
                        0
                      ) || 0}
                    </td>

                    <td className="px-6 py-5">
                      <span className="bg-[#f2f2f2] px-3 py-1 text-[10px] uppercase tracking-[0.12em]">
                        {order.status ||
                          "Pending"}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-right text-sm font-medium">
                      {formatCurrency(
                        getOrderTotal(order)
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-16 text-center">
            <ShoppingBag
              size={25}
              strokeWidth={1.3}
              className="mx-auto text-black/25"
            />

            <p className="mt-4 text-sm text-black/45">
              This customer has not placed any
              orders yet.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default CustomerDetails;