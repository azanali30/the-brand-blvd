import { Request, Response } from "express";
import Product from "../models/Product";

interface ProductVariantInput {
  size: string;
  price: number;
  stock: number;
}

const validateVariants = (variants: ProductVariantInput[]) => {
  if (!Array.isArray(variants) || variants.length === 0) {
    return "At least one product variant is required";
  }

  const sizes = new Set<string>();

  for (const variant of variants) {
    if (!variant.size || variant.size.trim() === "") {
      return "Each variant must have a size";
    }

    if (variant.price === undefined || Number(variant.price) < 0) {
      return `Invalid price for size ${variant.size}`;
    }

    if (variant.stock === undefined || Number(variant.stock) < 0) {
      return `Invalid stock for size ${variant.size}`;
    }

    const normalizedSize = variant.size.trim().toUpperCase();

    if (sizes.has(normalizedSize)) {
      return `Duplicate size variant: ${normalizedSize}`;
    }

    sizes.add(normalizedSize);
  }

  return null;
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      category,
      images,
      variants,
      colors,
      isNewArrival,
      isFeatured,
      isActive,
    } = req.body;

    // Basic required fields
    if (!name || !description || !category) {
      return res.status(400).json({
        success: false,
        message: "Name, description and category are required",
      });
    }

    // Validate variants
    const variantError = validateVariants(variants);

    if (variantError) {
      return res.status(400).json({
        success: false,
        message: variantError,
      });
    }

    // Normalize variants
    const normalizedVariants = variants.map(
      (variant: ProductVariantInput) => ({
        size: variant.size.trim().toUpperCase(),
        price: Number(variant.price),
        stock: Number(variant.stock),
      })
    );

    const product = await Product.create({
      name: name.trim(),
      description: description.trim(),
      category: category.trim().toLowerCase(),
      images: Array.isArray(images) ? images : [],
      variants: normalizedVariants,
      colors: Array.isArray(colors) ? colors : [],
      isNewArrival: isNewArrival ?? false,
      isFeatured: isFeatured ?? false,
      isActive: isActive ?? true,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating the product",
    });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;

    const filter: {
      isActive: boolean;
      category?: string;
    } = {
      isActive: true,
    };

    // Category filter
    if (category && typeof category === "string") {
      filter.category = category.trim().toLowerCase();
    }

    const products = await Product.find(filter).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: products.length,
      category: category || null,
      products,
    });
  } catch (error) {
    console.error("Get products error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching products",
    });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({
      _id: id,
      isActive: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get product error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the product",
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const {
      name,
      description,
      category,
      images,
      variants,
      colors,
      isNewArrival,
      isFeatured,
      isActive,
    } = req.body;

    // Validate variants if provided
    if (variants !== undefined) {
      const variantError = validateVariants(variants);

      if (variantError) {
        return res.status(400).json({
          success: false,
          message: variantError,
        });
      }
    }

    const updateData: Record<string, unknown> = {};

    if (name !== undefined) {
      updateData.name = name.trim();
    }

    if (description !== undefined) {
      updateData.description = description.trim();
    }

    if (category !== undefined) {
      updateData.category = category.trim().toLowerCase();
    }

    if (images !== undefined) {
      updateData.images = Array.isArray(images) ? images : [];
    }

    if (variants !== undefined) {
      updateData.variants = variants.map(
        (variant: ProductVariantInput) => ({
          size: variant.size.trim().toUpperCase(),
          price: Number(variant.price),
          stock: Number(variant.stock),
        })
      );
    }

    if (colors !== undefined) {
      updateData.colors = Array.isArray(colors) ? colors : [];
    }

    if (isNewArrival !== undefined) {
      updateData.isNewArrival = isNewArrival;
    }

    if (isFeatured !== undefined) {
      updateData.isFeatured = isFeatured;
    }

    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }

    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update product error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating the product",
    });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the product",
    });
  }
};

export const getAdminProductById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get admin product error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the product",
    });
  }
};