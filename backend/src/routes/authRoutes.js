const express = require("express");
const { signup, login, getMe, logout } = require("../controllers/authController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Auth routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authenticateToken, getMe);

module.exports = router;
