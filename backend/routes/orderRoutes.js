import express from "express";
import { createOrder, getOrderByNumber, getMyOrders } from "../controllers/orderController.js";
import { protect, optionalAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", optionalAuth, createOrder);
router.get("/mine/list", protect, getMyOrders);
router.get("/:orderNumber", getOrderByNumber);

export default router;
