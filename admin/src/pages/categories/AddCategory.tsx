import { useEffect, useState } from "react";
import { ArrowLeft, Check, Image } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface CategoryForm {
  name: string;
  slug: string;
  group: string;
  description: string;
  image: string;
  isActive: boolean;
}

const AddCategory = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<CategoryForm>({
    name: "",
    slug: "",
    group: "",
    description: "",
    image: "",
    isActive: true,
  });

  const [saving, setSaving] = useState(false);

  const [notification, setNotification] = useState<{
  type: "success" | "error";
  message: string;
} | null>(null);

  // Generate slug from category name
  useEffect(() => {
    const generatedSlug = form.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    setForm((current) => ({
      ...current,
      slug: generatedSlug,
    }));
  }, [form.name]);

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

  const handleSubmit = async (
  event: React.FormEvent<HTMLFormElement>
) => {
  event.preventDefault();

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
      "http://https://the-brand-blvd.onrender.com/api/categories",
      {
        method: "POST",
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
        data.message || "Failed to create category."
      );
    }

    setNotification({
      type: "success",
      message: "Category created successfully.",
    });

    setTimeout(() => {
      navigate("/categories");
    }, 1200);
  } catch (error) {
    console.error("Create category error:", error);

    setNotification({
      type: "error",
      message:
        error instanceof Error
          ? error.message
          : "Unable to create category.",
    });
  } finally {
    setSaving(false);
  }
};

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
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
            Add Category
          </h1>

          <p className="mt-2 text-sm text-black/45">
            Create a new category for your product catalog.
          </p>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="mt-8"
      >
        {/* Basic Information */}
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
            {/* Name */}
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

            {/* Group */}
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
                Example: Clothing, Traditional Wear, Fabrics
              </p>
            </div>

            {/* Slug */}
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

              <p className="mt-2 text-[9px] text-black/35">
                The slug is automatically generated from the
                category name.
              </p>
            </div>

            {/* Description */}
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

        {/* Category Image */}
        <section className="mt-5 bg-white p-5 md:p-7">
          <div className="mb-7">
            <p className="text-[9px] uppercase tracking-[0.25em] text-black/40">
              Visual
            </p>

            <h2 className="mt-2 text-lg font-light">
              Category Image
            </h2>
          </div>

          <div>
            <label
              htmlFor="image"
              className="mb-2 block text-[9px] font-medium uppercase tracking-[0.2em] text-black/50"
            >
              Image URL
            </label>

            <div className="flex items-center gap-3 bg-[#f7f7f7] px-4">
              <Image
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

          {/* Image Preview */}
          {form.image && (
            <div className="mt-5">
              <p className="mb-3 text-[9px] uppercase tracking-[0.2em] text-black/40">
                Preview
              </p>

              <div className="h-48 w-40 overflow-hidden bg-[#f5f5f5]">
                <img
                  src={form.image}
                  alt="Category preview"
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

        {/* Status */}
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
                Active categories are visible in the store
                and product forms.
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

        {/* Actions */}
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
              ? "Creating..."
              : "Create Category"}
          </button>
        </div>
      </form>

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
          <Check size={17} strokeWidth={1.5} />
        ) : (
          <span className="text-sm font-medium">!</span>
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

export default AddCategory;