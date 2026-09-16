import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Plus,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface Category {
  _id: string;
  name: string;
  slug: string;
  group: string;
  isActive: boolean;
}

interface ProductVariant {
  size: string;
  price: string;
  stock: string;
}

const AddProduct = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [saving, setSaving] = useState(false);

  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    isNewArrival: false,
    isFeatured: false,
    isActive: true,
  });

  const [images, setImages] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState("");

  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [variantInput, setVariantInput] = useState<ProductVariant>({
    size: "",
    price: "",
    stock: "",
  });

  const [colors, setColors] = useState<string[]>([]);
  const [colorInput, setColorInput] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://the-brand-blvd.onrender.com/api/categories"
        );

        const data = await response.json();

        if (response.ok && data.success) {
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error("Fetch categories error:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const addImage = () => {
    const value = imageInput.trim();

    if (!value) return;

    setImages((current) => [...current, value]);
    setImageInput("");
  };

  const removeImage = (index: number) => {
    setImages((current) =>
      current.filter((_, imageIndex) => imageIndex !== index)
    );
  };

  const addVariant = () => {
    const size = variantInput.size.trim().toUpperCase();
    const price = variantInput.price.trim();
    const stock = variantInput.stock.trim();

    if (!size || !price) {
      setNotification({
        type: "error",
        message: "Please enter size and price for the variant.",
      });

      return;
    }

    if (Number(price) < 0 || Number(stock || 0) < 0) {
      setNotification({
        type: "error",
        message: "Price and stock cannot be negative.",
      });

      return;
    }

    const alreadyExists = variants.some(
      (variant) => variant.size.toUpperCase() === size
    );

    if (alreadyExists) {
      setNotification({
        type: "error",
        message: `Size ${size} has already been added.`,
      });

      return;
    }

    setVariants((current) => [
      ...current,
      {
        size,
        price,
        stock: stock || "0",
      },
    ]);

    setVariantInput({
      size: "",
      price: "",
      stock: "",
    });

    setNotification(null);
  };

  const removeVariant = (size: string) => {
    setVariants((current) =>
      current.filter((variant) => variant.size !== size)
    );
  };

  const addColor = () => {
    const value = colorInput.trim();

    if (!value) return;

    const alreadyExists = colors.some(
      (color) => color.toLowerCase() === value.toLowerCase()
    );

    if (alreadyExists) return;

    setColors((current) => [...current, value]);
    setColorInput("");
  };

  const removeColor = (color: string) => {
    setColors((current) =>
      current.filter((item) => item !== color)
    );
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.description.trim() ||
      !form.category
    ) {
      setNotification({
        type: "error",
        message:
          "Please fill product name, description and category.",
      });

      return;
    }

    if (variants.length === 0) {
      setNotification({
        type: "error",
        message:
          "Please add at least one size variant with price and stock.",
      });

      return;
    }

    try {
      setSaving(true);
      setNotification(null);

      const productData = {
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        images,

        variants: variants.map((variant) => ({
          size: variant.size,
          price: Number(variant.price),
          stock: Number(variant.stock || 0),
        })),

        colors,
        isNewArrival: form.isNewArrival,
        isFeatured: form.isFeatured,
        isActive: form.isActive,
      };

      console.log("PRODUCT DATA:", productData);

      const response = await fetch(
        "http://https://the-brand-blvd.onrender.com/api/products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create product."
        );
      }

      setNotification({
        type: "success",
        message: "Product created successfully.",
      });

      setTimeout(() => {
        navigate("/products");
      }, 1200);
    } catch (error) {
      console.error("Create product error:", error);

      setNotification({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to create product.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/products"
          className="flex h-9 w-9 items-center justify-center bg-white transition-colors hover:bg-black hover:text-white"
        >
          <ArrowLeft size={17} strokeWidth={1.5} />
        </Link>

        <div>
          <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-black/40">
            Catalog
          </p>

          <h1 className="text-3xl font-light tracking-tight">
            Add Product
          </h1>
        </div>
      </div>

      <form
        noValidate
        onSubmit={handleSubmit}
        className="mt-10"
      >
        <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
          {/* Main */}
          <div className="space-y-5">
            {/* Basic Information */}
            <section className="bg-white p-6 md:p-8">
              <div className="mb-7">
                <h2 className="text-sm font-medium">
                  Basic Information
                </h2>

                <p className="mt-1 text-xs text-black/40">
                  Product name and description.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-[9px] uppercase tracking-[0.2em] text-black/50">
                    Product Name *
                  </label>

                  <input
                    type="text"
                    value={form.name}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        name: event.target.value,
                      })
                    }
                    placeholder="Premium Black Shalwar Kameez"
                    className="w-full bg-[#f7f7f7] px-4 py-3 text-sm outline-none focus:bg-[#f2f2f2]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[9px] uppercase tracking-[0.2em] text-black/50">
                    Description *
                  </label>

                  <textarea
                    value={form.description}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        description: event.target.value,
                      })
                    }
                    rows={5}
                    placeholder="Describe this product..."
                    className="w-full resize-none bg-[#f7f7f7] px-4 py-3 text-sm outline-none focus:bg-[#f2f2f2]"
                  />
                </div>
              </div>
            </section>

            {/* Images */}
            <section className="bg-white p-6 md:p-8">
              <div className="mb-7">
                <h2 className="text-sm font-medium">
                  Product Images
                </h2>

                <p className="mt-1 text-xs text-black/40">
                  Add image URLs for the product.
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  type="url"
                  value={imageInput}
                  onChange={(event) =>
                    setImageInput(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addImage();
                    }
                  }}
                  placeholder="https://..."
                  className="min-w-0 flex-1 bg-[#f7f7f7] px-4 py-3 text-sm outline-none"
                />

                <button
                  type="button"
                  onClick={addImage}
                  className="flex h-12 w-12 shrink-0 items-center justify-center bg-black text-white"
                >
                  <Plus size={18} strokeWidth={1.5} />
                </button>
              </div>

              {images.length > 0 && (
                <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {images.map((image, index) => (
                    <div
                      key={`${image}-${index}`}
                      className="group relative aspect-square overflow-hidden bg-[#f5f5f5]"
                    >
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="h-full w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center bg-white opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <X size={14} strokeWidth={1.5} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {images.length === 0 && (
                <div className="mt-5 flex h-32 items-center justify-center bg-[#f7f7f7]">
                  <div className="text-center">
                    <ImageIcon
                      size={25}
                      strokeWidth={1}
                      className="mx-auto text-black/20"
                    />

                    <p className="mt-2 text-[9px] uppercase tracking-[0.15em] text-black/30">
                      No images added
                    </p>
                  </div>
                </div>
              )}
            </section>

            {/* Variants */}
            <section className="bg-white p-6 md:p-8">
              <div className="mb-7">
                <h2 className="text-sm font-medium">
                  Variants
                </h2>

                <p className="mt-1 text-xs text-black/40">
                  Set individual price and stock for every size.
                </p>
              </div>

              {/* Add Variant */}
              <div>
                <label className="mb-2 block text-[9px] uppercase tracking-[0.2em] text-black/50">
                  Add Size Variant
                </label>

                <div className="grid gap-2 sm:grid-cols-[1fr_1fr_1fr_auto]">
                  <input
                    type="text"
                    value={variantInput.size}
                    onChange={(event) =>
                      setVariantInput({
                        ...variantInput,
                        size: event.target.value,
                      })
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addVariant();
                      }
                    }}
                    placeholder="Size e.g. M"
                    className="bg-[#f7f7f7] px-4 py-3 text-sm uppercase outline-none"
                  />

                  <input
                    type="number"
                    min="0"
                    value={variantInput.price}
                    onChange={(event) =>
                      setVariantInput({
                        ...variantInput,
                        price: event.target.value,
                      })
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addVariant();
                      }
                    }}
                    placeholder="Price PKR"
                    className="bg-[#f7f7f7] px-4 py-3 text-sm outline-none"
                  />

                  <input
                    type="number"
                    min="0"
                    value={variantInput.stock}
                    onChange={(event) =>
                      setVariantInput({
                        ...variantInput,
                        stock: event.target.value,
                      })
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addVariant();
                      }
                    }}
                    placeholder="Stock"
                    className="bg-[#f7f7f7] px-4 py-3 text-sm outline-none"
                  />

                  <button
                    type="button"
                    onClick={addVariant}
                    className="flex items-center justify-center gap-2 bg-black px-5 py-3 text-[9px] uppercase tracking-[0.15em] text-white"
                  >
                    <Plus size={14} strokeWidth={1.5} />
                    Add
                  </button>
                </div>
              </div>

              {/* Variant Table */}
              {variants.length > 0 && (
                <div className="mt-6 overflow-hidden">
                  <div className="grid grid-cols-[1fr_1fr_1fr_auto] bg-[#f7f7f7] px-4 py-3">
                    <span className="text-[9px] uppercase tracking-[0.15em] text-black/40">
                      Size
                    </span>

                    <span className="text-[9px] uppercase tracking-[0.15em] text-black/40">
                      Price
                    </span>

                    <span className="text-[9px] uppercase tracking-[0.15em] text-black/40">
                      Stock
                    </span>

                    <span />
                  </div>

                  <div>
                    {variants.map((variant) => (
                      <div
                        key={variant.size}
                        className="grid grid-cols-[1fr_1fr_1fr_auto] items-center px-4 py-4"
                      >
                        <span className="text-sm font-medium">
                          {variant.size}
                        </span>

                        <span className="text-sm">
                          PKR {Number(variant.price).toLocaleString()}
                        </span>

                        <span className="text-sm text-black/60">
                          {variant.stock}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            removeVariant(variant.size)
                          }
                          className="flex h-8 w-8 items-center justify-center text-black/40 transition-colors hover:bg-black hover:text-white"
                        >
                          <X size={14} strokeWidth={1.5} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {variants.length === 0 && (
                <div className="mt-5 bg-[#f7f7f7] px-4 py-6 text-center">
                  <p className="text-[9px] uppercase tracking-[0.15em] text-black/30">
                    No size variants added
                  </p>

                  <p className="mt-2 text-xs text-black/35">
                    Add at least one size with its price and stock.
                  </p>
                </div>
              )}

              {/* Colors */}
              <div className="mt-8">
                <label className="mb-2 block text-[9px] uppercase tracking-[0.2em] text-black/50">
                  Colors
                </label>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={colorInput}
                    onChange={(event) =>
                      setColorInput(event.target.value)
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addColor();
                      }
                    }}
                    placeholder="e.g. Black"
                    className="flex-1 bg-[#f7f7f7] px-4 py-3 text-sm outline-none"
                  />

                  <button
                    type="button"
                    onClick={addColor}
                    className="bg-black px-5 text-[9px] uppercase tracking-[0.15em] text-white"
                  >
                    Add
                  </button>
                </div>

                {colors.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => removeColor(color)}
                        className="flex items-center gap-2 bg-black px-3 py-2 text-[9px] uppercase tracking-[0.1em] text-white"
                      >
                        {color}

                        <X size={11} strokeWidth={1.5} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Pricing & Inventory */}
            <section className="bg-white p-6">
              <h2 className="text-sm font-medium">
                Pricing & Inventory
              </h2>

              <div className="mt-6">
                <div className="bg-[#f7f7f7] p-4">
                  <p className="text-[9px] uppercase tracking-[0.15em] text-black/40">
                    Variant Pricing
                  </p>

                  <p className="mt-2 text-xs leading-5 text-black/55">
                    Each size has its own price and stock.
                    Add variants in the main section.
                  </p>
                </div>

                {variants.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {variants.map((variant) => (
                      <div
                        key={variant.size}
                        className="flex items-center justify-between bg-[#f7f7f7] px-4 py-3"
                      >
                        <span className="text-xs font-medium">
                          {variant.size}
                        </span>

                        <div className="text-right">
                          <p className="text-xs">
                            PKR{" "}
                            {Number(
                              variant.price
                            ).toLocaleString()}
                          </p>

                          <p className="mt-1 text-[9px] text-black/40">
                            {variant.stock} in stock
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Category */}
            <section className="bg-white p-6">
              <h2 className="text-sm font-medium">
                Category
              </h2>

              <div className="mt-6">
                <label className="mb-2 block text-[9px] uppercase tracking-[0.2em] text-black/50">
                  Product Category *
                </label>

                <select
                  value={form.category}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      category: event.target.value,
                    })
                  }
                  disabled={loadingCategories}
                  className="w-full bg-[#f7f7f7] px-4 py-3 text-sm outline-none"
                >
                  <option value="">
                    {loadingCategories
                      ? "Loading categories..."
                      : "Select category"}
                  </option>

                  {categories
                    .filter(
                      (category) => category.isActive
                    )
                    .map((category) => (
                      <option
                        key={category._id}
                        value={category.slug}
                      >
                        {category.group} — {category.name}
                      </option>
                    ))}
                </select>

                <p className="mt-2 text-[9px] leading-4 text-black/35">
                  Products are linked using the category slug.
                </p>
              </div>
            </section>

            {/* Visibility */}
            <section className="bg-white p-6">
              <h2 className="text-sm font-medium">
                Visibility
              </h2>

              <div className="mt-6 space-y-4">
                <label className="flex cursor-pointer items-center justify-between">
                  <div>
                    <p className="text-xs">
                      Active Product
                    </p>

                    <p className="mt-1 text-[9px] text-black/35">
                      Visible in the store
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        isActive: event.target.checked,
                      })
                    }
                    className="h-4 w-4 accent-black"
                  />
                </label>

                <label className="flex cursor-pointer items-center justify-between">
                  <div>
                    <p className="text-xs">
                      New Arrival
                    </p>

                    <p className="mt-1 text-[9px] text-black/35">
                      Mark as new
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={form.isNewArrival}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        isNewArrival:
                          event.target.checked,
                      })
                    }
                    className="h-4 w-4 accent-black"
                  />
                </label>

                <label className="flex cursor-pointer items-center justify-between">
                  <div>
                    <p className="text-xs">
                      Featured
                    </p>

                    <p className="mt-1 text-[9px] text-black/35">
                      Show in featured collection
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        isFeatured:
                          event.target.checked,
                      })
                    }
                    className="h-4 w-4 accent-black"
                  />
                </label>
              </div>
            </section>

            {/* Submit */}
            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 bg-black px-6 py-4 text-[10px] font-medium uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={15} strokeWidth={1.5} />

              {saving
                ? "Creating Product..."
                : "Create Product"}
            </button>
          </div>
        </div>
      </form>

      {/* Notification */}
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
                <span>✓</span>
              ) : (
                <span>!</span>
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

export default AddProduct;