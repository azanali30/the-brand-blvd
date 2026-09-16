import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  Boxes,
  FolderOpen,
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

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
  isActive: boolean;
  isNewArrival: boolean;
  isFeatured: boolean;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  group: string;
  isActive: boolean;
}

interface Order {
  _id: string;
  user?: {
    _id: string;
    name: string;
    email: string;
  };
  total: number;
  orderStatus:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  paymentStatus: "pending" | "paid" | "failed";
  createdAt: string;
}

interface DashboardData {
  products: number;
  categories: number;
  orders: number;
  customers: number;
}

const API_URL = "https://the-brand-blvd.onrender.com";

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardData>({
    products: 0,
    categories: 0,
    orders: 0,
    customers: 0,
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          productsResponse,
          categoriesResponse,
          ordersResponse,
          customersResponse,
        ] = await Promise.all([
          fetch(`${API_URL}/api/products`, {
            method: "GET",
            credentials: "include",
          }),

          fetch(`${API_URL}/api/categories`, {
            method: "GET",
            credentials: "include",
          }),

          fetch(`${API_URL}/api/orders/admin/all`, {
            method: "GET",
            credentials: "include",
          }),

          fetch(`${API_URL}/api/auth/users`, {
            method: "GET",
            credentials: "include",
          }),
        ]);

        const productsData = productsResponse.ok
          ? await productsResponse.json()
          : { products: [] };

        const categoriesData = categoriesResponse.ok
          ? await categoriesResponse.json()
          : { categories: [] };

        const ordersData = ordersResponse.ok
          ? await ordersResponse.json()
          : { orders: [] };

        const customersData = customersResponse.ok
          ? await customersResponse.json()
          : { users: [] };

        // Products
        const productList = Array.isArray(
          productsData.products
        )
          ? productsData.products
          : Array.isArray(productsData.data)
          ? productsData.data
          : Array.isArray(productsData)
          ? productsData
          : [];

        // Categories
        const categoryList = Array.isArray(
          categoriesData.categories
        )
          ? categoriesData.categories
          : Array.isArray(categoriesData.data)
          ? categoriesData.data
          : Array.isArray(categoriesData)
          ? categoriesData
          : [];

        // Orders
        const orderList = Array.isArray(
          ordersData.orders
        )
          ? ordersData.orders
          : Array.isArray(ordersData.data)
          ? ordersData.data
          : Array.isArray(ordersData)
          ? ordersData
          : [];

        // Customers
        const customerList = Array.isArray(
          customersData.users
        )
          ? customersData.users
          : Array.isArray(customersData.data)
          ? customersData.data
          : Array.isArray(customersData)
          ? customersData
          : [];

        setProducts(productList);
        setCategories(categoryList);
        setOrders(orderList);

        setStats({
          products:
            productsData.count ??
            productsData.total ??
            productList.length,

          categories:
            categoriesData.count ??
            categoriesData.total ??
            categoryList.length,

          orders:
            ordersData.count ??
            ordersData.total ??
            orderList.length,

          customers:
            customersData.count ??
            customersData.total ??
            customerList.length,
        });
      } catch (error) {
        console.error(
          "Dashboard data error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  /*
   * Total stock
   */
  const totalStock = useMemo(() => {
    return products.reduce((total, product) => {
      if (!Array.isArray(product.variants)) {
        return total;
      }

      return (
        total +
        product.variants.reduce(
          (variantTotal, variant) =>
            variantTotal +
            Number(variant.stock || 0),
          0
        )
      );
    }, 0);
  }, [products]);

  /*
   * Low stock products
   */
  const lowStockProducts = useMemo(() => {
    return products.filter((product) => {
      const stock =
        product.variants?.reduce(
          (total, variant) =>
            total + Number(variant.stock || 0),
          0
        ) ?? 0;

      return stock > 0 && stock <= 5;
    });
  }, [products]);

  /*
   * Out of stock products
   */
  const outOfStockProducts = useMemo(() => {
    return products.filter((product) => {
      const stock =
        product.variants?.reduce(
          (total, variant) =>
            total + Number(variant.stock || 0),
          0
        ) ?? 0;

      return stock === 0;
    });
  }, [products]);

  /*
   * Category statistics
   */
  const categoryStats = useMemo(() => {
    return categories
      .map((category) => {
        const count = products.filter(
          (product) =>
            product.category === category.slug
        ).length;

        return {
          name: category.name,
          count,
        };
      })
      .filter(
        (category) => category.count > 0
      )
      .sort(
        (a, b) => b.count - a.count
      )
      .slice(0, 5);
  }, [categories, products]);

  const maxCategoryCount = Math.max(
    ...categoryStats.map(
      (category) => category.count
    ),
    1
  );

  /*
   * Recent products
   */
  const recentProducts = products.slice(0, 5);

  /*
   * Recent orders
   */
  const recentOrders = orders.slice(0, 5);

  /*
   * Dashboard cards
   */
  const cards = [
    {
      label: "Products",
      value: stats.products,
      icon: Boxes,
      href: "/products",
      description: "Active products",
    },
    {
      label: "Categories",
      value: stats.categories,
      icon: FolderOpen,
      href: "/categories",
      description: "Product categories",
    },
    {
      label: "Orders",
      value: stats.orders,
      icon: ShoppingBag,
      href: "/orders",
      description: "Total orders",
    },
    {
      label: "Customers",
      value: stats.customers,
      icon: Users,
      href: "/customers",
      description: "Registered customers",
    },
  ];

  /*
   * Order status styling
   */
  const getOrderStatusStyle = (
    status: Order["orderStatus"]
  ) => {
    switch (status) {
      case "delivered":
        return "text-black";

      case "cancelled":
        return "text-black/35";

      case "shipped":
        return "text-black/60";

      case "processing":
        return "text-black/60";

      case "confirmed":
        return "text-black/60";

      default:
        return "text-black/40";
    }
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-black/40">
            The Brand BLVD
          </p>

          <h1 className="text-3xl font-light tracking-tight md:text-4xl">
            Dashboard
          </h1>

          <p className="mt-3 text-sm text-black/50">
            Welcome back, Admin. Here&apos;s what&apos;s
            happening with your store.
          </p>
        </div>

        <Link
          to="/products/add"
          className="inline-flex items-center justify-center gap-2 bg-black px-5 py-3 text-[10px] uppercase tracking-[0.18em] text-white transition hover:bg-black/80"
        >
          Add Product

          <ArrowUpRight
            size={14}
            strokeWidth={1.5}
          />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <Link
              key={card.label}
              to={card.href}
              className="group bg-white p-6 transition hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-black/40">
                    {card.label}
                  </p>

                  <p className="mt-4 text-3xl font-light tracking-tight">
                    {loading
                      ? "—"
                      : card.value.toLocaleString()}
                  </p>

                  <p className="mt-2 text-[11px] text-black/40">
                    {card.description}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center bg-black text-white">
                  <Icon
                    size={17}
                    strokeWidth={1.5}
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between text-[9px] uppercase tracking-[0.15em] text-black/40">
                <span>View details</span>

                <ChevronRight
                  size={13}
                  className="transition-transform group-hover:translate-x-1"
                />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Overview + Stock */}
      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">

        {/* Store Overview */}
        <div className="bg-white p-6 md:p-7">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-black/40">
                Store Overview
              </p>

              <h2 className="mt-2 text-xl font-light">
                Inventory distribution
              </h2>
            </div>

            <TrendingUp
              size={18}
              strokeWidth={1.5}
            />
          </div>

          <div className="mt-8 space-y-5">
            {categoryStats.length > 0 ? (
              categoryStats.map((category) => {
                const percentage =
                  (category.count /
                    maxCategoryCount) *
                  100;

                return (
                  <div key={category.name}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs">
                        {category.name}
                      </span>

                      <span className="text-[10px] text-black/40">
                        {category.count} products
                      </span>
                    </div>

                    <div className="h-2 bg-black/5">
                      <div
                        className="h-full bg-black transition-all duration-700"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex h-48 items-center justify-center">
                <p className="text-xs text-black/40">
                  No category data available.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Inventory Status */}
        <div className="bg-black p-6 text-white md:p-7">
          <p className="text-[9px] uppercase tracking-[0.2em] text-white/40">
            Inventory
          </p>

          <h2 className="mt-2 text-xl font-light">
            Stock status
          </h2>

          <div className="mt-8 space-y-7">

            <div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-light">
                    {loading
                      ? "—"
                      : totalStock.toLocaleString()}
                  </p>

                  <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-white/40">
                    Total units
                  </p>
                </div>

                <Package
                  size={21}
                  strokeWidth={1.3}
                  className="text-white/60"
                />
              </div>
            </div>

            <div className="h-px bg-white/10" />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-light">
                  {lowStockProducts.length}
                </p>

                <p className="mt-1 text-[9px] uppercase tracking-[0.15em] text-white/40">
                  Low stock
                </p>
              </div>

              <AlertTriangle
                size={18}
                strokeWidth={1.4}
                className="text-white/60"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-light">
                  {outOfStockProducts.length}
                </p>

                <p className="mt-1 text-[9px] uppercase tracking-[0.15em] text-white/40">
                  Out of stock
                </p>
              </div>

              <Boxes
                size={18}
                strokeWidth={1.4}
                className="text-white/60"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-6 md:p-7">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-black/40">
              Sales
            </p>

            <h2 className="mt-2 text-xl font-light">
              Recent orders
            </h2>
          </div>

          <Link
            to="/orders"
            className="text-[9px] uppercase tracking-[0.15em] text-black/40 transition hover:text-black"
          >
            View all
          </Link>
        </div>

        <div className="mt-6 divide-y divide-black/5">
          {recentOrders.length > 0 ? (
            recentOrders.map((order) => (
              <Link
                key={order._id}
                to={`/orders/${order._id}`}
                className="flex items-center gap-4 py-4 transition hover:bg-black/[0.02]"
              >
                {/* Order Icon */}
                <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-black text-white">
                  <ShoppingBag
                    size={16}
                    strokeWidth={1.5}
                  />
                </div>

                {/* Customer */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">
                    {order.user?.name ||
                      "Guest Customer"}
                  </p>

                  <p className="mt-1 truncate text-[9px] tracking-[0.08em] text-black/40">
                    {order.user?.email ||
                      "Customer order"}
                  </p>
                </div>

                {/* Order ID */}
                <div className="hidden text-right md:block">
                  <p className="text-[10px] uppercase tracking-[0.1em] text-black/40">
                    Order
                  </p>

                  <p className="mt-1 text-xs">
                    #{order._id.slice(-6).toUpperCase()}
                  </p>
                </div>

                {/* Status */}
                <div className="text-right">
                  <p
                    className={`text-[9px] uppercase tracking-[0.1em] ${getOrderStatusStyle(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus}
                  </p>

                  <p className="mt-1 text-xs">
                    {Number(order.total || 0).toLocaleString()}{" "}
                    PKR
                  </p>
                </div>

                <ChevronRight
                  size={14}
                  className="shrink-0 text-black/20"
                />
              </Link>
            ))
          ) : (
            <div className="py-16 text-center">
              <ShoppingBag
                size={24}
                strokeWidth={1.3}
                className="mx-auto text-black/20"
              />

              <p className="mt-3 text-xs text-black/40">
                No orders found.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Products + Quick Actions */}
      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">

        {/* Recent Products */}
        <div className="bg-white p-6 md:p-7">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-black/40">
                Catalog
              </p>

              <h2 className="mt-2 text-xl font-light">
                Recent products
              </h2>
            </div>

            <Link
              to="/products"
              className="text-[9px] uppercase tracking-[0.15em] text-black/40 transition hover:text-black"
            >
              View all
            </Link>
          </div>

          <div className="mt-6 divide-y divide-black/5">
            {recentProducts.length > 0 ? (
              recentProducts.map((product) => {
                const stock =
                  product.variants?.reduce(
                    (total, variant) =>
                      total +
                      Number(
                        variant.stock || 0
                      ),
                    0
                  ) ?? 0;

                return (
                  <Link
                    key={product._id}
                    to={`/products/${product._id}/edit`}
                    className="flex items-center gap-4 py-4 transition hover:bg-black/[0.02]"
                  >
                    <div className="h-12 w-12 shrink-0 overflow-hidden bg-black/5">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Package
                            size={16}
                            className="text-black/20"
                          />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm">
                        {product.name}
                      </p>

                      <p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-black/40">
                        {product.category}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs">
                        {stock} units
                      </p>

                      <p
                        className={`mt-1 text-[9px] uppercase tracking-[0.12em] ${
                          stock === 0
                            ? "text-black"
                            : stock <= 5
                            ? "text-black/60"
                            : "text-black/30"
                        }`}
                      >
                        {stock === 0
                          ? "Out of stock"
                          : stock <= 5
                          ? "Low stock"
                          : "In stock"}
                      </p>
                    </div>

                    <ChevronRight
                      size={14}
                      className="text-black/20"
                    />
                  </Link>
                );
              })
            ) : (
              <div className="py-16 text-center">
                <p className="text-xs text-black/40">
                  No products found.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 md:p-7">
          <p className="text-[9px] uppercase tracking-[0.2em] text-black/40">
            Quick Actions
          </p>

          <h2 className="mt-2 text-xl font-light">
            Manage store
          </h2>

          <div className="mt-6 space-y-2">

            <Link
              to="/products/add"
              className="flex items-center justify-between bg-black px-5 py-4 text-white transition hover:bg-black/85"
            >
              <div>
                <p className="text-xs">
                  Add new product
                </p>

                <p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-white/40">
                  Create catalog item
                </p>
              </div>

              <ArrowUpRight
                size={16}
                strokeWidth={1.5}
              />
            </Link>

            <Link
              to="/categories/add"
              className="flex items-center justify-between bg-black/5 px-5 py-4 transition hover:bg-black/10"
            >
              <div>
                <p className="text-xs">
                  Add category
                </p>

                <p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-black/40">
                  Organize catalog
                </p>
              </div>

              <ArrowUpRight
                size={16}
                strokeWidth={1.5}
              />
            </Link>

            <Link
              to="/orders"
              className="flex items-center justify-between bg-black/5 px-5 py-4 transition hover:bg-black/10"
            >
              <div>
                <p className="text-xs">
                  Manage orders
                </p>

                <p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-black/40">
                  Review customer orders
                </p>
              </div>

              <ArrowUpRight
                size={16}
                strokeWidth={1.5}
              />
            </Link>

            <Link
              to="/customers"
              className="flex items-center justify-between bg-black/5 px-5 py-4 transition hover:bg-black/10"
            >
              <div>
                <p className="text-xs">
                  View customers
                </p>

                <p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-black/40">
                  Customer management
                </p>
              </div>

              <ArrowUpRight
                size={16}
                strokeWidth={1.5}
              />
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;