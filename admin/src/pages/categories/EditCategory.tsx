import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  Image as ImageIcon,
} from "lucide-react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

interface CategoryForm {
  name: string;
  slug: string;
  group: string;
  description: string;
  image: string;
  isActive: boolean;
}

const API_URL = "http://localhost:5000";

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<CategoryForm>({
    name: "",
    slug: "",
    group: "",
    description: "",
    image: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // =========================================================
  // FETCH CATEGORY
  // =========================================================

  useEffect(() => {
    const fetchCategory = async () => {
      if (!id) {
        setNotification({
          type: "error",
          message: "Category ID is missing.",
        });

        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const response = await fetch(
          `${API_URL}/api/categories/id/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Failed to fetch category."
          );
        }

        const category =
          data.category || data.data || data;

        setForm({
          name: category.name || "",
          slug: category.slug || "",
          group: category.group || "",
          description: category.description || "",
          image: category.image || "",
          isActive:
            typeof category.isActive === "boolean"
              ? category.isActive
              : true,
        });
      } catch (error) {
        console.error(
          "Fetch category error:",
          error
        );

        setNotification({
          type: "error",
          message:
            error instanceof Error
              ? error.message
              : "Unable to load category.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  // =========================================================
  // HANDLE CHANGE
  // =========================================================

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // =========================================================
  // HANDLE SUBMIT
  // =========================================================

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!id) {
      setNotification({
        type: "error",
        message: "Category ID is missing.",
      });

      return;
    }

    if (!form.name.trim()) {
      setNotification({
        type: "error",
        message: "Please enter a category name.",
      });

      return;
    }

    if (!form.group.trim()) {
      setNotification({
        type: "error",
        message: "Please enter a category group.",
      });

      return;
    }

    if (!form.slug.trim()) {
      setNotification({
        type: "error",
        message: "Category slug is required.",
      });

      return;
    }

    try {
      setSaving(true);
      setNotification(null);

      const response = await fetch(
        `${API_URL}/api/categories/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name.trim(),
            slug: form.slug.trim().toLowerCase(),
            group: form.group.trim(),
            description: form.description.trim(),
            image: form.image.trim(),
            isActive: form.isActive,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to update category."
        );
      }

      setNotification({
        type: "success",
        message: "Category updated successfully.",
      });

      setTimeout(() => {
        navigate("/categories");
      }, 1200);
    } catch (error) {
      console.error(
        "Update category error:",
        error
      );

      setNotification({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to update category.",
      });
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <p className="text-[10px] uppercase tracking-[0.25em] text-black/40">
          Loading Category...
        </p>
      </div>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="mx-auto max-w-4xl">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div>
        <Link
          to="/categories"
          className="mb-5 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-black/45 transition-colors hover:text-black"
        >
          <ArrowLeft
            size={14}
            strokeWidth={1.5}
          />

          Back to Categories
        </Link>

        <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-black/40">
          Catalog
        </p>

        <h1 className="text-3xl font-light tracking-tight">
          Edit Category
        </h1>

        <p className="mt-2 text-sm text-black/45">
          Update category information and appearance.
        </p>
      </div>

      {/* =====================================================
          FORM
      ===================================================== */}

      <form
        onSubmit={handleSubmit}
        className="mt-8"
      >
        {/* ===================================================
            BASIC INFORMATION
        =================================================== */}

        <section className="bg-white p-5 md:p-7">
          <div className="mb-7">
            <p className="text-[9px] uppercase tracking-[0.25em] text-black/40">
              Basic Information
            </p>

            <h2 className="mt-2 text-lg font-light">
              Category Details
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* NAME */}

            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-[9px] font-medium uppercase tracking-[0.2em] text-black/50"
              >
                Category Name *
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. 3 Piece Suits"
                className="w-full bg-[#f7f7f7] px-4 py-3 text-sm outline-none transition-all placeholder:text-black/25 focus:bg-[#f2f2f2]"
              />
            </div>

            {/* GROUP */}

            <div>
              <label
                htmlFor="group"
                className="mb-2 block text-[9px] font-medium uppercase tracking-[0.2em] text-black/50"
              >
                Group *
              </label>

              <input
                id="group"
                name="group"
                type="text"
                value={form.group}
                onChange={handleChange}
                placeholder="e.g. Clothing"
                className="w-full bg-[#f7f7f7] px-4 py-3 text-sm outline-none transition-all placeholder:text-black/25 focus:bg-[#f2f2f2]"
              />

              <p className="mt-2 text-[9px] text-black/35">
                Example: Clothing, Traditional Wear,
                Fabrics
              </p>
            </div>

            {/* SLUG */}

            <div className="md:col-span-2">
              <label
                htmlFor="slug"
                className="mb-2 block text-[9px] font-medium uppercase tracking-[0.2em] text-black/50"
              >
                Slug *
              </label>

              <div className="flex items-center bg-[#f7f7f7]">
                <span className="pl-4 text-xs text-black/30">
                  /
                </span>

                <input
                  id="slug"
                  name="slug"
                  type="text"
                  value={form.slug}
                  onChange={handleChange}
                  className="w-full bg-transparent px-2 py-3 text-sm outline-none"
                />
              </div>
            </div>

            {/* DESCRIPTION */}

            <div className="md:col-span-2">
              <label
                htmlFor="description"
                className="mb-2 block text-[9px] font-medium uppercase tracking-[0.2em] text-black/50"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                rows={5}
                value={form.description}
                onChange={handleChange}
                placeholder="Write a short description for this category..."
                className="w-full resize-none bg-[#f7f7f7] px-4 py-3 text-sm outline-none transition-all placeholder:text-black/25 focus:bg-[#f2f2f2]"
              />
            </div>
          </div>
        </section>

        {/* ===================================================
            CATEGORY IMAGE
        =================================================== */}

        <section className="mt-5 bg-white p-5 md:p-7">
          <div className="mb-7">
            <p className="text-[9px] uppercase tracking-[0.25em] text-black/40">
              Visual
            </p>

            <h2 className="mt-2 text-lg font-light">
              Category Image
            </h2>

            <p className="mt-2 text-sm text-black/45">
              Add the real image you want to use for
              this category.
            </p>
          </div>

          {/* IMAGE URL */}

          <div>
            <label
              htmlFor="image"
              className="mb-2 block text-[9px] font-medium uppercase tracking-[0.2em] text-black/50"
            >
              Image URL
            </label>

            <div className="flex items-center gap-3 bg-[#f7f7f7] px-4">
              <ImageIcon
                size={17}
                strokeWidth={1.5}
                className="shrink-0 text-black/30"
              />

              <input
                id="image"
                name="image"
                type="url"
                value={form.image}
                onChange={handleChange}
                placeholder="https://example.com/category-image.jpg"
                className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-black/25"
              />
            </div>
          </div>

          {/* IMAGE PREVIEW */}

          {form.image && (
            <div className="mt-6">
              <p className="mb-3 text-[9px] uppercase tracking-[0.2em] text-black/40">
                Preview
              </p>

              <div className="aspect-[4/5] w-52 overflow-hidden bg-[#f5f5f5]">
                <img
                  src={form.image}
                  alt={form.name || "Category preview"}
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display =
                      "none";
                  }}
                />
              </div>
            </div>
          )}
        </section>

        {/* ===================================================
            STATUS
        =================================================== */}

        <section className="mt-5 bg-white p-5 md:p-7">
          <div className="flex items-center justify-between gap-5">
            <div>
              <p className="text-[9px] uppercase tracking-[0.25em] text-black/40">
                Visibility
              </p>

              <h2 className="mt-2 text-lg font-light">
                Category Status
              </h2>

              <p className="mt-2 text-sm text-black/45">
                Active categories are visible in the
                store.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setForm((current) => ({
                  ...current,
                  isActive: !current.isActive,
                }))
              }
              className={`relative h-7 w-12 shrink-0 transition-colors ${
                form.isActive
                  ? "bg-black"
                  : "bg-black/15"
              }`}
              aria-label="Toggle category status"
            >
              <span
                className={`absolute top-1 h-5 w-5 bg-white transition-all ${
                  form.isActive
                    ? "left-6"
                    : "left-1"
                }`}
              />
            </button>
          </div>
        </section>

        {/* ===================================================
            ACTIONS
        =================================================== */}

        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            to="/categories"
            className="flex items-center justify-center bg-black/5 px-6 py-3 text-[10px] uppercase tracking-[0.2em] transition-colors hover:bg-black/10"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 bg-black px-7 py-3 text-[10px] uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Check
              size={15}
              strokeWidth={1.5}
            />

            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>
      </form>

      {/* =====================================================
          NOTIFICATION
      ===================================================== */}

      {notification && (
        <div className="fixed bottom-6 right-6 z-[200] w-[calc(100%-2rem)] max-w-sm">
          <div
            className={`flex items-start gap-4 bg-white p-5 shadow-2xl ${
              notification.type === "success"
                ? "border-l-4 border-black"
                : "border-l-4 border-red-500"
            }`}
          >
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center ${
                notification.type === "success"
                  ? "bg-black text-white"
                  : "bg-red-50 text-red-500"
              }`}
            >
              {notification.type === "success" ? (
                <Check
                  size={17}
                  strokeWidth={1.5}
                />
              ) : (
                <span className="text-sm font-medium">
                  !
                </span>
              )}
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-[0.25em] text-black/40">
                The Brand BLVD
              </p>

              <p className="mt-1 text-sm font-medium">
                {notification.type === "success"
                  ? "Success"
                  : "Something went wrong"}
              </p>

              <p className="mt-1 text-xs text-black/45">
                {notification.message}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditCategory;