import express from "express";
import {
  getUsers,        // untuk catatan
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from "../controllers/UserController.js";

import {
  Register,
  LoginUser,
  Logout,
  refreshToken
} from "../controllers/LoginController.js";

import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// User endpoints
router.get("/users", verifyToken, getUsers);
router.get("/users/:id", verifyToken, getUserById);
router.post("/users", verifyToken, createUser);
router.patch("/users/:id", verifyToken, updateUser);
router.delete("/users/:id", verifyToken, deleteUser);

// Auth endpoints
router.post("/register", Register);
router.post("/login", LoginUser);
router.get("/token", refreshToken);
router.delete("/logout", Logout);

export default router;
