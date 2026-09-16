import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  FolderTree,
  X,
  Tag,
} from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  group: string;
  description?: string;
  image?: string;
  isActive: boolean;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://https://the-brand-blvd.onrender.com/api/categories"
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setCategories(data.categories || []);
      } else {
        console.error(
          data.message || "Failed to fetch categories"
        );
      }
    } catch (error) {
      console.error("Fetch categories error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(
        `http://https://the-brand-blvd.onrender.com/api/categories/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete category"
        );
      }

      setCategories((current) =>
        current.filter((category) => category._id !== id)
      );

      setDeleteId(null);
    } catch (error) {
      console.error("Delete category error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Unable to delete category."
      );
    }
  };

  const filteredCategories = categories.filter(
    (category) => {
      const query = search.toLowerCase();

      return (
        category.name.toLowerCase().includes(query) ||
        category.slug.toLowerCase().includes(query) ||
        category.group.toLowerCase().includes(query)
      );
    }
  );

  const activeCategories = categories.filter(
    (category) => category.isActive
  ).length;

  const groups = [
    ...new Set(
      categories
        .map((category) => category.group)
        .filter(Boolean)
    ),
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-black/40">
            Catalog
          </p>

          <h1 className="text-3xl font-light tracking-tight">
            Categories
          </h1>

          <p className="mt-2 text-sm text-black/45">
            Organize your The Brand BLVD product catalog.
          </p>
        </div>

        <Link
          to="/categories/new"
          className="flex items-center justify-center gap-2 bg-black px-5 py-3 text-[10px] font-medium uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-80"
        >
          <Plus size={15} strokeWidth={1.5} />
          Add Category
        </Link>
      </div>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="bg-white p-5">
          <p className="text-[9px] uppercase tracking-[0.2em] text-black/40">
            Total Categories
          </p>

          <p className="mt-3 text-2xl font-light">
            {categories.length}
          </p>
        </div>

        <div className="bg-white p-5">
          <p className="text-[9px] uppercase tracking-[0.2em] text-black/40">
            Active Categories
          </p>

          <p className="mt-3 text-2xl font-light">
            {activeCategories}
          </p>
        </div>

        <div className="bg-white p-5">
          <p className="text-[9px] uppercase tracking-[0.2em] text-black/40">
            Groups
          </p>

          <p className="mt-3 text-2xl font-light">
            {groups.length}
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
          placeholder="Search categories..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-black/30"
        />

        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="text-black/35 hover:text-black"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="mt-5 overflow-hidden bg-white">
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <p className="text-[10px] uppercase tracking-[0.25em] text-black/40">
              Loading Categories...
            </p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center">
            <FolderTree
              size={34}
              strokeWidth={1}
              className="text-black/20"
            />

            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-black/40">
              No Categories Found
            </p>

            <Link
              to="/categories/new"
              className="mt-5 bg-black px-5 py-3 text-[9px] uppercase tracking-[0.2em] text-white"
            >
              Add First Category
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-black/5">
                    <th className="px-6 py-4 text-left text-[9px] font-medium uppercase tracking-[0.2em] text-black/40">
                      Category
                    </th>

                    <th className="px-6 py-4 text-left text-[9px] font-medium uppercase tracking-[0.2em] text-black/40">
                      Group
                    </th>

                    <th className="px-6 py-4 text-left text-[9px] font-medium uppercase tracking-[0.2em] text-black/40">
                      Slug
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
                  {filteredCategories.map((category) => (
                    <tr
                      key={category._id}
                      className="border-b border-black/5 last:border-0"
                    >
                      {/* Category */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden bg-[#f5f5f5]">
                            {category.image ? (
                              <img
                                src={category.image}
                                alt={category.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Tag
                                size={17}
                                strokeWidth={1.2}
                                className="text-black/30"
                              />
                            )}
                          </div>

                          <div>
                            <p className="text-xs font-medium">
                              {category.name}
                            </p>

                            {category.description && (
                              <p className="mt-1 max-w-xs truncate text-[9px] text-black/35">
                                {category.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Group */}
                      <td className="px-6 py-4">
                        <span className="text-[10px] uppercase tracking-[0.12em] text-black/50">
                          {category.group || "—"}
                        </span>
                      </td>

                      {/* Slug */}
                      <td className="px-6 py-4">
                        <span className="rounded bg-black/[0.03] px-2.5 py-1.5 text-[10px] text-black/45">
                          {category.slug}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 text-[8px] uppercase tracking-[0.15em] ${
                            category.isActive
                              ? "bg-black text-white"
                              : "bg-black/5 text-black/40"
                          }`}
                        >
                          {category.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/categories/${category._id}/edit`}
                            className="flex h-8 w-8 items-center justify-center text-black/45 transition-colors hover:bg-black hover:text-white"
                            title="Edit"
                          >
                            <Pencil
                              size={14}
                              strokeWidth={1.5}
                            />
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              setDeleteId(category._id)
                            }
                            className="flex h-8 w-8 items-center justify-center text-black/45 transition-colors hover:bg-black hover:text-white"
                            title="Delete"
                          >
                            <Trash2
                              size={14}
                              strokeWidth={1.5}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="divide-y divide-black/5 md:hidden">
              {filteredCategories.map((category) => (
                <div
                  key={category._id}
                  className="p-4"
                >
                  <div className="flex gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden bg-[#f5f5f5]">
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <FolderTree
                          size={18}
                          strokeWidth={1}
                          className="text-black/25"
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium">
                        {category.name}
                      </p>

                      <p className="mt-1 text-[9px] uppercase tracking-[0.15em] text-black/40">
                        {category.group}
                      </p>

                      <p className="mt-2 truncate text-[10px] text-black/35">
                        {category.slug}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span
                      className={`px-2.5 py-1 text-[8px] uppercase tracking-[0.15em] ${
                        category.isActive
                          ? "bg-black text-white"
                          : "bg-black/5 text-black/40"
                      }`}
                    >
                      {category.isActive
                        ? "Active"
                        : "Inactive"}
                    </span>

                    <div className="flex gap-2">
                      <Link
                        to={`/categories/${category._id}/edit`}
                        className="flex h-8 w-8 items-center justify-center bg-black/5"
                      >
                        <Pencil
                          size={14}
                          strokeWidth={1.5}
                        />
                      </Link>

                      <button
                        type="button"
                        onClick={() =>
                          setDeleteId(category._id)
                        }
                        className="flex h-8 w-8 items-center justify-center bg-black/5"
                      >
                        <Trash2
                          size={14}
                          strokeWidth={1.5}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-5">
          <div className="w-full max-w-sm bg-white p-7">
            <h2 className="text-lg font-light">
              Delete Category?
            </h2>

            <p className="mt-3 text-sm leading-6 text-black/50">
              This category will be permanently removed.
              Products using this category will not be
              deleted automatically.
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
                onClick={() => handleDelete(deleteId)}
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

export default Categories;