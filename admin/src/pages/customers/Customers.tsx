import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Users,
  UserCheck,
  Mail,
  CalendarDays,
  Eye,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";

interface Customer {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
  isActive?: boolean;
}

const API_URL = "http://localhost:5000";

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/auth/users`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data?.message || "Failed to fetch customers."
        );
      }

      const users = Array.isArray(data.users)
        ? data.users
        : Array.isArray(data.data)
        ? data.data
        : [];

      // Only customers
      const customerUsers = users.filter(
        (user: Customer) => user.role === "customer"
      );

      setCustomers(customerUsers);
    } catch (error) {
      console.error("Fetch customers error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load customers."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return customers;
    }

    return customers.filter((customer) => {
      return (
        customer.name
          ?.toLowerCase()
          .includes(query) ||
        customer.email
          ?.toLowerCase()
          .includes(query)
      );
    });
  }, [customers, search]);

  // =========================================================
  // STATS
  // =========================================================

  const totalCustomers = customers.length;

  const activeCustomers = customers.filter(
    (customer) => customer.isActive !== false
  ).length;

  const inactiveCustomers =
    totalCustomers - activeCustomers;

  // =========================================================
  // DATE FORMAT
  // =========================================================

  const formatDate = (date?: string) => {
    if (!date) {
      return "—";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================================================
  // INITIAL
  // =========================================================

  const getInitial = (name?: string) => {
    return (
      name?.trim()?.charAt(0)?.toUpperCase() || "C"
    );
  };

  return (
    <div className="space-y-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-black/40">
            Customer Management
          </p>

          <h1 className="mt-2 text-3xl font-medium tracking-tight md:text-4xl">
            Customers
          </h1>

          <p className="mt-2 text-sm text-black/50">
            Manage your registered customers and accounts.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchCustomers}
          disabled={loading}
          className="inline-flex h-11 items-center justify-center gap-2 bg-black px-5 text-xs font-medium uppercase tracking-[0.15em] text-white transition hover:bg-black/85 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={15}
            className={loading ? "animate-spin" : ""}
            strokeWidth={1.7}
          />

          Refresh
        </button>
      </div>

      {/* =====================================================
          STATS
      ===================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

        {/* TOTAL */}
        <div className="bg-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-black/40">
                Total Customers
              </p>

              <p className="mt-3 text-3xl font-medium">
                {totalCustomers}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center bg-black text-white">
              <Users size={19} strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* ACTIVE */}
        <div className="bg-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-black/40">
                Active Customers
              </p>

              <p className="mt-3 text-3xl font-medium">
                {activeCustomers}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center bg-black text-white">
              <UserCheck
                size={19}
                strokeWidth={1.5}
              />
            </div>
          </div>
        </div>

        {/* INACTIVE */}
        <div className="bg-white p-6 sm:col-span-2 xl:col-span-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-black/40">
                Inactive Customers
              </p>

              <p className="mt-3 text-3xl font-medium">
                {inactiveCustomers}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center bg-black text-white">
              <Users size={19} strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          SEARCH
      ===================================================== */}

      <div className="bg-white p-4 md:p-5">
        <div className="relative">
          <Search
            size={17}
            strokeWidth={1.6}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-black/35"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search customers by name or email..."
            className="h-12 w-full bg-[#f7f7f7] pl-11 pr-4 text-sm outline-none transition focus:bg-[#f2f2f2]"
          />
        </div>
      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="bg-white p-10 text-center">
          <p className="text-sm text-red-500">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchCustomers}
            className="mt-5 bg-black px-5 py-3 text-xs font-medium uppercase tracking-[0.15em] text-white"
          >
            Try Again
          </button>
        </div>
      )}

      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading && !error && (
        <div className="bg-white">
          <div className="space-y-4 p-6">
            {Array.from({ length: 6 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-16 animate-pulse bg-[#f5f5f5]"
                />
              )
            )}
          </div>
        </div>
      )}

      {/* =====================================================
          DESKTOP TABLE
      ===================================================== */}

      {!loading &&
        !error &&
        filteredCustomers.length > 0 && (
          <div className="hidden overflow-hidden bg-white lg:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#fafafa] text-left">
                    <th className="px-6 py-4 text-[10px] font-medium uppercase tracking-[0.18em] text-black/40">
                      Customer
                    </th>

                    <th className="px-6 py-4 text-[10px] font-medium uppercase tracking-[0.18em] text-black/40">
                      Email
                    </th>

                    <th className="px-6 py-4 text-[10px] font-medium uppercase tracking-[0.18em] text-black/40">
                      Joined
                    </th>

                    <th className="px-6 py-4 text-[10px] font-medium uppercase tracking-[0.18em] text-black/40">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-[10px] font-medium uppercase tracking-[0.18em] text-black/40">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCustomers.map(
                    (customer) => (
                      <tr
                        key={customer._id}
                        className="group transition hover:bg-[#fafafa]"
                      >
                        {/* CUSTOMER */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-black text-sm font-medium text-white">
                              {getInitial(
                                customer.name
                              )}
                            </div>

                            <div>
                              <p className="text-sm font-medium">
                                {customer.name ||
                                  "Unnamed Customer"}
                              </p>

                              <p className="mt-1 text-xs text-black/40">
                                ID:{" "}
                                {customer._id.slice(
                                  -8
                                )}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* EMAIL */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-sm text-black/60">
                            <Mail
                              size={14}
                              strokeWidth={1.5}
                            />

                            {customer.email}
                          </div>
                        </td>

                        {/* JOINED */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-sm text-black/60">
                            <CalendarDays
                              size={14}
                              strokeWidth={1.5}
                            />

                            {formatDate(
                              customer.createdAt
                            )}
                          </div>
                        </td>

                        {/* STATUS */}
                        <td className="px-6 py-5">
                          {customer.isActive === false ? (
                            <span className="inline-flex bg-black px-3 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-white">
                              Inactive
                            </span>
                          ) : (
                            <span className="inline-flex bg-[#f2f2f2] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-black">
                              Active
                            </span>
                          )}
                        </td>

                        {/* ACTION */}
                        <td className="px-6 py-5 text-right">
                          <Link
                            to={`/customers/${customer._id}`}
                            className="inline-flex h-9 w-9 items-center justify-center bg-[#f5f5f5] text-black transition hover:bg-black hover:text-white"
                            title="View customer"
                          >
                            <Eye
                              size={16}
                              strokeWidth={1.5}
                            />
                          </Link>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      {/* =====================================================
          MOBILE / TABLET CARDS
      ===================================================== */}

      {!loading &&
        !error &&
        filteredCustomers.length > 0 && (
          <div className="grid gap-3 lg:hidden">
            {filteredCustomers.map((customer) => (
              <div
                key={customer._id}
                className="bg-white p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-black text-sm font-medium text-white">
                      {getInitial(customer.name)}
                    </div>

                    <div>
                      <h3 className="text-sm font-medium">
                        {customer.name ||
                          "Unnamed Customer"}
                      </h3>

                      <p className="mt-1 text-xs text-black/45">
                        {customer.email}
                      </p>
                    </div>
                  </div>

                  <Link
                    to={`/customers/${customer._id}`}
                    className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#f5f5f5]"
                  >
                    <Eye
                      size={16}
                      strokeWidth={1.5}
                    />
                  </Link>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-black/5 pt-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.15em] text-black/35">
                      Joined
                    </p>

                    <p className="mt-1 text-xs">
                      {formatDate(
                        customer.createdAt
                      )}
                    </p>
                  </div>

                  <div>
                    {customer.isActive === false ? (
                      <span className="bg-black px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-white">
                        Inactive
                      </span>
                    ) : (
                      <span className="bg-[#f2f2f2] px-3 py-1 text-[10px] uppercase tracking-[0.15em]">
                        Active
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      {/* =====================================================
          EMPTY
      ===================================================== */}

      {!loading &&
        !error &&
        filteredCustomers.length === 0 && (
          <div className="bg-white px-6 py-20 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center bg-[#f5f5f5]">
              <Users
                size={22}
                strokeWidth={1.4}
                className="text-black/40"
              />
            </div>

            <h3 className="mt-5 text-sm font-medium uppercase tracking-[0.12em]">
              {search
                ? "No customers found"
                : "No customers yet"}
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm text-black/45">
              {search
                ? "Try changing your search query."
                : "Registered customer accounts will appear here."}
            </p>
          </div>
        )}
    </div>
  );
};

export default Customers;