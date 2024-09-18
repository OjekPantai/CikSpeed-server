import express from "express";
import {
  createOrder,
  getOrder,
  getAllOrder,
  updateOrder,
  deleteOrder,
  currentUserOrder,
} from "../controllers/orderController.js";

import {
  adminMiddleware,
  protectedMiddleware,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getAllOrder);
router.get("/:id", protectedMiddleware, adminMiddleware, getOrder);
router.get("/current/user", protectedMiddleware, currentUserOrder);
router.post("/", protectedMiddleware, createOrder);
router.put("/:id", protectedMiddleware, adminMiddleware, updateOrder);
router.delete("/:id", protectedMiddleware, adminMiddleware, deleteOrder);

export default router;
