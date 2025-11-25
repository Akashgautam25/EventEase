const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../prisma/client");
const { JWT_SECRET } = require("../config");

const COOKIE_NAME = "token";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days
const isProduction = process.env.NODE_ENV === "production";

// Generate JWT token
const generateToken = (userId) => jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });

const isLocalhostOrigin = (origin = "") => /^(https?:\/\/)?(localhost|127\.0\.0\.1)/i.test(origin);
const isHttpsOrigin = (origin = "") => origin.startsWith("https://");

const baseCookieOptions = (origin) => {
  const isLocal = isLocalhostOrigin(origin);
  const secure = isHttpsOrigin(origin) || isProduction;

  return {
    httpOnly: true,
    secure,
    sameSite: secure ? "none" : "lax",
    path: "/",
    domain: isLocal ? undefined : undefined, // Let browser handle domain
  };
};

const authCookieOptions = (origin) => ({
  ...baseCookieOptions(origin),
  maxAge: COOKIE_MAX_AGE,
});

const setAuthCookie = (res, token, origin) => {
  res.cookie(COOKIE_NAME, token, authCookieOptions(origin));
};

// ---------- SIGN UP ----------
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check existing user
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 6);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        provider: "credentials",
      },
      select: { id: true, name: true, email: true, provider: true },
    });

    const token = generateToken(user.id);
    setAuthCookie(res, token, req.requestOrigin);

    res.status(201).json({ user, token });
  } catch (error) {
    console.error("Signup Error:", error.message);
    res.status(500).json({ 
      message: "Server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ---------- LOGIN ----------
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user.id);
    setAuthCookie(res, token, req.requestOrigin);

    res.json({
      user: { id: user.id, name: user.name, email: user.email, provider: user.provider, role: user.role },
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------- GET ME ----------
const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    res.json({ user: req.user });
  } catch (error) {
    console.error("GetMe Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------- LOGOUT ----------
const logout = (req, res) => {
  res.clearCookie(COOKIE_NAME, baseCookieOptions(req.requestOrigin));
  res.json({ message: "Logged out successfully" });
};

module.exports = { signup, login, getMe, logout };
