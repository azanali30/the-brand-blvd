import { Router } from "express";

import {
  getCategories,
  getCategoryBySlug,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController";

const router = Router();

// Get all categories
router.get("/", getCategories);

// Get category by ID - Admin Edit
router.get("/id/:id", getCategoryById);

// Get category by slug - Public
router.get("/slug/:slug", getCategoryBySlug);

// Create category
router.post("/", createCategory);

// Update category
router.put("/:id", updateCategory);

// Delete category
router.delete("/:id", deleteCategory);

export default router;