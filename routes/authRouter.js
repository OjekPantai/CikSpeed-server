import express from "express";

import {
  register,
  login,
  getCurrentUser,
  logout,
} from "../controllers/authController.js";

import { protectedMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/me", protectedMiddleware, getCurrentUser);
router.get("/logout", protectedMiddleware, logout);

export default router;
