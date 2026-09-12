import { Router } from "express";

import {
  createProduct,
  getProducts,
  getProductById,
  getAdminProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";

const router = Router();

router.get("/", getProducts);

router.get("/admin/:id", getAdminProductById);

router.get("/:id", getProductById);

router.post("/", createProduct);

router.put("/:id", updateProduct);

router.delete("/:id", deleteProduct);

export default router;  