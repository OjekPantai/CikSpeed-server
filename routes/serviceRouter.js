import express from "express";

import {
  createService,
  getAllService,
  getService,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";

import {
  protectedMiddleware,
  adminMiddleware,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getAllService);
router.get("/:id", getService);
router.post("/", protectedMiddleware, adminMiddleware, createService);
router.put("/:id", protectedMiddleware, adminMiddleware, updateService);
router.delete("/:id", protectedMiddleware, adminMiddleware, deleteService);

export default router;
