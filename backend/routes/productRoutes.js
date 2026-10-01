import express from "express";
import {
  getProducts,
  getProductByIdOrSlug,
  createProductReview,
} from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:idOrSlug", getProductByIdOrSlug);
router.post("/:id/reviews", protect, createProductReview);

export default router;
