import { Router } from "express";

import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrder,
} from "../controllers/orderController";

import { protect } from "../middleware/authMiddleware";

const router = Router();

// ==========================================
// CUSTOMER
// ==========================================

// Create new order
router.post("/", protect, createOrder);

// Get logged-in user's orders
router.get("/my", protect, getMyOrders);

// Get single order
router.get("/:id", protect, getOrderById);

// Cancel own order
router.put("/:id/cancel", protect, cancelOrder);

// ==========================================
// ADMIN
// ==========================================

// Get all orders
router.get("/admin/all", protect, getAllOrders);

// Update order
router.put("/:id", protect, updateOrder);

export default router;