import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Package,
  X,
} from "lucide-react";

interface ProductVariant {
  size: string;
  price: number;
  stock: number;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  images: string[];
  variants: ProductVariant[];
  colors: string[];
  isNewArrival: boolean;
  isFeatured: boolean;
  isActive: boolean;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/products"
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error("Fetch products error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete product"
        );
      }

      setProducts((current) =>
        current.filter(
          (product) => product._id !== id
        )
      );

      setDeleteId(null);
    } catch (error) {
      console.error("Delete product error:", error);
      alert("Unable to delete product.");
    }
  };

  /*
   * Get total stock from all variants
   */
  const getTotalStock = (product: Product) => {
    if (!Array.isArray(product.variants)) {
      return 0;
    }

    return product.variants.reduce(
      (total, variant) =>
        total + Number(variant.stock || 0),
      0
    );
  };

  /*
   * Get minimum variant price
   */
  const getStartingPrice = (product: Product) => {
    if (
      !Array.isArray(product.variants) ||
      product.variants.length === 0
    ) {
      return 0;
    }

    const prices = product.variants
      .map((variant) => Number(variant.price))
      .filter((price) => !Number.isNaN(price));

    if (prices.length === 0) {
      return 0;
    }

    return Math.min(...prices);
  };

  /*
   * Get maximum variant price
   */
  const getMaximumPrice = (product: Product) => {
    if (
      !Array.isArray(product.variants) ||
      product.variants.length === 0
    ) {
      return 0;
    }

    const prices = product.variants
      .map((variant) => Number(variant.price))
      .filter((price) => !Number.isNaN(price));

    if (prices.length === 0) {
      return 0;
    }

    return Math.max(...prices);
  };

  /*
   * Get variant sizes
   */
  const getVariantSizes = (product: Product) => {
    if (!Array.isArray(product.variants)) {
      return [];
    }

    return product.variants.map(
      (variant) => variant.size
    );
  };

  /*
   * Filter products
   */
  const filteredProducts = products.filter((product) =>
    product.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  /*
   * Stats
   */
  const lowStockProducts = products.filter(
    (product) => {
      const totalStock = getTotalStock(product);

      return totalStock > 0 && totalStock <= 5;
    }
  ).length;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-black/40">
            Catalog
          </p>

          <h1 className="text-3xl font-light tracking-tight">
            Products
          </h1>

          <p className="mt-2 text-sm text-black/45">
            Manage your The Brand BLVD product catalog.
          </p>
        </div>

        <Link
          to="/products/new"
          className="flex items-center justify-center gap-2 bg-black px-5 py-3 text-[10px] font-medium uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-80"
        >
          <Plus
            size={15}
            strokeWidth={1.5}
          />

          Add Product
        </Link>
      </div>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {/* Total Products */}
        <div className="bg-white p-5">
          <p className="text-[9px] uppercase tracking-[0.2em] text-black/40">
            Total Products
          </p>

          <p className="mt-3 text-2xl font-light">
            {products.length}
          </p>
        </div>

        {/* Active */}
        <div className="bg-white p-5">
          <p className="text-[9px] uppercase tracking-[0.2em] text-black/40">
            Active
          </p>

          <p className="mt-3 text-2xl font-light">
            {
              products.filter(
                (product) => product.isActive
              ).length
            }
          </p>
        </div>

        {/* Low Stock */}
        <div className="bg-white p-5">
          <p className="text-[9px] uppercase tracking-[0.2em] text-black/40">
            Low Stock
          </p>

          <p className="mt-3 text-2xl font-light">
            {lowStockProducts}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mt-8 flex items-center gap-3 bg-white px-4 py-3">
        <Search
          size={17}
          strokeWidth={1.5}
          className="text-black/35"
        />

        <input
          type="text"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search products..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-black/30"
        />

        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="text-black/35 hover:text-black"
          >
            <X
              size={16}
              strokeWidth={1.5}
            />
          </button>
        )}
      </div>

      {/* Products */}
      <div className="mt-5 overflow-hidden bg-white">
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <p className="text-[10px] uppercase tracking-[0.25em] text-black/40">
              Loading Products...
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center">
            <Package
              size={32}
              strokeWidth={1}
              className="text-black/20"
            />

            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-black/40">
              No Products Found
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-black/5">
                    <th className="px-6 py-4 text-left text-[9px] font-medium uppercase tracking-[0.2em] text-black/40">
                      Product
                    </th>

                    <th className="px-6 py-4 text-left text-[9px] font-medium uppercase tracking-[0.2em] text-black/40">
                      Category
                    </th>

                    <th className="px-6 py-4 text-left text-[9px] font-medium uppercase tracking-[0.2em] text-black/40">
                      Price
                    </th>

                    <th className="px-6 py-4 text-left text-[9px] font-medium uppercase tracking-[0.2em] text-black/40">
                      Variants / Stock
                    </th>

                    <th className="px-6 py-4 text-left text-[9px] font-medium uppercase tracking-[0.2em] text-black/40">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-[9px] font-medium uppercase tracking-[0.2em] text-black/40">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map(
                    (product) => {
                      const totalStock =
                        getTotalStock(product);

                      const startingPrice =
                        getStartingPrice(product);

                      const maximumPrice =
                        getMaximumPrice(product);

                      const variantSizes =
                        getVariantSizes(product);

                      return (
                        <tr
                          key={product._id}
                          className="border-b border-black/5 last:border-0"
                        >
                          {/* Product */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="h-14 w-12 shrink-0 overflow-hidden bg-[#f5f5f5]">
                                {product.images?.[0] ? (
                                  <img
                                    src={
                                      product.images[0]
                                    }
                                    alt={
                                      product.name
                                    }
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full items-center justify-center">
                                    <Package
                                      size={16}
                                      strokeWidth={
                                        1
                                      }
                                      className="text-black/20"
                                    />
                                  </div>
                                )}
                              </div>

                              <div>
                                <p className="text-xs font-medium">
                                  {product.name}
                                </p>

                                <p className="mt-1 text-[9px] text-black/35">
                                  ID:{" "}
                                  {product._id.slice(
                                    -8
                                  )}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="px-6 py-4">
                            <span className="text-[10px] uppercase tracking-[0.12em] text-black/50">
                              {product.category}
                            </span>
                          </td>

                          {/* Price */}
                          <td className="px-6 py-4">
                            {startingPrice > 0 ? (
                              <div>
                                <span className="text-xs">
                                  PKR{" "}
                                  {startingPrice.toLocaleString()}
                                </span>

                                {maximumPrice !==
                                  startingPrice && (
                                  <p className="mt-1 text-[8px] uppercase tracking-[0.1em] text-black/35">
                                    Up to PKR{" "}
                                    {maximumPrice.toLocaleString()}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <span className="text-xs text-black/30">
                                —
                              </span>
                            )}
                          </td>

                          {/* Variants / Stock */}
                          <td className="px-6 py-4">
                            <div>
                              <div className="flex flex-wrap gap-1.5">
                                {variantSizes.length >
                                0 ? (
                                  variantSizes.map(
                                    (size) => (
                                      <span
                                        key={
                                          size
                                        }
                                        className="bg-black/5 px-2 py-1 text-[8px] uppercase tracking-[0.1em]"
                                      >
                                        {size}
                                      </span>
                                    )
                                  )
                                ) : (
                                  <span className="text-[9px] text-black/30">
                                    No variants
                                  </span>
                                )}
                              </div>

                              <p
                                className={`mt-2 text-[10px] ${
                                  totalStock > 0 &&
                                  totalStock <= 5
                                    ? "text-red-500"
                                    : totalStock ===
                                      0
                                    ? "text-red-500"
                                    : "text-black/50"
                                }`}
                              >
                                {totalStock} total
                                stock
                              </p>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex px-2.5 py-1 text-[8px] uppercase tracking-[0.15em] ${
                                product.isActive
                                  ? "bg-black text-white"
                                  : "bg-black/5 text-black/40"
                              }`}
                            >
                              {product.isActive
                                ? "Active"
                                : "Inactive"}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">
                              <Link
                                to={`/products/${product._id}/edit`}
                                className="flex h-8 w-8 items-center justify-center text-black/45 transition-colors hover:bg-black hover:text-white"
                                title="Edit"
                              >
                                <Pencil
                                  size={14}
                                  strokeWidth={
                                    1.5
                                  }
                                />
                              </Link>

                              <button
                                type="button"
                                onClick={() =>
                                  setDeleteId(
                                    product._id
                                  )
                                }
                                className="flex h-8 w-8 items-center justify-center text-black/45 transition-colors hover:bg-black hover:text-white"
                                title="Delete"
                              >
                                <Trash2
                                  size={14}
                                  strokeWidth={
                                    1.5
                                  }
                                />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="divide-y divide-black/5 md:hidden">
              {filteredProducts.map(
                (product) => {
                  const totalStock =
                    getTotalStock(product);

                  const startingPrice =
                    getStartingPrice(product);

                  const maximumPrice =
                    getMaximumPrice(product);

                  const variantSizes =
                    getVariantSizes(product);

                  return (
                    <div
                      key={product._id}
                      className="p-4"
                    >
                      <div className="flex gap-4">
                        {/* Image */}
                        <div className="h-24 w-20 shrink-0 overflow-hidden bg-[#f5f5f5]">
                          {product.images?.[0] ? (
                            <img
                              src={
                                product.images[0]
                              }
                              alt={
                                product.name
                              }
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <Package
                                size={18}
                                strokeWidth={
                                  1
                                }
                                className="text-black/20"
                              />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-medium">
                            {product.name}
                          </p>

                          <p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-black/40">
                            {product.category}
                          </p>

                          {/* Price */}
                          <p className="mt-3 text-xs">
                            {startingPrice > 0
                              ? `PKR ${startingPrice.toLocaleString()}`
                              : "No price"}
                          </p>

                          {maximumPrice !==
                            startingPrice &&
                            maximumPrice > 0 && (
                              <p className="mt-1 text-[8px] uppercase tracking-[0.1em] text-black/35">
                                Up to PKR{" "}
                                {maximumPrice.toLocaleString()}
                              </p>
                            )}

                          {/* Stock */}
                          <p
                            className={`mt-2 text-[10px] ${
                              totalStock > 0 &&
                              totalStock <= 5
                                ? "text-red-500"
                                : totalStock === 0
                                ? "text-red-500"
                                : "text-black/45"
                            }`}
                          >
                            Stock:{" "}
                            {totalStock}
                          </p>
                        </div>
                      </div>

                      {/* Sizes */}
                      {variantSizes.length >
                        0 && (
                        <div className="mt-4">
                          <p className="mb-2 text-[8px] uppercase tracking-[0.15em] text-black/35">
                            Sizes
                          </p>

                          <div className="flex flex-wrap gap-1.5">
                            {variantSizes.map(
                              (size) => (
                                <span
                                  key={size}
                                  className="bg-black/5 px-2 py-1 text-[8px] uppercase tracking-[0.1em]"
                                >
                                  {size}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}

                      {/* Bottom */}
                      <div className="mt-4 flex items-center justify-between">
                        <span
                          className={`px-2.5 py-1 text-[8px] uppercase tracking-[0.15em] ${
                            product.isActive
                              ? "bg-black text-white"
                              : "bg-black/5 text-black/40"
                          }`}
                        >
                          {product.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>

                        <div className="flex gap-2">
                          <Link
                            to={`/products/${product._id}/edit`}
                            className="flex h-8 w-8 items-center justify-center bg-black/5"
                            title="Edit"
                          >
                            <Pencil
                              size={14}
                              strokeWidth={
                                1.5
                              }
                            />
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              setDeleteId(
                                product._id
                              )
                            }
                            className="flex h-8 w-8 items-center justify-center bg-black/5"
                            title="Delete"
                          >
                            <Trash2
                              size={14}
                              strokeWidth={
                                1.5
                              }
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-5">
          <div className="w-full max-w-sm bg-white p-7">
            <h2 className="text-lg font-light">
              Delete Product?
            </h2>

            <p className="mt-3 text-sm leading-6 text-black/50">
              This action will permanently remove this
              product from the catalog.
            </p>

            <div className="mt-7 flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="flex-1 bg-black/5 px-5 py-3 text-[10px] uppercase tracking-[0.2em]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() =>
                  handleDelete(deleteId)
                }
                className="flex-1 bg-black px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;