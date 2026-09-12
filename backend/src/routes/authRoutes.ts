import { Router } from "express";
import passport from "../config/passport";

import {
  register,
  login,
  getMe,
  updateProfile,
  logout,
  googleCallback,
  getUsers,
} from "../controllers/authController";

import { protect } from "../middleware/authMiddleware";

const router = Router();

// ========================================
// AUTH
// ========================================

// Register customer
router.post("/register", register);

// Login customer/admin
router.post("/login", login);

// Get currently logged-in user
router.get("/me", protect, getMe);

// Update currently logged-in user's profile
router.put("/profile", protect, updateProfile);

// Logout
router.post("/logout", logout);


// ========================================
// GOOGLE AUTH
// ========================================

// Start Google OAuth
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=google_auth_failed`,
  }),
  googleCallback
);


// ========================================
// USERS
// ========================================

// Get all users
router.get("/users", getUsers);


export default router;